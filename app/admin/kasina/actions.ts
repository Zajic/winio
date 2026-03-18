"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

function bool(v: FormDataEntryValue | null) {
  return v === "on" || v === "true";
}

export async function createKasino(formData: FormData): Promise<{ error?: string; id?: string }> {
  const supabase = createAdminClient();
  const nazev = (formData.get("nazev") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  if (!nazev || !slug) return { error: "Název a slug jsou povinné." };

  const { data, error } = await supabase
    .from("kasina")
    .insert({
      nazev,
      slug,
      affiliate_url: (formData.get("affiliate_url") as string)?.trim() || null,
      popis: (formData.get("popis") as string)?.trim() || null,
      licence: (formData.get("licence") as string)?.trim() || null,
      aktivni: bool(formData.get("aktivni")),
      placene_umisteni: bool(formData.get("placene_umisteni")),
    })
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath("/kasina");
  revalidatePath("/admin/kasina");
  return { id: data.id };
}

export async function updateKasino(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const nazev = (formData.get("nazev") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  if (!nazev || !slug) return { error: "Název a slug jsou povinné." };
  const { data: old } = await supabase.from("kasina").select("slug").eq("id", id).single();

  const { error } = await supabase
    .from("kasina")
    .update({
      nazev,
      slug,
      affiliate_url: (formData.get("affiliate_url") as string)?.trim() || null,
      popis: (formData.get("popis") as string)?.trim() || null,
      licence: (formData.get("licence") as string)?.trim() || null,
      aktivni: bool(formData.get("aktivni")),
      placene_umisteni: bool(formData.get("placene_umisteni")),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/kasina");
  revalidatePath("/admin/kasina");
  if (old?.slug) revalidatePath(`/kasina/${old.slug}`);
  revalidatePath(`/kasina/${slug}`);
  return {};
}

export async function deleteKasino(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("kasina").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/kasina");
  revalidatePath("/admin/kasina");
  return {};
}
