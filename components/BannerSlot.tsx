import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Banner, PoziceBanneru } from "@/types/db";

type Props = { pozice: PoziceBanneru; className?: string };

export async function BannerSlot({ pozice, className = "" }: Props) {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("bannery")
    .select("id, nazev, obrazek_url, odkaz_url, typ")
    .eq("pozice", pozice)
    .eq("aktivni", true)
    .order("poradi", { ascending: true })
    .limit(5);

  const bannery = (rows ?? []) as Pick<Banner, "id" | "nazev" | "obrazek_url" | "odkaz_url" | "typ">[];

  if (bannery.length === 0) return null;

  return (
    <aside className={`banner-slot banner-slot--${pozice} ${className}`} aria-label="Bannery">
      {bannery.map((b) => (
        <div key={b.id} className="mb-3 last:mb-0">
          {b.odkaz_url ? (
            <Link
              href={b.odkaz_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <img
                src={b.obrazek_url}
                alt={b.nazev}
                className="w-full h-auto object-cover max-h-32 sm:max-h-40"
              />
            </Link>
          ) : (
            <img
              src={b.obrazek_url}
              alt={b.nazev}
              className="w-full h-auto object-cover rounded-lg border border-gray-200 max-h-32 sm:max-h-40"
            />
          )}
        </div>
      ))}
    </aside>
  );
}
