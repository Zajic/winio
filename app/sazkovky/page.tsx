import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Sazkovka } from "@/types/db";

export const metadata: Metadata = {
  title: "Sázkové kanceláře | Winio",
  description:
    "Přehled licencovaných sázkových kanceláří. Srovnání a odkazy na registraci.",
};

type Props = { searchParams: Promise<{ licence?: string }> };

export default async function SazkovkyPage({ searchParams }: Props) {
  const { licence: licenceFilter } = await searchParams;
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("sazkovky")
    .select("*")
    .eq("aktivni", true)
    .order("poradi_zobrazeni", { ascending: true });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">Sázkové kanceláře</h1>
        <p className="text-red-600">Chyba načtení dat.</p>
      </div>
    );
  }

  const sazkovky = (rows ?? []) as Sazkovka[];
  const filtered =
    licenceFilter === "CZ"
      ? sazkovky.filter((s) => s.licence?.toUpperCase().includes("CZ"))
      : licenceFilter === "EU"
        ? sazkovky.filter(
            (s) =>
              s.licence &&
              !s.licence.toUpperCase().includes("CZ") &&
              (s.licence.toUpperCase().includes("MGA") ||
                s.licence.toUpperCase().includes("MALTA") ||
                s.licence.toUpperCase().includes("EU"))
          )
        : sazkovky;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Sázkové kanceláře</h1>
      <p className="text-gray-600 mb-6">
        Licencované sázkové kanceláře. Kliknutím přejdete na registraci u
        provozovatele.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600">Licence:</span>
        <Link
          href="/sazkovky"
          className={`text-sm px-2 py-1 rounded ${!licenceFilter ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Vše
        </Link>
        <Link
          href="/sazkovky?licence=CZ"
          className={`text-sm px-2 py-1 rounded ${licenceFilter === "CZ" ? "bg-gray-200 font-medium" : "underline"}`}
        >
          CZ
        </Link>
        <Link
          href="/sazkovky?licence=EU"
          className={`text-sm px-2 py-1 rounded ${licenceFilter === "EU" ? "bg-gray-200 font-medium" : "underline"}`}
        >
          EU
        </Link>
      </div>

      <ul className="space-y-4">
        {filtered.length === 0 ? (
          <li className="text-gray-600">Žádné sázkové kanceláře.</li>
        ) : (
          filtered.map((s) => (
            <li
              key={s.id}
              className="border rounded-lg p-4 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/sazkovky/${s.slug}`}
                  className="font-medium hover:underline"
                >
                  {s.nazev}
                </Link>
                {s.licence && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({s.licence})
                  </span>
                )}
                {s.popis && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {s.popis}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                {s.affiliate_url_registrace ? (
                  <a
                    href={s.affiliate_url_registrace}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta="registrace_sazkovka"
                    data-cta-label={s.nazev}
                    className="inline-block rounded border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Vsadit / Registrovat
                  </a>
                ) : (
                  <Link
                    href={`/sazkovky/${s.slug}`}
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
