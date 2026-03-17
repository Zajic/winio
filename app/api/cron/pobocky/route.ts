import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (request.headers.get("x-vercel-cron") === "1") return true;
  return false;
}

/** Očekávaný formát položky z Apify datasetu (ná názvy polí závisí na actoru). */
type ApifyPlace = {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  nazev?: string;
  address?: string;
  adresa?: string;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
};

function normalizePlace(item: ApifyPlace): { external_id: string; nazev: string; adresa: string | null; lat: number | null; lng: number | null } {
  const external_id = String(item.id ?? item._id ?? Math.random().toString(36).slice(2));
  const nazev = (item.name ?? item.title ?? item.nazev ?? "Pobočka").slice(0, 500);
  const adresa = (item.address ?? item.adresa ?? null) ? String(item.address ?? item.adresa).slice(0, 500) : null;
  const lat = typeof item.lat === "number" ? item.lat : typeof item.latitude === "number" ? item.latitude : null;
  const lng = typeof item.lng === "number" ? item.lng : typeof item.longitude === "number" ? item.longitude : null;
  return { external_id, nazev, adresa, lat, lng };
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.APIFY_API_TOKEN;
  const actorId = process.env.APIFY_ACTOR_ID;
  const sazkovkaId = process.env.APIFY_SAZKOVKA_ID;

  if (!token || !actorId || !sazkovkaId) {
    return NextResponse.json(
      { ok: true, updated: 0, message: "APIFY_API_TOKEN, APIFY_ACTOR_ID nebo APIFY_SAZKOVKA_ID chybí" },
      { status: 200 }
    );
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json(
      { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY chybí" },
      { status: 503 }
    );
  }

  const url = `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?format=json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
    signal: AbortSignal.timeout(120_000),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Apify error:", res.status, err);
    return NextResponse.json(
      { ok: false, error: `Apify ${res.status}: ${err.slice(0, 200)}` },
      { status: 502 }
    );
  }

  const items = (await res.json()) as ApifyPlace[];
  if (!Array.isArray(items) || items.length === 0) {
    await supabase
      .from("mista")
      .update({ aktivni: false, updated_at: new Date().toISOString() })
      .eq("sazkovka_id", sazkovkaId)
      .eq("zdroj", "apify");
    return NextResponse.json({ ok: true, updated: 0, deactivated: true });
  }

  const now = new Date().toISOString();

  await supabase
    .from("mista")
    .update({ aktivni: false, updated_at: now })
    .eq("sazkovka_id", sazkovkaId)
    .eq("zdroj", "apify");

  let updated = 0;
  for (const item of items) {
    const { external_id, nazev, adresa, lat, lng } = normalizePlace(item);
    const row = {
      typ: "pobocka_sazkovky",
      nazev,
      adresa,
      lat,
      lng,
      sazkovka_id: sazkovkaId,
      kasino_id: null,
      external_id,
      zdroj: "apify",
      aktivni: true,
      updated_at: now,
    };
    const { error } = await supabase.from("mista").upsert(row, {
      onConflict: "sazkovka_id,external_id",
      ignoreDuplicates: false,
    });
    if (!error) updated++;
  }

  return NextResponse.json({ ok: true, updated, total: items.length });
}
