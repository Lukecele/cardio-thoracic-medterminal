import { useState, useEffect } from 'react';
import {
  Heart,
  Wind,
  Activity,
  Layers,
  BookOpen,
  Trophy,
  Zap,
  Calculator,
  Volume2,
  Search,
  ChevronRight,
  Terminal,
  Clock,
  Stethoscope,
} from 'lucide-react';
import { Anatomy3DViewport } from './components/Anatomy3DViewport';
import { TheoryViewer } from './components/TheoryViewer';
import { ExamSimulator } from './components/ExamSimulator';
import { OralExamSimulator } from './components/OralExamSimulator';
import { DiagnosticScanner } from './components/DiagnosticScanner';
import { ClinicalCalculators } from './components/ClinicalCalculators';
import { AuscultationDock } from './components/AuscultationDock';

import theoryData from './data/theory.json';
import questionsData from './data/questions.json';
import scannerData from './data/scannerMatrix.json';
import oralCasesData from './data/oralCases.json';

export function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'quiz' | 'oral' | 'scanner' | 'calculators' | 'auscultation'>('theory');
  const [activeTopicId, setActiveTopicId] = useState<string>('cardio-valvulopatie');
  const [focus3DTarget, setFocus3DTarget] = useState<string>('aortic-valve');
  const [show3DDrawer, setShow3DDrawer] = useState<boolean>(true);
  const [targetQuestionId, setTargetQuestionId] = useState<string | null>(null);

  // Global search modal state
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Local clock state
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered search results across theory, questions, and scanner
  const searchResults = searchQuery.trim() === '' ? [] : [
    ...theoryData.modules.flatMap(m =>
      m.topics
        .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(t => ({ type: 'Teoria 2FAST', title: t.title, subtitle: `${m.name} • ${t.category}`, id: t.id, action: () => { setActiveTopicId(t.id); setActiveTab('theory'); setSearchModalOpen(false); } }))
    ),
    ...questionsData
      .filter(q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) || q.topic.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5)
      .map(q => ({ type: 'Quiz Esame', title: q.question.slice(0, 65) + '...', subtitle: `${q.branch.toUpperCase()} • ${q.topic}`, id: q.id, action: () => { setTargetQuestionId(q.id); setActiveTab('quiz'); setSearchModalOpen(false); } })),
    ...oralCasesData
      .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.discipline.toLowerCase().includes(searchQuery.toLowerCase()) || c.patient.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(c => ({ type: 'Orale Clinico', title: c.title, subtitle: `${c.discipline} • ${c.patient.slice(0, 45)}...`, id: c.id, action: () => { setActiveTab('oral'); setSearchModalOpen(false); } })),
    ...scannerData
      .filter(s => s.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(s => ({ type: 'Diagnostica', title: s.diagnosis, subtitle: s.imagingGoldStandard.slice(0, 50) + '...', id: s.id, action: () => { setActiveTab('scanner'); setSearchModalOpen(false); } }))
  ];

  const handleSelectDiscipline = (moduleId: string, defaultTopicId: string) => {
    setActiveTopicId(defaultTopicId);
    setActiveTab('theory');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* TOP COMMAND BAR (Bloomberg / Terminal HUD Style) */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-3 md:px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-800/60 shadow-sm">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs font-bold tracking-widest text-cyan-300">
              MED-TERMINAL // v2.0 FAST
            </span>
          </div>

          {/* 5 Disciplines Interactive Quick Jump in Top Bar */}
          <div className="hidden xl:flex items-center space-x-1.5 text-xs font-mono text-slate-400 pl-2 border-l border-slate-800">
            <button
              onClick={() => handleSelectDiscipline('cardio', 'cardio-ischemia')}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-semibold flex items-center space-x-1 transition"
            >
              <Heart className="w-3 h-3 text-rose-500" />
              <span>CARDIO</span>
            </button>
            <span className="text-slate-700">/</span>
            <button
              onClick={() => handleSelectDiscipline('cardiochirurgia', 'cardiochir-bicuspide')}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-semibold flex items-center space-x-1 transition"
            >
              <Activity className="w-3 h-3 text-red-400" />
              <span>CARDIOCHIR</span>
            </button>
            <span className="text-slate-700">/</span>
            <button
              onClick={() => handleSelectDiscipline('pneumo', 'pneumo-bpco')}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-semibold flex items-center space-x-1 transition"
            >
              <Wind className="w-3 h-3 text-cyan-400" />
              <span>PNEUMO</span>
            </button>
            <span className="text-slate-700">/</span>
            <button
              onClick={() => handleSelectDiscipline('chirurgia_toracica', 'toracica-pnx')}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-semibold flex items-center space-x-1 transition"
            >
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>TORACICA</span>
            </button>
            <span className="text-slate-700">/</span>
            <button
              onClick={() => handleSelectDiscipline('vascolare', 'vascolare-aaa')}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-semibold flex items-center space-x-1 transition"
            >
              <Activity className="w-3 h-3 text-amber-500" />
              <span>VASCOLARE</span>
            </button>
          </div>
        </div>

        {/* Global Quick Search Button */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-200 transition"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Ricerca globale (5 discipline, quiz, orali)...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
            Ctrl+K
          </kbd>
        </button>

        {/* Right HUD info & 3D Drawer Toggle */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 text-xs font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{timeStr}</span>
          </div>

          <button
            onClick={() => setShow3DDrawer(!show3DDrawer)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition border ${
              show3DDrawer
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">3D Viewport</span>
          </button>
        </div>
      </header>

      {/* NAVIGATION TABS BAR (Fully Responsive with subtle scroll) */}
      <nav className="bg-slate-950/80 border-b border-slate-800/80 px-3 md:px-4 py-2 flex items-center space-x-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {[
          { id: 'theory', label: 'Teoria 2FAST (5 Discipline)', icon: BookOpen, color: 'text-cyan-400' },
          { id: 'quiz', label: 'Database Scritti (Quiz & Ricostruzioni)', icon: Trophy, color: 'text-emerald-400' },
          { id: 'oral', label: 'Simulatore Orali (5 Stazioni)', icon: Stethoscope, color: 'text-purple-400' },
          { id: 'scanner', label: 'Diagnostic Scanner & Matrix', icon: Zap, color: 'text-amber-400' },
          { id: 'calculators', label: 'Score & Calcolatori Clinici', icon: Calculator, color: 'text-blue-400' },
          { id: 'auscultation', label: 'Auscultazione Cuore & Polmone', icon: Volume2, color: 'text-rose-400' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                if (tab.id !== 'quiz') setTargetQuestionId(null);
              }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono font-semibold transition whitespace-nowrap border ${
                isActive
                  ? 'bg-slate-800 border-slate-600 text-white shadow-md'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-3 md:p-6 max-w-[1700px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Primary View (Changes with active tab) */}
          <div className={show3DDrawer ? 'lg:col-span-8 space-y-6' : 'lg:col-span-12 space-y-6'}>
            {activeTab === 'theory' && (
              <TheoryViewer
                activeTopicId={activeTopicId}
                onSelectTopic={(id) => {
                  setActiveTopicId(id);
                  // Update 3D target if available
                  const topic = theoryData.modules.flatMap(m => m.topics).find(t => t.id === id);
                  if (topic?.anatomy3dTarget) setFocus3DTarget(topic.anatomy3dTarget);
                }}
                onOpenQuestion={(qId) => {
                  setTargetQuestionId(qId);
                  setActiveTab('quiz');
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
              <OralExamSimulator />
            )}

            {activeTab === 'scanner' && (
              <DiagnosticScanner
                onNavigateTopic={(topicId) => {
                  setActiveTopicId(topicId);
                  setActiveTab('theory');
                }}
              />
            )}

            {activeTab === 'calculators' && <ClinicalCalculators />}

            {activeTab === 'auscultation' && <AuscultationDock />}
          </div>

          {/* Side Dock: 3D Viewport & Audio Quick Widget */}
          {show3DDrawer && (
            <div className="lg:col-span-4 space-y-4">
              {/* 3D Anatomical Viewport */}
              <div className="h-[430px] w-full sticky top-20">
                <Anatomy3DViewport
                  focusTarget={focus3DTarget}
                  onSelectTarget={(target) => setFocus3DTarget(target)}
                />

                {/* Quick Auscultation Dock under 3D */}
                <div className="mt-4">
                  <AuscultationDock />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 px-4 py-3 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between">
        <div>
          Corso di Malattie Apparato Cardiovascolare e Respiratorio • Dispense 2FAST Lorenzo Pessetti & Database Scritti
        </div>
        <div className="mt-1 sm:mt-0 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Vercel Production Ready</span>
        </div>
      </footer>

      {/* GLOBAL SEARCH MODAL */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in duration-150">
            <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
              <Search className="w-5 h-5 text-cyan-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digita per cercare patologie, reperti, domande d'esame..."
                autoFocus
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
              >
                ESC
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/60">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 font-mono">
                  {searchQuery.trim() === '' ? 'Inizia a digitare per cercare nell\'aggregatore...' : 'Nessun risultato trovato.'}
                </div>
              ) : (
                searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={res.action}
                    className="p-3 hover:bg-slate-800/60 rounded-lg cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                          {res.type}
                        </span>
                        <span className="font-semibold text-sm text-slate-200">{res.title}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">{res.subtitle}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
