import React, { useState } from 'react';
import { Layers, Activity, CheckCircle2, AlertTriangle, Calculator, Scissors } from 'lucide-react';

export const TnmStagingTool: React.FC = () => {
  const [tStage, setTStage] = useState<'T1a' | 'T1b' | 'T1c' | 'T2a' | 'T2b' | 'T3' | 'T4'>('T2a');
  const [nStage, setNStage] = useState<'N0' | 'N1' | 'N2' | 'N3'>('N0');
  const [mStage, setMStage] = useState<'M0' | 'M1a' | 'M1b' | 'M1c'>('M0');

  // Preop Lung Function
  const [preFev1Percent, setPreFev1Percent] = useState<number>(85); // % predicted
  const [preDlcoPercent, setPreDlcoPercent] = useState<number>(75); // % predicted
  const [resectedSegments, setResectedSegments] = useState<number>(4); // e.g. lobectomy (3-5 segments out of 19)

  // Stage calculation
  const getOverallStage = (t: string, n: string, m: string) => {
    if (m === 'M1c') return { stage: 'Stadio IVB', operability: 'Inoperabile (Metastasi multiple a distanza)', color: 'text-rose-400' };
    if (m === 'M1b') return { stage: 'Stadio IVA', operability: 'Metastatico oligometastatico (Trattamento locale + sistemico)', color: 'text-rose-400' };
    if (m === 'M1a') return { stage: 'Stadio IVA', operability: 'Disseminazione pleurica/pericardica (Non chirurgico)', color: 'text-rose-400' };

    if (n === 'N3') return { stage: 'Stadio IIIC', operability: 'Inoperabile chirurgicamente (Radio-Chemioterapia)', color: 'text-amber-400' };
    if (t === 'T4' && n === 'N2') return { stage: 'Stadio IIIB', operability: 'Non resecabile upfront (Terapia sistemica/Radioterapia)', color: 'text-amber-400' };
    if (t === 'T3' && n === 'N2') return { stage: 'Stadio IIIB', operability: 'Valutazione multidisciplinare (Trial neoadiuvante)', color: 'text-amber-400' };
    if (n === 'N2') return { stage: 'Stadio IIIA', operability: 'Possibile chirurgia solo dopo chemioterapia neoadiuvante', color: 'text-amber-300' };

    if (t === 'T4' && n === 'N0') return { stage: 'Stadio IIIA', operability: 'Resezione allargata complessa in centri specialistici', color: 'text-amber-300' };
    if (t === 'T3' && n === 'N1') return { stage: 'Stadio IIIA', operability: 'Chirurgico (Lobectomia + Linfoadenectomia radicale)', color: 'text-emerald-300' };
    if (t === 'T2b' && n === 'N1') return { stage: 'Stadio IIB', operability: 'Chirurgico di prima linea (Lobectomia VATS)', color: 'text-emerald-400' };
    if (t === 'T3' && n === 'N0') return { stage: 'Stadio IIB', operability: 'Chirurgico (Resezione parietale/Lobectomia)', color: 'text-emerald-400' };
    if (n === 'N1') return { stage: 'Stadio IIB', operability: 'Chirurgico (Lobectomia + Linfoadenectomia)', color: 'text-emerald-400' };

    if (t === 'T2a' && n === 'N0') return { stage: 'Stadio IB', operability: 'Gold Standard: Lobectomia polmonare VATS mini-invasiva', color: 'text-emerald-400' };
    if (t === 'T1c' && n === 'N0') return { stage: 'Stadio IA3', operability: 'Chirurgico d\'eccellenza (VATS/RATS Lobectomia o Segmentectomia)', color: 'text-emerald-400' };
    if (t === 'T1b' && n === 'N0') return { stage: 'Stadio IA2', operability: 'Chirurgico mini-invasivo (Lobectomia o Segmentectomia)', color: 'text-emerald-400' };
    return { stage: 'Stadio IA1', operability: 'Chirurgico curativo (Resezione sublobare/VATS)', color: 'text-emerald-400' };
  };

  const currentResult = getOverallStage(tStage, nStage, mStage);

  // Functional Operability Calculation (Total 19 pulmonary segments: 10 right, 9 left)
  // ppo = preop * (1 - (resected / 19))
  const ppoFev1 = Math.round(preFev1Percent * (1 - (resectedSegments / 19)));
  const ppoDlco = Math.round(preDlcoPercent * (1 - (resectedSegments / 19)));
  const isFunctionallyOperable = ppoFev1 > 30 && ppoDlco > 30;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2 text-emerald-400 mb-1">
          <Layers className="w-5 h-5" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">Chirurgia Toracica Oncologica</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Stadiazionatore TNM 8ª & Idoneità alla Resezione</h1>
        <p className="text-xs text-slate-400 mt-1">
          Calcolo stadio TNM NSCLC, orientamento terapeutico e valutazione funzionale ppo-FEV1 / ppo-DLCO (&gt; 30%).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: TNM Selectors */}
        <div className="lg:col-span-6 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
            <span>Classificazione TNM (8ª Edizione)</span>
          </h2>

          {/* T Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-300 font-bold block">T (Estensione Tumore Primitivo):</label>
            <select
              value={tStage}
              onChange={(e) => setTStage(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-mono"
            >
              <option value="T1a">T1a: Tumore ≤ 1 cm</option>
              <option value="T1b">T1b: Tumore &gt; 1 cm ma ≤ 2 cm</option>
              <option value="T1c">T1c: Tumore &gt; 2 cm ma ≤ 3 cm</option>
              <option value="T2a">T2a: Tumore &gt; 3 cm ma ≤ 4 cm o bronco principale</option>
              <option value="T2b">T2b: Tumore &gt; 4 cm ma ≤ 5 cm</option>
              <option value="T3">T3: Tumore &gt; 5 cm ma ≤ 7 cm o invasione parete toracica / frenico</option>
              <option value="T4">T4: Tumore &gt; 7 cm o invasione diaframma / mediastino / vasi / carena</option>
            </select>
          </div>

          {/* N Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-amber-300 font-bold block">N (Interessamento Linfonodale):</label>
            <select
              value={nStage}
              onChange={(e) => setNStage(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-mono"
            >
              <option value="N0">N0: Nessuna metastasi linfonodale regionale</option>
              <option value="N1">N1: Linfonodi peribronchiali / ilari omolaterali</option>
              <option value="N2">N2: Linfonodi mediastinici omolaterali o sottocarenali</option>
              <option value="N3">N3: Linfonodi mediastinici controlaterali o sovraclaveari</option>
            </select>
          </div>

          {/* M Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-300 font-bold block">M (Metastasi a Distanza):</label>
            <select
              value={mStage}
              onChange={(e) => setMStage(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-mono"
            >
              <option value="M0">M0: Nessuna metastasi a distanza</option>
              <option value="M1a">M1a: Versamento pleurico/pericardico neoplastico o nodulo controlaterale</option>
              <option value="M1b">M1b: Singola metastasi extra-toracica (es. cerebrale o surrenalica isolata)</option>
              <option value="M1c">M1c: Metastasi multiple extra-toraciche in uno o più organi</option>
            </select>
          </div>

          {/* Stage Result Badge */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">STADIO CLINICO FINALE</span>
            <div className={`text-xl font-bold font-mono ${currentResult.color}`}>
              {currentResult.stage}
            </div>
            <div className="text-xs text-slate-300 font-mono mt-1">
              {currentResult.operability}
            </div>
          </div>
        </div>

        {/* Right: Functional Operability Calculator */}
        <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-emerald-900/40 space-y-5">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-xs uppercase">
            <Scissors className="w-4 h-4" />
            <span>Valutazione Idoneità Funzionale alla Resezione</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">FEV1 Pre-operatorio (% del teorico):</label>
              <input
                type="number"
                value={preFev1Percent}
                onChange={(e) => setPreFev1Percent(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">DLCO Pre-operatoria (% del teorico):</label>
              <input
                type="number"
                value={preDlcoPercent}
                onChange={(e) => setPreDlcoPercent(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">
                Numero di segmenti polmonari da asportare (es. Lobectomia sup dx = 3, inf dx = 5):
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={resectedSegments}
                onChange={(e) => setResectedSegments(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center pt-2">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">ppo-FEV1 CALCOLATO</span>
              <span className={`text-xl font-bold font-mono ${ppoFev1 > 30 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {ppoFev1}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Cut-off &gt; 30-40%</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">ppo-DLCO CALCOLATA</span>
              <span className={`text-xl font-bold font-mono ${ppoDlco > 30 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {ppoDlco}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Cut-off &gt; 30-40%</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed ${
            isFunctionallyOperable
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
          }`}>
            <div className="font-bold mb-1">
              {isFunctionallyOperable ? '✅ PAZIENTE FUNZIONALMENTE OPERABILE' : '❌ PAZIENTE A RISCHIO PROIBITIVO'}
            </div>
            {isFunctionallyOperable
              ? 'I valori residui previsti ppo-FEV1 e ppo-DLCO superano ampiamente la soglia di sicurezza del 30-40%: l\'intervento di resezione polmonare programmato è sicuro.'
              : 'I valori residui previsti scendono sotto il cut-off del 30%: rischio altissimo di insufficienza respiratoria post-operatoria permanente o decesso. Indicato test da sforzo cardiopolmonare (VO2 max) o approccio parenchima-sparing (Segmentectomia / SBRT stereotassica).'}
          </div>
        </div>
      </div>
    </div>
  );
};
