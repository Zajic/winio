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
};

type Props = { searchParams: Promise<{ sport?: string; den?: string }> };

export default async function ZapasyPage({ searchParams }: Props) {
  const { sport: sportFilter, den: denFilter } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("zapasy")
    .select("*")
    .in("stav", ["nadchazejici", "live"])
    .order("zacatek_at", { ascending: true })
    .limit(100);

  if (sportFilter) query = query.eq("sport", sportFilter);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Zápasy a kurzy</h1>
      <p className="text-gray-600 mb-6">
        Nadcházející zápasy. Klikněte na zápas pro srovnání kurzů a odkaz na
        sázkovou kancelář.
      </p>

      <div className="mb-6 flex flex-wrap gap-3">
        <span className="text-sm text-gray-600">Den:</span>
        <Link
          href={sportFilter ? `/zapasy?sport=${sportFilter}` : "/zapasy"}
          className={`text-sm px-2 py-1 rounded ${!denFilter ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Vše
        </Link>
        <Link
          href={`/zapasy?den=dnes${sportFilter ? `&sport=${sportFilter}` : ""}`}
          className={`text-sm px-2 py-1 rounded ${denFilter === "dnes" ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Dnes
        </Link>
        <Link
          href={`/zapasy?den=zitra${sportFilter ? `&sport=${sportFilter}` : ""}`}
          className={`text-sm px-2 py-1 rounded ${denFilter === "zitra" ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Zítra
        </Link>
        <span className="text-sm text-gray-600 ml-2">Sport:</span>
        <Link
          href={denFilter ? `/zapasy?den=${denFilter}` : "/zapasy"}
          className={`text-sm px-2 py-1 rounded ${!sportFilter ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Vše
        </Link>
        {["fotbal", "hokej", "mma"].map((s) => (
          <Link
            key={s}
            href={`/zapasy?sport=${s}${denFilter ? `&den=${denFilter}` : ""}`}
            className={`text-sm px-2 py-1 rounded ${sportFilter === s ? "bg-gray-200 font-medium" : "underline"}`}
          >
            {SPORT_LABELS[s] ?? s}
          </Link>
        ))}
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="text-gray-600">
            Žádné zápasy. Spusťte cron načtení kurzů (api/cron/odds) nebo doplňte
            ODDS_API_KEY.
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
              <li key={z.id} className="border rounded-lg p-4">
                <Link
                  href={`/zapasy/${z.id}`}
                  className="block hover:bg-gray-50 -m-4 p-4 rounded-lg"
                >
                  <span className="text-xs text-gray-500">
                    {SPORT_LABELS[z.sport] ?? z.sport}
                    {z.soutez ? ` · ${z.soutez}` : ""}
                  </span>
                  <p className="font-medium">
                    {z.domaci_tym} – {z.hoste_tym}
                  </p>
                  <p className="text-sm text-gray-600">{datumStr}</p>
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
