"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TypLoterieProduktu } from "@/types/db";

function bool(v: FormDataEntryValue | null) {
  return v === "on" || v === "true";
}

/* --- Operátoři --- */
export async function createLoterieOperator(formData: FormData): Promise<{ error?: string; id?: string }> {
  const supabase = createAdminClient();
  const nazev = (formData.get("nazev") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  if (!nazev || !slug) return { error: "Název a slug jsou povinné." };

  const { data, error } = await supabase
    .from("loterie_operatori")
    .insert({
      nazev,
      slug,
      popis: (formData.get("popis") as string)?.trim() || null,
      licence: (formData.get("licence") as string)?.trim() || null,
      logo_url: (formData.get("logo_url") as string)?.trim() || null,
      web_url: (formData.get("web_url") as string)?.trim() || null,
      aktivni: bool(formData.get("aktivni")),
      poradi: parseInt(String(formData.get("poradi") || "0"), 10) || 0,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath("/loterie");
  revalidatePath("/admin/loterie");
  return { id: data.id };
}

export async function updateLoterieOperator(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const nazev = (formData.get("nazev") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  if (!nazev || !slug) return { error: "Název a slug jsou povinné." };
  const { data: old } = await supabase.from("loterie_operatori").select("slug").eq("id", id).single();

  const { error } = await supabase
    .from("loterie_operatori")
    .update({
      nazev,
      slug,
      popis: (formData.get("popis") as string)?.trim() || null,
      licence: (formData.get("licence") as string)?.trim() || null,
      logo_url: (formData.get("logo_url") as string)?.trim() || null,
      web_url: (formData.get("web_url") as string)?.trim() || null,
      aktivni: bool(formData.get("aktivni")),
      poradi: parseInt(String(formData.get("poradi") || "0"), 10) || 0,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/loterie");
  if (old?.slug) revalidatePath(`/loterie/${old.slug}`);
  revalidatePath(`/loterie/${slug}`);
  revalidatePath("/admin/loterie");
  return {};
}

export async function deleteLoterieOperator(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("loterie_operatori").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/loterie");
  revalidatePath("/admin/loterie");
  return {};
}

/* --- Produkty --- */
export async function createLoterieProdukt(formData: FormData): Promise<{ error?: string; id?: string }> {
  const supabase = createAdminClient();
  const operator_id = (formData.get("operator_id") as string)?.trim();
  const nazev = (formData.get("nazev") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  if (!operator_id || !nazev || !slug) return { error: "Operátor, název a slug jsou povinné." };

  const typ = (formData.get("typ") as TypLoterieProduktu) || "cislovana";
  const { data, error } = await supabase
    .from("loterie_produkty")
    .insert({
      operator_id,
      nazev,
      slug,
      popis: (formData.get("popis") as string)?.trim() || null,
      typ,
      oficialni_vysledky_url: (formData.get("oficialni_vysledky_url") as string)?.trim() || null,
      aktivni: bool(formData.get("aktivni")),
      poradi: parseInt(String(formData.get("poradi") || "0"), 10) || 0,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath("/loterie");
  revalidatePath("/admin/loterie");
  return { id: data.id };
}

export async function updateLoterieProdukt(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const operator_id = (formData.get("operator_id") as string)?.trim();
  const nazev = (formData.get("nazev") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  if (!operator_id || !nazev || !slug) return { error: "Vyplňte vše povinné." };

  const { error } = await supabase
    .from("loterie_produkty")
    .update({
      operator_id,
      nazev,
      slug,
      popis: (formData.get("popis") as string)?.trim() || null,
      typ: (formData.get("typ") as TypLoterieProduktu) || "cislovana",
      oficialni_vysledky_url: (formData.get("oficialni_vysledky_url") as string)?.trim() || null,
      aktivni: bool(formData.get("aktivni")),
      poradi: parseInt(String(formData.get("poradi") || "0"), 10) || 0,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/loterie");
  revalidatePath("/admin/loterie");
  return {};
}

export async function deleteLoterieProdukt(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("loterie_produkty").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/loterie");
  revalidatePath("/admin/loterie");
  return {};
}

/* --- Tahy --- */
export async function createLoterieTah(formData: FormData): Promise<{ error?: string; id?: string }> {
  const supabase = createAdminClient();
  const produkt_id = (formData.get("produkt_id") as string)?.trim();
  const datumRaw = (formData.get("datum_losovani") as string)?.trim();
  const vysledek_text = (formData.get("vysledek_text") as string)?.trim();
  if (!produkt_id || !datumRaw || !vysledek_text) return { error: "Vyplňte produkt, datum a výsledek." };

  const { data, error } = await supabase
    .from("loterie_tahy")
    .insert({
      produkt_id,
      datum_losovani: new Date(datumRaw).toISOString(),
      vysledek_text,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath("/loterie");
  revalidatePath("/admin/loterie");
  return { id: data.id };
}

export async function deleteLoterieTah(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("loterie_tahy").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/loterie");
  revalidatePath("/admin/loterie");
  return {};
}
