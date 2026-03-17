# Winio – Kroky implementace (postupně tvořit, implementovat, kompletovat)

Konkrétní kroky v pořadí závislostí. Každý krok lze označit za hotový (`[x]`). Cíl: celý projekt funguje a má co nejvyšší potenciál (SEO, konverze, compliance).

Odkazy: **PROJEKT-ZADANI.md**, **ROZKLAD-DETAILY.md**, **STACK.md**.

---

## Blok 0: Příprava (bez kódu / minimální kód)

- [ ] **0.1** Rozhodnout konkrétní Odds API (např. RapidAPI – API-Football / Odds-API); zkontrolovat ceny a limity. *Šablona: `docs/rozhodnuti/odds-api-vyber.md`.*
- [ ] **0.2** Založit affiliate účty u vybraných sázkových kanceláří a kasin; uložit si pravidla použití odkazů. *Checklist: `docs/rozhodnuti/affiliate-programy.md`.*
- [x] **0.3** Napsat návrh textů: Obchodní podmínky, Zásady ochrany osobních údajů (GDPR), znění cookie lišty; v textu jasně „pouze informační web, žádné sázení/hraní u nás“. *Texty: `docs/legal/obchodni-podminky.md`, `docs/legal/ochrana-osobnich-udaju.md`, `docs/legal/cookie-listka.md`.*

---

## Blok 1: Základ Next.js a Supabase

- [x] **1.1** Vytvořit Next.js projekt (App Router, TypeScript, Tailwind); napojit na existující Git repo a Vercel.
- [x] **1.2** Nainstalovat a nakonfigurovat Supabase klienta (`@supabase/supabase-js`, `@supabase/ssr`); env proměnné pro Supabase URL a anon key. *Klient: `lib/supabase/client.ts`, `lib/supabase/server.ts`; šablona env: `.env.local.example`.*
- [x] **1.3** Základní layout: hlavička (logo, navigace), patička (odkazy na OP, GDPR, Safe Play, 18+). *`components/Header.tsx`, `components/Footer.tsx`; v patičce 18+ text.*
- [x] **1.4** Homepage – zatím placeholder (bloky: zápasy, sázkovky, články budou doplněny v dalších blocích). *`app/page.tsx`; placeholder stránky pro /sazkovky, /kasina, /zapasy, /clanky, /obchodni-podminky, /ochrana-osobnich-udaju, /safe-play, /o-nas.*

---

## Blok 2: Databáze – základní tabulky (Fáze 1)

V Supabase vytvořit tabulky dle ROZKLAD-DETAILY.md (A2, A3, A4, A1).

- [x] **2.1** Tabulka `sazkovky` (sázkové kanceláře): id, nazev, slug, affiliate_url_registrace, affiliate_param, popis, logo_url, licence, aktivni, poradi_zobrazeni, placene_umisteni, created_at, updated_at. *SQL: `supabase/migrations/001_initial_schema.sql`.*
- [x] **2.2** Tabulka `kasina` (online kasina): id, nazev, slug, affiliate_url, popis, licence, aktivni, placene_umisteni, created_at, updated_at. *SQL: tamtéž.*
- [x] **2.3** Tabulka `hry`: id, nazev, slug, typ (enum: automat, ruleta, stolni_hra), popis, obrazek_url, created_at, updated_at. Tabulka `hry_kasina` (M:N) – hra_id, kasino_id. *SQL: tamtéž.*
- [x] **2.4** Tabulka `mista` (fyzická místa): id, typ (enum: pobocka_sazkovky, kasino), nazev, adresa, lat, lng, sazkovka_id / kasino_id (FK), oteviraci_doba (jsonb), zdroj, aktivni, created_at, updated_at. *SQL: tamtéž.*
- [x] **2.5** Row Level Security (RLS) v Supabase: čtení veřejné pro tyto tabulky; zápis jen pro service_role. *SQL: konec 001_initial_schema.sql.*
- [x] **2.6** Vložit první testovací / reálná data: alespoň 2–3 sázkové kanceláře a 2–3 kasina. *SQL: `supabase/migrations/002_seed.sql` (Tipsport, Fortuna, Chance + 2 kasina). Affiliate URL doplnit v Dashboardu.*

---

## Blok 3: Právní stránky a compliance

