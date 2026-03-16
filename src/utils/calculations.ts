import { PriceRow, BeraknadRad } from '../types';

export function beraknaRad(rad: PriceRow, bransletillagg: number): BeraknadRad {
  const marginalSEK = rad.prisTillKund - rad.inkopspris;
  const marginalProcent = rad.prisTillKund > 0
    ? ((rad.prisTillKund - rad.inkopspris) / rad.prisTillKund) * 100
    : 0;
  const prisInklBransle = rad.prisTillKund * (1 + bransletillagg / 100);
  const bransletillaggSEK = prisInklBransle - rad.prisTillKund;
  const inkopsprisInklBransle = rad.inkopspris * (1 + bransletillagg / 100);
  const inkopsprisBransletillaggSEK = inkopsprisInklBransle - rad.inkopspris;

  return {
    ...rad,
    marginalSEK,
    marginalProcent,
    prisExklBransle: rad.prisTillKund,
    prisInklBransle,
    bransletillaggSEK,
    inkopsprisInklBransle,
    inkopsprisBransletillaggSEK,
  };
}

export function beraknaAllaRader(rader: PriceRow[], bransletillagg: number): BeraknadRad[] {
  return rader.map(rad => beraknaRad(rad, bransletillagg));
}
