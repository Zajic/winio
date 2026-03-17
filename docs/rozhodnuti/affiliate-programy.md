# Blok 0.2 – Affiliate programy (sázkovky a kasina)

Cíl: založit affiliate účty u vybraných sázkových kanceláří a kasin; mít přehled pravidel a odkazů.

---

## Pravidla z projektu

- Pouze **licencované** operátory (EU/ČR).
- Odkazy a pravidla použití ukládat na jednom místě; v aplikaci pak použít z DB (tabulky `sazkovky`, `kasina`).

---

## Sázkové kanceláře (ČR – licencované)

| # | Název | Affiliate program (URL) | Registrace | Affiliate URL / promo | Pravidla (odkaz) | Poznámka |
|---|-------|-------------------------|------------|------------------------|------------------|----------|
| 1 | Tipsport | *(vyplnit)* | hotovo / ne | | | |
| 2 | Fortuna | *(vyplnit)* | hotovo / ne | | | |
| 3 | Chance | *(vyplnit)* | hotovo / ne | | | |
| 4 | Betano | *(vyplnit)* | hotovo / ne | | | |
| 5 | *(další)* | | | | | |

**Pravidla k ověření:** zda smíme zobrazovat logo, jak označovat odkazy, zákaz určitých tvrzení („jistá výhra“ apod.), 18+.

---

## Online kasina (licencované – CZ/EU)

| # | Název | Affiliate program (URL) | Registrace | Affiliate URL | Pravidla (odkaz) | Poznámka |
|---|-------|-------------------------|------------|---------------|------------------|----------|
| 1 | *(vyplnit)* | | hotovo / ne | | | |
| 2 | *(vyplnit)* | | hotovo / ne | | | |

---

## Kde ukládat citlivé údaje

- **Affiliate URL a promo kódy:** až v aplikaci v Supabase (tabulky `sazkovky.affiliate_url_registrace`, `sazkovka.affiliate_param`, `kasina.affiliate_url`). Do tohoto souboru nepsat konkrétní affiliate linky – pouze „mám / nemám“, odkaz na program.
- **API klíče:** pouze v env proměnných (Vercel, lokální `.env`), nikdy v Gitu.
- Tento soubor: pouze checklist a odkazy na veřejné stránky programů / pravidel.

---

## Checklist 0.2

- [ ] Založit affiliate účet u alespoň 2 sázkových kanceláří.
- [ ] Založit affiliate účet u alespoň 1 online kasina (pokud bude sekce kasin od startu).
- [ ] Přečíst a uložit odkaz na pravidla použití u každého partnera.
- [ ] Do projektu (později DB) doplnit affiliate URL až po schválení účtu.
