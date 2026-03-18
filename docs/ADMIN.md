# Administrace Winio (plný přehled)

Přístup: **`ADMIN_EMAILS`** v `.env` + přihlášení přes Supabase → `/admin`.

Zápis do DB probíhá přes **service role** (obchází RLS).

---

## Přehled modulů (`/admin`)

| Sekce | Cesta | Účel |
|-------|--------|------|
| **Články** | `/admin/clanky` | Blog, novinky, PR; perex, tělo, **zdroj URL/název** (kurátor), CTA sázkovka/kasino |
| **Bannery** | `/admin/bannery` | Reklama / vlastní, upload, pozice, platnost |
| **Sázkovky** | `/admin/sazkovky` | Affiliate, bonusy, **`external_id`** (Odds API), pořadí |
| **Kasina** | `/admin/kasina` | Affiliate, licence, aktivita |
| **Hry** | `/admin/hry` | Typ hry, obrázek, **vazba na kasina** (kde hrát) |
| **Místa** | `/admin/mista` | Mapa: pobočka sázkovky / kasino, GPS, `external_id` (Apify), otevírací doba (JSON) |
| **Zápasy** | `/admin/zapasy` | Úprava zápasů: týmy, čas, stav, výsledek, SEO náhled. Nové řádky z cronu kurzů. |
| **Poradna** | `/admin/poradna` | FAQ / adiktologie / pomoc, slug, řazení |
| **Loterie** | `/admin/loterie` | Operátoři → produkty → **tahy** (výsledky losování) |

---

## Co zatím není v adminu

- **Jednotlivé kurzy** (`kurzy`) – jen přes import z Odds API; zápas lze ručně upravit.
- **Uživatelé, připomínky, preference** – tabulky `user_preferences`, `pripominky` v Supabase.
- **Nastavení cronů** – proměnné na Vercelu (`CRON_SECRET`, `RSS_FEEDS`, `ODDS_API_KEY`, …).

---

## Loterie (struktura adminu)

1. **Operátoři** – Allwyn, menší provozovatelé (`/admin/loterie/operatori`).
2. **Produkty** – Sportka, Eurojackpot… vázané na operátora (`/admin/loterie/produkty`, filtr `?operator=`).
3. **Tahy** – zápis data a textu výsledku (`/admin/loterie/tahy`).

Smazání operátora smaže kaskádově produkty a tahy.

---

## Technické

- Po úpravách se volá **`revalidatePath`** na dotčené veřejné stránky.
- Bannery: Storage bucket **`bannery`** (viz migrace `011_bannery.sql`).

---

*Menu v hlavičce adminu obsahuje odkazy na všechny sekce.*
