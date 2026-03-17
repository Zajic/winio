import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PripomenoutZapasButton } from "@/components/PripomenoutZapasButton";
import { JsonLd } from "@/components/JsonLd";
import { ShareButtons } from "@/components/ShareButtons";
import type { Zapas, Kurz, Sazkovka } from "@/types/db";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://winio.cz";

const SPORT_LABELS: Record<string, string> = {
  fotbal: "Fotbal",
  hokej: "Hokej",
  mma: "MMA",
};

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("zapasy")
    .select("domaci_tym, hoste_tym, sport, seo_preview")
    .eq("id", id)
    .single();

  if (!data) return { title: "Zápas | Winio" };
  const z = data as Zapas;
  const title = `${z.domaci_tym} vs ${z.hoste_tym} | Zápasy | Winio`;
  const description =
    z.seo_preview ??
    `Kurzy na zápas ${z.domaci_tym} – ${z.hoste_tym}. Srovnání kurzů a odkaz na sázkovou kancelář.`;
  return { title, description };
}

export default async function ZapasDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: zapas, error: errZapas } = await supabase
    .from("zapasy")
    .select("*")
    .eq("id", id)
    .single();

  if (errZapas || !zapas) notFound();
  const z = zapas as Zapas;

  const { data: kurzyRows } = await supabase
    .from("kurzy")
    .select("*, sazkovky(id, nazev, slug, affiliate_url_registrace)")
    .eq("zapas_id", id)
    .eq("typ_sazky", "1X2");

  const kurzy = (kurzyRows ?? []) as (Kurz & { sazkovky: Sazkovka | null })[];

  const datum = new Date(z.zacatek_at);
  const datumStr = datum.toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${z.domaci_tym} vs ${z.hoste_tym}`,
    startDate: z.zacatek_at,
    description: z.seo_preview ?? undefined,
    url: `${BASE_URL}/zapasy/${z.id}`,
  };
  const shareTitle = `${z.domaci_tym} vs ${z.hoste_tym} | Zápasy | Winio`;
  const shareUrl = `${BASE_URL}/zapasy/${z.id}`;

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <JsonLd data={eventJsonLd} />
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/zapasy" className="hover:underline">
          Zápasy
        </Link>
        <span className="mx-1">/</span>
        <span>
          {z.domaci_tym} – {z.hoste_tym}
        </span>
      </nav>

      <h1 className="text-2xl font-semibold mb-1">
        {z.domaci_tym} vs {z.hoste_tym}
      </h1>
      <p className="text-sm text-gray-500 mb-2">
        {SPORT_LABELS[z.sport] ?? z.sport}
        {z.soutez ? ` · ${z.soutez}` : ""}
      </p>
      <p className="text-sm text-gray-600 mb-6">{datumStr}</p>

      {user && z.stav !== "ukonceny" && (
        <div className="mb-6">
          <PripomenoutZapasButton zapasId={z.id} />
        </div>
      )}

      {z.seo_preview && (
        <p className="text-gray-700 mb-6">{z.seo_preview}</p>
      )}

      {z.stav === "ukonceny" && (
        <section className="mb-6 p-4 border rounded-lg bg-gray-50" aria-labelledby="jak-to-dopadlo">
          <h2 id="jak-to-dopadlo" className="text-lg font-medium mb-2">
            Jak to dopadlo
          </h2>
          {z.vysledek ? (
            <p className="text-xl font-semibold text-gray-800 mb-3">{z.vysledek}</p>
          ) : (
            <p className="text-gray-600 mb-3">Výsledek zatím není k dispozici.</p>
          )}
          <Link
            href="/zapasy"
            className="inline-block rounded border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
          >
            Vsadit na další zápas
          </Link>
        </section>
      )}

      <section>
        <h2 className="text-lg font-medium mb-3">Kurzy (1X2)</h2>
        {kurzy.length === 0 ? (
          <p className="text-gray-600 text-sm">
            Zatím žádné kurzy. Spusťte načtení z Odds API (cron).
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Sázková kancelář</th>
                  <th className="border border-gray-300 p-2 text-right">Domácí</th>
                  <th className="border border-gray-300 p-2 text-right">Remíza</th>
                  <th className="border border-gray-300 p-2 text-right">Hosté</th>
                  <th className="border border-gray-300 p-2 text-left">Akce</th>
                </tr>
              </thead>
              <tbody>
                {kurzy.map((k) => {
                  const s = k.sazkovky;
                  return (
                    <tr key={k.id} className="border-b border-gray-300">
                      <td className="border border-gray-300 p-2">
                        {s ? (
                          <Link
                            href={`/sazkovky/${s.slug}`}
                            className="hover:underline"
                          >
                            {s.nazev}
                          </Link>
                        ) : (
                          "–"
                        )}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {k.kurz_domaci ?? "–"}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {k.kurz_remiza ?? "–"}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {k.kurz_hoste ?? "–"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {s?.affiliate_url_registrace ? (
                          <a
                            href={s.affiliate_url_registrace}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cta="vsadit_zapas"
                            data-cta-label={s.nazev}
                            className="inline-block rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white hover:bg-gray-700"
                          >
                            Vsadit u {s.nazev}
                          </a>
                        ) : s ? (
                          <Link
                            href={`/sazkovky/${s.slug}`}
                            className="text-xs underline"
                          >
                            Detail
                          </Link>
                        ) : (
                          "–"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-6 pt-4 border-t">
        <ShareButtons title={shareTitle} url={shareUrl} />
      </div>
      <p className="mt-4 text-sm text-gray-600">
        <Link href="/zapasy" className="underline">
          ← Zpět na zápasy
        </Link>
      </p>
    </article>
  );
}
