# Články z RSS – kurátorský model (Winio)

## Princip

- Z RSS se ukládá **jen titulek** a **krátký textový výňatek** z elementu `<description>` (max. délka nastavitelná, výchozí **300 znaků**).
- Element **`content:encoded`** se **neparsuje** – tam bývá celý článek; ten u nás neukládáme.
- Sloupec **`telo`** u importovaných novinek zůstává **`null`** – plné znění je jen u vydavatele.
- Na detailu stránky je **výrazný odkaz** na původní článek s `rel="nofollow noopener noreferrer"`.

## Konfigurace

| Proměnná | Význam |
|----------|--------|
| `RSS_FEEDS` | URL feedů oddělené čárkou (jako dřív). |
| `RSS_PEREX_MAX_CHARS` | Volitelně 80–600, výchozí 300. Delší výňatek = vyšší riziko překryvu s originálem. |

## Cron

Stejně jako dřív: `GET /api/cron/rss` s `Authorization: Bearer <CRON_SECRET>`.

Po nasazení změn **znovu spusť cron** – u existujících řádků se při dalším běhu zkrátí perex na nový limit.

## Vlastní obsah

- **Blog / PR** – plný text v `telo`, bez povinného odkazu na cizí zdroj.
- **Novinka s vlastním doplněním** – typ `news`, `zdroj_url` vyplněn; do `telo` lze v adminu doplnit krátký **komentář redakce** (zobrazí se pod odkazem na zdroj).

## Právní / SEO

Tento postup odpovídá doporučení **nekopírovat celé články**; zdroj je vždy uveden odkazem. Při pochybnostech zkrátit `RSS_PEREX_MAX_CHARS` nebo právně konzultovat konkrétní feedy.
