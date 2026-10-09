import React, { useState } from 'react';
import { Droplet, Activity, CheckCircle2, AlertTriangle, RefreshCw, Layers } from 'lucide-react';

interface EgaPreset {
  name: string;
  ph: number;
  pao2: number;
  paco2: number;
  hco3: number;
  fio2: number; // in %
  desc: string;
}

const PRESETS: EgaPreset[] = [
  {
    name: 'EGA Fisiologico Normale',
    ph: 7.41,
    pao2: 95,
    paco2: 40,
    hco3: 24,
    fio2: 21,
    desc: 'Scambi gassosi ottimali, equilibrio acido-base perfettamente conservato.'
  },
  {
    name: 'Insufficienza Respiratoria Tipo 1 (Ipossiemica da Polmonite/EPA)',
    ph: 7.47,
    pao2: 52,
    paco2: 31,
    hco3: 23,
    fio2: 21,
    desc: 'PaO2 < 60 mmHg con ipocapnia compensatoria da iperventilazione (alcalosi respiratoria acuta lieve).'
  },
  {
    name: 'Insufficienza Respiratoria Tipo 2 (Ipercapnica da Riacutizzazione BPCO)',
    ph: 7.28,
    pao2: 50,
    paco2: 68,
    hco3: 31,
    fio2: 21,
    desc: 'Acidosi respiratoria acuta su cronica con PaCO2 > 45 mmHg e ritenzione renale di bicarbonati (HCO3- elevati).'
  },
  {
    name: 'ARDS Grave (Sindrome Distress Respiratorio Acuto)',
    ph: 7.22,
    pao2: 65,
    paco2: 55,
    hco3: 21,
    fio2: 80, // FiO2 80% (0.8)
    desc: 'Grave shunt intrapolmonare refrattario. Rapporto PaO2/FiO2 = 81 mmHg (< 100 definisce ARDS grave di Berlino).'
  }
];

export const EgaInterpreter: React.FC = () => {
  const [ph, setPh] = useState<number>(7.47);
  const [pao2, setPao2] = useState<number>(52);
  const [paco2, setPaco2] = useState<number>(31);
  const [hco3, setHco3] = useState<number>(23);
  const [fio2, setFio2] = useState<number>(21);

  const applyPreset = (p: EgaPreset) => {
    setPh(p.ph);
    setPao2(p.pao2);
    setPaco2(p.paco2);
    setHco3(p.hco3);
    setFio2(p.fio2);
  };

  // Calculations
  const pfRatio = Math.round(pao2 / (fio2 / 100));

  // Acid-Base Evaluation
  let acidBaseStatus = "";
  if (ph < 7.35) {
    if (paco2 > 45 && hco3 < 22) acidBaseStatus = "Acidosi Mista (Respiratoria + Metabolica)";
    else if (paco2 > 45) acidBaseStatus = "Acidosi Respiratoria" + (hco3 > 26 ? " con compenso metabolico" : " acuta non compensata");
    else if (hco3 < 22) acidBaseStatus = "Acidosi Metabolica" + (paco2 < 35 ? " con compenso respiratorio" : " pura");
    else acidBaseStatus = "Acidosi";
  } else if (ph > 7.45) {
    if (paco2 < 35 && hco3 > 26) acidBaseStatus = "Alcalosi Mista";
    else if (paco2 < 35) acidBaseStatus = "Alcalosi Respiratoria" + (hco3 < 22 ? " con compenso renale" : " acuta da iperventilazione");
    else if (hco3 > 26) acidBaseStatus = "Alcalosi Metabolica" + (paco2 > 45 ? " con compenso respiratorio" : " pura");
    else acidBaseStatus = "Alcalosi";
  } else {
    if (paco2 !== 40 || hco3 !== 24) acidBaseStatus = "Equilibrio Acido-Base Compensato";
    else acidBaseStatus = "Equilibrio Acido-Base Fisiologico";
  }

  // Respiratory Failure Evaluation
  let respFailureType = "Nessuna insufficienza respiratoria (PaO2 ≥ 60 mmHg)";
  let isFailure = false;
  if (pao2 < 60) {
    isFailure = true;
    if (paco2 > 45) {
      respFailureType = "Insufficienza Respiratoria di Tipo 2 (Ipercapnica / Ipoventilazione globale)";
    } else {
      respFailureType = "Insufficienza Respiratoria di Tipo 1 (Ipossiemica pura da Mismatch V/Q o Shunt)";
    }
  }

  // Berlin ARDS Definition (if PF < 300)
  let ardsSeverity = "Nessuna ARDS";
  if (pfRatio < 100) ardsSeverity = "ARDS GRAVE (PaO2/FiO2 < 100 mmHg)";
  else if (pfRatio <= 200) ardsSeverity = "ARDS MODERATA (PaO2/FiO2 101 - 200 mmHg)";
  else if (pfRatio <= 300) ardsSeverity = "ARDS LIEVE (PaO2/FiO2 201 - 300 mmHg)";

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 mb-1">
            <Droplet className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Terapia Intensiva & Pneumologia</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Interprete Emogasanalisi (EGA) & Scambi Gassosi</h1>
          <p className="text-xs text-slate-400 mt-1">
            Analisi automatica equilibrio acido-base, tipo di insufficienza respiratoria e rapporto P/F di Berlino.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white transition"
            >
              Preset #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-5 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Parametri Emogasanalitici</h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">pH (7.35 - 7.45):</label>
              <input
                type="number"
                step="0.01"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">PaO2 (mmHg):</label>
              <input
                type="number"
                value={pao2}
                onChange={(e) => setPao2(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">PaCO2 (mmHg):</label>
              <input
                type="number"
                value={paco2}
                onChange={(e) => setPaco2(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">HCO3- (mmol/L):</label>
              <input
                type="number"
                value={hco3}
                onChange={(e) => setHco3(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-800">
              <label className="text-slate-400 block mb-1">FiO2 erogata (% - 21% = aria ambiente):</label>
              <input
                type="number"
                value={fio2}
                onChange={(e) => setFio2(parseFloat(e.target.value) || 21)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Diagnosis Results */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-rose-900/30 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">RAPPORTO P/F (PaO2/FiO2)</span>
              <span className={`text-xl font-bold font-mono ${pfRatio < 200 ? 'text-rose-400' : pfRatio < 300 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {pfRatio} mmHg
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{ardsSeverity}</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">STATO ACIDO-BASE</span>
              <span className={`text-sm font-bold font-mono ${ph < 7.35 ? 'text-amber-400' : ph > 7.45 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                {acidBaseStatus}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">pH: {ph.toFixed(2)}</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isFailure ? 'bg-rose-950/20 border-rose-500/40' : 'bg-slate-900 border-slate-800'} space-y-2`}>
            <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs font-mono">
              <Activity className="w-4 h-4 text-rose-400" />
              <span>CLASSIFICAZIONE INSUFFICIENZA RESPIRATORIA:</span>
            </div>
            <p className="text-xs text-slate-200 font-mono leading-relaxed">
              {respFailureType}
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
            <div className="font-bold text-slate-300">💡 Promemoria d'Esame:</div>
            <div>• Tipo 1: Ipossiemia pura con PaCO2 normale o bassa (iperventilazione). Trattamento con O2 ad alti flussi o CPAP.</div>
            <div>• Tipo 2: Ipercapnia (PaCO2 &gt; 45 mmHg) da ipoventilazione alveolare (es. BPCO). O2 terapia con target rigido SaO2 88-92% o NIV (Ventilazione Non Invasiva).</div>
          </div>
        </div>
      </div>
    </div>
  );
};
