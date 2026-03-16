import { PriceList } from '../types';
import { defaultPrislistor } from '../data/defaultData';

const STORAGE_KEY = 'transport_prislistor';

export function laddaPrislistor(): PriceList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      sparaPrislistor(defaultPrislistor);
      return defaultPrislistor;
    }
    return JSON.parse(raw) as PriceList[];
  } catch {
    return defaultPrislistor;
  }
}

export function sparaPrislistor(listor: PriceList[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listor));
}
