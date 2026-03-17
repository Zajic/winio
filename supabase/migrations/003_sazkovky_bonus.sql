-- Blok 5.3: sloupce pro srovnání bonusů u sázkových kanceláří
ALTER TABLE sazkovky
  ADD COLUMN IF NOT EXISTS bonus_uvodni TEXT,
  ADD COLUMN IF NOT EXISTS bonus_popis TEXT,
  ADD COLUMN IF NOT EXISTS freebet TEXT;

COMMENT ON COLUMN sazkovky.bonus_uvodni IS 'Např. „100 % do 3000 Kč“';
COMMENT ON COLUMN sazkovky.bonus_popis IS 'Krátký popis bonusu / podmínky';
COMMENT ON COLUMN sazkovky.freebet IS 'Např. „Freebet 500 Kč“';
