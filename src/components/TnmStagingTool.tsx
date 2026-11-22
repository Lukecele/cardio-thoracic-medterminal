import React, { useState } from 'react';
import { Layers, Scissors, Sparkles } from 'lucide-react';

type TStage = 'T1a' | 'T1b' | 'T1c' | 'T2a' | 'T2b' | 'T3' | 'T4';
type NStage = 'N0' | 'N1' | 'N2a' | 'N2b' | 'N3';
type MStage = 'M0' | 'M1a' | 'M1b' | 'M1c1' | 'M1c2';

interface StageResult {
  stage: string;
  operability: string;
  color: string;
  ninthEdNote?: string;
}

const isT1 = (t: TStage) => t === 'T1a' || t === 'T1b' || t === 'T1c';
const isT2 = (t: TStage) => t === 'T2a' || t === 'T2b';

// Matrice ufficiale IASLC / AJCC TNM 9ª Edizione (in vigore dal 2025)
const getOverallStage = (t: TStage, n: NStage, m: MStage): StageResult => {
  if (m === 'M1c2') {
    return {
      stage: 'Stadio IVB',
      operability: 'Malattia metastatica diffusa multi-organo: terapia sistemica guidata da biomarker (target therapy / immunoterapia ± chemio).',
      color: 'text-rose-400',
      ninthEdNote: 'Novità 9ª Ed.: M1c distinto in M1c1 (singolo organo/apparato) vs M1c2 (multi-organo, prognosi peggiore).'
    };
  }
  if (m === 'M1c1') {
    return {
      stage: 'Stadio IVB',
      operability: 'Metastasi multiple confinate a un singolo organo/apparato: terapia sistemica (± trattamenti locali consolidativi in casi selezionati).',
      color: 'text-rose-400',
      ninthEdNote: 'Novità 9ª Ed.: M1c1 identifica metastasi multiple extra-toraciche in un SOLO organo/apparato (prognosi migliore di M1c2).'
    };
  }
  if (m === 'M1b') {
    return {
      stage: 'Stadio IVA',
      operability: 'Malattia oligometastatica (singola lesione extra-toracica): terapia sistemica + valutazione trattamento locale ablativo/chirurgico.',
      color: 'text-rose-400'
    };
  }
  if (m === 'M1a') {
    return {
      stage: 'Stadio IVA',
      operability: 'Disseminazione intratoracica (pleura/pericardio/polmone controlaterale): non chirurgico, terapia sistemica mirata.',
      color: 'text-rose-400'
    };
  }

  // M0 — N3
  if (n === 'N3') {
    if (t === 'T3' || t === 'T4') {
      return {
        stage: 'Stadio IIIC',
        operability: 'Inoperabile chirurgicamente: chemio-radioterapia concomitante seguita da consolidamento immunoterapico (es. Durvalumab).',
        color: 'text-rose-400'
      };
    }
    return {
      stage: 'Stadio IIIB',
      operability: 'Non resecabile upfront (linfonodi N3): chemio-radioterapia definitiva + immunoterapia di consolidamento.',
      color: 'text-amber-400'
    };
  }

  // M0 — N2b (stazioni mediastiniche omolaterali multiple)
  if (n === 'N2b') {
    if (isT1(t)) {
      return {
        stage: 'Stadio IIIA',
        operability: 'N2 multistazione: discussione in Tumor Board per chemio-immunoterapia neoadiuvante/perioperatoria o chemio-radioterapia.',
        color: 'text-amber-300',
        ninthEdNote: '9ª Ed.: T1 N2b resta Stadio IIIA (mentre T1 N2a scende a IIB).'
      };
    }
    return {
      stage: 'Stadio IIIB',
      operability: 'N2 multistazione localmente avanzato: chemio-radioterapia concomitante ± consolidamento (chirurgia solo in casi altamente selezionati).',
      color: 'text-amber-400',
      ninthEdNote: isT2(t)
        ? 'Novità 9ª Ed.: T2a/T2b N2b passa in upstaging da Stadio IIIA (8ª ed.) a Stadio IIIB!'
        : '9ª Ed.: T3/T4 con N2 multistazione (N2b) confermato in Stadio IIIB.'
    };
  }

  // M0 — N2a (singola stazione mediastinica omolaterale o sottocarenale)
  if (n === 'N2a') {
    if (isT1(t)) {
      return {
        stage: 'Stadio IIB',
        operability: 'N2 a singola stazione: candidabile a percorso multimodale (chemio-immunoterapia neoadiuvante/perioperatoria + lobectomia radicale).',
        color: 'text-emerald-300',
        ninthEdNote: 'Novità 9ª Ed.: T1 N2a (singola stazione) scende in downstaging da Stadio IIIA (8ª ed.) a Stadio IIB!'
      };
    }
    if (isT2(t) || t === 'T3') {
      return {
        stage: 'Stadio IIIA',
        operability: 'Potenzialmente resecabile dopo trattamento sistemico neoadiuvante/perioperatorio (discussione in Tumor Board multidisciplinare).',
        color: 'text-amber-300',
        ninthEdNote: t === 'T3'
          ? 'Novità 9ª Ed.: T3 N2a (singola stazione) scende in downstaging da Stadio IIIB (8ª ed.) a Stadio IIIA!'
          : '9ª Ed.: T2 N2a (singola stazione) rimane Stadio IIIA.'
      };
    }
    return {
      stage: 'Stadio IIIB',
      operability: 'T4 con N2a: valutazione in centro ad alto volume (chemio-immunoterapia di induzione o chemio-radioterapia).',
      color: 'text-amber-400'
    };
  }

  // M0 — N1 (linfonodi ilari/peribronchiali omolaterali)
  if (n === 'N1') {
    if (isT1(t)) {
      return {
        stage: 'Stadio IIA',
        operability: 'Chirurgico (Lobectomia VATS/RATS + linfoadenectomia sistematica) associato a terapia perioperatoria/adiuvante.',
        color: 'text-emerald-400',
        ninthEdNote: 'Novità 9ª Ed.: T1 N1 scende in downstaging da Stadio IIB (8ª ed.) a Stadio IIA!'
      };
    }
    if (isT2(t)) {
      return {
        stage: 'Stadio IIB',
        operability: 'Chirurgico di prima linea (Lobectomia + linfoadenectomia radicale) + valutazione chemio-immunoterapia perioperatoria/adiuvante.',
        color: 'text-emerald-400'
      };
    }
    return {
      stage: 'Stadio IIIA',
      operability: 'Resezione chirurgica complessa/allargata in percorso multimodale (neoadiuvante/adiuvante).',
      color: 'text-amber-300'
    };
  }

  // M0 — N0
  if (t === 'T4') return { stage: 'Stadio IIIA', operability: 'Resezione allargata in centri specialistici (± terapia perioperatoria).', color: 'text-amber-300' };
  if (t === 'T3') return { stage: 'Stadio IIB', operability: 'Chirurgico (Lobectomia / resezione parietale en bloc) + terapia adiuvante.', color: 'text-emerald-400' };
  if (t === 'T2b') return { stage: 'Stadio IIA', operability: 'Chirurgico: Lobectomia polmonare VATS/RATS + linfoadenectomia sistematica.', color: 'text-emerald-400' };
  if (t === 'T2a') return { stage: 'Stadio IB', operability: 'Gold Standard: Lobectomia polmonare VATS/RATS mini-invasiva + linfoadenectomia.', color: 'text-emerald-400' };
  if (t === 'T1c') return { stage: 'Stadio IA3', operability: 'Chirurgico d\'eccellenza (VATS/RATS Lobectomia + linfoadenectomia).', color: 'text-emerald-400' };
  if (t === 'T1b') return { stage: 'Stadio IA2', operability: 'Chirurgico mini-invasivo (Lobectomia o Segmentectomia anatomica se periferico ≤ 2 cm).', color: 'text-emerald-400' };
  return { stage: 'Stadio IA1', operability: 'Chirurgico curativo (Segmentectomia anatomica o Lobectomia VATS/RATS).', color: 'text-emerald-400' };
};

