# Winio – Rozkouskované detaily (entity, zdroje, toky)

Doplňující dokument k PROJEKT-ZADANI.md. Slouží k tomu, aby bylo před kódováním jasné **co přesně** budeme ukládat a **odkud** to bere.

**Právní zásada:** Pouze oficiální, licencované zdroje (EU a ČR). Žádné černé herny. Všechny brandy a operátoři v DB musí mít platnou licenci.

---

## A. Datové entity (co bude v DB)

### A1. Fyzická místa (pobočky, kasina)
| Pole | Typ | Poznámka |
|------|-----|----------|
| id | UUID | PK |
| typ | enum | `pobocka_sazkovky` \| `kasino` |
| nazev | string | |
| adresa | string | ulice, město, PSČ |
| lat, lng | number | pro mapu |
| sazkovka_id / kasino_id | FK | odkaz na sázkovku / online kasino |
| oteviraci_doba | JSON/text | volitelně |
| zdroj | string | `google_maps` \| `scraping` \| `rucne` |
| aktivni | boolean | false = zavřeno / vyřazeno |
| created_at, updated_at | timestamp | |

### A2. Sázkové kanceláře (brandy)
| Pole | Typ | Poznámka |
|------|-----|----------|
| id | UUID | PK |
| nazev | string | Tipsport, Fortuna, Betano… |
| slug | string | URL (tipsport, fortuna) |
| affiliate_url_registrace | string | partnerský odkaz |
| affiliate_param | string | např. promo kód |
| popis | text | volitelně |
| logo_url | string | později |
| licence | string | CZ, MGA… – pouze licencované |
| aktivni | boolean | |
| poradi_zobrazeni | int | pro řazení; lze ovlivnit placeným topováním |
| placene_umisteni | boolean | true = brand platí za lepší pozici / zvýraznění |

### A3. Online kasina
| Pole | Typ | Poznámka |
|------|-----|----------|
| id | UUID | PK |
| nazev | string | |
| slug | string | |
| affiliate_url | string | |
| popis | text | |
| licence | string | MGA, CZ… – pouze licencované operátory |
| aktivni | boolean | |
| placene_umisteni | boolean | true = placený zápis / doporučení |

### A4. Hry (automaty, rulety)
| Pole | Typ | Poznámka |
|------|-----|----------|
| id | UUID | PK |
| nazev | string | |
| slug | string | |
| typ | enum | `automat` \| `ruleta` \| `stolni_hra` |
| popis | text | |
| obrazek_url | string | později |
| kasina_ids | FK[] | kde si zahrát (M:N) |

### A5. Zápasy (sport)
| Pole | Typ | Poznámka |
|------|-----|----------|
| id | UUID | PK |
| external_id | string | ID z Odds API |
| sport | string | fotbal, hokej, mma |
| soutez | string | liga / turnaj |
| domaci_tym | string | |
| hoste_tym | string | |
| zacatek_at | timestamp | |
| stav | enum | `nadchazejici` \| `live` \| `ukonceny` |
| vysledek | string | volitelně po skončení |
| seo_preview | text | AI vygenerovaný úvod |
| updated_at | timestamp | |

### A6. Kurzy (k zápasu)
| Pole | Typ | Poznámka |
|------|-----|----------|
| id | UUID | PK |
| zapas_id | FK | |
| sazkovka_id | FK | |
| typ_sazky | string | 1X2, over/under, … |
| kurz_domaci | decimal | |
| kurz_remiza | decimal | null pokud ne 1X2 |
| kurz_hoste | decimal | |
| fetched_at | timestamp | kdy jsme stáhli z API |

*(Podle API může být struktura bohatší – více typů sázek.)*

### A7. Články (zpravodajství, blog)
| Pole | Typ | Poznámka |
|------|-----|----------|
| id | UUID | PK |
| typ | enum | `news` \| `blog` \| `pr_placeny` |
| titul | string | |
| slug | string | |
| perex | text | |
| telo | text | HTML nebo Markdown |
| zdroj_url | string | původní RSS/článek (null u blogu/PR) |
| zdroj_nazev | string | |
| affiliate_cta_kasino_id / sazkovka_id | FK | volitelně, kam CTA vede (pouze licencovaní) |
| je_placena_spoluprace | boolean | true = PR článek / placený – musí být označen |
| published_at | timestamp | |
| created_at | timestamp | |

### A8. Historie (výsledky, archiv)
| Pole | Typ | Poznámka |
|------|-----|----------|
| id | UUID | PK |
| zapas_id | FK | odkaz na zápas |
| vysledek_domaci, vysledek_hoste | int | skóre |
| kurzy_archiv | JSON | např. snapshot kurzů před zápasem (pro „jak to dopadlo“) |
| completed_at | timestamp | kdy zápas skončil |

*(Alternativa: rozšířit tabulku Zápasy o pole vysledek a archivovat kurzy v Kurzy.fetched_at + stav = ukonceny.)*

