import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Sazkovka } from "@/types/db";

export default async function AdminSazkovkyPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sazkovky")
    .select("id, nazev, slug, aktivni, external_id")
    .order("poradi_zobrazeni", { ascending: true });

  const rows = (data ?? []) as Pick<Sazkovka, "id" | "nazev" | "slug" | "aktivni" | "external_id">[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sázkovky</h1>
        <Link
          href="/admin/sazkovky/novy"
          className="rounded bg-gray-800 text-white px-4 py-2 text-sm"
        >
          Nová sázkovka
        </Link>
      </div>
      {error && <p className="text-red-600">{error.message}</p>}
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Název</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">API id</th>
              <th className="text-left p-3">Aktivní</th>
              <th className="p-3 w-24" />
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{s.nazev}</td>
                <td className="p-3 font-mono text-gray-600">{s.slug}</td>
                <td className="p-3 text-gray-500">{s.external_id ?? "—"}</td>
                <td className="p-3">{s.aktivni ? "ano" : "ne"}</td>
                <td className="p-3">
                  <Link href={`/admin/sazkovky/${s.id}`} className="text-blue-600 hover:underline">
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
