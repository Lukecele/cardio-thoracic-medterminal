import React, { useState, useEffect, useRef } from 'react';
import {
  Layers, RefreshCw, Sparkles, Image as ImageIcon,
  Box, CheckCircle2, ZoomIn, ZoomOut, ChevronRight,
  Eye, EyeOff, MapPin, RotateCcw
} from 'lucide-react';

export interface Anatomy3DViewportProps {
  focusTarget?: string | null;
  onSelectTarget?: (target: string) => void;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  onClose?: () => void;
}

export type Model3DKey = 'heart' | 'beating' | 'lungs' | 'aorta' | 'coronary';

export interface LandmarkItem {
  structure: string;
  detail: string;
  clinicalNote: string;
  x: number; // % from left on 1:1 plate
  y: number; // % from top on 1:1 plate
}

export interface ModelConfig {
  id: Model3DKey;
  name: string;
  badge: string;
  category: string;
  embedUrl: string;
  posterImage: string;
  description: string;
  landmarks: LandmarkItem[];
  clinicalExamYield: string;
  examQuestionsFocus: string[];
}

const MODEL_CONFIGS: Record<Model3DKey, ModelConfig> = {
  heart: {
    id: 'heart',
    name: 'Cuore Interno & Apparato Valvolare',
    badge: 'CARDIO-HD',
    category: 'Anatomia Clinica & Valvole',
    embedUrl: 'https://sketchfab.com/models/9f48eaa481cc4a43baeb9e1f03882cff/embed?autostart=1&ui_theme=dark&ui_hint=0&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&dnt=1',
    posterImage: '/anatomy/atlas_heart.webp',
    description: 'Sezione coronale volumetrica delle 4 camere cardiache: miocardio ventricolare, setto interventricolare, apparato sottovalvolare mitro-tricuspidale e radice aortica.',
    landmarks: [
      {
        structure: 'Ventricolo Sinistro (LV)',
        detail: 'Pareti ad alto spessore miocardico (normale 8-11 mm) calibrate per il regime pressorio sistemico arterioso.',
        clinicalNote: 'Sviluppa ipertrofia concentrica nella stenosi aortica o ipertensione cronica; dilatazione eccentrica nei rigurgiti.',
        x: 66,
        y: 71,
      },
      {
        structure: 'Ventricolo Destro (RV)',
        detail: 'Camera semilunare a bassa pressione ed elevata distensibilità per il piccolo circolo polmonare.',
        clinicalNote: 'Vulnerabile al sovraccarico acuto di pressione (cuore polmonare in embolia polmonare massiva) e all\'infarto inferiore (V4R).',
        x: 42,
        y: 69,
      },
      {
        structure: 'Valvola Mitrale & Apparato Sottovalvolare',
        detail: 'Lembo anteriore (aortico) e posteriore ancorati tramite corde tendinee ai muscoli papillari antero-laterale e postero-mediale.',
        clinicalNote: 'La rottura del papillare postero-mediale (vascolarizzato dalla sola CDx) post-STEMI provoca IM acuta massiva ed edema polmonare.',
        x: 63,
        y: 53,
      },
      {
        structure: 'Radice Aortica & Arco',
        detail: 'Valvola semilunare tricuspide con seni di Valsalva da cui originano gli osti coronarici destro e sinistro.',
        clinicalNote: 'Sede di stenosi aortica calcifica degenerativa, ectasia annulo-aortica e dissezione Stanford Tipo A.',
        x: 49,
        y: 27,
      },
    ],
    clinicalExamYield: 'Fondamentale per correlare anatomia e semeiotica: stenosi mitralica (rullio diastolico + opening snap), insufficienza mitralica (soffio olosistolico all\'apice) e stenosi aortica calcifica (soffio a diamante irradiato alle carotidi).',
    examQuestionsFocus: ['Rottura papillare post-STEMI', 'Semeiotica dei soffi valvolari', 'Insufficienza aortica & radice'],
  },
  beating: {
    id: 'beating',
    name: 'Ciclo Cardiaco & Emodinamica',
    badge: 'FISIOLOGIA-HD',
    category: 'Emodinamica & Flussi',
    embedUrl: 'https://sketchfab.com/models/09ce20e146b24f71943b13dcdf099db9/embed?autostart=1&ui_theme=dark&ui_hint=0&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&dnt=1',
    posterImage: '/anatomy/atlas_beating.webp',
    description: 'Mappatura volumetrica dei flussi emodinamici (sangue venoso blu a destra → polmonare; ossigenato rosso a sinistra → aorta) e delle fasi meccaniche del ciclo cardiaco.',
    landmarks: [
      {
        structure: 'Sistole Ventricolare & Eiezione (LV → Aorta)',
        detail: 'Contrazione isovolumetrica seguita da eiezione rapida attraverso la valvola aortica verso il circolo sistemico.',
        clinicalNote: 'Definisce la Frazione di Eiezione (FE = SV / EDV × 100); FE ≤ 40% identifica lo scompenso HFrEF (4 pilastri Classe I ESC).',
        x: 59,
        y: 62,
      },
      {
        structure: 'Diastole & Riempimento Rapido',
        detail: 'Rilasciamento attivo ATP-dipendente (SERCA2a) e riempimento protodiastolico rapido ventricolare.',
        clinicalNote: 'Genesi del galoppo protodiastolico S3: brusco arresto della colonna ematica in un ventricolo dilatato e sovraccarico.',
        x: 44,
        y: 71,
      },
      {
        structure: 'Sistole Atriale ("Atrial Kick")',
        detail: 'Contrazione atriale telediastolica responsabile del 20-30% del riempimento ventricolare finale.',
        clinicalNote: 'Genesi del quarto tono (S4, ventricolo rigido/ipertrofico); la sua perdita in Fibrillazione Atriale precipita lo scompenso.',
        x: 65,
        y: 41,
      },
    ],
    clinicalExamYield: 'Collega il loop pressione-volume, la legge di Frank-Starling e di Laplace alla clinica dello scompenso cardiaco, dei galoppi S3/S4 e dello shock cardiogeno.',
    examQuestionsFocus: ['FE e classificazione HFrEF/HFpEF', 'Genesi di S3 ed S4', 'Impatto della FA sul riempimento'],
  },
  coronary: {
    id: 'coronary',
    name: 'Circolo Arterioso Coronarico',
    badge: 'CORONARICO-HD',
    category: 'Emodinamica & STEMI',
    embedUrl: 'https://sketchfab.com/models/00b5f4ec0b984325b453f8df07cd0cb5/embed?autostart=1&ui_theme=dark&ui_hint=0&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&dnt=1',
    posterImage: '/anatomy/atlas_coronary.webp',
    description: 'Albero arterioso coronarico epicardico: Tronco Comune, Arteria Interventricolare Anteriore (IVA / LAD) con rami diagonali, Circonflessa (LCx) e Coronaria Destra (CDx).',
    landmarks: [
      {
        structure: 'Arteria Interventricolare Anteriore (IVA / LAD)',
        detail: 'Decorre nel solco interventricolare anteriore irrorando parete anteriore, apice e 2/3 anteriori del setto interventricolare.',
        clinicalNote: 'Occlusione acuta → STEMI Antero-Settale (V1-V4); stenosi critica sub-occlusiva prossimale → Sindrome di Wellens (T invertite/bifasiche V2-V3).',
        x: 59,
        y: 63,
      },
      {
        structure: 'Arteria Circonflessa (LCx)',
        detail: 'Decorre nel solco atrioventricolare sinistro emettendo i rami marginali ottusi per la parete laterale e infero-basale.',
        clinicalNote: 'Occlusione acuta → STEMI Laterale (DI, aVL, V5-V6) o Posteriore (ST depresso V1-V3 con ST sopraslivellato in V7-V9).',
        x: 69,
        y: 49,
      },
      {
        structure: 'Arteria Coronaria Destra (CDx)',
        detail: 'Origina dal seno di Valsalva destro, irrora ventricolo destro, nodo SA/AV e (nell\'85% dominanza dx) la parete inferiore.',
        clinicalNote: 'Occlusione acuta → STEMI Inferiore (DII, DIII, aVF) + rischio di Infarto del VD (V4R: EVITARE nitrati!) e BAV.',
        x: 31,
        y: 60,
      },
    ],
    clinicalExamYield: 'Correlazione diretta tra vaso coronarico colpevole, territorio miocardico, derivazioni ECG e scelta del condotto di bypass (LIMA su IVA gold standard).',
    examQuestionsFocus: ['Correlazione coronaria → derivazioni ECG', 'Infarto VD & derivazioni V4R', 'LIMA su IVA nel CABG'],
  },
  lungs: {
    id: 'lungs',
    name: 'Albero Respiratorio & Lobi Polmonari',
    badge: 'PNEUMO-HD',
    category: 'Pneumologia & Chirurgia Toracica',
    embedUrl: 'https://sketchfab.com/models/250911151757489da1cf5501b791f363/embed?autostart=1&ui_theme=dark&ui_hint=0&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&dnt=1',
    posterImage: '/anatomy/atlas_lungs.webp',
    description: 'Anatomia tracheo-bronchiale e lobare: trachea a C cartilaginee, carena (T4-T5), polmone destro trilobato con scissure e polmone sinistro traslucido con albero bronchiale segmentario.',
    landmarks: [
      {
        structure: 'Trachea & Carena (T4-T5)',
        detail: '16-20 anelli cartilaginei a C con parete membranosa posteriore; biforcazione carenale all\'angolo sternale di Louis.',
        clinicalNote: 'Coinvolgimento tumorale della carena definisce lo stadio T4 nella stadiazione TNM 9ª Edizione (NSCLC).',
        x: 50,
        y: 36,
      },
      {
        structure: 'Bronco Principale Destro vs Sinistro',
        detail: 'Il destro è più corto (2-2.5 cm), ampio e verticale (~25°); il sinistro è più lungo (5 cm) e orizzontale (~45°).',
        clinicalNote: 'I corpi estranei inalati e le polmoniti ab ingestis finiscono selettivamente nel bronco/lobo inferiore destro.',
        x: 58,
        y: 43,
      },
      {
        structure: 'Polmone Destro (3 Lobi — 10 Segmenti)',
        detail: 'Lobo superiore (3 seg.), medio (2 seg.) e inferiore (5 seg.) separati da scissura orizzontale e obliqua.',
        clinicalNote: 'Base del calcolo ppo-FEV1 / ppo-DLCO pre-lobectomia (su 19 segmenti polmonari totali).',
        x: 29,
        y: 54,
      },
      {
        structure: 'Polmone Sinistro (2 Lobi — 9 Segmenti)',
        detail: 'Lobo superiore (con lingula, omologa del lobo medio) e inferiore separati dall\'unica scissura obliqua.',
        clinicalNote: 'L\'albero segmentario guida la segmentectomia anatomica VATS nei tumori periferici ≤ 2 cm (T1a-T1b N0).',
        x: 72,
        y: 56,
      },
    ],
    clinicalExamYield: 'Indispensabile per la stadiazione TNM 9ª Ed. (stazioni linfonodali N1/N2a/N2b/N3), il calcolo dei segmenti resecati (ppo-FEV1) e la broncoscopia.',
    examQuestionsFocus: ['TNM 9ª Ed. (N2a vs N2b)', 'Segmenti polmonari & ppo-FEV1', 'Broncoaspirazione a destra'],
  },
  aorta: {
    id: 'aorta',
    name: 'Aorta Toracica & Aneurisma (TAA)',
    badge: 'VASCOLARE-HD',
    category: 'Chirurgia Vascolare & Aorta',
    embedUrl: 'https://sketchfab.com/models/bcf37e4072de48b0aabd2e62db815cbd/embed?autostart=1&ui_theme=dark&ui_hint=0&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&dnt=1',
    posterImage: '/anatomy/atlas_aorta.webp',
    description: 'Anatomia volumetrica dell\'aorta toracica su silhouette cardiaca: radice, aorta ascendente, arco con i 3 tronchi sovraortici, istmo e dilatazione aneurismatica discendente.',
    landmarks: [
      {
        structure: 'Radice & Aorta Ascendente',
        detail: 'Tratto compreso tra anulus valvolare aortico ed emergenza del tronco anonimo brachiocefalico (calibro normale < 35 mm).',
        clinicalNote: 'Dissezione Stanford Tipo A: emergenza cardiochirurgica assoluta (intervento di Bentall / Tirone David).',
        x: 42,
        y: 41,
      },
      {
        structure: 'Arco Aortico & 3 Tronchi Sovraortici',
        detail: 'Origine in sequenza di: 1) Tronco brachiocefalico anonimo, 2) Carotide comune sinistra, 3) Arteria succlavia sinistra.',
        clinicalNote: 'La dissezione dei tronchi causa differenza di PA > 20 mmHg tra i due arti superiori e sintomi neurologici/ictus.',
        x: 49,
        y: 20,
      },
      {
        structure: 'Istmo Aortico & Aneurisma Discendente (TAA)',
        detail: 'Zona di transizione subito a valle della succlavia sinistra (legamento arterioso), sede tipica di lesioni da decelerazione e TAA.',
        clinicalNote: 'Legge di Laplace (T = P·r / 2h): indicazione a riparazione (TEVAR / open) a ≥ 5.5 cm (o più precoce in Marfan/Loeys-Dietz).',
        x: 60,
        y: 37,
      },
    ],
    clinicalExamYield: 'Fondamentale per la classificazione di Stanford (Tipo A chirurgica vs Tipo B medica/TEVAR), Legge di Laplace e diagnosi differenziale del dolore toracico lacerante.',
    examQuestionsFocus: ['Stanford Tipo A vs Tipo B', 'Legge di Laplace & cut-off 5.5 cm', 'TEVAR vs chirurgia open'],
  },
};

