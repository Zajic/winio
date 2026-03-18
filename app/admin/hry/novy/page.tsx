import { createAdminClient } from "@/lib/supabase/admin";
import { HraForm } from "../HraForm";
import type { Kasino } from "@/types/db";

export default async function NovaHraPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("kasina").select("id, nazev").order("nazev");
  const kasina = (data ?? []) as Kasino[];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Nová hra</h1>
      <HraForm kasina={kasina} vybraneKasinoIds={[]} />
    </div>
  );
}
