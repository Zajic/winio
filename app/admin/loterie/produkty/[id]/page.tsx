import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProduktForm } from "../../ProduktForm";
import { DeleteProduktButton } from "../../DeleteProduktButton";
import type { LoterieOperator, LoterieProdukt } from "@/types/db";

export default async function AdminProduktDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: produkt } = await supabase.from("loterie_produkty").select("*").eq("id", id).single();
  if (!produkt) notFound();
  const { data: op } = await supabase.from("loterie_operatori").select("id, nazev").order("poradi");

  return (
    <div>
      <Link href="/admin/loterie/produkty" className="text-sm text-blue-600 hover:underline">
        ← Produkty
      </Link>
      <h1 className="text-2xl font-semibold my-6">Upravit produkt</h1>
      <ProduktForm operatori={(op ?? []) as LoterieOperator[]} produkt={produkt as LoterieProdukt} />
      <div className="mt-8 pt-6 border-t">
        <DeleteProduktButton id={id} />
      </div>
    </div>
  );
}
