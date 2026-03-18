# Nastavení Cronu a Odds API (Blok 7)

Tento krok **není nutné udělat hned**. Můžeš pokračovat v dalších blocích (články, mapa, Safe Play, …). Stránky `/zapasy` a homepage blok „Zápasy dnes“ budou fungovat – jen zůstanou prázdné, dokud neprovedeš nastavení níže.

---

## Co udělat (až budeš chtít spustit načítání zápasů a kurzů)

### 1. Vercel – Environment Variables

V projektu na Vercel: **Settings → Environment Variables**. Přidej:

| Proměnná | Povinné | Popis |
|----------|--------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | ano | Supabase Dashboard → Project Settings → API → **service_role** (secret). Pouze pro cron (zápis do `zapasy`, `kurzy`). |
| `ODDS_API_KEY` | ano | Klíč z [The Odds API](https://the-odds-api.com/). |
| `CRON_SECRET` | ano | Libovolný tajný řetězec (např. vygenerovaný). Používá se pro volání `/api/cron/odds` (např. `Authorization: Bearer <CRON_SECRET>`). |
| `ODDS_API_SPORTS` | ne | Klíče sportů z `GET /v4/sports/`, čárkou. **Pokud máš jen hokej**, pravděpodobně máš v env jen `icehockey_nhl` – přidej fotbal a MMA, např. `icehockey_nhl,soccer_epl,soccer_germany_bundesliga,soccer_uefa_champs_league,mma_mixed_martial_arts`. **Nebo proměnnou smaž** – použije se výchozí seznam v kódu (NHL + EPL, Bundesliga, La Liga, LM + MMA). |

Po přidání proměnných znovu nasaď projekt (redeploy).

---

### 2. Supabase – `external_id` u sázkověk

Cron mapuje bookmakery z Odds API na naše sázkovky podle sloupce **`sazkovky.external_id`**.

- V Supabase: **Table Editor → sazkovky** (nebo SQL).
- U každé sázkovky, u které chceš zobrazovat kurzy, nastav **`external_id`** na klíč, pod kterým ji vrací The Odds API.
- Běžné hodnoty (zkontroluj v [dokumentaci API](https://the-odds-api.com/liveapi/guides/v4/#parameters) nebo v odpovědi API): např. `bet365`, `pinnacle`, `bwin`, `unibet`, `tipsport` (pokud API podporuje) atd.

Příklad (SQL v Supabase):

```sql
UPDATE sazkovky SET external_id = 'bet365'   WHERE slug = 'bet365';
UPDATE sazkovky SET external_id = 'pinnacle' WHERE slug = 'pinnacle';
-- atd.
```

Bez nastaveného `external_id` u sázkovky se pro ni kurzy neukládají.

---

### 3. První načtení dat

- **Na Vercelu:** Po nasazení s nastavenými env proměnnými cron sám volá `/api/cron/odds` každých 15 minut. Stačí chvíli počkat (nebo spustit deploy).
- **Ručně (lokálně nebo z Postmana):**  
  `GET https://<tvuj-projekt>.vercel.app/api/cron/odds`  
  s hlavičkou: `Authorization: Bearer <tvuj CRON_SECRET>`.

Po úspěšném běhu se naplní tabulky `zapasy` a `kurzy`; na `/zapasy` a na homepage se zobrazí zápasy. Cron také volá **Scores API** (`daysFrom=1`) a u ukončených zápasů nastaví `stav = ukonceny` a `vysledek` (skóre).

**Ruční nastavení výsledku:**  
`PATCH /api/admin/zapasy/{id}` s hlavičkou `Authorization: Bearer <CRON_SECRET>` a tělem JSON: `{ "stav": "ukonceny", "vysledek": "2 : 1" }`. Hodí se, když Odds API výsledek nemá.

---

## Shrnutí

| Úkol | Kdy |
|------|-----|
| Nastavit env na Vercelu | Až budeš chtít mít zápasy a kurzy v provozu |
| Nastavit `external_id` u sázkověk v Supabase | Stejně jako výše |
| První spuštění cronu | Automaticky po deployi, nebo ručně dle bodu 3 |

**Pokud to teď neuděláš:** Můžeš normálně pokračovat v dalších blocích. Zápasy a kurzy budou k dispozici až po tomto nastavení.
