-- Blok 11: Články (blog, novinky, PR)
-- typ: news = z RSS/vnější zdroj, blog = vlastní, pr_placeny = placená spolupráce

CREATE TYPE typ_clanku AS ENUM ('news', 'blog', 'pr_placeny');

CREATE TABLE clanky (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  typ typ_clanku NOT NULL DEFAULT 'blog',
  titul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  perex TEXT,
  telo TEXT,
  zdroj_url TEXT,
  zdroj_nazev TEXT,
  affiliate_cta_kasino_id UUID REFERENCES kasina(id) ON DELETE SET NULL,
  affiliate_cta_sazkovka_id UUID REFERENCES sazkovky(id) ON DELETE SET NULL,
  je_placena_spoluprace BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clanky_slug ON clanky(slug);
CREATE INDEX idx_clanky_typ ON clanky(typ);
CREATE INDEX idx_clanky_published_at ON clanky(published_at DESC);

CREATE TRIGGER clanky_updated_at
  BEFORE UPDATE ON clanky FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: veřejné čtení jen publikovaných
ALTER TABLE clanky ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clanky_read_published" ON clanky
  FOR SELECT USING (published_at IS NOT NULL AND published_at <= now());
