# Vyhodnocování konverzí (Blok 17.2)

Sledování CTA kliků (Blok 17.1) posílá události **cta_click** s parametry:
- `cta` – typ (např. `registrace_sazkovka`, `vsadit_zapas`, `registrace_kasino`, `registrace_bonusy`, `registrace_mapa`, `registrace_clanek`)
- `label` – název sázkovky/kasina
- `url` – cílový odkaz

**Doporučení:**
1. V GA4 nebo Plausible pravidelně vyhodnocuj: které `label` (sázkovky/kasina) a které stránky mají nejvíc kliků.
2. Podle toho uprav obsah: více zápasů daného sportu, zvýraznění konkrétní sázkovky v seznamech, umístění CTA blíž k hlavnímu obsahu.
3. A/B testy umístění tlačítka „Vsadit“ (nahoře vs. dole na detailu zápasu) podle konverzí.

Události se zaznamenávají **pouze při souhlasu s cookies** (cookie_consent === "accepted").
