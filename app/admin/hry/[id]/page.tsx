import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { HraForm } from "../HraForm";
import { DeleteHraButton } from "../DeleteHraButton";
import type { Hra, Kasino } from "@/types/db";

export default async function AdminHraDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: hra } = await supabase.from("hry").select("*").eq("id", id).single();
  if (!hra) notFound();
  const h = hra as Hra;

  const { data: kasinaRows } = await supabase.from("kasina").select("id, nazev").order("nazev");
  const { data: hk } = await supabase.from("hry_kasina").select("kasino_id").eq("hra_id", id);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Upravit: {h.nazev}</h1>
      <HraForm
        hra={h}
        kasina={(kasinaRows ?? []) as Kasino[]}
        vybraneKasinoIds={(hk ?? []).map((r: { kasino_id: string }) => r.kasino_id)}
      />
      <div className="mt-8 pt-6 border-t">
        <DeleteHraButton id={h.id} />
      </div>
    </div>
  );
}
