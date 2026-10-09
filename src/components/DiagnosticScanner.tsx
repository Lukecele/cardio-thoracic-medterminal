import React, { useState } from 'react';
import { Search, ShieldAlert, Zap, ExternalLink } from 'lucide-react';
import scannerData from '../data/scannerMatrix.json';

interface Props {
  onNavigateTopic?: (topicId: string) => void;
  onOpenQuestion?: (questionId: string) => void;
}

export const DiagnosticScanner: React.FC<Props> = ({ onNavigateTopic }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<'all' | 'cardio' | 'pneumo' | 'vascolare'>('all');
  const [selectedItem, setSelectedItem] = useState<(typeof scannerData)[0]>(scannerData[0]);

  const filteredItems = scannerData.filter((item) => {
    const matchesSystem = selectedSystem === 'all' || item.system === selectedSystem;
    const matchesSearch =
      searchTerm === '' ||
      item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symptoms.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.physicalFindings.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.ecgFindings.some((e) => e.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSystem && matchesSearch;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-mono font-bold uppercase tracking-wider text-slate-100">
              Multi-Criteria Clinical Scanner & Differential Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Motore di correlazione reperti &rarr; diagnosi &rarr; imaging gold standard &rarr; terapia d'urgenza.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-2">
          {(['all', 'cardio', 'pneumo', 'vascolare'] as const).map((sys) => (
            <button
              key={sys}
              onClick={() => setSelectedSystem(sys)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition border ${
                selectedSystem === sys
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              {sys === 'all' ? 'Tutti i Sistemi' : sys.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cerca per sintomo (es. 'dispnea', 'dolore toracico'), reperto obiettivo ('polso parvus', 'sibili'), o reperto ECG..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
        />
      </div>

      {/* Main Grid: Left List + Right Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-3.5 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-950/25 border-amber-400/80 shadow-md shadow-amber-950/40'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      item.system === 'cardio'
                        ? 'bg-rose-500/20 text-rose-300'
                        : item.system === 'pneumo'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {item.system}
                  </span>
                  <span className="text-[11px] font-mono text-amber-400 font-semibold">{item.examFrequency}</span>
                </div>
                <div className="font-bold text-slate-200 text-sm">{item.diagnosis}</div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {item.physicalFindings.join(' • ')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail HUD */}
        {selectedItem && (
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                    Profilo Diagnostico Selezionato
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedItem.diagnosis}</h3>
                </div>
                <button
                  onClick={() => onNavigateTopic && onNavigateTopic(selectedItem.topicId)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono hover:bg-cyan-500/30 transition"
                >
                  <span>Apri Teoria 2FAST</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Symptoms */}
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-1">
                  Sintomatologia Tipica
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.symptoms.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-800 text-xs text-slate-300 border border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Physical Findings */}
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-1">
                  Segni all'Esame Obiettivo (Semeiotica)
                </span>
                <div className="space-y-1">
                  {selectedItem.physicalFindings.map((p, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                      <span className="text-cyan-400 mt-0.5">&bull;</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ECG Findings */}
              {selectedItem.ecgFindings.length > 0 && (
                <div>
                  <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-1">
                    Reperti Elettrocardiografici (ECG)
                  </span>
                  <div className="space-y-1">
                    {selectedItem.ecgFindings.map((e, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-slate-300 font-mono">
                        <span className="text-rose-400 mt-0.5">&bull;</span>
                        <span>{e}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gold Standard Imaging */}
              <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30">
                <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                  Gold Standard Diagnostico / Imaging
                </span>
                <div className="text-xs text-slate-200 leading-relaxed font-semibold">
                  {selectedItem.imagingGoldStandard}
                </div>
              </div>

              {/* Urgent Clinical Actions */}
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30">
                <span className="text-[11px] font-mono uppercase text-rose-400 font-bold block mb-1">
                  Management d'Urgenza & Linee Guida
                </span>
                <div className="space-y-1">
                  {selectedItem.urgentActions.map((u, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-200">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{u}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
