import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { PoradnaForm } from "../PoradnaForm";
import { DeletePoradnaButton } from "../DeletePoradnaButton";
import type { Poradna } from "@/types/db";

export default async function AdminPoradnaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("poradna").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Upravit poradnu</h1>
      <PoradnaForm polozka={data as Poradna} />
      <div className="mt-8 pt-6 border-t">
        <DeletePoradnaButton id={id} />
      </div>
    </div>
  );
}
