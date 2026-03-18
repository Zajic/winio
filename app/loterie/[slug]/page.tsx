import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { LoterieOperator, LoterieProdukt, LoterieTah } from "@/types/db";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("loterie_operatori")
    .select("nazev, popis")
    .eq("slug", slug)
    .eq("aktivni", true)
    .single();

  if (!data) return { title: "Loterie | Winio" };
  const op = data as LoterieOperator;
  return {
    title: `${op.nazev} | Loterie | Winio`,
    description: op.popis?.slice(0, 155) ?? `Loterie ${op.nazev} – hry a výsledky.`,
  };
}

export default async function LoterieOperatorPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: opRow, error: opErr } = await supabase
    .from("loterie_operatori")
    .select("*")
    .eq("slug", slug)
    .eq("aktivni", true)
    .single();

  if (opErr || !opRow) notFound();
  const op = opRow as LoterieOperator;

  const { data: prodRows } = await supabase
    .from("loterie_produkty")
    .select("*")
    .eq("operator_id", op.id)
    .eq("aktivni", true)
    .order("poradi", { ascending: true });

  const produkty = (prodRows ?? []) as LoterieProdukt[];

  const tahyByProdukt = new Map<string, LoterieTah[]>();
  await Promise.all(
    produkty.map(async (p) => {
      const { data } = await supabase
        .from("loterie_tahy")
        .select("*")
        .eq("produkt_id", p.id)
        .order("datum_losovani", { ascending: false })
        .limit(5);
      tahyByProdukt.set(p.id, (data ?? []) as LoterieTah[]);
    })
  );

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/loterie" className="hover:underline">
          Loterie
        </Link>
        <span className="mx-1">/</span>
        <span>{op.nazev}</span>
      </nav>

      <h1 className="text-2xl font-semibold mb-2">{op.nazev}</h1>
      {op.licence && (
        <p className="text-sm text-gray-500 mb-4">Licence: {op.licence}</p>
      )}
      {op.popis && (
        <p className="text-gray-700 mb-6 whitespace-pre-wrap">{op.popis}</p>
      )}

      {op.web_url && (
        <p className="mb-8">
          <a
            href={op.web_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline"
          >
            Oficiální web provozovatele →
          </a>
        </p>
      )}

      <h2 className="text-lg font-semibold mb-3 border-b pb-2">Hry / produkty</h2>
      {produkty.length === 0 ? (
        <p className="text-gray-600 text-sm mb-8">
          Zatím žádné produkty. Přidejte je v Supabase (tabulka{" "}
          <code className="text-xs bg-gray-100 px-1">loterie_produkty</code>).
        </p>
      ) : (
        <ul className="space-y-8 mb-8">
          {produkty.map((p) => {
            const tahy = tahyByProdukt.get(p.id) ?? [];
            return (
              <li key={p.id} className="border rounded-lg p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{p.nazev}</h3>
                    {p.popis && (
                      <p className="text-sm text-gray-600 mt-1">{p.popis}</p>
                    )}
                  </div>
                  {p.oficialni_vysledky_url && (
                    <a
                      href={p.oficialni_vysledky_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-700 hover:underline shrink-0"
                    >
                      Oficiální výsledky →
                    </a>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Poslední tahy na Winio
                  </p>
                  {tahy.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      Zatím žádné zapsané tahy. Doplňte ručně v DB nebo později
                      přes cron/API.
                    </p>
                  ) : (
                    <ul className="text-sm space-y-2">
                      {tahy.map((t) => (
                        <li
                          key={t.id}
                          className="flex flex-wrap gap-x-3 gap-y-1 border-l-2 border-gray-200 pl-3"
                        >
                          <time
                            dateTime={t.datum_losovani}
                            className="text-gray-500 shrink-0"
                          >
                            {new Date(t.datum_losovani).toLocaleString("cs-CZ", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </time>
                          <span className="font-mono">{t.vysledek_text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-sm text-gray-500">
        <Link href="/loterie" className="hover:underline">
          ← Zpět na přehled loterií
        </Link>
      </p>
    </article>
  );
}
