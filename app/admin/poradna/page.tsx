import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Poradna } from "@/types/db";

export default async function AdminPoradnaPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("poradna")
    .select("id, titul, slug, kategorie, razeni")
    .order("kategorie")
    .order("razeni");

  const rows = (data ?? []) as Pick<Poradna, "id" | "titul" | "slug" | "kategorie" | "razeni">[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Poradna</h1>
        <Link href="/admin/poradna/novy" className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
          Nová stránka
        </Link>
      </div>
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Titulek</th>
              <th className="text-left p-3">Kategorie</th>
              <th className="text-left p-3">Pořadí</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{r.titul}</td>
                <td className="p-3 text-gray-600">{r.kategorie}</td>
                <td className="p-3">{r.razeni}</td>
                <td className="p-3">
                  <Link href={`/admin/poradna/${r.id}`} className="text-blue-600 hover:underline">
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
