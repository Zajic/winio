# Winio – Technologický stack (v čem tvoříme projekt)

Jednoznačná definice technologií podle vytvořených dokumentů a již založených služeb (Supabase, Git, Vercel).

---

## 1. Co už máme

| Služba | Účel |
|--------|------|
| **Supabase** | Databáze (PostgreSQL), autentizace uživatelů, případně Edge Functions, Realtime |
| **Git** | Verzování kódu, spolupráce |
| **Vercel** | Hosting webu, serverless funkce, Cron úlohy |

---

## 2. Stanovený stack (v čem budeme tvořit)

| Vrstva | Technologie | Poznámka |
|--------|-------------|----------|
| **Frontend + server** | **Next.js** (App Router) | React framework; SSR/SSG pro SEO (zápasy, články), API routes / Server Actions, nativní podpora na Vercel |
| **Jazyk** | **TypeScript** | Typová bezpečnost, lepší údržba |
| **Databáze a auth** | **Supabase** | PostgreSQL (tabulky dle ROZKLAD-DETAILY.md), Supabase Auth (registrace, přihlášení), klient `@supabase/supabase-js` + `@supabase/ssr` pro Next.js |
| **Hosting a běh** | **Vercel** | Deployment z Gitu, serverless, **Vercel Cron** pro pravidelné joby (Odds API každých 15 min, RSS, Apify měsíčně) |
| **Styling** | **Tailwind CSS** | Rychlé responzivní UI, konzistence, malý bundle; později doplnit komponenty dle potřeby |
| **Verzování** | **Git** | Repozitář napojený na Vercel (preview + production deploy) |

---

## 3. Proč zrovna tento stack

- **Next.js + Vercel:** Ideální kombinace pro Vercel; SSR/SSG = dobré SEO pro tisíce stránek zápasů a článků; API routes nebo Server Actions pro volání Supabase a případně cron-triggered logiky.
- **Supabase:** Už máte založený; pokrývá DB i Auth (registrace uživatelů, připomínky, newsletter souhlas). Žádný vlastní auth server.
- **Vercel Cron:** V `vercel.json` naplánovat cron (např. Odds API, RSS, Apify) bez zvláštního serveru.
- **TypeScript:** Projekt bude růst (entity, API); typy sníží chyby a zjednoduší refaktoring.
- **Tailwind:** Rychlý vývoj UI a konzistentní responzivita; dokumenty zmiňují mobilní verzi jako prioritu.

---

## 4. Externí služby (z dokumentů)

| Služba | Účel | Fáze |
|--------|------|------|
| **Odds API** (např. RapidAPI) | Zápasy a kurzy | Fáze 2 |
| **Google Maps API** | Mapa poboček, souřadnice | Fáze 4 |
| **Apify** | Scraping poboček (měsíčně) | Fáze 4 |
| **AI (OpenAI apod.)** | Preview zápasu, přepis článků | Fáze 2–3 |

---

## 5. Shrnutí – „v čem tvoříme“

- **Kód:** Next.js (App Router) + TypeScript + Tailwind CSS, v repozitáři v Gitu.
- **Data a uživatelé:** Supabase (PostgreSQL + Auth).
- **Běh a joby:** Vercel (hosting + Cron).
- **Externí data:** Odds API, Google Maps, Apify, AI – napojení podle fází v PROJEKT-ZADANI.md.

Tím je stack pro projekt Winio určen; další vývoj se řídí tímto dokumentem a ROZKLAD-DETAILY.md (datový model).
