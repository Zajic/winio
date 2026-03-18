"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TypBanneru, PoziceBanneru } from "@/types/db";

function getPublicUrl(path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return "";
  return `${url}/storage/v1/object/public/bannery/${path}`;
}

async function uploadImage(file: File): Promise<{ url: string } | { error: string }> {
  const supabase = createAdminClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const { error } = await supabase.storage.from("bannery").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) return { error: error.message };
  return { url: getPublicUrl(path) };
}

export async function createBanner(formData: FormData): Promise<{ error?: string; id?: string }> {
  const supabase = createAdminClient();
  const nazev = (formData.get("nazev") as string)?.trim();
  const typ = (formData.get("typ") as TypBanneru) || "vlastni";
  const odkaz_url = (formData.get("odkaz_url") as string)?.trim() || null;
  const pozice = (formData.get("pozice") as PoziceBanneru) || "sidebar_global";
  const aktivni = formData.get("aktivni") === "on";
  const poradi = parseInt((formData.get("poradi") as string) || "0", 10) || 0;
  const platnostOd = (formData.get("platnost_od") as string)?.trim() || null;
  const platnostDo = (formData.get("platnost_do") as string)?.trim() || null;
  const file = formData.get("obrazek") as File | null;

  if (!nazev) return { error: "Název je povinný." };
  if (!file?.size) return { error: "Obrázek je povinný." };

  const upload = await uploadImage(file);
  if ("error" in upload) return { error: upload.error };

  const { data, error } = await supabase
    .from("bannery")
    .insert({
      nazev,
      typ,
      obrazek_url: upload.url,
      odkaz_url,
      pozice,
      aktivni,
      poradi,
      platnost_od: platnostOd ? new Date(platnostOd).toISOString() : null,
      platnost_do: platnostDo ? new Date(platnostDo).toISOString() : null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/admin/bannery");
  revalidatePath("/");
  revalidatePath("/clanky");
  return { id: data.id };
}

export async function updateBanner(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const nazev = (formData.get("nazev") as string)?.trim();
  const typ = (formData.get("typ") as TypBanneru) || "vlastni";
  const odkaz_url = (formData.get("odkaz_url") as string)?.trim() || null;
  const pozice = (formData.get("pozice") as PoziceBanneru) || "sidebar_global";
  const aktivni = formData.get("aktivni") === "on";
  const poradi = parseInt((formData.get("poradi") as string) || "0", 10) || 0;
  const platnostOd = (formData.get("platnost_od") as string)?.trim() || null;
  const platnostDo = (formData.get("platnost_do") as string)?.trim() || null;
  const file = formData.get("obrazek") as File | null;

  if (!nazev) return { error: "Název je povinný." };

  let obrazek_url: string | null = null;
  if (file?.size) {
    const upload = await uploadImage(file);
    if ("error" in upload) return { error: upload.error };
    obrazek_url = upload.url;
  }

  const updates: Record<string, unknown> = {
    nazev,
    typ,
    odkaz_url,
    pozice,
    aktivni,
    poradi,
    platnost_od: platnostOd ? new Date(platnostOd).toISOString() : null,
    platnost_do: platnostDo ? new Date(platnostDo).toISOString() : null,
  };
  if (obrazek_url) updates.obrazek_url = obrazek_url;

  const { error } = await supabase.from("bannery").update(updates).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/bannery");
  revalidatePath("/");
  revalidatePath("/clanky");
  return {};
}

export async function deleteBanner(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("bannery").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/bannery");
  revalidatePath("/");
  revalidatePath("/clanky");
  return {};
}
