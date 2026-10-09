import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Trophy,
  Stethoscope,
  Zap,
  Activity,
  Wind,
  Droplets,
  ShieldCheck,
  Network,
  Pill,
  ImageIcon,
  Calculator,
  Headphones,
  Search,
  Menu,
  X,
  Layers,
  Heart,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

import TheoryViewer from './components/TheoryViewer';
import { ExamSimulator } from './components/ExamSimulator';
import { OralExamSimulator } from './components/OralExamSimulator';
import { DiagnosticScanner } from './components/DiagnosticScanner';
import { EcgSimulator } from './components/EcgSimulator';
import { PfrSpirometryTool } from './components/PfrSpirometryTool';
import { EgaInterpreter } from './components/EgaInterpreter';
import { TnmStagingTool } from './components/TnmStagingTool';
import { ClinicalFlowcharts } from './components/ClinicalFlowcharts';
import { PharmaCompendium } from './components/PharmaCompendium';
import { ClinicalImagingAtlas } from './components/ClinicalImagingAtlas';
import { ClinicalCalculators } from './components/ClinicalCalculators';
import AuscultationDock from './components/AuscultationDock';
import Anatomy3DViewport from './components/Anatomy3DViewport';
import Footer from './components/Footer';

import theoryDataRaw from './data/theory.json';
import questionsData from './data/questions.json';

const theoryData = theoryDataRaw as any;

