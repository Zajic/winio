import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BannerSlot } from "@/components/BannerSlot";
import { JsonLd } from "@/components/JsonLd";
import { ShareButtons } from "@/components/ShareButtons";
import type { Clanky, Sazkovka, Kasino } from "@/types/db";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://winio.cz";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("clanky")
    .select("titul, perex, typ, zdroj_url")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .single();

  if (!data) return { title: "Článek | Winio" };
  const c = data as Pick<Clanky, "titul" | "perex" | "typ" | "zdroj_url">;
  const desc =
    c.typ === "news" && c.zdroj_url
      ? `${(c.perex ?? c.titul).slice(0, 130)}… Výňatek – celý text u zdroje.`
      : (c.perex ?? c.titul).slice(0, 160);
  return {
    title: `${c.titul} | Články | Winio`,
    description: desc.slice(0, 160),
  };
}

export default async function ClanekDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: clanek, error: errClanek } = await supabase
    .from("clanky")
    .select("*")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .single();

  if (errClanek || !clanek) notFound();
  const c = clanek as Clanky;

  let sazkovka: Sazkovka | null = null;
  let kasino: Kasino | null = null;
  if (c.affiliate_cta_sazkovka_id) {
    const { data: s } = await supabase
      .from("sazkovky")
      .select("id, nazev, slug, affiliate_url_registrace")
      .eq("id", c.affiliate_cta_sazkovka_id)
      .single();
    sazkovka = s as Sazkovka | null;
  }
  if (c.affiliate_cta_kasino_id) {
    const { data: k } = await supabase
      .from("kasina")
      .select("id, nazev, slug, affiliate_url")
      .eq("id", c.affiliate_cta_kasino_id)
      .single();
    kasino = k as Kasino | null;
  }

  const hasCta = sazkovka || kasino;
  const isKurzovanaNovinka =
    c.typ === "news" && Boolean(c.zdroj_url?.trim());

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.titul,
    description: (c.perex ?? c.titul).slice(0, 160),
    datePublished: c.published_at ?? undefined,
    url: `${BASE_URL}/clanky/${c.slug}`,
    ...(isKurzovanaNovinka && c.zdroj_url
      ? {
          isBasedOn: {
            "@type": "NewsArticle",
            url: c.zdroj_url,
            name: c.zdroj_nazev ?? "Původní článek",
          },
        }
      : {}),
  };
  const publishedAt = c.published_at
    ? new Date(c.published_at).toLocaleDateString("cs-CZ", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <JsonLd data={articleJsonLd} />
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/clanky" className="hover:underline">
          Články
        </Link>
        <span className="mx-1">/</span>
        <span>{c.titul}</span>
      </nav>

      {c.je_placena_spoluprace && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-4">
          Spolupráce / Placená spolupráce
        </p>
      )}

      <h1 className="text-2xl font-semibold mb-2">{c.titul}</h1>
      {publishedAt && (
        <p className="text-sm text-gray-500 mb-6">{publishedAt}</p>
      )}

      {isKurzovanaNovinka && c.zdroj_url ? (
        <>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
            Krátký výňatek · plné znění u vydavatele
          </p>
          {c.perex ? (
            <p className="text-gray-800 text-lg leading-relaxed mb-6 border-l-4 border-gray-200 pl-4">
              {c.perex}
            </p>
          ) : (
            <p className="text-gray-600 mb-6">
              Celý článek najdete na stránkách uvedeného zdroje.
            </p>
          )}
          <aside
            className="rounded-lg border border-blue-200 bg-blue-50/80 p-5 mb-8"
            aria-label="Odkaz na původní článek"
          >
            <p className="text-sm text-gray-800 mb-4">
              Zobrazujeme jen krátký úvod z RSS. Úplné znění včetně případných
              obrázků a souvisejících textů je výhradně u{" "}
              <strong>{c.zdroj_nazev ?? "původního serveru"}</strong>.
            </p>
            <a
              href={c.zdroj_url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Přečíst celý článek na {c.zdroj_nazev ?? "zdroji"} →
            </a>
            <p className="mt-3 text-xs text-gray-600">
              <a
                href={c.zdroj_url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="underline break-all"
              >
                {c.zdroj_url}
              </a>
            </p>
          </aside>
          {c.telo && (
            <section className="mb-8" aria-label="Doplnění redakce">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Komentář / doplnění (Winio)
              </h2>
              <div
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: c.telo }}
              />
            </section>
          )}
        </>
      ) : (
        <>
          {c.perex && (
            <p className="text-gray-700 font-medium mb-6">{c.perex}</p>
          )}
          {c.telo && (
            <div
              className="prose prose-gray max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: c.telo }}
            />
          )}
        </>
      )}

      <div className="my-6">
        <BannerSlot pozice="clanek_bottom" />
      </div>

      {hasCta && (
        <section className="border rounded-lg p-4 bg-gray-50" aria-labelledby="kde-vsadit">
          <h2 id="kde-vsadit" className="text-lg font-medium mb-3">
            Kde vsadit / zahrát
          </h2>
          <ul className="space-y-2">
            {sazkovka && (
              <li>
                {sazkovka.affiliate_url_registrace ? (
                  <a
                    href={sazkovka.affiliate_url_registrace}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta="registrace_clanek"
                    data-cta-label={sazkovka.nazev}
                    className="inline-block rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Registrovat u {sazkovka.nazev}
                  </a>
                ) : (
                  <Link href={`/sazkovky/${sazkovka.slug}`} className="underline">
                    {sazkovka.nazev} – detail
                  </Link>
                )}
              </li>
            )}
            {kasino && (
              <li>
                {kasino.affiliate_url ? (
                  <a
                    href={kasino.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta="registrace_clanek_kasino"
                    data-cta-label={kasino.nazev}
                    className="inline-block rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Zahrát u {kasino.nazev}
                  </a>
                ) : (
                  <Link href={`/kasina/${kasino.slug}`} className="underline">
                    {kasino.nazev} – detail
                  </Link>
                )}
              </li>
            )}
          </ul>
        </section>
      )}

      <div className="mt-6 pt-4 border-t">
        <ShareButtons title={`${c.titul} | Články | Winio`} url={`${BASE_URL}/clanky/${c.slug}`} />
      </div>
      <p className="mt-4 text-sm text-gray-600">
        <Link href="/clanky" className="underline">
          ← Zpět na články
        </Link>
      </p>
    </article>
  );
}
