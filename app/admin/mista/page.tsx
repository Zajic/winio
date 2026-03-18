import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Misto } from "@/types/db";

export default async function AdminMistaPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("mista")
    .select("id, nazev, typ, aktivni, adresa")
    .order("nazev");
  const rows = (data ?? []) as Pick<Misto, "id" | "nazev" | "typ" | "aktivni" | "adresa">[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Místa (mapa)</h1>
        <Link href="/admin/mista/novy" className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
          Nové místo
        </Link>
      </div>
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Název</th>
              <th className="text-left p-3">Typ</th>
              <th className="text-left p-3">Adresa</th>
              <th className="text-left p-3">Aktivní</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{m.nazev}</td>
                <td className="p-3 text-gray-600">{m.typ}</td>
                <td className="p-3 text-gray-500 max-w-xs truncate">{m.adresa ?? "—"}</td>
                <td className="p-3">{m.aktivni ? "ano" : "ne"}</td>
                <td className="p-3">
                  <Link href={`/admin/mista/${m.id}`} className="text-blue-600 hover:underline">
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
