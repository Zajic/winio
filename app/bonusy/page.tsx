import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Sazkovka } from "@/types/db";

export const metadata: Metadata = {
  title: "Srovnání bonusů sázkových kanceláří | Winio",
  description:
    "Přehled bonusů a freebetů licencovaných sázkových kanceláří. Srovnání a odkazy na registraci.",
};

export default async function BonusyPage() {
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("sazkovky")
    .select("*")
    .eq("aktivni", true)
    .order("poradi_zobrazeni", { ascending: true });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">Srovnání bonusů</h1>
        <p className="text-red-600">Chyba načtení dat.</p>
      </div>
    );
  }

  const sazkovky = (rows ?? []) as Sazkovka[];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Srovnání bonusů</h1>
      <p className="text-gray-600 mb-6">
        Přehled uvítacích bonusů a freebetů u licencovaných sázkových kanceláří.
        Kliknutím přejdete na registraci u provozovatele.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Sázková kancelář</th>
              <th className="border border-gray-300 p-2 text-left">Bonus</th>
              <th className="border border-gray-300 p-2 text-left">Freebet</th>
              <th className="border border-gray-300 p-2 text-left">Podmínky</th>
              <th className="border border-gray-300 p-2 text-left">Akce</th>
            </tr>
          </thead>
          <tbody>
            {sazkovky.length === 0 ? (
              <tr>
                <td colSpan={5} className="border border-gray-300 p-4 text-gray-600">
                  Žádné sázkové kanceláře.
                </td>
              </tr>
            ) : (
              sazkovky.map((s) => (
                <tr key={s.id} className="border-b border-gray-300">
                  <td className="border border-gray-300 p-2">
                    <Link href={`/sazkovky/${s.slug}`} className="font-medium hover:underline">
                      {s.nazev}
                    </Link>
                    {s.licence && (
                      <span className="ml-1 text-gray-500">({s.licence})</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {s.bonus_uvodni ?? "–"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {s.freebet ?? "–"}
                  </td>
                  <td className="border border-gray-300 p-2 max-w-xs">
                    <span className="line-clamp-2">{s.bonus_popis ?? "–"}</span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    {s.affiliate_url_registrace ? (
                      <a
                        href={s.affiliate_url_registrace}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cta="registrace_bonusy"
                        data-cta-label={s.nazev}
                        className="inline-block rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white hover:bg-gray-700"
                      >
                        Vsadit / Registrovat
                      </a>
                    ) : (
                      <Link
                        href={`/sazkovky/${s.slug}`}
                        className="inline-block rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        Detail
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
