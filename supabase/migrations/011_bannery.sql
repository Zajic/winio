-- Admin: Bannery (reklama, vlastní). Obrázky v Storage bucket "bannery".

CREATE TYPE typ_banneru AS ENUM ('reklama', 'vlastni');

CREATE TYPE pozice_banneru AS ENUM (
  'homepage_top',
  'homepage_sidebar',
  'clanek_bottom',
  'sidebar_global'
);

CREATE TABLE bannery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nazev TEXT NOT NULL,
  typ typ_banneru NOT NULL DEFAULT 'vlastni',
  obrazek_url TEXT NOT NULL,
  odkaz_url TEXT,
  pozice pozice_banneru NOT NULL DEFAULT 'sidebar_global',
  aktivni BOOLEAN NOT NULL DEFAULT true,
  poradi INT NOT NULL DEFAULT 0,
  platnost_od TIMESTAMPTZ,
  platnost_do TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bannery_pozice ON bannery(pozice);
CREATE INDEX idx_bannery_aktivni ON bannery(aktivni);

CREATE TRIGGER bannery_updated_at
  BEFORE UPDATE ON bannery FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: veřejné čtení jen aktivních v platnosti
ALTER TABLE bannery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bannery_read_public" ON bannery
  FOR SELECT USING (
    aktivni = true
    AND (platnost_od IS NULL OR platnost_od <= now())
    AND (platnost_do IS NULL OR platnost_do > now())
  );

-- Zápis jen přes service_role (admin používá server s service key)
-- Žádná INSERT/UPDATE policy pro anon/authenticated = jen service_role může psát.

-- Storage bucket pro obrázky bannerů (veřejné čtení). Upload z adminu přes service_role.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bannery',
  'bannery',
  true,
  2097152,
  '{"image/jpeg","image/png","image/gif","image/webp"}'
)
ON CONFLICT (id) DO NOTHING;
