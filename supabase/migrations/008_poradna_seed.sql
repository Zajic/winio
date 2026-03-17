-- Blok 15.4: první záznamy do poradna (lze spustit po 007_poradna.sql)

INSERT INTO poradna (slug, titul, telo, kategorie, razeni) VALUES
('jak-zacit-sazet', 'Jak začít sázet?', '<p>Licencované sázkové kanceláře vyžadují registraci a ověření totožnosti (18+). Po registraci si můžete vložit vklad a vsadit na sportovní zápasy nebo jiné události. Vždy si předem nastavte limit a nevsázejte víc, než si můžete dovolit ztratit.</p>', 'faq', 10),
('co-je-rup', 'Co je RUP?', '<p>Registr účelově vyloučených osob (RUP) je veřejný seznam osob, které se dobrovolně vyloučily z hazardních her. Operátoři s českou licencí jsou povinni kontrolovat RUP před umožněním hry. Více na stránkách Ministerstva financí.</p>', 'faq', 20),
('kde-hledat-pomoc', 'Kde hledat pomoc při závislosti na hazardu?', '<p>Můžete kontaktovat linku první pomoci (116 111), Národní linku pro odvykání (800 350 000) nebo adiktologickou ambulanci ve vašem regionu. Safe Play sekce na tomto webu obsahuje další kontakty.</p>', 'pomoc', 10),
('blokace-uctu', 'Jak zablokovat účet u sázkovky nebo kasina?', '<p>V nastavení účtu na webu operátora obvykle najdete možnost dočasné nebo trvalé blokace. Alternativně napište zákaznické podpoře s žádostí o vyloučení. Trvalá blokace zabrání opětovnému přístupu.</p>', 'faq', 30)
ON CONFLICT (slug) DO NOTHING;
