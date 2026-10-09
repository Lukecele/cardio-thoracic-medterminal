import React, { useState, useMemo } from 'react';
import {
  BrainCircuit,
  Eye,
  AlertTriangle,
  Volume2,
  Trophy,
  Stethoscope,
  Calculator,
  Activity,
  Wind,
  Droplets,
  Network,
  Pill,
  ImageIcon,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  FileText,
  Bookmark
} from 'lucide-react';
import theoryDataRaw from '../data/theory.json';

const theoryData = theoryDataRaw as any;

interface TheoryViewerProps {
  activeTopicId?: string | null;
  onSelectTopic?: (id: string) => void;
  onOpenQuestion?: (id: string) => void;
  onOpenOralStation?: (stationId: number) => void;
  onOpenCalculator?: (calcId: string) => void;
  onOpenSpecialistTool?: (toolId: string) => void;
  onOpenAudio?: (trackId: string) => void;
  onFocus3D?: (target: string) => void;
}

export const TheoryViewer: React.FC<TheoryViewerProps> = ({
  activeTopicId,
  onSelectTopic,
  onOpenQuestion,
  onOpenOralStation,
  onOpenCalculator,
  onOpenSpecialistTool,
  onOpenAudio,
  onFocus3D,
}) => {
  const [activeRecallMode, setActiveRecallMode] = useState(false);
  const [revealedClozes, setRevealedClozes] = useState<Set<number>>(new Set());
  const [filterSearch, setFilterSearch] = useState('');

  // Find current topic and module
  let currentTopic: any = null;
  let currentModule: any = null;

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
    return (
      <div className="p-12 text-center text-slate-500">
        Nessun dato teorico trovato. Esegui lo script di estrazione.
      </div>
    );
  }

  // Cloze tokens matching & Active Recall text renderer
  const clozeTokens = useMemo(() => {
    return currentTopic.clozeTokens || [];
  }, [currentTopic]);

  const toggleCloze = (idx: number) => {
    setRevealedClozes(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const revealAllClozes = () => {
    const all = new Set<number>();
    clozeTokens.forEach((_: string, i: number) => all.add(i));
    setRevealedClozes(all);
  };

  const hideAllClozes = () => {
    setRevealedClozes(new Set());
  };

  const renderActiveRecallParagraph = (paragraph: string, pIdx: number) => {
    if (!activeRecallMode || clozeTokens.length === 0) {
      return <span>{paragraph}</span>;
    }

    // Split text by occurrences of cloze tokens
    let fragments: React.ReactNode[] = [paragraph];

    clozeTokens.forEach((token: string, tokenIdx: number) => {
      if (!token || token.length < 3) return;
      
      const newFragments: React.ReactNode[] = [];
      const regex = new RegExp(`(${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

      fragments.forEach((frag) => {
        if (typeof frag !== 'string') {
          newFragments.push(frag);
          return;
        }

        const parts = frag.split(regex);
        parts.forEach((part, i) => {
          if (part.toLowerCase() === token.toLowerCase()) {
            const clozeKey = pIdx * 100 + tokenIdx * 10 + i;
            const isRevealed = revealedClozes.has(clozeKey);

            newFragments.push(
              <button
                key={`cloze-${clozeKey}`}
                onClick={() => toggleCloze(clozeKey)}
                className={`inline-flex items-center px-2 py-0.5 mx-1 my-0.5 rounded text-xs font-mono font-bold transition-all shadow-sm ${
                  isRevealed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 cursor-pointer animate-pulse'
                }`}
                title={isRevealed ? 'Clicca per nascondere' : 'Clicca per verificare'}
              >
                {isRevealed ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400 inline" />
                    {part}
                  </>
                ) : (
                  <span>[ ? ] CLICCA PER RIVELARE</span>
                )}
              </button>
            );
          } else {
            newFragments.push(part);
          }
        });
      });

      fragments = newFragments;
    });

    return <>{fragments}</>;
  };

  // Text formatting
  const paragraphs = useMemo(() => {
    if (!currentTopic.fullText) return [];
    return currentTopic.fullText
      .split('\n')
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);
  }, [currentTopic.fullText]);

  const filteredParagraphs = useMemo(() => {
    if (!filterSearch.trim()) return paragraphs;
    const q = filterSearch.toLowerCase();
    return paragraphs.filter((p: string) => p.toLowerCase().includes(q));
  }, [paragraphs, filterSearch]);

  const lt = currentTopic.linkedTools || {};

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* 1. TOP MODULE NAVIGATION (HORIZONTAL BADGES) */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            DISCIPLINE CURRICULARI (5 MODULI INTEGRATI)
          </span>
          <span className="text-[11px] font-mono text-cyan-400">
            COMPENDIO CLINICO INTEGRATO (LINEE GUIDA ESC / ERS / AHA)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {theoryData.modules.map((m: any) => {
            const isSelectedMod = currentModule.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectTopic?.(m.topics[0]?.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelectedMod
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg ring-1 ring-blue-500/30'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono uppercase font-bold text-blue-400">
                  {m.badge}
                </div>
                <div className="text-xs font-semibold truncate mt-0.5">
                  {m.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Topic Pill Switcher for current module */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {currentModule.topics.map((t: any) => {
            const isSelected = currentTopic.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTopic?.(t.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {t.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CHAPTER HEADER BANNER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase font-bold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {currentTopic.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentTopic.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentTopic.title}
            </h1>
          </div>

          {/* Active Recall Switch */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => {
                setActiveRecallMode(!activeRecallMode);
                if (!activeRecallMode) hideAllClozes();
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg border ${
                activeRecallMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-500/20'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700 hover:text-white'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Active Recall {activeRecallMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* If Active Recall is ON, show controls */}
        {activeRecallMode && (
          <div className="mt-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-300">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Modalità Memoria Attiva: i concetti chiave, cut-off e dosaggi sono oscurati. Cliccaci sopra per verificare se li ricordi!
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={revealAllClozes}
                className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold transition"
              >
                Rivela Tutti
              </button>
              <button
                onClick={hideAllClozes}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
              >
                Nascondi Tutti
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. STRICTLY RELEVANT INTERCONNECTIONS (CONTROL CENTER DOCK) */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Network className="w-4 h-4" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
              CENTRO DI CONTROLLO INTERATTIVO (STRUMENTI CLINICI CORRELATI)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Solo collegamenti strettamente pertinenti al capitolo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          
          {/* Linked Written Exam Quizzes */}
          {lt.quizIds && lt.quizIds.length > 0 && (
            <button
              onClick={() => onOpenQuestion?.(lt.quizIds[0])}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-950/20 text-left transition-all group flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 group-hover:bg-yellow-500/20 shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-yellow-300">Quiz Database Scritti</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {lt.quizIds.length} domande ufficiali d'esame
                </div>
              </div>
            </button>
          )}

          {/* Linked Oral Exam Station */}
          {lt.oralStationId && (
            <button
              onClick={() => onOpenOralStation?.(lt.oralStationId)}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-950/20 text-left transition-all group flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 shrink-0">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-purple-300">Simulatore Orale</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Stazione #{lt.oralStationId} col Professore
                </div>
              </div>
            </button>
          )}

          {/* Specialist Clinical Tools (ECG, PFR, EGA, TNM, Flowchart, Pharma, Imaging) */}
          {lt.specialistTool === 'ecg' && (
            <button
              onClick={() => onOpenSpecialistTool?.('ecg')}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-950/20 text-left transition-all group flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-emerald-300">Monitor ECG Vettoriale</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Analisi tracciati & quiz ritmo
                </div>
              </div>
            </button>
          )}

          {lt.specialistTool === 'pfr' && (
            <button
              onClick={() => onOpenSpecialistTool?.('pfr')}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-sky-500/30 hover:border-sky-500/60 hover:bg-sky-950/20 text-left transition-all group flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:bg-sky-500/20 shrink-0">
                <Wind className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-sky-300">PFR & Curva Flusso-Volume</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Tiffeneau & reversibilità Salbutamolo
                </div>
              </div>
            </button>
          )}

          {lt.specialistTool === 'tnm' && (
            <button
              onClick={() => onOpenSpecialistTool?.('tnm')}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-950/20 text-left transition-all group flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/20 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-amber-300">Stadiazione TNM & Operabilità</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  NSCLC 8ª Edizione & ppo-FEV1/DLCO
                </div>
              </div>
            </button>
          )}

          {lt.specialistTool === 'flowchart' && (
            <button
              onClick={() => onOpenSpecialistTool?.('flowcharts')}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-950/20 text-left transition-all group flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 shrink-0">
                <Network className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-blue-300">Algoritmo Decisionale</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Flowchart step-by-step
                </div>
              </div>
            </button>
          )}

          {lt.specialistTool === 'pharma' && (
            <button
              onClick={() => onOpenSpecialistTool?.('pharma')}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-950/20 text-left transition-all group flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500/20 shrink-0">
                <Pill className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-rose-300">Prontuario Farmacologico</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Dosaggi, antidoti e schemi
                </div>
              </div>
            </button>
          )}

          {lt.specialistTool === 'imaging' && (
            <button
              onClick={() => onOpenSpecialistTool?.('imaging')}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-950/20 text-left transition-all group flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500/20 shrink-0">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-indigo-300">Atlante Imaging Radiologico</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Segni RX, TC Torace e Angio-TC
                </div>
              </div>
            </button>
          )}

          {/* Calculator Link */}
          {lt.calculatorId && (
            <button
              onClick={() => onOpenCalculator?.(lt.calculatorId)}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-teal-500/30 hover:border-teal-500/60 hover:bg-teal-950/20 text-left transition-all group flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:bg-teal-500/20 shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-teal-300">Score Clinico Integrato</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  {lt.calculatorId.toUpperCase()}
                </div>
              </div>
            </button>
          )}

          {/* Real Audio Link */}
          {lt.audioKey && (
            <button
              onClick={() => onOpenAudio?.(lt.audioKey)}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-950/20 text-left transition-all group flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500/20 shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-rose-300">Ascolto Reperto Cardio-Toracico</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Traccia: {lt.audioKey}
                </div>
              </div>
            </button>
          )}

          {/* 3D Model Focus Link */}
          {lt.anatomy3dTarget && (
            <button
              onClick={() => onFocus3D?.(lt.anatomy3dTarget)}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-950/20 text-left transition-all group flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-blue-300">Atlante WebGL 3D</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Visualizza {lt.anatomy3dTarget.toUpperCase()}
                </div>
              </div>
            </button>
          )}

        </div>
      </div>

      {/* 4. THE 4 CLINICAL HIGH-YIELD QUADRANTS */}
      {currentTopic.highYieldSummary && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              I 4 QUADRANTI CLINICI AD ALTO RENDIMENTO
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Quadrant 1: Definition & Pathophysiology */}
            <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center space-x-2.5 text-blue-400 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  1. Definizione & Fisiopatologia
                </h4>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {currentTopic.highYieldSummary.definizione}
              </p>
            </div>

            {/* Quadrant 2: Cardinal Signs & Semiotics */}
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center space-x-2.5 text-amber-400 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  2. Segni Cardine & Semeiotica
                </h4>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {currentTopic.highYieldSummary.segniCardine}
              </p>
            </div>

            {/* Quadrant 3: Diagnostics & Cut-offs */}
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center space-x-2.5 text-emerald-400 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  3. Diagnostica & Valori Soglia (Cut-off)
                </h4>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {currentTopic.highYieldSummary.diagnostica}
              </p>
            </div>

            {/* Quadrant 4: First-Line Therapy */}
            <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center space-x-2.5 text-rose-400 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  4. Terapia di Prima Linea & Management
                </h4>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {currentTopic.highYieldSummary.terapia}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* 5. EXAM TRAPS BANNER (TRABOCCHETTI D'ESAME) */}
      {currentTopic.examTraps && currentTopic.examTraps.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center space-x-3 text-amber-400 mb-4">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
                TRABOCCHETTI FREQUENTI D'ESAME (ORALE & SCRITTO)
              </h3>
              <p className="text-xs text-amber-300/80">
                Errori tipici bocciati dai docenti delle 5 commissioni
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentTopic.examTraps.map((trap: string, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-500/20 flex items-start space-x-3"
              >
                <span className="text-amber-400 font-bold text-sm leading-none mt-1">⚠</span>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {trap}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. COMPLETE LOSSLESS TEXT SECTION */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Section Header with In-page search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
              TRATTAZIONE CLINICA COMPLETA & COMPENDIO INTEGRATO
            </h3>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filtra nel capitolo..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Quick-Jump Table of Contents (Indice dei Paragrafi) */}
        {currentTopic.sections && currentTopic.sections.length > 1 && (
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" /> Indice dei Paragrafi del Capitolo
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentTopic.sections.length} sezioni strutturate
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentTopic.sections.map((sec: any, sIdx: number) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    const el = document.getElementById(sec.id);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium transition flex items-center gap-2 group cursor-pointer"
                >
                  <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[10px] flex items-center justify-center font-bold">
                    {sIdx + 1}
                  </span>
                  <span className="truncate max-w-[280px]">{sec.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Structured Sections Body */}
        {currentTopic.sections && currentTopic.sections.length > 0 ? (
          <div className="space-y-10">
            {currentTopic.sections.map((sec: any, sIdx: number) => {
              const secParas = sec.content
                .split('\n')
                .map((p: string) => p.trim())
                .filter((p: string) => p.length > 0);

              const filteredSecParas = filterSearch.trim()
                ? secParas.filter((p: string) => p.toLowerCase().includes(filterSearch.toLowerCase()))
                : secParas;

              if (filterSearch.trim() && filteredSecParas.length === 0) return null;

              return (
                <div
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-24 space-y-4 pt-6 first:pt-2 border-t first:border-t-0 border-slate-800/80"
                >
                  {/* Section Header */}
                  <div className="flex flex-wrap items-center gap-2.5 pb-2 border-b border-slate-800/40">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[10px] font-bold tracking-wider">
                      PARAGRAFO {sIdx + 1} DI {currentTopic.sections.length}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {sec.title}
                    </h3>
                  </div>

                  {/* Section Paragraphs */}
                  <div className="space-y-3 text-sm sm:text-[15px] leading-relaxed text-slate-300 font-sans">
                    {filteredSecParas.map((para: string, pIdx: number) => {
                      const isBullet = para.startsWith('•') || para.startsWith('◦') || para.startsWith('‣') || para.startsWith('-');
                      const isSubheading = !isBullet && para.length < 90 && (
                        (para === para.toUpperCase() && para.replace(/[^A-Z]/g, '').length > 4) ||
                        para.endsWith(':') ||
                        para.includes('==')
                      );

                      if (isSubheading) {
                        return (
                          <div
                            key={`p-${pIdx}`}
                            className="pt-4 pb-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300/95 font-mono border-b border-slate-800/50"
                          >
                            {para}
                          </div>
                        );
                      }

                      if (isBullet) {
                        const bulletText = para.replace(/^[•◦‣-]\s*/, '');
                        return (
                          <div
                            key={`p-${pIdx}`}
                            className="flex items-start gap-2.5 pl-2 text-slate-200"
                          >
                            <span className="text-cyan-400 text-xs mt-1 shrink-0">✦</span>
                            <div className="flex-1 leading-relaxed">
                              {renderActiveRecallParagraph(bulletText, sIdx * 1000 + pIdx)}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <p
                          key={`p-${pIdx}`}
                          className="text-justify leading-relaxed"
                        >
                          {renderActiveRecallParagraph(para, sIdx * 1000 + pIdx)}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Fallback for flat paragraphs if no sections */
          <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-slate-300 font-sans">
            {filteredParagraphs.map((para: string, idx: number) => (
              <p key={idx} className="text-justify">
                {renderActiveRecallParagraph(para, idx)}
              </p>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

export default TheoryViewer;
