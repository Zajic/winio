import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { OperatorForm } from "../../OperatorForm";
import { DeleteOperatorButton } from "../../DeleteOperatorButton";
import type { LoterieOperator } from "@/types/db";

export default async function AdminOperatorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("loterie_operatori").select("*").eq("id", id).single();
  if (!data) notFound();
  const op = data as LoterieOperator;

  return (
    <div>
      <Link href="/admin/loterie/operatori" className="text-sm text-blue-600 hover:underline">
        ← Operátoři
      </Link>
      <h1 className="text-2xl font-semibold my-6">Upravit: {op.nazev}</h1>
      <p className="text-sm mb-4">
        <Link href={`/admin/loterie/produkty?operator=${id}`} className="text-blue-600 underline">
          Produkty tohoto operátora →
        </Link>
      </p>
      <OperatorForm op={op} />
      <div className="mt-8 pt-6 border-t">
        <DeleteOperatorButton id={id} />
      </div>
    </div>
  );
}
