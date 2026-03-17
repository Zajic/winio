# Supabase – migrace a seed (Blok 2)

## Jak spustit

1. Otevřete **Supabase Dashboard** → váš projekt → **SQL Editor**.
2. Spusťte v pořadí:
   - **001_initial_schema.sql** – vytvoří tabulky `sazkovky`, `kasina`, `hry`, `hry_kasina`, `mista` a RLS (veřejné čtení).
   - **002_seed.sql** – vloží 3 sázkové kanceláře a 2 kasina (affiliate URL doplňte v Dashboardu nebo dalším SQL).
   - **003_sazkovky_bonus.sql** – přidá sloupce `bonus_uvodni`, `bonus_popis`, `freebet` do tabulky `sazkovky` (Blok 5 – srovnání bonusů).

## Tabulky

| Tabulka      | Popis |
|-------------|--------|
| `sazkovky`  | Sázkové kanceláře (název, slug, affiliate URL, licence, …). |
| `kasina`    | Online kasina (název, slug, affiliate URL, licence, …). |
| `hry`       | Hry – automaty, rulety (typ enum). |
| `hry_kasina`| M:N – u které hry je v kterém kasinu. |
| `mista`     | Fyzická místa (pobočky sázkovky, kamenné kasino); typ enum, FK na sazkovka_id nebo kasino_id. |

## RLS

- **SELECT** (čtení): povoleno pro všechny (anon i authenticated) – veřejný katalog.
- **INSERT / UPDATE / DELETE**: žádná policy pro anon → zápis jen přes service_role (Dashboard, nebo backend s service key). Data tedy lze upravovat v Supabase Table Editor nebo později z adminu.

## Po spuštění

- V Table Editoru můžete doplnit `affiliate_url_registrace` u sazkovky a `affiliate_url` u kasina.
- Aplikace (Blok 4) bude z těchto tabulek načítat seznamy a zobrazovat CTA.
