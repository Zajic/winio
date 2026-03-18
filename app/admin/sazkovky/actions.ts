"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

function bool(v: FormDataEntryValue | null) {
  return v === "on" || v === "true";
}

export async function createSazkovka(formData: FormData): Promise<{ error?: string; id?: string }> {
  const supabase = createAdminClient();
  const nazev = (formData.get("nazev") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  if (!nazev || !slug) return { error: "Název a slug jsou povinné." };

  const row = {
    nazev,
    slug,
    affiliate_url_registrace: (formData.get("affiliate_url_registrace") as string)?.trim() || null,
    affiliate_param: (formData.get("affiliate_param") as string)?.trim() || null,
    popis: (formData.get("popis") as string)?.trim() || null,
    logo_url: (formData.get("logo_url") as string)?.trim() || null,
    licence: (formData.get("licence") as string)?.trim() || null,
    aktivni: bool(formData.get("aktivni")),
    poradi_zobrazeni: parseInt(String(formData.get("poradi_zobrazeni") || "0"), 10) || 0,
    placene_umisteni: bool(formData.get("placene_umisteni")),
    bonus_uvodni: (formData.get("bonus_uvodni") as string)?.trim() || null,
    bonus_popis: (formData.get("bonus_popis") as string)?.trim() || null,
    freebet: (formData.get("freebet") as string)?.trim() || null,
    external_id: (formData.get("external_id") as string)?.trim() || null,
  };

  const { data, error } = await supabase.from("sazkovky").insert(row).select("id").single();
  if (error) return { error: error.message };
  revalidatePath("/sazkovky");
  revalidatePath("/admin/sazkovky");
  return { id: data.id };
}

export async function updateSazkovka(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const nazev = (formData.get("nazev") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  if (!nazev || !slug) return { error: "Název a slug jsou povinné." };

  const { data: old } = await supabase.from("sazkovky").select("slug").eq("id", id).single();

  const row = {
    nazev,
    slug,
    affiliate_url_registrace: (formData.get("affiliate_url_registrace") as string)?.trim() || null,
    affiliate_param: (formData.get("affiliate_param") as string)?.trim() || null,
    popis: (formData.get("popis") as string)?.trim() || null,
    logo_url: (formData.get("logo_url") as string)?.trim() || null,
    licence: (formData.get("licence") as string)?.trim() || null,
    aktivni: bool(formData.get("aktivni")),
    poradi_zobrazeni: parseInt(String(formData.get("poradi_zobrazeni") || "0"), 10) || 0,
    placene_umisteni: bool(formData.get("placene_umisteni")),
    bonus_uvodni: (formData.get("bonus_uvodni") as string)?.trim() || null,
    bonus_popis: (formData.get("bonus_popis") as string)?.trim() || null,
    freebet: (formData.get("freebet") as string)?.trim() || null,
    external_id: (formData.get("external_id") as string)?.trim() || null,
  };

  const { error } = await supabase.from("sazkovky").update(row).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/sazkovky");
  revalidatePath("/admin/sazkovky");
  if (old?.slug) revalidatePath(`/sazkovky/${old.slug}`);
  revalidatePath(`/sazkovky/${slug}`);
  return {};
}

export async function deleteSazkovka(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("sazkovky").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/sazkovky");
  revalidatePath("/admin/sazkovky");
  return {};
}
