import Link from "next/link";

export default function AdminLoterieHubPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Loterie</h1>
      <p className="text-gray-600 mb-8">Provozovatelé, hry/produkty a tahy (výsledky losování).</p>
      <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
        <Link
          href="/admin/loterie/operatori"
          className="block p-5 rounded-lg border bg-white hover:border-gray-400"
        >
          <h2 className="font-medium">Operátoři</h2>
          <p className="text-sm text-gray-500 mt-1">Allwyn, menší provozovatelé</p>
        </Link>
        <Link
          href="/admin/loterie/produkty"
          className="block p-5 rounded-lg border bg-white hover:border-gray-400"
        >
          <h2 className="font-medium">Produkty</h2>
          <p className="text-sm text-gray-500 mt-1">Sportka, Eurojackpot…</p>
        </Link>
        <Link
          href="/admin/loterie/tahy"
          className="block p-5 rounded-lg border bg-white hover:border-gray-400"
        >
          <h2 className="font-medium">Tahy</h2>
          <p className="text-sm text-gray-500 mt-1">Zapsat výsledek losování</p>
        </Link>
      </div>
    </div>
  );
}
