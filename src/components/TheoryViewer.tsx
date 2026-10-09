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
  Bookmark,
  X,
  BookOpen,
  Coffee,
  Lightbulb
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
  const [activeDigestTab, setActiveDigestTab] = useState<'points' | 'traps' | 'tools'>('points');

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
        Nessun dato teorico trovato.
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
      if (filterSearch.trim().length >= 2) {
        const qClean = filterSearch.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${qClean})`, 'gi');
        const parts = paragraph.split(regex);
        return (
          <span>
            {parts.map((part, i) =>
              regex.test(part) ? (
                <mark key={i} className="bg-cyan-500/30 text-cyan-200 px-0.5 rounded font-semibold">
                  {part}
                </mark>
              ) : (
                part
              )
            )}
          </span>
        );
      }
      return <span>{paragraph}</span>;
    }

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
            if (filterSearch.trim().length >= 2) {
              const qClean = filterSearch.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const sRegex = new RegExp(`(${qClean})`, 'gi');
              const sParts = part.split(sRegex);
              sParts.forEach((sp, spIdx) => {
                if (sRegex.test(sp)) {
                  newFragments.push(
                    <mark key={`m-${tokenIdx}-${i}-${spIdx}`} className="bg-cyan-500/30 text-cyan-200 px-0.5 rounded font-semibold">
                      {sp}
                    </mark>
                  );
                } else {
                  newFragments.push(sp);
                }
              });
            } else {
              newFragments.push(part);
            }
          }
        });
      });

      fragments = newFragments;
    });

    return <>{fragments}</>;
  };

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

  const totalFilteredMatches = useMemo(() => {
    if (!filterSearch.trim()) return 0;
    const q = filterSearch.toLowerCase().trim();
    let count = 0;
    if (currentTopic.sections && currentTopic.sections.length > 0) {
      for (const sec of currentTopic.sections) {
        const paras = (sec.content || '').split('\n').map((p: string) => p.trim()).filter((p: string) => p.length > 0);
        for (const p of paras) {
          if (p.toLowerCase().includes(q)) count++;
        }
      }
    } else if (paragraphs) {
      for (const p of paragraphs) {
        if (p.toLowerCase().includes(q)) count++;
      }
    }
    return count;
  }, [filterSearch, currentTopic, paragraphs]);

  const lt = currentTopic.linkedTools || {};
  const hasLinkedTools = Boolean(
    (lt.quizIds && lt.quizIds.length > 0) ||
    lt.oralStationId ||
    lt.specialistTool ||
    lt.calculatorId ||
    lt.audioKey ||
    lt.anatomy3dTarget
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* 1. DISCRETE, CALM NAVIGATION: MODULES & TOPICS */}
      <div className="bg-[#0b101c]/90 border border-slate-800/80 rounded-2xl p-3 sm:p-4 shadow-sm">
        {/* Module Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 custom-scrollbar">
          {theoryData.modules.map((m: any) => {
            const isSelectedMod = currentModule.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectTopic?.(m.topics[0]?.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  isSelectedMod
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>

        {/* Topic Pills for active module */}
        <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {currentModule.topics.map((t: any) => {
            const isSelected = currentTopic.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTopic?.(t.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs transition border shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/35 text-cyan-200 font-semibold'
                    : 'bg-slate-900/50 border-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {t.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CHAPTER HERO BANNER (RELAXED & INFORMATIVE) */}
      <div className="bg-[#0c1220] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {currentTopic.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentTopic.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentTopic.title}
            </h1>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Basi teoriche tratte dai PDF di <strong>Lorenzo Pessetti</strong> • Sviluppato da <strong>Luca Celebrano</strong></span>
            </p>
          </div>

          {/* Active Recall Switch */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => {
                setActiveRecallMode(!activeRecallMode);
                if (!activeRecallMode) hideAllClozes();
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                activeRecallMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Active Recall {activeRecallMode ? 'Attivo' : 'Spento'}</span>
            </button>
          </div>
        </div>

        {activeRecallMode && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-300">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Concetti chiave, cut-off e dosaggi sono oscurati. Cliccaci sopra per verificare se li ricordi!
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={revealAllClozes}
                className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold transition text-[11px]"
              >
                Rivela Tutti
              </button>
              <button
                onClick={hideAllClozes}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition text-[11px]"
              >
                Nascondi Tutti
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. CALM HIGH-YIELD DIGEST CARD (IL SUCCO PER MENTI PIGRE E INTELLIGENTI) */}
      <div className="bg-[#0b101c] border border-slate-800/80 rounded-2xl p-5 shadow-md">
        
        {/* Tab Switcher: Points vs Traps vs Linked Tools */}
        <div className="flex items-center justify-between border-b border-slate-800/70 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDigestTab('points')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeDigestTab === 'points'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
              <span>4 Punti Cardine d'Esame</span>
            </button>

            {currentTopic.examTraps && currentTopic.examTraps.length > 0 && (
              <button
                onClick={() => setActiveDigestTab('traps')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeDigestTab === 'traps'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Trabocchetti Docenti ({currentTopic.examTraps.length})</span>
              </button>
            )}

            {hasLinkedTools && (
              <button
                onClick={() => setActiveDigestTab('tools')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeDigestTab === 'tools'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quiz & Strumenti Collegati</span>
              </button>
            )}
          </div>

          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Focus Esame Orale & Scritto
          </span>
        </div>

        {/* Tab 1: 4 High-Yield Quadrants */}
        {activeDigestTab === 'points' && currentTopic.highYieldSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>1. Definizione & Fisiopatologia</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentTopic.highYieldSummary.definizione}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>2. Segni Cardine & Semeiotica</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentTopic.highYieldSummary.segniCardine}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>3. Diagnostica & Valori Soglia (Cut-off)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentTopic.highYieldSummary.diagnostica}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>4. Terapia di Prima Linea</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentTopic.highYieldSummary.terapia}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Exam Traps */}
        {activeDigestTab === 'traps' && currentTopic.examTraps && (
          <div className="space-y-2.5">
            <div className="text-xs text-amber-300/90 mb-2">
              Errori frequenti e concetti ingannevoli segnalati dai docenti:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {currentTopic.examTraps.map((trap: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed"
                >
                  <span className="text-amber-400 font-bold shrink-0">⚠</span>
                  <span>{trap}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Connected Tools */}
        {activeDigestTab === 'tools' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {lt.quizIds && lt.quizIds.length > 0 && (
              <button
                onClick={() => onOpenQuestion?.(lt.quizIds[0])}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-yellow-500/40 text-left transition flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-yellow-300">Quiz Database Scritti</div>
                  <div className="text-[10px] text-slate-400">{lt.quizIds.length} domande</div>
                </div>
              </button>
            )}

            {lt.oralStationId && (
              <button
                onClick={() => onOpenOralStation?.(lt.oralStationId)}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-300">Simulatore Orale</div>
                  <div className="text-[10px] text-slate-400">Stazione #{lt.oralStationId}</div>
                </div>
              </button>
            )}

            {lt.audioKey && (
              <button
                onClick={() => onOpenAudio?.(lt.audioKey)}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-left transition flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-300">Auscultazione Audio</div>
                  <div className="text-[10px] text-slate-400 font-mono">{lt.audioKey}</div>
                </div>
              </button>
            )}

            {lt.anatomy3dTarget && (
              <button
                onClick={() => onFocus3D?.(lt.anatomy3dTarget)}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-left transition flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-300">Atlante 3D & HD</div>
                  <div className="text-[10px] text-slate-400 font-mono">{lt.anatomy3dTarget}</div>
                </div>
              </button>
            )}

            {lt.calculatorId && (
              <button
                onClick={() => onOpenCalculator?.(lt.calculatorId)}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-left transition flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-teal-300">Calcolatore Score</div>
                  <div className="text-[10px] text-slate-400 font-mono">{lt.calculatorId}</div>
                </div>
              </button>
            )}

            {lt.specialistTool && (
              <button
                onClick={() => onOpenSpecialistTool?.(lt.specialistTool)}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300">Strumento Specialistico</div>
                  <div className="text-[10px] text-slate-400 font-mono">{lt.specialistTool}</div>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4. CHAPTER TEXT BODY (COMFORTABLE READING, NO EYE STRAIN) */}
      <div className="bg-[#0b101c] border border-slate-800/80 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header with Search and Table of contents */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/70 gap-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Trattazione Completa del Capitolo
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Filtra nel testo..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-7 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              {filterSearch && (
                <button
                  onClick={() => setFilterSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
                  title="Azzera"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            {filterSearch.trim() && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {totalFilteredMatches}
              </span>
            )}
          </div>
        </div>

        {/* Quick-Jump Table of Contents (Discrete chips) */}
        {currentTopic.sections && currentTopic.sections.length > 1 && (
          <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3">
            <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
              <Bookmark className="w-3 h-3 text-cyan-400" />
              <span>Indice Rapido Paragrafi</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentTopic.sections.map((sec: any, sIdx: number) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    const el = document.getElementById(sec.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition flex items-center gap-1.5"
                >
                  <span className="text-cyan-400 font-mono text-[10px]">{sIdx + 1}.</span>
                  <span>{sec.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sections Content */}
        {filterSearch.trim() && totalFilteredMatches === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-slate-300">
              Nessun riscontro per "{filterSearch}"
            </p>
            <button
              onClick={() => setFilterSearch('')}
              className="text-xs text-cyan-400 hover:underline font-mono"
            >
              Azzera filtro
            </button>
          </div>
        ) : currentTopic.sections && currentTopic.sections.length > 0 ? (
          <div className="space-y-8">
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
                  className="scroll-mt-24 space-y-3 pt-4 first:pt-0 border-t first:border-t-0 border-slate-800/60"
                >
                  {/* Section Title */}
                  <div className="flex items-center gap-2 pb-1.5">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      § {sIdx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {sec.title}
                    </h3>
                  </div>

                  {/* Paragraphs with calm leading and soft contrast */}
                  <div className="space-y-2.5 text-sm sm:text-[15px] leading-[1.8] text-slate-300 font-sans">
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
                            className="pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono"
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
                            className="flex items-start gap-2.5 pl-2 text-slate-300"
                          >
                            <span className="text-cyan-400 text-xs mt-1 shrink-0">✦</span>
                            <div className="flex-1 leading-[1.8]">
                              {renderActiveRecallParagraph(bulletText, sIdx * 1000 + pIdx)}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <p
                          key={`p-${pIdx}`}
                          className="text-left leading-[1.8] text-slate-300 mb-2"
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
          <div className="space-y-3 text-sm sm:text-[15px] leading-[1.8] text-slate-300 font-sans">
            {filteredParagraphs.map((para: string, idx: number) => (
              <p key={idx} className="text-left leading-[1.8] mb-2">
                {renderActiveRecallParagraph(para, idx)}
              </p>
            ))}
          </div>
        )}

        {/* 5. EASTER EGG: GOLLUM E IL CUORE (PAUSA NOTTURNA DELLO STUDENTE) */}
        <div className="mt-12 pt-6 border-t border-slate-800/80">
          <div className="p-5 rounded-2xl bg-[#090d18] border border-slate-800/90 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-sm">
            <img
              src="/easter-eggs/gollum_cuore.jpg"
              alt="Gollum e il cuore"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-slate-700/80 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                <span>🌙 Pausa Studio Notturno • Monito di Gollum</span>
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-slate-100">
                « Non vede dove il cuore lo porta, quando il sole è calato e la luna è morta »
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Tipica reazione dello studente di medicina alle 03:45 di notte prima dell'appello di cardiologia: se inizi ad accarezzare il miocardio sul tablet chiamandolo "il mio tesssoro"... fai una pausa, bevi un goccio d'acqua e riposati!
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default TheoryViewer;
