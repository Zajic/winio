"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TypMista } from "@/types/db";

function bool(v: FormDataEntryValue | null) {
  return v === "on" || v === "true";
}

function parseOteviraci(raw: string): unknown {
  const t = raw.trim();
  if (!t) return null;
  try {
    return JSON.parse(t);
  } catch {
    return { text: t };
  }
}

export async function createMisto(formData: FormData): Promise<{ error?: string; id?: string }> {
  const supabase = createAdminClient();
  const typ = (formData.get("typ") as TypMista) || "pobocka_sazkovky";
  const nazev = (formData.get("nazev") as string)?.trim();
  if (!nazev) return { error: "Název je povinný." };

  const sazkovka_id =
    typ === "pobocka_sazkovky"
      ? (formData.get("sazkovka_id") as string)?.trim() || null
      : null;
  const kasino_id =
    typ === "kasino" ? (formData.get("kasino_id") as string)?.trim() || null : null;
  if (typ === "pobocka_sazkovky" && !sazkovka_id) return { error: "Vyberte sázkovku." };
  if (typ === "kasino" && !kasino_id) return { error: "Vyberte kasino." };

  const lat = parseFloat(String(formData.get("lat") || ""));
  const lng = parseFloat(String(formData.get("lng") || ""));

  const { data, error } = await supabase
    .from("mista")
    .insert({
      typ,
      nazev,
      adresa: (formData.get("adresa") as string)?.trim() || null,
      lat: Number.isFinite(lat) ? lat : null,
      lng: Number.isFinite(lng) ? lng : null,
      sazkovka_id,
      kasino_id,
      oteviraci_doba: parseOteviraci((formData.get("oteviraci_doba") as string) || ""),
      zdroj: (formData.get("zdroj") as string)?.trim() || null,
      external_id: (formData.get("external_id") as string)?.trim() || null,
      aktivni: bool(formData.get("aktivni")),
    })
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath("/mapa");
  revalidatePath("/admin/mista");
  return { id: data.id };
}

export async function updateMisto(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const typ = (formData.get("typ") as TypMista) || "pobocka_sazkovky";
  const nazev = (formData.get("nazev") as string)?.trim();
  if (!nazev) return { error: "Název je povinný." };

  const sazkovka_id =
    typ === "pobocka_sazkovky"
      ? (formData.get("sazkovka_id") as string)?.trim() || null
      : null;
  const kasino_id =
    typ === "kasino" ? (formData.get("kasino_id") as string)?.trim() || null : null;
  if (typ === "pobocka_sazkovky" && !sazkovka_id) return { error: "Vyberte sázkovku." };
  if (typ === "kasino" && !kasino_id) return { error: "Vyberte kasino." };

  const lat = parseFloat(String(formData.get("lat") || ""));
  const lng = parseFloat(String(formData.get("lng") || ""));

  const { error } = await supabase
    .from("mista")
    .update({
      typ,
      nazev,
      adresa: (formData.get("adresa") as string)?.trim() || null,
      lat: Number.isFinite(lat) ? lat : null,
      lng: Number.isFinite(lng) ? lng : null,
      sazkovka_id,
      kasino_id,
      oteviraci_doba: parseOteviraci((formData.get("oteviraci_doba") as string) || ""),
      zdroj: (formData.get("zdroj") as string)?.trim() || null,
      external_id: (formData.get("external_id") as string)?.trim() || null,
      aktivni: bool(formData.get("aktivni")),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/mapa");
  revalidatePath("/admin/mista");
  return {};
}

export async function deleteMisto(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("mista").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/mapa");
  revalidatePath("/admin/mista");
  return {};
}
