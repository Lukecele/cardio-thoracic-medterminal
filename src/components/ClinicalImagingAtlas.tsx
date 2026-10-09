import React, { useState } from 'react';
import { Eye, Image, CheckCircle2, AlertCircle, ZoomIn, Layers, Crosshair } from 'lucide-react';

interface ImagingCase {
  id: string;
  title: string;
  shortLabel: string;
  modality: 'RX Torace' | 'Angio-TC' | 'Ecocardiografia' | 'EcoColorDoppler';
  indication: string;
  findings: string[];
  clinicalPearl: string;
  schemaType: 'kerley-lines' | 'pneumothorax' | 'pe-angio' | 'aortic-dissection';
}

const IMAGING_CASES: ImagingCase[] = [
  {
    id: 'kerley',
    title: 'Edema Polmonare Acuto & Strie di Kerley B',
    shortLabel: 'RX: Edema & Strie Kerley B',
    modality: 'RX Torace',
    indication: 'Scompenso cardiaco acuto con dispnea accessionale ed ortopnea',
    findings: [
      'Cardiomegalia con indice cardio-toracico (ICT) > 0.50',
      'Iperafflusso ed ilarizzazione con ridistribuzione del circolo agli apici',
      'Strie B di Kerley: linee orizzontali dense sottili (1-2 cm) alle basi periferiche costo-freniche da ispessimento dei setti interlobulari per stasi linfatica ed edema interstiziale',
      'Iperdiafania peribronchiale (cuffing) e velatura alveolare a farfalla'
    ],
    clinicalPearl: 'Le strie di Kerley B compaiono quando la pressione capillare polmonare (incuneamento PCWP) supera la soglia di 18-20 mmHg.',
    schemaType: 'kerley-lines'
  },
  {
    id: 'pnx-imaging',
    title: 'Pneumotorace (PNX) Completo con Collabimento',
    shortLabel: 'RX: Pneumotorace Iperteso',
    modality: 'RX Torace',
    indication: 'Dolore toracico trafittivo improvviso e dispnea in giovane longilineo',
    findings: [
      'Iperdiafania marcata dello spazio pleurico con scomparsa del disegno vascolare polmonare',
      'Visualizzazione netta della linea sottile radiopaca della pleura viscerale',
      'Polmone collabito retratto verso l\'ilo a forma di ceppo/moncone',
      'Nel PNX Iperteso: appiattimento/abbassamento dell\'emidiaframma omolaterale e sbandamento controlaterale del mediastino e trachea'
    ],
    clinicalPearl: 'Nel PNX iperteso l\'RX NON deve mai ritardare la decompressione immediata con agocannula al II spazio intercostale emiclaveare!',
    schemaType: 'pneumothorax'
  },
  {
    id: 'dissection-imaging',
    title: 'Dissezione Aortica Acuta (Stanford A & B) alla TC',
    shortLabel: 'TC: Dissezione Aortica (Stanford)',
    modality: 'Angio-TC',
    indication: 'Dolore toracico lacerante a pugnalata migrante al dorso ed asimmetria dei polsi',
    findings: [
      'Presenza di lembo di dissezione intimo-mediale (flap intimale) che divide il lume aortico in vero lume (più piccolo con flusso rapido) e falso lume (più ampio con flusso rallentato o trombosi)',
      'Stanford A: coinvolgimento dell\'aorta ascendente con rischio di rottura intrapericardica o dissezione osti coronarici',
      'Stanford B: origine distale all\'arteria succlavia sinistra confinata all\'aorta discendente'
    ],
    clinicalPearl: 'La TC con mdc è il gold standard con sensibilità e specificità vicine al 100%: permette di valutare l\'estensione renale, celiaca e agli arti.',
    schemaType: 'aortic-dissection'
  },
  {
    id: 'pe-imaging',
    title: 'Embolia Polmonare (TEP) all\'Angio-TC Torace',
    shortLabel: 'TC: Embolia a Sella (TEP)',
    modality: 'Angio-TC',
    indication: 'Dispnea improvvisa, tachicardia, dolore toracico pleuritico ed emottisi in pz con TVP',
    findings: [
      'Difetto di riempimento endoluminale ipodenso (tromboembolismo) circondato da contrasto (segno del binario) o occlusione vascolare completa di rami polmonari principali o lobari',
      'Dilatazione del tronco dell\'arteria polmonare (> 29 mm)',
      'Sovraccarico del ventricolo destro con rapporto diametro VD/VS > 1.0 (indice di disfunzione emodinamica grave)'
    ],
    clinicalPearl: 'Nei pazienti stabili lo score di Wells guida la probabilità clinica; se alto -> Angio-TC diretta; se basso/intermedio -> D-dimero preventivo.',
    schemaType: 'pe-angio'
  }
];

