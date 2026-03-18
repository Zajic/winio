import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { KasinoForm } from "../KasinoForm";
import { DeleteKasinoButton } from "../DeleteKasinoButton";
import type { Kasino } from "@/types/db";

export default async function AdminKasinoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("kasina").select("*").eq("id", id).single();
  if (!data) notFound();
  const k = data as Kasino;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Upravit: {k.nazev}</h1>
      <KasinoForm kasino={k} />
      <div className="mt-8 pt-6 border-t">
        <DeleteKasinoButton id={k.id} />
      </div>
    </div>
  );
}
