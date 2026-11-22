import React, { useState, useMemo, useEffect } from 'react';
import {
  BrainCircuit,
  Eye,
  AlertTriangle,
  Volume2,
  Trophy,
  Stethoscope,
  Calculator,
  Activity,
  Network,
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
  Bookmark,
  X,
  BookOpen,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Type,
  ArrowUpRight
} from 'lucide-react';
import theoryDataRaw from '../data/theory.json';
import oralCasesData from '../data/oralCases.json';

const theoryData = theoryDataRaw as any;

const TOOL_LABELS: Record<string, string> = {
  ecg: 'Monitor ECG & Telemetria',
  pfr: 'Spirometria PFR & Curva F-V',
  ega: 'EGA Arteriosa Interpreter',
  tnm: 'Stadiazione TNM 9ª Ed.',
  flowcharts: 'Algoritmi Decisionali',
  pharma: 'Prontuario Farmaci (16)',
  imaging: 'Atlante Imaging RX / TC',
  scanner: 'Scanner Diagnostico DDx',
};

const CALC_LABELS: Record<string, string> = {
  'cha2ds2-vasc': 'CHA2DS2-VASc / VA & HAS-BLED',
  'has-bled': 'HAS-BLED (Sanguinamento)',
  heart: 'HEART Score (Dolore Toracico)',
  qtc: 'QTc (Bazett & Fridericia)',
  'euroscore-2': 'EuroSCORE II (Cardiochirurgia)',
  'curb-65': 'CURB-65 (Polmoniti CAP)',
  'light-criteria': 'Criteri di Light (Pleura)',
  abi: 'Indice ABI (AOCP)',
  'wells-dvt': 'Score di Wells (TVP / EP)',
};

const AUDIO_LABELS: Record<string, string> = {
  's1-s2': 'Toni S1 / S2 Normali',
  s3: 'Galoppo Protodiastolico S3',
  s4: 'Galoppo Telediastolico S4',
  'aortic-stenosis': 'Soffio Stenosi Aortica',
  'aortic-regurgitation': 'Soffio Insufficienza Aortica',
  'mitral-regurgitation': 'Soffio Insufficienza Mitralica',
  'mitral-stenosis': 'Rullio Stenosi Mitralica',
  'pericardial-rub': 'Sfregamento Pericardico',
  wheezing: 'Sibili & Fischi (Wheezing)',
  crackles: 'Crepitii / Rantoli (Crackles)',
  'bronchial-breath': 'Soffio Bronchiale',
};

const ANATOMY_LABELS: Record<string, string> = {
  heart: 'Cuore & Valvole 3D',
  beating: 'Ciclo Cardiaco 3D',
  coronary: 'Albero Coronarico 3D',
  aorta: 'Aorta & Grossi Vasi 3D',
  lungs: 'Polmoni & Albero Bronchiale 3D',
};

const isBulletLine = (line: string) =>
  line.startsWith('•') || line.startsWith('◦') || line.startsWith('‣') || line.startsWith('- ');

const isSubheadingLine = (line: string) =>
  !isBulletLine(line) &&
  line.length < 90 &&
  ((line === line.toUpperCase() && line.replace(/[^A-Z]/g, '').length > 4) ||
    line.endsWith(':') ||
    line.includes('=='));

/**
 * Cleans PDF-extracted line breaks so mid-sentence wraps become smooth, readable prose
 * while preserving bullets, subheadings, and deliberate paragraph breaks.
 */
const formatReadableBlocks = (raw: string): string[] => {
  if (!raw) return [];
  const rawLines = raw
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').replace(/\s+([,.;:?!])/g, '$1').trim())
    .filter((l) => l.length > 0);

  const blocks: string[] = [];
  for (const line of rawLines) {
    if (blocks.length === 0) {
      blocks.push(line);
      continue;
    }
    const prev = blocks[blocks.length - 1];
    const prevEndsSentence = /[.!?:;)\]]$/.test(prev);
    const currStartsLower = /^[a-zàèéìòù(]/.test(line);
    const shouldMerge =
      !isBulletLine(line) &&
      !isSubheadingLine(line) &&
      !isSubheadingLine(prev) &&
      !prevEndsSentence &&
      (currStartsLower || prev.length > 45);

    if (shouldMerge) {
      blocks[blocks.length - 1] = `${prev} ${line}`;
    } else {
      blocks.push(line);
    }
  }
  return blocks;
};

