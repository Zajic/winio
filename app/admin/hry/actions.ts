"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TypHry } from "@/types/db";

function kasinoIds(formData: FormData): string[] {
  return formData.getAll("kasino_ids").map(String).filter(Boolean);
}

export async function createHra(formData: FormData): Promise<{ error?: string; id?: string }> {
  const supabase = createAdminClient();
  const nazev = (formData.get("nazev") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const typ = (formData.get("typ") as TypHry) || "automat";
  if (!nazev || !slug) return { error: "Název a slug jsou povinné." };

  const { data: hra, error } = await supabase
    .from("hry")
    .insert({
      nazev,
      slug,
      typ,
      popis: (formData.get("popis") as string)?.trim() || null,
      obrazek_url: (formData.get("obrazek_url") as string)?.trim() || null,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  const ids = kasinoIds(formData);
  if (ids.length > 0) {
    await supabase.from("hry_kasina").insert(ids.map((kasino_id) => ({ hra_id: hra.id, kasino_id })));
  }
  revalidatePath("/hry");
  revalidatePath("/admin/hry");
  return { id: hra.id };
}

export async function updateHra(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const nazev = (formData.get("nazev") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const typ = (formData.get("typ") as TypHry) || "automat";
  if (!nazev || !slug) return { error: "Název a slug jsou povinné." };

  const { data: old } = await supabase.from("hry").select("slug").eq("id", id).single();

  const { error } = await supabase
    .from("hry")
    .update({
      nazev,
      slug,
      typ,
      popis: (formData.get("popis") as string)?.trim() || null,
      obrazek_url: (formData.get("obrazek_url") as string)?.trim() || null,
    })
    .eq("id", id);
  if (error) return { error: error.message };

  await supabase.from("hry_kasina").delete().eq("hra_id", id);
  const ids = kasinoIds(formData);
  if (ids.length > 0) {
    await supabase.from("hry_kasina").insert(ids.map((kasino_id) => ({ hra_id: id, kasino_id })));
  }
  revalidatePath("/hry");
  revalidatePath("/admin/hry");
  if (old?.slug) revalidatePath(`/hry/${old.slug}`);
  revalidatePath(`/hry/${slug}`);
  return {};
}

export async function deleteHra(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("hry").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/hry");
  revalidatePath("/admin/hry");
  return {};
}
