import { BarChart3, Fuel, TrendingUp, TrendingDown, Truck } from 'lucide-react';
import { BeraknadRad } from '../types';
import { formatSEK, formatProcent } from '../utils/format';

interface Props {
  rader: BeraknadRad[];
  bransletillagg: number;
}

export default function SummaryCards({ rader, bransletillagg }: Props) {
  const ickeFullasRader = rader.filter(r => r.flm !== 'FTL');
  const ftlRad = rader.find(r => r.flm === 'FTL');
  const maxPris = ickeFullasRader.length > 0 ? Math.max(...ickeFullasRader.map(r => r.prisTillKund)) : 0;
  const minPris = ickeFullasRader.length > 0 ? Math.min(...ickeFullasRader.map(r => r.prisTillKund)) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <BarChart3 size={16} className="text-blue-600" />
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Antal rader</span>
        </div>
        <p className="text-2xl font-bold text-slate-800">{rader.length}</p>
        <p className="text-xs text-slate-400 mt-1">{ickeFullasRader.length} FLM + {ftlRad ? '1 FTL' : '0 FTL'}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <Fuel size={16} className="text-amber-600" />
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Bränsletillägg</span>
        </div>
        <p className="text-2xl font-bold text-amber-600">{bransletillagg} %</p>
        <p className="text-xs text-slate-400 mt-1">Aktuell procentsats</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Högsta pris</span>
        </div>
        <p className="text-lg font-bold text-emerald-700">{formatSEK(maxPris)}</p>
        <p className="text-xs text-slate-400 mt-1">Pris till kund (excl. FTL)</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
            <TrendingDown size={16} className="text-sky-600" />
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Lägsta pris</span>
        </div>
        <p className="text-lg font-bold text-sky-700">{formatSEK(minPris)}</p>
        <p className="text-xs text-slate-400 mt-1">Pris till kund (excl. FTL)</p>
      </div>

      {ftlRad ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
              <Truck size={16} className="text-rose-600" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">FTL</span>
          </div>
          <p className="text-lg font-bold text-rose-700">{formatSEK(ftlRad.prisTillKund)}</p>
          <p className="text-xs text-slate-400 mt-1">
            Marginal: {formatProcent(ftlRad.marginalProcent)}
          </p>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-4 col-span-2 md:col-span-1 flex items-center justify-center">
          <p className="text-xs text-slate-400 text-center">Ingen FTL-rad</p>
        </div>
      )}
    </div>
  );
}
