import React, { useState } from 'react';
import { Wind, Activity, CheckCircle2, AlertCircle, RefreshCw, Calculator } from 'lucide-react';

interface PresetPfr {
  id: string;
  name: string;
  fev1: number; // in L
  fev1Pred: number;
  fvc: number;
  fvcPred: number;
  postFev1: number; // after salbutamol
  dlco: number; // % predicted
  tlc: number; // % predicted
  vr: number; // % predicted
  diagnosis: string;
  comment: string;
}

const PRESETS: PresetPfr[] = [
  {
    id: 'normal',
    name: 'Soggetto Sano (PFR Normale)',
    fev1: 4.10,
    fev1Pred: 4.20,
    fvc: 5.00,
    fvcPred: 5.10,
    postFev1: 4.15,
    dlco: 98,
    tlc: 102,
    vr: 95,
    diagnosis: 'Funzionalità Respiratoria Fisiologica',
    comment: 'Indice di Tiffeneau > 70%, volumi polmonari statici conservati e DLCO nella norma.'
  },
  {
    id: 'asthma',
    name: 'Asma Bronchiale (Deficit Ostruttivo Reversibile)',
    fev1: 2.20,
    fev1Pred: 4.00,
    fvc: 3.80,
    fvcPred: 4.80,
    postFev1: 2.70, // +500 ml (+22.7%) -> Reversible!
    dlco: 105,
    tlc: 110,
    vr: 130,
    diagnosis: 'Deficit Ventilatorio Ostruttivo Reversibile',
    comment: 'Tiffeneau 57.9% (< 70%). Test al Salbutamolo POSITIVO (+500 ml e +22.7%, supera ampiamente la soglia +12% e +200 ml). DLCO normale/aumentata per aumentata perfusione apicale.'
  },
  {
    id: 'copd',
    name: 'BPCO Grave (Deficit Ostruttivo Non Reversibile con Enfisema)',
    fev1: 1.30,
    fev1Pred: 3.80,
    fvc: 2.90,
    fvcPred: 4.60,
    postFev1: 1.38, // +80 ml (+6%) -> Non-reversible
    dlco: 48,
    tlc: 135,
    vr: 195,
    diagnosis: 'Deficit Ostruttivo Grave (GOLD 3) Non Reversibile con Iperinflazione',
    comment: 'Tiffeneau 44.8%. Test reversibilità negativo (+80 ml). VR al 195% (intrappolamento aereo / air trapping). DLCO severamente ridotta (48%) da distruzione del letto capillare enfisematoso.'
  },
  {
    id: 'fibrosis',
    name: 'Fibrosi Polmonare Idiopatica (Deficit Restrittivo con DLCO crollata)',
    fev1: 2.10,
    fev1Pred: 3.60,
    fvc: 2.30,
    fvcPred: 4.40,
    postFev1: 2.12,
    dlco: 38,
    tlc: 58,
    vr: 52,
    diagnosis: 'Deficit Ventilatorio Restrittivo con Grave Compromissione Diffusiva',
    comment: 'Indice di Tiffeneau NORMALE o aumentato (91.3%). TLC 58% (< 80%, definisce la restrizione alla pletismografia). DLCO marcatamente crollata (38%) per ispessimento e fibrosi della membrana alveolo-capillare.'
  }
];

