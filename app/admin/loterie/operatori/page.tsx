import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LoterieOperator } from "@/types/db";

export default async function AdminLoterieOperatoriPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("loterie_operatori")
    .select("id, nazev, slug, aktivni, poradi")
    .order("poradi");
  const rows = (data ?? []) as Pick<LoterieOperator, "id" | "nazev" | "slug" | "aktivni" | "poradi">[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/loterie" className="text-sm text-blue-600 hover:underline">
            ← Loterie
          </Link>
          <h1 className="text-2xl font-semibold mt-2">Operátoři loterií</h1>
        </div>
        <Link
          href="/admin/loterie/operatori/novy"
          className="rounded bg-gray-800 text-white px-4 py-2 text-sm"
        >
          Nový operátor
        </Link>
      </div>
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Název</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Aktivní</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{r.nazev}</td>
                <td className="p-3 font-mono text-gray-600">{r.slug}</td>
                <td className="p-3">{r.aktivni ? "ano" : "ne"}</td>
                <td className="p-3">
                  <Link href={`/admin/loterie/operatori/${r.id}`} className="text-blue-600 hover:underline">
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
