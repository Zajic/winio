-- Blok 15: Poradna (FAQ, adiktologie, pomoc)

CREATE TYPE poradna_kategorie AS ENUM ('faq', 'adiktologie', 'pomoc');

CREATE TABLE poradna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  titul TEXT NOT NULL,
  telo TEXT,
  kategorie poradna_kategorie NOT NULL DEFAULT 'faq',
  razeni INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_poradna_slug ON poradna(slug);
CREATE INDEX idx_poradna_kategorie ON poradna(kategorie);
CREATE INDEX idx_poradna_razeni ON poradna(razeni);

CREATE TRIGGER poradna_updated_at
  BEFORE UPDATE ON poradna FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE poradna ENABLE ROW LEVEL SECURITY;
CREATE POLICY "poradna_read" ON poradna FOR SELECT USING (true);
