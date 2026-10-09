import React, { useState } from 'react';
import { BrainCircuit, Eye, ExternalLink, AlertCircle, PlayCircle, Video } from 'lucide-react';
import theoryDataRaw from '../data/theory.json';

const theoryData = theoryDataRaw as any;

interface TheoryViewerProps {
  activeTopicId?: string | null;
  onSelectTopic?: (id: string) => void;
  onOpenQuestion?: (id: string) => void;
  onFocus3D?: (target: string) => void;
}

const TheoryViewer: React.FC<TheoryViewerProps> = ({
  activeTopicId,
  onSelectTopic,
  onOpenQuestion,
  onFocus3D,
}) => {
  const [activeRecallMode, setActiveRecallMode] = useState(false);
  const [revealedClozes, setRevealedClozes] = useState<Set<number>>(new Set());

  // Find current topic
  let currentTopic = null;
  let currentModule = null;

  if (activeTopicId) {
    for (const mod of theoryData.modules) {
      const topic = mod.topics.find((t: any) => t.id === activeTopicId);
      if (topic) {
        currentTopic = topic;
        currentModule = mod;
        break;
      }
    }
  }

  if (!currentTopic && theoryData.modules?.length > 0) {
    currentModule = theoryData.modules[0];
    currentTopic = currentModule.topics[0];
  }

  if (!currentTopic) {
    return <div className="p-8 text-slate-500">Nessun dato teorico disponibile. Esegui lo script di ingestione dati.</div>;
  }

  const renderInteractiveText = (text: string, tokens: string[]) => {
    if (!text) return null;
    
    // Convert newlines to paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');

    return (
      <div className="space-y-4 text-[15px] leading-relaxed text-slate-700">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-justify">
            {para}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            {currentModule.name}
          </h2>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">{currentTopic.title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveRecallMode(!activeRecallMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm border ${
              activeRecallMode
                ? 'bg-blue-600 border-blue-700 text-white shadow-blue-200'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Active Recall</span>
          </button>
          
          {currentTopic.anatomy3dTarget && (
            <button
              onClick={() => onFocus3D?.(currentTopic.anatomy3dTarget)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
            >
              <Eye className="w-4 h-4 text-emerald-500" />
              <span>Vedi in 3D</span>
            </button>
          )}
        </div>
      </div>

      {/* Module/Topic Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {theoryData.modules.map((m: any) => (
            <button
              key={m.id}
              onClick={() => onSelectTopic?.(m.topics[0]?.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                currentModule.id === m.id
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {currentModule.topics.map((topic: any) => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic?.(topic.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm transition-all border ${
                currentTopic.id === topic.id
                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                  : 'bg-white border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {topic.title.substring(0, 30)}{topic.title.length > 30 ? '...' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-8">
        
        {/* High Yield Summary (If available) */}
        {currentTopic.highYieldSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-blue-500 uppercase mb-2">Definizione & Fisiopatologia</h3>
              <p className="text-sm text-slate-600">{currentTopic.highYieldSummary.definizione}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-amber-500 uppercase mb-2">Segni & Semeiotica</h3>
              <p className="text-sm text-slate-600">{currentTopic.highYieldSummary.segniCardine}</p>
            </div>
          </div>
        )}

        {/* Traps */}
        {currentTopic.examTraps && currentTopic.examTraps.length > 0 && (
          <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-600 mb-3">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Trabocchetti d'Esame</h3>
            </div>
            <ul className="space-y-2">
              {currentTopic.examTraps.map((trap: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2 text-sm text-amber-800">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <span>{trap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Full Text */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Trattazione Completa Dispense</h3>
            {activeRecallMode && (
              <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded">
                Modalità Memoria Attiva
              </span>
            )}
          </div>
          {renderInteractiveText(currentTopic.fullText, currentTopic.clozeTokens || [])}
        </div>
      </div>
    </div>
  );
};

export default TheoryViewer;
