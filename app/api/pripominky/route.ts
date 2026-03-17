import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Přihlaste se." }, { status: 401 });
  }

  let body: { zapas_id: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatné JSON" }, { status: 400 });
  }

  const zapasId = body.zapas_id;
  if (!zapasId || typeof zapasId !== "string") {
    return NextResponse.json({ error: "zapas_id je povinný" }, { status: 400 });
  }

  const { data: zapas, error: errZapas } = await supabase
    .from("zapasy")
    .select("id, zacatek_at")
    .eq("id", zapasId)
    .single();

  if (errZapas || !zapas) {
    return NextResponse.json({ error: "Zápas nenalezen" }, { status: 404 });
  }

  const zacatek = new Date((zapas as { zacatek_at: string }).zacatek_at);
  const odeslatV = new Date(zacatek.getTime() - 60 * 60 * 1000); // 1 h před začátkem

  const { error } = await supabase.from("pripominky").upsert(
    {
      user_id: user.id,
      zapas_id: zapasId,
      odeslat_v: odeslatV.toISOString(),
      odeslano: false,
    },
    { onConflict: "user_id,zapas_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, odeslat_v: odeslatV.toISOString() });
}
