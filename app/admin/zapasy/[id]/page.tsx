import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ZapasForm } from "../ZapasForm";
import type { Zapas } from "@/types/db";

export default async function AdminZapasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("zapasy").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Upravit zápas: {(data as Zapas).domaci_tym} – {(data as Zapas).hoste_tym}
      </h1>
      <ZapasForm zapas={data as Zapas} />
    </div>
  );
}
