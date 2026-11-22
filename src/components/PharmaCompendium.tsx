import React, { useState } from 'react';
import { Pill, ShieldCheck, AlertCircle, Search } from 'lucide-react';

type DrugGroup =
  | 'Tutti'
  | 'Scompenso'
  | 'Aritmie'
  | 'Ischemia & DAPT'
  | 'Anticoagulanti'
  | 'Ipertensione & Lipidi'
  | 'Pneumo';

interface DrugCard {
  name: string;
  category: string;
  group: Exclude<DrugGroup, 'Tutti'>;
  indications: string;
  dosage: string;
  mechanism: string;
  antidoteOrSafety: string;
  examPearl: string;
}

const GROUPS: DrugGroup[] = [
  'Tutti',
  'Scompenso',
  'Aritmie',
  'Ischemia & DAPT',
  'Anticoagulanti',
  'Ipertensione & Lipidi',
  'Pneumo',
];

const DRUGS: DrugCard[] = [
  {
    name: 'Dabigatran (Pradaxa)',
    category: 'Anticoagulanti Orali Diretti (DOAC)',
    group: 'Anticoagulanti',
    indications: 'Fibrillazione Atriale non valvolare, TVP ed Embolia Polmonare',
    dosage: '150 mg bid (110 mg bid se età ≥ 80 anni o eGFR 30-49 ml/min)',
    mechanism: 'Inibitore diretto e reversibile della Trombina libera e legata (Fattore IIa)',
    antidoteOrSafety: 'Antidoto specifico immediato: Idarucizumab (Praxbind) 5 g EV in due flaconi; controindicato se eGFR < 30 ml/min',
    examPearl: 'È l\'UNICO tra i DOAC ad essere un inibitore diretto della Trombina (IIa); tutti gli altri inibiscono il Fattore Xa!'
  },
  {
    name: 'Rivaroxaban / Apixaban / Edoxaban',
    category: 'Anticoagulanti Orali Diretti (DOAC)',
    group: 'Anticoagulanti',
    indications: 'FA non valvolare, prevenzione e trattamento TVP/EP',
    dosage: 'Rivaroxaban 20 mg/die (con cibo); Apixaban 5 mg bid (2.5 mg bid se ≥2 tra età ≥80, peso ≤60 kg, Cr ≥1.5); Edoxaban 60 mg/die',
    mechanism: 'Inibitori selettivi e diretti del Fattore Xa attivato della coagulazione',
    antidoteOrSafety: 'Antidoto specifico: Andexanet alfa (o concentrati complesso protrombinico 4F-PCC)',
    examPearl: 'Non richiedono il monitoraggio periodico dell\'INR, ma sono controindicati in Protesi Meccaniche e stenosi mitralica moderato-severa!'
  },
  {
    name: 'Sacubitril / Valsartan (Entresto)',
    category: 'Scompenso Cardiaco (ARNI - 1° Pilastro)',
    group: 'Scompenso',
    indications: 'Scompenso cardiaco a frazione d\'eiezione ridotta (HFrEF ≤ 40%) sintomatico (Classe I ESC)',
    dosage: 'Partenza 24/26 o 49/51 mg bid; target 97/103 mg bid',
    mechanism: 'Doppio blocco: inibizione della Neprilisina (aumenta BNP e vasodilatazione) + blocco recettore AT1 angiotensina II',
    antidoteOrSafety: 'Obbligatorio wash-out di 36 ORE dalla sospensione dell\'ACE-inibitore per evitare angioedema fatale (non serve dopo ARB)',
    examPearl: 'Fa salire i livelli plasmatici di BNP! Per monitorare lo scompenso si deve dosare l\'NT-proBNP (che non è substrato della neprilisina).'
  },
  {
    name: 'Beta-Bloccanti HFrEF (Bisoprololo / Carvedilolo / Metoprololo succinato)',
    category: 'Scompenso & Aritmie (2° Pilastro HFrEF)',
    group: 'Scompenso',
    indications: 'HFrEF stabile, controllo frequenza in FA, post-IMA, angina cronica, sindrome del QT lungo',
    dosage: 'Start low, go slow: Bisoprololo 1.25 → 10 mg/die; Carvedilolo 3.125 → 25 mg bid; Metoprololo succinato 23.75 → 190 mg/die',
    mechanism: 'Antagonismo β1 (riduce FC, contrattilità, renina e rimodellamento); Carvedilolo blocca anche α1 (vasodilatatore)',
    antidoteOrSafety: 'Controindicati in BAV II-III grado, bradicardia severa, shock cardiogeno e asma bronchiale non controllata (in BPCO preferire β1-selettivi)',
    examPearl: 'Solo 4 beta-bloccanti riducono la mortalità nell\'HFrEF: Bisoprololo, Carvedilolo, Metoprololo succinato e Nebivololo (anziani). Mai iniziare in edema polmonare acuto!'
  },
  {
    name: 'SGLT2-Inibitori (Dapagliflozin / Empagliflozin)',
    category: 'Scompenso Cardiaco (4° Pilastro - Tutti gli spettri FE)',
    group: 'Scompenso',
    indications: 'HFrEF, HFmrEF e HFpEF (indipendentemente dal diabete!), CKD e Diabete Mellito tipo 2 (Classe I ESC)',
    dosage: 'Dapagliflozin 10 mg/die; Empagliflozin 10 mg/die (dose fissa, nessuna titolazione richiesta)',
    mechanism: 'Inibizione del cotrasportatore SGLT2 nel tubulo prossimale: natriuresi/diuresi osmotica, riduzione precarico/postcarico e protezione renale',
    antidoteOrSafety: 'Rischio di infezioni micotiche genitali e chetoacidosi diabetica euglicemica (sospendere 3 gg prima di chirurgia maggiore o digiuno)',
    examPearl: 'Unici farmaci in Classe I per ridurre ospedalizzazioni e mortalità cardiovascolare sull\'INTERO spettro dello scompenso (incluso HFpEF ≥ 50%)!'
  },
  {
    name: 'MRA: Spironolattone / Eplerenone / Finerenone (ESC 2026)',
    category: 'Scompenso Cardiaco & Cardiorenale (3° Pilastro)',
    group: 'Scompenso',
    indications: 'HFrEF < 50% (Spironolattone/Eplerenone Classe I), HFpEF ≥ 50% & protezione cardiorenale CKD (Finerenone Classe I ESC 2026), ipertensione resistente',
    dosage: 'Spironolattone 25 → 50 mg/die; Eplerenone 25 → 50 mg/die; Finerenone (MRA non steroideo) 10 → 20-40 mg/die',
    mechanism: 'Antagonisti del recettore dei mineralcorticoidi (aldosterone): effetto antifibrotico, antinfiammatorio e risparmiatore di K+ (Finerenone è non-steroideo e altamente selettivo)',
    antidoteOrSafety: 'Monitorare strettamente K+ (rischio iperkaliemia se > 5.0-5.5 mEq/L) e funzione renale (eGFR + UACR secondo ESC/ERA 2026)',
    examPearl: 'Lo Spironolattone causa ginecomastia (sostituire con Eplerenone). Novità ESC 2026: il Finerenone (non steroideo) è entrato in Classe I nell\'HFpEF accanto agli SGLT2-i!'
  },
  {
    name: 'Semaglutide / Tirzepatide (Incretine GLP-1 / GIP — ESC 2026)',
    category: 'Scompenso Obesità-Correlato & Prevenzione CV',
    group: 'Scompenso',
    indications: 'Scompenso cardiaco sintomatico con FE ≥ 45% (HFpEF) e obesità (BMI ≥ 30 kg/m²) — Classe IIa ESC 2026; riduzione rischio CV in diabete/obesità',
    dosage: 'Somministrazione sottocutanea settimanale con titolazione graduale (es. Semaglutide 0.25 → 2.4 mg/sett; Tirzepatide 2.5 → 15 mg/sett)',
    mechanism: 'Agonisti del recettore GLP-1 (Semaglutide) o dual GLP-1/GIP (Tirzepatide): calo ponderale marcato, riduzione infiammazione sistemica, miglioramento emodinamica diastolica e protezione cardiorenale',
    antidoteOrSafety: 'Effetti GI transitori (nausea/vomito); lieve calo iniziale transitorio di eGFR ma protezione renale a lungo termine; cautela in storia di pancreatite/carcinoma midollare tiroideo',
    examPearl: 'Novità storica delle Linee Guida ESC 2026: per la prima volta gli agonisti incretinici entrano ufficialmente nella terapia dello scompenso cardiaco obesità-correlato!'
  },
  {
    name: 'Furosemide (Lasix)',
    category: 'Diuretici dell\'Ansa (Decongestione)',
    group: 'Scompenso',
    indications: 'Edema polmonare acuto, congestione nello scompenso cardiaco, sindrome nefrosica, ipercalcemia',
    dosage: 'Acuto: 20-40 mg EV in bolo (o 2x dose domiciliare EV); cronico: 25-250 mg/die per os',
    mechanism: 'Inibisce il cotrasportatore Na+/K+/2Cl- nel tratto ascendente spesso dell\'ansa di Henle; effetto venodilatatore rapido EV',
    antidoteOrSafety: 'Ipokaliemia, ipomagnesiemia, alcalosi metabolica ipocloremica, iperuricemia (gotta), ototossicità ad alte dosi EV rapide',
    examPearl: 'È fondamentale per risolvere i sintomi congestizi (dispnea, edemi), ma NON riduce la mortalità a lungo termine nell\'HFrEF (al contrario dei 4 pilastri).'
  },
  {
    name: 'ACE-Inibitori / ARB (Ramipril / Enalapril / Valsartan)',
    category: 'Sistema RAAS (Ipertensione, Post-IMA, HFrEF)',
    group: 'Ipertensione & Lipidi',
    indications: 'Ipertensione arteriosa, HFrEF (se ARNI non tollerato), post-IMA, nefropatia diabetica proteinurica',
    dosage: 'Ramipril 2.5-10 mg/die; Enalapril 5-20 mg bid; Valsartan 80-160 mg bid',
    mechanism: 'ACE-i blocca conversione Ang I → Ang II e degradazione bradichinina; ARB blocca selettivamente il recettore AT1',
    antidoteOrSafety: 'Controindicati in GRAVIDANZA (teratogeni), stenosi bilaterale delle arterie renali, iperkaliemia e storia di angioedema',
    examPearl: 'La tosse secca stizzosa da ACE-i dipende dall\'accumulo di bradichinina: si passa a un sartano (ARB), che NON inibisce la degradazione della bradichinina.'
  },
  {
    name: 'DAPT: Aspirina + Inibitori P2Y12 (Ticagrelor / Prasugrel / Clopidogrel)',
    category: 'Antiaggreganti (SCA & Stent Coronarico)',
    group: 'Ischemia & DAPT',
    indications: 'Sindromi Coronariche Acute (STEMI/NSTEMI) e post-PCI con impianto di stent medicato (DES)',
    dosage: 'ASA carico 150-300 mg poi 75-100 mg/die + Ticagrelor 180 mg poi 90 mg bid OR Prasugrel 60 mg poi 10 mg/die (Clopidogrel 600 → 75 mg)',
    mechanism: 'ASA inibisce irreversibilmente COX-1 (TXA2); P2Y12 bloccano il recettore ADP piastrinico (Ticagrelor reversibile; Prasugrel/Clopidogrel irreversibili)',
    antidoteOrSafety: 'Prasugrel è CONTROINDICATO in pregresso ictus/TIA; Ticagrelor può causare dispnea transitoria e pause bradicardiche (effetto adenosina-simile)',
    examPearl: 'Nella SCA si preferiscono i P2Y12 potenti (Prasugrel o Ticagrelor) rispetto a Clopidogrel; il Clopidogrel resta la scelta nella sindrome coronarica cronica e nella triplice terapia con DOAC.'
  },
  {
    name: 'Amiodarone (Cordarone)',
    category: 'Antiaritmico Classe III (Spettro Ampio)',
    group: 'Aritmie',
    indications: 'Cardioversione e profilassi FA in cardiopatia strutturale/HFrEF, TV/FV refrattaria a shock (ACLS)',
    dosage: 'ACLS FV/TV senza polso: 300 mg EV in bolo, poi 150 mg; FA: 300 mg EV in 30-60 min poi mantenimento 200 mg/die os',
    mechanism: 'Blocca i canali del K+ (prolunga ripolarizzazione e potenziale d\'azione) con effetti accessori di Classe I, II e IV',
    antidoteOrSafety: 'Tossicità d\'organo cronica (emivita 40-60 gg!): ipo/ipertiroidismo (contiene 37% iodio), fibrosi polmonare, microdepositi corneali, epatotossicità, fotosensibilità blu-grigia',
    examPearl: 'Pur allungando il QT, ha un rischio sorprendentemente BASSO di Torsione di Punta! È l\'unico antiaritmico di scelta nel paziente con cardiopatia strutturale o HFrEF.'
  },
  {
    name: 'Flecainide / Propafenone (Pill-in-the-Pocket)',
    category: 'Antiaritmici Classe IC',
    group: 'Aritmie',
    indications: 'Cardioversione farmacologica e mantenimento del ritmo sinusale in FA parossistica in cuore STRUTTURALMENTE SANO',
    dosage: 'Flecainide 200-300 mg os (pill-in-the-pocket) o 2 mg/kg EV; Propafenone 450-600 mg os',
    mechanism: 'Potenti bloccanti dei canali rapidi del Na+ con lenta dissociazione (rallentano la conduzione nel sistema His-Purkinje e allargano il QRS)',
    antidoteOrSafety: 'CONTROINDICAZIONE ASSOLUTA in cardiopatia ischemica (studio CAST!), pregresso IMA, HFrEF e ipertrofia ventricolare severa (rischio pro-aritmico fatale)',
    examPearl: 'Associare sempre un farmaco bloccante il nodo AV (beta-bloccante) perché la Classe IC può organizzare la FA in Flutter Atriale con conduzione 1:1 ad altissima frequenza!'
  },
  {
    name: 'Adenosina EV (Krenosin)',
    category: 'Antiaritmico Sovraventricolare (Emergenza)',
    group: 'Aritmie',
    indications: 'Interruzione acuta di Tachicardia Parossistica Sovraventricolare da rientro nodale (TRNAV) o AV (TRAV) a QRS stretto',
    dosage: 'Bolo EV RAPIDISSIMO (1-2 sec) in vena prossimale con flush di 20 mL fisiologica: 6 mg → se inefficace 12 mg → 12 mg',
    mechanism: 'Attiva recettori A1 del nodo AV aprendo canali K+ (iperpolarizzazione) e bloccando temporaneamente la conduzione AV',
    antidoteOrSafety: 'Emivita plasmatica < 10 secondi! Controindicata in asma grave (broncospasmo), BAV II-III e FA pre-eccitata (WPW con QRS largo irregolare!)',
    examPearl: 'Avvisare il paziente prima del bolo: avvertirà per 5-10 secondi vampate, senso di oppressione toracica e "sensazione di morte imminente" dovuti alla breve asistolia transitoria.'
  },
  {
    name: 'Statine ad Alta Intensità + Ezetimibe + PCSK9-i',
    category: 'Terapia Ipolipemizzante (Target LDL ESC)',
    group: 'Ipertensione & Lipidi',
    indications: 'Prevenzione primaria e secondaria cardiovascolare (post-SCA, diabete, ipercolesterolemia familiare)',
    dosage: 'Atorvastatina 40-80 mg o Rosuvastatina 20-40 mg/die (± Ezetimibe 10 mg/die ± Evolocumab/Alirocumab s.c.)',
    mechanism: 'Statine inibiscono HMG-CoA reduttasi (up-regolano recettori LDL); Ezetimibe blocca NPC1L1 intestinale; PCSK9-i impediscono la degradazione dei recettori LDL',
    antidoteOrSafety: 'Monitorare CPK (solo se mialgie) e transaminasi; rischio raro di rabdomiolisi e lieve aumento incidenza diabete',
    examPearl: 'Target LDL-C ESC nel rischio MOLTO ALTO (es. post-SCA): < 55 mg/dL E riduzione ≥ 50% dal basale (se 2° evento entro 2 anni: < 40 mg/dL)!'
  },
  {
    name: 'Nitrati (Nitroglicerina) & Calcio-Antagonisti (Amlodipina / Verapamil)',
    category: 'Antianginosi & Antiipertensivi',
    group: 'Ipertensione & Lipidi',
    indications: 'Angina pectoris (stabile e vasospastica di Prinzmetal), edema polmonare ipertensivo (NTG EV), ipertensione arteriosa',
    dosage: 'NTG sublinguale 0.3-0.4 mg al bisogno; Amlodipina 5-10 mg/die; Verapamil/Diltiazem (non-DHP) per rate control in FA/angina',
    mechanism: 'Nitrati liberano NO (venodilatazione → riducono precarico e tensione parietale); CCB bloccano canali Ca2+ tipo L (DHP sui vasi, non-DHP su cuore/nodo AV)',
    antidoteOrSafety: 'NTG CONTROINDICATA in infarto del ventricolo destro, stenosi aortica severa e assunzione di inibitori PDE-5 (Sildenafil/Tadalafil nelle ultime 24-48h: shock fatale!)',
    examPearl: 'Per evitare la tachifilassi (tolleranza ai nitrati) serve un intervallo nitrate-free di 8-12 ore. Non associare MAI Verapamil/Diltiazem a un beta-bloccante (rischio BAV completo)!'
  },
  {
    name: 'Labetalolo EV (Trandate)',
    category: 'Emergenze Ipertensive',
    group: 'Ipertensione & Lipidi',
    indications: 'Crisi ed emergenze ipertensive, preeclampsia/eclampsia, dissezione aortica acuta',
    dosage: 'Bolo EV di 20 mg in 2 minuti, ripetibile ogni 10 min fino a 80 mg o infusione 1-2 mg/min',
    mechanism: 'Antagonista combinato dei recettori α1 e β adrenergici (rapporto α/β 1:7 EV)',
    antidoteOrSafety: 'Mantiene la portata cardiaca senza provocare tachicardia riflessa; controindicato in asma grave e BAV II-III',
    examPearl: 'Farmaco di prima scelta assoluta nell\'ipertensione grave in GRAVIDANZA e nella dissezione aortica acuta (target PAS 100-120 mmHg e FC < 60 bpm).'
  },
  {
    name: 'Schema RIPE (TBC)',
    category: 'Antitubercolari',
    group: 'Pneumo',
    indications: 'Tubercolosi attiva polmonare ed extrapolmonare',
    dosage: 'Rifampicina (10 mg/kg), Isoniazide (5 mg/kg), Pirazinamide (25 mg/kg), Etambutolo (15 mg/kg) per 2 mesi (+ 4 mesi RI)',
    mechanism: 'Rifampicina (RNA polimerasi), Isoniazide (acidi micolici + integrare Vit B6), Pirazinamide, Etambutolo (arabinosiltransferasi)',
    antidoteOrSafety: 'Monitoraggio AST/ALT (epatotossicità) e controllo visus/discromatopsia per Etambutolo (neurite ottica retrobulbare)',
    examPearl: 'La Rifampicina colora urine, lacrime e sudore di rosso-arancio (avvisare il paziente) ed è un potentissimo induttore del CYP450 (riduce efficacia di DOAC, warfarin, estroprogestinici)!'
  }
];

