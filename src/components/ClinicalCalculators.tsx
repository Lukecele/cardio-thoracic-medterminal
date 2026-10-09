import React, { useState, useEffect } from 'react';
import { Calculator, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ClinicalCalculatorsProps {
  initialCalculatorId?: string | null;
}

export const ClinicalCalculators: React.FC<ClinicalCalculatorsProps> = ({ initialCalculatorId }) => {
  const [activeTab, setActiveTab] = useState<'cha2ds2-vasc' | 'euroscore-2' | 'curb65' | 'wells-pe' | 'wells-dvt' | 'light' | 'abi'>('cha2ds2-vasc');

  useEffect(() => {
    if (!initialCalculatorId) return;
    const lower = initialCalculatorId.toLowerCase();
    if (lower.includes('cha2ds2') || lower.includes('chads')) setActiveTab('cha2ds2-vasc');
    else if (lower.includes('euroscore')) setActiveTab('euroscore-2');
    else if (lower.includes('curb')) setActiveTab('curb65');
    else if (lower.includes('light')) setActiveTab('light');
    else if (lower.includes('abi')) setActiveTab('abi');
    else if (lower.includes('wells-dvt')) setActiveTab('wells-dvt');
    else if (lower.includes('wells')) setActiveTab('wells-pe');
  }, [initialCalculatorId]);

  // CHA2DS2-VASc
  const [chads, setChads] = useState({
    heartFailure: false, // 1
    hypertension: false, // 1
    age75: false, // 2
    diabetes: false, // 1
    stroke: false, // 2 (Stroke/TIA/tromboembolismo)
    vascularDisease: false, // 1 (IMA, PAD, placca aortica)
    age65: false, // 1 (65-74 anni)
    female: false, // 1 (sesso femminile)
  });

  const getChadsScore = () => {
    let score = 0;
    if (chads.heartFailure) score += 1;
    if (chads.hypertension) score += 1;
    if (chads.age75) score += 2;
    else if (chads.age65) score += 1;
    if (chads.diabetes) score += 1;
    if (chads.stroke) score += 2;
    if (chads.vascularDisease) score += 1;
    if (chads.female) score += 1;
    return score;
  };

  // EuroSCORE II
  const [euroscore, setEuroscore] = useState({
    age: 72,
    female: false,
    nyhaClass: 3,
    lvef: 40,
    urgent: false,
    criticalState: false,
    activeEndocarditis: false,
    pulmonaryHypertension: false,
  });

  const calcEuroscoreMortality = () => {
    let base = 1.2;
    if (euroscore.age > 70) base += (euroscore.age - 70) * 0.25;
    if (euroscore.female) base += 0.6;
    base += (euroscore.nyhaClass - 1) * 0.8;
    if (euroscore.lvef < 30) base += 2.5;
    else if (euroscore.lvef < 50) base += 1.0;
    if (euroscore.urgent) base += 3.2;
    if (euroscore.criticalState) base += 4.5;
    if (euroscore.activeEndocarditis) base += 2.8;
    if (euroscore.pulmonaryHypertension) base += 1.6;
    return Math.min(45, Math.max(0.8, base)).toFixed(1);
  };

  // Wells PE state
  const [wellsPE, setWellsPE] = useState({
    dvtSigns: false, // 3
    alternativeLessLikely: false, // 3
    tachycardia: false, // 1.5
    immobilization: false, // 1.5
    priorVTE: false, // 1.5
    hemoptysis: false, // 1
    cancer: false, // 1
  });

  const getWellsPEScore = () => {
    let score = 0;
    if (wellsPE.dvtSigns) score += 3;
    if (wellsPE.alternativeLessLikely) score += 3;
    if (wellsPE.tachycardia) score += 1.5;
    if (wellsPE.immobilization) score += 1.5;
    if (wellsPE.priorVTE) score += 1.5;
    if (wellsPE.hemoptysis) score += 1;
    if (wellsPE.cancer) score += 1;
    return score;
  };

  // Wells DVT state
  const [wellsDVT, setWellsDVT] = useState({
    activeCancer: false, // 1
    paralysisOrCast: false, // 1
    bedridden3Days: false, // 1
    localizedTenderness: false, // 1
    entireLegSwollen: false, // 1
    calfSwelling3cm: false, // 1
    pittingEdema: false, // 1
    collateralVeins: false, // 1
    previousDVT: false, // 1
    altDiagnosisLikely: false, // -2
  });

  const getWellsDVTScore = () => {
    let s = 0;
    if (wellsDVT.activeCancer) s += 1;
    if (wellsDVT.paralysisOrCast) s += 1;
    if (wellsDVT.bedridden3Days) s += 1;
    if (wellsDVT.localizedTenderness) s += 1;
    if (wellsDVT.entireLegSwollen) s += 1;
    if (wellsDVT.calfSwelling3cm) s += 1;
    if (wellsDVT.pittingEdema) s += 1;
    if (wellsDVT.collateralVeins) s += 1;
    if (wellsDVT.previousDVT) s += 1;
    if (wellsDVT.altDiagnosisLikely) s -= 2;
    return s;
  };

  // CURB-65 state
  const [curb, setCurb] = useState({
    confusion: false,
    urea: false,
    respRate: false,
    bloodPressure: false,
    age65: false,
  });

  const getCurbScore = () => {
    return Object.values(curb).filter(Boolean).length;
  };

  // Light Criteria state
  const [light, setLight] = useState({
    proteinRatio: false, // > 0.5
    ldhRatio: false, // > 0.6
    ldhUpperLimit: false, // > 2/3
  });

  // ABI calculator
  const [anklePressure, setAnklePressure] = useState<number>(110);
  const [brachialPressure, setBrachialPressure] = useState<number>(120);

  const abiValue = (anklePressure / (brachialPressure || 1)).toFixed(2);
  const numAbi = parseFloat(abiValue);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Calcolatori Clinici & Score Validati
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                LINEE GUIDA ESC / ERS / AHA
              </span>
            </h2>
            <p className="text-xs text-slate-400">Stratificazione del rischio tromboembolico, chirurgico, infettivo e vascolare</p>
          </div>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'cha2ds2-vasc', label: 'CHA2DS2-VASc (FA & DOAC)' },
          { id: 'euroscore-2', label: 'EuroSCORE II (Cardiochirurgia)' },
          { id: 'curb65', label: 'CURB-65 (Polmoniti CAP)' },
          { id: 'wells-pe', label: 'Score di Wells (Embolia Polmonare)' },
          { id: 'wells-dvt', label: 'Wells TVP (Trombosi Venosa)' },
          { id: 'light', label: 'Criteri di Light (Liquido Pleurico)' },
          { id: 'abi', label: 'Indice ABI (AOCP Arteriopatia)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition border ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CHA2DS2-VASc */}
      {activeTab === 'cha2ds2-vasc' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            Stratificazione del rischio tromboembolico nella Fibrillazione Atriale non valvolare per l'indicazione alla terapia anticoagulante orale con DOAC (Linee Guida ESC).
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {[
              { key: 'heartFailure', label: 'C - Scompenso cardiaco congestizio o FE < 40% (+1)' },
              { key: 'hypertension', label: 'H - Ipertensione arteriosa (o in terapia antiipertensiva) (+1)' },
              { key: 'age75', label: 'A2 - Età ≥ 75 anni (+2)' },
              { key: 'diabetes', label: 'D - Diabete Mellito (+1)' },
              { key: 'stroke', label: 'S2 - Pregresso Ictus, TIA o tromboembolismo arterioso (+2)' },
              { key: 'vascularDisease', label: 'V - Malattia vascolare (pregresso IMA, AOCP, placca aortica) (+1)' },
              { key: 'age65', label: 'A - Età tra 65 e 74 anni (+1)' },
              { key: 'female', label: 'Sc - Sesso Femminile (+1)' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition"
              >
                <input
                  type="checkbox"
                  checked={chads[item.key as keyof typeof chads]}
                  onChange={(e) =>
                    setChads({ ...chads, [item.key]: e.target.checked })
                  }
                  className="rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700 w-4 h-4"
                />
                <span className="text-xs text-slate-200">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400">Punteggio Totale CHA2DS2-VASc:</span>
              <div className="text-3xl font-mono font-bold text-cyan-300">{getChadsScore()} Punti</div>
            </div>
            <div className="text-left sm:text-right">
              {getChadsScore() === 0 ? (
                <div className="text-xs text-emerald-400 font-semibold flex items-center sm:justify-end space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Rischio basso: Nessuna terapia anticoagulante o antiaggregante raccomandata (Classe I)</span>
                </div>
              ) : getChadsScore() === 1 && !chads.female ? (
                <div className="text-xs text-amber-400 font-semibold flex items-center sm:justify-end space-x-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>1 punto (maschio): Terapia anticoagulante orale con DOAC da considerare (Classe IIa)</span>
                </div>
              ) : (
                <div className="text-xs text-rose-400 font-semibold flex items-center sm:justify-end space-x-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Score ≥ 2 (o ≥ 1 donna oltre al sesso): Terapia anticoagulante con DOAC RACCOMANDATA (Classe I)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EuroSCORE II */}
      {activeTab === 'euroscore-2' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            Valutazione del rischio di mortalità operatoria a 30 giorni in cardiochirurgia per la scelta tra chirurgia aperta (SAVR/CABG) e approccio transcatetere (TAVI).
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Età Paziente (Anni): {euroscore.age}</label>
                <input
                  type="range"
                  min="40"
                  max="95"
                  value={euroscore.age}
                  onChange={(e) => setEuroscore({ ...euroscore, age: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Frazione di Eiezione LV (%): {euroscore.lvef}%</label>
                <input
                  type="range"
                  min="15"
                  max="65"
                  step="5"
                  value={euroscore.lvef}
                  onChange={(e) => setEuroscore({ ...euroscore, lvef: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Classe Funzionale NYHA: Classe {euroscore.nyhaClass}</label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={euroscore.nyhaClass}
                  onChange={(e) => setEuroscore({ ...euroscore, nyhaClass: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              {[
                { key: 'female', label: 'Sesso Femminile' },
                { key: 'urgent', label: 'Intervento urgente / emergenza pre-operatoria' },
                { key: 'criticalState', label: 'Stato pre-operatorio critico (shock, IABP, ventilato)' },
                { key: 'activeEndocarditis', label: 'Endocardite infettiva in fase attiva' },
                { key: 'pulmonaryHypertension', label: 'Ipertensione polmonare moderata o severa (PAPs > 55)' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center space-x-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition"
                >
                  <input
                    type="checkbox"
                    checked={euroscore[item.key as keyof typeof euroscore] as boolean}
                    onChange={(e) =>
                      setEuroscore({ ...euroscore, [item.key]: e.target.checked })
                    }
                    className="rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700 w-4 h-4"
                  />
                  <span className="text-xs text-slate-200">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400">Mortalità Prevista EuroSCORE II:</span>
              <div className="text-3xl font-mono font-bold text-cyan-300">{calcEuroscoreMortality()}%</div>
            </div>
            <div className="text-left sm:text-right max-w-md">
              {parseFloat(calcEuroscoreMortality()) < 4 ? (
                <span className="text-xs text-emerald-400 font-semibold">
                  Basso Rischio Chirurgico (&lt; 4%): Paziente candidato ideale a SAVR convenzionale (chirurgia a cielo aperto)
                </span>
              ) : parseFloat(calcEuroscoreMortality()) <= 8 ? (
                <span className="text-xs text-amber-400 font-semibold">
                  Rischio Intermedio (4 - 8%): Discussione in Heart Team multidisciplinare per scelta tra SAVR e TAVI
                </span>
              ) : (
                <span className="text-xs text-rose-400 font-semibold">
                  Alto Rischio Chirurgico (&gt; 8%): Raccomandata TAVI transcatetere (approccio transfemorale mini-invasivo)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WELLS PE */}
      {activeTab === 'wells-pe' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            Stratificazione della probabilità clinica pre-test di Embolia Polmonare (Linee Guida ESC/AHA).
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {[
              { key: 'dvtSigns', label: 'Segni e sintomi clinici di TVP (+3)', val: 3 },
              { key: 'alternativeLessLikely', label: 'EP più probabile di diagnosi alternative (+3)', val: 3 },
              { key: 'tachycardia', label: 'Frequenza cardiaca > 100 bpm (+1.5)', val: 1.5 },
              { key: 'immobilization', label: 'Allettamento >3gg o chirurgia nelle 4 settimane (+1.5)', val: 1.5 },
              { key: 'priorVTE', label: 'Pregressa TVP o Embolia Polmonare accertata (+1.5)', val: 1.5 },
              { key: 'hemoptysis', label: 'Emottisi (+1.0)', val: 1 },
              { key: 'cancer', label: 'Neoplasia attiva / trattamento negli ultimi 6 mesi (+1.0)', val: 1 },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center space-x-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition"
              >
                <input
                  type="checkbox"
                  checked={wellsPE[item.key as keyof typeof wellsPE]}
                  onChange={(e) =>
                    setWellsPE({ ...wellsPE, [item.key]: e.target.checked })
                  }
                  className="rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700 w-4 h-4"
                />
                <span className="text-xs text-slate-200">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between mt-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400">Punteggio Totale Wells:</span>
              <div className="text-2xl font-mono font-bold text-cyan-300">{getWellsPEScore()} Punti</div>
            </div>
            <div className="text-right">
              {getWellsPEScore() <= 4 ? (
                <div className="text-xs text-emerald-400 font-semibold flex items-center justify-end space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>EP Improbabile (≤ 4 pt) -&gt; Dosare D-Dimero (se negativo esclude EP con NPV &gt;99%)</span>
                </div>
              ) : (
                <div className="text-xs text-rose-400 font-semibold flex items-center justify-end space-x-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>EP Probabile (&gt; 4 pt) -&gt; Angio-TC Torace con mdc urgente (non attendere D-Dimero)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WELLS DVT */}
      {activeTab === 'wells-dvt' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            Score di Wells per la Trombosi Venosa Profonda (TVP) degli arti inferiori.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {[
              { key: 'activeCancer', label: 'Neoplasia attiva / trattamento negli ultimi 6 mesi (+1)' },
              { key: 'paralysisOrCast', label: 'Paralisi, paresi o recente immobilizzazione gessata (+1)' },
              { key: 'bedridden3Days', label: 'Allettamento recente > 3 gg o chirurgia maggiore recente (+1)' },
              { key: 'localizedTenderness', label: 'Dolorabilità localizzata lungo il decorso del sistema venoso profondo (+1)' },
              { key: 'entireLegSwollen', label: 'Edema dell\'intero arto inferiore (+1)' },
              { key: 'calfSwelling3cm', label: 'Circonferenza polpaccio > 3 cm rispetto al controlaterale (a 10 cm sotto la tuberosità tibiale) (+1)' },
              { key: 'pittingEdema', label: 'Edema con fovea (pitting) prevalente nell\'arto sintomatico (+1)' },
              { key: 'collateralVeins', label: 'Vene superficiali collaterali visibili (non varicose) (+1)' },
              { key: 'previousDVT', label: 'Pregressa TVP documentata (+1)' },
              { key: 'altDiagnosisLikely', label: 'Diagnosi alternativa probabile quanto o più probabile della TVP (-2)' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center space-x-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition"
              >
                <input
                  type="checkbox"
                  checked={wellsDVT[item.key as keyof typeof wellsDVT]}
                  onChange={(e) =>
                    setWellsDVT({ ...wellsDVT, [item.key]: e.target.checked })
                  }
                  className="rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700 w-4 h-4"
                />
                <span className="text-xs text-slate-200">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between mt-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400">Score Wells TVP:</span>
              <div className="text-2xl font-mono font-bold text-cyan-300">{getWellsDVTScore()} Punti</div>
            </div>
            <div className="text-right">
              {getWellsDVTScore() < 2 ? (
                <div className="text-xs text-emerald-400 font-semibold flex items-center justify-end space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>TVP Improbabile (&lt; 2 pt): Eseguire D-Dimero; se negativo stop workup</span>
                </div>
              ) : (
                <div className="text-xs text-rose-400 font-semibold flex items-center justify-end space-x-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>TVP Probabile (≥ 2 pt): Eseguire EcoColorDoppler venoso arti inferiori (CUS)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CURB-65 */}
      {activeTab === 'curb65' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            Valutazione prognostica e orientamento al setting di cura (domicilio vs reparto vs UTI) nella Polmonite Acquisita in Comunità (CAP).
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {[
              { key: 'confusion', label: 'C - Confusione mentale di nuova insorgenza (disorientamento T/S)' },
              { key: 'urea', label: 'U - Urea sierica > 7 mmol/L (azotemia > 42 mg/dL o BUN > 20)' },
              { key: 'respRate', label: 'R - Frequenza Respiratoria ≥ 30 atti/min (tachipnea severa)' },
              { key: 'bloodPressure', label: 'B - Pressione arteriosa (PAS < 90 o PAD ≤ 60 mmHg)' },
              { key: 'age65', label: '65 - Età anagrafica ≥ 65 anni' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center space-x-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition"
              >
                <input
                  type="checkbox"
                  checked={curb[item.key as keyof typeof curb]}
                  onChange={(e) => setCurb({ ...curb, [item.key]: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700 w-4 h-4"
                />
                <span className="text-xs text-slate-200">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between mt-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400">Punteggio CURB-65:</span>
              <div className="text-2xl font-mono font-bold text-amber-300">{getCurbScore()} / 5</div>
            </div>
            <div className="text-right">
              {getCurbScore() <= 1 && (
                <span className="text-xs text-emerald-400 font-semibold">
                  Rischio basso (Mortalità &lt; 1.5%) -&gt; Gestione domiciliare con antibiotici orali (Amoxi/Clav o Claritromicina)
                </span>
              )}
              {getCurbScore() === 2 && (
                <span className="text-xs text-amber-400 font-semibold">
                  Rischio intermedio (Mortalità ~9%) -&gt; Valutare ricovero in degenza ordinaria / OBI
                </span>
              )}
              {getCurbScore() >= 3 && (
                <span className="text-xs text-rose-400 font-semibold">
                  Rischio elevato (Mortalità &gt; 22%) -&gt; Ricovero ospedaliero immediato / Valutare Terapia Intensiva (ICU)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIGHT CRITERIA */}
      {activeTab === 'light' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            Differenziazione tra Trasudato ed Essudato pleurico (Sensibilità &gt; 98%).
          </div>
          <div className="space-y-2.5">
            {[
              {
                key: 'proteinRatio',
                label: 'Rapporto Proteine Liquido Pleurico / Sieriche > 0.5',
              },
              {
                key: 'ldhRatio',
                label: 'Rapporto LDH Liquido Pleurico / Sierico > 0.6',
              },
              {
                key: 'ldhUpperLimit',
                label: 'LDH Liquido Pleurico > 2/3 del limite superiore della norma sierica (> 200 U/L)',
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center space-x-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition"
              >
                <input
                  type="checkbox"
                  checked={light[item.key as keyof typeof light]}
                  onChange={(e) => setLight({ ...light, [item.key]: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700 w-4 h-4"
                />
                <span className="text-xs text-slate-200">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mt-4">
            {Object.values(light).some(Boolean) ? (
              <div className="flex items-center space-x-3 text-rose-400">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm">Classificazione: ESSUDATO PLEURICO</div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Processo infiammatorio, infettivo (polmonite batterica/parapneumonico, empiema, TBC) o neoplastico (mesotelioma, metastasi).
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm">Classificazione: TRASUDATO PLEURICO</div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Alterazione delle forze idrostatiche/oncotiche: Scompenso cardiaco congestizio, Cirrosi epatica ascitica, Sindrome nefrosica.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABI CALCULATOR */}
      {activeTab === 'abi' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            Calcolo Ankle-Brachial Index (Indice Caviglia-Braccio) per la diagnosi di Arteriopatia Obliterante Periferica (AOCP).
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-300 mb-1 block">
                Pressione Sistolica alla Caviglia (mmHg):
              </label>
              <input
                type="number"
                value={anklePressure}
                onChange={(e) => setAnklePressure(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white font-mono focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-300 mb-1 block">
                Pressione Sistolica al Braccio (mmHg):
              </label>
              <input
                type="number"
                value={brachialPressure}
                onChange={(e) => setBrachialPressure(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white font-mono focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between mt-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400">Indice ABI Calcolato:</span>
              <div className="text-3xl font-mono font-bold text-cyan-300">{abiValue}</div>
            </div>
            <div className="text-right max-w-xs">
              {numAbi >= 0.91 && numAbi <= 1.3 && (
                <span className="text-xs text-emerald-400 font-semibold">
                  Normale (0.91 - 1.30): Circolazione arteriosa conservata
                </span>
              )}
              {numAbi >= 0.7 && numAbi <= 0.9 && (
                <span className="text-xs text-amber-400 font-semibold">
                  AOCP Lieve (0.70 - 0.90): Stadio I-IIa Leriche-Fontaine
                </span>
              )}
              {numAbi >= 0.4 && numAbi < 0.7 && (
                <span className="text-xs text-orange-400 font-semibold">
                  AOCP Moderata (0.40 - 0.70): Claudicatio intermittens IIb
                </span>
              )}
              {numAbi < 0.4 && (
                <span className="text-xs text-rose-400 font-semibold">
                  AOCP Severa / Ischemia Critica (&lt; 0.40): Stadio III-IV (dolore a riposo/lesioni trofiche)
                </span>
              )}
              {numAbi > 1.3 && (
                <span className="text-xs text-purple-400 font-semibold">
                  Arterie Incomprimibili (&gt; 1.40): Monckeberg mediasclerosi (paziente diabetico)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClinicalCalculators;
