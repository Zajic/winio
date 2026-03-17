import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold">
            Winio
          </Link>
          <span className="text-xs text-gray-500" aria-hidden="true">
            18+
          </span>
        </div>
        <nav className="flex flex-wrap gap-4">
          <Link href="/sazkovky" className="text-sm hover:underline">
            Sázkovky
          </Link>
          <Link href="/kasina" className="text-sm hover:underline">
            Kasina
          </Link>
          <Link href="/hry" className="text-sm hover:underline">
            Hry
          </Link>
          <Link href="/bonusy" className="text-sm hover:underline">
            Bonusy
          </Link>
          <Link href="/zapasy" className="text-sm hover:underline">
            Zápasy
          </Link>
          <Link href="/clanky" className="text-sm hover:underline">
            Články
          </Link>
          <Link href="/mapa" className="text-sm hover:underline">
            Mapa
          </Link>
          <Link href="/safe-play" className="text-sm hover:underline">
            Safe Play
          </Link>
          <Link href="/poradna" className="text-sm hover:underline">
            Poradna
          </Link>
          {user ? (
            <>
              <Link href="/ucet" className="text-sm hover:underline">
                Můj účet
              </Link>
              <Link href="/odhlaseni" className="text-sm hover:underline">
                Odhlásit
              </Link>
            </>
          ) : (
            <>
              <Link href="/prihlaseni" className="text-sm hover:underline">
                Přihlásit
              </Link>
              <Link href="/registrace" className="text-sm hover:underline">
                Registrace
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