export const PharmaCompendium: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeGroup, setActiveGroup] = useState<DrugGroup>('Tutti');

  const filtered = DRUGS.filter((d) => {
    const matchesGroup = activeGroup === 'Tutti' || d.group === activeGroup;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.indications.toLowerCase().includes(q) ||
      d.examPearl.toLowerCase().includes(q);
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="space-y-5">
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-400 mb-1">
              <Pill className="w-5 h-5" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Farmacoterapia Clinica</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Prontuario Farmacologico d'Esame ({DRUGS.length} Schede)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Pilastri dello scompenso, antiaritmici, DAPT, DOAC, ipolipemizzanti e trabocchetti d'esame.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cerca farmaco, classe o perla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800/80">
          {GROUPS.map((grp) => {
            const count = grp === 'Tutti' ? DRUGS.length : DRUGS.filter((d) => d.group === grp).length;
            return (
              <button
                key={grp}
                onClick={() => setActiveGroup(grp)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition border ${
                  activeGroup === grp
                    ? 'bg-rose-500/20 text-rose-200 border-rose-500/40'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {grp} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-xs font-mono text-slate-400">
          Nessun farmaco corrisponde a "{searchTerm}" nella categoria {activeGroup}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((d) => (
            <div key={d.name} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-rose-500/40 transition flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                    {d.category}
                  </span>
                  <h2 className="text-base font-bold text-white mt-1.5">{d.name}</h2>
                </div>

                <div className="space-y-2 text-[13px] leading-relaxed">
                  <div>
                    <span className="text-slate-400 font-mono text-xs">Indicazioni: </span>
                    <span className="text-slate-200">{d.indications}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-xs">Posologia: </span>
                    <span className="text-cyan-300 font-mono text-xs">{d.dosage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-xs">Meccanismo: </span>
                    <span className="text-slate-300">{d.mechanism}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs leading-relaxed text-emerald-300 flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{d.antidoteOrSafety}</span>
                </div>

                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs leading-relaxed text-amber-200 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{d.examPearl}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
