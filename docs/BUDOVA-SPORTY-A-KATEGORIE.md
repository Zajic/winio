# Budoucí doplnění: sporty a kategorie zápasů

Tento dokument slouží jako checklist pro rozšíření sportů nad rámec současného stavu (fotbal, hokej, MMA, basketbal, tenis, eSport).

---

## Kontext

- Na většinu sportů lze v ČR legálně sázet přes **licencované sázkové kanceláře** (18+, Safe Play, odkazy jen na CZ operátory).
- **The Odds API** má pro mnoho sportů vlastní `sport_key` (seznam: `GET https://api.the-odds-api.com/v4/sports/?apiKey=…`).
- V projektu se do DB ukládá:
  - **`zapasy.sport`** – normalizovaná kategorie pro filtry na `/zapasy` (např. `fotbal`, `hokej`, `zimni_sporty`),
  - **`zapasy.soutez`** – konkrétní klíč ligy / sportu z API (např. `soccer_epl`, `biathlon_world_cup`).

---

## Co doplnit postupně

### 1. Mapování v cronu `app/api/cron/odds/route.ts`

U funkce, která z `sportKey` dělá `sportLabel`, přidávat větve podle prefixu nebo konkrétních klíčů, např.:

| Oblast | Příklady prefixů / klíčů API | Navrhovaná hodnota `sport` |
|--------|------------------------------|----------------------------|
| Dostihy | `horse_racing_*` | `dostihy` |
| Šipky | `darts_*` | `sipky` |
| Kulečník / snooker | `snooker_*` | `kulecnik` |
| Plavání / atletika / cyklistika | `swimming_*`, `athletics_*`, `cycling_*` | `atletika` nebo jednotlivě |
| Zimní sporty | `biathlon_*`, `ski_*`, `ice_skating_*`, … | `zimni_sporty` (agregovaně) nebo více kategorií |
| Motorismus | `motorsport_*`, `formula1_*` | `motorismus` |
| Rugby, baseball, házená, volejbal | příslušné prefixy | vlastní štítky |

Po každé úpravě spustit cron `/api/cron/odds` a ověřit řádky v tabulce `zapasy`.

### 2. UI na `/zapasy` (`app/zapasy/page.tsx`)

- Rozšířit **`SPORT_LABELS`** o nové klíče (české názvy v navigaci).
- Přidat odkazy do pole u filtrů **Sport** (stejný vzor jako u Fotbal / Hokej / …).
- Volitelně: sekce **„Ostatní“** nebo rozbalovací seznam, až bude kategorií hodně.

### 3. Environment `ODDS_API_SPORTS`

- Do Vercelu (a `.env.local`) přidávat **platné klíče** z `/v4/sports/` (jen sporty „in season“).
- Každý nový klíč = **+1 request** na Odds API za běh cronu → hlídat limit a případně dělit crony (např. zimní sporty jen v sezóně).

### 4. Homepage „Zápas dne“

- Dnes bere zápasy z DB bez rozlišení kategorie; případně později:
  - preferovat fotbal/hokej,
  - nebo rotovat podle kategorie.

### 5. Detail zápasu `/zapasy/[id]`

- Zobrazit **`soutez`** srozumitelně (překlad klíče → název ligy v češtině), volitelně mapa v `lib/soutez-labels.ts`.

### 6. CZ kurzy (mimo Odds API)

- Pro přesné kurzy u Tipsport / Fortuna / … **feedy od partnerů** – nezávislé na rozšíření sportů v tomto dokumentu, ale stejná tabulka `kurzy` + `sazkovka_id`.

---

## Rychlý checklist při přidání nového sportu

1. Najít `sport_key` v dokumentaci The Odds API.  
2. Přidat klíč do **`ODDS_API_SPORTS`**.  
3. V **`route.ts`** (cron odds) namapovat na **`sport`**.  
4. V **`zapasy/page.tsx`** přidat label + filtr.  
5. Redeploy, spustit cron, zkontrolovat `/zapasy` a Supabase `zapasy`.

---

## Poznámka k „speciálním“ sázkám

Politika, zábava, reality show apod. – většinou **jiný typ produktu** než sportovní zápas; pokud je v budoucnu zařadíš, zvažit **samostatnou sekci** nebo typ záznamu, než míchat s `zapasy`.
