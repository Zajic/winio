import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Zapas } from "@/types/db";

export default async function AdminZapasyPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("zapasy")
    .select("id, sport, soutez, domaci_tym, hoste_tym, zacatek_at, stav, vysledek")
    .order("zacatek_at", { ascending: false })
    .limit(120);

  const rows = (data ?? []) as Pick<
    Zapas,
    "id" | "sport" | "soutez" | "domaci_tym" | "hoste_tym" | "zacatek_at" | "stav" | "vysledek"
  >[];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Zápasy</h1>
      <p className="text-sm text-gray-600 mb-6">
        Úprava metadat a výsledků. Nové zápasy přibývají z cronu Odds API. Kurzy jsou v tabulce{" "}
        <code className="text-xs bg-gray-100 px-1">kurzy</code> (bez přímé úpravy zde).
      </p>
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-2">Začátek</th>
              <th className="text-left p-2">Zápas</th>
              <th className="text-left p-2">Stav</th>
              <th className="text-left p-2">Výsledek</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((z) => (
              <tr key={z.id} className="border-b hover:bg-gray-50">
                <td className="p-2 whitespace-nowrap text-gray-600">
                  {new Date(z.zacatek_at).toLocaleString("cs-CZ", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-2">
                  <span className="font-medium">
                    {z.domaci_tym} vs {z.hoste_tym}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">
                    {z.sport}
                    {z.soutez ? ` · ${z.soutez}` : ""}
                  </span>
                </td>
                <td className="p-2">{z.stav}</td>
                <td className="p-2 text-gray-600">{z.vysledek ?? "—"}</td>
                <td className="p-2">
                  <Link href={`/admin/zapasy/${z.id}`} className="text-blue-600 hover:underline">
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
