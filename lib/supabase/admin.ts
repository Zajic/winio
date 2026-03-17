import { createClient } from "@supabase/supabase-js";

/**
 * Klient s service role key – pouze pro server (cron, API route).
 * Nikdy neposílat na frontend. Použít pro zápis do zapasy, kurzy.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Chybí NEXT_PUBLIC_SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY (pouze pro server)."
    );
  }

  return createClient(url, serviceKey);
}
