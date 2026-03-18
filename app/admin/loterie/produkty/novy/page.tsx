import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProduktForm } from "../../ProduktForm";
import type { LoterieOperator } from "@/types/db";

export default async function NovyProduktPage({
  searchParams,
}: {
  searchParams: Promise<{ operator_id?: string }>;
}) {
  const { operator_id } = await searchParams;
  const supabase = createAdminClient();
  const { data } = await supabase.from("loterie_operatori").select("id, nazev").order("poradi");

  return (
    <div>
      <Link href="/admin/loterie/produkty" className="text-sm text-blue-600 hover:underline">
        ← Produkty
      </Link>
      <h1 className="text-2xl font-semibold my-6">Nový produkt</h1>
      <ProduktForm operatori={(data ?? []) as LoterieOperator[]} defaultOperatorId={operator_id} />
    </div>
  );
}
