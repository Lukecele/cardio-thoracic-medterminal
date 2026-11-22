import React, { useState } from 'react';
import { GitBranch, ArrowRight, ShieldAlert } from 'lucide-react';

interface FlowchartItem {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  badge?: string;
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
    title: 'Percorso Diagnostico-Terapeutico STEMI & Post-SCA',
    shortTitle: 'STEMI: PCI & Dislipidemia',
    category: 'Cardiologia d\'Urgenza',
    badge: 'ESC 2023/2025',
    steps: [
      {
        stage: 'Fase 0: Primo Contatto Medico (FMC) & Diagnosi (UDMI 5 — 2026)',
        action: 'ECG a 12 derivazioni entro 10 minuti + Troponina hs con soglie SESSO-SPECIFICHE',
        detail: 'Riconoscimento sopraslivellamento ST al punto J in derivazioni contigue (o equivalenti STEMI: BBS nuovo, IMA posteriore V7-V9, Wellens). Nelle NSTE-SCA applicare i cut-off del 99° percentile sesso-specifici (UDMI 5, 2026: più bassi nella donna) e screening renale basale eGFR + UACR (ESC/ERA 2026).'
      },
      {
        stage: 'Fase 1: Bivio del Timing di Riperfusione',
        action: 'Tempo previsto per PCI primaria ≤ 120 minuti?',
        detail: 'SÌ → Trasferimento immediato in Emodinamica (Cat Lab) per Angioplastica Primaria (PPCI con DES). NO → Fibrinolisi EV (Tenecteplase) entro 10 minuti, seguita da strategia farmaco-invasiva!',
        alert: 'La PCI primaria è la scelta di Classe IA se eseguibile entro 120 minuti dal primo contatto medico. Non attendere le troponine!'
      },
      {
        stage: 'Fase 2: Terapia Antitrombotica Acuta',
        action: 'DAPT + Anticoagulante parenterale',
        detail: 'ASA 150-300 mg masticabile + Inibitore P2Y12 potente (Ticagrelor 180 mg o Prasugrel 60 mg) + Eparina non frazionata EV (70-100 UI/kg). Ossigeno SOLO se SpO2 < 90%.'
      },
      {
        stage: 'Fase 3: Prevenzione Secondaria & Focus Dislipidemie (ESC/EAS 2025)',
        action: 'Combinazione ipolipemizzante precoce + Terapia cardioprotettiva',
        detail: 'DAPT 12 mesi + approccio "strike early & strong" (ESC/EAS 2025): Statina alta intensità + Ezetimibe precocemente per target LDL < 55 mg/dL (e riduzione ≥ 50%; escalation con PCSK9i / Inclisiran / Acido Bempedoico) + dosaggio Lp(a) una volta nella vita + Beta-bloccante + ACEi/ARNI.'
      }
    ]
  },
  {
    id: 'heart-failure',
    title: 'Scompenso Cardiaco (HFrEF < 50% & HFpEF ≥ 50% — ESC 2026)',
    shortTitle: 'Scompenso (ESC 2026)',
    category: 'Cardiologia Clinica',
    badge: 'ESC 2026',
    steps: [
      {
        stage: 'Fase 0: Nuova Classificazione ESC 2026 (Abolito HFmrEF!) & Screening',
        action: 'HFrEF (FE < 50%) vs HFpEF (FE ≥ 50%) + Stadi A–D + eGFR & UACR',
        detail: 'La fascia intermedia HFmrEF (41-49%) confluisce in HFrEF (< 50%). Dosare BNP/NT-proBNP (con ARNI solo NT-proBNP!) ed eseguire sempre screening cardiorenale basale con eGFR + UACR (ESC/ERA 2026).'
      },
      {
        stage: 'HFrEF (< 50%) — Foundational Medical Therapy (FMT — 4 Pilastri Classe I)',
        action: 'ARNI (o ACE-i) + Beta-Bloccante + MRA + SGLT2-inibitore',
        detail: 'Avvio rapido e titolazione dei 4 pilastri: 1) Sacubitril/Valsartan (wash-out 36h da ACE-i) o ACE-i; 2) Bisoprololo/Carvedilolo/Metoprololo succinato; 3) Spironolattone/Eplerenone; 4) Dapagliflozin o Empagliflozin 10 mg/die.'
      },
      {
        stage: 'HFpEF (≥ 50%) — Terapia Fondamentale ESC 2026',
        action: 'SGLT2-i (Classe I) + Finerenone MRA non steroideo (Classe I) + Diuretici',
        detail: 'Finerenone guadagna raccomandazione di Classe I nell\'HFpEF accanto agli SGLT2-inibitori per ridurre ospedalizzazioni ed eventi CV. Aggiungere diuretici dell\'ansa solo per controllo della congestione.'
      },
      {
        stage: 'Obesità & Scompenso (Novità ESC 2026) + Dispositivi (GDIT)',
        action: 'Semaglutide / Tirzepatide (Classe IIa se FE ≥ 45% e BMI ≥ 30) • ICD / CRT',
        detail: 'Gli agonisti GLP-1/GIP (Semaglutide, Tirzepatide) migliorano sintomi e capacità funzionale nello scompenso correlato a obesità. Valutare ICD/CRT (GDIT) dopo ≥ 3 mesi di FMT ottimizzata e riabilitazione cardiologica strutturata (ESC 2026).',
        alert: 'Furosemide risolve la congestione ma NON riduce la mortalità. Mai iniziare beta-bloccanti in edema polmonare acuto o shock!'
      }
    ]
  },
  {
    id: 'af-care',
    title: 'Gestione Integrata Fibrillazione Atriale: Percorso AF-CARE',
    shortTitle: 'FA: AF-CARE (ESC 2024)',
    category: 'Aritmologia Clinica',
    badge: 'ESC 2024',
    steps: [
      {
        stage: 'C — Comorbidity & Risk Factor Management',
        action: 'Trattamento aggressivo di tutte le cause e comorbidità',
        detail: 'Controllo rigoroso di ipertensione arteriosa (target 120-129 mmHg), scompenso cardiaco, diabete, calo ponderale (≥ 10% se obeso), OSAS, riduzione/stop alcol e dosaggio TSH.'
      },
      {
        stage: 'A — Avoid Stroke & Thromboembolism (Nuovo CHA2DS2-VA)',
        action: 'Stratificazione tromboembolica senza criterio di sesso (ESC 2024)',
        detail: 'CHA2DS2-VA ≥ 2 → Anticoagulazione orale con DOAC RACCOMANDATA (Classe I) sia nell\'uomo che nella donna; CHA2DS2-VA = 1 → DOAC da considerare (Classe IIa). Correggere fattori emorragici (HAS-BLED).',
        alert: 'DOAC controindicati in Protesi Meccaniche e Stenosi Mitralica moderato-severa (qui resta obbligatorio il Warfarin/AVK)!'
      },
      {
        stage: 'R — Reduce Symptoms (Rate & Rhythm Control)',
        action: 'Controllo frequenza (BB/Diltiazem) & controllo precoce del ritmo',
        detail: 'Paziente instabile → Cardioversione elettrica sincronizzata immediata. Stabile > 48h non anticoagulato → 3 settimane OAC oppure ETE prima di cardiovertire (+ almeno 4 settimane OAC dopo). Ablazione transcatetere di 1ª linea nella FA parossistica sintomatica o FA con HFrEF.'
      },
      {
        stage: 'E — Evaluation & Dynamic Reassessment',
        action: 'Rivalutazione periodica di rischio, funzione renale e aderenza',
        detail: 'Controllo periodico di eGFR (per aggiustamento dose DOAC), emoglobina, insorgenza di nuovi fattori di rischio nel CHA2DS2-VA ed efficacia del controllo sintomi.'
      }
    ]
  },
  {
    id: 'hypertension-2024',
    title: 'Ipertensione Arteriosa: Nuove Categorie & Target Terapeutico',
    shortTitle: 'Ipertensione (ESC 2024)',
    category: 'Prevenzione Cardiovascolare',
    badge: 'ESC 2024',
    steps: [
      {
        stage: 'Fase 1: Classificazione ESC 2024 (3 Fasce)',
        action: 'Non elevata (< 120/70) • Pressione Elevata (120-139/70-89) • Ipertensione (≥ 140/90)',
        detail: 'Confermare la diagnosi preferibilmente con monitoraggio fuori ambulatorio (ABPM 24h ≥ 130/80 o HBPM domiciliare ≥ 135/85) per escludere effetto camice bianco o ipertensione mascherata.'
      },
      {
        stage: 'Fase 2: Decisione nella Nuova Fascia "Pressione Elevata"',
        action: 'Stile di vita per tutti + valutazione rischio CV (SCORE2 / SCORE2-OP)',
        detail: 'Se PA 130-139 / 80-89 mmHg con rischio CV a 10 anni ≥ 10% (o diabete, CKD, danno d\'organo, malattia CV nota): avviare terapia farmacologica dopo 3 mesi di misure non farmacologiche.'
      },
      {
        stage: 'Fase 3: Terapia Farmacologica & Nuovo Target Unificato',
        action: 'Combinazione a singolo pill (SPC) fin dall\'inizio → Target PAS 120-129 mmHg',
        detail: 'Step 1: ACE-i/ARB + CCB DHP o Tiazidico/tiazido-simile in singola compressa. Step 2: triplice (ACE-i/ARB + CCB + diuretico). Step 3 (resistente): aggiungere Spironolattone (escludendo prima cause secondarie: Conn/ARR, Feocromocitoma, Stenosi Arterie Renali).',
        alert: 'Nuovo target ESC 2024: PAS 120-129 mmHg (e PAD < 80 mmHg) nella maggioranza dei pazienti trattati, applicando il principio ALARA (As Low As Reasonably Achievable) se fragili/anziani.'
      }
    ]
  },
  {
    id: 'copd-asthma-2026',
    title: 'BPCO (GOLD 2025–2026) & Asma (GINA 2025–2026)',
    shortTitle: 'BPCO & Asma (2025–26)',
    category: 'Pneumologia Clinica',
    badge: 'GOLD/GINA 2026',
    steps: [
      {
        stage: 'BPCO — Diagnosi & Raggruppamento ABE (GOLD 2025–2026)',
        action: 'FEV1/FVC post-BD < 0.70 + stadiazione ABE (non più ABCD)',
        detail: 'Gruppo A (pochi sintomi, 0-1 riacut. non osped.): 1 broncodilatatore. Gruppo B (molti sintomi): LABA + LAMA. Gruppo E (≥ 2 riacut. moderate o ≥ 1 ospedalizzazione): LABA + LAMA (+ ICS se eosinofili ematici ≥ 300 cell/μL).'
      },
      {
        stage: 'BPCO — Novità Storica Biologici (GOLD 2025–2026)',
        action: 'Escalation a Biologici se riacutizzazioni persistenti su triplice LABA+LAMA+ICS',
        detail: 'Dupilumab (anti-IL-4Rα) indicato nei pazienti con riacutizzazioni persistenti su triplice terapia, fenotipo bronchitico cronico ed eosinofili ≥ 300 cell/μL (Mepolizumab anti-IL-5 in fenotipi eosinofilici selezionati). Riconoscimento di Pre-COPD ed Early COPD.',
        alert: 'In riacutizzazione acuta BPCO: O2 titolato con Venturi a target SpO2 88-92% e NIV (BiPAP) se acidosi respiratoria ipercapnica (pH < 7.35)!'
      },
      {
        stage: 'Asma — Track 1 & Track 2 (GINA 2025–2026)',
        action: 'STOP definitivo al SABA in monoterapia anche allo Step 1!',
        detail: 'Track 1 (Preferito): ICS-formoterolo a bassa dose al bisogno (Step 1-2) e come mantenimento + bisogno (MART, Step 3-5). Track 2 (Alternativo Step 1): combinazione ICS-SABA al bisogno. Step 5: aggiunta LAMA (triplice ICS-LABA-LAMA) + fenotipizzazione per Biologici (anti-IgE, anti-IL5/5R, anti-IL4R, anti-TSLP Tezepelumab) per OCS stewardship.'
      }
    ]
  },
  {
    id: 'fogarty',
    title: 'Algoritmo Emergenza Ischemia Acuta d\'Arto (Le 6 P & Fogarty)',
    shortTitle: 'Ischemia Acuta: Fogarty',
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
        detail: 'Obiettivo: bloccare immediatamente la propagazione distale del trombo nel microcircolo prima della sala operatoria.',
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
        detail: 'Idratazione e monitoraggio K+/mioglobina; fasciotomia decompressiva precoce se sindrome compartimentale.'
      }
    ]
  },
  {
    id: 'pnx-emergency',
    title: 'Algoritmo Emergenza Pneumotorace Iperteso & Decompressione',
    shortTitle: 'PNX Iperteso',
    category: 'Chirurgia Toracica d\'Urgenza',
    steps: [
      {
        stage: 'Fase 1: Riconoscimento Clinico dell\'Iperteso',
        action: 'Ipotensione + Turgore Giugulare + Deviazione Tracheale + Silenzio Respiratorio',
        detail: 'Sospetto clinico immediato: il meccanismo a valvola unidirezionale accumula aria nel cavo pleurico, comprimendo la vena cava e azzerando il ritorno venoso (shock ostruttivo).',
        alert: 'DIAGNOSI CLINICA! Vietato inviare il paziente in radiologia per RX o TC: rischio immediato di arresto cardiaco!'
      },
      {
        stage: 'Fase 2: Decompressione Immediata con Ago',
        action: 'Agocannula 14-16G al IV-V spazio ascellare anteriore (o II emiclaveare)',
        detail: 'L\'uscita di aria a sibilo sotto pressione trasforma il PNX iperteso in PNX aperto semplice, ripristinando subito la perfusione.'
      },
      {
        stage: 'Fase 3: Posizionamento Tubo di Toracostomia Definitivo',
        action: 'Drenaggio toracico con valvola ad acqua (Bülau)',
        detail: 'Inserimento nel triangolo di sicurezza (IV-V spazio linea ascellare media) bordando il margine superiore della costa inferiore per proteggere il fascio vascolo-nervoso intercostale.'
      }
    ]
  }
];

