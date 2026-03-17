import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Sazkovka } from "@/types/db";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("sazkovky")
    .select("nazev, popis")
    .eq("slug", slug)
    .eq("aktivni", true)
    .single();

  if (!data) return { title: "Sázková kancelář | Winio" };
  const s = data as Sazkovka;
  return {
    title: `${s.nazev} | Sázkové kanceláře | Winio`,
    description:
      (s.popis ?? `Informace o sázkové kanceláři ${s.nazev}.`) + " Licencovaný provozovatel.",
  };
}

export default async function SazkovkaDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sazkovky")
    .select("*")
    .eq("slug", slug)
    .eq("aktivni", true)
    .single();

  if (error || !data) notFound();
  const s = data as Sazkovka;

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/sazkovky" className="hover:underline">
          Sázkové kanceláře
        </Link>
        <span className="mx-1">/</span>
        <span>{s.nazev}</span>
      </nav>

      <h1 className="text-2xl font-semibold mb-2">{s.nazev}</h1>
      {s.licence && (
        <p className="text-sm text-gray-500 mb-4">Licence: {s.licence}</p>
      )}
      {s.popis && <p className="text-gray-700 mb-6">{s.popis}</p>}

      <div className="border-t pt-6">
        {s.affiliate_url_registrace ? (
          <a
            href={s.affiliate_url_registrace}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded border border-gray-700 bg-gray-800 px-5 py-2.5 text-white hover:bg-gray-700"
          >
            Vsadit / Registrovat u {s.nazev}
          </a>
        ) : (
          <p className="text-sm text-gray-600">
            Odkaz na registraci bude doplněn. Zpět na{" "}
            <Link href="/sazkovky" className="underline">
              seznam sázkových kanceláří
            </Link>
            .
          </p>
        )}
      </div>
    </article>
  );
}
