import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { WinioLogo } from "@/components/WinioLogo";
import { HeaderTicker } from "@/components/HeaderTicker";

const navClass =
  "text-sm text-slate-300 transition hover:text-cyan-400 whitespace-nowrap";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user ? isAdminEmail(user.email) : false;

  const { data: tickerRows } = await supabase
    .from("clanky")
    .select("titul")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(4);

  const tickerFromDb = (tickerRows ?? []).map((r) => r.titul).filter(Boolean) as string[];
  const tickerItems = [
    "18+ Winio je informační portál – u nás nelze sázet, jen porovnávat a přecházet k licencovaným provozovatelům.",
    ...tickerFromDb,
    "Sázejte zodpovědně. Ministerstvo financí varuje: účast na hazardní hře může vést ke vzniku závislosti.",
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-winio-border bg-winio-navy/95 backdrop-blur-md">
      <HeaderTicker items={tickerItems} />
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-4">
          <WinioLogo />
          <span className="hidden rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400 sm:inline">
            18+
          </span>
        </div>

        <nav
          className="order-3 flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-winio-border pt-3 sm:order-none sm:w-auto sm:border-0 sm:pt-0 md:justify-end"
          aria-label="Hlavní menu"
        >
          <Link href="/zapasy" className={navClass}>
            Kurzy
          </Link>
          <Link href="/kasina" className={navClass}>
            Kasina
          </Link>
          <Link href="/bonusy" className={navClass}>
            Bonusy
          </Link>
          <Link href="/clanky" className={navClass}>
            Novinky
          </Link>
          <span className="hidden h-4 w-px bg-winio-border sm:block" aria-hidden />
          <Link href="/sazkovky" className={`${navClass} text-slate-500`}>
            Sázkovky
          </Link>
          <Link href="/hry" className={`${navClass} text-slate-500`}>
            Hry
          </Link>
          <Link href="/loterie" className={`${navClass} text-slate-500`}>
            Loterie
          </Link>
          <Link href="/mapa" className={`${navClass} text-slate-500`}>
            Mapa
          </Link>
          <Link href="/poradna" className={`${navClass} text-slate-500`}>
            Pomoc
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-lg border border-cyan-500/30 px-3 py-1.5 text-cyan-400 transition hover:bg-cyan-500/10"
                >
                  Admin
                </Link>
              )}
              <Link href="/ucet" className="text-slate-400 hover:text-white">
                Účet
              </Link>
              <Link href="/odhlaseni" className="text-slate-500 hover:text-slate-300">
                Odhlásit
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/prihlaseni"
                className="text-slate-400 transition hover:text-white"
              >
                Přihlásit
              </Link>
              <Link
                href="/registrace"
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 px-4 py-2 text-sm font-semibold text-winio-navy shadow-glow-sm transition hover:opacity-90"
              >
                Registrace
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
