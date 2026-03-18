import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-sm text-gray-600 mb-4">
          Obsah pouze pro osoby starší 18 let. Hazardní hry a sázení mohou být
          rizikové.
        </p>
        <nav className="flex flex-wrap gap-4 text-sm">
          <Link href="/obchodni-podminky" className="hover:underline">
            Obchodní podmínky
          </Link>
          <Link href="/ochrana-osobnich-udaju" className="hover:underline">
            Ochrana osobních údajů
          </Link>
          <Link href="/safe-play" className="hover:underline">
            Safe Play
          </Link>
          <Link href="/poradna" className="hover:underline">
            Poradna
          </Link>
          <Link href="/loterie" className="hover:underline">
            Loterie
          </Link>
          <Link href="/o-nas" className="hover:underline">
            O nás
          </Link>
          <Link href="/admin" className="hover:underline text-gray-400">
            Administrace
          </Link>
        </nav>
      </div>
    </footer>
  );
}