### A9. Poradna (FAQ, návody, pomoc)
| Pole | Typ | Poznámka |
|------|-----|----------|
| id | UUID | PK |
| slug | string | např. jak-zacit-sazet, blokace-rup |
| titul | string | |
| telo | text | |
| kategorie | string | faq, adiktologie, pomoc, blokace |
| razeni | int | pořadí zobrazení |
| updated_at | timestamp | |

*Poradna bez affiliate CTA uvnitř; může odkazovat na Safe Play, linku, RUP.*

### A10. Safe Play (statické stránky)
| Pole | Typ | Poznámka |
|------|-----|----------|
| id | UUID | PK |
| slug | string | blokace, rup, pomoc |
| titul | string | |
| telo | text | |
| updated_at | timestamp | |

---

## B. Externí zdroje (API, scraping)

| Zdroj | Účel | Frekvence | Náklady (orientačně) |
|-------|------|-----------|----------------------|
| **Odds API** (např. RapidAPI) | Zápasy + kurzy | každých 15 min | cca 500–1 500 Kč/měsíc |
| **Google Maps API** | Adresy, souřadnice, mapa | on demand | dle využití |
| **Apify** | Scraping poboček (zavřené/nové) | 1× měsíčně | dle plánu |
| **RSS** | Zpravodajství (sport, kasina) | každých X hodin | zdarma |
| **AI (OpenAI/ChatGPT)** | Preview zápasu, přepis článků | při novém zápase / článku | dle tokenů |

---

## C. Hlavní toky (kdo co volá)

1. **Cron / job: Odds API**
   - Stáhne zápasy + kurzy → uloží/aktualizuje tabulky Zápasy, Kurzy.
   - Volitelně spustí „AI preview“ pro nové zápasy.

2. **Cron: RSS + AI**
   - Stáhne novinky → přepíše/upraví (AI) → uloží do Články.
   - Každý článek má přiřazené CTA (kasino/sázkovka).

3. **Cron: Apify**
   - Seznam poboček → porovná s DB → deaktivace / nové záznamy u Fyzická místa.

4. **Frontend**
   - Čte z našeho API (Supabase nebo vlastní backend): místa, kasina, hry, zápasy, kurzy, články.
   - Každá stránka má vždy CTA s `affiliate_url` z příslušné entity.

---

## D. Affiliate pravidlo (kde se odkaz bere)

| Stránka / kontext | Odkaz bere z |
|-------------------|--------------|
| Pobočka Tipsportu | Sázková kanceláře.affiliate_url_registrace (Tipsport) |
| Zápas – kurz Fortuna | Sázkové kanceláře.affiliate_url_registrace (Fortuna) |
| Hra „Book of Dead“ | Seznam kasin, kde je hra → Online kasina.affiliate_url |
| Článek o automatu | Články.affiliate_cta_kasino_id → Online kasina.affiliate_url |
| Safe Play / Poradna | Žádný affiliate, jen linky na pomoc/RUP |
| Blog článek | Články.affiliate_cta_… → kasino/sázkovka (licencovaný) |
| PR článek (placený) | Označen `je_placena_spoluprace`; CTA dle smlouvy (jen licencovaní) |
| Topování brandu | Sázkovky / Kasina.placene_umisteni → zobrazení „Partnerský tip“ / zvýraznění |

---

## E. Výdělek webu (shrnutí v datech)

- **Affiliate:** Odkazy z tabulek Sázkové kanceláře, Online kasina (affiliate_url).
- **Placené topování:** Pole `placene_umisteni` + případně `poradi_zobrazeni`; zobrazení zvýrazněné („Partnerský tip“).
- **PR články:** Články s `typ = pr_placeny` nebo `je_placena_spoluprace = true`; v UI vždy označeno („Spolupráce“, „Placená spolupráce“).

---

## F. Právní stránky a compliance (cookies, GDPR, OP)

- **Cookie lišta:** První návštěva – text o cookies, odkaz na Ochranu soukromí, tlačítka Souhlas / Odmítnout. Preference uložit (např. `localStorage`: `cookie_consent: accepted | rejected`, datum). Podle preference spouštět/nespouštět analytiku a marketingové cookies.
- **Stránky (statické nebo z CMS):** Ochrana osobních údajů (GDPR), Obchodní podmínky, O nás / Jak nás podporujete. V OP a O nás **jasně:** web je pouze informační, u nás nelze sázet ani hrát, odkazujeme na licencované operátory; žádná herní licence.
- **18+:** Označení v patičce nebo hlavičce („Obsah pouze pro osoby 18+“).

*(Entity pro tyto stránky: může stačit statický obsah v kódu nebo jedna tabulka `legal_pages` se slug, titul, telo – dle implementace.)*

---

Až budeme začínat Fázi 1, začneme konkrétně tabulkami **Sázkové kanceláře**, **Online kasina**, **Hry** a volitelně **Fyzická místa** v Supabase; zbytek přidáme v dalších fázích.
