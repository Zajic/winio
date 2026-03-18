import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Hra } from "@/types/db";

export default async function AdminHryPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("hry").select("id, nazev, slug, typ").order("nazev");
  const rows = (data ?? []) as Pick<Hra, "id" | "nazev" | "slug" | "typ">[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Hry</h1>
        <Link href="/admin/hry/novy" className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
          Nová hra
        </Link>
      </div>
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Název</th>
              <th className="text-left p-3">Typ</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => (
              <tr key={h.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{h.nazev}</td>
                <td className="p-3 text-gray-600">{h.typ}</td>
                <td className="p-3">
                  <Link href={`/admin/hry/${h.id}`} className="text-blue-600 hover:underline">
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
