# Winio – Projektové zadání a rozfázovaný plán

## 1. Co projekt je (shrnutí)

**Typ:** Affiliate-First Aggregator  
**Účel:** Rozcestník pro hazard a sázky v ČR. Žádná slepá ulička – každá stránka/sekce končí jasným CTA s partnerským odkazem (registrace, vsazení, návštěva).

**Proč to dává smysl:**
- Zápasy a sázky = každodenní vyhledávání ("Sparta Slavia kurzy") → opakovaná návštěvnost.
- Kurzy + tlačítko "Vsadit s bonusem u Tipsportu" = vysoká konverze.
- Češi masivně sázejí (Tipsport, Fortuna, Chance, Betano) → velký trh.

**Úskalí:** Sportovní data a live kurzy zdarma špatně; bude potřeba placené API (cca 500–1 500 Kč/měsíc). Při očekávaném výdělku zanedbatelné.

---

## 2. Právní rámec (EU a ČR) – závazné

- **Vše se musí řídit zákony EU a ČR.** Žádné obcházení regulace.
- **Žádné černé herny ani nelegální operátoři.** Na webu pouze **oficiální, licencované** zdroje:
  - Sázkové kanceláře a kasina s platnou licencí (ČR, MGA, Malta, Curaçao v rozsahu povoleném právem atd.).
  - Fyzická místa pouze ověřená (oficiální weby, ověřené zdroje).
- **Data a zdroje:** Pouze oficiální nebo důvěryhodné API / zdroje. Žádný nelegální scraping nelegálních operátorů.
- **Reklama a affiliate:** V souladu s pravidly reklamy na hazard (označení 18+, zodpovědné sázení, zákaz cílení na zranitelné).
- **Safe Play a RUP** jsou součástí compliance; web musí působit důvěryhodně a regulátorům přijatelně.

### 2.1 Informační charakter webu – žádné hraní u nás, žádná herní licence

- **Jsme pouze informativní web.** Na našem webu se neprovozuje hazard, nesbíráme sázky, neběží u nás žádné hry ani sázení.
- **Účel:** Poskytujeme informace (kurzy, srovnání, odkazy, články) a odvádíme návštěvníky na **licencované operátory**, u kterých uživatelé sázejí nebo hrají. My pouze odkazujeme.
- **Důsledek:** Nepotřebujeme **speciální herní licenci** (ta je pro provozovatele her/sázek). Chceme zůstat v režimu informačního/media webu a neporušit zákon. Toto vymezení musí být na webu jasně uvedeno (Obchodní podmínky, O nás / Jak nás podporujete).

---

## 3. Vize a pravidla

- **Vize:** „Heureka pro veškerý hazard a sázky.“
- **Pravidlo CTA:** Každá část webu musí vést na affiliate (registrace / vsazení / návštěva). Žádná stránka bez CTA.
- **Pravidlo legality:** Pouze licencované brandy a ověřené zdroje; vše v souladu s EU a ČR.

---

## 4. Obsahové pilíře (co na webu bude)

| Pilíř | Popis | Zdroj dat | CTA / Funnel |
|------|------|-----------|--------------|
| **Fyzický katalog** | Mapa kasin a poboček sázkových kanceláří (pouze licencované) | Google Maps API, ověřené zdroje / Apify | „Zaregistruj se online, než tam půjdeš“ |
| **Online herny (Casino)** | Databáze her, automatů, rulet – pouze licencovaná kasina | Vlastní DB + affiliate | U každé hry: „Kde si to zahrát“ → odkazy na licencovaná kasina |
| **Sport & Zápasy (Betting)** | Aktuální a nadcházející zápasy (fotbal, hokej, MMA), kurzy | Placené Odds API (oficiální/důvěryhodné) | U zápasu: srovnání kurzů + „Vsadit u Fortuny/Tipsportu“ |
| **Zpravodajství (News)** | Bleskovky ze sportu a kasin | RSS + AI přepisy (zdroje ověřené) | Článek končí odkazem do kasina / sázkovky |
| **Blog** | Články, návody, tipy, recenze (SEO + důvěra) | Vlastní / AI doplněné; placené PR články označené | CTA na licencované kasino/sázkovku; u PR jasné označení |
| **Historie** | Výsledky zápasů, kurzy v čase, statistiky („jak to dopadlo“) | Odds API + vlastní archiv | Kontext pro budoucí sázky; CTA „Vsadit na další zápas“ |
| **Poradna** | FAQ, jak začít sázení, jak blokace funguje, adiktologie, pomoc | Statický + vlastní články; linka, RUP | Důvěra, compliance; odkazy na pomoc, bez affiliate v poradně samotné |
| **Safe Play** | Zodpovědnost, blokace, RUP, pomoc | Statický/vlastní obsah | Důvěryhodnost, licence; help linka, články, adiktologie |

