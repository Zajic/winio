import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BannerSlot } from "@/components/BannerSlot";
import { HomeSearch } from "@/components/home/HomeSearch";
import type { Zapas } from "@/types/db";

const SPORT_LABELS: Record<string, string> = {
  fotbal: "FOTBAL",
  hokej: "HOKEJ",
  mma: "MMA",
  basketbal: "BASKETBAL",
  tenis: "TENIS",
  esport: "ESPORT",
};

type KurzRow = {
  kurz_domaci: number | null;
  kurz_remiza: number | null;
  kurz_hoste: number | null;
  sazkovky: { nazev: string; slug: string; affiliate_url_registrace: string | null } | null;
};

function formatRelTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((day0.getTime() - d0.getTime()) / 86400000);
  const t = d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
  if (diff === 0) return `Dnes ${t}`;
  if (diff === 1) return `Včera ${t}`;
  return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "short" }) + ` ${t}`;
}

export default async function HomePage() {
  const supabase = await createClient();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const { data: dnesRows } = await supabase
    .from("zapasy")
    .select("id, sport, domaci_tym, hoste_tym, zacatek_at, soutez")
    .in("stav", ["nadchazejici", "live"])
    .gte("zacatek_at", startOfToday.toISOString())
    .lt("zacatek_at", endOfToday.toISOString())
    .order("zacatek_at", { ascending: true })
    .limit(8);

  const zapasyDnes = (dnesRows ?? []) as Zapas[];
  const zapasDne = zapasyDnes[0];

  let kurzyDne: {
    nazev: string;
    slug: string;
    affiliate_url_registrace: string | null;
    kurz_domaci: number | null;
  }[] = [];

  if (zapasDne) {
    const { data: k } = await supabase
      .from("kurzy")
      .select("kurz_domaci, kurz_remiza, kurz_hoste, sazkovky(nazev, slug, affiliate_url_registrace)")
      .eq("zapas_id", zapasDne.id)
      .eq("typ_sazky", "1X2")
      .limit(8);
    const rows = (k ?? []) as unknown as KurzRow[];
    kurzyDne = rows
      .map((r) => {
        const s = Array.isArray(r.sazkovky) ? r.sazkovky[0] : r.sazkovky;
        return {
          nazev: s?.nazev ?? "",
          slug: s?.slug ?? "",
          affiliate_url_registrace: s?.affiliate_url_registrace ?? null,
          kurz_domaci: r.kurz_domaci,
        };
      })
      .filter((x) => x.nazev);
  }

  let topKurzIdx = 0;
  let topKurzVal = 0;
  kurzyDne.forEach((k, i) => {
    const v = Number(k.kurz_domaci) || 0;
    if (v > topKurzVal) {
      topKurzVal = v;
      topKurzIdx = i;
    }
  });
  const topBook = kurzyDne[topKurzIdx];
  const ctaAffiliate = topBook?.affiliate_url_registrace;
  const ctaLabel = topBook?.nazev ? `Vsadit nejlepší kurz u ${topBook.nazev}` : "Zobrazit kurzy zápasu";

  const kurzyShow = [...kurzyDne.slice(0, 3)];
  while (kurzyShow.length < 3) {
    kurzyShow.push({
      nazev: "—",
      slug: "",
      affiliate_url_registrace: null,
      kurz_domaci: null,
    });
  }

  const { data: mistaRows } = await supabase
    .from("mista")
    .select("id, nazev, adresa, oteviraci_doba, kasina(nazev)")
    .eq("typ", "kasino")
    .eq("aktivni", true)
    .limit(4);

  const mistaRaw = (mistaRows ?? []) as unknown as {
    id: string;
    nazev: string;
    adresa: string | null;
    kasina: { nazev: string } | { nazev: string }[] | null;
  }[];
  const mista = mistaRaw.map((m) => ({
    ...m,
    kasinaNazev: Array.isArray(m.kasina) ? m.kasina[0]?.nazev : m.kasina?.nazev,
  }));

  const hour = new Date().getHours();
  const likelyOpen = hour >= 9 && hour < 23;

  const { data: bonusRow } = await supabase
    .from("sazkovky")
    .select("id, nazev, slug, bonus_uvodni, bonus_popis, affiliate_url_registrace, placene_umisteni")
    .eq("aktivni", true)
    .not("bonus_uvodni", "is", null)
    .order("placene_umisteni", { ascending: false })
    .limit(1)
    .maybeSingle();

  const bonus = bonusRow as {
    id: string;
    nazev: string;
    slug: string;
    bonus_uvodni: string | null;
    bonus_popis: string | null;
    affiliate_url_registrace: string | null;
  } | null;

  const { data: clankyRows } = await supabase
    .from("clanky")
    .select("id, titul, slug, typ, published_at")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(4);

  const clanky = (clankyRows ?? []) as {
    id: string;
    titul: string;
    slug: string;
    typ: string;
    published_at: string | null;
  }[];

  const typShort: Record<string, string> = {
    news: "Novinky",
    blog: "Blog",
    pr_placeny: "Spolupráce",
  };

  return (
    <>
      <section className="relative overflow-hidden bg-winio-hero pb-16 pt-10 md:pb-20 md:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4">
          <div className="mb-6">
            <BannerSlot pozice="homepage_top" />
          </div>
          <h1 className="mx-auto max-w-4xl text-center font-display text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Hrajte <span className="text-gradient-cyan">daty</span>, ne pocity.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-slate-400 md:text-xl">
            Přehled kurzů, licencovaných sázkovek, kasin a heren v ČR. Vše přehledně na jednom místě.
          </p>
          <div className="mt-10">
            <HomeSearch />
          </div>
        </div>
      </section>

      <div className="container mx-auto -mt-6 px-4 pb-20">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Zápas dne */}
          <article className="rounded-2xl border border-winio-border bg-winio-card/70 p-6 shadow-glow-sm backdrop-blur-sm md:p-8">
            {zapasDne ? (
              <>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    Zápas dne · {SPORT_LABELS[zapasDne.sport] ?? zapasDne.sport}
                  </div>
                  <time className="text-sm text-cyan-400/90">
                    Dnes{" "}
                    {new Date(zapasDne.zacatek_at).toLocaleTimeString("cs-CZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <Link href={`/zapasy/${zapasDne.id}`} className="group block">
                  <p className="font-display text-2xl font-bold text-white transition group-hover:text-cyan-300 md:text-3xl">
                    {zapasDne.domaci_tym}
                  </p>
                  <p className="my-2 text-center text-sm font-medium text-slate-500">vs</p>
                  <p className="font-display text-2xl font-bold text-white transition group-hover:text-cyan-300 md:text-3xl">
                    {zapasDne.hoste_tym}
                  </p>
                </Link>
                <p className="mt-2 text-center text-xs text-slate-500">
                  Kurz na výhru domácích (1) — srovnání sázkovek
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {kurzyShow.map((k, i) => {
                    const isTop =
                      k.nazev !== "—" &&
                      topKurzVal > 0 &&
                      topBook &&
                      k.nazev === topBook.nazev &&
                      k.kurz_domaci === topBook.kurz_domaci;
                    return (
                      <div
                        key={`${k.slug || "x"}-${i}`}
                        className={`rounded-xl border px-3 py-4 text-center transition ${
                          isTop
                            ? "border-cyan-500/60 bg-cyan-500/10 shadow-glow-sm"
                            : "border-winio-border bg-winio-navy-light/50"
                        }`}
                      >
                        {isTop && (
                          <span className="mb-2 inline-block rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                            Top kurz
                          </span>
                        )}
                        <p className="text-xs text-slate-500">{k.nazev === "—" ? "—" : k.nazev}</p>
                        <p className="mt-1 font-display text-xl font-bold text-white">
                          {k.kurz_domaci != null ? Number(k.kurz_domaci).toFixed(2) : "—"}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8">
                  {ctaAffiliate ? (
                    <a
                      href={ctaAffiliate}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                      className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 font-semibold text-winio-navy shadow-glow transition hover:opacity-95"
                      data-cta="homepage_zapas_dne"
                    >
                      {ctaLabel} →
                    </a>
                  ) : (
                    <Link
                      href={`/zapasy/${zapasDne.id}`}
                      className="flex min-h-[52px] w-full items-center justify-center rounded-xl border border-cyan-500/40 font-semibold text-cyan-400 transition hover:bg-cyan-500/10"
                    >
                      Kurzy a srovnání u sázkovek →
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <p className="font-display text-lg font-semibold text-slate-300">Dnes žádný zápas v databázi</p>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Po spuštění cronu kurzů se zde zobrazí zápas dne a srovnání kurzů.
                </p>
                <Link
                  href="/zapasy"
                  className="mt-6 rounded-xl border border-cyan-500/40 px-6 py-3 text-cyan-400 hover:bg-cyan-500/10"
                >
                  Všechny zápasy
                </Link>
              </div>
            )}
          </article>

          {/* Nejbližší kasina / herny */}
          <article className="rounded-2xl border border-winio-border bg-winio-card/70 p-6 backdrop-blur-sm md:p-8">
            <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Herny a kasina
            </div>
            <ul className="space-y-4">
              {mista.length === 0 ? (
                <li className="text-sm text-slate-500">Zatím žádná místa v databázi. Doplňte je v adminu nebo importem.</li>
              ) : (
                mista.map((m, idx) => {
                  const open = idx === 0 ? likelyOpen : !likelyOpen;
                  return (
                    <li
                      key={m.id}
                      className="flex flex-col gap-2 rounded-xl border border-winio-border bg-winio-navy-light/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-white">{m.kasinaNazev ?? m.nazev}</p>
                        <p className="text-xs text-slate-500">{m.adresa ?? "Adresa v detailu na mapě"}</p>
                        <p className="mt-1 text-xs text-slate-600">Ruleta, automaty · podle provozovatele</p>
                      </div>
                      <span
                        className={`shrink-0 self-start rounded-full px-3 py-1 text-xs font-semibold ${
                          open ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {open ? "Pravd. otevřeno" : "Zkontrolujte"}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
            <Link href="/mapa" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300">
              Otevřít mapu heren →
            </Link>
          </article>

          {/* Top bonus */}
          <article className="rounded-2xl border border-winio-border bg-gradient-to-br from-winio-card/90 to-winio-navy-light/80 p-6 md:p-8">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
              <span aria-hidden>🎁</span> Top online bonus
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-500/80">Exkluzivně přes Winio</p>
            {bonus?.bonus_uvodni ? (
              <>
                <p className="mt-4 font-display text-4xl font-extrabold text-white md:text-5xl">{bonus.bonus_uvodni}</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                  {bonus.bonus_popis ?? `Akční nabídka u ${bonus.nazev}. Podmínky bonusu vždy na stránkách provozovatele.`}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {bonus.affiliate_url_registrace ? (
                    <a
                      href={bonus.affiliate_url_registrace}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                      className="inline-flex items-center justify-center rounded-xl border-2 border-white/20 px-6 py-3 font-semibold text-white transition hover:border-cyan-400/50 hover:text-cyan-300"
                    >
                      Získat bonus u {bonus.nazev} →
                    </a>
                  ) : (
                    <Link
                      href={`/sazkovky/${bonus.slug}`}
                      className="inline-flex items-center justify-center rounded-xl border-2 border-white/20 px-6 py-3 font-semibold text-white"
                    >
                      Detail {bonus.nazev} →
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <p className="mt-4 text-slate-500">Bonusy doplníte v administraci u sázkovek.</p>
            )}
          </article>

          {/* Zpravodajství */}
          <article className="rounded-2xl border border-winio-border bg-winio-card/70 p-6 backdrop-blur-sm md:p-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Zpravodajství</h2>
            <p className="mt-2 font-display text-xl font-bold text-white md:text-2xl">Co hýbe světem hazardu?</p>
            <ul className="mt-6 space-y-5">
              {clanky.length === 0 ? (
                <li className="text-sm text-slate-500">Články přibudou z RSS nebo z administrace.</li>
              ) : (
                clanky.map((c) => (
                  <li key={c.id}>
                    <Link href={`/clanky/${c.slug}`} className="group block">
                      <p className="text-xs text-cyan-500/80">
                        {c.published_at ? formatRelTime(c.published_at) : ""}
                        <span className="text-slate-600"> · </span>
                        {typShort[c.typ] ?? c.typ}
                      </p>
                      <p className="mt-1 font-medium text-slate-200 transition group-hover:text-cyan-300">{c.titul}</p>
                    </Link>
                  </li>
                ))
              )}
            </ul>
            <Link href="/clanky" className="mt-8 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300">
              Všechny články →
            </Link>
          </article>
        </div>
      </div>
    </>
  );
}