- [x] **3.1** Stránka **Ochrana osobních údajů** (GDPR): obsah z docs/legal; odkaz v patičce a v cookie lište. *`app/ochrana-osobnich-udaju/page.tsx`.*
- [x] **3.2** Stránka **Obchodní podmínky**: účel webu (pouze informace), že u nás nelze sázet ani hrát, 18+, odpovědnost, placené spolupráce. *`app/obchodni-podminky/page.tsx`.*
- [x] **3.3** Stránka **O nás / Jak nás podporujete**: kdo jsme, informační web, financování z affiliate a placeného umístění; zdůraznit „žádné hraní u nás“. *`app/o-nas/page.tsx`.*
- [x] **3.4** **Cookie lišta** (komponenta): první návštěva zobrazit text o cookies, odkaz na GDPR, tlačítka Souhlas / Odmítnout; ukládat volbu do localStorage (cookie_consent, cookie_consent_at). *`components/CookieBar.tsx` v layoutu.*
- [x] **3.5** Označení **18+** v hlavičce (badge) a v patičce (text). *Header + Footer.*

---

## Blok 4: Katalog sázkových kanceláří a kasin

- [x] **4.1** Stránka **Seznam sázkových kanceláří**: načíst z Supabase, zobrazit název, licence, popis; u každé CTA „Vsadit / Registrovat“ (affiliate) nebo „Detail“. *`app/sazkovky/page.tsx`.*
- [x] **4.2** Stránka **Detail sázkové kanceláře** (`/sazkovky/[slug]`): název, popis, licence, CTA s affiliate odkazem; SEO (generateMetadata). *`app/sazkovky/[slug]/page.tsx`.*
- [x] **4.3** Stránka **Seznam online kasin**: načíst z Supabase; u každého CTA „Zahrát / Registrovat“ nebo „Detail“. *`app/kasina/page.tsx`.*
- [x] **4.4** Stránka **Detail kasina** (`/kasina/[slug]`): název, popis, licence, CTA; SEO. *`app/kasina/[slug]/page.tsx`.*
- [x] **4.5** **Filtry podle licence** v seznamech: Vše | CZ | EU (odkazy `?licence=CZ`, `?licence=EU`); filtrováno na serveru. *Oba seznamy.*

---

## Blok 5: Hry a srovnání bonusů

- [x] **5.1** Stránka **Seznam her**: načíst z Supabase; filtr podle typu (Vše / automat / ruleta / stolní hra). *`app/hry/page.tsx`.*
- [x] **5.2** Stránka **Detail hry** (`/hry/[slug]`): název, popis, typ; sekce „Kde si zahrát“ – kasina z `hry_kasina` s affiliate CTA; SEO. *`app/hry/[slug]/page.tsx`.*
- [x] **5.3** Sloupce u `sazkovky`: bonus_uvodni, bonus_popis, freebet. *SQL: `supabase/migrations/003_sazkovky_bonus.sql`.*
- [x] **5.4** Stránka **Srovnání bonusů** (`/bonusy`): tabulka sázkových kanceláří (bonus, freebet, podmínky); řádek s odkazem na detail / affiliate CTA. *`app/bonusy/page.tsx`.*

---

## Blok 6: Databáze – sportovní modul

- [ ] **6.1** Tabulka `zapasy`: id, external_id, sport, soutez, domaci_tym, hoste_tym, zacatek_at, stav (nadchazejici/live/ukonceny), vysledek (text nebo skóre), seo_preview, created_at, updated_at.
- [ ] **6.2** Tabulka `kurzy`: id, zapas_id (FK), sazkovka_id (FK), typ_sazky, kurz_domaci, kurz_remiza, kurz_hoste, fetched_at.
- [ ] **6.3** Mapování: které `sazkovka_id` z Odds API odpovídá které naší sázkovce (např. konfigurace nebo sloupec external_id u sazkovky).

---

## Blok 7: Integrace Odds API a Cron

- [ ] **7.1** API route nebo Server Action: načíst z Odds API zápasy a kurzy (podle zvoleného API z 0.1); uložit/aktualizovat `zapasy` a `kurzy` v Supabase (služební klíč).
- [ ] **7.2** Vercel Cron: v `vercel.json` naplánovat volání této route např. každých 15 minut (nebo dle limitu API).
- [ ] **7.3** Ošetřit chyby a limity API; logovat selhání.

---

## Blok 8: Stránky zápasů

- [ ] **8.1** Stránka **Seznam zápasů** (`/zapasy` nebo homepage sekce): filtrovat dle data (dnes, zítra), sportu, soutěže; zobrazit tým vs tým, čas, odkazy na detail.
- [ ] **8.2** Stránka **Detail zápasu** (`/zapasy/[id]` nebo `/[sport]/[slug]`): název zápasu, datum, sport, soutěž; tabulka kurzů (Tipsport, Fortuna, …) s tlačítkem „Vsadit u [X]“ (affiliate odkaz z `sazkovky`); SEO (title, description, seo_preview).
- [ ] **8.3** Na homepage přidat blok **Zápasy dnes** (nebo „Zápas dne“) s odkazem na detail a CTA.

---

## Blok 9: Historie výsledků

