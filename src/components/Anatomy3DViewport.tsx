import React, { useState, useEffect } from 'react';
import { Layers, Eye, Info, CheckCircle2, RefreshCw, ExternalLink, Sparkles } from 'lucide-react';

export interface Anatomy3DViewportProps {
  focusTarget?: string | null;
  onSelectTarget?: (target: string) => void;
}

export type Model3DKey = 'heart' | 'beating' | 'lungs' | 'aorta' | 'coronary';

interface ModelConfig {
  id: Model3DKey;
  name: string;
  badge: string;
  color: string;
  embedUrl: string;
  description: string;
  landmarks: string[];
  clinicalExamYield: string;
}

const MODEL_CONFIGS: Record<Model3DKey, ModelConfig> = {
  heart: {
    id: 'heart',
    name: 'Cuore Interno & Apparato Valvolare',
    badge: 'CARDIO-3D',
    color: 'rose',
    embedUrl: 'https://sketchfab.com/models/9f48eaa481cc4a43baeb9e1f03882cff/embed',
    description: 'Anatomia tridimensionale con dissezione delle 4 camere: atri, ventricoli, setto interventricolare, apparato sottovalvolare con corde tendinee e muscoli papillari.',
    landmarks: [
      'Ventricolo Sinistro: miocardio ad alto spessore (8-11 mm) per carico pressorio sistemico',
      'Ventricolo Destro: camera a basse pressioni e alta distensibilità',
      'Valvola Mitrale: lembo anteriore (aortico) e posteriore con corde tendinee',
      'Radice Aortica: seni di Valsalva ed emergenza degli osti coronarici'
    ],
    clinicalExamYield: 'Fondamentale per comprendere la differenza tra stenosi mitralica (fusione commissurale), insufficienza mitralica (rottura di papillare post-STEMI) e stenosi aortica.'
  },
  beating: {
    id: 'beating',
    name: 'Battito Cardiaco & Ciclo Dinamico',
    badge: 'FISIOLOGIA-3D',
    color: 'amber',
    embedUrl: 'https://sketchfab.com/models/09ce20e146b24f71943b13dcdf099db9/embed',
    description: 'Modello 3D dinamico in tempo reale della contrazione miocardica: sequenza temporale di sistole ventricolare, contrazione isovolumetrica ed eiezione.',
    landmarks: [
      'Sistole Ventricolare: ispessimento radiale delle pareti e accorciamento longitudinale',
      'Diastole Ventricolare: rilasciamento attivo e riempimento rapido (genesi del terzo tono S3)',
      'Sistole Atriale: "atrial kick" presistolico (genesi del quarto tono S4, perso in FA)'
    ],
    clinicalExamYield: 'Permette di visualizzare la frazione di eiezione (FE = SV / EDV x 100) e i meccanismi di compenso di Frank-Starling nello scompenso.'
  },
  lungs: {
    id: 'lungs',
    name: 'Albero Respiratorio & Lobi Polmonari',
    badge: 'PNEUMO-3D',
    color: 'sky',
    embedUrl: 'https://sketchfab.com/models/250911151757489da1cf5501b791f363/embed',
    description: 'Ricostruzione anatomica 3D della trachea, carena T4-T5, albero bronchiale con ramificazione lobare e segmentaria, e segmentazione polmonare.',
    landmarks: [
      'Trachea & Carena: anelli cartilaginei a C e biforcazione a livello T4-T5',
      'Bronco Destro vs Sinistro: il destro è più corto (2-3 cm), più largo e verticale (frequente inalazione)',
      'Polmone Destro: 3 lobi (superiore, medio, inferiore) divisi da scissura orizzontale e obliqua',
      'Polmone Sinistro: 2 lobi con incisura cardiaca e lingula'
    ],
    clinicalExamYield: 'Essenziale per la stadiazione TNM del cancro del polmone (distanza dalla carena < 2 cm = T4) e per le indicazioni alla lobectomia/pneumonectomia.'
  },
  aorta: {
    id: 'aorta',
    name: 'Aorta Toracica & Aneurisma (TAA)',
    badge: 'VASCOLARE-3D',
    color: 'emerald',
    embedUrl: 'https://sketchfab.com/models/bcf37e4072de48b0aabd2e62db815cbd/embed',
    description: 'Modello 3D volumetrico dell\'aorta toracica: radice, aorta ascendente, arco con i 3 tronchi sovraortici e dilatazione aneurismatica.',
    landmarks: [
      'Tronchi Sovraortici: tronco anonimo brachiocefalico, carotide comune sx, succlavia sx',
      'Istmo Aortico: punto fisso dopo l\'emergenza della succlavia (rischio rottura da decelerazione)',
      'Dilatazione Aneurismatica: legge di Laplace (T = P x r / 2h) che spiega il rischio esponenziale di rottura per diametri > 5.5 cm'
    ],
    clinicalExamYield: 'Cruciale per la classificazione di Stanford (Tipo A coinvolge l\'ascendente = emergenza cardiochirurgica aperta; Tipo B trattabile con TEVAR).'
  },
  coronary: {
    id: 'coronary',
    name: 'Circolo Arterioso Coronarico',
    badge: 'CORONARICO-3D',
    color: 'blue',
    embedUrl: 'https://sketchfab.com/models/00b5f4ec0b984325b453f8df07cd0cb5/embed',
    description: 'Mappatura tridimensionale dell\'albero coronarico per coronarografia ed angioplastica primaria (PCI): Tronco Comune, IVA, LCx e Coronaria Destra.',
    landmarks: [
      'Arteria Interventricolare Anteriore (IVA / LAD): vascolarizza la parete anteriore e i 2/3 anteriori del setto',
      'Arteria Circonflessa (LCx): decorre nel solco atrioventricolare sinistro e dà rami marginali ottusi',
      'Arteria Coronaria Destra (CDX): vascolarizza ventricolo destro, parete inferiore e nodo AV/senoatriale'
    ],
    clinicalExamYield: 'Correlazione diretta tra sede di occlusione coronarica e sede di sopraslivellamento ST all\'ECG (IVA = V1-V4, CDX = DII, DIII, aVF, LCx = DI, aVL, V5-V6).'
  }
};

