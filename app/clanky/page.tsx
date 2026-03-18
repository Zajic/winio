import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Clanky } from "@/types/db";

export const metadata: Metadata = {
  title: "Články a blog | Winio",
  description:
    "Novinky ze světa sázení a kasin, návody a tipy. Kde vsadit a zahrát – pouze licencované operátory.",
};

const TYP_LABELS: Record<string, string> = {
  news: "Novinky",
  blog: "Blog",
  pr_placeny: "Spolupráce",
};

type Props = { searchParams: Promise<{ typ?: string }> };

export default async function ClankyPage({ searchParams }: Props) {
  const { typ: typFilter } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("clanky")
    .select("id, typ, titul, slug, perex, published_at, zdroj_url")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(50);

  if (typFilter && (typFilter === "news" || typFilter === "blog" || typFilter === "pr_placeny")) {
    query = query.eq("typ", typFilter);
  }

  const { data: rows, error } = await query;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Články</h1>
        <p className="text-red-600">Chyba načtení dat.</p>
      </div>
    );
  }

  const clanky = (rows ?? []) as Pick<
    Clanky,
    "id" | "typ" | "titul" | "slug" | "perex" | "published_at" | "zdroj_url"
  >[];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-2">Články a blog</h1>
      <p className="text-gray-600 mb-6">
        Novinky, návody a tipy. U placené spolupráce je vždy označení.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/clanky"
          className={`text-sm px-3 py-1.5 rounded ${!typFilter ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Všechny
        </Link>
        <Link
          href="/clanky?typ=news"
          className={`text-sm px-3 py-1.5 rounded ${typFilter === "news" ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Novinky
        </Link>
        <Link
          href="/clanky?typ=blog"
          className={`text-sm px-3 py-1.5 rounded ${typFilter === "blog" ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Blog
        </Link>
      </div>

      <ul className="space-y-4">
        {clanky.length === 0 ? (
          <li className="text-gray-600">
            Zatím žádné publikované články. Přidej je v Supabase nebo nastav RSS_FEEDS a spusť cron.
          </li>
        ) : (
          clanky.map((c) => (
            <li key={c.id} className="border-b border-gray-200 pb-4">
              <Link href={`/clanky/${c.slug}`} className="block hover:opacity-90">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-xs text-gray-500">
                    {TYP_LABELS[c.typ] ?? c.typ}
                  </span>
                  {c.typ === "news" && c.zdroj_url && (
                    <span className="text-xs rounded bg-slate-100 text-slate-700 px-1.5 py-0.5">
                      výňatek + odkaz na zdroj
                    </span>
                  )}
                </div>
                <h2 className="font-medium text-lg">{c.titul}</h2>
                {c.perex && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.perex}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {c.published_at
                    ? new Date(c.published_at).toLocaleDateString("cs-CZ", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </p>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