- [ ] **9.1** Při aktualizaci z Odds API: pokud zápas skončil, uložit výsledek do `zapasy.vysledek` (nebo do samostatné tabulky `historie_vysledky` dle ROZKLAD-DETAILY A8).
- [ ] **9.2** Na stránce detailu ukončeného zápasu zobrazit **„Jak to dopadlo“** (skóre) a CTA „Vsadit na další zápas“ (odkaz na seznam zápasů nebo na sázkovku).

---

## Blok 10: AI preview zápasů (volitelně)

- [ ] **10.1** Skript nebo API route: pro nový zápas (nebo zápasy bez seo_preview) zavolat AI (OpenAI apod.), vygenerovat krátký SEO text; uložit do `zapasy.seo_preview`.
- [ ] **10.2** Spouštět po každém načtení zápasů z Odds API (jen pro nové) nebo jednou denně; zobrazit preview na stránce detailu zápasu.

---

## Blok 11: Články – databáze a zdroje

- [ ] **11.1** Tabulka `clanky`: id, typ (news/blog/pr_placeny), titul, slug, perex, telo, zdroj_url, zdroj_nazev, affiliate_cta_kasino_id, affiliate_cta_sazkovka_id, je_placena_spoluprace, published_at, created_at, updated_at.
- [ ] **11.2** API route / Cron: stáhnout z definovaných RSS zdrojů (sport, kasina) nové články; ukládat do `clanky` (typ news) nebo nejdřív do fronty na AI přepis.
- [ ] **11.3** (Volitelně) AI přepis: pro stažený článek vygenerovat přepis pro unikátnost; uložit do `telo`, přiřadit CTA (kasino/sázkovka). Cron nebo ruční spuštění.

---

## Blok 12: Stránky článků a blogu

- [ ] **12.1** Stránka **Seznam článků** (`/clanky` nebo `/blog`): načíst z Supabase; filtrovat podle typu (všechny / blog / novinky); zobrazit titul, perex, datum.
- [ ] **12.2** Stránka **Detail článku** (`/clanky/[slug]`): titul, perex, tělo; na konci box **„Kde vsadit / zahrát“** s 1–3 affiliate odkazy (z affiliate_cta_…). Pokud `je_placena_spoluprace` = true, zobrazit označení „Spolupráce“ / „Placená spolupráce“.
- [ ] **12.3** Možnost ručně přidat blog článek (admin formulář nebo vložení do DB); typ `blog`. PR články označit.

---

## Blok 13: Fyzický katalog – mapa a místa

- [ ] **13.1** Stránka **Mapa poboček** (`/mapa` nebo `/pobocky`): načíst `mista` z Supabase; zobrazit na mapě (Google Maps API nebo Mapbox). Při kliknutí na místo: název, adresa; CTA „Zaregistruj se online, než tam půjdeš“ s affiliate odkazem příslušné sázkovky/kasina.
- [ ] **13.2** Seznam míst pod mapou nebo na samostatné stránce; filtrovat podle typu (pobočka sázkovky / kasino) a podle sázkovky/kasina.
- [ ] **13.3** Google Maps API: získat API klíč; omezit na potřebné endpointy (mapa, geocode pokud budete doplňovat souřadnice).

---

## Blok 14: Aktualizace poboček (Apify / cron)

- [ ] **14.1** Definovat nebo vybrat Apify scénář (scraping oficiálních stránek sázkových kanceláří pro seznam poboček).
- [ ] **14.2** API route / skript: jednou za měsíc volat Apify; porovnat s tabulkou `mista`; deaktivovat neexistující (aktivni = false), přidat nové. Cron v `vercel.json`.

---

## Blok 15: Safe Play a Poradna

- [ ] **15.1** Tabulka `poradna`: id, slug, titul, telo, kategorie (faq, adiktologie, pomoc), razeni, updated_at.
- [ ] **15.2** Statické stránky **Safe Play**: Blokace, RUP, kontakty na pomoc, help linka, adiktologie, poradenství (obsah z vlastních textů). Odkazy v patičce a v menu.
- [ ] **15.3** Stránka **Poradna** (`/poradna`): seznam článků z tabulky `poradna` (FAQ, jak začít, blokace, …). Bez affiliate uvnitř poradny; odkaz na „Kde vsadit“ v patičce/sidebaru je OK.
- [ ] **15.4** Naplnit první záznamy do `poradna` a Safe Play stránky (texty).

---

## Blok 16: Registrace uživatelů a výhody

