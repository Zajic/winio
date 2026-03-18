# Loterie po migraci – návod pro začátečníka (krok za krokem)

Tento návod předpokládá, že už máš **hotovou migraci** a běží ti web (např. `npm run dev`) a znáš přihlášení do **Supabase**.

---

## Část A: Přihlášení do Supabase

1. Otevři v prohlížeči **[supabase.com](https://supabase.com)** a přihlas se.
2. Klikni na **svůj projekt** (ten, který používá Winio).
3. V **levém menu** najdi **Table Editor** (ikona tabulky).
4. Teď vidíš seznam tabulek v databázi.

---

## Část B: Upravit menší provozovatele loterií

5. V Table Editoru klikni na tabulku **`loterie_operatori`**.
6. Uvidíš řádky – mezi nimi je **Allwyn** a dva řádky s textem jako „Menší provozovatel…“.
7. U řádku, který chceš upravit, klikni na **tužku / Edit** (nebo dvojklik na buňku – podle rozhraní Supabase).
8. Vyplň nebo změň:
   - **`nazev`** – oficiální název firmy, jak má být na webu (např. reálný název provozovatele).
   - **`slug`** – **jen malá písmena, čísla a pomlčky**, bez mezer.  
     Toto je část adresy: `https://tvuj-web.cz/loterie/VÁŠ-SLUG`  
     **Důležité:** Když slug změníš, starý odkaz přestane fungovat – zapiš si novou adresu.
   - **`popis`** – krátký text pro návštěvníky (co provozovatel dělá).
   - **`web_url`** – celá adresa webu, např. `https://www.example.cz` (včetně `https://`).
   - **`licence`** – můžeš nechat „Licence Ministerstva financí ČR“ nebo upřesnit.
   - **`aktivni`** – pokud provozovatele **nechceš na webu zobrazit**, nastav na **`false`** (v editoru často přepínač / checkbox).
9. Ulož změny (**Save** / **Update row**).

10. **Druhý menší provozovatel:** stejný postup. Pokud ho **vůbec nechceš**, u něj nastav **`aktivni` = false** – na `/loterie` se neukáže.

---

## Část C: Odkazy na výsledky u her (Allwyn / Sportka atd.)

11. V Table Editoru otevři tabulku **`loterie_produkty`**.
12. Každý řádek je jedna hra (Sportka, Eurojackpot…). Sloupec **`operator_id`** říká, ke komu hra patří – u Allwynu jsou tam tři řádky.
13. U každé hry uprav **`oficialni_vysledky_url`**:
    - Otevři v jiném okně **oficiální stránku výsledků** té hry.
    - Zkopíruj adresu z řádku prohlížeče (celou URL).
    - Vlož ji do **`oficialni_vysledky_url`** a ulož.
14. Na webu se u té hry zobrazí odkaz „Oficiální výsledky“.

---

## Část D: Zapsat poslední losování (tahy) – volitelné

Bez řádků v **`loterie_tahy`** web napíše, že zatím nejsou tahy – to je v pořádku. Chceš-li ukázku:

15. V Table Editoru otevři **`loterie_produkty`** a **zkopíruj si `id`** u hry, např. Sportka (dlouhý text s pomlčkami – UUID).
16. Otevři tabulku **`loterie_tahy`**.
17. Klikni **Insert row** / **+ New row**.
18. Vyplň:
    - **`produkt_id`** – vlož zkopírované **id** produktu (Sportka).
    - **`datum_losovani`** – datum a čas losování (Supabase obvykle nabídne výběr data/času).
    - **`vysledek_text`** – text, který uvidí návštěvník, např.  
      `7, 14, 23, 31, 35, 48 | dodatkové 3`  
      (formát je na tobě – je to jen zobrazený text.)
19. Ulož. Na stránce `/loterie/allwyn` u Sportky uvidíš tento tah v sekci „Poslední tahy na Winio“.
20. Stejně můžeš přidat další řádky (starší tahy) – zobrazí se jich až **5 nejnovějších** na produkt.

---

## Část E: Ověření na webu

21. Spusť web lokálně (`npm run dev`) nebo otevři produkční adresu.
22. Jdi na **`/loterie`** – měl bys vidět Allwyn a aktivní menší provozovatele.
23. Klikni na **Allwyn** → adresa bude jako **`/loterie/allwyn`**.
24. Zkontroluj popisy, odkazy na web provozovatele a na výsledky u her.

---

## Časté problémy

| Problém | Co zkusit |
|--------|-----------|
| Tabulky `loterie_*` nevidím | Zkontroluj, že jsi v **správném projektu** Supabase a migrace proběhla v tomto projektu. |
| Po změně `slug` stránka 404 | Použij novou adresu `/loterie/novy-slug`. |
| Chyba při ukládání řádku | U `loterie_tahy` musí **`produkt_id`** přesně odpovídat existujícímu řádku v `loterie_produkty`. |
| Menší provozovatel se nezobrazuje | Zkontroluj **`aktivni` = true**. |

---

## Co až potom (není nutné hned)

- **Admin rozhraní** na webu pro úpravu loterií bez Supabase – lze dodělat později.
- **Automatické stahování výsledků** – složitější, vyžaduje zdroj dat a často vývoj.

---

*Soubor: `docs/LOTERIE-NAVOD-KROK-ZA-KROKEM.md`*