export const TnmStagingTool: React.FC = () => {
  const [tStage, setTStage] = useState<TStage>('T2a');
  const [nStage, setNStage] = useState<NStage>('N0');
  const [mStage, setMStage] = useState<MStage>('M0');

  // Preop Lung Function
  const [preFev1Percent, setPreFev1Percent] = useState<number>(85); // % predicted
  const [preDlcoPercent, setPreDlcoPercent] = useState<number>(75); // % predicted
  const [resectedSegments, setResectedSegments] = useState<number>(4); // e.g. lobectomy (3-5 segments out of 19)

  const currentResult = getOverallStage(tStage, nStage, mStage);

  // Functional Operability Calculation (Total 19 pulmonary segments: 10 right, 9 left)
  const ppoFev1 = Math.round(preFev1Percent * (1 - (resectedSegments / 19)));
  const ppoDlco = Math.round(preDlcoPercent * (1 - (resectedSegments / 19)));
  const isFunctionallyOperable = ppoFev1 > 30 && ppoDlco > 30;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-emerald-400 mb-1">
          <Layers className="w-5 h-5" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">Chirurgia Toracica Oncologica</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            IASLC / AJCC 9ª ED. (2025)
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Stadiazionatore TNM 9ª Ed. & Idoneità alla Resezione</h1>
        <p className="text-xs text-slate-400 mt-1">
          Matrice ufficiale NSCLC 9ª Edizione (con suddivisione N2a/N2b e M1c1/M1c2) e calcolo funzionale ppo-FEV1 / ppo-DLCO.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: TNM Selectors */}
        <div className="lg:col-span-6 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
            <span>Classificazione TNM (9ª Edizione IASLC)</span>
          </h2>

          {/* T Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-300 font-bold block">T (Estensione Tumore Primitivo — invariato da 8ª ed.):</label>
            <select
              value={tStage}
              onChange={(e) => setTStage(e.target.value as TStage)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-mono"
            >
              <option value="T1a">T1a: Tumore ≤ 1 cm</option>
              <option value="T1b">T1b: Tumore &gt; 1 cm ma ≤ 2 cm</option>
              <option value="T1c">T1c: Tumore &gt; 2 cm ma ≤ 3 cm</option>
              <option value="T2a">T2a: Tumore &gt; 3 cm ma ≤ 4 cm o bronco principale / pleura viscerale</option>
              <option value="T2b">T2b: Tumore &gt; 4 cm ma ≤ 5 cm</option>
              <option value="T3">T3: Tumore &gt; 5 cm ma ≤ 7 cm o parete toracica / frenico / noduli stesso lobo</option>
              <option value="T4">T4: Tumore &gt; 7 cm o diaframma / mediastino / grossi vasi / carena / nodulo altro lobo omolaterale</option>
            </select>
          </div>

          {/* N Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-amber-300 font-bold block">N (Interessamento Linfonodale — novità N2a/N2b):</label>
            <select
              value={nStage}
              onChange={(e) => setNStage(e.target.value as NStage)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-mono"
            >
              <option value="N0">N0: Nessuna metastasi linfonodale regionale</option>
              <option value="N1">N1: Linfonodi peribronchiali / ilari / intrapolmonari omolaterali</option>
              <option value="N2a">N2a (9ª Ed.): SINGOLA stazione mediastinica omolaterale o sottocarenale</option>
              <option value="N2b">N2b (9ª Ed.): STAZIONI MULTIPLE mediastiniche omolaterali e/o sottocarenale</option>
              <option value="N3">N3: Linfonodi mediastinici/ilari controlaterali o scalenici/sovraclaveari</option>
            </select>
          </div>

          {/* M Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-300 font-bold block">M (Metastasi a Distanza — novità M1c1/M1c2):</label>
            <select
              value={mStage}
              onChange={(e) => setMStage(e.target.value as MStage)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-mono"
            >
              <option value="M0">M0: Nessuna metastasi a distanza</option>
              <option value="M1a">M1a: Versamento pleurico/pericardico neoplastico o nodulo controlaterale</option>
              <option value="M1b">M1b: Singola metastasi extra-toracica in un singolo organo</option>
              <option value="M1c1">M1c1 (9ª Ed.): Metastasi multiple extra-toraciche in UN SINGOLO organo/apparato</option>
              <option value="M1c2">M1c2 (9ª Ed.): Metastasi multiple extra-toraciche in PIÙ organi/apparati</option>
            </select>
          </div>

          {/* Stage Result Badge */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-500">STADIO CLINICO FINALE (TNM 9ª ED.)</span>
              <span className="text-[11px] font-mono text-slate-400">{tStage} {nStage} {mStage}</span>
            </div>
            <div className={`text-xl font-bold font-mono ${currentResult.color}`}>
              {currentResult.stage}
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              {currentResult.operability}
            </div>
            {currentResult.ninthEdNote && (
              <div className="mt-2 p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/35 text-xs text-indigo-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{currentResult.ninthEdNote}</span>
              </div>
            )}
          </div>

          {/* Compact 9th Ed Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <div className="text-[11px] font-mono font-bold text-cyan-300 uppercase">
              Cosa cambia tra 8ª e 9ª Edizione (Domanda d&apos;Esame!)
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li><strong className="text-slate-200">N2 diviso in N2a / N2b:</strong> singola stazione vs stazioni multiple.</li>
              <li><strong className="text-slate-200">M1c diviso in M1c1 / M1c2:</strong> singolo organo/apparato vs multi-organo (entrambi IVB).</li>
              <li><strong className="text-slate-200">Cambi di stadio:</strong> T1N1 (IIB → <strong>IIA</strong>), T1N2a (IIIA → <strong>IIB</strong>), T3N2a (IIIB → <strong>IIIA</strong>), T2a/b N2b (IIIA → <strong>IIIB</strong>).</li>
            </ul>
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
                Numero di segmenti polmonari da asportare (su 19 totali — es. Lobectomia sup dx = 3, inf dx = 5):
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={resectedSegments}
                onChange={(e) => setResectedSegments(parseInt(e.target.value, 10) || 1)}
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

          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isFunctionallyOperable
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
          }`}>
            <div className="font-bold font-mono mb-1">
              {isFunctionallyOperable ? '✅ PAZIENTE FUNZIONALMENTE OPERABILE' : '❌ PAZIENTE A RISCHIO PROIBITIVO'}
            </div>
            {isFunctionallyOperable
              ? 'I valori residui previsti ppo-FEV1 e ppo-DLCO superano la soglia di sicurezza del 30-40%: l\'intervento di resezione polmonare programmato è sicuro (se tra 30% e 40% o borderline, completare con CPET / VO2 max).'
              : 'I valori residui previsti scendono sotto il cut-off del 30%: rischio elevato di insufficienza respiratoria post-operatoria. Indicato test da sforzo cardiopolmonare (CPET con VO2 max > 10-15 mL/kg/min) o approccio parenchima-sparing (Segmentectomia / SBRT stereotassica).'}
          </div>
        </div>
      </div>
    </div>
  );
};
