import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { ClanekForm } from "../ClanekForm";
import type { Sazkovka, Kasino } from "@/types/db";

export default async function AdminClanekNovyPage() {
  const supabase = createAdminClient();
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
      <h1 className="text-2xl font-semibold mb-6">Nový článek</h1>
      <ClanekForm sazkovky={sazkovky} kasina={kasina} />
    </div>
  );
}
