import type { Metadata } from "next";
import Link from "next/link";
import { PrihlaseniForm } from "./PrihlaseniForm";

export const metadata: Metadata = {
  title: "Přihlášení | Winio",
  description: "Přihlaste se ke svému účtu.",
};

type Props = { searchParams: Promise<{ registered?: string; redirect?: string }> };

export default async function PrihlaseniPage({ searchParams }: Props) {
  const { registered, redirect: redirectTo } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-semibold mb-2">Přihlášení</h1>
      {registered === "1" && (
        <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          Registrace proběhla. Nyní se můžete přihlásit. Pokud jste měli potvrdit e-mail, zkontrolujte
          schránku.
        </p>
      )}
      <p className="text-gray-600 mb-6">Zadejte e-mail a heslo.</p>
      <PrihlaseniForm redirectTo={redirectTo ?? ""} />
      <p className="mt-4 text-sm text-gray-600">
        Nemáte účet?{" "}
        <Link href="/registrace" className="underline">
          Registrovat se
        </Link>
      </p>
    </div>
  );
}
