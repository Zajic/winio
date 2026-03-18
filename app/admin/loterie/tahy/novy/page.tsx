import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { NovyTahForm } from "./NovyTahForm";

type P = {
  id: string;
  nazev: string;
  loterie_operatori: { nazev: string } | null;
};

export default async function NovyTahPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("loterie_produkty")
    .select("id, nazev, loterie_operatori(nazev)")
    .order("nazev");

  return (
    <div>
      <Link href="/admin/loterie/tahy" className="text-sm text-blue-600 hover:underline">
        ← Tahy
      </Link>
      <h1 className="text-2xl font-semibold my-6">Nový tah</h1>
      <NovyTahForm produkty={(data ?? []) as unknown as P[]} />
    </div>
  );
}
