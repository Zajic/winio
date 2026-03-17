import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createHash } from "crypto";

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (request.headers.get("x-vercel-cron") === "1") return true;
  return false;
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
}

function parseRssItems(xml: string): Array<{ title: string; link: string; pubDate: string | null; description: string }> {
  const items: Array<{ title: string; link: string; pubDate: string | null; description: string }> = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const title = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
    const link = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() ?? block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? "";
    const pubDate = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim() ?? null;
    const desc = block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ?? "";
    const description = stripHtml(desc);
    if (title && link) items.push({ title, link, pubDate, description });
  }
  return items;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const feedsRaw = process.env.RSS_FEEDS;
  if (!feedsRaw?.trim()) {
    return NextResponse.json(
      { ok: true, imported: 0, message: "RSS_FEEDS není nastaveno" },
      { status: 200 }
    );
  }

  const feedUrls = feedsRaw.split(",").map((u) => u.trim()).filter(Boolean);
  if (feedUrls.length === 0) {
    return NextResponse.json({ ok: true, imported: 0 });
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

  let imported = 0;
  const now = new Date().toISOString();

  for (const feedUrl of feedUrls) {
    try {
      const res = await fetch(feedUrl, { next: { revalidate: 0 } });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = parseRssItems(xml);
      const zdrojNazev = new URL(feedUrl).hostname.replace(/^www\./, "");

      for (const it of items) {
        const slugBase = slugify(it.title) || "clanek";
        const slugSuffix = createHash("md5").update(it.link).digest("hex").slice(0, 8);
        const slug = `${slugBase}-${slugSuffix}`;

        const { data: existing } = await supabase
          .from("clanky")
          .select("id")
          .eq("zdroj_url", it.link)
          .maybeSingle();

        const publishedAt = it.pubDate ? new Date(it.pubDate).toISOString() : now;
        const row = {
          typ: "news",
          titul: it.title.slice(0, 500),
          slug,
          perex: it.description || null,
          telo: null,
          zdroj_url: it.link,
          zdroj_nazev: zdrojNazev,
          affiliate_cta_kasino_id: null,
          affiliate_cta_sazkovka_id: null,
          je_placena_spoluprace: false,
          published_at: publishedAt,
          updated_at: now,
        };

        if (existing) {
          await supabase
            .from("clanky")
            .update({
              titul: row.titul,
              perex: row.perex,
              zdroj_nazev: row.zdroj_nazev,
              published_at: row.published_at,
              updated_at: row.updated_at,
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("clanky").insert(row);
          imported++;
        }
      }
    } catch (e) {
      console.error("RSS fetch error", feedUrl, e);
    }
  }

  return NextResponse.json({ ok: true, imported });
}
