import { useState } from 'react';
import { Calculator, Truck } from 'lucide-react';
import { BeraknadRad } from '../types';
import { formatSEK, formatProcent } from '../utils/format';

interface Props {
  rader: BeraknadRad[];
  bransletillagg: number;
}

function hittaMatchandeRad(rader: BeraknadRad[], flmVarde: number): BeraknadRad | null {
  const numRader = rader
    .filter(r => r.flm !== 'FTL' && !isNaN(parseFloat(r.flm)))
    .map(r => ({ rad: r, num: parseFloat(r.flm) }))
    .sort((a, b) => a.num - b.num);

  if (numRader.length === 0) return null;

  let match = numRader[0];
  for (const item of numRader) {
    if (item.num <= flmVarde) {
      match = item;
    } else {
      break;
    }
  }
  return match.rad;
}

export default function QuickCalculator({ rader, bransletillagg }: Props) {
  const [flmInput, setFlmInput] = useState<string>('1');
  const [ftlLage, setFtlLage] = useState(false);

  const ftlRad = rader.find(r => r.flm === 'FTL');
  const flmVarde = parseFloat(flmInput.replace(',', '.')) || 0;
  const matchadRad = hittaMatchandeRad(rader, flmVarde);

  const aktivRad = ftlLage ? ftlRad ?? null : matchadRad;
  const mult = ftlLage ? 1 : flmVarde > 0 ? flmVarde : 1;
  const visarMultipel = !ftlLage && flmVarde > 0 && matchadRad !== null;
  const anvandtFLM = matchadRad?.flm ?? '';

  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-5 shadow-lg mb-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={20} className="text-blue-300" />
        <h2 className="text-lg font-semibold">Snabbkalkylator</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-blue-200 mb-1">
            Antal FLM <span className="text-blue-300/70">(decimaler tillåtna, t.ex. 2,3)</span>
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={flmInput}
            onChange={e => { setFlmInput(e.target.value); setFtlLage(false); }}
            placeholder="t.ex. 2,3"
            disabled={ftlLage}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm font-semibold placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-40"
          />
        </div>
        <div className="flex items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-blue-200 mb-1">Helläst</label>
            <button
              onClick={() => setFtlLage(f => !f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                ftlLage
                  ? 'bg-rose-500 border-rose-400 text-white'
                  : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
              }`}
            >
              <Truck size={15} />
              FTL
            </button>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm">
            <span className="text-blue-200 text-xs block mb-0.5">Bränsletillägg</span>
            <span className="font-semibold">{bransletillagg} %</span>
          </div>
        </div>
      </div>

      {aktivRad ? (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 bg-white/10 rounded-lg px-3 py-2 text-xs text-blue-200">
            {ftlLage ? (
              <span>Visar pris för <span className="font-bold text-white">FTL (Helläst)</span></span>
            ) : (
              <>
                <span>
                  Beräknar <span className="font-bold text-white">{flmInput} FLM</span>
                  {' '}× styckpris för{' '}
                  <span className="font-bold text-white">{anvandtFLM} FLM</span>
                </span>
                {parseFloat(anvandtFLM) !== flmVarde && (
                  <span className="text-blue-300/80 italic">
                    (närmaste rad underifrån: {anvandtFLM} FLM)
                  </span>
                )}
              </>
            )}
            <span className="ml-auto text-blue-300">
              Styckpris inkl. bränsle: {formatSEK(aktivRad.prisInklBransle)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <ResultBox
              label="Inköpspris (exkl. bränsle)"
              value={formatSEK(aktivRad.inkopspris * mult)}
              color="text-blue-200"
              sub={visarMultipel && mult !== 1 ? formatSEK(aktivRad.inkopspris) + ' / FLM' : undefined}
            />
            <ResultBox
              label="Bränsle inköp (SEK)"
              value={formatSEK(aktivRad.inkopsprisBransletillaggSEK * mult)}
              color="text-sky-300"
              sub={visarMultipel && mult !== 1 ? formatSEK(aktivRad.inkopsprisBransletillaggSEK) + ' / FLM' : undefined}
            />
            <ResultBox
              label="Inköp inkl. bränsle"
              value={formatSEK(aktivRad.inkopsprisInklBransle * mult)}
              color="text-sky-200"
              sub={visarMultipel && mult !== 1 ? formatSEK(aktivRad.inkopsprisInklBransle) + ' / FLM' : undefined}
              highlight
            />
            <ResultBox
              label="Marginal (%)"
              value={formatProcent(aktivRad.marginalProcent)}
              color="text-yellow-300"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultBox
              label="Pris till kund (exkl. bränsle)"
              value={formatSEK(aktivRad.prisTillKund * mult)}
              color="text-emerald-300"
              sub={visarMultipel && mult !== 1 ? formatSEK(aktivRad.prisTillKund) + ' / FLM' : undefined}
            />
            <ResultBox
              label="Bränsle kund (SEK)"
              value={formatSEK(aktivRad.bransletillaggSEK * mult)}
              color="text-amber-300"
              sub={visarMultipel && mult !== 1 ? formatSEK(aktivRad.bransletillaggSEK) + ' / FLM' : undefined}
            />
            <ResultBox
              label="Pris inkl. bränsle"
              value={formatSEK(aktivRad.prisInklBransle * mult)}
              color="text-amber-200"
              sub={visarMultipel && mult !== 1 ? formatSEK(aktivRad.prisInklBransle) + ' / FLM' : undefined}
              highlight
            />
            <ResultBox
              label="Marginal (SEK)"
              value={formatSEK(aktivRad.marginalSEK * mult)}
              color="text-yellow-300"
              sub={visarMultipel && mult !== 1 ? formatSEK(aktivRad.marginalSEK) + ' / FLM' : undefined}
            />
          </div>
        </>
      ) : (
        <p className="text-blue-300 text-sm">Inga matchande rader hittades.</p>
      )}
    </div>
  );
}

function ResultBox({ label, value, color, sub, highlight }: { label: string; value: string; color: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? 'bg-white/20 ring-1 ring-white/30' : 'bg-white/10'}`}>
      <p className="text-xs text-blue-200 mb-1 leading-tight">{label}</p>
      <p className={`text-sm font-bold ${color} leading-tight`}>{value}</p>
      {sub && <p className="text-xs text-blue-300/70 mt-0.5 leading-tight">{sub}</p>}
    </div>
  );
}
