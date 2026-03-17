import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Hra, Kasino, TypHry } from "@/types/db";

const TYP_LABELS: Record<TypHry, string> = {
  automat: "Automat",
  ruleta: "Ruleta",
  stolni_hra: "Stolní hra",
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("hry")
    .select("nazev, popis")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Hra | Winio" };
  const h = data as Hra;
  return {
    title: `${h.nazev} | Hry | Winio`,
    description:
      (h.popis ?? `Kde si zahrát ${h.nazev}.`) +
      " Licencovaná online kasina.",
  };
}

export default async function HraDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: hra, error: errHra } = await supabase
    .from("hry")
    .select("*")
    .eq("slug", slug)
    .single();

  if (errHra || !hra) notFound();
  const h = hra as Hra;

  const { data: vazby } = await supabase
    .from("hry_kasina")
    .select("kasino_id")
    .eq("hra_id", h.id);

  const kasinaIds = (vazby ?? []).map((v) => v.kasino_id);
  let kasina: Kasino[] = [];
  if (kasinaIds.length > 0) {
    const { data: kasinaRows } = await supabase
      .from("kasina")
      .select("*")
      .in("id", kasinaIds)
      .eq("aktivni", true);
    kasina = (kasinaRows ?? []) as Kasino[];
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/hry" className="hover:underline">
          Hry
        </Link>
        <span className="mx-1">/</span>
        <span>{h.nazev}</span>
      </nav>

      <h1 className="text-2xl font-semibold mb-2">{h.nazev}</h1>
      <p className="text-sm text-gray-500 mb-4">{TYP_LABELS[h.typ]}</p>
      {h.popis && <p className="text-gray-700 mb-8">{h.popis}</p>}

      <section>
        <h2 className="text-lg font-medium mb-3">Kde si zahrát</h2>
        {kasina.length === 0 ? (
          <p className="text-gray-600 text-sm">
            Zatím nemáme přiřazená kasina. Zkuste{" "}
            <Link href="/kasina" className="underline">
              seznam online kasin
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-2">
            {kasina.map((k) => (
              <li key={k.id} className="flex flex-wrap items-center justify-between gap-2 border-b py-2">
                <Link href={`/kasina/${k.slug}`} className="hover:underline">
                  {k.nazev}
                </Link>
                {k.affiliate_url ? (
                  <a
                    href={k.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-white hover:bg-gray-700"
                  >
                    Zahrát
                  </a>
                ) : (
                  <Link
                    href={`/kasina/${k.slug}`}
                    className="text-sm rounded border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                  >
                    Detail
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
