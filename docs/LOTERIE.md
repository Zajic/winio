# Loterie (Allwyn + menší provozovatelé)

## Migrace

`supabase/migrations/012_loterie.sql` vytvoří:

- `loterie_operatori` – provozovatelé (seed: **Allwyn**, dva řádky pro menší subjekty s placeholdery)
- `loterie_produkty` – hry (seed u Allwyn: Sportka, Eurojackpot, Šťastných 10)
- `loterie_tahy` – poslední losování (ručně nebo později import)

## Obsah

- **Allwyn** je veden jako hlavní provozovatel; v popisu je zmíněno portfolio dříve spojované se Sazkou.
- Dva menší řádky mají generické názvy – v Supabase upravte `nazev`, `slug` (pozor na odkazy `/loterie/[slug]`), `popis`, `web_url`. Nepoužívaného provozovatele nastavte `aktivni = false`.

## Veřejné stránky

- `/loterie` – seznam
- `/loterie/[slug]` – detail provozovatele, produkty, poslední tahy (pokud jsou v DB)

## Admin

CRUD pro loterie zatím není; úpravy přes Supabase Table Editor nebo SQL.

## Automatizace výsledků

Veřejné API od provozovatelů často není – viz **`docs/AUTOMATIZACE-DAT-STRATEGIE.md`** (loterie + sázkovky, realistický plán).
