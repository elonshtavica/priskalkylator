import { PriceList } from '../types';

export const defaultPrislistor: PriceList[] = [
  {
    id: 'default-1',
    namn: 'Prislista utan bränsletillägg',
    manad: '',
    bransletillagg: 0,
    skapadDatum: new Date().toISOString(),
    rader: [
      { id: 'r1',  flm: '1',   inkopspris: 5142.425, prisTillKund: 5943.10 },
      { id: 'r2',  flm: '2',   inkopspris: 3572.125, prisTillKund: 4128.24 },
      { id: 'r3',  flm: '3',   inkopspris: 3251.3,   prisTillKund: 3757.44 },
      { id: 'r4',  flm: '4',   inkopspris: 2844.375, prisTillKund: 3286.73 },
      { id: 'r5',  flm: '5',   inkopspris: 2485.625, prisTillKund: 2814.99 },
      { id: 'r6',  flm: '6',   inkopspris: 2287.8,   prisTillKund: 2591.48 },
      { id: 'r7',  flm: '7',   inkopspris: 2219.125, prisTillKund: 2513.20 },
      { id: 'r8',  flm: '8',   inkopspris: 2010.025, prisTillKund: 2276.30 },
      { id: 'r9',  flm: '9',   inkopspris: 1931.1,   prisTillKund: 2187.72 },
      { id: 'r10', flm: '10',  inkopspris: 1851.15,  prisTillKund: 2096.05 },
      { id: 'r11', flm: '11',  inkopspris: 1799.9,   prisTillKund: 2038.37 },
      { id: 'r12', flm: '12',  inkopspris: 1755.825, prisTillKund: 1988.93 },
      { id: 'r13', flm: 'FTL', inkopspris: 22293.75, prisTillKund: 25247.36 },
    ],
  },
];
