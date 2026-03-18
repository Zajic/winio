import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Zapas } from "@/types/db";

export const metadata: Metadata = {
  title: "Zápasy a kurzy | Winio",
  description:
    "Přehled zápasů a srovnání kurzů. Fotbal, hokej a další. Vsadit u licencovaných sázkových kanceláří.",
};

const SPORT_LABELS: Record<string, string> = {
  fotbal: "Fotbal",
  hokej: "Hokej",
  mma: "MMA",
  basketbal: "Basketbal",
  tenis: "Tenis",
  esport: "eSport",
};

type Props = { searchParams: Promise<{ sport?: string; den?: string; q?: string }> };

export default async function ZapasyPage({ searchParams }: Props) {
  const { sport: sportFilter, den: denFilter, q: qRaw } = await searchParams;
  const searchQ = qRaw?.trim().replace(/%/g, "").slice(0, 80) ?? "";
  const supabase = await createClient();

  let query = supabase
    .from("zapasy")
    .select("*")
    .in("stav", ["nadchazejici", "live"])
    .order("zacatek_at", { ascending: true })
    .limit(100);

  if (sportFilter) query = query.eq("sport", sportFilter);
  if (searchQ) {
    const p = `%${searchQ}%`;
    query = query.or(
      `domaci_tym.ilike.${p},hoste_tym.ilike.${p},soutez.ilike.${p}`
    );
  }

  const { data: rows, error } = await query;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">Zápasy</h1>
        <p className="text-red-600">Chyba načtení dat.</p>
      </div>
    );
  }

  const zapasy = (rows ?? []) as Zapas[];

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfTomorrow = new Date(startOfToday);
  endOfTomorrow.setDate(endOfTomorrow.getDate() + 2);

  let filtered = zapasy;
  if (denFilter === "dnes") {
    filtered = zapasy.filter((z) => {
      const t = new Date(z.zacatek_at);
      return t >= startOfToday && t < new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
    });
  } else if (denFilter === "zitra") {
    const startTomorrow = new Date(startOfToday);
    startTomorrow.setDate(startTomorrow.getDate() + 1);
    const endTomorrow = new Date(startTomorrow.getTime() + 24 * 60 * 60 * 1000);
    filtered = zapasy.filter((z) => {
      const t = new Date(z.zacatek_at);
      return t >= startTomorrow && t < endTomorrow;
    });
  }

  function hrefZapasy(o: { sport?: string; den?: string; q?: string }) {
    const p = new URLSearchParams();
    if (o.sport) p.set("sport", o.sport);
    if (o.den) p.set("den", o.den);
    if (o.q) p.set("q", o.q);
    const s = p.toString();
    return s ? `/zapasy?${s}` : "/zapasy";
  }
  const qOpt = searchQ || undefined;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-white">Zápasy a kurzy</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        Nadcházející zápasy a srovnání kurzů u licencovaných sázkových kanceláří.
      </p>
      {searchQ && (
        <p className="mt-2 text-sm text-cyan-400">
          Hledání: „{searchQ}“ ·{" "}
          <Link href="/zapasy" className="underline">
            zrušit
          </Link>
        </p>
      )}

      <div className="mb-8 mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-slate-500">Den</span>
        <Link
          href={hrefZapasy({ sport: sportFilter, q: qOpt })}
          className={`rounded-lg px-3 py-1.5 text-sm ${!denFilter ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"}`}
        >
          Vše
        </Link>
        <Link
          href={hrefZapasy({ den: "dnes", sport: sportFilter, q: qOpt })}
          className={`rounded-lg px-3 py-1.5 text-sm ${denFilter === "dnes" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"}`}
        >
          Dnes
        </Link>
        <Link
          href={hrefZapasy({ den: "zitra", sport: sportFilter, q: qOpt })}
          className={`rounded-lg px-3 py-1.5 text-sm ${denFilter === "zitra" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"}`}
        >
          Zítra
        </Link>
        <span className="ml-3 text-xs uppercase tracking-wider text-slate-500">Sport</span>
        <Link
          href={hrefZapasy({ den: denFilter, q: qOpt })}
          className={`rounded-lg px-3 py-1.5 text-sm ${!sportFilter ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"}`}
        >
          Vše
        </Link>
        {(["fotbal", "hokej", "mma", "basketbal", "tenis", "esport"] as const).map((s) => (
          <Link
            key={s}
            href={hrefZapasy({ sport: s, den: denFilter, q: qOpt })}
            className={`rounded-lg px-3 py-1.5 text-sm ${sportFilter === s ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"}`}
          >
            {SPORT_LABELS[s] ?? s}
          </Link>
        ))}
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="rounded-xl border border-winio-border bg-winio-card/50 p-6 text-slate-400">
            {searchQ
              ? "Žádný zápas neodpovídá hledání."
              : "Žádné zápasy. Spusťte cron kurzů nebo doplňte ODDS_API_KEY."}
          </li>
        ) : (
          filtered.map((z) => {
            const datum = new Date(z.zacatek_at);
            const datumStr = datum.toLocaleDateString("cs-CZ", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <li key={z.id} className="rounded-xl border border-winio-border bg-winio-card/40 transition hover:border-cyan-500/30">
                <Link href={`/zapasy/${z.id}`} className="block p-4">
                  <span className="text-xs text-cyan-500/80">
                    {SPORT_LABELS[z.sport] ?? z.sport}
                    {z.soutez ? ` · ${z.soutez}` : ""}
                  </span>
                  <p className="mt-1 font-medium text-white">
                    {z.domaci_tym} – {z.hoste_tym}
                  </p>
                  <p className="text-sm text-slate-500">{datumStr}</p>
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