interface TheoryViewerProps {
  activeTopicId?: string | null;
  onSelectTopic?: (id: string) => void;
  onOpenQuestion?: (id: string) => void;
  onOpenTopicQuiz?: (ids: string[], topicTitle: string) => void;
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
  onOpenTopicQuiz,
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
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

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

  const currentTopicId = currentTopic?.id as string | undefined;

  // Reset per-chapter reading state when switching topics
  useEffect(() => {
    setCollapsedSections(new Set());
    setRevealedClozes(new Set());
    setFilterSearch('');
  }, [currentTopicId]);

  const clozeTokens = useMemo(() => {
    return currentTopic?.clozeTokens || [];
  }, [currentTopic]);

  const paragraphs = useMemo(() => {
    if (!currentTopic?.fullText) return [];
    return formatReadableBlocks(currentTopic.fullText);
  }, [currentTopic]);

  const formattedSections = useMemo(() => {
    if (!currentTopic?.sections || currentTopic.sections.length === 0) return [];
    return currentTopic.sections.map((sec: any) => ({
      ...sec,
      blocks: formatReadableBlocks(sec.content || ''),
    }));
  }, [currentTopic]);

  const filteredParagraphs = useMemo(() => {
    if (!filterSearch.trim()) return paragraphs;
    const q = filterSearch.toLowerCase();
    return paragraphs.filter((p: string) => p.toLowerCase().includes(q));
  }, [paragraphs, filterSearch]);

  const totalFilteredMatches = useMemo(() => {
    if (!filterSearch.trim() || !currentTopic) return 0;
    const q = filterSearch.toLowerCase().trim();
    let count = 0;
    if (formattedSections.length > 0) {
      for (const sec of formattedSections) {
        for (const p of sec.blocks) {
          if (p.toLowerCase().includes(q)) count++;
        }
      }
    } else {
      for (const p of paragraphs) {
        if (p.toLowerCase().includes(q)) count++;
      }
    }
    return count;
  }, [filterSearch, currentTopic, formattedSections, paragraphs]);

