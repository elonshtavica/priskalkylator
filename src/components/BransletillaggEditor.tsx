import { useState } from 'react';
import { Fuel, Pencil, Check, X } from 'lucide-react';

interface Props {
  bransletillagg: number;
  onAndra: (nyttVarde: number) => void;
}

export default function BransletillaggEditor({ bransletillagg, onAndra }: Props) {
  const [redigerar, setRedigerar] = useState(false);
  const [tempVarde, setTempVarde] = useState(bransletillagg.toString());

  function spara() {
    const val = parseFloat(tempVarde.replace(',', '.'));
    if (!isNaN(val) && val >= 0) {
      onAndra(val);
    }
    setRedigerar(false);
  }

  function avbryt() {
    setTempVarde(bransletillagg.toString());
    setRedigerar(false);
  }

  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
      <Fuel size={16} className="text-amber-600 shrink-0" />
      <span className="text-xs font-medium text-amber-700 whitespace-nowrap">Bränsletillägg:</span>
      {redigerar ? (
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={tempVarde}
            onChange={e => setTempVarde(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') spara(); if (e.key === 'Escape') avbryt(); }}
            className="w-16 border border-amber-300 rounded px-2 py-0.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            autoFocus
          />
          <span className="text-sm text-amber-700">%</span>
          <button onClick={spara} className="p-1 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
            <Check size={12} />
          </button>
          <button onClick={avbryt} className="p-1 bg-slate-400 text-white rounded hover:bg-slate-500 transition-colors">
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-amber-800">{bransletillagg} %</span>
          <button
            onClick={() => { setTempVarde(bransletillagg.toString()); setRedigerar(true); }}
            className="p-1 text-amber-500 hover:text-amber-700 hover:bg-amber-100 rounded transition-colors"
            title="Ändra bränsletillägg"
          >
            <Pencil size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
