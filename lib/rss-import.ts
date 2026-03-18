/**
 * Import z RSS – pouze titulek + krátký textový výňatek (žádné content:encoded / celý článek).
 * Viz docs/CLANKY-RSS-KURATORSTVI.md
 */

const DEFAULT_PEREX_MAX = 300;

const DQ = String.fromCharCode(34);
const SQ = String.fromCharCode(39);

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, DQ)
    .replace(/&#39;/g, SQ)
    .replace(/&#(\d+);/g, (_, n) => {
      const code = parseInt(n, 10);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : _;
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
      const code = parseInt(h, 16);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : _;
    });
}

export function stripHtmlToPlain(html: string): string {
  const decoded = decodeHtmlEntities(html);
  return decoded
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Krátký perex pro DB – bez celého článku */
export function truncatePerex(plain: string, maxChars: number): string {
  const t = plain.trim();
  if (!t) return "";
  if (t.length <= maxChars) return t;
  const cut = t.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  const head = lastSpace > maxChars * 0.55 ? cut.slice(0, lastSpace) : cut;
  return `${head.trim()}…`;
}

export function perexFromRssDescription(
  rawDescription: string,
  maxChars = DEFAULT_PEREX_MAX
): string | null {
  const plain = stripHtmlToPlain(rawDescription);
  if (!plain) return null;
  return truncatePerex(plain, maxChars);
}

export type RssItemParsed = {
  title: string;
  link: string;
  pubDate: string | null;
  /** Krátký výňatek z description; null pokud prázdné */
  description: string | null;
};

function maxCharsFromEnv(): number {
  const n = parseInt(process.env.RSS_PEREX_MAX_CHARS ?? "", 10);
  if (Number.isFinite(n) && n >= 80 && n <= 600) return n;
  return DEFAULT_PEREX_MAX;
}

/**
 * Parsuje jen <item> s title, link, pubDate, description.
 * Záměrně ignorujeme content:encoded – tam bývá celý článek.
 */
export function parseRssItems(
  xml: string,
  perexMaxChars?: number
): RssItemParsed[] {
  const max = perexMaxChars ?? maxCharsFromEnv();
  const items: RssItemParsed[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const titleRaw =
      block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
    const title = stripHtmlToPlain(titleRaw);
    const link =
      block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() ??
      block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ??
      "";
    const pubDate =
      block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim() ??
      null;
    const descRaw =
      block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ??
      "";
    const description = perexFromRssDescription(descRaw, max);
    if (title && link) {
      items.push({
        title,
        link,
        pubDate,
        description,
      });
    }
  }
  return items;
}
