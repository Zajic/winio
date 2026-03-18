"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TypClanku } from "@/types/db";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createClanek(formData: FormData): Promise<{ error?: string; id?: string }> {
  const supabase = createAdminClient();
  const titul = (formData.get("titul") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || slugify(titul || "");
  const typ = (formData.get("typ") as TypClanku) || "blog";
  const perex = (formData.get("perex") as string)?.trim() || null;
  const telo = (formData.get("telo") as string)?.trim() || null;
  const publishedAtRaw = (formData.get("published_at") as string)?.trim();
  const published_at = publishedAtRaw ? new Date(publishedAtRaw).toISOString() : null;
  const je_placena_spoluprace = formData.get("je_placena_spoluprace") === "on";
  const affiliate_cta_sazkovka_id = (formData.get("affiliate_cta_sazkovka_id") as string)?.trim() || null;
  const affiliate_cta_kasino_id = (formData.get("affiliate_cta_kasino_id") as string)?.trim() || null;
  const zdroj_url = (formData.get("zdroj_url") as string)?.trim() || null;
  const zdroj_nazev = (formData.get("zdroj_nazev") as string)?.trim() || null;

  if (!titul) return { error: "Titulek je povinný." };

  const { data, error } = await supabase
    .from("clanky")
    .insert({
      titul,
      slug: slug || slugify(titul),
      typ,
      perex,
      telo,
      published_at,
      je_placena_spoluprace,
      affiliate_cta_sazkovka_id: affiliate_cta_sazkovka_id || null,
      affiliate_cta_kasino_id: affiliate_cta_kasino_id || null,
      zdroj_url,
      zdroj_nazev,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/admin/clanky");
  revalidatePath("/clanky");
  return { id: data.id };
}

export async function updateClanek(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const titul = (formData.get("titul") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const typ = (formData.get("typ") as TypClanku) || "blog";
  const perex = (formData.get("perex") as string)?.trim() || null;
  const telo = (formData.get("telo") as string)?.trim() || null;
  const publishedAtRaw = (formData.get("published_at") as string)?.trim();
  const published_at = publishedAtRaw ? new Date(publishedAtRaw).toISOString() : null;
  const je_placena_spoluprace = formData.get("je_placena_spoluprace") === "on";
  const affiliate_cta_sazkovka_id = (formData.get("affiliate_cta_sazkovka_id") as string)?.trim() || null;
  const affiliate_cta_kasino_id = (formData.get("affiliate_cta_kasino_id") as string)?.trim() || null;
  const zdroj_url = (formData.get("zdroj_url") as string)?.trim() || null;
  const zdroj_nazev = (formData.get("zdroj_nazev") as string)?.trim() || null;

  if (!titul) return { error: "Titulek je povinný." };
  if (!slug) return { error: "Slug je povinný." };

  const { error } = await supabase
    .from("clanky")
    .update({
      titul,
      slug,
      typ,
      perex,
      telo,
      published_at,
      je_placena_spoluprace,
      affiliate_cta_sazkovka_id: affiliate_cta_sazkovka_id || null,
      affiliate_cta_kasino_id: affiliate_cta_kasino_id || null,
      zdroj_url,
      zdroj_nazev,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/clanky");
  revalidatePath(`/admin/clanky/${id}`);
  revalidatePath("/clanky");
  revalidatePath(`/clanky/${slug}`);
  return {};
}

export async function deleteClanek(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("clanky").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/clanky");
  revalidatePath("/clanky");
  return {};
}
