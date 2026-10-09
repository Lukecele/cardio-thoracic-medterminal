import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Stethoscope,
  Zap,
  Calculator,
  Volume2,
  Trophy,
  Search,
  Menu,
  X,
  Layers,
  Heart
} from 'lucide-react';
import TheoryViewer from './components/TheoryViewer';
import { ExamSimulator } from './components/ExamSimulator';
import { OralExamSimulator } from './components/OralExamSimulator';
import { DiagnosticScanner } from './components/DiagnosticScanner';
import { ClinicalCalculators } from './components/ClinicalCalculators';
import AuscultationDock from './components/AuscultationDock';
import Anatomy3DViewport from './components/Anatomy3DViewport';
import theoryDataRaw from './data/theory.json';

const theoryData = theoryDataRaw as any;

function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'quiz' | 'oral' | 'scanner' | 'calculators' | 'auscultation'>('theory');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [targetQuestionId, setTargetQuestionId] = useState<string | null>(null);
  const [show3DDrawer, setShow3DDrawer] = useState(false);
  const [focus3DTarget, setFocus3DTarget] = useState<string | null>(null);
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

  const TABS = [
    { id: 'theory', label: 'Teoria 2FAST', desc: 'Libreria PDF', icon: BookOpen },
    { id: 'quiz', label: 'Database Scritti', desc: 'Simulazioni', icon: Trophy },
    { id: 'oral', label: 'Simulatore Orali', desc: 'Casi Clinici', icon: Stethoscope },
    { id: 'scanner', label: 'Scanner Diagnostico', desc: 'Matrice Patologie', icon: Zap },
    { id: 'calculators', label: 'Calcolatori', desc: 'Score Clinici', icon: Calculator },
    { id: 'auscultation', label: 'Auscultazione', desc: 'Reperti Audio', icon: Volume2 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-blue-200">
      
      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 w-full bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center space-x-2 text-blue-600">
          <Heart className="w-6 h-6" fill="currentColor" />
          <span className="font-bold tracking-tight">MedTerminal</span>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setSearchModalOpen(true)} className="p-2 text-slate-500 hover:text-blue-600 bg-slate-100 rounded-full">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-500 bg-slate-100 rounded-lg">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm pt-16">
          <nav className="bg-white w-3/4 max-w-sm h-full border-r border-slate-200 shadow-xl p-4 flex flex-col space-y-2 animate-in slide-in-from-left duration-200">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as typeof activeTab);
                    if (tab.id !== 'quiz') setTargetQuestionId(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-4 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="text-left flex-1">
                    <div className="text-sm">{tab.label}</div>
                    <div className="text-xs font-normal text-slate-500">{tab.desc}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-blue-600">
            <Heart className="w-6 h-6" fill="currentColor" />
            <span className="font-bold text-lg tracking-tight">MedTerminal</span>
          </div>
        </div>
        
        <div className="px-4 py-4">
          <button 
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2 text-sm">
              <Search className="w-4 h-4" />
              <span>Ricerca rapida...</span>
            </div>
            <div className="text-[10px] font-medium bg-slate-200 px-1.5 py-0.5 rounded text-slate-500 border border-slate-300">Ctrl+K</div>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Moduli Studio</div>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  if (tab.id !== 'quiz') setTargetQuestionId(null);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
          <button
            onClick={() => setShow3DDrawer(!show3DDrawer)}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
              show3DDrawer
                ? 'bg-blue-600 text-white shadow-blue-200'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{show3DDrawer ? 'Chiudi Atlante 3D' : 'Apri Atlante 3D'}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full bg-slate-50/50 pt-16 lg:pt-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto h-full flex gap-6">
            
            <div className={`flex-1 transition-all duration-300 ${show3DDrawer ? 'lg:pr-[400px] xl:pr-[450px]' : ''}`}>
              {activeTab === 'theory' && (
                <TheoryViewer
                  activeTopicId={activeTopicId}
                  onSelectTopic={(id) => {
                    setActiveTopicId(id);
                    const topic = theoryData.modules?.flatMap((m: any) => m.topics).find((t: any) => t.id === id);
                    if (topic?.anatomy3dTarget) {
                      setFocus3DTarget(topic.anatomy3dTarget);
                      setShow3DDrawer(true);
                    }
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
              {activeTab === 'quiz' && <ExamSimulator initialQuestionId={targetQuestionId} />}
              {activeTab === 'oral' && <OralExamSimulator />}
              {activeTab === 'scanner' && (
                <DiagnosticScanner
                  onNavigateTopic={(topicId: string) => {
                    setActiveTopicId(topicId);
                    setActiveTab('theory');
                  }}
                />
              )}
              {activeTab === 'calculators' && <ClinicalCalculators />}
              {activeTab === 'auscultation' && <AuscultationDock />}
            </div>

            {/* SLIDE-OUT 3D ATLAS DRAWER */}
            {show3DDrawer && (
              <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-[400px] xl:w-[450px] bg-slate-900 shadow-2xl border-l border-slate-800 z-20 animate-in slide-in-from-right">
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <div className="flex items-center space-x-2 text-blue-400 font-medium">
                      <Layers className="w-5 h-5" />
                      <span>Atlante 3D Interattivo</span>
                    </div>
                    <button onClick={() => setShow3DDrawer(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 relative">
                    <Anatomy3DViewport
                      focusTarget={focus3DTarget}
                      onSelectTarget={(target) => setFocus3DTarget(target)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* SEARCH MODAL */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-center items-start pt-[10vh] px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 py-3 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="Cerca argomenti, patologie, quiz..." 
                className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button onClick={() => setSearchModalOpen(false)} className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs font-medium uppercase hover:bg-slate-200">Esc</button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              <div className="p-8 text-center text-slate-500">Ricerca in corso su {theoryData.modules?.length || 0} moduli...</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
