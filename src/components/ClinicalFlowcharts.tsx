import React, { useState } from 'react';
import { GitBranch, ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert, Zap } from 'lucide-react';

interface FlowchartItem {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  steps: {
    stage: string;
    action: string;
    detail: string;
    alert?: string;
  }[];
}

const FLOWCHARTS: FlowchartItem[] = [
  {
    id: 'stemi',
    title: 'Percorso Diagnostico-Terapeutico STEMI Acuto',
    shortTitle: 'STEMI: Riperfusione & PCI',
    category: 'Cardiologia d\'Urgenza',
    steps: [
      {
        stage: 'Fase 0: Primo Contatto Medico (FMC)',
        action: 'Esecuzione ECG a 12 derivazioni entro 10 minuti',
        detail: 'Riconoscimento sopraslivellamento ST in derivazioni contigue o LBBB di nuova insorgenza. Monitoraggio defibrillatore continuo.'
      },
      {
        stage: 'Fase 1: Bivio del Timing di Riperfusione',
        action: 'Tempo previsto per PCI primaria ≤ 120 minuti?',
        detail: 'SI -> Trasferimento immediato in Emodinamica (Cat Lab) per Angioplastica Primaria (PCI con stent DES). NO -> Fibrinolisi EV (Tenecteplase) entro 10 minuti dal fallimento del transfer!',
        alert: 'La PCI primaria è la scelta di classe IA se disponibile entro 2 ore dal primo contatto.'
      },
      {
        stage: 'Fase 2: Terapia Farmacologica Coadiuvante',
        action: 'Carico immediato con DAPT + Anticoagulante',
        detail: 'ASA 150-300 mg per os masticato + Inibitore P2Y12 potente (Ticagrelor 180 mg o Prasugrel 60 mg) + Eparina non frazionata EV (70-100 UI/kg).'
      },
      {
        stage: 'Fase 3: Post-Riperfusione & Terapia a Lungo Termine',
        action: 'Ricovero in UTIC per almeno 24-48h',
        detail: 'DAPT continuata per 12 mesi + Statina ad alta intensità (Atorvastatina 80 mg target LDL < 55 mg/dl) + Beta-bloccante + ACEi.'
      }
    ]
  },
  {
    id: 'heart-failure',
    title: 'I 4 Pilastri Fondamentali dello Scompenso HFrEF (Linee Guida ESC)',
    shortTitle: 'Scompenso: 4 Pilastri HFrEF',
    category: 'Cardiologia Clinica',
    steps: [
      {
        stage: 'Pilastro 1: Inibitore del Sistema Renina-Angiotensina',
        action: 'ARNI (Sacubitril/Valsartan) o ACE-Inibitore',
        detail: 'Titolazione progressiva al dosaggio massimo tollerato (target Sacubitril/Valsartan 97/103 mg bid). Riducono mortalità del 20%.'
      },
      {
        stage: 'Pilastro 2: Beta-Bloccante Guideline-Directed',
        action: 'Bisoprololo, Carvedilolo o Metoprololo succinato',
        detail: 'Iniziare a dosi minime a paziente euvolemico e raddoppiare ogni 2-4 settimane fino a target (es. Bisoprololo 10 mg/die).'
      },
      {
        stage: 'Pilastro 3: Antagonista dei Recettori Mineralcorticoidi (MRA)',
        action: 'Spironolattone (25-50 mg) o Eplerenone',
        detail: 'Controllo tassativo di potassiemia e creatinina (interrompere o dimezzare se K+ > 5.5 mEq/L).'
      },
      {
        stage: 'Pilastro 4: Inibitore SGLT2 (Gliflozine)',
        action: 'Dapagliflozin (10 mg) o Empagliflozin (10 mg)',
        detail: 'Dose fissa di 10 mg una volta al dì senza necessità di titolazione. Efficaci sia nei diabetici che nei non diabetici.'
      }
    ]
  },
  {
    id: 'fogarty',
    title: 'Algoritmo Emergenza Ischemia Acuta d\'Arto (Le 6 P & Fogarty)',
    shortTitle: 'Ischemia Acuta: 6 P & Fogarty',
    category: 'Chirurgia Vascolare d\'Urgenza',
    steps: [
      {
        stage: 'Fase 1: Riconoscimento Clinico Immediato (Le 6 P)',
        action: 'Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia',
        detail: 'Se presente paralisi motoria delle dita/caviglia: emergenza estrema con finestra utile < 6 ore per salvare l\'arto.'
      },
      {
        stage: 'Fase 2: Eparinizzazione Sistemica Immediata',
        action: 'Bolo di Eparina Sodica EV 5.000 UI',
        detail: 'Obiettivo: bloccare immediatamente l\'accrescimento e la propagazione distale del trombo prima della sala operatoria.',
        alert: 'NON ritardare la sala operatoria per eseguire esami strumentali prolungati se l\'arto è in ischemia severa!'
      },
      {
        stage: 'Fase 3: Rivascolarizzazione Chirurgica con Fogarty',
        action: 'Embolectomia con Catetere a palloncino di Fogarty',
        detail: 'Arteriotomia trasversa femorale o poplitea, passaggio del catetere oltre il coagulo, gonfiaggio del palloncino con fisiologica ed estrazione retrograda del tromboembolismo.'
      },
      {
        stage: 'Fase 4: Valutazione Post-Riperfusione',
        action: 'Monitoraggio della sindrome da riperfusione e rabdomiolisi',
        detail: 'Idratazione per prevenire insufficienza renale da mioglobina; fasciotomia decompressiva precoce se sindrome compartimentale.'
      }
    ]
  },
  {
    id: 'pnx-emergency',
    title: 'Algoritmo Emergenza Pneumotorace Iperteso & Decompressione',
    shortTitle: 'Pneumotorace: Decompressione',
    category: 'Chirurgia Toracica d\'Urgenza',
    steps: [
      {
        stage: 'Fase 1: Riconoscimento Clinico dell\'Iperteso',
        action: 'Ipotensione + Deviazione Tracheale + Iperdiafania e Silenzio Respiratorio',
        detail: 'Sospetto clinico immediato: il meccanismo a valvola unidirezionale accumula aria in cavità pleurica, comprimendo la vena cava ed azzerando il ritorno venoso.',
        alert: 'DIAGNOSI CLINICA! È vietato inviare il paziente a fare una radiografia o una TC che ne causerebbe l\'arresto cardiaco!'
      },
      {
        stage: 'Fase 2: Decompressione Immediata con Ago',
        action: 'Inserimento agocannula 14-16G al II Spazio Intercostale Emiclaveare',
        detail: 'Oppure V spazio intercostale ascellare anteriore. L\'uscita di aria a sibilo sotto pressione trasforma il PNX iperteso in PNX aperto semplice, ripristinando la perfusione sistemica.'
      },
      {
        stage: 'Fase 3: Posizionamento Tubo di Toracostomia Definitivo',
        action: 'Drenaggio toracico con valvola di Heimlich o sistema a caduta/aspirazione ad acqua (Bülau)',
        detail: 'Inserimento al V spazio intercostale linea ascellare media (triangolo di sicurezza) bordando il margine superiore della costa inferiore per proteggere il fascio vascolo-nervoso intercostale.'
      }
    ]
  }
];

