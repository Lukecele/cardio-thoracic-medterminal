import React, { useState } from 'react';
import { Eye, Image, CheckCircle2, AlertCircle, ZoomIn } from 'lucide-react';

interface ImagingCase {
  id: string;
  title: string;
  modality: 'RX Torace' | 'Angio-TC' | 'Ecocardiografia' | 'EcoColorDoppler';
  indication: string;
  findings: string[];
  clinicalPearl: string;
  schemaType: 'kerley-lines' | 'pneumothorax' | 'pe-angio' | 'aortic-dissection' | 'aortic-stenosis-echo';
}

const IMAGING_CASES: ImagingCase[] = [
  {
    id: 'kerley',
    title: 'Edema Polmonare Acuto & Strie di Kerley B',
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

        <div className="flex flex-wrap gap-1.5">
          {IMAGING_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                selectedCaseId === c.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {c.modality}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Case Info & Reperti */}
        <div className="lg:col-span-7 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
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
            <ul className="space-y-2">
              {activeCase.findings.map((f, i) => (
                <li key={i} className="flex items-start space-x-2 text-xs text-slate-200 font-mono leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-amber-950/20 border border-amber-500/40 rounded-xl text-xs font-mono text-amber-200 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{activeCase.clinicalPearl}</span>
          </div>
        </div>

        {/* Right: Schematic Visual Simulator */}
        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-cyan-900/40 flex flex-col justify-center items-center text-center space-y-3">
          <div className="w-full aspect-square bg-[#030712] rounded-xl border border-slate-800 relative flex items-center justify-center p-4 overflow-hidden">
            {/* SVG Schematic Radiologic Representation */}
            {activeCase.schemaType === 'kerley-lines' && (
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Ribcage contour */}
                <ellipse cx="100" cy="100" rx="80" ry="90" fill="none" stroke="#1e293b" strokeWidth="2" />
                {/* Cardiomegaly */}
                <ellipse cx="110" cy="120" rx="55" ry="45" fill="rgba(255,255,255,0.15)" stroke="#64748b" strokeWidth="2" />
                {/* Kerley B lines: short horizontal dense lines at lateral costophrenic bases */}
                <line x1="25" y1="140" x2="45" y2="140" stroke="#00f2fe" strokeWidth="2.5" />
                <line x1="28" y1="150" x2="48" y2="150" stroke="#00f2fe" strokeWidth="2.5" />
                <line x1="30" y1="160" x2="52" y2="160" stroke="#00f2fe" strokeWidth="2.5" />
                <line x1="155" y1="145" x2="175" y2="145" stroke="#00f2fe" strokeWidth="2.5" />
                <line x1="152" y1="155" x2="172" y2="155" stroke="#00f2fe" strokeWidth="2.5" />
                <text x="30" y="130" fill="#00f2fe" fontSize="8" fontFamily="monospace" fontWeight="bold">STRIE KERLEY B</text>
                <text x="95" y="125" fill="#e2e8f0" fontSize="9" fontFamily="monospace">CARDIOMEGALIA</text>
              </svg>
            )}

            {activeCase.schemaType === 'pneumothorax' && (
              <svg className="w-full h-full" viewBox="0 0 200 200">
                <ellipse cx="100" cy="100" rx="80" ry="90" fill="none" stroke="#1e293b" strokeWidth="2" />
                {/* Normal right lung */}
                <ellipse cx="65" cy="100" rx="30" ry="60" fill="rgba(30,41,59,0.5)" stroke="#475569" strokeWidth="1.5" />
                {/* Collapsed left lung towards hilum */}
                <ellipse cx="125" cy="95" rx="14" ry="25" fill="rgba(255,255,255,0.2)" stroke="#00f2fe" strokeWidth="2" />
                {/* Visceral pleural line */}
                <path d="M 140 70 Q 142 95 138 120" fill="none" stroke="#00f2fe" strokeWidth="2" strokeDasharray="3,2" />
                <text x="142" y="95" fill="#00f2fe" fontSize="8" fontFamily="monospace">PLEURA VISCERALE</text>
                <text x="110" y="150" fill="#ef4444" fontSize="8" fontFamily="monospace">IPERDIAFANIA (ARIA)</text>
              </svg>
            )}

            {activeCase.schemaType === 'aortic-dissection' && (
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Aorta axial cross section */}
                <circle cx="100" cy="100" r="60" fill="rgba(15,23,42,0.8)" stroke="#64748b" strokeWidth="3" />
                {/* Intimal flap dividing true and false lumen */}
                <path d="M 50 85 Q 100 120 150 90" fill="none" stroke="#f43f5e" strokeWidth="3" />
                <text x="75" y="70" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">VERO LUME</text>
                <text x="75" y="130" fill="#fb7185" fontSize="9" fontFamily="monospace" fontWeight="bold">FALSO LUME</text>
                <text x="60" y="105" fill="#f43f5e" fontSize="8" fontFamily="monospace">FLAP INTIMALE</text>
              </svg>
            )}

            {activeCase.schemaType === 'pe-angio' && (
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Pulmonary trunk bifurcation */}
                <path d="M 90 170 L 90 110 L 40 70 M 110 170 L 110 110 L 160 70" fill="none" stroke="#38bdf8" strokeWidth="18" />
                {/* Thrombus saddle embolus */}
                <circle cx="100" cy="105" r="14" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
                <text x="50" y="35" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">EMBOLO A CAVALIERA</text>
                <text x="55" y="185" fill="#38bdf8" fontSize="8" fontFamily="monospace">TRONCO POLMONARE</text>
              </svg>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Schema anatomico-radiologico didattico interattivo
          </span>
        </div>
      </div>
    </div>
  );
};
