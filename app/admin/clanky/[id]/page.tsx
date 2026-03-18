import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ClanekForm } from "../ClanekForm";
import { DeleteClanekButton } from "../DeleteClanekButton";
import type { Clanky, Sazkovka, Kasino } from "@/types/db";

type Props = { params: Promise<{ id: string }> };

export default async function AdminClanekEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: clanek, error } = await supabase
    .from("clanky")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !clanek) notFound();

  const [sazkovkyRes, kasinaRes] = await Promise.all([
    supabase.from("sazkovky").select("id, nazev").eq("aktivni", true).order("nazev"),
    supabase.from("kasina").select("id, nazev").eq("aktivni", true).order("nazev"),
  ]);
  const sazkovky = (sazkovkyRes.data ?? []) as Sazkovka[];
  const kasina = (kasinaRes.data ?? []) as Kasino[];

  return (
    <div>
      <p className="mb-4">
        <Link href="/admin/clanky" className="text-blue-600 hover:underline">
          ← Zpět na články
        </Link>
      </p>
      <h1 className="text-2xl font-semibold mb-6">Upravit článek</h1>
      <ClanekForm
        sazkovky={sazkovky}
        kasina={kasina}
        clanek={clanek as Clanky}
      />
      <div className="mt-8 pt-6 border-t border-gray-200">
        <DeleteClanekButton id={id} />
      </div>
    </div>
  );
}
