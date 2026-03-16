import { useState } from 'react';
import { Plus, ChevronDown, Pencil, Copy, Trash2, ListOrdered, CheckCircle2 } from 'lucide-react';
import { PriceList } from '../types';

interface Props {
  listor: PriceList[];
  valdListaId: string;
  onValjLista: (id: string) => void;
  onNyLista: () => void;
  onRedigeraLista: (lista: PriceList) => void;
  onKopieraLista: (lista: PriceList) => void;
  onTaBortLista: (id: string) => void;
}

export default function PriceListSelector({
  listor,
  valdListaId,
  onValjLista,
  onNyLista,
  onRedigeraLista,
  onKopieraLista,
  onTaBortLista,
}: Props) {
  const [oppet, setOppet] = useState(false);
  const valdLista = listor.find(l => l.id === valdListaId);

  return (
    <div className="relative">
      <button
        onClick={() => setOppet(o => !o)}
        className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors min-w-[220px]"
      >
        <ListOrdered size={16} className="text-blue-500 shrink-0" />
        <span className="flex-1 text-left truncate">{valdLista?.namn ?? 'Välj prislista'}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform shrink-0 ${oppet ? 'rotate-180' : ''}`} />
      </button>

      {oppet && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOppet(false)} />
          <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
            <div className="p-2">
              {listor.map(lista => (
                <div
                  key={lista.id}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 group hover:bg-slate-50 transition-colors ${lista.id === valdListaId ? 'bg-blue-50' : ''}`}
                >
                  <button
                    onClick={() => { onValjLista(lista.id); setOppet(false); }}
                    className="flex-1 flex items-center gap-2 text-left min-w-0"
                  >
                    {lista.id === valdListaId ? (
                      <CheckCircle2 size={15} className="text-blue-500 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${lista.id === valdListaId ? 'text-blue-700' : 'text-slate-700'}`}>
                        {lista.namn}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {lista.manad ? lista.manad + ' · ' : ''}{lista.bransletillagg} % bränsle · {lista.rader.length} rader
                      </p>
                    </div>
                  </button>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { onRedigeraLista(lista); setOppet(false); }}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                      title="Redigera"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => { onKopieraLista(lista); setOppet(false); }}
                      className="p-1 text-slate-400 hover:text-emerald-600 rounded transition-colors"
                      title="Kopiera"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Ta bort "${lista.namn}"?`)) {
                          onTaBortLista(lista.id);
                          setOppet(false);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Ta bort"
                      disabled={listor.length === 1}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 p-2">
              <button
                onClick={() => { onNyLista(); setOppet(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus size={15} />
                Skapa ny prislista
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