export const Anatomy3DViewport: React.FC<Anatomy3DViewportProps> = ({ focusTarget, onSelectTarget }) => {
  const [activeModelKey, setActiveModelKey] = useState<Model3DKey>('heart');
  const [isIframeLoading, setIsIframeLoading] = useState(true);

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

  const handleSelect = (key: Model3DKey) => {
    setActiveModelKey(key);
    setIsIframeLoading(true);
    onSelectTarget?.(key);
  };

  return (
    <div className="flex flex-col h-full bg-[#07090e] text-slate-100 overflow-hidden">
      
      {/* 1. TOP SELECTOR BAR */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/90 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            <Layers className="w-3.5 h-3.5" />
            <span>Atlante Anatomico 3D Ufficiale</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            360° INTERATTIVO
          </span>
        </div>

        {/* Horizontal Model Switcher Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          {Object.values(MODEL_CONFIGS).map((cfg) => {
            const isSelected = cfg.id === activeModelKey;
            return (
              <button
                key={cfg.id}
                onClick={() => handleSelect(cfg.id)}
                className={`px-2.5 py-1.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm ring-1 ring-cyan-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <div className="text-[9px] font-mono uppercase font-bold text-cyan-400">
                  {cfg.badge}
                </div>
                <div className="text-xs font-semibold truncate mt-0.5">
                  {cfg.name.split(' & ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 3D IFRAME VIEWPORT CONTAINER */}
      <div className="relative flex-1 min-h-[380px] bg-black">
        {isIframeLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm space-y-3">
            <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
            <p className="text-xs font-mono text-slate-300">Caricamento Modello 3D Interattivo...</p>
          </div>
        )}

        <iframe
          key={activeConfig.embedUrl}
          src={activeConfig.embedUrl}
          title={activeConfig.name}
          onLoad={() => setIsIframeLoading(false)}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
        />
      </div>

      {/* 3. CLINICAL KEY & LANDMARKS DRAWER FOOTER */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 overflow-y-auto max-h-[220px] custom-scrollbar shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
              Reperi Anatomici Chiave & Razionale Clinico
            </h4>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Usa mouse/touch per ruotare e zoomare a 360°
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {activeConfig.description}
        </p>

        {/* Landmarks Bullet List */}
        <div className="space-y-1.5 pt-1">
          {activeConfig.landmarks.map((landmark, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <span>{landmark}</span>
            </div>
          ))}
        </div>

        {/* Exam High-Yield Box */}
        <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 leading-relaxed">
          <span className="font-bold text-blue-300 font-mono block mb-0.5">💡 RENDIMENTO D'ESAME:</span>
          {activeConfig.clinicalExamYield}
        </div>
      </div>

    </div>
  );
};

export default Anatomy3DViewport;
