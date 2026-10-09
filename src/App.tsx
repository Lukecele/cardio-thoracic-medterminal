import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Sparkles,
  Maximize2,
  Minimize2,
  Home
} from 'lucide-react';

import { HomePage } from './components/HomePage';
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
import CookieBanner from './components/CookieBanner';

import theoryDataRaw from './data/theory.json';
import questionsData from './data/questions.json';
import oralCasesDataRaw from './data/oralCases.json';

const theoryData = theoryDataRaw as any;
const oralCasesData = oralCasesDataRaw as any[];

type TabType =
  | 'home'
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
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchCategory, setActiveSearchCategory] = useState<'all' | 'theory' | 'quiz' | 'oral' | 'tool' | 'media'>('all');
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  
  // Cross-link state
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [targetQuestionId, setTargetQuestionId] = useState<string | null>(null);
  const [targetOralStationId, setTargetOralStationId] = useState<number | null>(null);
  const [targetCalculatorId, setTargetCalculatorId] = useState<string | null>(null);
  const [targetAudioTrackId, setTargetAudioTrackId] = useState<string | null>(null);
  
  // 3D Atlas Drawer state
  const [show3DDrawer, setShow3DDrawer] = useState(false);
  const [focus3DTarget, setFocus3DTarget] = useState<string | null>('heart');
  const [is3DMaximized, setIs3DMaximized] = useState(false);
  
  // Legal & Privacy modal trigger
  const [externalLegalOpen, setExternalLegalOpen] = useState(false);
  
  // Mobile navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

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
    { id: 'home' as TabType, label: 'Home • Hub Esame', badge: 'HUB', desc: 'Guida, Crediti & Easter Eggs', icon: Home, color: 'text-cyan-400' },
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
    { id: 'auscultation' as TabType, label: 'Fonoteca Auscultatoria', badge: '11 AUDIO', desc: '11 Reperti Cardio-Polmonari', icon: Headphones, color: 'text-rose-400' },
  ];

  // Helper to extract a relevant snippet around query
  const extractSnippet = (text: string, query: string, prefix = ''): string => {
    if (!text) return '';
    const clean = text.replace(/\s+/g, ' ').trim();
    const lower = clean.toLowerCase();
    const qLower = query.toLowerCase();
    const idx = lower.indexOf(qLower);
    if (idx === -1) {
      const shortText = clean.length > 90 ? clean.slice(0, 90) + '...' : clean;
      return prefix ? `${prefix}: ${shortText}` : shortText;
    }
    const start = Math.max(0, idx - 30);
    const end = Math.min(clean.length, idx + query.length + 65);
    let snip = clean.slice(start, end).trim();
    if (start > 0) snip = '...' + snip;
    if (end < clean.length) snip = snip + '...';
    return prefix ? `${prefix}: ${snip}` : snip;
  };

  const renderHighlight = (text: string, query: string) => {
    if (!text || !query || query.trim().length < 2) return text;
    const qClean = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${qClean})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-cyan-500/35 text-cyan-200 px-0.5 rounded font-semibold not-italic">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  type SearchCategoryType = 'theory' | 'quiz' | 'oral' | 'tool' | 'media';

  interface SearchResultItem {
    id: string;
    category: SearchCategoryType;
    badge: string;
    badgeColor: string;
    title: string;
    subtitle: string;
    snippet?: string;
    action: () => void;
  }

  // Multi-Entity Deep Global Search Indexing
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    // 1. TEORIA CLINICA (Tutti i 16 capitoli, sezioni, cut-off, trabocchetti)
    for (const mod of theoryData.modules || []) {
      for (const t of mod.topics || []) {
        const titleMatch = t.title?.toLowerCase().includes(q);
        const catMatch = t.category?.toLowerCase().includes(q);
        const defMatch = t.highYieldSummary?.definizione?.toLowerCase().includes(q);
        const signsMatch = t.highYieldSummary?.segniCardine?.toLowerCase().includes(q);
        const diagMatch = t.highYieldSummary?.diagnostica?.toLowerCase().includes(q);
        const txMatch = t.highYieldSummary?.terapia?.toLowerCase().includes(q);
        const trapMatch = t.examTraps && t.examTraps.find((trap: string) => trap.toLowerCase().includes(q));
        const secMatch = t.sections && t.sections.find((sec: any) => sec.title?.toLowerCase().includes(q) || sec.content?.toLowerCase().includes(q));

        if (titleMatch || catMatch || defMatch || signsMatch || diagMatch || txMatch || trapMatch || secMatch) {
          let snippet = '';
          if (diagMatch) snippet = extractSnippet(t.highYieldSummary.diagnostica, q, 'Diagnostica & Cut-off');
          else if (signsMatch) snippet = extractSnippet(t.highYieldSummary.segniCardine, q, 'Segni Cardine');
          else if (txMatch) snippet = extractSnippet(t.highYieldSummary.terapia, q, 'Terapia & Management');
          else if (trapMatch) snippet = extractSnippet(trapMatch, q, "Trabocchetto d'Esame");
          else if (secMatch) snippet = extractSnippet(secMatch.content, q, secMatch.title);
          else if (defMatch) snippet = extractSnippet(t.highYieldSummary.definizione, q, 'Definizione');
          else snippet = extractSnippet(t.highYieldSummary?.definizione || t.title, q, 'Capitolo');

          results.push({
            id: `th-${t.id}`,
            category: 'theory',
            badge: 'TEORIA',
            badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            title: t.title,
            subtitle: `${mod.name} • ${t.category}`,
            snippet,
            action: () => {
              setActiveTopicId(t.id);
              setActiveTab('theory');
              setSearchModalOpen(false);
            }
          });
        }
      }
    }

    // 2. CASI CLINICI ORALI (5 Stazioni d'esame orali, domande e risposte)
    for (let i = 0; i < (oralCasesData || []).length; i++) {
      const c = oralCasesData[i];
      const titleMatch = c.title?.toLowerCase().includes(q);
      const patientMatch = c.patient?.toLowerCase().includes(q);
      const discMatch = c.discipline?.toLowerCase().includes(q);
      const qMatch = c.oralQuestions && c.oralQuestions.find((oq: any) => 
        oq.question?.toLowerCase().includes(q) || 
        oq.expectedAnswer?.toLowerCase().includes(q) || 
        oq.fatalTrap?.toLowerCase().includes(q)
      );

      if (titleMatch || patientMatch || discMatch || qMatch) {
        let snippet = '';
        if (qMatch) {
          if (qMatch.question?.toLowerCase().includes(q)) snippet = extractSnippet(qMatch.question, q, 'Domanda Orale');
          else if (qMatch.fatalTrap?.toLowerCase().includes(q)) snippet = extractSnippet(qMatch.fatalTrap, q, 'Errore Grave');
          else snippet = extractSnippet(qMatch.expectedAnswer, q, 'Risposta Attesa');
        } else if (patientMatch) {
          snippet = extractSnippet(c.patient, q, 'Presentazione Clinica');
        } else {
          snippet = extractSnippet(c.patient || c.title, q, 'Caso Clinico');
        }

        results.push({
          id: `oral-${c.id || i}`,
          category: 'oral',
          badge: 'ORALE',
          badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          title: c.title,
          subtitle: `${c.discipline} • Stazione Orale #${i + 1}`,
          snippet,
          action: () => {
            setTargetOralStationId(i + 1);
            setActiveTab('oral');
            setSearchModalOpen(false);
          }
        });
      }
    }

    // 3. DATABASE SCRITTI (48 MCQ Ufficiali con razionali completi)
    for (const quest of questionsData as any[]) {
      const topicMatch = quest.topic?.toLowerCase().includes(q);
      const questMatch = quest.question?.toLowerCase().includes(q);
      const explMatch = quest.explanation?.toLowerCase().includes(q);
      const optMatch = quest.options && quest.options.some((o: any) => o.text?.toLowerCase().includes(q));

      if (topicMatch || questMatch || explMatch || optMatch) {
        let snippet = '';
        if (explMatch) snippet = extractSnippet(quest.explanation, q, 'Razionale Ufficiale');
        else snippet = extractSnippet(quest.question, q, 'Quesito');

        results.push({
          id: `quiz-${quest.id}`,
          category: 'quiz',
          badge: 'QUIZ',
          badgeColor: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
          title: `Quiz: ${quest.topic || 'Quesito Ufficiale'}`,
          subtitle: quest.examSession || 'Database Scritti Moodle',
          snippet,
          action: () => {
            setTargetQuestionId(quest.id);
            setActiveTab('quiz');
            setSearchModalOpen(false);
          }
        });
      }
    }

    // 4. SCORE CLINICI & CALCOLATORI PROGNOSTICI
    const CALCULATOR_DATA = [
      { id: 'wells-pe', name: 'Score di Wells (Embolia Polmonare)', desc: 'Stratificazione probabilistica pre-test per EP acuta (D-Dimero vs Angio-TC)', keywords: ['wells', 'ep', 'pe', 'embolia', 'polmonare', 'd-dimero', 'angio-tc', 'score', 'dispnea', 'tachicardia'] },
      { id: 'wells-dvt', name: 'Score di Wells (TVP)', desc: 'Probabilità clinica pre-test per trombosi venosa profonda arti inferiori', keywords: ['wells', 'tvp', 'dvt', 'trombosi', 'edema', 'fovea', 'polpaccio', 'tromboembolismo'] },
      { id: 'cha2ds2-vasc', name: 'CHA2DS2-VASc Score', desc: 'Rischio tromboembolico e ictus nella fibrillazione atriale (FA) & indicazione a DOAC/Warfarin', keywords: ['cha2ds2', 'vasc', 'chads', 'fa', 'fibrillazione', 'stroke', 'ictus', 'doac', 'warfarin', 'anticoagulante'] },
      { id: 'has-bled', name: 'HAS-BLED Score', desc: 'Rischio di emorragia maggiore in pazienti in terapia anticoagulante orale', keywords: ['has-bled', 'hasbled', 'emorragia', 'sanguinamento', 'anticoagulante', 'inr', 'ipertensione'] },
      { id: 'euroscore-2', name: 'EuroSCORE II', desc: 'Rischio di mortalità cardiochirurgica pre-operatoria per SAVR, TAVI, CABG e aorta', keywords: ['euroscore', 'euroscore 2', 'euroscore ii', 'cardiochirurgia', 'savr', 'tavi', 'cabg', 'mortalita', 'rischio chirurgico'] },
      { id: 'curb65', name: 'CURB-65 Score', desc: 'Severità e setting di ricovero (domicilio vs reparto vs UTI) per polmonite comunitaria (CAP)', keywords: ['curb65', 'curb-65', 'curb', 'polmonite', 'cap', 'confusione', 'urea', 'tachipnea', 'ricovero', 'uti'] },
      { id: 'light', name: 'Criteri di Light (Versamento Pleurico)', desc: 'Diagnosi differenziale tra essudato e trasudato su toracentesi (proteine e LDH)', keywords: ['light', 'criteri di light', 'versamento', 'pleura', 'essudato', 'trasudato', 'ldh', 'proteine', 'toracentesi'] },
      { id: 'abi', name: 'Indice ABI (Ankle-Brachial Index)', desc: 'Indice pressorio caviglia-braccio per diagnosi e severità di AOCP e ischemia periferica', keywords: ['abi', 'ankle-brachial', 'indice', 'caviglia', 'braccio', 'aocp', 'ischemia', 'arteriopatia', 'claudicatio', 'doppler'] },
    ];

    for (const calc of CALCULATOR_DATA) {
      if (calc.name.toLowerCase().includes(q) || calc.desc.toLowerCase().includes(q) || calc.keywords.some(k => k.includes(q) || q.includes(k))) {
        results.push({
          id: `calc-${calc.id}`,
          category: 'tool',
          badge: 'SCORE',
          badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
          title: calc.name,
          subtitle: 'Calcolatore Clinico & Valutazione Rischio',
          snippet: extractSnippet(calc.desc, q, 'Indicazione'),
          action: () => {
            setTargetCalculatorId(calc.id);
            setActiveTab('calculators');
            setSearchModalOpen(false);
          }
        });
      }
    }

    // 5. FONOTECA AUSCULTATORIA (Audio reali cardiopolmonari)
    const AUDIO_DATA = [
      { id: 's1-s2', name: 'Toni Fisiologici Normali (S1 - S2)', desc: 'Auscultazione cardiaca fisiologica, chiusura valvole AV e semilunari', keywords: ['toni', 'fisiologici', 's1', 's2', 'auscultazione normale', 'focolai'] },
      { id: 'aortic-stenosis', name: 'Stenosi Aortica (Soffio Meso-sistolico ad Eiezione)', desc: 'Soffio aspro a diamante in crescendo-decrescendo al focolaio aortico con irradiazione carotidea', keywords: ['stenosi aortica', 'soffio sistolico', 'diamante', 'eiezione', 'carotidi', 'parvus et tardus', 'calcifica'] },
      { id: 'mitral-regurgitation', name: 'Insufficienza Mitralica (Soffio Olo-sistolico)', desc: 'Soffio olosistolico soffiante all\'apice con irradiazione tipica al cavo ascellare', keywords: ['insufficienza mitralica', 'rigurgito', 'soffio olosistolico', 'ascella', 'apice', 'prolasso', 'papillare'] },
      { id: 'mitral-stenosis', name: 'Stenosi Mitralica (Schiocco & Rullio Diastolico)', desc: 'S1 accentuato, schiocco d\'apertura e rullio diastolico con rinforzo presistolico', keywords: ['stenosi mitralica', 'rullio', 'diastolico', 'schiocco', 'opening snap', 'reumatica'] },
      { id: 'aortic-regurgitation', name: 'Insufficienza Aortica (Soffio Diastolico in Decrescendo)', desc: 'Soffio diastolico dolce aspirativo al punto di Erb, polso scoccante di Corrigan', keywords: ['insufficienza aortica', 'soffio diastolico', 'decrescendo', 'erb', 'corrigan'] },
      { id: 's3', name: 'Terzo Tono S3 (Galoppo Protodiastolico)', desc: 'Riempimento ventricolare rapido, indice di sovraccarico di volume e scompenso HFrEF', keywords: ['s3', 'terzo tono', 'galoppo', 'protodiastolico', 'scompenso', 'hfref', 'sovraccarico'] },
      { id: 's4', name: 'Quarto Tono S4 (Galoppo Presistolico)', desc: 'Sistole atriale forzata contro ventricolo ipertrofico rigido, ipertensione e compliance ridotta', keywords: ['s4', 'quarto tono', 'galoppo presistolico', 'atrio', 'ipertrofia', 'compliance'] },
      { id: 'pericardial-rub', name: 'Sfregamenti Pericardici & Pleurici', desc: 'Rumore superficiale aspro tipo cuoio spiegazzato, patognomonico di pericardite o pleurite', keywords: ['sfregamento', 'sfregamenti', 'pericardite', 'pleurite', 'pericardico', 'pleurico', 'rub', 'cuoio'] },
      { id: 'crackles', name: 'Rantoli Crepitanti Tele-inspiratori (Crackles / Velcro)', desc: 'Disostruzione alveolare a scatto tipica di edema polmonare acuto (EPA) e fibrosi (IPF)', keywords: ['rantoli', 'crepitanti', 'crackles', 'velcro', 'edema polmonare', 'epa', 'fibrosi', 'polmonite'] },
      { id: 'wheezing', name: 'Sibili & Fischi Espiratori (Wheezing)', desc: 'Broncospasmo diffuso e rimodellamento bronchiale in asma bronchiale e BPCO', keywords: ['sibili', 'wheezing', 'fischi', 'asma', 'bpco', 'broncospasmo', 'espirazione'] },
      { id: 'bronchial-breath', name: 'Soffio Tubarico / Respiro Bronchiale Patologico', desc: 'Trasmissione diretta dei suoni tracheali su parenchima consolidato (polmonite lobare)', keywords: ['soffio tubarico', 'respiro bronchiale', 'addensamento', 'polmonite lobare', 'consolidamento'] },
    ];

    for (const track of AUDIO_DATA) {
      if (track.name.toLowerCase().includes(q) || track.desc.toLowerCase().includes(q) || track.keywords.some(k => k.includes(q) || q.includes(k))) {
        results.push({
          id: `audio-${track.id}`,
          category: 'media',
          badge: 'FONOTECA',
          badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          title: track.name,
          subtitle: 'Fonoteca Auscultatoria Audio Reale',
          snippet: extractSnippet(track.desc, q, 'Reperto'),
          action: () => {
            setTargetAudioTrackId(track.id);
            setActiveTab('auscultation');
            setSearchModalOpen(false);
          }
        });
      }
    }

    // 6. ATLANTE ANATOMICO WEBGL 3D
    const ATLAS_3D_DATA = [
      { id: 'heart', name: 'Atlante 3D: Cuore Interno & Apparato Valvolare', desc: 'Dissezione 3D di atri, ventricoli, setti e apparato sottovalvolare mitro-aortico', keywords: ['3d', 'cuore', 'anatomia', 'valvole', 'mitrale', 'aorta', 'ventricolo', 'atrio'] },
      { id: 'beating', name: 'Atlante 3D: Battito Cardiaco & Ciclo Dinamico', desc: 'Modello 3D dinamico in tempo reale della cinetica ventricolare e meccanica cardiaca', keywords: ['3d', 'cuore battente', 'dinamico', 'cinetica', 'sistole', 'diastole', 'fisiologia'] },
      { id: 'lungs', name: 'Atlante 3D: Albero Respiratorio & Lobi Polmonari', desc: 'Ricostruzione 3D di trachea, carena T4-T5, albero bronchiale e lobi polmonari', keywords: ['3d', 'polmoni', 'albero respiratorio', 'trachea', 'bronchi', 'carena', 'lobi', 'pneumo'] },
      { id: 'aorta', name: 'Atlante 3D: Aorta Toracica & Tronchi Sovra-Aortici', desc: 'Radice, aorta ascendente, arco aortico con tronchi sovra-aortici e aorta discendente', keywords: ['3d', 'aorta', 'arco aortico', 'dissecazione', 'tronco anonimo', 'carotide', 'taa'] },
      { id: 'coronary', name: 'Atlante 3D: Albero Coronarico & Circolo Ischemico', desc: 'Tronco comune, IVA, circonflessa Cx e coronaria destra nel quadro ischemico', keywords: ['3d', 'coronarie', 'albero coronarico', 'iva', 'discendente anteriore', 'circonflessa', 'stemi'] },
    ];

    for (const m of ATLAS_3D_DATA) {
      if (m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q) || m.keywords.some(k => k.includes(q) || q.includes(k))) {
        results.push({
          id: `3d-${m.id}`,
          category: 'media',
          badge: 'ATLANTE 3D',
          badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          title: m.name,
          subtitle: 'Atlante Anatomico WebGL Interattivo',
          snippet: extractSnippet(m.desc, q, 'Struttura'),
          action: () => {
            setFocus3DTarget(m.id);
            setShow3DDrawer(true);
            setSearchModalOpen(false);
          }
        });
      }
    }

    // 7. STRUMENTI SPECIALISTICI MEDTERMINAL
    const TOOLS_DATA = [
      { id: 'scanner' as TabType, name: 'Scanner Diagnostico Integrato (DDx)', badge: 'SCANNER', desc: 'Algoritmo diagnostico differenziale basato sulla selezione combinata di sintomi e segni clinici', keywords: ['scanner', 'ddx', 'diagnosi differenziale', 'sintomi', 'segni', 'matrice'] },
      { id: 'ecg' as TabType, name: 'Monitor ECG Dinamico & Simulator', badge: 'ECG', desc: 'Tracciati elettrocardiografici interattivi: STEMI, Fibrillazione Atriale, Flutter, BAV 3° grado', keywords: ['ecg', 'elettrocardiogramma', 'telemetria', 'stemi', 'fibrillazione atriale', 'flutter', 'bav'] },
      { id: 'pfr' as TabType, name: 'Spirometria PFR & Flusso-Volume', badge: 'PFR', desc: 'Curva Flusso-Volume, Indice di Tiffeneau (FEV1/FVC), deficit ostruttivo vs restrittivo, reversibilità con salbutamolo', keywords: ['pfr', 'spirometria', 'flusso-volume', 'tiffeneau', 'fev1', 'fvc', 'broncodilatatore', 'salbutamolo', 'asma', 'bpco'] },
      { id: 'ega' as TabType, name: 'EGA Arteriosa Interpreter', badge: 'EGA', desc: 'Equilibrio acido-base (pH, PaCO2, HCO3-), Gap Anionico, insufficienza respiratoria Tipo 1 vs Tipo 2, ARDS', keywords: ['ega', 'emogasanalisi', 'pao2', 'paco2', 'hco3', 'ph', 'acidosi', 'alcalosi', 'ards'] },
      { id: 'tnm' as TabType, name: 'Stadiazione TNM & Operabilità Polmonare', badge: 'TNM', desc: 'Stadiazione 8ª Edizione per NSCLC, calcolo ppo-FEV1 e ppo-DLCO e resecabilità chirurgica', keywords: ['tnm', 'stadiazione', 'nsclc', 'tumore polmone', 'lobectomia', 'pneumonectomia', 'operabilita', 'ppo-fev1'] },
      { id: 'flowcharts' as TabType, name: 'Algoritmi Decisionali & Flowchart', badge: 'FLOWCHART', desc: 'Flowchart STEMI PCI vs trombolisi, Scompenso 4 pilastri, Embolia Polmonare, Embolectomia Fogarty', keywords: ['flowchart', 'algoritmi', 'percorsi', 'stemi', 'scompenso 4 pilastri', 'fogarty', 'ischemia acuta', 'linee guida'] },
      { id: 'pharma' as TabType, name: 'Prontuario Farmacologico & Antidoti', badge: 'PHARMA', desc: 'DOACs & antidoti specifici (Idarucizumab, Andexanet), Emergenze Ipertensive EV, Regime antitubercolare RIPE', keywords: ['farmaci', 'pharma', 'prontuario', 'doac', 'dabigatran', 'idarucizumab', 'apixaban', 'rivaroxaban', 'andexanet', 'labetalolo', 'ripe', 'tbc'] },
      { id: 'imaging' as TabType, name: 'Atlante Imaging Toracico & Radiologia', badge: 'IMAGING', desc: 'Radiografia del Torace e Angio-TC: linee di Kerley B, pneumotorace (PNX), flap intimale di dissecazione aortica', keywords: ['imaging', 'radiologia', 'rx torace', 'tc torace', 'angio-tc', 'kerley b', 'pneumotorace', 'dissecazione aortica'] },
    ];

    for (const tool of TOOLS_DATA) {
      if (tool.name.toLowerCase().includes(q) || tool.desc.toLowerCase().includes(q) || tool.keywords.some(k => k.includes(q) || q.includes(k))) {
        results.push({
          id: `tool-${tool.id}`,
          category: 'tool',
          badge: tool.badge,
          badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          title: tool.name,
          subtitle: 'Strumento Specialistico MedTerminal',
          snippet: extractSnippet(tool.desc, q, 'Funzionalità'),
          action: () => {
            setActiveTab(tool.id);
            setSearchModalOpen(false);
          }
        });
      }
    }

    return results;
  }, [searchQuery]);

  // Category counts and filtered visible results
  const categoryCounts = useMemo(() => {
    const counts = {
      all: searchResults.length,
      theory: 0,
      quiz: 0,
      oral: 0,
      tool: 0,
      media: 0
    };
    for (const r of searchResults) {
      if ((counts as any)[r.category] !== undefined) {
        (counts as any)[r.category]++;
      }
    }
    return counts;
  }, [searchResults]);

  const visibleResults = useMemo(() => {
    if (activeSearchCategory === 'all') return searchResults.slice(0, 30);
    return searchResults.filter(r => r.category === activeSearchCategory).slice(0, 30);
  }, [searchResults, activeSearchCategory]);

  useEffect(() => {
    setSelectedSearchIndex(0);
  }, [searchQuery, activeSearchCategory]);

  useEffect(() => {
    const el = document.getElementById(`search-res-${selectedSearchIndex}`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [selectedSearchIndex]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev < visibleResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, visibleResults.length - 1)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (visibleResults[selectedSearchIndex]) {
        visibleResults[selectedSearchIndex].action();
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans overflow-hidden selection:bg-cyan-500/30 selection:text-white">
      
      {/* MOBILE TOPBAR */}
      <header className="lg:hidden fixed top-0 inset-x-0 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-4 z-40">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-2 text-cyan-400 text-left focus:outline-none group"
        >
          <Heart className="w-5 h-5 fill-cyan-400/20 text-cyan-400 shrink-0 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-mono font-bold tracking-tight text-white text-sm leading-tight">MedTerminal</span>
            <span className="text-[10px] text-cyan-400 font-mono">Studio Esame Integrato</span>
          </div>
        </button>
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
        <button
          onClick={() => setActiveTab('home')}
          className="h-16 flex items-center justify-between px-5 border-b border-slate-850 bg-slate-950/60 backdrop-blur-md text-left w-full hover:bg-slate-900/50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-cyan-400/20" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>MedTerminal</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Esame
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">Cardio-Toracico Integrato</div>
            </div>
          </div>
        </button>

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

        {/* 3D Atlas Drawer Launcher & Creator Badge */}
        <div className="p-3 border-t border-slate-850 bg-slate-950 space-y-2.5">
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

          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 px-1 font-sans">
            <a
              href="https://github.com/Lukecele"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center gap-1 group truncate"
              title="GitHub Luca Celebrano"
            >
              <span>By <strong className="text-slate-300 group-hover:text-cyan-300 font-medium">Luca Celebrano</strong></span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
            </a>
            <span className="text-slate-500 truncate text-[10px]" title="Note PDF di Lorenzo Pessetti per la teoria">
              Note: PDF L. Pessetti
            </span>
          </div>
        </div>

      </aside>

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-1 flex flex-col h-full bg-[#07090e] pt-16 lg:pt-0 overflow-hidden relative">
        <div ref={mainScrollRef} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          
          <div className="p-3 sm:p-4 lg:p-8 flex-1">
            <div className={`max-w-[1500px] mx-auto transition-all duration-300 ${show3DDrawer ? '2xl:pr-[470px]' : ''}`}>
              
              {/* VIEW ROUTER */}
              {activeTab === 'home' && (
                <HomePage
                  onNavigate={(tab) => {
                    setActiveTab(tab);
                  }}
                  onOpen3D={() => {
                    setShow3DDrawer(true);
                  }}
                  onOpenSearch={() => {
                    setSearchModalOpen(true);
                  }}
                  onOpenLegalModal={() => {
                    setExternalLegalOpen(true);
                  }}
                />
              )}

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
                <OralExamSimulator
                  initialStationId={targetOralStationId}
                  onNavigateTopic={(topicId: string) => {
                    setActiveTopicId(topicId);
                    setActiveTab('theory');
                  }}
                />
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

          {/* SLIDE-OUT 3D ATLAS DRAWER / MODAL WORKSTATION */}
          {show3DDrawer && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setShow3DDrawer(false)}
                className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 transition-opacity"
              />
              <div
                className={`fixed z-50 bg-slate-950 shadow-2xl transition-all duration-300 flex flex-col ${
                  is3DMaximized
                    ? 'inset-2 sm:inset-4 lg:inset-6 rounded-2xl border border-slate-700/80 overflow-hidden'
                    : 'right-0 top-0 bottom-0 w-full sm:w-[600px] md:w-[740px] lg:w-[880px] xl:w-[1040px] border-l border-slate-800'
                }`}
              >
                <div className="h-full flex flex-col">
                  {/* Top Bar Header */}
                  <div className="p-3.5 sm:p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950 shrink-0">
                    <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                      <Layers className="w-4 h-4" />
                      <span>Atlante Anatomico 3D & Schemi Clinici</span>
                      <span className="text-[10px] hidden sm:inline px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {is3DMaximized ? 'SCHERMO INTERO' : 'WORKSTATION'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIs3DMaximized(!is3DMaximized)}
                        className="text-slate-400 hover:text-white bg-slate-900 border border-slate-800 p-1.5 rounded-lg transition hidden sm:flex items-center"
                        title={is3DMaximized ? "Riduci a pannello laterale" : "Ingrandisci a schermo intero"}
                      >
                        {is3DMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setShow3DDrawer(false)}
                        className="text-slate-400 hover:text-white bg-slate-900 border border-slate-800 p-1.5 rounded-lg transition"
                        title="Chiudi"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Main Viewport Content */}
                  <div className="flex-1 relative overflow-hidden">
                    <Anatomy3DViewport
                      focusTarget={focus3DTarget}
                      onSelectTarget={(target) => setFocus3DTarget(target)}
                      isMaximized={is3DMaximized}
                      onToggleMaximize={() => setIs3DMaximized(!is3DMaximized)}
                      onClose={() => setShow3DDrawer(false)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* FOOTER CLEANLY ANCHORED AT BOTTOM OF SCROLL CONTAINER */}
          <Footer
            isHome={activeTab === 'home'}
            externalLegalOpen={externalLegalOpen}
            onCloseExternalLegal={() => setExternalLegalOpen(false)}
          />

        </div>
      </main>

      {/* CTRL+K SEARCH MODAL */}
      {searchModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-start pt-[8vh] sm:pt-[10vh] px-4 animate-in fade-in duration-200"
        >
          <div className="bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/80 animate-in zoom-in-95 duration-200 flex flex-col max-h-[82vh]">
            
            {/* Input Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950 flex flex-col gap-3">
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Cerca patologie, farmaci, esami, cut-off, ECG, quiz, audio, 3D..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-sm font-sans"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-500 hover:text-slate-300 rounded cursor-pointer"
                    title="Cancella ricerca"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="px-2.5 py-1 bg-slate-800 text-slate-400 rounded-lg text-[11px] font-mono uppercase hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  Esc
                </button>
              </div>

              {/* Category Pills (Filter chips) */}
              {searchQuery.trim().length >= 2 && searchResults.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 custom-scrollbar text-xs font-mono">
                  {[
                    { id: 'all', label: 'Tutti', count: categoryCounts.all },
                    { id: 'theory', label: 'Teoria', count: categoryCounts.theory },
                    { id: 'quiz', label: 'Quiz', count: categoryCounts.quiz },
                    { id: 'oral', label: 'Orali', count: categoryCounts.oral },
                    { id: 'tool', label: 'Score & Tool', count: categoryCounts.tool },
                    { id: 'media', label: 'Audio & 3D', count: categoryCounts.media },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveSearchCategory(cat.id as any)}
                      className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                        activeSearchCategory === cat.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] opacity-75">({cat.count})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Results Body */}
            <div className="flex-1 overflow-y-auto p-2.5 custom-scrollbar space-y-1.5">
              {searchQuery.trim().length < 2 ? (
                <div className="p-10 text-center space-y-2">
                  <Search className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">Ricerca Globale MedTerminal</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Digita almeno 2 caratteri per esplorare in tempo reale tutti i 16 capitoli teorici, 48 MCQ scritti, 5 stazioni orali, 7 calcolatori clinici, 11 audio e modelli 3D.
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 pt-3">
                    {['STEMI', 'Dispnea', 'Troponina', 'Wells', 'Warfarin', 'Aorta', 'Gallavardin', 'Kerley'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 text-xs font-mono border border-slate-800 transition cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : visibleResults.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <X className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">
                    Nessun risultato corrispondente a "{searchQuery}"
                  </p>
                  <p className="text-xs text-slate-500">
                    Prova a verificare il termine di ricerca o seleziona la scheda "Tutti" se hai applicato un filtro di categoria.
                  </p>
                </div>
              ) : (
                visibleResults.map((res, i) => {
                  const isSelected = i === selectedSearchIndex;
                  return (
                    <button
                      key={res.id}
                      id={`search-res-${i}`}
                      onClick={res.action}
                      onMouseEnter={() => setSelectedSearchIndex(i)}
                      className={`w-full text-left p-3 rounded-xl transition flex items-start justify-between group border cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg'
                          : 'bg-slate-900/60 border-slate-800/70 hover:bg-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0 pr-3 flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border tracking-wider shrink-0 ${res.badgeColor}`}>
                            {res.badge}
                          </span>
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                            {renderHighlight(res.title, searchQuery)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate pl-0.5">
                          {renderHighlight(res.subtitle, searchQuery)}
                        </div>
                        {res.snippet && (
                          <div className="text-[11px] text-slate-300 bg-slate-950/70 border border-slate-800/80 rounded-lg p-2 font-mono leading-relaxed mt-1">
                            {renderHighlight(res.snippet, searchQuery)}
                          </div>
                        )}
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition ${
                        isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                      }`} />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with Keyboard Hints */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 px-4 gap-2">
              <div className="flex items-center space-x-3">
                <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">↑↓</kbd> Naviga</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">↵</kbd> Apri</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Esc</kbd> Chiudi</span>
              </div>
              <div>
                {searchResults.length > 0 && searchQuery.trim().length >= 2 ? (
                  <span className="text-cyan-400/90 font-bold">
                    {visibleResults.length} di {searchResults.length} {searchResults.length === 1 ? 'risultato' : 'risultati'}
                  </span>
                ) : (
                  <span>MedTerminal Clinical Search</span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PRIVACY & COOKIE BANNER */}
      <CookieBanner onOpenLegalModal={() => setExternalLegalOpen(true)} />

    </div>
  );
}

export default App;
