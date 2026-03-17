-- Blok 16.4: připomínky zápasů (e-mail později cron / Edge Function)

CREATE TABLE pripominky (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  zapas_id UUID NOT NULL REFERENCES zapasy(id) ON DELETE CASCADE,
  odeslat_v TIMESTAMPTZ NOT NULL,
  odeslano BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, zapas_id)
);

CREATE INDEX idx_pripominky_user ON pripominky(user_id);
CREATE INDEX idx_pripominky_odeslat_v ON pripominky(odeslat_v) WHERE odeslano = false;

ALTER TABLE pripominky ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pripominky_select_own" ON pripominky
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "pripominky_insert_own" ON pripominky
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pripominky_delete_own" ON pripominky
  FOR DELETE USING (auth.uid() = user_id);
