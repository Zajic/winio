import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { LoterieOperator } from "@/types/db";

export const metadata: Metadata = {
  title: "Loterie | Winio",
  description:
    "Licencovaní provozovatelé loterií v ČR – Allwyn a další. Přehled her a odkazů na oficiální výsledky.",
};

export default async function LoteriePage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("loterie_operatori")
    .select("*")
    .eq("aktivni", true)
    .order("poradi", { ascending: true });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">Loterie</h1>
        <p className="text-red-600">Chyba načtení dat. Spusťte migraci v Supabase (012_loterie).</p>
      </div>
    );
  }

  const operatori = (rows ?? []) as LoterieOperator[];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Loterie v ČR</h1>
      <p className="text-gray-600 mb-6 max-w-2xl">
        Přehled licencovaných provozovatelů číselných a souvisejících loterií.
        Hlavním provozovatelem je dnes <strong>Allwyn</strong> (portfolio dříve
        spojované se značkou Sazka). Doplňte u menších provozovatelů oficiální
        názvy a odkazy v administraci.
      </p>

      <ul className="space-y-4 max-w-3xl">
        {operatori.length === 0 ? (
          <li className="text-gray-600">Žádní provozovatelé.</li>
        ) : (
          operatori.map((op) => (
            <li
              key={op.id}
              className="border rounded-lg p-4 hover:border-gray-400 transition-colors"
            >
              <Link
                href={`/loterie/${op.slug}`}
                className="font-medium text-lg hover:underline"
              >
                {op.nazev}
              </Link>
              {op.licence && (
                <p className="text-sm text-gray-500 mt-1">{op.licence}</p>
              )}
              {op.popis && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {op.popis}
                </p>
              )}
              <p className="mt-3">
                <Link
                  href={`/loterie/${op.slug}`}
                  className="text-sm text-blue-700 hover:underline"
                >
                  Hry a výsledky →
                </Link>
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