---

## 5. Automatizace (bez ruční dřiny)

- **Sázková data:** Odds API → každých cca 15 min dotaz: zápasy + kurzy (Tipsport, Betano atd.) → automatický výpis na web.
- **AI copywriter:** Skript (např. v Cursoru): vstup = data z API (např. „Real Madrid vs Barcelona“); výstup = krátké SEO preview zápasu (ChatGPT na pozadí).
- **Fyzické pobočky:** Jednou za měsíc robot (Apify): ověření, zda pobočka nezanikla / nevznikla nová.

---

## 6. Rozfázovaný plán (co budeme tvořit a v jakém pořadí)

**Zásada: Nejdřív systém (data, logika, API, DB). Grafika a vizuál až naposledy.**

### Fáze 0: Příprava (než začneme kódovat)
- [x] **Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (DB + Auth), Vercel (hosting + Cron), Git. Detail: **STACK.md**.
- [x] **DB a hosting:** Supabase založený; Git a Vercel založené.
- [ ] Rozhodnutí o sportovním API (Odds API / RapidAPI – které konkrétně).
- [ ] Affiliate účty (Tipsport, Fortuna, …) a pravidla použití odkazů.
- [ ] **Právní příprava:** Návrh textů Obchodních podmínek, Zásad ochrany osobních údajů (GDPR), znění cookie lišty; konstatování „pouze informační web, žádné sázení/hraní u nás“.

---

### Fáze 1: Systém – databáze a základní struktura („Měsíc 1“)
**Cíl:** Databázová struktura pro kasina a sázkovky; právní stránky a compliance; žádná složitá grafika.

1. **Datový model**
   - **Fyzická místa:** kasina, pobočky sázkových kanceláří (název, adresa, souřadnice, otevírací doba, zdroj – Maps/scraping).
   - **Online kasina:** záznamy kasin (název, URL, affiliate link, popis, licence).
   - **Hry:** automaty, rulety; vazba na kasina (kde si zahrát).
   - **Sázkové kanceláře:** entity (Tipsport, Fortuna, …) + jejich affiliate odkazy a parametry (bonus, podmínky).

2. **API / backend**
   - CRUD nebo minimálně „čtení“ pro: místa, kasina, hry, sázkovky.
   - Příprava na budoucí napojení Odds API (služba, která bude ukládat zápasy a kurzy).

3. **První affiliate odkazy**
   - U kasin a sázkových kanceláří uložit a zobrazit CTA (tlačítko „Zaregistruj se“ / „Vsadit“) – bez důrazu na design, důležitá funkčnost.

4. **Právní stránky a compliance (před / při spuštění)**
   - **Cookie lišta:** První návštěva – informace o cookies, odkaz na Zásady ochrany soukromí, možnost souhlasu / odmítnutí (dle GDPR). Ukládání preference (např. localStorage).
   - **GDPR:** Stránka „Ochrana osobních údajů“ / „Zásady ochrany soukromí“ – jak zpracováváme údaje, právní důvody, práva uživatelů, kontakty, cookies.
   - **Obchodní podmínky:** Účel webu (pouze informace), že u nás nelze sázet ani hrát, odkazy na licencované operátory, odpovědnost, 18+, případně pravidla pro placené spolupráce.
   - **O nás / Jak nás podporujete:** Krátce kdo jsme, že web je informační a financovaný z affiliate a placeného umístění; zdůraznění „žádné hraní u nás“.

5. **Doporučení z analýzy (z DOPORUCENI-A-ANALYZA)**
   - Označení **18+** na webu (patička / hlavička).
   - **Filtry podle licence** v katalogu (např. „Pouze CZ licence“, „EU licence“).
   - **Srovnání bonusů** sázkových kanceláří (tabulka: bonus, freebet, odkaz na sázkovku) – připravit strukturu dat.

**Výstup:** Funkční „kostra“: data v DB, základní API, zobrazení katalogu kasin/sázkovek s CTA; cookie lišta, GDPR, obchodní podmínky a O nás nasazené. Grafika jen minimální (čistě systém).

---

### Fáze 2: Systém – sportovní modul („Měsíc 2–3“)
**Cíl:** Zápasy a kurzy z API; šablony pro zápasy; párování s affiliate.

