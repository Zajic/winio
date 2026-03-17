-- Blok 14: external_id u mista pro Apify (jednoznačná shoda při aktualizaci)

ALTER TABLE mista ADD COLUMN IF NOT EXISTS external_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mista_sazkovka_external
  ON mista(sazkovka_id, external_id)
  WHERE external_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_mista_external_id ON mista(external_id);
