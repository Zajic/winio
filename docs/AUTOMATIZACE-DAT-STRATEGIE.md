# Strategie: co půjde automatizovat (loterie + sázkovky)

Cíl: **co nejvíc dat bez ruční práce**.  
Realita: **žádný jeden zdroj nepokrývá všechny české loterie ani všechny sázkové kanceláře**. Automatizace = **více kanálů + priorita podle dostupnosti API**.

---

## 1. Tři proudy dat

| Proud | Co chceme | Dnešní stav | Směr automatizace |
|-------|-----------|-------------|-------------------|
| **Sport / kurzy** | Zápasy + kurzy u více sázkovek | The Odds API → `zapasy`, `kurzy`, cron `/api/cron/odds` | Rozšířit sporty/ligy, mapovat `external_id`; **doplnit 2. zdroj** pro CZ kanceláře, kde Odds API nestačí |
| **Loterie (výsledky tahů)** | Sportka, Eurojackpot, menší provozovatelé | Ručně / Supabase | **Oficiální API Allwyn u veřejnosti nebývá** → smlouva/feed, placený datový provider, nebo vlastní parser (právní riziko ToS) |
| **Obsah webu** | Články, bannery, provozovatelé | Část ručně, část z DB | Admin + případně RSS/import článků |

---

## 2. Sázkové kanceláře (maximum z automatizace)

**Už běží:** cron stahuje zápasy a kurzy podle [The Odds API](https://the-odds-api.com/) (`regions=eu`, trh `h2h`).  
Mapování na vaše řádky v `sazkovky` je přes **`external_id`** = klíč bookmakera v API.

**Co udělat pro „co nejvíc“:**

1. **Vyčíslit pokrytí** – v odpovědi API zkontrolovat, které `bookmakers` opravdu chodí u vašich sportů; u českých značek (Tipsport, Fortuna, …) často **chybí nebo jsou jen zřídka**.
2. **Druhý zdroj kurzů** (doporučeno jako fáze 2):
   - placené API s evropskými/CZ bookmakery, nebo  
   - **affiliate / partnerské XML/JSON feedy** (některé sítě dávají kurzy pro weby), nebo  
   - cílené integrace jen pro TOP zápasy (omezený počet requestů).
3. **Cron** – častější běh (např. 15 min), hlídat limity kreditů; logovat chyby.
4. **Zobrazení** – u zápasu ukázat „kurzy z API X“ + odkaz na sázkovku, kde nemáme číslo.

**Stop stav:** 100 % shoda s každou kanceláří na webu **bez jejich API** není reálná – zobrazíte nejlepší dostupný odhad + CTA na partnera.

---

## 3. Loterie (výsledky ze všech her)

**Oficiální veřejné JSON API** pro Sportku / Eurojackpot od Allwyn **běžně není dokumentované**. Možnosti:

| Přístup | Automatizace | Poznámka |
|---------|--------------|----------|
| **Obchodní feed od provozovatele** | Ano | Vyžaduje kontakt (např. B2B / média). |
| **Placený lottery data provider** | Ano | Globální trh (cena, licence dat). |
| **Parsování oficiálních stránek** | Technicky ano | Často proti podmínkám použití; křehké při redesignu. |
| **Ruční / poloautomat** | Částečně | Admin + hromadný import CSV. |

**Doporučená architektura v kódu (až budeme implementovat):**

- Cron např. `/api/cron/loterie` (chráněný jako odds cron).
- Tabulka nebo konfigurace: **pro každý `loterie_produkty` řádek** → typ zdroje (`oficialni_feed` | `provider_x` | `scraper_y`).
- Zápis do `loterie_tahy` s **deduplikací** (stejné datum + produkt = upsert / skip).
- Log tabulka nebo Sentry: poslední úspěch/chyba per zdroj.

Menší licencovaní provozovatelé – každý může mít jiný web; **stejný model**: jeden „fetcher“ na produkt.

---

## 4. Fáze implementace (návrh)

### Fáze A – rychlé posílení (sázkovky)
- [ ] Rozšířit `ODDS_API_SPORTS` / ligy dle zájmu návštěvníků.
- [ ] Projít `sazkovky.external_id` proti reálné odpovědi API; doplnit chybějící mapování.
- [ ] Monitoring cronu (e-mail při opakované chybě).

### Fáze B – loterie (minimálně Allwyn portfolio)
- [ ] Rozhodnout: **feed od Allwyn** vs **placený provider** vs **kontrolovaný parser**.
- [ ] Implementovat první fetcher (jedna hra, např. Eurojackpot – méně častá losování = méně nákladů na vývoj/test).
- [ ] Cron + idempotentní zápis do `loterie_tahy`.

### Fáze C – širší pokrytí
- [ ] Druhý provider kurzů nebo CZ bookmakeři.
- [ ] Další loterijní produkty a druzí provozovatelé (stejný pattern fetcherů).

---

## 5. Co z toho plyne pro „plně automatické“

- **Automatické načítání na webu** – ano: stránky čtou Supabase; cron doplňuje DB.
- **Automatické ze všech subjektů bez výjimek** – **ne** bez smluv nebo placených dat; u CZ sázkovek často **částečné** pokrytí.
- **Smysluplný cíl:** maximalizovat pokrytí v rámci **legálních zdrojů a rozpočtu**, zbytek doplnit odkazy na oficiální výsledky / partnery.

---

## 6. Související dokumenty

- `docs/NASTAVENI-CRON-ODDS.md` – kurzy a zápasy (The Odds API).
- `docs/LOTERIE.md` – tabulky loterií.
- `docs/rozhodnuti/odds-api-vyber.md` – rozšířit o „druhý zdroj“ až bude vybraný.

*Tento dokument slouží jako roadmap; konkrétní fetchery implementujeme podle zvoleného zdroje dat.*
