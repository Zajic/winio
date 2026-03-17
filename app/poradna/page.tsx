import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Poradna } from "@/types/db";

export const metadata: Metadata = {
  title: "Poradna | FAQ a pomoc | Winio",
  description:
    "Časté dotazy, jak začít se sázením, blokace, adiktologie a pomoc. Bez affiliate uvnitř poradny.",
};

const KATEGORIE_LABELS: Record<string, string> = {
  faq: "FAQ",
  adiktologie: "Adiktologie",
  pomoc: "Pomoc",
};

type Props = { searchParams: Promise<{ kategorie?: string }> };

export default async function PoradnaPage({ searchParams }: Props) {
  const { kategorie: katFilter } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("poradna")
    .select("id, slug, titul, kategorie, razeni")
    .order("razeni", { ascending: true })
    .order("titul", { ascending: true });

  if (katFilter && (katFilter === "faq" || katFilter === "adiktologie" || katFilter === "pomoc")) {
    query = query.eq("kategorie", katFilter);
  }

  const { data: rows, error } = await query;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Poradna</h1>
        <p className="text-red-600">Chyba načtení dat.</p>
      </div>
    );
  }

  const polozky = (rows ?? []) as Pick<Poradna, "id" | "slug" | "titul" | "kategorie" | "razeni">[];

  const buildUrl = (k: string) => (k ? `/poradna?kategorie=${k}` : "/poradna");

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-2">Poradna</h1>
      <p className="text-gray-600 mb-6">
        Časté dotazy, návody a informace o zodpovědném hraní. Uvnitř poradny nejsou affiliate
        odkazy.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/poradna"
          className={`text-sm px-3 py-1.5 rounded ${!katFilter ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Vše
        </Link>
        {(["faq", "adiktologie", "pomoc"] as const).map((k) => (
          <Link
            key={k}
            href={buildUrl(k)}
            className={`text-sm px-3 py-1.5 rounded ${katFilter === k ? "bg-gray-200 font-medium" : "underline"}`}
          >
            {KATEGORIE_LABELS[k]}
          </Link>
        ))}
      </div>

      <ul className="space-y-3">
        {polozky.length === 0 ? (
          <li className="text-gray-600">
            Zatím žádné záznamy. Přidej je v Supabase (tabulka poradna) nebo spusť seed.
          </li>
        ) : (
          polozky.map((p) => (
            <li key={p.id}>
              <Link
                href={`/poradna/${p.slug}`}
                className="block border rounded-lg p-3 hover:bg-gray-50"
              >
                <span className="text-xs text-gray-500">{KATEGORIE_LABELS[p.kategorie] ?? p.kategorie}</span>
                <p className="font-medium">{p.titul}</p>
              </Link>
            </li>
          ))
        )}
      </ul>

      <p className="mt-8 text-sm text-gray-600 border-t pt-6">
        <Link href="/safe-play" className="underline">
          Safe Play – blokace, RUP, kontakty na pomoc
        </Link>
        {" · "}
        <Link href="/sazkovky" className="underline">
          Kde vsadit
        </Link>
      </p>
    </div>
  );
}
