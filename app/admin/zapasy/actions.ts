"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { StavZapasu } from "@/types/db";

export async function updateZapas(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const sport = (formData.get("sport") as string)?.trim();
  const soutez = (formData.get("soutez") as string)?.trim() || null;
  const domaci_tym = (formData.get("domaci_tym") as string)?.trim();
  const hoste_tym = (formData.get("hoste_tym") as string)?.trim();
  const zacatekRaw = (formData.get("zacatek_at") as string)?.trim();
  const stav = (formData.get("stav") as StavZapasu) || "nadchazejici";
  const vysledek = (formData.get("vysledek") as string)?.trim() || null;
  const seo_preview = (formData.get("seo_preview") as string)?.trim() || null;

  if (!sport || !domaci_tym || !hoste_tym) return { error: "Sport a týmy jsou povinné." };
  const zacatek_at = zacatekRaw ? new Date(zacatekRaw).toISOString() : null;
  if (!zacatek_at) return { error: "Datum začátku je povinné." };

  const { error } = await supabase
    .from("zapasy")
    .update({
      sport,
      soutez,
      domaci_tym,
      hoste_tym,
      zacatek_at,
      stav,
      vysledek,
      seo_preview,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/zapasy");
  revalidatePath("/admin/zapasy");
  revalidatePath(`/zapasy/${id}`);
  return {};
}
