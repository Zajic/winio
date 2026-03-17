import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const STAVY = ["nadchazejici", "live", "ukonceny"] as const;

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  return !!(secret && authHeader === `Bearer ${secret}`);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body: { stav?: string; vysledek?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Neplatné JSON" },
      { status: 400 }
    );
  }

  const updates: { stav?: string; vysledek?: string | null; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };
  if (body.stav !== undefined) {
    if (!STAVY.includes(body.stav as (typeof STAVY)[number])) {
      return NextResponse.json(
        { error: "stav musí být nadchazejici, live nebo ukonceny" },
        { status: 400 }
      );
    }
    updates.stav = body.stav;
  }
  if (body.vysledek !== undefined) {
    updates.vysledek = typeof body.vysledek === "string" ? body.vysledek : null;
  }

  if (Object.keys(updates).length <= 1) {
    return NextResponse.json(
      { error: "Tělo musí obsahovat stav nebo vysledek" },
      { status: 400 }
    );
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY chybí" },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("zapasy")
    .update(updates)
    .eq("id", id)
    .select("id, stav, vysledek")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Zápas nenalezen" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, zapas: data });
}
