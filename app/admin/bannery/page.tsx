import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Banner } from "@/types/db";

const TYP_LABELS: Record<string, string> = {
  reklama: "Reklama",
  vlastni: "Vlastní",
};

const POZICE_LABELS: Record<string, string> = {
  homepage_top: "Homepage nahoře",
  homepage_sidebar: "Homepage sidebar",
  clanek_bottom: "Pod článkem",
  sidebar_global: "Sidebar (globální)",
};

export default async function AdminBanneryPage() {
  const supabase = createAdminClient();
  const { data: rows } = await supabase
    .from("bannery")
    .select("*")
    .order("pozice")
    .order("poradi", { ascending: true });

  const bannery = (rows ?? []) as Banner[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Bannery</h1>
        <Link
          href="/admin/bannery/novy"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
        >
          Přidat banner
        </Link>
      </div>

      <ul className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {bannery.length === 0 ? (
          <li className="p-4 text-gray-500">Zatím žádné bannery.</li>
        ) : (
          bannery.map((b) => (
            <li key={b.id} className="border-b border-gray-100 last:border-0">
              <Link
                href={`/admin/bannery/${b.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50"
              >
                <img
                  src={b.obrazek_url}
                  alt=""
                  className="w-20 h-12 object-cover rounded bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{b.nazev}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {TYP_LABELS[b.typ]} · {POZICE_LABELS[b.pozice] ?? b.pozice}
                  </span>
                  {!b.aktivni && (
                    <span className="ml-2 text-xs text-amber-600">(neaktivní)</span>
                  )}
                </div>
                <span className="text-sm text-gray-400">pořadí {b.poradi}</span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
