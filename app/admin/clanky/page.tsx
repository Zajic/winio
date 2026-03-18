import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Clanky } from "@/types/db";

const TYP_LABELS: Record<string, string> = {
  news: "Novinky",
  blog: "Blog",
  pr_placeny: "Spolupráce",
};

export default async function AdminClankyPage() {
  const supabase = createAdminClient();
  const { data: rows } = await supabase
    .from("clanky")
    .select("id, titul, slug, typ, published_at")
    .order("updated_at", { ascending: false })
    .limit(100);

  const clanky = (rows ?? []) as Pick<Clanky, "id" | "titul" | "slug" | "typ" | "published_at">[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Články</h1>
        <Link
          href="/admin/clanky/novy"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
        >
          Přidat článek
        </Link>
      </div>

      <ul className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {clanky.length === 0 ? (
          <li className="p-4 text-gray-500">Zatím žádné články.</li>
        ) : (
          clanky.map((c) => (
            <li key={c.id} className="border-b border-gray-100 last:border-0">
              <Link
                href={`/admin/clanky/${c.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div>
                  <span className="text-xs text-gray-400 mr-2">
                    {TYP_LABELS[c.typ] ?? c.typ}
                  </span>
                  <span className="font-medium">{c.titul}</span>
                  {!c.published_at && (
                    <span className="ml-2 text-xs text-amber-600">(nepublikováno)</span>
                  )}
                </div>
                <span className="text-sm text-gray-400">{c.slug}</span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
