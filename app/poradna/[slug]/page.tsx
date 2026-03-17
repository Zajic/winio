import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Poradna } from "@/types/db";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("poradna")
    .select("titul")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Poradna | Winio" };
  return { title: `${(data as Poradna).titul} | Poradna | Winio` };
}

export default async function PoradnaDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: polozka, error } = await supabase
    .from("poradna")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !polozka) notFound();
  const p = polozka as Poradna;

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/poradna" className="hover:underline">
          Poradna
        </Link>
        <span className="mx-1">/</span>
        <span>{p.titul}</span>
      </nav>

      <h1 className="text-2xl font-semibold mb-6">{p.titul}</h1>

      {p.telo && (
        <div
          className="prose prose-gray max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: p.telo }}
        />
      )}

      <p className="text-sm text-gray-600">
        <Link href="/poradna" className="underline">
          ← Zpět na poradnu
        </Link>
        {" · "}
        <Link href="/safe-play" className="underline">
          Safe Play
        </Link>
        {" · "}
        <Link href="/sazkovky" className="underline">
          Kde vsadit
        </Link>
      </p>
    </article>
  );
}
