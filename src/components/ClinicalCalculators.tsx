import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export const ClinicalCalculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wells-pe' | 'curb65' | 'light' | 'abi'>('wells-pe');

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
      <div className="flex items-center space-x-2 mb-4 border-b border-slate-800 pb-3">
        <Calculator className="w-5 h-5 text-cyan-400" />
        <h2 className="text-base font-mono font-bold uppercase tracking-wider text-slate-200">
          Clinical Calculators & Diagnostic Scores
        </h2>
      </div>

      {/* Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'wells-pe', label: 'Score di Wells (EP)' },
          { id: 'curb65', label: 'CURB-65 (Polmoniti CAP)' },
          { id: 'light', label: 'Criteri di Light (Pleura)' },
          { id: 'abi', label: 'Calcolatore ABI (AOCP)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition border ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* WELLS PE */}
      {activeTab === 'wells-pe' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Stratificazione del rischio di Embolia Polmonare (Linee Guida ESC/AHA).
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
                  <span>EP Improbabile (≤ 4 pt) -&gt; Eseguire D-Dimero (se negativo, esclude EP)</span>
                </div>
              ) : (
                <div className="text-xs text-rose-400 font-semibold flex items-center justify-end space-x-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>EP Probabile (&gt; 4 pt) -&gt; Angio-TC Torace urgente (non attendere D-Dimero)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CURB-65 */}
      {activeTab === 'curb65' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Valutazione prognostica e orientamento al ricovero nella Polmonite Acquisita in Comunità (CAP).
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {[
              { key: 'confusion', label: 'C - Confusione mentale di nuova insorgenza' },
              { key: 'urea', label: 'U - Urea sierica > 7 mmol/L (o azotemia elevata)' },
              { key: 'respRate', label: 'R - Frequenza Respiratoria ≥ 30 atti/min' },
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
                  Rischio basso (Mortalità &lt; 1.5%) -&gt; Trattamento domiciliare con terapia orale
                </span>
              )}
              {getCurbScore() === 2 && (
                <span className="text-xs text-amber-400 font-semibold">
                  Rischio intermedio (Mortalità ~9%) -&gt; Considerare breve ricovero o osservazione breve
                </span>
              )}
              {getCurbScore() >= 3 && (
                <span className="text-xs text-rose-400 font-semibold">
                  Rischio elevato (Mortalità &gt; 20%) -&gt; Ricovero ospedaliero urgente / Valutazione Terapia Intensiva
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIGHT CRITERIA */}
      {activeTab === 'light' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
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
                    Processo infiammatorio, infettivo (polmonite, empiema, TBC) o neoplastico (mesotelioma, metastasi).
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm">Classificazione: TRASUDATO PLEURICO</div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Alterazione delle forze idrostatiche/oncotiche: Scompenso cardiaco congestizio, Cirrosi epatica con ascite, Sindrome nefrosica.
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
          <div className="text-xs text-slate-400">
            Calcolo Ankle-Brachial Index (Indice Caviglia-Braccio) per la diagnosi di AOCP.
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
                  AOCP Lieve (0.70 - 0.90): Stenosi emodinamicamente modesta
                </span>
              )}
              {numAbi >= 0.4 && numAbi < 0.7 && (
                <span className="text-xs text-orange-400 font-semibold">
                  AOCP Moderata (0.40 - 0.70): Tipica claudicatio intermittens
                </span>
              )}
              {numAbi < 0.4 && (
                <span className="text-xs text-rose-400 font-semibold">
                  AOCP Severa / Ischemia Critica (&lt; 0.40): Elevato rischio di perdita d'arto!
                </span>
              )}
              {numAbi > 1.3 && (
                <span className="text-xs text-purple-400 font-semibold">
                  Arterie Incomprimibili (&gt; 1.40): Calcificazione della media (tipico del diabetico)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
