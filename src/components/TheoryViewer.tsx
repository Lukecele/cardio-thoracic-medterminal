import React, { useState } from 'react';
import { BookOpen, AlertCircle, Video, Target, Eye, EyeOff, ExternalLink } from 'lucide-react';
import theoryData from '../data/theory.json';

interface Props {
  activeTopicId?: string;
  onSelectTopic?: (topicId: string) => void;
  onOpenQuestion?: (questionId: string) => void;
  onFocus3D?: (target: string) => void;
}

export const TheoryViewer: React.FC<Props> = ({
  activeTopicId = 'cardio-valvulopatie',
  onSelectTopic,
  onOpenQuestion,
  onFocus3D,
}) => {
  const [activeRecallMode, setActiveRecallMode] = useState<boolean>(false);
  const [revealedTokens, setRevealedTokens] = useState<{ [key: string]: boolean }>({});
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  // Flatten all topics across modules
  const allTopics = theoryData.modules.flatMap((m) =>
    m.topics.map((t) => ({ ...t, moduleName: m.name, moduleId: m.id }))
  );

  const currentTopic = allTopics.find((t) => t.id === activeTopicId) || allTopics[0];

  const toggleTokenReveal = (token: string) => {
    setRevealedTokens((prev) => ({
      ...prev,
      [token]: !prev[token],
    }));
  };

  // Helper to render text with cloze blur if active recall mode is on
  const renderInteractiveText = (text: string, tokens: string[]) => {
    if (!activeRecallMode || tokens.length === 0) {
      return (
        <div className="whitespace-pre-line text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
          {text}
        </div>
      );
    }
    return (
      <div className="whitespace-pre-line text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
        {text.split('\n').map((line, lineIdx) => {
          let lineParts: (string | React.ReactNode)[] = [line];

          tokens.forEach((token) => {
            const nextParts: (string | React.ReactNode)[] = [];
            lineParts.forEach((part) => {
              if (typeof part === 'string' && part.toLowerCase().includes(token.toLowerCase())) {
                const regex = new RegExp(`(${token})`, 'gi');
                const subParts = part.split(regex);
                subParts.forEach((sub, subIdx) => {
                  if (sub.toLowerCase() === token.toLowerCase()) {
                    const isRevealed = revealedTokens[token.toLowerCase()];
                    nextParts.push(
                      <span
                        key={`${lineIdx}-${subIdx}-${token}`}
                        onClick={() => toggleTokenReveal(token.toLowerCase())}
                        className={`inline-block mx-0.5 px-1.5 py-0.5 rounded cursor-pointer transition font-mono text-xs ${
                          isRevealed
                            ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50'
                            : 'bg-slate-700/80 text-transparent select-none blur-[4px] hover:blur-none border border-slate-600'
                        }`}
                        title="Clicca per svelare o nascondere"
                      >
                        {sub}
                      </span>
                    );
                  } else {
                    nextParts.push(sub);
                  }
                });
              } else {
                nextParts.push(part);
              }
            });
            lineParts = nextParts;
          });

          return <p key={lineIdx} className="mb-2">{lineParts}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-mono font-bold uppercase tracking-wider text-slate-100">
              Compendio 2FAST Integrale (Lorenzo Pessetti)
            </h2>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-slate-400">Modulo: {currentTopic.moduleName}</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-cyan-400 font-semibold">{currentTopic.category}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Active Recall Toggle */}
          <button
            onClick={() => setActiveRecallMode(!activeRecallMode)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition border ${
              activeRecallMode
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Sfoca parole e cut-off chiave per stimolare il richiamo attivo"
          >
            {activeRecallMode ? <EyeOff className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Active Recall: {activeRecallMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* 3D Focus Button */}
          {currentTopic.anatomy3dTarget && (
            <button
              onClick={() => onFocus3D && onFocus3D(currentTopic.anatomy3dTarget)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition"
            >
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Focus</span>
            </button>
          )}

          {/* Video Procedurale */}
          {currentTopic.videoEmbed && (
            <button
              onClick={() => setActiveVideoModal(currentTopic.videoEmbed)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-300 hover:bg-rose-500/30 text-xs font-mono transition"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Clip</span>
            </button>
          )}
        </div>
      </div>

      {/* Topic Switcher Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic && onSelectTopic(topic.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
              currentTopic.id === topic.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="space-y-6">
        {/* Title and "Spotted all'Esame" Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{currentTopic.title}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Trattazione clinica fedele al 100% alle dispense d'esame.</p>
          </div>

          {/* Linked Exam Questions Button */}
          {currentTopic.linkedQuestionIds && currentTopic.linkedQuestionIds.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-amber-400 font-semibold">
                🎯 {currentTopic.linkedQuestionIds.length} Quesiti d'Esame:
              </span>
              {currentTopic.linkedQuestionIds.map((qId) => (
                <button
                  key={qId}
                  onClick={() => onOpenQuestion && onOpenQuestion(qId)}
                  className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-mono font-semibold hover:bg-amber-500/30 transition flex items-center space-x-1"
                >
                  <span>Quiz {qId.replace('q-', '')}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* High-Yield Matrix (4 Quadranti) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1">
              Definizione & Fisiopatologia
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTopic.highYieldSummary.definizione}
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-amber-400 font-bold block mb-1">
              Segni Clinici & Semeiotica Cardine
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTopic.highYieldSummary.segniCardine}
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold block mb-1">
              Diagnostica Gold Standard & Cut-off
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTopic.highYieldSummary.diagnostica}
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-rose-400 font-bold block mb-1">
              Terapia di Prima Linea & Interventi
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTopic.highYieldSummary.terapia}
            </p>
          </div>
        </div>

        {/* Trabocchetti d'Esame Box */}
        {currentTopic.examTraps && currentTopic.examTraps.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40">
            <div className="flex items-center space-x-2 text-amber-400 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-mono uppercase font-bold tracking-wider">
                Trabocchetti Ricorrenti dei Docenti (Attenzione nei Quiz!)
              </span>
            </div>
            <div className="space-y-1.5">
              {currentTopic.examTraps.map((trap, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-amber-200/90 leading-relaxed">
                  <span className="text-amber-400 font-bold mt-0.5">&bull;</span>
                  <span>{trap}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trattazione Integrale 2FAST (Testo Completo) */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Testo Completo delle Dispense 2FAST
            </span>
            {activeRecallMode && (
              <span className="text-[11px] font-mono text-cyan-400">
                Modalità Sfida attiva: clicca sui campi sfocati per verificare la memoria
              </span>
            )}
          </div>
          {renderInteractiveText(currentTopic.fullText, currentTopic.clozeTokens || [])}
        </div>
      </div>

      {/* Video Modal (se aperto) */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-rose-400 font-mono text-sm font-semibold">
                <Video className="w-4 h-4" />
                <span>Video Procedura Didattica YouTube</span>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-slate-400 hover:text-white font-mono text-xs px-2 py-1 bg-slate-800 rounded"
              >
                Chiudi [ESC]
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoModal}?autoplay=1`}
                title="Procedural Clinical Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
