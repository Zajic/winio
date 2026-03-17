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
