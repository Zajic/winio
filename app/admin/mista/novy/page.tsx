import { createAdminClient } from "@/lib/supabase/admin";
import { MistoForm } from "../MistoForm";
import type { Sazkovka, Kasino } from "@/types/db";

export default async function NovyMistoPage() {
  const supabase = createAdminClient();
  const [{ data: sz }, { data: ks }] = await Promise.all([
    supabase.from("sazkovky").select("id, nazev").order("nazev"),
    supabase.from("kasina").select("id, nazev").order("nazev"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Nové místo</h1>
      <MistoForm sazkovky={(sz ?? []) as Sazkovka[]} kasina={(ks ?? []) as Kasino[]} />
    </div>
  );
}
