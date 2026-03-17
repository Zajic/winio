import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Zapas } from "@/types/db";

const SPORT_LABELS: Record<string, string> = {
  fotbal: "Fotbal",
  hokej: "Hokej",
  mma: "MMA",
};

export default async function HomePage() {
  const supabase = await createClient();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const { data: dnesRows } = await supabase
    .from("zapasy")
    .select("id, sport, domaci_tym, hoste_tym, zacatek_at")
    .in("stav", ["nadchazejici", "live"])
    .gte("zacatek_at", startOfToday.toISOString())
    .lt("zacatek_at", endOfToday.toISOString())
    .order("zacatek_at", { ascending: true })
    .limit(5);

  const zapasyDnes = (dnesRows ?? []) as Zapas[];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Winio</h1>
      <p className="mb-8">
        Informační web o sázkách, kurzech a licencovaných operátorech. Obsah
        pouze pro osoby 18+.
      </p>

      {zapasyDnes.length > 0 && (
        <section className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-medium mb-3">
            <Link href="/zapasy?den=dnes" className="hover:underline">
              Zápasy dnes
            </Link>
          </h2>
          <ul className="space-y-2">
            {zapasyDnes.map((z) => (
              <li key={z.id}>
                <Link
                  href={`/zapasy/${z.id}`}
                  className="text-sm hover:underline"
                >
                  {z.domaci_tym} – {z.hoste_tym}
                  <span className="text-gray-500 ml-1">
                    ({SPORT_LABELS[z.sport] ?? z.sport},{" "}
                    {new Date(z.zacatek_at).toLocaleTimeString("cs-CZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    )
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm">
            <Link href="/zapasy" className="underline">
              Všechny zápasy →
            </Link>
          </p>
        </section>
      )}

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-2">Zápasy a kurzy</h2>
          <p className="text-gray-600">
            Přehled zápasů a srovnání kurzů. Filtr podle data a sportu, na detailu
            tabulka kurzů a CTA na sázkovou kancelář.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">Sázkové kanceláře</h2>
          <p className="text-gray-600">
            Katalog licencovaných sázkových kanceláří (Blok 2, 4).
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">Online kasina a hry</h2>
          <p className="text-gray-600">
            Katalog kasin a her (Blok 2, 5).
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">Články a blog</h2>
          <p className="text-gray-600">
            Zpravodajství a články (Blok 11–12).
          </p>
        </div>
      </section>
    </div>
  );
}
