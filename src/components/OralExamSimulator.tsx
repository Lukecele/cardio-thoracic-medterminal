import React, { useState } from 'react';
import { Stethoscope, User, AlertTriangle, ChevronRight, ChevronDown } from 'lucide-react';
import oralCasesData from '../data/oralCases.json';

interface OralExamSimulatorProps {
  initialStationId?: number | null;
}

export const OralExamSimulator: React.FC<OralExamSimulatorProps> = ({ initialStationId }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(() => {
    if (initialStationId && initialStationId >= 1 && initialStationId <= oralCasesData.length) {
      return oralCasesData[initialStationId - 1].id;
    }
    return oralCasesData[0].id;
  });
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});
  const [userAssessments, setUserAssessments] = useState<{ [key: string]: 'good' | 'ok' | 'bad' }>({});

  React.useEffect(() => {
    if (initialStationId && initialStationId >= 1 && initialStationId <= oralCasesData.length) {
      setSelectedCaseId(oralCasesData[initialStationId - 1].id);
    }
  }, [initialStationId]);

  const currentCase = oralCasesData.find(c => c.id === selectedCaseId) || oralCasesData[0];

  const toggleReveal = (idx: number) => {
    const key = `${currentCase.id}-${idx}`;
    setRevealedAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAssessment = (idx: number, status: 'good' | 'ok' | 'bad') => {
    const key = `${currentCase.id}-${idx}`;
    setUserAssessments(prev => ({ ...prev, [key]: status }));
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-mono font-bold uppercase tracking-wider text-slate-100">
              Simulatore Interrogazioni Orali (I 5 Orali Clinici)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulazione di casi clinici complessi dell'esame orale: ragionamento a step, domande del docente e trabocchetti mortali.
          </p>
        </div>

        {/* 5 Branches Pills */}
        <div className="flex flex-wrap gap-1.5">
          {oralCasesData.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition border ${
                selectedCaseId === c.id
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-md'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              {c.discipline}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Presentation Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-6">
        <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <User className="w-4 h-4" />
          <span>Vignetta Clinica & Presentazione del Paziente</span>
        </div>
        <h3 className="text-base font-bold text-white mb-2">{currentCase.title}</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">{currentCase.patient}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-mono text-cyan-400 font-semibold block mb-1">Parametri Vitali:</span>
            <span className="text-slate-300 font-mono">{currentCase.vitalSigns}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-mono text-amber-400 font-semibold block mb-1">Esame Obiettivo:</span>
            <span className="text-slate-300">{currentCase.physicalExam}</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Oral Interrogation */}
      <div className="space-y-4">
        <div className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
          Domande del Docente all'Orale:
        </div>

        {currentCase.oralQuestions.map((q, idx) => {
          const key = `${currentCase.id}-${idx}`;
          const isRevealed = !!revealedAnswers[key];
          const assessment = userAssessments[key];

          return (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden transition"
            >
              <div
                onClick={() => toggleReveal(idx)}
                className="p-4 cursor-pointer hover:bg-slate-900/50 flex items-start justify-between"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-md bg-purple-950/60 border border-purple-800/60 text-purple-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="text-sm font-semibold text-slate-200 leading-snug">{q.question}</div>
                </div>

                <div className="ml-3 text-slate-500">
                  {isRevealed ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </div>

              {isRevealed && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-3.5 bg-slate-950/90">
                  {/* Expected Answer */}
                  <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                    <span className="text-xs font-mono uppercase text-emerald-400 font-bold block mb-1">
                      Risposta Modello Attesa dal Docente (Linee Guida Ufficiali ESC / ERS / AHA):
                    </span>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">{q.expectedAnswer}</p>
                  </div>

                  {/* Fatal Trap */}
                  <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30">
                    <div className="flex items-center space-x-1.5 text-rose-400 font-mono text-xs font-bold mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>TRABOCCHETTO MORTALE (Cosa NON dire per non farsi bocciare):</span>
                    </div>
                    <p className="text-xs text-rose-200/90 leading-relaxed font-sans">{q.fatalTrap}</p>
                  </div>

                  {/* Self-Assessment buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="font-mono text-slate-400">Autovalutazione della tua risposta:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAssessment(idx, 'good')}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition border ${
                          assessment === 'good'
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-300'
                        }`}
                      >
                        Pronto (30)
                      </button>
                      <button
                        onClick={() => handleAssessment(idx, 'ok')}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition border ${
                          assessment === 'ok'
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-300'
                        }`}
                      >
                        Accettabile (24)
                      </button>
                      <button
                        onClick={() => handleAssessment(idx, 'bad')}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition border ${
                          assessment === 'bad'
                            ? 'bg-rose-500 text-white font-bold border-rose-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-300'
                        }`}
                      >
                        Da Rivedere (&lt;18)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
