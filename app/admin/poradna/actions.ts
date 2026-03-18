"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PoradnaKategorie } from "@/types/db";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createPoradna(formData: FormData): Promise<{ error?: string; id?: string }> {
  const supabase = createAdminClient();
  const titul = (formData.get("titul") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim() || slugify(titul || "");
  if (!titul || !slug) return { error: "Titulek a slug jsou povinné." };

  const { data, error } = await supabase
    .from("poradna")
    .insert({
      titul,
      slug,
      telo: (formData.get("telo") as string)?.trim() || null,
      kategorie: (formData.get("kategorie") as PoradnaKategorie) || "faq",
      razeni: parseInt(String(formData.get("razeni") || "0"), 10) || 0,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath("/poradna");
  revalidatePath("/admin/poradna");
  return { id: data.id };
}

export async function updatePoradna(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const titul = (formData.get("titul") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  if (!titul || !slug) return { error: "Titulek a slug jsou povinné." };

  const { data: old } = await supabase.from("poradna").select("slug").eq("id", id).single();

  const { error } = await supabase
    .from("poradna")
    .update({
      titul,
      slug,
      telo: (formData.get("telo") as string)?.trim() || null,
      kategorie: (formData.get("kategorie") as PoradnaKategorie) || "faq",
      razeni: parseInt(String(formData.get("razeni") || "0"), 10) || 0,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/poradna");
  if (old?.slug) revalidatePath(`/poradna/${old.slug}`);
  revalidatePath(`/poradna/${slug}`);
  revalidatePath("/admin/poradna");
  return {};
}

export async function deletePoradna(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("poradna").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/poradna");
  revalidatePath("/admin/poradna");
  return {};
}
