import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Safe Play | Zodpovědné hraní | Winio",
  description:
    "Blokace, RUP, kontakty na pomoc. Zodpovědné sázení a hraní. Adiktologie a poradenství.",
};

export default function SafePlayPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-2">Safe Play</h1>
      <p className="text-gray-600 mb-8">
        Zodpovědné sázení a hraní. Informace o blokaci, RUP a kde hledat pomoc.
      </p>

      <nav className="mb-8 flex flex-wrap gap-2">
        <a href="#blokace" className="text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200">
          Blokace
        </a>
        <a href="#rup" className="text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200">
          RUP
        </a>
        <a href="#pomoc" className="text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200">
          Kontakty na pomoc
        </a>
        <a href="#adiktologie" className="text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200">
          Adiktologie
        </a>
        <a href="#poradenstvi" className="text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200">
          Poradenství
        </a>
        <Link href="/poradna" className="text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200">
          Poradna (FAQ)
        </Link>
      </nav>

      <section id="blokace" className="mb-8">
        <h2 className="text-lg font-medium mb-2">Blokace</h2>
        <p className="text-gray-700">
          Většina licencovaných sázkových kanceláří a kasin v ČR nabízí možnost trvalé nebo dočasné
          blokace účtu. Blokaci lze obvykle nastavit v nastavení účtu na webu operátora nebo
          po požádání zákaznické podpory. Trvalá blokace (vyloučení) je vhodná, pokud si přejete
          zamezit přístup ke sázení nebo hraní.
        </p>
      </section>

      <section id="rup" className="mb-8">
        <h2 className="text-lg font-medium mb-2">RUP (Registr účelově vyloučených osob)</h2>
        <p className="text-gray-700">
          RUP spravuje Ministerstvo financí ČR. Do registru se lze dobrovolně zapsat a operátoři
          s licencí v ČR jsou povinni zkontrolovat RUP před umožněním hry nebo sázení. Více
          informací a návod na zápis najdete na oficiálních stránkách{" "}
          <a
            href="https://www.mfcr.cz/cs/hazardni-hry/registr-ucelove-vyloucenych-osob"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Ministerstva financí
          </a>
          .
        </p>
      </section>

      <section id="pomoc" className="mb-8">
        <h2 className="text-lg font-medium mb-2">Kontakty na pomoc</h2>
        <p className="text-gray-700 mb-2">
          Pokud máte pocit, že sázení nebo hraní negativně ovlivňuje váš život, můžete se obrátit na:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>
            <strong>Linka první pomoci:</strong> 116 111 (bezplatně, nonstop)
          </li>
          <li>
            <strong>Národní linka pro odvykání:</strong> 800 350 000 (bezplatně)
          </li>
          <li>
            Adiktologické ambulance a poradny ve vašem regionu (vyhledejte např. přes Národní
            ústav duševního zdraví nebo krajské úřady).
          </li>
        </ul>
      </section>

      <section id="adiktologie" className="mb-8">
        <h2 className="text-lg font-medium mb-2">Adiktologie</h2>
        <p className="text-gray-700">
          Závislost na hazardu je uznávaná diagnóza. Léčba a poradenství jsou dostupné v síti
          adiktologických služeb. Neváhejte vyhledat odborníka – včasná pomoc zvyšuje šanci na
          zvládnutí problému.
        </p>
      </section>

      <section id="poradenstvi" className="mb-8">
        <h2 className="text-lg font-medium mb-2">Poradenství</h2>
        <p className="text-gray-700">
          Poradny pro závislosti (včetně gamblingu) nabízejí konzultace, podporu a plánování
          změny. Služby mohou být bezplatné nebo placené podle zařízení. Více témat najdete v naší{" "}
          <Link href="/poradna" className="text-blue-600 underline">
            Poradně
          </Link>
          .
        </p>
      </section>

      <p className="text-sm text-gray-600 border-t pt-6">
        <Link href="/poradna" className="underline">
          Časté dotazy a další texty v Poradně
        </Link>
        {" · "}
        <Link href="/sazkovky" className="underline">
          Kde vsadit (licencované sázkovky)
        </Link>
      </p>
    </div>
  );
}
