import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

type Row = {
  id: string;
  nazev: string;
  slug: string;
  aktivni: boolean;
  operator_id: string;
  loterie_operatori: { nazev: string } | null;
};

export default async function AdminLoterieProduktyPage({
  searchParams,
}: {
  searchParams: Promise<{ operator?: string }>;
}) {
  const { operator: operatorFilter } = await searchParams;
  const supabase = createAdminClient();
  let q = supabase
    .from("loterie_produkty")
    .select("id, nazev, slug, aktivni, operator_id, loterie_operatori(nazev)")
    .order("poradi");
  if (operatorFilter) q = q.eq("operator_id", operatorFilter);
  const { data } = await q;
  const rows = (data ?? []) as unknown as Row[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/loterie" className="text-sm text-blue-600 hover:underline">
            ← Loterie
          </Link>
          <h1 className="text-2xl font-semibold mt-2">Produkty (hry)</h1>
          {operatorFilter && (
            <p className="text-sm text-gray-500 mt-1">
              Filtrováno podle operátora.{" "}
              <Link href="/admin/loterie/produkty" className="underline">
                Zrušit filtr
              </Link>
            </p>
          )}
        </div>
        <Link
          href={
            operatorFilter
              ? `/admin/loterie/produkty/novy?operator_id=${operatorFilter}`
              : "/admin/loterie/produkty/novy"
          }
          className="rounded bg-gray-800 text-white px-4 py-2 text-sm"
        >
          Nový produkt
        </Link>
      </div>
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Hra</th>
              <th className="text-left p-3">Operátor</th>
              <th className="text-left p-3">Aktivní</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{r.nazev}</td>
                <td className="p-3 text-gray-600">{r.loterie_operatori?.nazev ?? "—"}</td>
                <td className="p-3">{r.aktivni ? "ano" : "ne"}</td>
                <td className="p-3">
                  <Link href={`/admin/loterie/produkty/${r.id}`} className="text-blue-600 hover:underline">
                    Upravit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
