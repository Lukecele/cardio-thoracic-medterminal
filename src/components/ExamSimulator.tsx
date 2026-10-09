import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RefreshCw, HelpCircle, ArrowRight, ArrowLeft, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import questionsData from '../data/questions.json';

interface Props {
  initialQuestionId?: string | null;
}

export const ExamSimulator: React.FC<Props> = ({ initialQuestionId }) => {
  const [selectedSystem, setSelectedSystem] = useState<'all' | 'cardio' | 'pneumo' | 'vascolare'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showExplanation, setShowExplanation] = useState<{ [key: string]: boolean }>({});
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

  // Filter questions based on system
  const filteredQuestions = questionsData.filter((q) => {
    if (initialQuestionId) return q.id === initialQuestionId;
    if (selectedSystem === 'all') return true;
    return q.system === selectedSystem;
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (optionLabel: string) => {
    if (showExplanation[currentQ.id]) return; // already revealed

    const newAnswers = { ...selectedAnswers, [currentQ.id]: optionLabel };
    setSelectedAnswers(newAnswers);
    setShowExplanation({ ...showExplanation, [currentQ.id]: true });

    if (optionLabel !== currentQ.correctAnswer) {
      if (!wrongAnswers.includes(currentQ.id)) {
        setWrongAnswers([...wrongAnswers, currentQ.id]);
      }
    }
  };

  const calculateScore = () => {
    let correct = 0;
    filteredQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleFinishExam = () => {
    setIsExamCompleted(true);
    const score = calculateScore();
    const ratio = score / filteredQuestions.length;
    if (ratio >= 0.8) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setIsExamCompleted(false);
    setCurrentIndex(0);
    setWrongAnswers([]);
  };

  if (!currentQ) {
    return <div className="text-slate-400 p-6">Nessuna domanda disponibile per questo filtro.</div>;
  }

  const score = calculateScore();
  const isAnswered = !!showExplanation[currentQ.id];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-mono font-bold uppercase tracking-wider text-slate-100">
              Exam Simulator & Question Bank (Database Scritti)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Banca dati ufficiale degli appelli d'esame con spiegazioni cliniche dettagliate.
          </p>
        </div>

        {/* Filter by system */}
        <div className="flex items-center space-x-2">
          {(['all', 'cardio', 'pneumo', 'vascolare'] as const).map((sys) => (
            <button
              key={sys}
              onClick={() => {
                setSelectedSystem(sys);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition border ${
                selectedSystem === sys
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              {sys === 'all' ? 'Tutte' : sys.toUpperCase()}
            </button>
          ))}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            title="Azzera test"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExamCompleted ? (
        /* Result Screen */
        <div className="text-center py-8 space-y-4">
          <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
            <Award className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-white">Simulazione Completata!</h3>
          <div className="text-4xl font-mono font-bold text-emerald-300">
            {score} / {filteredQuestions.length}
          </div>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {score / filteredQuestions.length >= 0.6
              ? 'Esame Superato! Ottima padronanza dei criteri clinici e delle domande ricorrenti.'
              : 'Ripassa gli argomenti critici con le dispense 2FAST prima del prossimo tentativo.'}
          </p>

          <div className="pt-4 flex justify-center space-x-4">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition"
            >
              Riprova Tutto il Test
            </button>
            <button
              onClick={() => {
                setIsExamCompleted(false);
                setCurrentIndex(0);
              }}
              className="px-5 py-2.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-700 transition"
            >
              Rivedi le Risposte
            </button>
          </div>
        </div>
      ) : (
        /* Question Card */
        <div className="space-y-5">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>
              Quesito {currentIndex + 1} di {filteredQuestions.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-400 font-bold">Corrette: {score}</span>
              <span>•</span>
              <span className="text-rose-400 font-bold">Errori: {wrongAnswers.length}</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Topic & Stem */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40 font-semibold">
                {currentQ.topic}
              </span>
              <span className="text-[11px] font-mono text-slate-500">{currentQ.session}</span>
            </div>
            <h3 className="text-base font-medium text-slate-100 leading-relaxed mt-2">{currentQ.question}</h3>
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.label;
              const isOptionCorrect = opt.label === currentQ.correctAnswer;

              let optionStyle =
                'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300';

              if (isAnswered) {
                if (isOptionCorrect) {
                  optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-medium';
                } else if (isSelected && !isOptionCorrect) {
                  optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 font-medium';
                } else {
                  optionStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
                }
              }

              return (
                <div
                  key={opt.label}
                  onClick={() => handleSelectOption(opt.label)}
                  className={`p-3.5 rounded-lg border transition cursor-pointer flex items-center justify-between ${optionStyle}`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-md bg-slate-800/80 flex items-center justify-center font-mono text-xs font-bold text-slate-300 flex-shrink-0 mt-0.5">
                      {opt.label.toUpperCase()}
                    </span>
                    <span className="text-xs leading-relaxed">{opt.text}</span>
                  </div>

                  {isAnswered && (
                    <div className="ml-3 flex-shrink-0">
                      {isOptionCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {isSelected && !isOptionCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Clinical Rationale Box (Revealed upon selection) */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-700/80 mt-4 animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 text-cyan-400 mb-1.5">
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs font-mono uppercase font-bold tracking-wider">
                  Razionale Clinico & Linee Guida (2FAST)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Bottom Navigation Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:text-white disabled:opacity-40 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Precedente</span>
            </button>

            {currentIndex < filteredQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-xs font-mono text-cyan-300 hover:bg-cyan-500/30 transition"
              >
                <span>Successiva</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishExam}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-emerald-500 text-xs font-mono font-bold text-slate-950 hover:bg-emerald-400 transition"
              >
                <span>Concludi e Calcola Voto</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
