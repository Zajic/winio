import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { SazkovkaForm } from "../SazkovkaForm";
import { DeleteSazkovkaButton } from "../DeleteSazkovkaButton";
import type { Sazkovka } from "@/types/db";

type Props = { params: Promise<{ id: string }> };

export default async function AdminSazkovkaDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("sazkovky").select("*").eq("id", id).single();
  if (error || !data) notFound();
  const s = data as Sazkovka;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Upravit: {s.nazev}</h1>
      <SazkovkaForm sazkovka={s} />
      <div className="mt-8 pt-6 border-t">
        <DeleteSazkovkaButton id={s.id} />
      </div>
    </div>
  );
}