1. **Integrace sportovního API**
   - Napojení na Odds API (nebo vybrané RapidAPI).
   - Pravidelné stahování: zápasy (fotbal, hokej, MMA), kurzy po sázkovkách.

2. **Datový model pro sport**
   - Zápasy (datum, čas, soutěž, týmy, sport).
   - Kurzy (vazba na zápas + sázkovou kancelář, typ sázky, kurz).
   - Mapování sázkové kanceláře → náš affiliate odkaz.

3. **Šablony a zobrazení**
   - Stránka zápasu: srovnání kurzů + tlačítka „Vsadit u [Tipsport/Fortuna/…]“.
   - Seznam zápasů (dnes / zítra / podle soutěže).

4. **AI preview (volitelně v této fázi)**
   - Skript: data zápasu → krátký SEO text (AI). Ukládání do DB a zobrazení u zápasu.

5. **Historie výsledků**
   - Po skončení zápasu ukládat výsledek (skóre); zobrazení „Jak to dopadlo“, archiv kurzů. CTA „Vsadit na další zápas“.

**Výstup:** Automaticky aktualizované zápasy a kurzy, historie výsledků; každý zápas s CTA na sázkovky. Stále priorita systém, ne grafika.

---

### Fáze 3: Systém – zpravodajství, blog a obsah („Měsíc 4“)
**Cíl:** Automatické novinky + AI přepisy pro SEO; blog (vlastní články, návody); podpora PR článků (označené).

1. **RSS / zdroje**
   - Definice zdrojů (sport, kasina) – pouze ověřené.
   - Stahování a ukládání článků (název, perex, odkaz, datum).

2. **AI přepis / úprava**
   - Skript: stažený článek → přepis/úprava (AI) pro unikátnost a klíčová slova.
   - Uložení do DB jako vlastní článek s CTA na konci (pouze licencované kasino / sázkovka).

3. **Blog a PR články**
   - Blog: vlastní články (návody, recenze); typ `blog`. CTA na konci.
   - PR / placené články: typ `pr_placeny`, pole `je_placena_spoluprace`; v UI vždy označit („Spolupráce“).

4. **Zobrazení**
   - Seznam článků, detail článku s CTA. Označení placené spolupráce.

**Výstup:** Automatický obsah + blog; každý článek s CTA; PR transparentně označené.

---

### Fáze 4: Systém – fyzický katalog a scraping (paralelně nebo po Fázi 2)
**Cíl:** Mapa a seznam poboček; aktualizace bez ruční práce.

1. **Google Maps API**
   - Zobrazení míst (kasina, pobočky sázkovek) na mapě.
   - Propojení s DB (adresa, souřadnice).

2. **Scraping (Apify)**
   - Jednou za měsíc: kontrola zavřených / nových poboček.
   - Úprava záznamů v DB (deaktivace / přidání).

3. **CTA**
   - U každého místa: „Zaregistruj se online, než tam půjdeš“ s affiliate odkazem.

**Výstup:** Aktualizovaný katalog fyzických míst + mapa; CTA u každého záznamu.

---

### Fáze 5: Safe Play, poradna a důvěryhodnost
**Cíl:** Zodpovědnost, RUP, help, poradna (FAQ, návody, adiktologie) – nutné pro důvěru a licenci.

1. **Statické stránky / sekce**
   - Blokace, RUP, kontakty na pomoc, help linka, adiktologie, poradenství.
   - Odkazy v patičce a u citlivého obsahu.

2. **Poradna**
   - FAQ, jak začít, jak blokace funguje; odkazy na pomoc. Bez affiliate uvnitř poradny.
   - Datová struktura: slug, titul, tělo, kategorie (faq, adiktologie, pomoc).

3. **Integrace do systému**
   - Jednotná navigace a odkazování na Safe Play a Poradnu z hlavních pilířů.

**Výstup:** Web má jasně viditelnou zodpovědnost, poradnu a pomoc; připraveno na nároky regulatorů.

---

### Fáze 6: Ladění konverzí a datová zpětná vazba („Měsíc 5+“)
**Cíl:** Data řídí obsah a umístění CTA.

1. **Sledování**
   - Kde uživatelé klikají (které zápasy, které sázkovky, které články).
   - Který typ obsahu táhne (MMA vs fotbal, které kasino).

2. **Úpravy systému**
   - Více dat z API tam, kde je zájem (např. více MMA).
   - Bannery a CTA přesměrovat na nejvýkonnější partnery.

