-- Winio Blok 2.6: první data (2–3 sázkovky, 2–3 kasina)
-- Spustit až po 001_initial_schema.sql
-- Affiliate URL doplňte podle svých affiliate účtů (nebo nechte prázdné a doplníte v Supabase Dashboard)

INSERT INTO sazkovky (nazev, slug, affiliate_url_registrace, affiliate_param, popis, licence, poradi_zobrazeni)
VALUES
  ('Tipsport', 'tipsport', NULL, NULL, 'Licencovaná sázková kancelář v ČR.', 'CZ', 1),
  ('Fortuna', 'fortuna', NULL, NULL, 'Licencovaná sázková kancelář v ČR.', 'CZ', 2),
  ('Chance', 'chance', NULL, NULL, 'Licencovaná sázková kancelář v ČR.', 'CZ', 3);

INSERT INTO kasina (nazev, slug, affiliate_url, popis, licence)
VALUES
  ('Kasino A', 'kasino-a', NULL, 'Příklad online kasino s licencí. Affiliate URL doplňte.', 'MGA'),
  ('Kasino B', 'kasino-b', NULL, 'Druhé příkladové kasino. Affiliate URL doplňte.', 'CZ');

-- Volitelně: jedna hra a propojení na kasino (pro test M:N)
-- INSERT INTO hry (nazev, slug, typ, popis) VALUES ('Book of Dead', 'book-of-dead', 'automat', 'Populární slot.');
-- INSERT INTO hry_kasina (hra_id, kasino_id) SELECT h.id, k.id FROM hry h, kasina k WHERE h.slug = 'book-of-dead' AND k.slug = 'kasino-a' LIMIT 1;
