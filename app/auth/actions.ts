"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "E-mail a heslo jsou povinné." };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/ucet` },
    });
    if (error) return { error: error.message };
    redirect("/prihlaseni?registered=1");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("fetch") || msg.includes("network") || msg.includes("ECONNREFUSED")) {
      return {
        error:
          "Nelze se připojit k Supabase. Zkontrolujte NEXT_PUBLIC_SUPABASE_URL a NEXT_PUBLIC_SUPABASE_ANON_KEY v .env.local a že projekt v Supabase Dashboard není pozastaven.",
      };
    }
    return { error: msg };
  }
}

/** Vrací cílovou URL po přihlášení; klient provede přesměrování (bez redirect() z action). */
export async function signIn(formData: FormData): Promise<{ error?: string; redirectTo?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "E-mail a heslo jsou povinné." };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
        return { error: "Nesprávný e-mail nebo heslo. Zkontrolujte údaje nebo se nejdřív zaregistrujte." };
      }
      return { error: error.message };
    }
    const to = (formData.get("redirect") as string)?.trim();
    const redirectTo =
      to && to.startsWith("/") && !to.startsWith("//") ? to : "/ucet";
    return { redirectTo };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("fetch") || msg.includes("network") || msg.includes("ECONNREFUSED")) {
      return {
        error:
          "Nelze se připojit k Supabase. Zkontrolujte NEXT_PUBLIC_SUPABASE_URL a NEXT_PUBLIC_SUPABASE_ANON_KEY v .env.local.",
      };
    }
    return { error: msg };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