  const readingMinutes = useMemo(() => {
    if (!currentTopic) return 1;
    const rawText = currentTopic.sections?.length
      ? currentTopic.sections.map((s: any) => s.content || '').join(' ')
      : (currentTopic.fullText || '');
    const words = rawText.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 180));
  }, [currentTopic]);

  if (!currentTopic) {
    return (
      <div className="p-12 text-center text-slate-500">
        Nessun dato teorico trovato.
      </div>
    );
  }

  const toggleSection = (secId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(secId)) next.delete(secId);
      else next.add(secId);
      return next;
    });
  };

  const toggleAllSections = (collapse: boolean) => {
    if (!collapse || !currentTopic.sections) {
      setCollapsedSections(new Set());
    } else {
      setCollapsedSections(new Set(currentTopic.sections.map((s: any) => s.id)));
    }
  };

  const textSizeClass =
    fontSize === 'sm'
      ? 'text-[14px] leading-[1.85]'
      : fontSize === 'lg'
        ? 'text-[17px] leading-[1.95]'
        : 'text-[15px] sm:text-[15.5px] leading-[1.9]';

  const toggleCloze = (idx: number) => {
    setRevealedClozes((prev) => {
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

  const lt = currentTopic.linkedTools || {};
  const oralStationIds: number[] = Array.isArray(lt.oralStationIds) && lt.oralStationIds.length > 0
    ? lt.oralStationIds
    : lt.oralStationId
      ? [lt.oralStationId]
      : [];

  const hasLinkedTools = Boolean(
    (lt.quizIds && lt.quizIds.length > 0) ||
    oralStationIds.length > 0 ||
    lt.specialistTool ||
    lt.calculatorId ||
    lt.audioKey ||
    lt.anatomy3dTarget
  );

  const handleOpenChapterQuiz = () => {
    if (!lt.quizIds || lt.quizIds.length === 0) return;
    if (onOpenTopicQuiz) {
      onOpenTopicQuiz(lt.quizIds, currentTopic.title);
    } else {
      onOpenQuestion?.(lt.quizIds[0]);
    }
  };

  const getOralLabel = (stId: number) => {
    const c = oralCasesData[stId - 1];
    return c ? `#${stId} · ${c.discipline}` : `Stazione #${stId}`;
  };

  const jumpToSection = (secId: string) => {
    if (collapsedSections.has(secId)) toggleSection(secId);
    setTimeout(() => {
      const el = document.getElementById(secId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
  };

  const renderBlock = (para: string, keyId: string, recallSeed: number) => {
    if (isSubheadingLine(para)) {
      return (
        <div
          key={keyId}
          className="pt-4 pb-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-cyan-300 font-mono border-b border-cyan-500/15"
        >
          {para}
        </div>
      );
    }

    if (isBulletLine(para)) {
      const bulletText = para.replace(/^[•◦‣-]\s*/, '');
      return (
        <div
          key={keyId}
          className="flex items-start gap-3 pl-2 text-slate-200/95"
        >
          <span className="text-cyan-400/80 text-xs mt-1.5 shrink-0">•</span>
          <div className="flex-1">
            {renderActiveRecallParagraph(bulletText, recallSeed)}
          </div>
        </div>
      );
    }

    return (
      <p key={keyId} className="text-left text-slate-200/95">
        {renderActiveRecallParagraph(para, recallSeed)}
      </p>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      
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

      {/* 2. CHAPTER HERO BANNER */}
      <div className="bg-[#0c1220] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {currentTopic.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentTopic.category}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                ~{readingMinutes} min lettura
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

      {/* 3. HIGH-YIELD DIGEST CARD (4 PUNTI CARDINE / TRABOCCHETTI / STRUMENTI) */}
      <div className="bg-[#0b101c] border border-slate-800/80 rounded-2xl p-5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/70 pb-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveDigestTab('points')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeDigestTab === 'points'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>4 Punti Cardine</span>
            </button>

            {currentTopic.examTraps && currentTopic.examTraps.length > 0 && (
              <button
                onClick={() => setActiveDigestTab('traps')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  activeDigestTab === 'traps'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Trabocchetti ({currentTopic.examTraps.length})</span>
              </button>
            )}

            {hasLinkedTools && (
              <button
                onClick={() => setActiveDigestTab('tools')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  activeDigestTab === 'tools'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Network className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Quiz & Strumenti</span>
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
              <div className="text-xs font-bold text-blue-400 mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>1. Definizione & Fisiopatologia</span>
              </div>
              <p className="text-[13px] text-slate-300 leading-relaxed">
                {currentTopic.highYieldSummary.definizione}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>2. Segni Cardine & Semeiotica</span>
              </div>
              <p className="text-[13px] text-slate-300 leading-relaxed">
                {currentTopic.highYieldSummary.segniCardine}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>3. Diagnostica & Valori Soglia</span>
              </div>
              <p className="text-[13px] text-slate-300 leading-relaxed">
                {currentTopic.highYieldSummary.diagnostica}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs font-bold text-rose-400 mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>4. Terapia di Prima Linea</span>
              </div>
              <p className="text-[13px] text-slate-300 leading-relaxed">
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
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-500/20 flex items-start gap-2.5 text-[13px] text-slate-300 leading-relaxed"
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
                onClick={handleOpenChapterQuiz}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-yellow-500/40 text-left transition flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-yellow-300">Quiz Scritti del Capitolo</div>
                  <div className="text-[11px] text-slate-400">{lt.quizIds.length} domande mirate</div>
                </div>
              </button>
            )}

            {oralStationIds.map((stId) => (
              <button
                key={`oral-tab-${stId}`}
                onClick={() => onOpenOralStation?.(stId)}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-purple-300">Simulatore Orale</div>
                  <div className="text-[11px] text-slate-400 truncate">{getOralLabel(stId)}</div>
                </div>
              </button>
            ))}

            {lt.specialistTool && (
              <button
                onClick={() => onOpenSpecialistTool?.(lt.specialistTool)}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-emerald-300">Strumento Clinico</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {TOOL_LABELS[lt.specialistTool] || lt.specialistTool}
                  </div>
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
                <div className="min-w-0">
                  <div className="text-xs font-bold text-teal-300">Calcolatore Score</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {CALC_LABELS[lt.calculatorId] || lt.calculatorId}
                  </div>
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
                <div className="min-w-0">
                  <div className="text-xs font-bold text-rose-300">Auscultazione Audio</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {AUDIO_LABELS[lt.audioKey] || lt.audioKey}
                  </div>
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
                <div className="min-w-0">
                  <div className="text-xs font-bold text-blue-300">Atlante 3D WebGL</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {ANATOMY_LABELS[lt.anatomy3dTarget] || lt.anatomy3dTarget}
                  </div>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4. EDITORIAL 2-COLUMN READING LAYOUT (TEXT + STICKY STUDY COMPANION) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Main Reading Column (8 cols on desktop) */}
        <div className="lg:col-span-8 bg-[#0b101c] border border-slate-800/80 rounded-2xl shadow-sm p-5 sm:p-7 space-y-6">
          
          {/* Reading Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/70 gap-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                Trattazione Completa
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Font Size Switcher */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5" title="Dimensione testo">
                <Type className="w-3.5 h-3.5 text-slate-500 mx-1.5" />
                {(['sm', 'md', 'lg'] as const).map((sz, i) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition ${
                      fontSize === sz
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {i === 0 ? 'A-' : i === 1 ? 'A' : 'A+'}
                  </button>
                ))}
              </div>

              {formattedSections.length > 1 && (
                <button
                  onClick={() => toggleAllSections(collapsedSections.size === 0)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition"
                >
                  {collapsedSections.size === 0 ? 'Comprimi §' : 'Espandi §'}
                </button>
              )}

              <div className="relative flex-1 sm:flex-none sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filtra nel testo..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
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

          {/* Mobile-only Compact TOC (on desktop it sits neatly in the right sticky column) */}
          {formattedSections.length > 1 && (
            <div className="lg:hidden bg-slate-950/50 border border-slate-800/60 rounded-xl p-3.5">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                <Bookmark className="w-3 h-3 text-cyan-400" />
                <span>Indice Paragrafi</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formattedSections.map((sec: any, sIdx: number) => (
                  <button
                    key={sec.id}
                    onClick={() => jumpToSection(sec.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition flex items-center gap-1.5"
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
                Nessun riscontro per &quot;{filterSearch}&quot;
              </p>
              <button
                onClick={() => setFilterSearch('')}
                className="text-xs text-cyan-400 hover:underline font-mono"
              >
                Azzera filtro
              </button>
            </div>
          ) : formattedSections.length > 0 ? (
            <div className="space-y-5">
              {formattedSections.map((sec: any, sIdx: number) => {
                const filteredSecParas = filterSearch.trim()
                  ? sec.blocks.filter((p: string) => p.toLowerCase().includes(filterSearch.toLowerCase()))
                  : sec.blocks;

                if (filterSearch.trim() && filteredSecParas.length === 0) return null;
                const isCollapsed = !filterSearch.trim() && collapsedSections.has(sec.id);

                return (
                  <div
                    key={sec.id}
                    id={sec.id}
                    className="scroll-mt-24 rounded-2xl bg-slate-950/45 border border-slate-800/70 p-5 sm:p-6 transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(sec.id)}
                      className="w-full flex items-center justify-between gap-3 text-left group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                          § {sIdx + 1}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-cyan-200 transition">
                          {sec.title}
                        </h3>
                      </div>
                      <span className="text-slate-500 group-hover:text-slate-300 transition shrink-0">
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </span>
                    </button>

                    {!isCollapsed && (
                      <div className={`mt-4 pt-4 border-t border-slate-800/60 space-y-3.5 text-slate-200/95 font-sans ${textSizeClass}`}>
                        {filteredSecParas.map((para: string, pIdx: number) =>
                          renderBlock(para, `p-${sIdx}-${pIdx}`, sIdx * 1000 + pIdx)
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`space-y-3.5 text-slate-200/95 font-sans ${textSizeClass}`}>
              {filteredParagraphs.map((para: string, idx: number) =>
                renderBlock(para, `fb-${idx}`, idx)
              )}
            </div>
          )}
        </div>

        {/* Right Sticky Companion Column (4 cols on desktop): Indice + Verifiche del Capitolo */}
        <aside className="lg:col-span-4 lg:sticky lg:top-6 space-y-4">
          
          {/* Sticky Table of Contents */}
          {formattedSections.length > 0 && (
            <div className="bg-[#0b101c] border border-slate-800/80 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/70 pb-2.5">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Indice del Capitolo</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{formattedSections.length} §</span>
              </div>
              <div className="space-y-1.5">
                {formattedSections.map((sec: any, sIdx: number) => (
                  <button
                    key={`side-toc-${sec.id}`}
                    onClick={() => jumpToSection(sec.id)}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-950/50 hover:bg-slate-900 border border-slate-800/60 hover:border-cyan-500/35 text-xs text-slate-300 hover:text-white transition flex items-start gap-2.5 group"
                  >
                    <span className="text-cyan-400 font-mono text-[11px] font-bold shrink-0 mt-0.5">
                      §{sIdx + 1}
                    </span>
                    <span className="leading-snug">{sec.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sticky Connected Exam Practice & Tools Panel */}
          {hasLinkedTools && (
            <div className="bg-[#0b101c] border border-slate-800/80 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="border-b border-slate-800/70 pb-2.5 flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verifiche & Strumenti</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Collegati</span>
              </div>

              <div className="space-y-2">
                {lt.quizIds && lt.quizIds.length > 0 && (
                  <button
                    onClick={handleOpenChapterQuiz}
                    className="w-full p-3 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/15 border border-yellow-500/30 text-left transition flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-yellow-500/15 text-yellow-400 shrink-0">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-yellow-200">Quiz Scritti Capitolo</div>
                        <div className="text-[11px] text-slate-400">{lt.quizIds.length} domande mirate</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-yellow-400/70 group-hover:text-yellow-300 shrink-0" />
                  </button>
                )}

                {oralStationIds.map((stId) => (
                  <button
                    key={`side-oral-${stId}`}
                    onClick={() => onOpenOralStation?.(stId)}
                    className="w-full p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/30 text-left transition flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 shrink-0">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-purple-200">Caso Orale Collegato</div>
                        <div className="text-[11px] text-slate-400 truncate">{getOralLabel(stId)}</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-purple-400/70 group-hover:text-purple-300 shrink-0" />
                  </button>
                ))}

                {lt.specialistTool && (
                  <button
                    onClick={() => onOpenSpecialistTool?.(lt.specialistTool)}
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-medium text-slate-200 truncate">
                        {TOOL_LABELS[lt.specialistTool] || lt.specialistTool}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                  </button>
                )}

                {lt.calculatorId && (
                  <button
                    onClick={() => onOpenCalculator?.(lt.calculatorId)}
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-left transition flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Calculator className="w-4 h-4 text-teal-400 shrink-0" />
                      <span className="text-xs font-medium text-slate-200 truncate">
                        {CALC_LABELS[lt.calculatorId] || lt.calculatorId}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 shrink-0" />
                  </button>
                )}

                {lt.audioKey && (
                  <button
                    onClick={() => onOpenAudio?.(lt.audioKey)}
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-left transition flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Volume2 className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="text-xs font-medium text-slate-200 truncate">
                        {AUDIO_LABELS[lt.audioKey] || lt.audioKey}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 shrink-0" />
                  </button>
                )}

                {lt.anatomy3dTarget && (
                  <button
                    onClick={() => onFocus3D?.(lt.anatomy3dTarget)}
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-left transition flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Eye className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-xs font-medium text-slate-200 truncate">
                        {ANATOMY_LABELS[lt.anatomy3dTarget] || lt.anatomy3dTarget}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
};

export default TheoryViewer;
