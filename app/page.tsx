import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Zapas } from "@/types/db";

const SPORT_LABELS: Record<string, string> = {
  fotbal: "Fotbal",
  hokej: "Hokej",
  mma: "MMA",
};

export default async function HomePage() {
  const supabase = await createClient();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const { data: dnesRows } = await supabase
    .from("zapasy")
    .select("id, sport, domaci_tym, hoste_tym, zacatek_at")
    .in("stav", ["nadchazejici", "live"])
    .gte("zacatek_at", startOfToday.toISOString())
    .lt("zacatek_at", endOfToday.toISOString())
    .order("zacatek_at", { ascending: true })
    .limit(6);

  const zapasyDnes = (dnesRows ?? []) as Zapas[];
  const zapasDne = zapasyDnes[0];
  const dalsiZapasy = zapasyDnes.slice(1, 6);

  let kurzyDne: { nazev: string; slug: string; affiliate_url_registrace: string | null; kurz_domaci: number | null; kurz_remiza: number | null; kurz_hoste: number | null }[] = [];
  if (zapasDne) {
    const { data: k } = await supabase
      .from("kurzy")
      .select("kurz_domaci, kurz_remiza, kurz_hoste, sazkovky(nazev, slug, affiliate_url_registrace)")
      .eq("zapas_id", zapasDne.id)
      .eq("typ_sazky", "1X2")
      .limit(5);
    type KurzRow = { kurz_domaci: number | null; kurz_remiza: number | null; kurz_hoste: number | null; sazkovky: { nazev: string; slug: string; affiliate_url_registrace: string | null } | null };
    const rows = (k ?? []) as (KurzRow | { sazkovky: KurzRow["sazkovky"][] })[];
    kurzyDne = rows.map((r) => {
      const s = Array.isArray((r as { sazkovky?: unknown[] }).sazkovky) ? (r as { sazkovky: KurzRow["sazkovky"][] }).sazkovky?.[0] : (r as KurzRow).sazkovky;
      return {
        nazev: s?.nazev ?? "",
        slug: s?.slug ?? "",
        affiliate_url_registrace: s?.affiliate_url_registrace ?? null,
        kurz_domaci: (r as KurzRow).kurz_domaci,
        kurz_remiza: (r as KurzRow).kurz_remiza,
        kurz_hoste: (r as KurzRow).kurz_hoste,
      };
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6">Winio</h1>
      <p className="mb-8">
        Informační web o sázkách, kurzech a licencovaných operátorech. Obsah
        pouze pro osoby 18+.
      </p>

      {zapasDne && (
        <section className="mb-8 p-5 border-2 rounded-xl bg-gray-50" aria-labelledby="zapas-dne-heading">
          <h2 id="zapas-dne-heading" className="text-lg font-semibold mb-3">
            Zápas dne
          </h2>
          <Link href={`/zapasy/${zapasDne.id}`} className="block group">
            <p className="text-xl font-medium group-hover:underline">
              {zapasDne.domaci_tym} vs {zapasDne.hoste_tym}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {SPORT_LABELS[zapasDne.sport] ?? zapasDne.sport}
              {" · "}
              {new Date(zapasDne.zacatek_at).toLocaleTimeString("cs-CZ", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </Link>
          {kurzyDne.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-500">Kurzy 1X2:</span>
              {kurzyDne.slice(0, 3).map((k) => (
                <span key={k.slug} className="text-sm">
                  {k.nazev}: {[k.kurz_domaci, k.kurz_remiza, k.kurz_hoste].filter(Boolean).join(" / ") || "–"}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/zapasy/${zapasDne.id}`}
              className="inline-block rounded border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
            >
              Kurzy a vsadit →
            </Link>
            <Link href="/zapasy?den=dnes" className="inline-block rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Všechny zápasy dnes
            </Link>
          </div>
        </section>
      )}

      {dalsiZapasy.length > 0 && (
        <section className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-medium mb-3">
            <Link href="/zapasy?den=dnes" className="hover:underline">
              Další zápasy dnes
            </Link>
          </h2>
          <ul className="space-y-2">
            {dalsiZapasy.map((z) => (
              <li key={z.id}>
                <Link href={`/zapasy/${z.id}`} className="text-sm hover:underline">
                  {z.domaci_tym} – {z.hoste_tym}
                  <span className="text-gray-500 ml-1">
                    ({SPORT_LABELS[z.sport] ?? z.sport},{" "}
                    {new Date(z.zacatek_at).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm">
            <Link href="/zapasy" className="underline">
              Všechny zápasy →
            </Link>
          </p>
        </section>
      )}

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-2">Zápasy a kurzy</h2>
          <p className="text-gray-600">
            Přehled zápasů a srovnání kurzů. Filtr podle data a sportu, na detailu
            tabulka kurzů a CTA na sázkovou kancelář.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">Sázkové kanceláře</h2>
          <p className="text-gray-600">
            Katalog licencovaných sázkových kanceláří (Blok 2, 4).
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">Online kasina a hry</h2>
          <p className="text-gray-600">
            Katalog kasin a her (Blok 2, 5).
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">Články a blog</h2>
          <p className="text-gray-600">
            Zpravodajství a články (Blok 11–12).
          </p>
        </div>
      </section>
    </div>
  );
}
