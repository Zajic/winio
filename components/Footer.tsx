import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-winio-border bg-winio-navy-light">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <p className="font-display text-lg font-bold text-white">
              WINI<span className="text-cyan-400">O</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Winio.cz je výhradně informační portál. Neprovozujeme sázení ani hazardní hry.
              Obsah pouze pro osoby starší 18 let. Hazard může způsobit závislost – hrajte
              zodpovědně.
            </p>
            <p className="mt-4 text-xs text-slate-500">
              © {new Date().getFullYear()} Winio.cz. Všechna práva vyhrazena.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-10">
            <nav className="flex flex-col gap-2 text-sm" aria-label="Odkazy v patičce">
              <Link href="/obchodni-podminky" className="text-slate-400 hover:text-cyan-400">
                Obchodní podmínky
              </Link>
              <Link href="/ochrana-osobnich-udaju" className="text-slate-400 hover:text-cyan-400">
                Ochrana údajů
              </Link>
              <Link href="/safe-play" className="text-slate-400 hover:text-cyan-400">
                Safe Play
              </Link>
              <Link href="/o-nas" className="text-slate-400 hover:text-cyan-400">
                O nás
              </Link>
            </nav>
            <Link
              href="/poradna"
              className="inline-flex items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/5 px-5 py-3 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/15"
            >
              Centrum pomoci
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
