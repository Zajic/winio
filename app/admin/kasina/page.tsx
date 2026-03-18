import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Kasino } from "@/types/db";

export default async function AdminKasinaPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("kasina").select("id, nazev, slug, aktivni").order("nazev");
  const rows = (data ?? []) as Pick<Kasino, "id" | "nazev" | "slug" | "aktivni">[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Kasina</h1>
        <Link href="/admin/kasina/novy" className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
          Nové kasino
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
            {rows.map((k) => (
              <tr key={k.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{k.nazev}</td>
                <td className="p-3 font-mono text-gray-600">{k.slug}</td>
                <td className="p-3">{k.aktivni ? "ano" : "ne"}</td>
                <td className="p-3">
                  <Link href={`/admin/kasina/${k.id}`} className="text-blue-600 hover:underline">
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
