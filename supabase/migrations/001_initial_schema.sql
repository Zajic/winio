-- Winio Blok 2: základní schéma (sazkovky, kasina, hry, mista)
-- Spustit v Supabase Dashboard → SQL Editor (nebo přes Supabase CLI)

-- ========== SAZKOVKY (sázkové kanceláře) ==========
CREATE TABLE sazkovky (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nazev TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  affiliate_url_registrace TEXT,
  affiliate_param TEXT,
  popis TEXT,
  logo_url TEXT,
  licence TEXT,
  aktivni BOOLEAN NOT NULL DEFAULT true,
  poradi_zobrazeni INT NOT NULL DEFAULT 0,
  placene_umisteni BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sazkovky_slug ON sazkovky(slug);
CREATE INDEX idx_sazkovky_aktivni ON sazkovky(aktivni);

-- ========== KASINA (online kasina) ==========
CREATE TABLE kasina (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nazev TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  affiliate_url TEXT,
  popis TEXT,
  licence TEXT,
  aktivni BOOLEAN NOT NULL DEFAULT true,
  placene_umisteni BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_kasina_slug ON kasina(slug);
CREATE INDEX idx_kasina_aktivni ON kasina(aktivni);

-- ========== HRY (automaty, rulety) ==========
CREATE TYPE typ_hry AS ENUM ('automat', 'ruleta', 'stolni_hra');

CREATE TABLE hry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nazev TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  typ typ_hry NOT NULL,
  popis TEXT,
  obrazek_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hry_slug ON hry(slug);
CREATE INDEX idx_hry_typ ON hry(typ);

-- M:N hry ↔ kasina (kde si zahrát)
CREATE TABLE hry_kasina (
  hra_id UUID NOT NULL REFERENCES hry(id) ON DELETE CASCADE,
  kasino_id UUID NOT NULL REFERENCES kasina(id) ON DELETE CASCADE,
  PRIMARY KEY (hra_id, kasino_id)
);

CREATE INDEX idx_hry_kasina_kasino ON hry_kasina(kasino_id);

-- ========== MISTA (fyzická místa – pobočky, kasina) ==========
CREATE TYPE typ_mista AS ENUM ('pobocka_sazkovky', 'kasino');

CREATE TABLE mista (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  typ typ_mista NOT NULL,
  nazev TEXT NOT NULL,
  adresa TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  sazkovka_id UUID REFERENCES sazkovky(id) ON DELETE SET NULL,
  kasino_id UUID REFERENCES kasina(id) ON DELETE SET NULL,
  oteviraci_doba JSONB,
  zdroj TEXT,
  aktivni BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT mista_sazkovka_nebo_kasino CHECK (
    (typ = 'pobocka_sazkovky' AND sazkovka_id IS NOT NULL AND kasino_id IS NULL) OR
    (typ = 'kasino' AND kasino_id IS NOT NULL AND sazkovka_id IS NULL)
  )
);

CREATE INDEX idx_mista_typ ON mista(typ);
CREATE INDEX idx_mista_aktivni ON mista(aktivni);
CREATE INDEX idx_mista_sazkovka ON mista(sazkovka_id);
CREATE INDEX idx_mista_kasino ON mista(kasino_id);

-- Trigger: updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sazkovky_updated_at
  BEFORE UPDATE ON sazkovky FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER kasina_updated_at
  BEFORE UPDATE ON kasina FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER hry_updated_at
  BEFORE UPDATE ON hry FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER mista_updated_at
  BEFORE UPDATE ON mista FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ========== RLS (Blok 2.5): veřejné čtení, zápis jen služební účet ==========
ALTER TABLE sazkovky ENABLE ROW LEVEL SECURITY;
ALTER TABLE kasina ENABLE ROW LEVEL SECURITY;
ALTER TABLE hry ENABLE ROW LEVEL SECURITY;
ALTER TABLE hry_kasina ENABLE ROW LEVEL SECURITY;
ALTER TABLE mista ENABLE ROW LEVEL SECURITY;

-- Čtení pro všechny (anon i authenticated)
CREATE POLICY "sazkovky_read" ON sazkovky FOR SELECT USING (true);
CREATE POLICY "kasina_read" ON kasina FOR SELECT USING (true);
CREATE POLICY "hry_read" ON hry FOR SELECT USING (true);
CREATE POLICY "hry_kasina_read" ON hry_kasina FOR SELECT USING (true);
CREATE POLICY "mista_read" ON mista FOR SELECT USING (true);

-- Zápis pouze pro service_role (dashboard / API s service key později)
-- Pro anon není INSERT/UPDATE/DELETE – tedy žádná další policy = pouze čtení pro veřejnost
