export type Sazkovka = {
  id: string;
  nazev: string;
  slug: string;
  affiliate_url_registrace: string | null;
  affiliate_param: string | null;
  popis: string | null;
  logo_url: string | null;
  licence: string | null;
  aktivni: boolean;
  poradi_zobrazeni: number;
  placene_umisteni: boolean;
  bonus_uvodni: string | null;
  bonus_popis: string | null;
  freebet: string | null;
  external_id: string | null;
  created_at: string;
  updated_at: string;
};

export type TypHry = "automat" | "ruleta" | "stolni_hra";

export type Hra = {
  id: string;
  nazev: string;
  slug: string;
  typ: TypHry;
  popis: string | null;
  obrazek_url: string | null;
  created_at: string;
  updated_at: string;
};

export type StavZapasu = "nadchazejici" | "live" | "ukonceny";

export type Zapas = {
  id: string;
  external_id: string | null;
  sport: string;
  soutez: string | null;
  domaci_tym: string;
  hoste_tym: string;
  zacatek_at: string;
  stav: StavZapasu;
  vysledek: string | null;
  seo_preview: string | null;
  created_at: string;
  updated_at: string;
};

export type Kurz = {
  id: string;
  zapas_id: string;
  sazkovka_id: string;
  typ_sazky: string;
  kurz_domaci: number | null;
  kurz_remiza: number | null;
  kurz_hoste: number | null;
  fetched_at: string;
};

export type Kasino = {
  id: string;
  nazev: string;
  slug: string;
  affiliate_url: string | null;
  popis: string | null;
  licence: string | null;
  aktivni: boolean;
  placene_umisteni: boolean;
  created_at: string;
  updated_at: string;
};

export type TypClanku = "news" | "blog" | "pr_placeny";

export type Clanky = {
  id: string;
  typ: TypClanku;
  titul: string;
  slug: string;
  perex: string | null;
  telo: string | null;
  zdroj_url: string | null;
  zdroj_nazev: string | null;
  affiliate_cta_kasino_id: string | null;
  affiliate_cta_sazkovka_id: string | null;
  je_placena_spoluprace: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TypMista = "pobocka_sazkovky" | "kasino";

export type Misto = {
  id: string;
  typ: TypMista;
  nazev: string;
  adresa: string | null;
  lat: number | null;
  lng: number | null;
  sazkovka_id: string | null;
  kasino_id: string | null;
  external_id: string | null;
  oteviraci_doba: unknown;
  zdroj: string | null;
  aktivni: boolean;
  created_at: string;
  updated_at: string;
};

export type PoradnaKategorie = "faq" | "adiktologie" | "pomoc";

export type Poradna = {
  id: string;
  slug: string;
  titul: string;
  telo: string | null;
  kategorie: PoradnaKategorie;
  razeni: number;
  created_at: string;
  updated_at: string;
};

export type UserPreferences = {
  user_id: string;
  oblíbene_tymy: string[];
  oblíbene_ligy: string[];
  souhlas_newsletter: boolean;
  souhlas_pripominky: boolean;
  sazkovky_ids: string[];
  created_at: string;
  updated_at: string;
};

export type Pripominka = {
  id: string;
  user_id: string;
  zapas_id: string;
  odeslat_v: string;
  odeslano: boolean;
  created_at: string;
};

export type TypBanneru = "reklama" | "vlastni";

export type PoziceBanneru = "homepage_top" | "homepage_sidebar" | "clanek_bottom" | "sidebar_global";

export type Banner = {
  id: string;
  nazev: string;
  typ: TypBanneru;
  obrazek_url: string;
  odkaz_url: string | null;
  pozice: PoziceBanneru;
  aktivni: boolean;
  poradi: number;
  platnost_od: string | null;
  platnost_do: string | null;
  created_at: string;
  updated_at: string;
};

export type TypLoterieProduktu = "cislovana" | "stiraci" | "jine";

export type LoterieOperator = {
  id: string;
  nazev: string;
  slug: string;
  popis: string | null;
  licence: string | null;
  logo_url: string | null;
  web_url: string | null;
  aktivni: boolean;
  poradi: number;
  created_at: string;
  updated_at: string;
};

export type LoterieProdukt = {
  id: string;
  operator_id: string;
  nazev: string;
  slug: string;
  popis: string | null;
  typ: TypLoterieProduktu;
  oficialni_vysledky_url: string | null;
  aktivni: boolean;
  poradi: number;
  created_at: string;
  updated_at: string;
};

export type LoterieTah = {
  id: string;
  produkt_id: string;
  datum_losovani: string;
  vysledek_text: string;
  created_at: string;
};
