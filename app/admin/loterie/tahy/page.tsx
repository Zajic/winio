import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { DeleteTahButton } from "./DeleteTahButton";

type Row = {
  id: string;
  datum_losovani: string;
  vysledek_text: string;
  loterie_produkty: { nazev: string; loterie_operatori: { nazev: string } | null } | null;
};

export default async function AdminLoterieTahyPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("loterie_tahy")
    .select(
      "id, datum_losovani, vysledek_text, loterie_produkty(nazev, loterie_operatori(nazev))"
    )
    .order("datum_losovani", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as unknown as Row[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/loterie" className="text-sm text-blue-600 hover:underline">
            ← Loterie
          </Link>
          <h1 className="text-2xl font-semibold mt-2">Tahy (výsledky)</h1>
        </div>
        <Link href="/admin/loterie/tahy/novy" className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
          Nový tah
        </Link>
      </div>
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Datum</th>
              <th className="text-left p-3">Produkt</th>
              <th className="text-left p-3">Výsledek</th>
              <th className="p-3 w-28" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-3 whitespace-nowrap">
                  {new Date(r.datum_losovani).toLocaleString("cs-CZ")}
                </td>
                <td className="p-3">
                  {r.loterie_produkty?.nazev ?? "—"}
                  <span className="text-gray-500 text-xs block">
                    {r.loterie_produkty?.loterie_operatori?.nazev}
                  </span>
                </td>
                <td className="p-3 font-mono text-xs max-w-md truncate">{r.vysledek_text}</td>
                <td className="p-3">
                  <DeleteTahButton id={r.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
