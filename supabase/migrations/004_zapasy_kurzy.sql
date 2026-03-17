-- Blok 6: sportovní modul – zápasy a kurzy
-- Mapování API: sazkovky.external_id = identifikátor sázkovky v Odds API (např. bet365, tipsport)

-- External ID u sázkovky pro mapování z Odds API (např. "bet365", "pinnacle")
ALTER TABLE sazkovky ADD COLUMN IF NOT EXISTS external_id TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_sazkovky_external_id ON sazkovky(external_id);

-- Stav zápasu
CREATE TYPE stav_zapasu AS ENUM ('nadchazejici', 'live', 'ukonceny');

-- Zápasy
CREATE TABLE zapasy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT,
  sport TEXT NOT NULL,
  soutez TEXT,
  domaci_tym TEXT NOT NULL,
  hoste_tym TEXT NOT NULL,
  zacatek_at TIMESTAMPTZ NOT NULL,
  stav stav_zapasu NOT NULL DEFAULT 'nadchazejici',
  vysledek TEXT,
  seo_preview TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(external_id)
);

CREATE INDEX idx_zapasy_zacatek ON zapasy(zacatek_at);
CREATE INDEX idx_zapasy_stav ON zapasy(stav);
CREATE INDEX idx_zapasy_sport ON zapasy(sport);
CREATE INDEX idx_zapasy_external ON zapasy(external_id);

CREATE TRIGGER zapasy_updated_at
  BEFORE UPDATE ON zapasy FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Kurzy (k zápasu, po sázkovce)
CREATE TABLE kurzy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zapas_id UUID NOT NULL REFERENCES zapasy(id) ON DELETE CASCADE,
  sazkovka_id UUID NOT NULL REFERENCES sazkovky(id) ON DELETE CASCADE,
  typ_sazky TEXT NOT NULL DEFAULT '1X2',
  kurz_domaci NUMERIC(10,4),
  kurz_remiza NUMERIC(10,4),
  kurz_hoste NUMERIC(10,4),
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(zapas_id, sazkovka_id, typ_sazky)
);

CREATE INDEX idx_kurzy_zapas ON kurzy(zapas_id);
CREATE INDEX idx_kurzy_sazkovka ON kurzy(sazkovka_id);

-- RLS
ALTER TABLE zapasy ENABLE ROW LEVEL SECURITY;
ALTER TABLE kurzy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zapasy_read" ON zapasy FOR SELECT USING (true);
CREATE POLICY "kurzy_read" ON kurzy FOR SELECT USING (true);
