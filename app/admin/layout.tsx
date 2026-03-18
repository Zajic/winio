import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { AdminNav } from "./_components/AdminNav";

export const metadata: Metadata = {
  title: "Administrace | Winio",
  description: "Správa webu Winio.",
};

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border rounded-lg p-8 max-w-md text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Přihlášení nutné</h1>
          <p className="text-gray-600 mb-6">
            Pro vstup do administrace se musíte přihlásit. Po přihlášení budete přesměrováni zpět na admin.
          </p>
          <Link
            href="/prihlaseni?redirect=/admin"
            className="inline-block rounded bg-gray-800 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-700"
          >
            Přejít na přihlášení
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdminEmail(user.email)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-red-600 mb-2">Přístup odepřen</h1>
        <p className="text-gray-600 mb-4">Nemáte oprávnění k administraci.</p>
        <Link href="/" className="text-blue-600 underline">
          Zpět na úvodní stránku
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AdminNav />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <Link href="/" className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener">
              Web →
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
