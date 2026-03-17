import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UcetForm } from "./UcetForm";

export const metadata: Metadata = {
  title: "Můj účet | Winio",
  description: "Správa preferencí, newsletter a připomínky zápasů.",
};

export default async function UcetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/prihlaseni?redirect=/ucet");

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-semibold mb-2">Můj účet</h1>
      <p className="text-sm text-gray-500 mb-6">{user.email}</p>

      <UcetForm preferences={prefs} />

      <p className="mt-8 text-sm text-gray-600">
        <Link href="/odhlaseni" className="underline">
          Odhlásit se
        </Link>
      </p>
    </div>
  );
}
