import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů | Winio",
  description:
    "Zásady ochrany osobních údajů webu Winio v souladu s GDPR.",
};

export default function OchranaOsobnichUdajuPage() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-2">
        Zásady ochrany osobních údajů (GDPR)
      </h1>
      <p className="text-sm text-gray-600 mb-8">
        Účinnost: (doplnit datum). Provozovatel (správce údajů): (doplnit
        jméno nebo firmu, sídlo, IČO, e-mail).
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">1. Úvod</h2>
        <p className="mb-3">
          1.1. Tyto zásady popisují, jak na webu <strong>Winio</strong>{" "}
          zpracováváme osobní údaje v souladu s nařízením EU 2016/679 (GDPR) a
          zákonem o ochraně osobních údajů.
        </p>
        <p>
          1.2. Správcem osobních údajů je provozovatel webu (kontakt níže).
          Údaje zpracováváme pouze v rozsahu a k účelům uvedeným níže.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">
          2. Jaké údaje zpracováváme a proč
        </h2>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Účel</th>
                <th className="border border-gray-300 p-2 text-left">Údaje</th>
                <th className="border border-gray-300 p-2 text-left">
                  Právní základ
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Doba uchování
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">
                  Provoz webu (logy)
                </td>
                <td className="border border-gray-300 p-2">
                  IP adresa, čas přístupu, URL
                </td>
                <td className="border border-gray-300 p-2">
                  Oprávněný zájem (bezpečnost, provoz)
                </td>
                <td className="border border-gray-300 p-2">
                  Obvykle do 30 dnů
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Cookie (preference)
                </td>
                <td className="border border-gray-300 p-2">
                  Volba souhlasu s cookies (ano/ne), datum
                </td>
                <td className="border border-gray-300 p-2">Souhlas</td>
                <td className="border border-gray-300 p-2">
                  Do odvolání souhlasu (uloženo v prohlížeči)
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Registrace / účet
                </td>
                <td className="border border-gray-300 p-2">
                  E-mail, heslo (hash), preference (oblíbené týmy, ligy)
                </td>
                <td className="border border-gray-300 p-2">
                  Plnění smlouvy / souhlas
                </td>
                <td className="border border-gray-300 p-2">
                  Po dobu trvání účtu; po smazání do 30 dnů
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Newsletter / notifikace
                </td>
                <td className="border border-gray-300 p-2">E-mail</td>
                <td className="border border-gray-300 p-2">Souhlas</td>
                <td className="border border-gray-300 p-2">
                  Do odhlášení; poté vymazány nebo anonymizovány
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Připomínky zápasů
                </td>
                <td className="border border-gray-300 p-2">
                  E-mail, výběr zápasu, čas odeslání
                </td>
                <td className="border border-gray-300 p-2">Souhlas</td>
                <td className="border border-gray-300 p-2">
                  Do odhlášení nebo smazání účtu
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          2.1. Na webu neprodáváme zboží ani služby vyžadující platební údaje.
          E-mail a údaje k účtu pouze v případě registrace a odběru newsletteru /
          připomínek se souhlasem.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">3. Cookies a podobné technologie</h2>
        <p className="mb-3">
          3.1. <strong>Cookies</strong> jsou malé soubory ukládané v prohlížeči.
          Používáme je např. k: uložení vaší volby ohledně cookies (souhlas /
          odmítnutí), zajištění funkčnosti webu (přihlášení), analýze
          návštěvnosti (pokud jste udělili souhlas).
        </p>
        <p className="mb-3">
          3.2. Při první návštěvě vás žádáme o souhlas s volitelnými cookies.
          Technicky nutné cookies nevyžadují souhlas, ale můžete je v prohlížeči
          omezit – část webu pak nemusí fungovat správně.
        </p>
        <p>
          3.3. Souhlas můžete kdykoli změnit (odkaz v patičce). Odvolání
          souhlasu neovlivní zákonnost zpracování před odvoláním.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">4. Příjemci a předávání údajů</h2>
        <p className="mb-3">
          4.1. Údaje mohou být zpřístupněny poskytovatelům služeb nezbytným pro
          provoz webu (hosting, databáze, e-mail). Tito zpracovatelé jsou vázáni
          smlouvou a zpracovávají údaje podle našich pokynů a v souladu s GDPR.
        </p>
        <p className="mb-3">
          4.2. <strong>Nepředáváme vaše údaje</strong> (e-mail, IP) sázkovým
          kancelářím ani kasinům pro jejich marketing. Odkazy na jejich weby
          vás přesměrují na jejich stránky; jejich zpracování se řídí jejich
          zásadami.
        </p>
        <p>
          4.3. Údaje nejsou předávány do třetích zemí mimo EHP, ledaže je
          zajištěn odpovídající standard.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">5. Vaše práva</h2>
        <p className="mb-3">5.1. V rozsahu daném zákonem máte právo:</p>
        <ul className="list-disc pl-6 space-y-1 mb-3">
          <li>přístup k osobním údajům, které o vás zpracováváme,</li>
          <li>opravu nepřesných údajů,</li>
          <li>výmaz („právo být zapomenut“), pokud neplatí výjimka,</li>
          <li>omezení zpracování v určitých případech,</li>
          <li>námitku proti zpracování založenému na oprávněném zájmu,</li>
          <li>přenosnost údajů v běžném formátu,</li>
          <li>odvolat souhlas kdykoli.</li>
        </ul>
        <p>
          5.2. Práva můžete uplatnit e-mailem na kontakt uvedený na webu. Máte
          také právo podat stížnost u dozorového úřadu (Úřad pro ochranu
          osobních údajů, www.uoou.cz).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">6. Bezpečnost</h2>
        <p>
          6.1. Údaje chráníme technickými a organizačními opatřeními (šifrování,
          přístupová práva, zabezpečený hosting). Přihlašovací údaje k účtu jsou
          ukládány v podobě, která neumožňuje jejich zpětné zjištění (hash).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">7. Kontakt</h2>
        <p>
          7.1. Dotazy k ochraně osobních údajů a uplatnění práv: (doplnit
          e-mail provozovatele).
        </p>
      </section>

      <p className="text-sm text-gray-600">
        Před zveřejněním doplňte údaje o správci a kontakt; v případě potřeby
        nechte text právně zkontrolovat.
      </p>
    </article>
  );
}
