# Text cookie lišty (zobrazení při první návštěvě)

Použije se v komponentě cookie lišty (Blok 3). Krátký text + odkaz na Zásady ochrany osobních údajů + tlačítka Souhlas / Odmítnout.

---

## Návrh textu (krátký)

**Varianta A (stručná):**  
„Používáme cookies pro fungování webu a s vaším souhlasem pro analýzu návštěvnosti. Odkaz na detaily a možnost volby najdete v Zásadách ochrany osobních údajů. [Souhlasím] [Odmítnout]“

**Varianta B (srozumitelná):**  
„Tento web používá cookies – malé soubory v prohlížeči. Některé jsou nutné pro funkci webu, jiné (např. pro statistiky) pouze s vaším souhlasem. Více informací a možnost nastavení: [Ochrana osobních údajů]. [Přijmout vše] [Pouze nutné]“

---

## Technické požadavky (pro Blok 3)

- **Odkaz:** vždy vést na stránku `/ochrana-osobnich-udaju` (nebo odpovídající slug).
- **Tlačítka:** minimálně „Souhlas“ (přijmout volitelné cookies) a „Odmítnout“ (pouze nutné). Volitelně „Pouze nutné“ = stejné jako Odmítnout.
- **Uložení volby:** např. `localStorage`: klíč `cookie_consent`, hodnota `accepted` | `rejected`, příp. datum. Podle hodnoty na frontu ne/načítat analytiku (GA, Plausible apod.).
- **Zobrazení:** pouze při první návštěvě (pokud v localStorage ještě není záznam), nebo po vypršení doby platnosti souhlasu, pokud ji budete evidovat.

---

## Odkaz v liště

- Text odkazu: „Ochrana osobních údajů“ nebo „Více o cookies a soukromí“.
- URL: relativní `/ochrana-osobnich-udaju` (nebo jak bude stránka pojmenována).

---

*Tento soubor slouží jako zdroj textu a požadavků pro implementaci cookie lišty v Bloku 3.*