export const Anatomy3DViewport: React.FC<Anatomy3DViewportProps> = ({
  focusTarget,
  onSelectTarget,
}) => {
  const [activeModelKey, setActiveModelKey] = useState<Model3DKey>('heart');
  const [viewMode, setViewMode] = useState<'atlas' | '3d'>('atlas');
  const [mobileTab, setMobileTab] = useState<'split' | 'view' | 'info'>('split');
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [selectedLandmarkIdx, setSelectedLandmarkIdx] = useState<number | null>(0);
  const [showPins, setShowPins] = useState(true);
  const [quizMode, setQuizMode] = useState(false);
  const [revealedQuizPins, setRevealedQuizPins] = useState<Set<number>>(new Set());

  // Smooth Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({ x: 0, y: 0, panX: 0, panY: 0 });

  useEffect(() => {
    if (!focusTarget) return;
    if (focusTarget === 'lungs' || focusTarget === 'thorax') setActiveModelKey('lungs');
    else if (focusTarget === 'aorta' || focusTarget === 'vessels') setActiveModelKey('aorta');
    else if (focusTarget === 'coronary') setActiveModelKey('coronary');
    else if (focusTarget === 'beating') setActiveModelKey('beating');
    else if (focusTarget === 'heart') setActiveModelKey('heart');
    setSelectedLandmarkIdx(0);
    setZoomLevel(1.0);
    setPan({ x: 0, y: 0 });
    setRevealedQuizPins(new Set());
  }, [focusTarget]);

  const activeConfig = MODEL_CONFIGS[activeModelKey] || MODEL_CONFIGS.heart;
  const activeLandmark =
    selectedLandmarkIdx !== null ? activeConfig.landmarks[selectedLandmarkIdx] : null;

  const handleSelectModel = (key: Model3DKey) => {
    setActiveModelKey(key);
    setIsIframeLoading(true);
    setSelectedLandmarkIdx(0);
    setZoomLevel(1.0);
    setPan({ x: 0, y: 0 });
    setRevealedQuizPins(new Set());
    onSelectTarget?.(key);
  };

  const resetView = () => {
    setZoomLevel(1.0);
    setPan({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoomLevel <= 1.01) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const limit = (zoomLevel - 1) * 180;
    setPan({
      x: Math.max(-limit, Math.min(limit, dragStartRef.current.panX + dx)),
      y: Math.max(-limit, Math.min(limit, dragStartRef.current.panY + dy)),
    });
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== 'atlas') return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoomLevel((prev) => {
      const next = Math.max(1.0, Math.min(2.2, Number((prev + delta).toFixed(2))));
      if (next <= 1.01) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const toggleRevealQuizPin = (idx: number) => {
    setRevealedQuizPins((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#07090e] text-slate-100 overflow-hidden">

      {/* 1. TOP HEADER & MODEL SWITCHER BAR */}
      <div className="p-3 sm:p-3.5 border-b border-slate-800 bg-slate-950/95 shrink-0 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <span>Atlante Anatomico Volumetrico HD</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                  ISTANTANEO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Tavole 3D volumetriche ad alta definizione con pin interattivi sincronizzati e quiz anatomico
              </p>
            </div>
          </div>

          {/* Mode Toggle: Fast Interactive HD Atlas (Default) vs Optional 3D 360° */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('atlas')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'atlas'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tavola volumetrica HD istantanea con pin interattivi e zoom fluido"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Atlante HD</span>
            </button>
            <button
              onClick={() => {
                setViewMode('3d');
                setIsIframeLoading(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === '3d'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Carica modello esterno Sketchfab 360° (richiede qualche secondo di rete)"
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D 360° (Esterno)</span>
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Models Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {Object.values(MODEL_CONFIGS).map((cfg) => {
            const isSelected = cfg.id === activeModelKey;
            return (
              <button
                key={cfg.id}
                onClick={() => handleSelectModel(cfg.id)}
                className={`px-3 py-1.5 rounded-lg border text-left transition shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm ring-1 ring-cyan-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                <div>
                  <div className="text-[9px] font-mono uppercase font-bold text-cyan-400">
                    {cfg.badge}
                  </div>
                  <div className="text-xs font-medium whitespace-nowrap">
                    {cfg.name.split(' & ')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Layout Tabs */}
        <div className="flex lg:hidden items-center justify-between pt-1 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-mono">Vista mobile:</div>
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            {([
              { id: 'split', label: 'Divisa' },
              { id: 'view', label: 'Solo Tavola' },
              { id: 'info', label: 'Solo Reperi' },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setMobileTab(t.id)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition ${
                  mobileTab === t.id ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSTATION BODY: SPLIT VIEW */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">

        {/* LEFT COLUMN: INTERACTIVE HD PLATE (OR OPTIONAL 3D IFRAME) */}
        <div
          className={`lg:col-span-7 flex flex-col bg-[#07090e] relative border-r border-slate-800/80 overflow-hidden ${
            mobileTab === 'info' ? 'hidden lg:flex' : 'flex'
          } ${mobileTab === 'split' ? 'h-[310px] sm:h-[380px] lg:h-full shrink-0' : 'flex-1 lg:h-full'}`}
        >
          {viewMode === 'atlas' ? (
            <div className="relative w-full h-full flex flex-col bg-[#07090e] overflow-hidden">

              {/* Top Floating Controls */}
              <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <button
                    onClick={() => setShowPins(!showPins)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition backdrop-blur-md ${
                      showPins
                        ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40'
                        : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                    title="Mostra o nascondi i pin numerati sull'organo"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Pin {showPins ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const next = !quizMode;
                      setQuizMode(next);
                      setRevealedQuizPins(new Set());
                      if (next) setShowPins(true);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition backdrop-blur-md ${
                      quizMode
                        ? 'bg-amber-500/25 text-amber-200 border-amber-400/50'
                        : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                    title="Nasconde i nomi dei reperi per interrogarsi sui numeri"
                  >
                    {quizMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{quizMode ? 'Quiz Cieco ON' : 'Quiz Anatomico'}</span>
                  </button>
                </div>

                {/* Zoom & Reset Controls */}
                <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-lg backdrop-blur-md pointer-events-auto">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.2, Number((z + 0.25).toFixed(2))))}
                    className="p-1 text-slate-300 hover:text-white rounded"
                    title="Ingrandisci"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-300 px-1 min-w-[36px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() =>
                      setZoomLevel((z) => {
                        const n = Math.max(1.0, Number((z - 0.25).toFixed(2)));
                        if (n <= 1.01) setPan({ x: 0, y: 0 });
                        return n;
                      })
                    }
                    className="p-1 text-slate-300 hover:text-white rounded"
                    title="Riduci"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  {zoomLevel > 1.01 && (
                    <button
                      onClick={resetView}
                      className="p-1 text-slate-400 hover:text-white border-l border-slate-700 pl-1.5"
                      title="Ripristina vista"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Interactive Zoomable / Pannable 1:1 Plate Stage */}
              <div
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className={`flex-1 w-full h-full flex items-center justify-center overflow-hidden p-4 select-none ${
                  zoomLevel > 1.01 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                }`}
              >
                <div
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                    transition: isDraggingRef.current ? 'none' : 'transform 0.18s ease-out',
                  }}
                  className="relative aspect-square h-full max-h-full max-w-full flex items-center justify-center"
                >
                  <img
                    src={activeConfig.posterImage}
                    alt={activeConfig.name}
                    draggable={false}
                    className="w-full h-full object-contain rounded-xl pointer-events-none"
                  />

                  {/* Synchronized Anatomical Landmark Pins */}
                  {showPins &&
                    activeConfig.landmarks.map((lm, idx) => {
                      const isActive = selectedLandmarkIdx === idx;
                      const isQuizHidden = quizMode && !revealedQuizPins.has(idx);
                      return (
                        <button
                          key={`${activeModelKey}-pin-${idx}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLandmarkIdx(idx);
                          }}
                          style={{ left: `${lm.x}%`, top: `${lm.y}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 focus:outline-none"
                          title={isQuizHidden ? `Repere #${idx + 1} (clicca per verificare)` : lm.structure}
                        >
                          {isActive && (
                            <span className="absolute inset-0 -m-1.5 rounded-full bg-cyan-400/40 animate-ping pointer-events-none" />
                          )}
                          <span
                            className={`relative flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-bold shadow-lg border-2 transition-transform ${
                              isActive
                                ? 'bg-cyan-400 text-slate-950 border-white scale-115 shadow-cyan-400/50'
                                : 'bg-slate-950/90 text-cyan-300 border-cyan-400/80 hover:scale-110 hover:bg-cyan-500 hover:text-slate-950'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Active Landmark Floating Callout Bar */}
              <div className="bg-slate-950/95 border-t border-slate-800 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
                {activeLandmark && selectedLandmarkIdx !== null ? (
                  quizMode && !revealedQuizPins.has(selectedLandmarkIdx) ? (
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="text-xs text-amber-200 font-mono">
                        <strong>Repere #{selectedLandmarkIdx + 1}:</strong> nomina la struttura e il significato clinico prima di rivelare!
                      </div>
                      <button
                        onClick={() => toggleRevealQuizPin(selectedLandmarkIdx)}
                        className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold shrink-0 transition"
                      >
                        Rivela #{selectedLandmarkIdx + 1}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 truncate">
                          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 border border-cyan-500/35 font-mono text-[10px]">
                            #{selectedLandmarkIdx + 1}
                          </span>
                          <span className="truncate">{activeLandmark.structure}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {activeLandmark.clinicalNote}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 hidden sm:inline shrink-0">
                        Rotella: zoom • Trascina: sposta
                      </span>
                    </div>
                  )
                ) : (
                  <div className="text-[11px] text-slate-400">
                    Clicca un pin numerato sulla tavola anatomica per evidenziare il repere clinico
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Optional 3D Sketchfab Iframe (Only loaded on explicit click) */
            <div className="relative w-full h-full flex flex-col bg-black">
              {isIframeLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm space-y-3 p-4 text-center">
                  <RefreshCw className="w-7 h-7 text-cyan-400 animate-spin" />
                  <div>
                    <p className="text-xs font-mono font-bold text-slate-200">Caricamento Modello 3D Esterno...</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                      Streaming da Sketchfab WebGL (può richiedere alcuni secondi)
                    </p>
                  </div>
                  <button
                    onClick={() => setViewMode('atlas')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Torna ad Atlante HD Istantaneo</span>
                  </button>
                </div>
              )}

              <iframe
                key={activeConfig.embedUrl}
                src={activeConfig.embedUrl}
                title={activeConfig.name}
                onLoad={() => setIsIframeLoading(false)}
                className="w-full flex-1 border-0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
              />

              <div className="bg-slate-950/90 border-t border-slate-800/90 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Ruota 360° con mouse/touch • Zoom con rotella</span>
                </div>
                <button
                  onClick={() => setViewMode('atlas')}
                  className="px-2.5 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition"
                >
                  ← Torna ad Atlante HD
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CLINICAL DOSSIER & SYNCHRONIZED LANDMARKS */}
        <div
          className={`lg:col-span-5 flex flex-col bg-slate-950/95 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4 ${
            mobileTab === 'view' ? 'hidden lg:flex' : 'flex'
          } ${mobileTab === 'split' ? 'flex-1' : ''}`}
        >
          {/* Active Model Header Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                {activeConfig.badge} • {activeConfig.category}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              {activeConfig.name}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
              {activeConfig.description}
            </p>
          </div>

          {/* Synchronized Key Landmarks Breakdown */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
                  Reperi Anatomici & Pin ({activeConfig.landmarks.length})
                </h4>
              </div>
              {quizMode && (
                <button
                  onClick={() => {
                    if (revealedQuizPins.size === activeConfig.landmarks.length) {
                      setRevealedQuizPins(new Set());
                    } else {
                      setRevealedQuizPins(new Set(activeConfig.landmarks.map((_, i) => i)));
                    }
                  }}
                  className="text-[10px] font-mono text-amber-300 hover:text-amber-200 underline"
                >
                  {revealedQuizPins.size === activeConfig.landmarks.length ? 'Nascondi tutti' : 'Rivela tutti'}
                </button>
              )}
            </div>

            <div className="space-y-2">
              {activeConfig.landmarks.map((item, idx) => {
                const isSelected = selectedLandmarkIdx === idx;
                const isHiddenInQuiz = quizMode && !revealedQuizPins.has(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedLandmarkIdx(idx);
                      if (quizMode && !revealedQuizPins.has(idx)) {
                        toggleRevealQuizPin(idx);
                      }
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-500/50 ring-1 ring-cyan-500/25 shadow-md'
                        : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-xs text-cyan-300 flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                            isSelected
                              ? 'bg-cyan-400 text-slate-950'
                              : 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span>{isHiddenInQuiz ? `Repere #${idx + 1} — Clicca per rivelare` : item.structure}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform shrink-0 ${isSelected ? 'rotate-90 text-cyan-400' : ''}`} />
                    </div>

                    {!isHiddenInQuiz && (
                      <>
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                          {item.detail}
                        </p>
                        <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-start gap-1.5 text-[11px] text-rose-300/90 leading-normal">
                          <span className="font-mono font-bold text-rose-400 shrink-0">📌 Clinica:</span>
                          <span>{item.clinicalNote}</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* High-Yield Exam Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/30 space-y-2 shadow-lg">
            <div className="flex items-center space-x-2 text-blue-300">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              <h5 className="text-xs font-bold font-mono uppercase tracking-wider text-blue-200">
                Rendimento d&apos;Esame Clinico
              </h5>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {activeConfig.clinicalExamYield}
            </p>

            <div className="pt-2 flex flex-wrap gap-1.5">
              {activeConfig.examQuestionsFocus.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pb-4" />
        </div>
      </div>
    </div>
  );
};

export default Anatomy3DViewport;
