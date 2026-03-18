import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { MistoForm } from "../MistoForm";
import { DeleteMistoButton } from "../DeleteMistoButton";
import type { Misto, Sazkovka, Kasino } from "@/types/db";

export default async function AdminMistoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: misto } = await supabase.from("mista").select("*").eq("id", id).single();
  if (!misto) notFound();
  const [{ data: sz }, { data: ks }] = await Promise.all([
    supabase.from("sazkovky").select("id, nazev").order("nazev"),
    supabase.from("kasina").select("id, nazev").order("nazev"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Upravit místo</h1>
      <MistoForm misto={misto as Misto} sazkovky={(sz ?? []) as Sazkovka[]} kasina={(ks ?? []) as Kasino[]} />
      <div className="mt-8 pt-6 border-t">
        <DeleteMistoButton id={id} />
      </div>
    </div>
  );
}
