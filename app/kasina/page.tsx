import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Kasino } from "@/types/db";

export const metadata: Metadata = {
  title: "Online kasina | Winio",
  description:
    "Přehled licencovaných online kasin. Srovnání a odkazy na registraci.",
};

type Props = { searchParams: Promise<{ licence?: string }> };

export default async function KasinaPage({ searchParams }: Props) {
  const { licence: licenceFilter } = await searchParams;
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("kasina")
    .select("*")
    .eq("aktivni", true)
    .order("nazev", { ascending: true });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">Online kasina</h1>
        <p className="text-red-600">Chyba načtení dat.</p>
      </div>
    );
  }

  const kasina = (rows ?? []) as Kasino[];
  const filtered =
    licenceFilter === "CZ"
      ? kasina.filter((k) => k.licence?.toUpperCase().includes("CZ"))
      : licenceFilter === "EU"
        ? kasina.filter(
            (k) =>
              k.licence &&
              (k.licence.toUpperCase().includes("MGA") ||
                k.licence.toUpperCase().includes("MALTA") ||
                k.licence.toUpperCase().includes("EU"))
          )
        : kasina;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Online kasina</h1>
      <p className="text-gray-600 mb-6">
        Licencovaná online kasina. Kliknutím přejdete na provozovatele.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600">Licence:</span>
        <Link
          href="/kasina"
          className={`text-sm px-2 py-1 rounded ${!licenceFilter ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Vše
        </Link>
        <Link
          href="/kasina?licence=CZ"
          className={`text-sm px-2 py-1 rounded ${licenceFilter === "CZ" ? "bg-gray-200 font-medium" : "underline"}`}
        >
          CZ
        </Link>
        <Link
          href="/kasina?licence=EU"
          className={`text-sm px-2 py-1 rounded ${licenceFilter === "EU" ? "bg-gray-200 font-medium" : "underline"}`}
        >
          EU
        </Link>
      </div>

      <ul className="space-y-4">
        {filtered.length === 0 ? (
          <li className="text-gray-600">Žádná kasina.</li>
        ) : (
          filtered.map((k) => (
            <li
              key={k.id}
              className="border rounded-lg p-4 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/kasina/${k.slug}`}
                  className="font-medium hover:underline"
                >
                  {k.nazev}
                </Link>
                {k.licence && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({k.licence})
                  </span>
                )}
                {k.popis && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {k.popis}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                {k.affiliate_url ? (
                  <a
                    href={k.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Zahrát / Registrovat
                  </a>
                ) : (
                  <Link
                    href={`/kasina/${k.slug}`}
                    className="inline-block rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Detail
                  </Link>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
