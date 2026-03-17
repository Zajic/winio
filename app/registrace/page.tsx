import type { Metadata } from "next";
import Link from "next/link";
import { RegistraceForm } from "./RegistraceForm";

export const metadata: Metadata = {
  title: "Registrace | Winio",
  description: "Vytvořte si účet. Newsletter, připomínky zápasů a preference.",
};

export default function RegistracePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-semibold mb-2">Registrace</h1>
      <p className="text-gray-600 mb-6">
        Zadejte e-mail a heslo. Po registraci můžete spravovat preference a připomínky zápasů.
      </p>
      <RegistraceForm />
      <p className="mt-4 text-sm text-gray-600">
        Už máte účet?{" "}
        <Link href="/prihlaseni" className="underline">
          Přihlásit se
        </Link>
      </p>
    </div>
  );
}
