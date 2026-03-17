import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Obchodní podmínky | Winio",
  description:
    "Obchodní podmínky webu Winio. Pouze informační web – u nás nelze sázet ani hrát.",
};

export default function ObchodniPodminkyPage() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-2">Obchodní podmínky</h1>
      <p className="text-sm text-gray-600 mb-8">
        Účinnost: (doplnit datum). Provozovatel webu: (doplnit jméno nebo
        firmu, sídlo, IČO, kontakt).
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">1. Úvod a charakter služby</h2>
        <p className="mb-3">
          1.1. Tyto obchodní podmínky (dále jen „OP“) platí pro užívání webu{" "}
          <strong>Winio</strong> (dále jen „web“) a vztahují se na provozovatele
          webu a na uživatele.
        </p>
        <p className="mb-3">
          1.2. <strong>Web je výhradně informační.</strong> Poskytujeme informace
          o sázkách, kurzech, sázkových kancelářích, online kasinech a
          souvisejících tématech.{" "}
          <strong>Na tomto webu nelze sázet ani hrát hazardní hry.</strong>{" "}
          Neprovozujeme hazard, nepřijímáme sázky a neposkytujeme hry. Jsme
          pouze informační a mediální platforma.
        </p>
        <p>
          1.3. Odkazy na stránkách vedou na weby třetích stran (sázkové
          kanceláře, online kasina). Sázení a hraní probíhá výhradně u těchto
          provozovatelů, kteří mají příslušnou licenci. Za jejich služby a
          podmínky nenese provozovatel tohoto webu odpovědnost.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">2. Věk a omezení</h2>
        <p className="mb-3">
          2.1. Obsah webu je určen <strong>pouze osobám starším 18 let</strong>.
          Používáním webu uživatel potvrzuje, že dosáhl věku 18 let a že v
          jurisdikci, v níž se nachází, je mu sázení a hazardní hry přípustné.
        </p>
        <p>
          2.2. Provozovatel neumožňuje ani nepodporuje přístup k hazardu osobám
          mladším 18 let ani v rozporu s platnými zákony.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">3. Financování webu a reklama</h2>
        <p className="mb-3">
          3.1. Web je financován z <strong>affiliate spolupráce</strong> a{" "}
          <strong>placeného umístění</strong> (reklama, doporučení, PR články).
          Při kliknutí na určité odkazy a při registraci u partnerů může
          provozovatel obdržet provizi. To neovlivňuje obsah informací; snažíme
          se uvádět přehledné a srozumitelné údaje.
        </p>
        <p>
          3.2. <strong>Placené spolupráce</strong> (např. zvýrazněné umístění
          sázkovky nebo kasina, PR články) jsou na webu označeny (např.
          „Spolupráce“, „Placená spolupráce“). I u placeného obsahu odkazujeme
          pouze na provozovatele s platnou licencí.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">4. Odpovědnost</h2>
        <p className="mb-3">
          4.1. Informace na webu (kurzy, bonusy, nabídky) mohou být neúplné nebo
          zastaralé. Provozovatel neprodává služby sázkových kanceláří ani kasin
          a neodpovídá za jejich dostupnost, podmínky ani za výhry nebo ztráty
          uživatele u třetích stran.
        </p>
        <p>
          4.2. Uživatel používá odkazy na třetí strany na vlastní odpovědnost.
          Před registrací a sázením doporučujeme pročíst podmínky konkrétního
          provozovatele a zásady zodpovědného hraní.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">5. Zodpovědné hraní</h2>
        <p>
          5.1. Hazardní hry a sázení mohou být rizikové. Doporučujeme hrát pouze
          v rámci svých možností a v případě potíží vyhledat pomoc (např. linka
          pomoci, RUP – Rejstřík vyloučených osob). Na webu uvádíme odkazy na
          informace o blokacích a odbornou pomoc (sekce Safe Play / Poradna).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">6. Ochrana osobních údajů</h2>
        <p>
          6.1. Zpracování osobních údajů upravují{" "}
          <strong>Zásady ochrany osobních údajů</strong> (samostatný dokument).
          Používáním webu uživatel souhlasí s těmito zásadami v rozsahu, v jakém
          to zákon vyžaduje nebo dovoluje.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">7. Závěrečná ustanovení</h2>
        <p className="mb-3">
          7.1. Provozovatel si vyhrazuje právo OP měnit; změny budou zveřejněny
          na webu s uvedením účinnosti. Uživatel je povinen změny sledovat.
        </p>
        <p className="mb-3">
          7.2. Vztahy se řídí právem České republiky a právem Evropské unie.
          Případné spory řeší příslušný soud v České republice.
        </p>
        <p>
          7.3. V případě dotazů kontaktujte provozovatele na e-mailu uvedeném v
          kontaktech na webu.
        </p>
      </section>

      <p className="text-sm text-gray-600">
        Před zveřejněním doplňte údaje o provozovateli a datum účinnosti; v
        případě potřeby nechte text právně zkontrolovat.
      </p>
    </article>
  );
}
