const sek = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const procent = new Intl.NumberFormat('sv-SE', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

const antal = new Intl.NumberFormat('sv-SE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatSEK(value: number): string {
  return sek.format(value);
}

export function formatProcent(value: number): string {
  return procent.format(value) + ' %';
}

export function formatAntal(value: number): string {
  return antal.format(value);
}