export const ClinicalFlowcharts: React.FC = () => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>(FLOWCHARTS[0].id);
  const activeFlow = FLOWCHARTS.find(f => f.id === selectedFlowId) || FLOWCHARTS[0];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 mb-1">
            <GitBranch className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Algoritmi Decisionali & Bivii Clinici</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Flowchart Interattivi Linee Guida d'Esame</h1>
          <p className="text-xs text-slate-400 mt-1">
            Percorsi diagnostici e sequenze terapeutiche passo-passo per le domande dell'orale.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FLOWCHARTS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFlowId(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                selectedFlowId === f.id
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-950/40'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              {f.shortTitle}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-950 p-6 rounded-2xl border border-amber-900/30 space-y-6">
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-500">{activeFlow.category}</span>
          <h2 className="text-xl font-bold text-white mt-0.5">{activeFlow.title}</h2>
        </div>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-cyan-500 before:to-emerald-500">
          {activeFlow.steps.map((st, i) => (
            <div key={i} className="relative space-y-2 group">
              <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-[10px] font-bold text-amber-300 font-mono">
                {i + 1}
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 hover:border-amber-500/40 transition">
                <span className="text-[11px] font-mono text-amber-400 uppercase font-bold tracking-wider block">
                  {st.stage}
                </span>
                <div className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{st.action}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {st.detail}
                </p>

                {st.alert && (
                  <div className="p-2.5 bg-rose-950/30 border border-rose-500/40 rounded-lg text-xs text-rose-300 flex items-start space-x-2 font-mono">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{st.alert}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
