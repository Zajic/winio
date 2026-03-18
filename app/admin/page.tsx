import Link from "next/link";

const SECTIONS: { href: string; title: string; desc: string }[] = [
  {
    href: "/admin/clanky",
    title: "Články",
    desc: "Blog, novinky, PR, zdrojové odkazy, CTA",
  },
  {
    href: "/admin/bannery",
    title: "Bannery",
    desc: "Obrázky, pozice, platnost",
  },
  {
    href: "/admin/sazkovky",
    title: "Sázkovky",
    desc: "Affiliate, bonusy, Odds API mapování",
  },
  {
    href: "/admin/kasina",
    title: "Kasina",
    desc: "Online kasina, licence, odkazy",
  },
  {
    href: "/admin/hry",
    title: "Hry",
    desc: "Automaty a hry + kde hrát (kasina)",
  },
  {
    href: "/admin/mista",
    title: "Místa",
    desc: "Pobočky a kasina na mapě, GPS, import ID",
  },
  {
    href: "/admin/zapasy",
    title: "Zápasy",
    desc: "Úprava zápasů a výsledků (cron doplňuje nové)",
  },
  {
    href: "/admin/poradna",
    title: "Poradna",
    desc: "FAQ, adiktologie, pomoc",
  },
  {
    href: "/admin/loterie",
    title: "Loterie",
    desc: "Operátoři, produkty, tahy",
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Administrace Winio</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Správa veřejného webu. Cron joby (RSS, kurzy, pobočky) běží na Vercelu – zde upravujete data v databázi.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block p-5 rounded-lg border border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm transition-shadow"
          >
            <h2 className="font-semibold text-lg">{s.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
          </Link>
        ))}
      </div>
      <section className="mt-10 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
        <strong>Mimo admin (zatím):</strong> uživatelské účty a připomínky (<code>user_preferences</code>,{" "}
        <code>pripominky</code>) – správa v Supabase podle potřeby. Kurzy u zápasů přicházejí z API; ruční úprava jen
        přes zápas (stav/výsledek), ne jednotlivé kurzy.
      </section>
    </div>
  );
}