export const ClinicalImagingAtlas: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(IMAGING_CASES[0].id);
  const activeCase = IMAGING_CASES.find(c => c.id === selectedCaseId) || IMAGING_CASES[0];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 mb-1">
            <Image className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Radiologia & Diagnostica per Immagini</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Atlante Iconografico di Imaging Cardiorespiratorio</h1>
          <p className="text-xs text-slate-400 mt-1">
            RX Torace, Angio-TC polmonare ed aortica: segni semeiologici radiologici cardine per l'esame.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {IMAGING_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                selectedCaseId === c.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-950/40'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              {c.shortLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Case Info & Reperti */}
        <div className="lg:col-span-7 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              {activeCase.modality}
            </span>
            <span className="text-xs font-mono text-slate-400">{activeCase.indication}</span>
          </div>

          <h2 className="text-lg font-bold text-white font-mono">{activeCase.title}</h2>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider block">
              Reperti Radiologici Essenziali (Cosa cercare all'esame):
            </span>
            <ul className="space-y-2.5">
              {activeCase.findings.map((f, i) => (
                <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-200 font-mono leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-amber-950/20 border border-amber-500/40 rounded-xl text-xs font-mono text-amber-200 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{activeCase.clinicalPearl}</span>
          </div>
        </div>

        {/* Right: High-Fidelity Radiologic DICOM Viewer Simulator */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-cyan-900/40 flex flex-col justify-between space-y-3">
          
          {/* DICOM Header Overlay */}
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 border-b border-cyan-950 pb-2">
            <div className="flex items-center space-x-1.5">
              <Crosshair className="w-3.5 h-3.5" />
              <span>DICOM VIEWER v2.0</span>
            </div>
            <div className="text-slate-500">
              {activeCase.modality === 'RX Torace' ? 'W:1500 L:-500' : 'W:400 L:40 (CT)'}
            </div>
          </div>

          <div className="w-full aspect-square bg-[#02050b] rounded-xl border border-cyan-950/80 relative flex items-center justify-center p-2 overflow-hidden shadow-inner">
            
            {/* Corner Annotations */}
            <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-500/70 select-none">
              R (DX)
            </div>
            <div className="absolute top-2 right-2 text-[9px] font-mono text-cyan-500/70 select-none">
              L (SX)
            </div>
            <div className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-600 select-none">
              FOV: 350mm
            </div>

            {/* High-Fidelity SVG Visuals */}
            {activeCase.schemaType === 'kerley-lines' && (
              <svg className="w-full h-full" viewBox="0 0 240 240">
                {/* Background Grid */}
                <circle cx="120" cy="120" r="100" fill="#030814" stroke="#0e2a3b" strokeWidth="1" strokeDasharray="3 3" />
                
                {/* Thoracic cage silhouette */}
                <path d="M 60 40 Q 120 20 180 40 Q 210 120 185 200 Q 120 220 55 200 Q 30 120 60 40 Z" fill="#040b18" stroke="#1e3a5f" strokeWidth="2" />
                
                {/* Diaphragm domes */}
                <path d="M 45 195 Q 85 165 120 190 Q 165 160 205 195" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                
                {/* Enlarged Heart (Cardiomegaly ICT > 0.55) */}
                <path d="M 105 100 Q 155 120 165 170 Q 120 195 90 175 Q 80 135 105 100 Z" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" strokeWidth="2" />
                <text x="105" y="155" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">CARDIOMEGALIA</text>
                <text x="110" y="165" fill="#94a3b8" fontSize="7" fontFamily="monospace">ICT &gt; 0.55</text>
                
                {/* Kerley B lines (lateral basal horizontal lines) */}
                <g stroke="#00f2fe" strokeWidth="2.5">
                  <line x1="38" y1="172" x2="62" y2="172" />
                  <line x1="42" y1="180" x2="68" y2="180" />
                  <line x1="48" y1="188" x2="72" y2="188" />
                  <line x1="175" y1="175" x2="200" y2="175" />
                  <line x1="170" y1="183" x2="195" y2="183" />
                </g>
                
                {/* Pointers with clean guide lines */}
                <line x1="50" y1="145" x2="50" y2="168" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="50" cy="172" r="2" fill="#f59e0b" />
                <rect x="20" y="130" width="70" height="15" rx="3" fill="#020617" stroke="#f59e0b" strokeWidth="1" />
                <text x="25" y="141" fill="#fbbf24" fontSize="7" fontFamily="monospace" fontWeight="bold">STRIE KERLEY B</text>
              </svg>
            )}

            {activeCase.schemaType === 'pneumothorax' && (
              <svg className="w-full h-full" viewBox="0 0 240 240">
                {/* Thoracic cage silhouette */}
                <path d="M 60 40 Q 120 20 180 40 Q 210 120 185 200 Q 120 220 55 200 Q 30 120 60 40 Z" fill="#040b18" stroke="#1e3a5f" strokeWidth="2" />
                
                {/* Normal Right Lung */}
                <path d="M 65 55 Q 95 60 95 110 Q 95 170 60 180 Q 45 130 65 55 Z" fill="rgba(30, 58, 95, 0.4)" stroke="#38bdf8" strokeWidth="1.5" />
                
                {/* Collapsed Left Lung (Atelectatic stump at hilum) */}
                <path d="M 125 90 Q 145 95 140 135 Q 125 140 120 115 Z" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="2" />
                
                {/* Visceral Pleura Hairline */}
                <path d="M 148 70 Q 155 110 145 160" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
                
                {/* Mediastinal Shift Arrow */}
                <path d="M 115 80 L 95 80 M 95 80 L 102 75 M 95 80 L 102 85" stroke="#fbbf24" strokeWidth="2" fill="none" />
                <text x="75" y="72" fill="#fbbf24" fontSize="7" fontFamily="monospace" fontWeight="bold">DEVIAZIONE MEDIASTINO</text>
                
                {/* Pleural Air Area Annotation */}
                <rect x="155" y="105" width="70" height="26" rx="3" fill="#020617" stroke="#f43f5e" strokeWidth="1" />
                <text x="160" y="117" fill="#f43f5e" fontSize="7" fontFamily="monospace" fontWeight="bold">IPERDIAFANIA</text>
                <text x="160" y="126" fill="#fda4af" fontSize="6.5" fontFamily="monospace">ASSENZA TRAMA</text>
              </svg>
            )}

            {activeCase.schemaType === 'aortic-dissection' && (
              <svg className="w-full h-full" viewBox="0 0 240 240">
                {/* Aorta Axial View Border */}
                <circle cx="120" cy="120" r="75" fill="#050c1e" stroke="#334155" strokeWidth="3" />
                
                {/* True Lumen (hyperdense contrast, smaller, round) */}
                <path d="M 75 100 Q 115 70 155 100 Q 125 130 75 100 Z" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" strokeWidth="2.5" />
                
                {/* False Lumen (hypodense, larger, crescent shape) */}
                <path d="M 75 100 Q 125 130 155 100 Q 170 160 120 185 Q 70 160 75 100 Z" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="2" />
                
                {/* Intimal Flap dividing line */}
                <path d="M 75 100 Q 125 130 155 100" fill="none" stroke="#ffffff" strokeWidth="3" />
                
                {/* Labels */}
                <rect x="90" y="78" width="60" height="15" rx="3" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
                <text x="96" y="89" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold">VERO LUME</text>
                
                <rect x="90" y="150" width="60" height="15" rx="3" fill="#020617" stroke="#f43f5e" strokeWidth="1" />
                <text x="94" y="161" fill="#f43f5e" fontSize="7" fontFamily="monospace" fontWeight="bold">FALSO LUME</text>
                
                <text x="110" y="125" fill="#f8fafc" fontSize="6.5" fontFamily="monospace" fontWeight="bold">FLAP INTIMALE</text>
              </svg>
            )}

            {activeCase.schemaType === 'pe-angio' && (
              <svg className="w-full h-full" viewBox="0 0 240 240">
                {/* Pulmonary Trunk Bifurcation */}
                <path d="M 105 210 L 105 130 L 45 70 L 65 50 L 120 105 L 175 50 L 195 70 L 135 130 L 135 210 Z" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="2" />
                
                {/* Saddle Embolus (Thrombus at carina of pulmonary bifurcation) */}
                <ellipse cx="120" cy="115" rx="20" ry="14" fill="#ef4444" stroke="#991b1b" strokeWidth="2.5" />
                
                {/* Extension into left and right branches */}
                <path d="M 105 115 L 75 85" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
                <path d="M 135 115 L 165 85" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
                
                {/* Labels */}
                <rect x="70" y="25" width="100" height="16" rx="3" fill="#020617" stroke="#ef4444" strokeWidth="1" />
                <text x="76" y="36" fill="#f87171" fontSize="7" fontFamily="monospace" fontWeight="bold">EMBOLO A SELLA (SADDLE)</text>
                
                <text x="85" y="195" fill="#38bdf8" fontSize="7" fontFamily="monospace">TRONCO POLMONARE</text>
              </svg>
            )}

          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
            <span>Risoluzione: 512x512 matrix</span>
            <span className="text-cyan-400">Ricostruzione Vettoriale</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClinicalImagingAtlas;
