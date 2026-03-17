import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Hra, TypHry } from "@/types/db";

export const metadata: Metadata = {
  title: "Hry – automaty, rulety | Winio",
  description:
    "Přehled her a automatů. Kde si zahrát – licencovaná online kasina.",
};

const TYP_LABELS: Record<TypHry, string> = {
  automat: "Automaty",
  ruleta: "Rulety",
  stolni_hra: "Stolní hry",
};

type Props = { searchParams: Promise<{ typ?: string }> };

export default async function HryPage({ searchParams }: Props) {
  const { typ } = await searchParams;
  const typFilter = typ && ["automat", "ruleta", "stolni_hra"].includes(typ) ? (typ as TypHry) : null;

  const supabase = await createClient();
  let query = supabase.from("hry").select("*").order("nazev", { ascending: true });
  if (typFilter) query = query.eq("typ", typFilter);
  const { data: rows, error } = await query;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">Hry</h1>
        <p className="text-red-600">Chyba načtení dat.</p>
      </div>
    );
  }

  const hry = (rows ?? []) as Hra[];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Hry</h1>
      <p className="text-gray-600 mb-6">
        Automaty, rulety a stolní hry. U každé hry najdete, kde si ji zahrát
        (licencovaná kasina).
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600">Typ:</span>
        <Link
          href="/hry"
          className={`text-sm px-2 py-1 rounded ${!typFilter ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Vše
        </Link>
        {(["automat", "ruleta", "stolni_hra"] as const).map((t) => (
          <Link
            key={t}
            href={`/hry?typ=${t}`}
            className={`text-sm px-2 py-1 rounded ${typFilter === t ? "bg-gray-200 font-medium" : "underline"}`}
          >
            {TYP_LABELS[t]}
          </Link>
        ))}
      </div>

      <ul className="space-y-3">
        {hry.length === 0 ? (
          <li className="text-gray-600">Žádné hry.</li>
        ) : (
          hry.map((h) => (
            <li key={h.id} className="border rounded-lg p-4">
              <Link href={`/hry/${h.slug}`} className="font-medium hover:underline">
                {h.nazev}
              </Link>
              <span className="ml-2 text-sm text-gray-500">({TYP_LABELS[h.typ]})</span>
              {h.popis && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{h.popis}</p>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