export const ClinicalFlowcharts: React.FC = () => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>(FLOWCHARTS[0].id);
  const activeFlow = FLOWCHARTS.find((f) => f.id === selectedFlowId) || FLOWCHARTS[0];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-amber-400 mb-1">
            <GitBranch className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Algoritmi Decisionali & Bivii Clinici</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
              AGGIORNATI ESC / GOLD / GINA 2024–2026
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Flowchart Interattivi Linee Guida d&apos;Esame ({FLOWCHARTS.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Percorsi diagnostici e sequenze terapeutiche passo-passo aggiornati alle ultime linee guida per l&apos;esame orale.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/80">
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500">{activeFlow.category}</span>
            <h2 className="text-xl font-bold text-white mt-0.5">{activeFlow.title}</h2>
          </div>
          {activeFlow.badge && (
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {activeFlow.badge}
            </span>
          )}
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-cyan-500 before:to-emerald-500">
          {activeFlow.steps.map((st, i) => (
            <div key={i} className="relative space-y-2 group">
              <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-[10px] font-bold text-amber-300 font-mono">
                {i + 1}
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 hover:border-amber-500/40 transition">
                <span className="text-[11px] font-mono text-amber-400 uppercase font-bold tracking-wider block">
                  {st.stage}
                </span>
                <div className="text-sm font-bold text-white flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{st.action}</span>
                </div>
                <p className="text-[13px] text-slate-300 leading-relaxed">
                  {st.detail}
                </p>

                {st.alert && (
                  <div className="p-2.5 bg-rose-950/30 border border-rose-500/40 rounded-lg text-xs text-rose-300 flex items-start space-x-2 leading-relaxed">
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
