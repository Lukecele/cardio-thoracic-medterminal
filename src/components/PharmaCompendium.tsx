import React, { useState } from 'react';
import { Pill, ShieldCheck, AlertCircle, Search, Activity } from 'lucide-react';

interface DrugCard {
  name: string;
  category: string;
  indications: string;
  dosage: string;
  mechanism: string;
  antidoteOrSafety: string;
  examPearl: string;
}

const DRUGS: DrugCard[] = [
  {
    name: 'Dabigatran (Pradaxa)',
    category: 'Anticoagulanti Orali Diretti (DOAC)',
    indications: 'Fibrillazione Atriale non valvolare, TVP ed Embolia Polmonare',
    dosage: '150 mg bid (110 mg bid se età ≥ 80 anni o clearance 30-49 ml/min)',
    mechanism: 'Inibitore diretto e reversibile della Trombina libera e legata (Fattore IIa)',
    antidoteOrSafety: 'Antidoto specifico immediato: Idarucizumab (Praxbind) 5g EV in due flaconi',
    examPearl: 'È l\'UNICO tra i DOAC ad essere un inibitore diretto della Trombina (IIa); tutti gli altri inibiscono il Fattore Xa!'
  },
  {
    name: 'Rivaroxaban / Apixaban / Edoxaban',
    category: 'Anticoagulanti Orali Diretti (DOAC)',
    indications: 'FA non valvolare, prevenzione e trattamento TVP/EP',
    dosage: 'Rivaroxaban 20 mg/die; Apixaban 5 mg bid; Edoxaban 60 mg/die',
    mechanism: 'Inibitori selettivi e diretti del Fattore Xa attivato della coagulazione',
    antidoteOrSafety: 'Antidoto specifico: Andexanet alfa (Ondexxya)',
    examPearl: 'Non richiedono il monitoraggio periodico dell\'INR, ma sono controindicati nei pazienti con Protesi Meccaniche e stenosi mitralica severa!'
  },
  {
    name: 'Sacubitril / Valsartan (Entresto)',
    category: 'Scompenso Cardiaco (ARNI)',
    indications: 'Scompenso cardiaco a frazione d\'eiezione ridotta (HFrEF ≤ 40%) sintomatico',
    dosage: 'Partenza 24/26 o 49/51 mg bid; target 97/103 mg bid a stomaco pieno',
    mechanism: 'Doppio blocco: inibizione della Neprilisina (aumenta BNP e vasodilatazione) + blocco recettore AT1 angiotensina II',
    antidoteOrSafety: 'Richiede wash-out di 36 ORE dalla sospensione dell\'ACE-inibitore per evitare angioedema fatale!',
    examPearl: 'Fa salire i livelli plasmatici di BNP! Pertanto per monitorare lo scompenso si deve dosare l\'NT-proBNP (che non è substrato della neprilisina).'
  },
  {
    name: 'Labetalolo EV (Trandate)',
    category: 'Emergenze Ipertensive',
    indications: 'Crisi ed emergenze ipertensive, eclampsia, dissezione aortica acuta',
    dosage: 'Bolo EV di 20 mg in 2 minuti, ripetibile ogni 10 min fino a 80 mg o infusione 1-2 mg/min',
    mechanism: 'Antagonista combinato dei recettori alfa-1 e beta adrenergici (rapporto alfa/beta 1:7 EV)',
    antidoteOrSafety: 'Mantiene la portata cardiaca senza provocare tachicardia riflessa; controindicato in asma grave e BAV II-III',
    examPearl: 'Farmaco di prima scelta assoluta nell\'ipertensione grave in GRAVIDANZA (preeclampsia/eclampsia) e nella dissezione aortica.'
  },
  {
    name: 'Schema RIPE (TBC)',
    category: 'Antitubercolari',
    indications: 'Tubercolosi attiva polmonare ed extrapolmonare',
    dosage: 'Rifampicina (10 mg/kg), Isoniazide (5 mg/kg), Pirazinamide (25 mg/kg), Etambutolo (15 mg/kg) per 2 mesi',
    mechanism: 'Rifampicina (blocca RNA polimerasi batterica), Isoniazide (inibisce acidi micolici parete), Pirazinamide, Etambutolo (inibisce arabinosiltransferasi)',
    antidoteOrSafety: 'Monitoraggio enzimi epatici AST/ALT (epatotossicità); controllo visivo per Etambutolo (neurite ottica retrobulbare)',
    examPearl: 'La Rifampicina colora le urine, le lacrime e il sudore di colore arancione/rosso intenso (avvisare il paziente) ed è un potente induttore del CYP450!'
  }
];

export const PharmaCompendium: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = DRUGS.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.indications.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 mb-1">
            <Pill className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Farmacoterapia Clinica</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Prontuario Farmacologico d'Esame</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dosaggi d'emergenza, meccanismi d'azione, antidoti salvavita e trabocchetti farmacologici.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cerca farmaco o classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((d, i) => (
          <div key={i} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-rose-500/40 transition">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                  {d.category}
                </span>
                <h2 className="text-base font-bold text-white mt-1.5 font-mono">{d.name}</h2>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div>
                <span className="text-slate-400">Indicazioni: </span>
                <span className="text-slate-200">{d.indications}</span>
              </div>
              <div>
                <span className="text-slate-400">Posologia: </span>
                <span className="text-cyan-300">{d.dosage}</span>
              </div>
              <div>
                <span className="text-slate-400">Meccanismo: </span>
                <span className="text-slate-300">{d.mechanism}</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{d.antidoteOrSafety}</span>
            </div>

            <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs font-mono text-amber-200 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{d.examPearl}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
