import Link from "next/link";

const LINKS: { href: string; label: string }[] = [
  { href: "/admin", label: "Přehled" },
  { href: "/admin/clanky", label: "Články" },
  { href: "/admin/bannery", label: "Bannery" },
  { href: "/admin/sazkovky", label: "Sázkovky" },
  { href: "/admin/kasina", label: "Kasina" },
  { href: "/admin/hry", label: "Hry" },
  { href: "/admin/mista", label: "Místa (mapa)" },
  { href: "/admin/zapasy", label: "Zápasy" },
  { href: "/admin/poradna", label: "Poradna" },
  { href: "/admin/loterie", label: "Loterie" },
];

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-x-4 gap-y-2 items-center text-sm">
      {LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