type TabType =
  | 'theory'
  | 'quiz'
  | 'oral'
  | 'scanner'
  | 'ecg'
  | 'pfr'
  | 'ega'
  | 'tnm'
  | 'flowcharts'
  | 'pharma'
  | 'imaging'
  | 'calculators'
  | 'auscultation';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('theory');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cross-link state
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [targetQuestionId, setTargetQuestionId] = useState<string | null>(null);
  const [targetOralStationId, setTargetOralStationId] = useState<number | null>(null);
  const [targetCalculatorId, setTargetCalculatorId] = useState<string | null>(null);
  const [targetAudioTrackId, setTargetAudioTrackId] = useState<string | null>(null);
  
  // 3D Atlas Drawer state
  const [show3DDrawer, setShow3DDrawer] = useState(false);
  const [focus3DTarget, setFocus3DTarget] = useState<string | null>('heart');
  
  // Mobile navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') setSearchModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const CORE_TABS = [
    { id: 'theory' as TabType, label: 'Teoria Integrale', badge: '16 CAP', desc: '16 Capitoli & Linee Guida Ufficiali', icon: BookOpen, color: 'text-cyan-400' },
    { id: 'quiz' as TabType, label: 'Database Scritti', badge: '48 MCQ', desc: 'Quesiti & Razionali', icon: Trophy, color: 'text-yellow-400' },
    { id: 'oral' as TabType, label: 'Simulatore Orali', badge: '5 CASI', desc: '5 Stazioni Specialistiche', icon: Stethoscope, color: 'text-purple-400' },
    { id: 'scanner' as TabType, label: 'Scanner Diagnostico', badge: 'DDx', desc: 'Matrice Sintomi/Segni', icon: Zap, color: 'text-amber-400' },
  ];

  const CLINICAL_TABS = [
    { id: 'ecg' as TabType, label: 'Monitor ECG', badge: 'LIVE', desc: 'Telemetria & Quiz Ritmo', icon: Activity, color: 'text-emerald-400' },
    { id: 'pfr' as TabType, label: 'Spirometria PFR', badge: 'CURVA', desc: 'Flusso-Volume & Tiffeneau', icon: Wind, color: 'text-sky-400' },
    { id: 'ega' as TabType, label: 'EGA Arteriosa', badge: 'GAS', desc: 'Equilibrio Acido-Base & ARDS', icon: Droplets, color: 'text-rose-400' },
    { id: 'tnm' as TabType, label: 'Stadiazione TNM', badge: '8ª ED', desc: 'NSCLC & Operabilità ppo', icon: ShieldCheck, color: 'text-amber-400' },
    { id: 'flowcharts' as TabType, label: 'Algoritmi Decisionali', badge: 'FLOW', desc: 'STEMI, Scompenso, Ischemia', icon: Network, color: 'text-blue-400' },
    { id: 'pharma' as TabType, label: 'Prontuario Farmaci', badge: 'DRUGS', desc: 'DOACs, Emergenze, RIPE', icon: Pill, color: 'text-pink-400' },
    { id: 'imaging' as TabType, label: 'Atlante Imaging', badge: 'RAD', desc: 'Segni RX, TC & Angio-TC', icon: ImageIcon, color: 'text-indigo-400' },
    { id: 'calculators' as TabType, label: 'Score Clinici', badge: '7 SCORE', desc: 'CHA2DS2-VASc, EuroSCORE...', icon: Calculator, color: 'text-teal-400' },
    { id: 'auscultation' as TabType, label: 'Fonoteca Auscultatoria', badge: 'AUDIO', desc: '7 Reperti Cardio-Polmonari', icon: Headphones, color: 'text-rose-400' },
  ];

  // Global Search indexing
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    const results: Array<{
      type: 'theory' | 'quiz' | 'tool';
      title: string;
      subtitle: string;
      action: () => void;
    }> = [];

    // Search theory
    for (const mod of theoryData.modules || []) {
      for (const t of mod.topics || []) {
        if (
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.highYieldSummary?.definizione && t.highYieldSummary.definizione.toLowerCase().includes(q))
        ) {
          results.push({
            type: 'theory',
            title: t.title,
            subtitle: `${mod.name} • ${t.category}`,
            action: () => {
              setActiveTopicId(t.id);
              setActiveTab('theory');
              setSearchModalOpen(false);
            }
          });
        }
      }
    }

    // Search quizzes
    for (const quest of questionsData as any[]) {
      if (quest.question.toLowerCase().includes(q) || quest.topic?.toLowerCase().includes(q)) {
        results.push({
          type: 'quiz',
          title: `Quiz: ${quest.topic || 'Quesito Ufficiale'}`,
          subtitle: quest.question.substring(0, 85) + '...',
          action: () => {
            setTargetQuestionId(quest.id);
            setActiveTab('quiz');
            setSearchModalOpen(false);
          }
        });
      }
    }

    // Search tools
    const toolKeywords: Array<{ id: TabType; name: string; desc: string; keywords: string[] }> = [
      { id: 'ecg', name: 'Monitor ECG Vettoriale', desc: 'Tracciati STEMI, FA, BAV, Flutter', keywords: ['ecg', 'elettrocardiogramma', 'stemi', 'fibrillazione', 'blocco', 'flutter'] },
      { id: 'pfr', name: 'Spirometria & PFR', desc: 'Curva Flusso-Volume, Tiffeneau, Broncodilatatore', keywords: ['pfr', 'spirometria', 'tiffeneau', 'fev1', 'fvc', 'broncodilatatore', 'asma', 'bpco'] },
      { id: 'ega', name: 'EGA Arteriosa Interpreter', desc: 'Equilibrio acido-base, Tipo 1 vs Tipo 2, ARDS', keywords: ['ega', 'emogasanalisi', 'pao2', 'paco2', 'acidosi', 'alcalosi', 'ards'] },
      { id: 'tnm', name: 'Stadiazione TNM & Operabilità', desc: 'NSCLC 8ª Edizione, ppo-FEV1, ppo-DLCO', keywords: ['tnm', 'stadiazione', 'lobectomia', 'pneumonectomia', 'operabilita', 'ppo'] },
      { id: 'flowcharts', name: 'Percorsi Clinici Decisionali', desc: 'Flowchart STEMI, Scompenso 4 pilastri, Fogarty', keywords: ['flowchart', 'algoritmo', 'percorso', 'stemi pci', 'fogarty', 'scompenso 4'] },
      { id: 'pharma', name: 'Prontuario Farmacologico', desc: 'DOACs & antidoti, Emergenze EV, Regime RIPE', keywords: ['farmaci', 'pharma', 'doac', 'idarucizumab', 'andexanet', 'labetalolo', 'tbc ripe'] },
      { id: 'imaging', name: 'Atlante Imaging Toracico', desc: 'RX, TC Torace, Kerley B, PNX, Dissecazione', keywords: ['imaging', 'radiologia', 'rx', 'tc', 'dissecazione', 'kerley', 'pneumotorace'] },
      { id: 'calculators', name: 'Score Clinici (CHA2DS2, EuroSCORE...)', desc: 'Calcolatori diagnostici e prognostici', keywords: ['score', 'calcolatori', 'cha2ds2', 'euroscore', 'wells', 'light', 'curb65'] },
      { id: 'auscultation', name: 'Libreria Auscultatoria', desc: '7 registrazioni reali cardiopolmonari', keywords: ['audio', 'auscultazione', 'toni', 'soffi', 'rantoli', 'sibili', 'stenosi aortica'] },
    ];

    toolKeywords.forEach(tool => {
      if (tool.name.toLowerCase().includes(q) || tool.keywords.some(k => k.includes(q) || q.includes(k))) {
        results.push({
          type: 'tool',
          title: tool.name,
          subtitle: tool.desc,
          action: () => {
            setActiveTab(tool.id);
            setSearchModalOpen(false);
          }
        });
      }
    });

    return results.slice(0, 15);
  }, [searchQuery]);

  return (
    <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans overflow-hidden selection:bg-cyan-500/30 selection:text-white">
      
      {/* MOBILE TOPBAR */}
      <header className="lg:hidden fixed top-0 inset-x-0 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-4 z-40">
        <div className="flex items-center space-x-2.5 text-cyan-400">
          <Heart className="w-5 h-5 fill-cyan-400/20 text-cyan-400" />
          <span className="font-mono font-bold tracking-tight text-white text-base">MedTerminal 2.0</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
            title="Cerca"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
            title="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-sm pt-16 animate-in fade-in duration-200">
          <nav className="bg-slate-950 w-4/5 max-w-sm h-full border-r border-slate-800 p-4 flex flex-col space-y-4 overflow-y-auto custom-scrollbar">
            
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-2 mb-2">
                STUDIO CURRICULARE
              </div>
              <div className="space-y-1">
                {CORE_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition text-left ${
                        isActive
                          ? 'bg-blue-600/20 border border-blue-500/40 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${tab.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-200">{tab.label}</div>
                        <div className="text-[10px] text-slate-500">{tab.desc}</div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {tab.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-2 mb-2">
                STRUMENTI CLINICI SPECIALISTICI
              </div>
              <div className="space-y-1">
                {CLINICAL_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition text-left ${
                        isActive
                          ? 'bg-blue-600/20 border border-blue-500/40 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${tab.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-200">{tab.label}</div>
                        <div className="text-[10px] text-slate-500">{tab.desc}</div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {tab.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-auto">
              <button
                onClick={() => {
                  setShow3DDrawer(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:bg-slate-850 font-mono text-xs font-bold"
              >
                <Layers className="w-4 h-4" />
                <span>Apri Atlante WebGL 3D</span>
              </button>
            </div>

          </nav>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950 border-r border-slate-850 shrink-0 z-10 relative">
        
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-850 bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Heart className="w-5 h-5 fill-cyan-400/20" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>MedTerminal</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  2.0
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-500">5 DISCIPLINE INTEGRATE</div>
            </div>
          </div>
        </div>

        {/* Global Search Button */}
        <div className="px-4 py-3">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition-all shadow-inner group"
          >
            <div className="flex items-center space-x-2 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
              <span>Cerca argomenti o quiz...</span>
            </div>
            <div className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              Ctrl+K
            </div>
          </button>
        </div>

        {/* Nav Lists */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 custom-scrollbar">
          
          {/* Core Study Section */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-3 mb-2 flex items-center justify-between">
              <span>Studio Curriculare</span>
              <span className="text-slate-600">Core</span>
            </div>
            <div className="space-y-1">
              {CORE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id !== 'quiz') setTargetQuestionId(null);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                      isActive
                        ? 'bg-cyan-500/10 border border-cyan-500/40 text-white shadow-sm ring-1 ring-cyan-500/20'
                        : 'border border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${tab.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate text-slate-200">{tab.label}</div>
                      <div className="text-[10px] text-slate-500 truncate">{tab.desc}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specialist Clinical Tools */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-3 mb-2 flex items-center justify-between">
              <span>Strumenti Specialistici</span>
              <span className="text-slate-600">Clinical Suite</span>
            </div>
            <div className="space-y-1">
              {CLINICAL_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all text-left ${
                      isActive
                        ? 'bg-blue-600/15 border border-blue-500/40 text-white shadow-sm ring-1 ring-blue-500/20'
                        : 'border border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${tab.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate text-slate-200">{tab.label}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* 3D Atlas Drawer Launcher Footer */}
        <div className="p-3 border-t border-slate-850 bg-slate-950">
          <button
            onClick={() => setShow3DDrawer(!show3DDrawer)}
            className={`w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              show3DDrawer
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white hover:border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{show3DDrawer ? 'Chiudi Atlante 3D' : 'Apri Atlante WebGL 3D'}</span>
          </button>
        </div>

      </aside>

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-1 flex flex-col h-full bg-[#07090e] pt-16 lg:pt-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          
          <div className="p-4 lg:p-8 flex-1">
            <div className={`max-w-[1500px] mx-auto transition-all duration-300 ${show3DDrawer ? 'lg:pr-[420px] xl:pr-[460px]' : ''}`}>
              
              {/* VIEW ROUTER */}
              {activeTab === 'theory' && (
                <TheoryViewer
                  activeTopicId={activeTopicId}
                  onSelectTopic={(id) => {
                    setActiveTopicId(id);
                  }}
                  onOpenQuestion={(qId) => {
                    setTargetQuestionId(qId);
                    setActiveTab('quiz');
                  }}
                  onOpenOralStation={(stId) => {
                    setTargetOralStationId(stId);
                    setActiveTab('oral');
                  }}
                  onOpenCalculator={(cId) => {
                    setTargetCalculatorId(cId);
                    setActiveTab('calculators');
                  }}
                  onOpenSpecialistTool={(toolId) => {
                    setActiveTab(toolId as TabType);
                  }}
                  onOpenAudio={(trackId) => {
                    setTargetAudioTrackId(trackId);
                    setActiveTab('auscultation');
                  }}
                  onFocus3D={(target) => {
                    setFocus3DTarget(target);
                    setShow3DDrawer(true);
                  }}
                />
              )}

              {activeTab === 'quiz' && (
                <ExamSimulator initialQuestionId={targetQuestionId} />
              )}

              {activeTab === 'oral' && (
                <OralExamSimulator initialStationId={targetOralStationId} />
              )}

              {activeTab === 'scanner' && (
                <DiagnosticScanner
                  onNavigateTopic={(topicId: string) => {
                    setActiveTopicId(topicId);
                    setActiveTab('theory');
                  }}
                />
              )}

              {/* SPECIALIST CLINICAL TOOLS */}
              {activeTab === 'ecg' && <EcgSimulator />}
              {activeTab === 'pfr' && <PfrSpirometryTool />}
              {activeTab === 'ega' && <EgaInterpreter />}
              {activeTab === 'tnm' && <TnmStagingTool />}
              {activeTab === 'flowcharts' && <ClinicalFlowcharts />}
              {activeTab === 'pharma' && <PharmaCompendium />}
              {activeTab === 'imaging' && <ClinicalImagingAtlas />}
              {activeTab === 'calculators' && (
                <ClinicalCalculators initialCalculatorId={targetCalculatorId} />
              )}
              {activeTab === 'auscultation' && (
                <AuscultationDock initialTrackId={targetAudioTrackId} />
              )}

            </div>
          </div>

          {/* SLIDE-OUT 3D ATLAS DRAWER */}
          {show3DDrawer && (
            <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-[420px] xl:w-[460px] bg-slate-950 shadow-2xl border-l border-slate-800 z-30 animate-in slide-in-from-right duration-200">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                  <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>Atlante WebGL 3D (Three.js STL)</span>
                  </div>
                  <button
                    onClick={() => setShow3DDrawer(false)}
                    className="text-slate-400 hover:text-white bg-slate-900 border border-slate-800 p-1.5 rounded-lg transition"
                    title="Chiudi"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 relative overflow-hidden">
                  <Anatomy3DViewport
                    focusTarget={focus3DTarget}
                    onSelectTarget={(target) => setFocus3DTarget(target)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* FOOTER CLEANLY ANCHORED AT BOTTOM OF SCROLL CONTAINER */}
          <Footer />

        </div>
      </main>

      {/* CTRL+K SEARCH MODAL */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex justify-center items-start pt-[12vh] px-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-200 flex flex-col max-h-[75vh]">
            
            <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950">
              <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Cerca argomenti, cut-off, ECG, quiz, farmaci, esami..."
                className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-sm font-sans"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[11px] font-mono uppercase hover:bg-slate-700 hover:text-white"
              >
                Esc
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {searchQuery.trim().length < 2 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Digita almeno 2 caratteri per effettuare una ricerca globale nei compendi e negli strumenti.
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Nessun risultato corrispondente a "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={res.action}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-800/80 transition flex items-center justify-between group border border-transparent hover:border-slate-700"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                          {res.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {res.subtitle}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] font-mono text-slate-500 px-4">
              <span>Naviga con il mouse o clicca per aprire direttamente</span>
              <span>MedTerminal Search Engine</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
