import { useState, useEffect, useCallback } from 'react';
import { Download, Printer, Plus, Pencil } from 'lucide-react';
import { PriceList, PriceRow } from './types';
import { beraknaAllaRader } from './utils/calculations';
import { laddaPrislistor, sparaPrislistor } from './utils/storage';
import { exportCSV, skrivUt } from './utils/export';
import QuickCalculator from './components/QuickCalculator';
import SummaryCards from './components/SummaryCards';
import PriceTable from './components/PriceTable';
import PriceListForm from './components/PriceListForm';
import PriceListSelector from './components/PriceListSelector';
import BransletillaggEditor from './components/BransletillaggEditor';
import FuelPriceReminder from './components/FuelPriceReminder';

export default function App() {
  const [listor, setListor] = useState<PriceList[]>(() => laddaPrislistor());
  const [valdListaId, setValdListaId] = useState<string>(() => laddaPrislistor()[0]?.id ?? '');
  const [visaForm, setVisaForm] = useState(false);
  const [redigerarLista, setRedigerarLista] = useState<PriceList | undefined>(undefined);

  const valdLista = listor.find(l => l.id === valdListaId) ?? listor[0];

  useEffect(() => {
    sparaPrislistor(listor);
  }, [listor]);

  const uppdateraListor = useCallback((nyaListor: PriceList[]) => {
    setListor(nyaListor);
  }, []);

  function sparaLista(lista: PriceList) {
    const finns = listor.some(l => l.id === lista.id);
    if (finns) {
      uppdateraListor(listor.map(l => l.id === lista.id ? lista : l));
    } else {
      uppdateraListor([...listor, lista]);
      setValdListaId(lista.id);
    }
    setVisaForm(false);
    setRedigerarLista(undefined);
  }

  function taBortLista(id: string) {
    const kvar = listor.filter(l => l.id !== id);
    uppdateraListor(kvar);
    if (valdListaId === id && kvar.length > 0) {
      setValdListaId(kvar[0].id);
    }
  }

  function kopieraLista(lista: PriceList) {
    const kopia: PriceList = {
      ...lista,
      id: crypto.randomUUID(),
      namn: `${lista.namn} (kopia)`,
      skapadDatum: new Date().toISOString(),
      rader: lista.rader.map(r => ({ ...r, id: crypto.randomUUID() })),
    };
    uppdateraListor([...listor, kopia]);
    setValdListaId(kopia.id);
  }

  function uppdateraRader(nyaRader: PriceRow[]) {
    uppdateraListor(
      listor.map(l => l.id === valdLista.id ? { ...l, rader: nyaRader } : l)
    );
  }

  function andraeBransletillagg(nyttVarde: number) {
    uppdateraListor(
      listor.map(l => l.id === valdLista.id ? { ...l, bransletillagg: nyttVarde } : l)
    );
  }

  const beraknade = beraknaAllaRader(valdLista?.rader ?? [], valdLista?.bransletillagg ?? 0);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 mr-auto">
              <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white font-black text-sm">TP</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">Transportpriskalkylator</h1>
                <p className="text-xs text-slate-400 leading-tight hidden sm:block">Hantera och beräkna transportpriser</p>
              </div>
            </div>

            <PriceListSelector
              listor={listor}
              valdListaId={valdLista?.id ?? ''}
              onValjLista={setValdListaId}
              onNyLista={() => { setRedigerarLista(undefined); setVisaForm(true); }}
              onRedigeraLista={lista => { setRedigerarLista(lista); setVisaForm(true); }}
              onKopieraLista={kopieraLista}
              onTaBortLista={taBortLista}
            />

            {valdLista && (
              <BransletillaggEditor
                bransletillagg={valdLista.bransletillagg}
                onAndra={andraeBransletillagg}
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={() => { setRedigerarLista(valdLista); setVisaForm(true); }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-300 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                title="Redigera prislista"
              >
                <Pencil size={14} />
                <span className="hidden sm:inline">Redigera</span>
              </button>
              <button
                onClick={() => { setRedigerarLista(undefined); setVisaForm(true); }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Ny lista</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-4">
          <FuelPriceReminder />
        </div>
        {valdLista ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{valdLista.namn}</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {valdLista.manad ? valdLista.manad + ' · ' : ''}
                  {valdLista.rader.length} rader · Bränsletillägg {valdLista.bransletillagg} %
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportCSV(valdLista, beraknade)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-300 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Download size={14} />
                  <span>Exportera CSV</span>
                </button>
                <button
                  onClick={() => skrivUt(valdLista, beraknade)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-300 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Printer size={14} />
                  <span>Skriv ut</span>
                </button>
              </div>
            </div>

            <QuickCalculator rader={beraknade} bransletillagg={valdLista.bransletillagg} />

            <SummaryCards rader={beraknade} bransletillagg={valdLista.bransletillagg} />

            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Pristabell</h3>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-slate-300 inline-block"></span> Inköpspris
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-300 inline-block"></span> Pris till kund
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-yellow-300 inline-block"></span> Marginal
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-amber-300 inline-block"></span> Bränsle
                </span>
              </div>
            </div>

            <PriceTable rader={beraknade} onUppdatera={uppdateraRader} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mb-4">
              <Plus size={28} className="text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Inga prislistor</h2>
            <p className="text-slate-400 mb-6">Skapa din första prislista för att komma igång.</p>
            <button
              onClick={() => { setRedigerarLista(undefined); setVisaForm(true); }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Skapa prislista
            </button>
          </div>
        )}
      </main>

      {visaForm && (
        <PriceListForm
          befintlig={redigerarLista}
          onSpara={sparaLista}
          onStang={() => { setVisaForm(false); setRedigerarLista(undefined); }}
        />
      )}
    </div>
  );
}
