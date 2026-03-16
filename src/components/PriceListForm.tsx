import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { PriceList } from '../types';
import { defaultPrislistor } from '../data/defaultData';

interface Props {
  befintlig?: PriceList;
  onSpara: (lista: PriceList) => void;
  onStang: () => void;
}

const MANADER = [
  'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
  'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December',
];

export default function PriceListForm({ befintlig, onSpara, onStang }: Props) {
  const [namn, setNamn] = useState(befintlig?.namn ?? '');
  const [manad, setManad] = useState(befintlig?.manad ?? '');
  const [bransletillagg, setBransletillagg] = useState(befintlig?.bransletillagg.toString() ?? '0');

  function handleSpara() {
    if (!namn.trim()) return;
    const lista: PriceList = {
      id: befintlig?.id ?? crypto.randomUUID(),
      namn: namn.trim(),
      manad,
      bransletillagg: parseFloat(bransletillagg.replace(',', '.')) || 0,
      rader: befintlig?.rader ?? defaultPrislistor[0].rader.map(r => ({ ...r, id: crypto.randomUUID() })),
      skapadDatum: befintlig?.skapadDatum ?? new Date().toISOString(),
    };
    onSpara(lista);
  }

  const inputKlass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            {befintlig ? 'Redigera prislista' : 'Ny prislista'}
          </h3>
          <button
            onClick={onStang}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Namn på prislistan <span className="text-red-500">*</span>
            </label>
            <input
              className={inputKlass}
              value={namn}
              onChange={e => setNamn(e.target.value)}
              placeholder="t.ex. Prislista Q1 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Månad</label>
            <select
              className={inputKlass}
              value={manad}
              onChange={e => setManad(e.target.value)}
            >
              <option value="">— Välj månad —</option>
              {MANADER.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bränsletillägg (%)
            </label>
            <input
              className={inputKlass}
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={bransletillagg}
              onChange={e => setBransletillagg(e.target.value)}
              placeholder="0"
            />
            <p className="text-xs text-slate-400 mt-1">Ange procentsats, t.ex. 12 för 12 %</p>
          </div>

          {!befintlig && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                Den nya prislistan skapas med standarddata. Du kan redigera raderna efteråt.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-200">
          <button
            onClick={onStang}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={handleSpara}
            disabled={!namn.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={15} />
            Spara
          </button>
        </div>
      </div>
    </div>
  );
}
