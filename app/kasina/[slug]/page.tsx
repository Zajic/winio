import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Kasino } from "@/types/db";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("kasina")
    .select("nazev, popis")
    .eq("slug", slug)
    .eq("aktivni", true)
    .single();

  if (!data) return { title: "Online kasino | Winio" };
  const k = data as Kasino;
  return {
    title: `${k.nazev} | Online kasina | Winio`,
    description:
      (k.popis ?? `Informace o online kasinu ${k.nazev}.`) +
      " Licencovaný provozovatel.",
  };
}

export default async function KasinoDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("kasina")
    .select("*")
    .eq("slug", slug)
    .eq("aktivni", true)
    .single();

  if (error || !data) notFound();
  const k = data as Kasino;

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/kasina" className="hover:underline">
          Online kasina
        </Link>
        <span className="mx-1">/</span>
        <span>{k.nazev}</span>
      </nav>

      <h1 className="text-2xl font-semibold mb-2">{k.nazev}</h1>
      {k.licence && (
        <p className="text-sm text-gray-500 mb-4">Licence: {k.licence}</p>
      )}
      {k.popis && <p className="text-gray-700 mb-6">{k.popis}</p>}

      <div className="border-t pt-6">
        {k.affiliate_url ? (
          <a
            href={k.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded border border-gray-700 bg-gray-800 px-5 py-2.5 text-white hover:bg-gray-700"
          >
            Zahrát u {k.nazev}
          </a>
        ) : (
          <p className="text-sm text-gray-600">
            Odkaz bude doplněn. Zpět na{" "}
            <Link href="/kasina" className="underline">
              seznam kasin
            </Link>
            .
          </p>
        )}
      </div>
    </article>
  );
}
