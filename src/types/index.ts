export interface PriceRow {
  id: string;
  flm: string;
  inkopspris: number;
  prisTillKund: number;
}

export interface PriceList {
  id: string;
  namn: string;
  manad: string;
  bransletillagg: number;
  rader: PriceRow[];
  skapadDatum: string;
}

export interface BeraknadRad extends PriceRow {
  marginalSEK: number;
  marginalProcent: number;
  prisExklBransle: number;
  prisInklBransle: number;
  bransletillaggSEK: number;
  inkopsprisInklBransle: number;
  inkopsprisBransletillaggSEK: number;
}
