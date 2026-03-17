"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updatePreferences(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Nejste přihlášen." };

  const souhlas_newsletter = formData.get("souhlas_newsletter") === "on";
  const souhlas_pripominky = formData.get("souhlas_pripominky") === "on";
  const tymyRaw = String(formData.get("oblíbene_tymy") ?? "").trim();
  const ligyRaw = String(formData.get("oblíbene_ligy") ?? "").trim();
  const oblíbene_tymy = tymyRaw ? tymyRaw.split(/[,\n]/).map((s) => s.trim()).filter(Boolean) : [];
  const oblíbene_ligy = ligyRaw ? ligyRaw.split(/[,\n]/).map((s) => s.trim()).filter(Boolean) : [];

  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_id: user.id,
      souhlas_newsletter,
      souhlas_pripominky,
      oblíbene_tymy,
      oblíbene_ligy,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) return { error: error.message };
  revalidatePath("/ucet");
  return { ok: true };
}