3. **Doporučení z analýzy (volitelně)**
   - Newsletter / notifikace („Připomeň mi zápas“, týdenní tipy) – pouze v souladu s GDPR (souhlas, odhlášení).
   - **Registrace uživatele a výhody pro registrované:** připomínky zápasů, oblíbené týmy/ligy, uložená srovnání, newsletter – důvod se vracet a kanál pro affiliate (e-mail). Detailní návrh: **DOPORUCENI-A-ANALYZA.md § 5**.

**Výstup:** Konverzně optimalizovaný web na základě reálných dat; stále systém a logika.

---

### Fáze 7: Grafika a UX (až když systém běží)
**Cíl:** Vzhled, branding, responzivita, rychlost.

1. **Design**
   - Jednotný vizuál, typografie, barvy.
   - Šablony stránek (zápas, kasino, článek, mapa) v finální podobě.

2. **UX**
   - Jasná CTA, čitelnost, **mobilní verze** (priorita – hodně trafficu z mobilu).
   - Rychlost načítání (obrázky, API).

3. **Doporučení z analýzy**
   - **„Zápas dne“ / „Tip dne“** na homepage – jeden výrazný blok s kurzy a CTA.
   - **Strukturovaná data (Schema.org)** pro zápasy (Event), sázkovky, články (Article) – lepší výstupy ve vyhledávači.
   - **Sdílení** – tlačítka Sdílet u zápasů a článků (odkaz na náš web).
   - **Změny kurzů** („kurz klesl / stoupl“) u zápasu, pokud API umí.

4. **Testování**
   - Prohlížeče, zařízení, přístupnost.

**Výstup:** Plně vypravený web po stránce systému i vzhledu.

---

## 7. Strategie výdělku – web se živí z affiliate a placeného umístění

- **Primárně – Affiliate:** CPA provize ze sázkových kanceláří a online kasin (registrace, první vklad). Sportovní události = impulsivní traffic a vysoké provize. Pouze partneři s platnou licencí.
- **Sekundárně – Placené umístění (monetizace webu):**
  - **Topování brandů:** Za úplatu lepší pozice v srovnání kurzů, „doporučení měsíce“, zvýraznění v katalogu kasin/sázkovek. Vždy transparentně (např. „Partnerský tip“ / „Spolupráce“) v souladu s pravidly reklamy.
  - **PR články / placený obsah:** Brandy si mohou objednat článek, recenzi nebo bannery. Takový obsah musí být **označen** (např. „Spolupráce“, „Placená spolupráce“), aby web zůstal důvěryhodný a v souladu s právem.
- **Terciárně:** B2B zápisy kamenných heren, prodej reklamních bannerů (tipařské weby, licencované operátoři).

**Pravidlo:** I placené umístění smí vést jen na **licencované** operátory; žádné černé herny.

---

## 8. Shrnutí pořadí fází (systém first, grafika last)

| Pořadí | Fáze | Zaměření |
|--------|------|----------|
| 0 | Příprava | Stack, DB (Supabase), API, affiliate, **právní texty (OP, GDPR, cookies)** |
| 1 | Databáze a struktura | Kasina, sázkovky, hry, první CTA, **cookie lišta, GDPR, obchodní podmínky, O nás**, 18+, filtry licence, srovnání bonusů |
| 2 | Sportovní modul | Odds API, zápasy, kurzy, šablony, AI preview, historie výsledků |
| 3 | Zpravodajství | RSS, AI přepisy, blog, články s CTA, PR označené |
| 4 | Fyzický katalog | Mapa, scraping poboček |
| 5 | Safe Play + Poradna | Zodpovědnost, RUP, help, poradna |
| 6 | Konverze | Sledování, optimalizace, newsletter (volitelně) |
| 7 | Grafika a UX | Design, mobil, zápas dne, Schema.org, sdílení, rychlost |

---

Tento dokument slouží jako jediný zdroj pravdy pro rozfázovanou tvorbu projektu. Další krok: začít **Fází 0** (příprava) a **Fází 1** (základní databázová struktura v Supabase pro kasina a sázkovky).

---

Viz také: **KROKY-IMPLEMENTACE.md** (konkrétní kroky v pořadí – co postupně tvořit a kompletovat), **STACK.md** (v čem tvoříme – Next.js, Supabase, Vercel, TypeScript, Tailwind), **ROZKLAD-DETAILY.md** (entity, zdroje, toky), **DOPORUCENI-A-ANALYZA.md** (doporučení, potenciál, flow).
