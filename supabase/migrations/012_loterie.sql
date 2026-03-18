-- Loterie: provozovatelé (Allwyn + menší), produkty/hry, tahy/výsledky

CREATE TABLE loterie_operatori (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nazev TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  popis TEXT,
  licence TEXT,
  logo_url TEXT,
  web_url TEXT,
  aktivni BOOLEAN NOT NULL DEFAULT true,
  poradi INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE loterie_produkty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES loterie_operatori(id) ON DELETE CASCADE,
  nazev TEXT NOT NULL,
  slug TEXT NOT NULL,
  popis TEXT,
  typ TEXT NOT NULL DEFAULT 'cislovana' CHECK (typ IN ('cislovana', 'stiraci', 'jine')),
  oficialni_vysledky_url TEXT,
  aktivni BOOLEAN NOT NULL DEFAULT true,
  poradi INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (operator_id, slug)
);

CREATE TABLE loterie_tahy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produkt_id UUID NOT NULL REFERENCES loterie_produkty(id) ON DELETE CASCADE,
  datum_losovani TIMESTAMPTZ NOT NULL,
  vysledek_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_loterie_produkty_operator ON loterie_produkty(operator_id);
CREATE INDEX idx_loterie_tahy_produkt_datum ON loterie_tahy(produkt_id, datum_losovani DESC);

ALTER TABLE loterie_operatori ENABLE ROW LEVEL SECURITY;
ALTER TABLE loterie_produkty ENABLE ROW LEVEL SECURITY;
ALTER TABLE loterie_tahy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loterie_operatori_select" ON loterie_operatori FOR SELECT USING (true);
CREATE POLICY "loterie_produkty_select" ON loterie_produkty FOR SELECT USING (true);
CREATE POLICY "loterie_tahy_select" ON loterie_tahy FOR SELECT USING (true);

CREATE TRIGGER loterie_operatori_updated_at BEFORE UPDATE ON loterie_operatori
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER loterie_produkty_updated_at BEFORE UPDATE ON loterie_produkty
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Seed: Allwyn (dříve Sazka) + dva menší provozovatelé (názvy lze upravit v DB/adminu)
INSERT INTO loterie_operatori (nazev, slug, popis, licence, web_url, poradi) VALUES
(
  'Allwyn',
  'allwyn',
  'Hlavní licencovaný provozovatel číselných loterií v ČR. Provozuje portfolio her dříve známé pod značkou Sazka (např. Sportka, Eurojackpot, Šťastných 10, Šance). Oficiální informace a výsledky najdete na webu provozovatele.',
  'Licence Ministerstva financí ČR',
  'https://www.allwyn.cz',
  0
),
(
  'Menší provozovatel (doplňte název)',
  'loterie-mensi-1',
  'Druhý licencovaný subjekt na trhu loterií v ČR – doplňte oficiální název, popis a odkaz v administraci nebo v Supabase.',
  'Licence Ministerstva financí ČR',
  NULL,
  1
),
(
  'Menší provozovatel 2 (volitelně)',
  'loterie-mensi-2',
  'Třetí provozovatel – pokud na webu nechcete zobrazovat, nastavte aktivni = false.',
  'Licence Ministerstva financí ČR',
  NULL,
  2
);

-- Produkty u Allwyn (odkazy na výsledky ověřte na oficiálním webu)
INSERT INTO loterie_produkty (operator_id, nazev, slug, popis, typ, oficialni_vysledky_url, poradi)
SELECT id, 'Sportka', 'sportka', 'Klasická číselná loterie.', 'cislovana', 'https://www.allwyn.cz', 0 FROM loterie_operatori WHERE slug = 'allwyn';
INSERT INTO loterie_produkty (operator_id, nazev, slug, popis, typ, oficialni_vysledky_url, poradi)
SELECT id, 'Eurojackpot', 'eurojackpot', 'Evropská číselná loterie.', 'cislovana', 'https://www.allwyn.cz', 1 FROM loterie_operatori WHERE slug = 'allwyn';
INSERT INTO loterie_produkty (operator_id, nazev, slug, popis, typ, oficialni_vysledky_url, poradi)
SELECT id, 'Šťastných 10', 'stastnych-10', 'Číselná loterie.', 'cislovana', 'https://www.allwyn.cz', 2 FROM loterie_operatori WHERE slug = 'allwyn';