export const PfrSpirometryTool: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PresetPfr>(PRESETS[1]);
  
  // Custom inputs based on preset
  const [fev1, setFev1] = useState<number>(selectedPreset.fev1);
  const [fev1Pred, setFev1Pred] = useState<number>(selectedPreset.fev1Pred);
  const [fvc, setFvc] = useState<number>(selectedPreset.fvc);
  const [postFev1, setPostFev1] = useState<number>(selectedPreset.postFev1);
  const [dlco, setDlco] = useState<number>(selectedPreset.dlco);
  const [tlc, setTlc] = useState<number>(selectedPreset.tlc);

  const handleSelectPreset = (p: PresetPfr) => {
    setSelectedPreset(p);
    setFev1(p.fev1);
    setFev1Pred(p.fev1Pred);
    setFvc(p.fvc);
    setPostFev1(p.postFev1);
    setDlco(p.dlco);
    setTlc(p.tlc);
  };

  // Calculations
  const tiffeneau = (fev1 / fvc) * 100;
  const fev1PercentPred = (fev1 / fev1Pred) * 100;
  const deltaFev1Ml = (postFev1 - fev1) * 1000;
  const deltaFev1Percent = ((postFev1 - fev1) / fev1) * 100;
  const isReversible = deltaFev1Ml >= 200 && deltaFev1Percent >= 12;

  const isObstructive = tiffeneau < 70;
  const isRestrictive = tlc < 80;

  let severityGold = "";
  if (isObstructive) {
    if (fev1PercentPred >= 80) severityGold = "Lieve (GOLD 1)";
    else if (fev1PercentPred >= 50) severityGold = "Moderato (GOLD 2)";
    else if (fev1PercentPred >= 30) severityGold = "Grave (GOLD 3)";
    else severityGold = "Molto Grave (GOLD 4)";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 mb-1">
            <Wind className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Pneumologia Funzionale</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Interprete PFR & Spirometria Clinica</h1>
          <p className="text-xs text-slate-400 mt-1">
            Calcolo automatico Tiffeneau, test al Salbutamolo (+12% / +200 ml), volumi pletismografici e DLCO.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                selectedPreset.id === p.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Controls */}
        <div className="lg:col-span-5 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>Parametri Spirometrici</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">FEV1 Basale (L):</label>
              <input
                type="number"
                step="0.05"
                value={fev1}
                onChange={(e) => setFev1(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">FVC Basale (L):</label>
              <input
                type="number"
                step="0.05"
                value={fvc}
                onChange={(e) => setFvc(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">FEV1 Post-Broncodilatatore (L):</label>
              <input
                type="number"
                step="0.05"
                value={postFev1}
                onChange={(e) => setPostFev1(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="text-slate-400 block mb-1">TLC Pletismografia (%):</label>
                <input
                  type="number"
                  value={tlc}
                  onChange={(e) => setTlc(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">DLCO (% predetto):</label>
                <input
                  type="number"
                  value={dlco}
                  onChange={(e) => setDlco(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-time Analysis & Flow-Volume Curve Visualizer */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-cyan-900/40 space-y-5">
          {/* Diagnostic Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">INDICE TIFFENEAU</span>
              <span className={`text-lg font-bold font-mono ${tiffeneau < 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {tiffeneau.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{tiffeneau < 70 ? 'Ostruttivo (<70%)' : 'Normale (≥70%)'}</span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">FEV1 % PREDETTO</span>
              <span className="text-lg font-bold font-mono text-cyan-400">
                {fev1PercentPred.toFixed(0)}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{severityGold || 'Normale'}</span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">TEST SALBUTAMOLO</span>
              <span className={`text-base font-bold font-mono ${isReversible ? 'text-emerald-400' : 'text-slate-400'}`}>
                {isReversible ? '+ REVERSIBILE' : 'NEGATIVO'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">+{deltaFev1Ml.toFixed(0)} ml ({deltaFev1Percent.toFixed(1)}%)</span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">DIFFUSIONE DLCO</span>
              <span className={`text-lg font-bold font-mono ${dlco < 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {dlco}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{dlco < 70 ? 'Compromessa' : 'Fisiologica'}</span>
            </div>
          </div>

          {/* SVG Flow-Volume Curve Simulation */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
              Curva Flusso-Volume Dinamica (Simulazione Grafica):
            </span>
            <svg className="w-full h-44 bg-[#030712] rounded-xl border border-cyan-950 p-2" viewBox="0 0 350 160">
              {/* Axes */}
              <line x1="40" y1="20" x2="40" y2="140" stroke="#334155" strokeWidth="1" />
              <line x1="40" y1="80" x2="330" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
              <text x="10" y="30" fill="#94a3b8" fontSize="8" fontFamily="monospace">Espiraz.</text>
              <text x="10" y="135" fill="#94a3b8" fontSize="8" fontFamily="monospace">Inspiraz.</text>
              <text x="300" y="92" fill="#94a3b8" fontSize="8" fontFamily="monospace">Volume</text>

              {/* Curve: changes based on obstruction or restriction */}
              {isObstructive ? (
                // Obstructive curve with "scooping" concavity
                <path
                  d="M 60 80 Q 90 20 120 40 Q 180 75 280 80 Q 200 135 60 80"
                  fill="rgba(245, 158, 11, 0.15)"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
              ) : isRestrictive ? (
                // Restrictive: miniature normal shape
                <path
                  d="M 60 80 Q 80 30 110 50 Q 140 70 170 80 Q 120 130 60 80"
                  fill="rgba(59, 130, 246, 0.15)"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                />
              ) : (
                // Normal curve
                <path
                  d="M 60 80 Q 90 15 130 35 Q 210 65 300 80 Q 180 140 60 80"
                  fill="rgba(16, 185, 129, 0.15)"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
              )}
            </svg>
          </div>

          {/* Clinical Diagnostic Report */}
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>DIAGNOSI FUNZIONALE CONCLUSIVA:</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-mono">
              {selectedPreset.comment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
