import React, { useState, useEffect } from 'react';
import {
  Layers, RefreshCw, ExternalLink, Sparkles, Image as ImageIcon,
  Box, AlertTriangle, CheckCircle2, ZoomIn, ZoomOut, Maximize2,
  Minimize2, ChevronRight, Info, Eye
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
}

export interface ModelConfig {
  id: Model3DKey;
  name: string;
  badge: string;
  color: string;
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
    badge: 'CARDIO-3D',
    color: 'rose',
    category: 'Anatomia Clinica & Valvole',
    embedUrl: 'https://sketchfab.com/models/9f48eaa481cc4a43baeb9e1f03882cff/embed?autostart=1&ui_theme=dark&ui_hint=0&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&dnt=1',
    posterImage: '/anatomy/model_heart.png',
    description: 'Dissezione tridimensionale completa delle 4 camere cardiache. Visualizzazione dettagliata del miocardio di lavoro, setto interventricolare, apparato sottovalvolare mitro-tricuspidale e radice aortica.',
    landmarks: [
      {
        structure: 'Ventricolo Sinistro (LV)',
        detail: 'Pareti ad alto spessore miocardico (normale 8-11 mm) calibrate per sopportare il carico pressorio sistemico arterioso.',
        clinicalNote: 'Sviluppa ipertrofia concentrica da stenosi aortica o ipertensione cronica.'
      },
      {
        structure: 'Ventricolo Destro (RV)',
        detail: 'Camera semilunare a bassa pressione e ad elevata distensibilità per il circolo polmonare.',
        clinicalNote: 'Vulnerabile al sovraccarico acuto di pressione (es. cuore polmonare da embolia polmonare massiva).'
      },
      {
        structure: 'Valvola Mitrale & Apparato Sottovalvolare',
        detail: 'Lembo anteriore (aortico) e posteriore ancorati a corde tendinee di I, II e III ordine e muscoli papillari.',
        clinicalNote: 'Rottura del papillare postero-mediale in corso di STEMI causa rigurgito massivo acuto ed edema polmonare.'
      },
      {
        structure: 'Radice Aortica & Seni di Valsalva',
        detail: 'Tre cuspidi semilunari con emergenza degli osti coronarici destro e sinistro nei corrispondenti seni valvolari.',
        clinicalNote: 'Sede di ectasia annulo-aortica e dissezione acuta di Stanford Tipo A.'
      }
    ],
    clinicalExamYield: 'Fondamentale per comprendere la differenza tra stenosi mitralica (fusione commissurale reumatica ad alta frequenza), insufficienza mitralica (rigurgito olosistolico continuo) e stenosi aortica calcifica.',
    examQuestionsFocus: ['Quesiti su STEMI con rottura di papillare', 'Semeiotica dei soffi valvolari', 'Insufficienza aortica da ectasia radice']
  },
  beating: {
    id: 'beating',
    name: 'Battito Cardiaco & Ciclo Dinamico',
    badge: 'FISIOLOGIA-3D',
    color: 'amber',
    category: 'Emodinamica & Fisiologia',
    embedUrl: 'https://sketchfab.com/models/09ce20e146b24f71943b13dcdf099db9/embed?autostart=1&ui_theme=dark&ui_hint=0&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&dnt=1',
    posterImage: '/anatomy/model_beating.png',
    description: 'Ricostruzione dinamica in tempo reale del ciclo cardiaco: successione temporale tra contrazione isovolumetrica, eiezione rapida, rilasciamento isovolumetrico e riempimento ventricolare.',
    landmarks: [
      {
        structure: 'Sistole Ventricolare & Eiezione',
        detail: 'Accorciamento dell\'asse longitudinale base-apice combinato a torsione radiale ed ispessimento parietale.',
        clinicalNote: 'Definisce la Frazione di Eiezione (FE = SV / EDV x 100); FE < 40% indica insufficienza cardiaca HFrEF.'
      },
      {
        structure: 'Diastole & Riempimento Rapido',
        detail: 'Rilasciamento attivo miocardico mediato dal riassorbimento di calcio nel reticolo sarcoplasmatico.',
        clinicalNote: 'Genesi del terzo tono (S3): impatto della colonna ematica contro pareti dilatate e poco complianti.'
      },
      {
        structure: 'Sistole Atriale ("Atrial Kick")',
        detail: 'Contrazione atriale telediastolica che fornisce il 20-30% del volume telediastolico ventricolare totale.',
        clinicalNote: 'Genesi del quarto tono (S4); la perdita dell\'atrial kick in Fibrillazione Atriale provoca instabilità emodinamica.'
      }
    ],
    clinicalExamYield: 'Permette di visualizzare le curve pressione-volume del ventricolo sinistro, il meccanismo di Frank-Starling e la cascata fisiopatologica dello scompenso cardiaco a ridotta FE.',
    examQuestionsFocus: ['Frazione di Eiezione e volumi ventricolari', 'Genesi semiologica di S3 ed S4', 'Perdita della sistole atriale in FA']
  },
  lungs: {
    id: 'lungs',
    name: 'Albero Respiratorio & Lobi Polmonari',
    badge: 'PNEUMO-3D',
    color: 'sky',
    category: 'Anatomia Pneumologica & Toracica',
    embedUrl: 'https://sketchfab.com/models/250911151757489da1cf5501b791f363/embed?autostart=1&ui_theme=dark&ui_hint=0&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&dnt=1',
    posterImage: '/anatomy/model_lungs.png',
    description: 'Mappatura tridimensionale dell\'albero tracheo-bronchiale e dell\'architettura lobare: trachea cervicale e toracica, sperone carenale di Louis (T4-T5) e ramificazione lobare/segmentaria.',
    landmarks: [
      {
        structure: 'Trachea & Carena T4-T5',
        detail: 'Condotto fibrocartilagineo con 16-20 anelli a C aperti posteriormente sulla parete membranosa.',
        clinicalNote: 'Invasione neoplastica a meno di 2 cm dalla carena definisce lo stadio T4 (criterio di inoperabilità chirurgica).'
      },
      {
        structure: 'Bronco Principale Destro vs Sinistro',
        detail: 'Il destro è più corto (2-2.5 cm), più ampio e più verticale (angolo di ~25°); il sinistro è lungo 5 cm e orizzontale (~45°).',
        clinicalNote: 'Corpi estranei inalati e polmoniti ab ingestis si localizzano selettivamente nel bronco intermedio/lobo inferiore destro.'
      },
      {
        structure: 'Polmone Destro (3 Lobi)',
        detail: 'Lobo superiore, medio e inferiore separati dalla scissura orizzontale e dalla scissura obliqua.',
        clinicalNote: 'Sede per lobectomia d\'elezione nel carcinoma polmonare non a piccole cellule (NSCLC).'
      },
      {
        structure: 'Polmone Sinistro (2 Lobi)',
        detail: 'Lobo superiore (con lingula) e lobo inferiore separati da un\'unica scissura obliqua; ampia incisura cardiaca.',
        clinicalNote: 'La lingula rappresenta l\'omologo anatomico del lobo medio destro.'
      }
    ],
    clinicalExamYield: 'Essenziale per la stadiazione TNM dell\'adenocarcinoma polmonare, la broncoscopia operativa e la chirurgia toracica resettiva (lobectomia vs pneumonectomia).',
    examQuestionsFocus: ['Stadiazione TNM del carcinoma polmonare', 'Anatomia chirurgica della carena tracheale', 'Complicanze della broncoaspirazione']
  },
  aorta: {
    id: 'aorta',
    name: 'Aorta Toracica & Aneurisma (TAA)',
    badge: 'VASCOLARE-3D',
    color: 'emerald',
    category: 'Chirurgia Vascolare & Emergenze',
    embedUrl: 'https://sketchfab.com/models/bcf37e4072de48b0aabd2e62db815cbd/embed?autostart=1&ui_theme=dark&ui_hint=0&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&dnt=1',
    posterImage: '/anatomy/model_aorta.png',
    description: 'Modello volumetrico dell\'aorta toracica con visualizzazione della radice aortica, aorta ascendente, arco con emergenza dei 3 tronchi sovraortici, istmo e dilatazione aneurismatica.',
    landmarks: [
      {
        structure: 'Radice & Aorta Ascendente',
        detail: 'Tratto compreso tra il piano valvolare e il tronco brachiocefalico anonimo (diametro fisiologico < 35 mm).',
        clinicalNote: 'Dissezione di Stanford Tipo A: emergenza cardiochirurgica assoluta con mortalità dell\'1-2% ogni ora.'
      },
      {
        structure: 'Arco Aortico & Tronchi Sovraortici',
        detail: 'Origine del tronco anonimo brachiocefalico, carotide comune sinistra e arteria succlavia sinistra.',
        clinicalNote: 'Coinvolgimento dei tronchi provoca asimmetria dei polsi periferici (>20 mmHg tra le braccia) e deficit neurologici focali.'
      },
      {
        structure: 'Istmo Aortico & Zona Aneurismatica',
        detail: 'Punto di transizione fisso tra arco mobile e aorta toracica discendente ancorata al rachide.',
        clinicalNote: 'Punto critico di rottura traumatica da decelerazione; secondo la Legge di Laplace (T = P x r / 2h), il rischio di rottura cresce esponenzialmente per diametri > 5.5 cm.'
      }
    ],
    clinicalExamYield: 'Cruciale per la classificazione di Stanford (Tipo A vs Tipo B) e le indicazioni alla riparazione chirurgica a cielo aperto con tubo protesico vs TEVAR endovascolare.',
    examQuestionsFocus: ['Classificazione di Stanford e DeBakey', 'Legge di Laplace e cut-off chirurgico di 5.5 cm', 'Diagnosi differenziale del dolore toracico lacerante']
  },
  coronary: {
    id: 'coronary',
    name: 'Circolo Arterioso Coronarico',
    badge: 'CORONARICO-3D',
    color: 'blue',
    category: 'Emodinamica & Cardiologia Interventistica',
    embedUrl: 'https://sketchfab.com/models/00b5f4ec0b984325b453f8df07cd0cb5/embed?autostart=1&ui_theme=dark&ui_hint=0&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&dnt=1',
    posterImage: '/anatomy/model_coronary.png',
    description: 'Mappatura tridimensionale dell\'albero coronarico epicardico: Tronco Comune, Arteria Interventricolare Anteriore (IVA / LAD), Arteria Circonflessa (LCx) e Arteria Coronaria Destra (CDX).',
    landmarks: [
      {
        structure: 'Arteria Interventricolare Anteriore (IVA / LAD)',
        detail: 'Origina dal Tronco Comune, decorre nel solco interventricolare anteriore ed emette rami diagonali e settali per i 2/3 anteriori del setto.',
        clinicalNote: 'Occlusione acuta causa STEMI Anteriore / Antero-Settale con sopraslivellamento ST nelle derivazioni precordiali V1-V4.'
      },
      {
        structure: 'Arteria Circonflessa (LCx)',
        detail: 'Percorre il solco atrioventricolare sinistro ed emette rami marginali ottusi (OM) che irrorano la parete laterale libera del ventricolo sinistro.',
        clinicalNote: 'Occlusione acuta causa STEMI Laterale con sopraslivellamento ST in DI, aVL, V5-V6.'
      },
      {
        structure: 'Arteria Coronaria Destra (CDX)',
        detail: 'Origina dal seno di Valsalva destro, decorre nel solco AV destro e irrora il ventricolo destro, nodo senoatriale, nodo AV e parete inferiore.',
        clinicalNote: 'Occlusione acuta causa STEMI Inferiore (DII, DIII, aVF) frequentemente associato a bradiaritmie e blocco AV avanzato.'
      }
    ],
    clinicalExamYield: 'Correlazione fondamentale tra la sede anatomica dell\'occlusione aterotrombotica coronarica e le derivazioni elettrocardiografiche dello STEMI all\'ECG.',
    examQuestionsFocus: ['Correlazione tra coronaria occlusa e derivazioni ECG', 'Complicanze dello STEMI inferiore da CDX', 'Anatomia coronarica per angioplastica primaria PCI']
  }
};

