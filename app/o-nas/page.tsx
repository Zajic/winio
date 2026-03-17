import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "O nás | Jak nás podporujete | Winio",
  description:
    "Winio je pouze informační web. Financujeme se z affiliate a placeného umístění. U nás nelze sázet ani hrát.",
};

export default function ONasPage() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">O nás / Jak nás podporujete</h1>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">Kdo jsme</h2>
        <p>
          Winio je <strong>informační web</strong> o sázkách, kurzech, sázkových
          kancelářích a online kasinech. Shromažďujeme přehledy, srovnání kurzů
          a odkazujeme na licencované provozovatele.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">Žádné hraní u nás</h2>
        <p>
          <strong>Na tomto webu nelze sázet ani hrát hazardní hry.</strong>{" "}
          Neprovozujeme hazard, nepřijímáme sázky a neposkytujeme hry. Jsme
          pouze mediální platforma – poskytujeme informace a odkazy. Sázení a
          hraní probíhá výhradně u třetích stran (sázkové kanceláře, kasina),
          které mají příslušnou licenci.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">Jak nás podporujete (financování)</h2>
        <p className="mb-3">
          Web se financuje z těchto zdrojů:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-3">
          <li>
            <strong>Affiliate spolupráce</strong> – při kliknutí na odkazy k
            sázkovým kancelářím nebo kasinům a při registraci u nich můžeme
            obdržet provizi. To neovlivňuje obsah; uvádíme přehledné informace.
          </li>
          <li>
            <strong>Placené umístění</strong> – někteří provozovatelé si mohou
            objednat zvýrazněné umístění nebo PR obsah. Takový obsah je na webu
            vždy označen (např. „Spolupráce“, „Placená spolupráce“).
          </li>
        </ul>
        <p>
          I u placeného umístění odkazujeme pouze na provozovatele s platnou
          licencí (EU/ČR). Žádné černé herny.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">Kontakt a právní dokumenty</h2>
        <p className="mb-3">
          Více najdete v{" "}
          <Link href="/obchodni-podminky" className="underline">
            Obchodních podmínkách
          </Link>{" "}
          a v{" "}
          <Link href="/ochrana-osobnich-udaju" className="underline">
            Zásadách ochrany osobních údajů
          </Link>
          .
        </p>
        <p className="text-sm text-gray-600">
          Údaje o provozovateli (jméno, sídlo, kontakt) doplníme před
          zveřejněním.
        </p>
      </section>
    </article>
  );
}
