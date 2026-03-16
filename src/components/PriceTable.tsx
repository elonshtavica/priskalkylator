import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { BeraknadRad, PriceRow } from '../types';
import { formatSEK, formatProcent } from '../utils/format';

interface Props {
  rader: BeraknadRad[];
  onUppdatera: (rader: PriceRow[]) => void;
}

interface RedigerarRad {
  id: string;
  flm: string;
  inkopspris: string;
  prisTillKund: string;
}

export default function PriceTable({ rader, onUppdatera }: Props) {
  const [redigerar, setRedigerar] = useState<RedigerarRad | null>(null);
  const [laggTill, setLaggTill] = useState(false);
  const [nyRad, setNyRad] = useState<RedigerarRad>({ id: '', flm: '', inkopspris: '', prisTillKund: '' });

  function parseNum(s: string): number {
    return parseFloat(s.replace(',', '.')) || 0;
  }

  function sparaRedigering() {
    if (!redigerar) return;
    const uppdaterade = rader.map(r =>
      r.id === redigerar.id
        ? { id: r.id, flm: redigerar.flm, inkopspris: parseNum(redigerar.inkopspris), prisTillKund: parseNum(redigerar.prisTillKund) }
        : { id: r.id, flm: r.flm, inkopspris: r.inkopspris, prisTillKund: r.prisTillKund }
    );
    onUppdatera(uppdaterade);
    setRedigerar(null);
  }

  function taBort(id: string) {
    const uppdaterade = rader
      .filter(r => r.id !== id)
      .map(r => ({ id: r.id, flm: r.flm, inkopspris: r.inkopspris, prisTillKund: r.prisTillKund }));
    onUppdatera(uppdaterade);
  }

  function laggTillRad() {
    if (!nyRad.flm.trim()) return;
    const ny: PriceRow = {
      id: crypto.randomUUID(),
      flm: nyRad.flm.trim(),
      inkopspris: parseNum(nyRad.inkopspris),
      prisTillKund: parseNum(nyRad.prisTillKund),
    };
    onUppdatera([
      ...rader.map(r => ({ id: r.id, flm: r.flm, inkopspris: r.inkopspris, prisTillKund: r.prisTillKund })),
      ny,
    ]);
    setNyRad({ id: '', flm: '', inkopspris: '', prisTillKund: '' });
    setLaggTill(false);
  }

  function startaRedigering(rad: BeraknadRad) {
    setRedigerar({
      id: rad.id,
      flm: rad.flm,
      inkopspris: rad.inkopspris.toFixed(2),
      prisTillKund: rad.prisTillKund.toFixed(2),
    });
  }

  const inputKlass = 'w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider whitespace-nowrap">FLM</th>
              <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider whitespace-nowrap text-slate-300">Inköpspris</th>
              <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider whitespace-nowrap text-emerald-300">Pris till kund</th>
              <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider whitespace-nowrap text-yellow-300">Marginal (SEK)</th>
              <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider whitespace-nowrap text-yellow-300">Marginal (%)</th>
              <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider whitespace-nowrap text-sky-300">Exkl. bränsle</th>
              <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider whitespace-nowrap text-amber-300">Inkl. bränsle</th>
              <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider whitespace-nowrap text-amber-300">Bränsle (SEK)</th>
              <th className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Åtgärd</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rader.map((rad, index) => {
              const arFTL = rad.flm === 'FTL';
              const baseKlass = arFTL
                ? 'bg-rose-50 hover:bg-rose-100/60'
                : index % 2 === 0
                ? 'bg-white hover:bg-slate-50'
                : 'bg-slate-50/50 hover:bg-slate-100/60';

              if (redigerar?.id === rad.id) {
                return (
                  <tr key={rad.id} className="bg-blue-50">
                    <td className="px-3 py-2">
                      <input
                        className={inputKlass}
                        value={redigerar.flm}
                        onChange={e => setRedigerar({ ...redigerar, flm: e.target.value })}
                        placeholder="FLM / FTL"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        className={inputKlass + ' text-right'}
                        value={redigerar.inkopspris}
                        onChange={e => setRedigerar({ ...redigerar, inkopspris: e.target.value })}
                        placeholder="0,00"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        className={inputKlass + ' text-right'}
                        value={redigerar.prisTillKund}
                        onChange={e => setRedigerar({ ...redigerar, prisTillKund: e.target.value })}
                        placeholder="0,00"
                      />
                    </td>
                    <td colSpan={4} className="px-4 py-2 text-xs text-slate-400 italic">
                      Marginal och bränsletillägg beräknas automatiskt
                    </td>
                    <td className="px-3 py-2" />
                    <td className="px-3 py-2">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={sparaRedigering}
                          className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          title="Spara"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setRedigerar(null)}
                          className="p-1.5 bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors"
                          title="Avbryt"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={rad.id} className={`transition-colors ${baseKlass}`}>
                  <td className="px-4 py-3 font-bold text-slate-700">
                    {arFTL ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">FTL</span>
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">{rad.flm}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600 tabular-nums">{formatSEK(rad.inkopspris)}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700 tabular-nums">{formatSEK(rad.prisTillKund)}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">
                    <span className={`font-semibold ${rad.marginalSEK >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatSEK(rad.marginalSEK)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${rad.marginalProcent >= 15 ? 'bg-yellow-100 text-yellow-700' : rad.marginalProcent >= 5 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                      {formatProcent(rad.marginalProcent)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sky-700 tabular-nums">{formatSEK(rad.prisExklBransle)}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-amber-700 tabular-nums">{formatSEK(rad.prisInklBransle)}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-600 tabular-nums">{formatSEK(rad.bransletillaggSEK)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => startaRedigering(rad)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Redigera"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => taBort(rad.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Ta bort"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {laggTill && (
              <tr className="bg-emerald-50 border-t-2 border-emerald-200">
                <td className="px-3 py-2">
                  <input
                    className={inputKlass}
                    value={nyRad.flm}
                    onChange={e => setNyRad({ ...nyRad, flm: e.target.value })}
                    placeholder="t.ex. 13 eller FTL"
                    autoFocus
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className={inputKlass + ' text-right'}
                    value={nyRad.inkopspris}
                    onChange={e => setNyRad({ ...nyRad, inkopspris: e.target.value })}
                    placeholder="0,00"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className={inputKlass + ' text-right'}
                    value={nyRad.prisTillKund}
                    onChange={e => setNyRad({ ...nyRad, prisTillKund: e.target.value })}
                    placeholder="0,00"
                  />
                </td>
                <td colSpan={4} className="px-4 py-2 text-xs text-slate-400 italic">
                  Marginal och bränsletillägg beräknas automatiskt
                </td>
                <td className="px-3 py-2" />
                <td className="px-3 py-2">
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={laggTillRad}
                      className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      title="Lägg till"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => { setLaggTill(false); setNyRad({ id: '', flm: '', inkopspris: '', prisTillKund: '' }); }}
                      className="p-1.5 bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors"
                      title="Avbryt"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!laggTill && (
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setLaggTill(true)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <Plus size={16} />
            Lägg till rad
          </button>
        </div>
      )}
    </div>
  );
}