- [ ] **16.1** Zapnout Supabase Auth (e-mail + heslo); stránka Registrace a Přihlášení.
- [ ] **16.2** Tabulka `user_preferences` (nebo rozšíření auth profilu): user_id, oblíbene_tymy (array), oblíbene_ligy (array), souhlas_newsletter, souhlas_pripominky; případně uložená srovnání (sazkovky_ids).
- [ ] **16.3** Po přihlášení: stránka **Můj účet** – správa souhlasů (newsletter zap/vyp, připomínky zap/vyp), oblíbené týmy/ligy (výběr a ukládání).
- [ ] **16.4** Funkce **„Připomeň mi zápas“**: u detailu zápasu tlačítko (pouze pro přihlášené); uložit do `pripominky` (user_id, zapas_id, odeslat_v); cron 1× za čas poslat e-mail (Supabase Edge Function nebo externí služba) s odkazem na zápas a CTA na sázkovku.
- [ ] **16.5** **Newsletter**: odběr e-mailů se souhlasem; odesílání (např. Resend + Supabase) s obsahem (přehled zápasů, bonusy) a affiliate CTA. Odhlášení v každém mailu a v účtu.

---

## Blok 17: Sledování konverzí a optimalizace

- [ ] **17.1** Nastavit události (klik na CTA „Vsadit“, „Registrovat“) – např. Google Analytics 4 nebo Plausible; respektovat cookie souhlas.
- [ ] **17.2** Pravidelně vyhodnocovat: které zápasy/sporty/sázkovky mají nejvíc kliků; podle toho upravit obsah (více MMA, zvýraznit konkrétní sázkovku) a umístění CTA.

---

## Blok 18: Grafika, UX a potenciál

- [ ] **18.1** Jednotný design: typografie, barvy, tlačítka CTA; responzivní layout (mobilní verze prioritně).
- [ ] **18.2** **„Zápas dne“** na homepage: jeden výrazný blok (zápas + kurzy + CTA).
- [ ] **18.3** **Schema.org**: přidat strukturovaná data pro zápasy (Event), sázkovky (Organization), články (Article) – JSON-LD v layoutu nebo na stránkách.
- [ ] **18.4** Tlačítka **Sdílet** (sociální sítě) u detailu zápasu a u článků; odkaz na náš web.
- [ ] **18.5** (Pokud API umí) U zápasu zobrazit **změnu kurzu** („Kurz na domácí klesl o X %“).
- [ ] **18.6** Optimalizace rychlosti: lazy loading obrázků, rozumné cachování dotazů na Supabase.

---

## Blok 19: Testování a spuštění

- [ ] **19.1** Kontrolní seznam před spuštěním: pouze licencované brandy v DB; cookie lišta, GDPR, OP zveřejněné; 18+, Safe Play a Poradna viditelné; PR a placené umístění označené; O nás / Jak nás podporujete.
- [ ] **19.2** Testování v prohlížečích a na mobilu; základní přístupnost (čitelné fonty, kontrast).
- [ ] **19.3** Production deploy na Vercel; vlastní doména (DNS); ověřit env proměnné (Supabase, API klíče).

---

## Přehled pořadí bloků

| Pořadí | Blok | Obsah |
|--------|------|--------|
| 0 | Příprava | API výběr, affiliate účty, právní texty |
| 1 | Základ | Next.js, Supabase client, layout, homepage placeholder |
| 2 | DB – základ | Tabulky sazkovky, kasina, hry, mista; RLS; první data |
| 3 | Právní | GDPR, OP, O nás, cookie lišta, 18+ |
| 4 | Katalog | Stránky sázkovky a kasina + CTA |
| 5 | Hry a bonusy | Hry, srovnání bonusů |
| 6 | DB – sport | Tabulky zapasy, kurzy; mapování na sázkovky |
| 7 | Odds API | Integrace + Vercel Cron |
| 8 | Stránky zápasů | Seznam, detail, CTA |
| 9 | Historie výsledků | Ukládání a zobrazení „jak to dopadlo“ |
| 10 | AI preview | (Volitelně) SEO text zápasu |
| 11 | Články – DB a zdroje | Tabulka, RSS, AI přepis |
| 12 | Stránky článků | Seznam, detail, CTA, označení PR |
| 13 | Mapa a místa | Google Maps, seznam, CTA |
| 14 | Apify | Aktualizace poboček (cron) |
| 15 | Safe Play + Poradna | Stránky a obsah |
| 16 | Registrace a výhody | Auth, připomínky, newsletter |
| 17 | Konverze | Sledování událostí, optimalizace |
| 18 | Grafika a UX | Design, zápas dne, Schema.org, sdílení |
| 19 | Testování a launch | Checklist, deploy, doména |

Po dokončení bloků 0–5 máte **funkční kostru** s katalogem a právní jistotou. Po blocích 6–9 máte **sportovní modul** a hlavní tahoun trafficu. Po 10–15 **plný obsah** (články, mapa, Safe Play). Bloky 16–19 zvyšují **návratnost a potenciál** (registrace, konverze, UX, launch).
