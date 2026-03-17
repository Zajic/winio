import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MapaMista, type MistoMapItem } from "@/components/MapaMista";
import type { Misto } from "@/types/db";

export const metadata: Metadata = {
  title: "Mapa poboček | Winio",
  description:
    "Pobočky sázkových kanceláří a kasina. Zaregistruj se online před návštěvou.",
};

const TYP_LABELS: Record<string, string> = {
  pobocka_sazkovky: "Pobočka sázkovky",
  kasino: "Kasino",
};

type Props = { searchParams: Promise<{ typ?: string; sazkovka?: string; kasino?: string }> };

export default async function MapaPage({ searchParams }: Props) {
  const { typ: typFilter, sazkovka: sazkovkaFilter, kasino: kasinoFilter } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("mista")
    .select(`
      id, typ, nazev, adresa, lat, lng, sazkovka_id, kasino_id,
      sazkovky!sazkovka_id(nazev, slug, affiliate_url_registrace),
      kasina!kasino_id(nazev, slug, affiliate_url)
    `)
    .eq("aktivni", true)
    .order("nazev");

  if (typFilter === "pobocka_sazkovky" || typFilter === "kasino") {
    query = query.eq("typ", typFilter);
  }
  if (sazkovkaFilter) {
    query = query.eq("sazkovka_id", sazkovkaFilter);
  }
  if (kasinoFilter) {
    query = query.eq("kasino_id", kasinoFilter);
  }

  const { data: rows, error } = await query;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Mapa poboček</h1>
        <p className="text-red-600">Chyba načtení dat.</p>
      </div>
    );
  }

  type MistoRow = Pick<Misto, "id" | "typ" | "nazev" | "adresa" | "lat" | "lng" | "sazkovka_id" | "kasino_id"> & {
    sazkovky: { nazev: string; slug: string; affiliate_url_registrace: string | null } | null;
    kasina: { nazev: string; slug: string; affiliate_url: string | null } | null;
  };
  const mistaRaw = (rows ?? []) as unknown as MistoRow[];

  const norm = (v: unknown) => (Array.isArray(v) ? v[0] : v);
  const mistaMap: MistoMapItem[] = mistaRaw.map((m) => ({
    id: m.id,
    nazev: m.nazev,
    adresa: m.adresa,
    lat: m.lat,
    lng: m.lng,
    typ: m.typ,
    sazkovka: (norm(m.sazkovky) as MistoRow["sazkovky"]) ?? undefined,
    kasino: (norm(m.kasina) as MistoRow["kasina"]) ?? undefined,
  }));

  const { data: sazkovkyList } = await supabase
    .from("sazkovky")
    .select("id, nazev, slug")
    .eq("aktivni", true)
    .order("nazev");
  const { data: kasinaList } = await supabase
    .from("kasina")
    .select("id, nazev, slug")
    .eq("aktivni", true)
    .order("nazev");

  const buildUrl = (params: Record<string, string>) => {
    const p = new URLSearchParams();
    if (typFilter) p.set("typ", typFilter);
    if (sazkovkaFilter) p.set("sazkovka", sazkovkaFilter);
    if (kasinoFilter) p.set("kasino", kasinoFilter);
    Object.entries(params).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    const q = p.toString();
    return q ? `/mapa?${q}` : "/mapa";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Mapa poboček</h1>
      <p className="text-gray-600 mb-6">
        Pobočky sázkových kanceláří a kasina. Klikni na místo v mapě – odkaz „Zaregistruj se online“
        vede na příslušnou sázkovku nebo kasino.
      </p>

      <div className="mb-6 flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-600">Typ:</span>
        <Link
          href={buildUrl({ typ: "" })}
          className={`text-sm px-3 py-1.5 rounded ${!typFilter ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Vše
        </Link>
        <Link
          href={buildUrl({ typ: "pobocka_sazkovky" })}
          className={`text-sm px-3 py-1.5 rounded ${typFilter === "pobocka_sazkovky" ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Pobočky sázkovky
        </Link>
        <Link
          href={buildUrl({ typ: "kasino" })}
          className={`text-sm px-3 py-1.5 rounded ${typFilter === "kasino" ? "bg-gray-200 font-medium" : "underline"}`}
        >
          Kasina
        </Link>
        {sazkovkyList && sazkovkyList.length > 0 && (
          <>
            <span className="text-sm text-gray-600 ml-2">Sázkovka:</span>
            <Link
              href={buildUrl({ sazkovka: "" })}
              className={`text-sm px-2 py-1 rounded ${!sazkovkaFilter ? "bg-gray-200 font-medium" : "underline"}`}
            >
              Vše
            </Link>
            {sazkovkyList.map((s) => (
              <Link
                key={s.id}
                href={buildUrl({ sazkovka: s.id })}
                className={`text-sm px-2 py-1 rounded ${sazkovkaFilter === s.id ? "bg-gray-200 font-medium" : "underline"}`}
              >
                {s.nazev}
              </Link>
            ))}
          </>
        )}
        {kasinaList && kasinaList.length > 0 && (
          <>
            <span className="text-sm text-gray-600 ml-2">Kasino:</span>
            <Link
              href={buildUrl({ kasino: "" })}
              className={`text-sm px-2 py-1 rounded ${!kasinoFilter ? "bg-gray-200 font-medium" : "underline"}`}
            >
              Vše
            </Link>
            {kasinaList.map((k) => (
              <Link
                key={k.id}
                href={buildUrl({ kasino: k.id })}
                className={`text-sm px-2 py-1 rounded ${kasinoFilter === k.id ? "bg-gray-200 font-medium" : "underline"}`}
              >
                {k.nazev}
              </Link>
            ))}
          </>
        )}
      </div>

      <section className="mb-8">
        <MapaMista mista={mistaMap} />
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Seznam míst</h2>
        {mistaRaw.length === 0 ? (
          <p className="text-gray-600">
            Žádná místa. Přidej je v Supabase (tabulka <code className="text-sm bg-gray-100 px-1">mista</code>) nebo
            spusť aktualizaci z Apify (Blok 14).
          </p>
        ) : (
          <ul className="space-y-3">
            {mistaRaw.map((m) => {
              const s = norm(m.sazkovky) as MistoRow["sazkovky"];
              const k = norm(m.kasina) as MistoRow["kasina"];
              return (
                <li key={m.id} className="border rounded-lg p-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500">{TYP_LABELS[m.typ]}</span>
                  <span className="font-medium">{m.nazev}</span>
                  {m.adresa && <span className="text-sm text-gray-600">{m.adresa}</span>}
                  {m.lat != null && m.lng != null && (
                    <a
                      href={`https://www.google.com/maps?q=${m.lat},${m.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Otevřít v mapě
                    </a>
                  )}
                  {(s?.affiliate_url_registrace || k?.affiliate_url) && (
                    <a
                      href={s?.affiliate_url_registrace ?? k?.affiliate_url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cta="registrace_mapa"
                      data-cta-label={s?.nazev ?? k?.nazev ?? ""}
                      className="ml-auto rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white hover:bg-gray-700"
                    >
                      Zaregistruj se online, než tam půjdeš
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