export const Anatomy3DViewport: React.FC<Anatomy3DViewportProps> = ({
  focusTarget,
  onSelectTarget,
  isMaximized,
  onToggleMaximize
}) => {
  const [activeModelKey, setActiveModelKey] = useState<Model3DKey>('heart');
  const [viewMode, setViewMode] = useState<'3d' | 'hd'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'hd';
    }
    return '3d';
  });
  const [mobileTab, setMobileTab] = useState<'split' | '3d' | 'info'>('split');
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [selectedLandmarkIdx, setSelectedLandmarkIdx] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Sync with prop
  useEffect(() => {
    if (!focusTarget) return;
    if (focusTarget === 'lungs' || focusTarget === 'thorax') {
      setActiveModelKey('lungs');
    } else if (focusTarget === 'aorta' || focusTarget === 'vessels') {
      setActiveModelKey('aorta');
    } else if (focusTarget === 'coronary') {
      setActiveModelKey('coronary');
    } else if (focusTarget === 'beating') {
      setActiveModelKey('beating');
    } else if (focusTarget === 'heart') {
      setActiveModelKey('heart');
    }
  }, [focusTarget]);

  const activeConfig = MODEL_CONFIGS[activeModelKey] || MODEL_CONFIGS.heart;

  const handleSelectModel = (key: Model3DKey) => {
    setActiveModelKey(key);
    setIsIframeLoading(true);
    setSelectedLandmarkIdx(null);
    setZoomLevel(1.0);
    onSelectTarget?.(key);
  };

  return (
    <div className="flex flex-col h-full bg-[#07090e] text-slate-100 overflow-hidden">
      
      {/* 1. TOP HEADER & MODEL SWITCHER BAR */}
      <div className="p-3 sm:p-3.5 border-b border-slate-800 bg-slate-950/95 shrink-0 space-y-2.5">
        
        {/* Row 1: Model Title & Dual-Engine Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <span>Atlante Anatomico Cardio-Toracico</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-normal">
                  360° / HD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Reperti anatomo-chirurgici e correlazioni fisiopatologiche d'esame</p>
            </div>
          </div>

          {/* Engine Selector: 3D WebGL vs Atlante HD */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === '3d'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Modello 3D interattivo con rotazione a 360° e zoom"
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D WebGL</span>
            </button>
            <button
              onClick={() => setViewMode('hd')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'hd'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tavola anatomica volumetrica HD anti-crash: velocissima, zero memoria GPU"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Atlante HD</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-200">
                LITE
              </span>
            </button>
          </div>
        </div>

        {/* Row 2: Horizontal Scrollable Models Selector */}
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

        {/* Row 3: Mobile Layout Tabs (Only visible on screens < lg) */}
        <div className="flex lg:hidden items-center justify-between pt-1 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-mono">Vista mobile:</div>
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setMobileTab('split')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition ${
                mobileTab === 'split' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              📱 Divisa
            </button>
            <button
              onClick={() => setMobileTab('3d')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition ${
                mobileTab === '3d' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              🎮 Solo Vista
            </button>
            <button
              onClick={() => setMobileTab('info')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition ${
                mobileTab === 'info' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400'
              }`}
            >
              📋 Solo Teoria
            </button>
          </div>
        </div>

      </div>

      {/* 2. MAIN WORKSTATION BODY: SPLIT VIEW */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">
        
        {/* LEFT COLUMN: VIEWPORT (3D WebGL or Volumetric HD) */}
        <div className={`lg:col-span-7 flex flex-col bg-black relative border-r border-slate-800/80 overflow-hidden ${
          mobileTab === 'info' ? 'hidden lg:flex' : 'flex'
        } ${mobileTab === 'split' ? 'h-[280px] sm:h-[340px] lg:h-full shrink-0' : 'flex-1 lg:h-full'}`}>
          
          {viewMode === '3d' ? (
            /* 3D WebGL Iframe Mode */
            <div className="relative w-full h-full flex flex-col">
              {isIframeLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm space-y-3 p-4 text-center">
                  <RefreshCw className="w-7 h-7 text-cyan-400 animate-spin" />
                  <div>
                    <p className="text-xs font-mono font-bold text-slate-200">Caricamento Modello 3D WebGL...</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                      Inizializzazione shader e geometria ad alta definizione
                    </p>
                  </div>
                  <button
                    onClick={() => setViewMode('hd')}
                    className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 underline font-mono flex items-center gap-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Passa subito ad Atlante HD (Zero attesa)
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
                loading="lazy"
              />

              {/* Bottom Mobile Safety & WebGL Assistance Bar */}
              <div className="bg-slate-950/90 border-t border-slate-800/90 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Ruota 360° con mouse/touch • Zoom con rotella o pinch</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('hd')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold transition"
                    title="Se il modello è lento o dà errore WebGL sul telefono, tocca qui"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>Errore o Lentezza? Atlante HD</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsIframeLoading(true);
                      const iframe = document.querySelector('iframe');
                      if (iframe) iframe.src = activeConfig.embedUrl;
                    }}
                    className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    title="Ricarica Modello 3D"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Volumetric HD Poster Mode (Anti-Crash, Instant, Zero GPU) */
            <div className="relative w-full h-full flex flex-col bg-slate-950 items-center justify-center p-3 overflow-hidden">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ATLANTE VOLUMETRICO HD • ANTI-CRASH
                </span>
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setZoomLevel(Math.min(1.6, zoomLevel + 0.2))}
                  className="p-1 text-slate-300 hover:text-white rounded"
                  title="Ingrandisci"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-slate-400 px-1">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.2))}
                  className="p-1 text-slate-300 hover:text-white rounded"
                  title="Riduci"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(1.0)}
                  className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 border-l border-slate-700 font-mono"
                  title="Reset Zoom"
                >
                  100%
                </button>
              </div>

              {/* HD Render Image */}
              <div className="flex-1 w-full h-full flex items-center justify-center overflow-auto custom-scrollbar">
                <img
                  src={activeConfig.posterImage}
                  alt={activeConfig.name}
                  style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-2xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                />
              </div>

              {/* Bottom Bar: Switch to 3D */}
              <div className="w-full bg-slate-900/90 border-t border-slate-800 px-3 py-2 flex items-center justify-between shrink-0">
                <div className="text-[11px] text-slate-400">
                  Immagine ad alta definizione del modello reale senza consumo di memoria WebGL
                </div>
                <button
                  onClick={() => setViewMode('3d')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-semibold transition"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Attiva 3D WebGL (360°)</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: RICH CLINICAL DOSSIER & LANDMARKS (NO SQUISHING!) */}
        <div className={`lg:col-span-5 flex flex-col bg-slate-950/95 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4 ${
          mobileTab === '3d' ? 'hidden lg:flex' : 'flex'
        } ${mobileTab === 'split' ? 'flex-1' : ''}`}>
          
          {/* Active Model Header Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                {activeConfig.badge} • {activeConfig.category}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                MedTerminal 2.0 3D
              </span>
            </div>
            
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              {activeConfig.name}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {activeConfig.description}
            </p>
          </div>

          {/* Key Landmarks Breakdown (Reperi Anatomici Chiave) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
                  Reperi Anatomici & Strutture Chiave
                </h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {activeConfig.landmarks.length} strutture
              </span>
            </div>

            <div className="space-y-2">
              {activeConfig.landmarks.map((item, idx) => {
                const isSelected = selectedLandmarkIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedLandmarkIdx(isSelected ? null : idx)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-500/50 ring-1 ring-cyan-500/20 shadow-md'
                        : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-xs text-cyan-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{item.structure}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isSelected ? 'rotate-90 text-cyan-400' : ''}`} />
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {item.detail}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-start gap-1.5 text-[11px] text-rose-300/90 leading-normal">
                      <span className="font-mono font-bold text-rose-400 shrink-0">📌 Clinica:</span>
                      <span>{item.clinicalNote}</span>
                    </div>
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
                Rendimento d'Esame Clinico
              </h5>
            </div>
            
            <p className="text-xs text-slate-200 leading-relaxed">
              {activeConfig.clinicalExamYield}
            </p>

            {/* Questions tags */}
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
