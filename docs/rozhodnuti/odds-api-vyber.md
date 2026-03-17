# Blok 0.1 – Výběr Odds API (sportovní zápasy a kurzy)

Cíl: rozhodnout konkrétní API pro stahování zápasů a kurzů; zkontrolovat ceny a limity.

---

## Požadavky z projektu (ROZKLAD-DETAILY, PROJEKT-ZADANI)

- Zápasy: fotbal, hokej, MMA (soutěž, týmy, datum/čas).
- Kurzy: více sázkových kanceláří (Tipsport, Fortuna, Betano atd.) – mapování na naše affiliate.
- Frekvence: aktualizace cca každých 15 min (nebo dle limitu API).
- Pouze oficiální / důvěryhodné zdroje (compliance).

---

## Možnosti k porovnání

### 1. RapidAPI – Sports Odds API / podobné

- **Zdroj:** rapidapi.com (vyhledat „sports odds“, „betting odds“).
- **Ceny (orientačně):** Free tier cca 500 požadavků/měsíc; placené od cca 10–100 USD/měsíc podle objemu.
- **Limity:** rate limit na hodinu; počet requestů/měsíc.
- **Poznámka:** Zkontrolovat, zda jsou v odpovědi české sázkovky (Tipsport, Fortuna) nebo jen globální (Bet365, Pinnacle). Pokud jen globální, stále použitelné – mapovat na naše partnery, kteří v API jsou.

**Krok:** Na RapidAPI vyhledat konkrétní API (např. „The Odds API“, „API-Football“ + odds), otevřít dokumentaci a pricing; zapsat sem vybraný název a plán.

### 2. The Odds API (the-odds-api.com)

- **Model:** kreditový (např. 20 000 kreditů/měsíc od cca 30 USD).
- **Pokrytí:** desítky sázkových kanceláří; často včetně evropských.
- **Krok:** Zkontrolovat na webu pokrytí (ČR / EU bookmakers), ceny, limity; zapsat sem.

### 3. API-Football (RapidAPI) + samostatné Odds API

- **API-Football:** zápasy, výsledky, ligy (fotbal). Kurzy nemusí být v základu.
- **Kombinace:** zápasy z API-Football, kurzy z jiného Odds API – více integrací, ale flexibilita.
- **Krok:** Rozhodnout, zda stačí jeden provider (zápasy + kurzy) nebo dva.

---

## Rozhodnutí (vyplnit po kontrole)

| Položka | Hodnota |
|---------|--------|
| **Vybrané API** | *(název a URL)* |
| **Plán / cena** | *(např. Pro 39.99 USD/měsíc)* |
| **Limit requestů** | *(měsíčně / denně / hodinově)* |
| **Podporované sporty** | fotbal, hokej, MMA: ano/ne |
| **Podporované sázkovky** | *(seznam; zda Tipsport, Fortuna, Betano…)* |
| **Dokumentace** | *(odkaz na docs)* |
| **API klíč** | *(uchovávat v env, ne v repo)* |

---

## Odhad použití pro Winio

- Aktualizace každých 15 min = 4× za hodinu × 24 × 30 ≈ 2 880 volání/měsíc jen pro jeden endpoint (zápasy + kurzy). Pokud jeden request = jeden sport/liga, násobit počtem lig.
- Zvolit plán s rezervou (např. 5 000–10 000 requestů/měsíc pro start).

---

## Checklist 0.1

- [ ] Projít alespoň 2 možnosti (RapidAPI + The Odds API nebo jiný).
- [ ] Ověřit pokrytí: fotbal, hokej, MMA; případně české sázkovky.
- [ ] Vyplnit tabulku „Rozhodnutí“ výše.
- [ ] Založit účet a API klíč; uložit klíč do `.env` (později v projektu) – nikdy necommittovat do Gitu.
