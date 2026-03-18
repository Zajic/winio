import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ODDS_API_BASE = "https://api.the-odds-api.com/v4";

type OddsApiEvent = {
  id: string;
  sport_key: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers?: {
    key: string;
    markets: Array<{
      key: string;
      outcomes: Array<{ name: string; price: number }>;
    }>;
  }[];
};

type ScoresApiEvent = {
  id: string;
  sport_key: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  completed: boolean;
  scores: Array<{ name: string; score: string }> | null;
};

function formatVysledek(ev: ScoresApiEvent): string {
  if (!ev.scores || ev.scores.length < 2) return "";
  const home = ev.scores.find((s) => s.name === ev.home_team)?.score;
  const away = ev.scores.find((s) => s.name === ev.away_team)?.score;
  if (home != null && away != null) return `${home} : ${away}`;
  return ev.scores.map((s) => s.score).join(" : ");
}

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (request.headers.get("x-vercel-cron") === "1") return true;
  return false;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "ODDS_API_KEY chybí" },
      { status: 200 }
    );
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json(
      { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY chybí" },
      { status: 503 }
    );
  }

  // Klíče z https://api.the-odds-api.com/v4/sports/?apiKey=… (in-season sporty).
  // Fotbal: víc lig = víc zápasů. MMA: mma_mixed_martial_arts (UFC apod.).
  const sports =
    process.env.ODDS_API_SPORTS?.split(",").map((s) => s.trim()).filter(Boolean) ?? [
      "icehockey_nhl",
      "soccer_epl",
      "soccer_germany_bundesliga",
      "soccer_spain_la_liga",
      "soccer_uefa_champs_league",
      "mma_mixed_martial_arts",
    ];

  try {
    const { data: sazkovky } = await supabase
      .from("sazkovky")
      .select("id, external_id")
      .not("external_id", "is", null)
      .eq("aktivni", true);

    const externalToId = new Map<string, string>();
    for (const s of sazkovky ?? []) {
      if (s.external_id) externalToId.set(s.external_id.toLowerCase(), s.id);
    }

    let totalZapasy = 0;
    let totalKurzy = 0;

    for (const sportKey of sports) {
      const url = `${ODDS_API_BASE}/sports/${sportKey}/odds?regions=eu&markets=h2h&apiKey=${apiKey}`;
      const res = await fetch(url);

      if (!res.ok) {
        console.error(`Odds API ${sportKey}: ${res.status}`);
        continue;
      }

      const events: OddsApiEvent[] = await res.json();
      const remaining = res.headers.get("x-requests-remaining");
      if (remaining) console.log(`Odds API remaining: ${remaining}`);

      const sportLabel =
        sportKey.startsWith("soccer")
          ? "fotbal"
          : sportKey.startsWith("icehockey")
            ? "hokej"
            : sportKey.startsWith("basketball")
              ? "basketbal"
              : sportKey.startsWith("tennis")
                ? "tenis"
                : sportKey.startsWith("esports")
                  ? "esport"
                  : sportKey.startsWith("mma")
                    ? "mma"
                    : sportKey;

      for (const ev of events) {
        const { data: zapasRow, error: errZapas } = await supabase
          .from("zapasy")
          .upsert(
            {
              external_id: ev.id,
              sport: sportLabel,
              soutez: ev.sport_key ?? null,
              domaci_tym: ev.home_team,
              hoste_tym: ev.away_team,
              zacatek_at: ev.commence_time,
              stav: "nadchazejici",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "external_id" }
          )
          .select("id")
          .single();

        if (errZapas || !zapasRow) continue;
        totalZapasy++;
        const zapasId = zapasRow.id;

        for (const book of ev.bookmakers ?? []) {
          const sazkovkaId = externalToId.get(book.key.toLowerCase());
          if (!sazkovkaId) continue;

          const h2h = book.markets?.find((m) => m.key === "h2h");
          if (!h2h?.outcomes || h2h.outcomes.length < 2) continue;

          const home = h2h.outcomes.find((o) => o.name === ev.home_team);
          const draw = h2h.outcomes.find((o) => o.name === "Draw" || o.name === "Remíza");
          const away = h2h.outcomes.find((o) => o.name === ev.away_team);

          await supabase.from("kurzy").upsert(
            {
              zapas_id: zapasId,
              sazkovka_id: sazkovkaId,
              typ_sazky: "1X2",
              kurz_domaci: home?.price ?? null,
              kurz_remiza: draw?.price ?? null,
              kurz_hoste: away?.price ?? null,
              fetched_at: new Date().toISOString(),
            },
            {
              onConflict: "zapas_id,sazkovka_id,typ_sazky",
            }
          );
          totalKurzy++;
        }
      }
    }

    // Blok 9: načíst výsledky ukončených zápasů (Scores API, daysFrom=1)
    let totalVysledky = 0;
    for (const sportKey of sports) {
      const scoresUrl = `${ODDS_API_BASE}/sports/${sportKey}/scores?daysFrom=1&apiKey=${apiKey}`;
      const scoresRes = await fetch(scoresUrl);
      if (!scoresRes.ok) continue; // některé sporty scores nemají
      const scoreEvents: ScoresApiEvent[] = await scoresRes.json();
      for (const ev of scoreEvents) {
        if (!ev.completed || !ev.scores?.length) continue;
        const vysledek = formatVysledek(ev);
        if (!vysledek) continue;
        const { error: updErr } = await supabase
          .from("zapasy")
          .update({
            stav: "ukonceny",
            vysledek,
            updated_at: new Date().toISOString(),
          })
          .eq("external_id", ev.id);
        if (!updErr) totalVysledky++;
      }
    }

    return NextResponse.json({
      ok: true,
      zapasy: totalZapasy,
      kurzy: totalKurzy,
      vysledky: totalVysledky,
    });
  } catch (e) {
    console.error("Cron odds error:", e);
    return NextResponse.json(
      { ok: false, error: String(e) },
      { status: 500 }
    );
  }
}
