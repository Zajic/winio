import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (request.headers.get("x-vercel-cron") === "1") return true;
  return false;
}

const LIMIT = 5;

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "OPENAI_API_KEY chybí (Blok 10 je volitelný)" },
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

  const { data: zapasy } = await supabase
    .from("zapasy")
    .select("id, domaci_tym, hoste_tym, sport, soutez")
    .is("seo_preview", null)
    .limit(LIMIT);

  if (!zapasy?.length) {
    return NextResponse.json({ ok: true, generated: 0, message: "Žádné zápasy bez preview" });
  }

  let generated = 0;
  for (const z of zapasy) {
    const prompt = `Napiš jednu krátkou větu (max 2 věty) v češtině jako SEO popis zápasu: ${z.domaci_tym} vs ${z.hoste_tym}${z.soutez ? ` (${z.soutez})` : ""}. Žádné nadpisy, žádné uvozovky. Pouze informativní text pro vyhledávače.`;
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Jsi copywriter. Píšeš pouze jeden souvislý odstavec v češtině, bez nadpisů a formátování." },
            { role: "user", content: prompt },
          ],
          max_tokens: 120,
          temperature: 0.4,
        }),
      });
      if (!res.ok) {
        console.error("OpenAI error:", res.status, await res.text());
        continue;
      }
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) continue;
      const { error } = await supabase
        .from("zapasy")
        .update({ seo_preview: text, updated_at: new Date().toISOString() })
        .eq("id", z.id);
      if (!error) generated++;
    } catch (e) {
      console.error("seo-preview error for zapas", z.id, e);
    }
  }

  return NextResponse.json({ ok: true, generated, total: zapasy.length });
}
