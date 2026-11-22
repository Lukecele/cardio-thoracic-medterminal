import React, { useState } from 'react';
import { Activity, Zap, CheckCircle2, AlertTriangle, Shuffle, Eye } from 'lucide-react';

interface EcgCase {
  id: string;
  name: string;
  category: string;
  rhythm: string;
  lead: string;
  heartRate: number;
  description: string;
  keyFeatures: string[];
  clinicalAction: string;
  svgType:
    | 'normal'
    | 'stemi-anterior'
    | 'stemi-inferior'
    | 'afib'
    | 'flutter'
    | 'vt'
    | 'bav3'
    | 'wpw'
    | 'pericarditis'
    | 'bav2-mobitz1'
    | 'hyperk'
    | 'tdp';
}

const ECG_CASES: EcgCase[] = [
  {
    id: 'stemi-ant',
    name: 'STEMI Anteriore Esteso (Occlusione IVA)',
    category: 'Ischemia Acuta',
    rhythm: 'Sinusale con sopraslivellamento ST',
    lead: 'V1 - V4',
    heartRate: 88,
    description: 'Sopraslivellamento del tratto ST convesso verso l\'alto nelle derivazioni precordiali anteriori (V1-V4), con onde T giganti iperacute ed onde Q di necrosi in evoluzione.',
    keyFeatures: [
      'ST sopraslivellato al punto J ≥ 2 mm in V2-V3',
      'Onde T giganti e simmetriche precoci',
      'Sottoslivellamento speculare nelle derivazioni inferiori (III, aVF)',
      'Occlusione acuta dell\'Arteria Interventricolare Anteriore (IVA)'
    ],
    clinicalAction: 'Attivazione immediata del laboratorio di Emodinamica per Angioplastica Primaria (PCI) entro 120 minuti dal primo contatto + DAPT (ASA + Ticagrelor/Prasugrel) + Eparina EV.',
    svgType: 'stemi-anterior'
  },
  {
    id: 'stemi-inf',
    name: 'STEMI Inferiore con Coinvolgimento VD (Occlusione CDx)',
    category: 'Ischemia Acuta',
    rhythm: 'Sinusale con sopraslivellamento ST inferiore',
    lead: 'II, III, aVF',
    heartRate: 56,
    description: 'Sopraslivellamento ST nelle derivazioni periferiche inferiori (II, III, aVF) con sottoslivellamento speculare in I e aVL. Spesso associato a bradicardia sinusale o BAV per ischemia del nodo AV.',
    keyFeatures: [
      'Sopraslivellamento ST in II, III, aVF ≥ 1 mm',
      'Sottoslivellamento speculare marcato in aVL e D1',
      'Rischio di coinvolgimento del Ventricolo Destro (eseguire V3R-V4R)',
      'Occlusione dell\'Arteria Coronaria Destra (CDx) o Circonflessa'
    ],
    clinicalAction: 'PCI primaria urgente. ATTENZIONE: se presente infarto del ventricolo destro, i NITRATI e i DIURETICI sono controindicati (rischio di collasso emodinamico da crollo del precarico); idratazione con fisiologica!',
    svgType: 'stemi-inferior'
  },
  {
    id: 'afib',
    name: 'Fibrillazione Atriale ad Elevata Risposta Ventricolare',
    category: 'Tachiaritmie Sopraventricolari',
    rhythm: 'Aritmia Totale (Intervalli R-R irregolari)',
    lead: 'D2 / V1',
    heartRate: 142,
    description: 'Completa assenza di onde P organizzate, sostituite da ondulazioni caotiche della linea isoelettrica (onde f ad alta frequenza 350-600 bpm), con risposta ventricolare totalmente irregolare.',
    keyFeatures: [
      'Assenza di onde P riconoscibili',
      'Intervalli R-R completamente disuguali (aritmia totale)',
      'Complessi QRS stretti (< 120 ms) salvo conduzione aberrante',
      'Frequenza ventricolare media tachicardica (> 100 bpm)'
    ],
    clinicalAction: 'Valutazione stabilità emodinamica: se instabile (shock, EPA) -> Cardioversione Elettrica Sincronizzata immediata. Se stabile: controllo della frequenza con Beta-bloccante EV (Metoprololo) e calcolo dello score CHA2DS2-VA (ESC 2024) per anticoagulazione orale con DOAC.',
    svgType: 'afib'
  },
  {
    id: 'flutter',
    name: 'Flutter Atriale Tipico con Conduzione 2:1',
    category: 'Tachiaritmie Sopraventricolari',
    rhythm: 'Regolare a 150 bpm',
    lead: 'II, III, aVF, V1',
    heartRate: 150,
    description: 'Presenza di caratteristiche onde F "a dente di sega" regolari e continue, negative nelle derivazioni inferiori, con frequenza atriale fissa a 300 bpm e blocco AV fisiologico 2:1 (FC ventricolare 150 bpm).',
    keyFeatures: [
      'Onde F a dente di sega (flutter waves) senza linea isoelettrica tra di esse',
      'Frequenza atriale tipica: 300 bpm esatti',
      'Conduzione AV più frequente: 2:1 (risultante in FC ventricolare fissa di 150 bpm)',
      'Circuito di macrorientro nell\'atrio destro istmo-dipendente'
    ],
    clinicalAction: 'Ablazione transcatetere con radiofrequenza dell\'istmo cavo-tricuspidale (terapia curativa gold standard di prima linea) + profilassi tromboembolica identica alla FA.',
    svgType: 'flutter'
  },
  {
    id: 'vt',
    name: 'Tachicardia Ventricolare Monomorfa Sostenuta (TV)',
    category: 'Tachiaritmie Ventricolari',
    rhythm: 'Tachicardia a complessi larghi regolare',
    lead: 'V1 - V6',
    heartRate: 185,
    description: 'Successione rapida e regolare di complessi QRS larghi (> 120-140 ms) con morfologia identica, deviazione assiale estrema, dissociazione atrio-ventricolare e possibili battiti di cattura o fusione.',
    keyFeatures: [
      'QRS larghi e bizzarri > 140 ms a frequenza 150-250 bpm',
      'Dissociazione AV (onde P indipendenti che marciano per conto proprio)',
      'Battiti di cattura e battiti di fusione (patognomonici di TV)',
      'Concordanza positiva o negativa in tutte le precordiali (V1-V6)'
    ],
    clinicalAction: 'EMERGENZA: Se polso assente -> Protocollo DAE / Defibrillazione asincrona immediata + RCP! Se paziente cosciente ed emodinamicamente stabile -> Amiodarone EV (300 mg bolo) o Cardioversione elettrica sincronizzata sedata.',
    svgType: 'vt'
  },
  {
    id: 'bav3',
    name: 'Blocco Atrio-Ventricolare di III Grado (BAV Completo)',
    category: 'Bradiaritmie',
    rhythm: 'Dissociazione AV completa con ritmo di scappamento',
    lead: 'D2 / V1',
    heartRate: 34,
    description: 'Nessun impulso atriale viene condotto ai ventricoli. Le onde P atriali hanno una frequenza propria (es. 75 bpm) e i complessi QRS ventricolari hanno un ritmo di scappamento autonomo bradicardico (30-40 bpm).',
    keyFeatures: [
      'Onde P regolari (intervalli P-P costanti)',
      'Complessi QRS regolari (intervalli R-R costanti)',
      'Intervallo P-R totalmente variabile e casuale (dissociazione AV completa)',
      'Frequenza atriale SEMPRE superiore alla frequenza ventricolare'
    ],
    clinicalAction: 'Indicazione TASSATIVA e urgente a posizionamento di Pacemaker definitivo endocavitario! In acuto: Atropina EV (0.5-1 mg) o infusione di Isoprenalina / stimolazione transcutanea temporanea se instabile.',
    svgType: 'bav3'
  },
  {
    id: 'wpw',
    name: 'Sindrome di Wolff-Parkinson-White (WPW)',
    category: 'Pre-eccitazione Ventricolare',
    rhythm: 'Sinusale pre-eccitato',
    lead: 'D1, V4 - V6',
    heartRate: 72,
    description: 'Conduzione anomala attraverso una via accessoria atrio-ventricolare (Fascio di Kent) che bypassa il nodo AV, depolarizzando precocemente una porzione di miocardio ventricolare.',
    keyFeatures: [
      'Intervallo P-R marcatamente corto (< 120 ms / < 3 quadratini piccoli)',
      'Onda Delta iniziale: impastamento ascendente lento del QRS',
      'Complesso QRS allargato (> 100-120 ms)',
      'Rischio di fibrillazione atriale pre-eccitata condotta ad altissima frequenza (FBI rhythm)'
    ],
    clinicalAction: 'Studio elettrofisiologico endocavitario con ablazione transcatetere a radiofrequenza della via accessoria (Kent). CONTROINDICAZIONE ASSOLUTA a farmaci che bloccano il nodo AV (Verapamil, Diltiazem, Digitale) in caso di FA su WPW!',
    svgType: 'wpw'
  },
  {
    id: 'pericarditis',
    name: 'Pericardite Acuta (ST Diffuso a Sella & PR Depresso)',
    category: 'Pericardiopatie',
    rhythm: 'Sinusale tachicardico con ST concavo diffuso',
    lead: 'D1, D2, V2 - V6 (speculare in aVR)',
    heartRate: 104,
    description: 'Sopraslivellamento del tratto ST diffuso (non confinato a un singolo territorio coronarico), con morfologia CONCAVA verso l\'alto ("a sella"), associato a caratteristico sottoslivellamento del segmento PR (e sopraslivellamento PR in aVR).',
    keyFeatures: [
      'Sopraslivellamento ST diffuso e concavo verso l\'alto in quasi tutte le derivazioni',
      'Sottoslivellamento del segmento PR (segno precoce altamente specifico)',
      'Assenza di onde Q patologiche e assenza di sottoslivellamenti speculari (eccetto aVR/V1)',
      'Rapporto ampiezza ST / onda T in V6 > 0.25 (aiuta a distinguere dalla ripolarizzazione precoce)'
    ],
    clinicalAction: 'Terapia antinfiammatoria di prima linea (ESC): FANS ad alte dosi (Ibuprofene 600 mg x3/die o ASA) + Colchicina (0.5 mg x1-2/die per 3 mesi per prevenire recidive) + gastroprotezione + riposo fisico. Eseguire ecocardiogramma per escludere versamento/tamponamento!',
    svgType: 'pericarditis'
  },
  {
    id: 'bav2-mobitz1',
    name: 'BAV II Grado Mobitz 1 (Periodismo di Luciani-Wenckebach)',
    category: 'Bradiaritmie',
    rhythm: 'Irregolarmente regolare a battiti raggruppati',
    lead: 'D2 / V1',
    heartRate: 58,
    description: 'Progressivo allungamento dell\'intervallo PR di battito in battito fino a un\'onda P che non viene seguita dal complesso QRS (battito bloccato). Dopo la pausa, il ciclo riparte con un PR più corto. Sede tipicamente nodale AV (soprahissiana).',
    keyFeatures: [
      'Progressivo allungamento dell\'intervallo PR fino a un\'onda P bloccata',
      'L\'incremento maggiore del PR avviene tra il 1° e il 2° battito (intervalli R-R si accorciano)',
      'QRS tipicamente stretto (blocco nel nodo AV, benigno)',
      'Differenza chiave con Mobitz 2: nel Mobitz 2 il PR è COSTANTE prima della P bloccata (rischio evoluzione a BAV III!)'
    ],
    clinicalAction: 'Se asintomatico (es. atleti o durante il sonno per ipertono vagale): nessuna terapia, solo follow-up. Se sintomatico o da farmaci bradicardizzanti (beta-bloccanti/calcio-antagonisti/digitale): sospendere il farmaco. Nel Mobitz 2 invece l\'indicazione a Pacemaker definitivo è tassativa (Classe I)!',
    svgType: 'bav2-mobitz1'
  },
  {
    id: 'hyperk',
    name: 'Iperkaliemia Moderata-Severa (Onde T a Tenda)',
    category: 'Squilibri Elettrolitici',
    rhythm: 'Sinusale con T appuntite e QRS in slargamento',
    lead: 'V2 - V5',
    heartRate: 62,
    description: 'Alterazione elettrolitica potenzialmente fatale. L\'iperkaliemia accorcia il potenziale d\'azione producendo onde T alte, strette e simmetriche ("a tenda"), seguite con l\'aumento del K+ da appiattimento delle onde P, allungamento del PR e progressivo slargamento del QRS fino al pattern sinusoidale.',
    keyFeatures: [
      'K+ 5.5–6.5 mEq/L: onde T alte, strette, appuntite e simmetriche ("a tenda")',
      'K+ 6.5–7.5 mEq/L: allungamento PR e appiattimento/scomparsa delle onde P',
      'K+ > 7.5–8.0 mEq/L: slargamento progressivo del QRS fino a onda sinusoidale e FV/asistolia',
      'Frequente in IRC avanzata o associazione ACEi/ARNI + MRA + FANS'
    ],
    clinicalAction: 'EMERGENZA: 1) Stabilizzare subito la membrana miocardica con CALCIO GLUCONATO 10% EV (agisce in 1-3 min, non abbassa il K+ ma previene l\'arresto!); 2) Shift intracellulare con Insulina + Glucosio EV e Salbutamolo aerosol; 3) Eliminazione del K+ (Furosemide, resine leganti, dialisi se refrattaria).',
    svgType: 'hyperk'
  },
  {
    id: 'tdp',
    name: 'Torsione di Punta (TdP) su QT Lungo',
    category: 'Tachiaritmie Ventricolari',
    rhythm: 'TV Polimorfa a fuso (200-250 bpm)',
    lead: 'D2 / V2 - V5',
    heartRate: 220,
    description: 'Tachicardia ventricolare polimorfa caratterizzata da complessi QRS larghi la cui ampiezza e polarità ruotano ciclicamente attorno alla linea isoelettrica ("torsione" a fuso). Insorge tipicamente su QTc prolungato (> 500 ms) con fenomeno R-su-T.',
    keyFeatures: [
      'Complessi QRS larghi polimorfi con ampiezza crescente e decrescente (aspetto a fuso)',
      'Asse elettrico che ruota periodicamente sopra e sotto la linea isoelettrica',
      'Substrato obbligatorio: QTc prolungato (congenito o acquisito da farmaci/ipokaliemia/ipomagnesemia)',
      'Può risolversi spontaneamente (sincope) o degenerare in Fibrillazione Ventricolare'
    ],
    clinicalAction: 'Se emodinamicamente instabile/senza polso -> Defibrillazione immediata! Se stabile o ricorrente -> SOLFATO DI MAGNESIO (MgSO4 2g EV in 1-2 min) prima scelta assoluta anche con Mg sierico normale + correzione K+ (> 4.5 mEq/L) + sospensione immediata di farmaci che allungano il QT (Amiodarone, macrolidi, fluorochinoloni).',
    svgType: 'tdp'
  }
];

export const EcgSimulator: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(ECG_CASES[0].id);
  const [showAnswer, setShowAnswer] = useState<boolean>(true);
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [userGuess, setUserGuess] = useState<string | null>(null);
  const [quizStats, setQuizStats] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  const activeCase = ECG_CASES.find(c => c.id === selectedCaseId) || ECG_CASES[0];

  const pickRandomBlindCase = () => {
    const others = ECG_CASES.filter(c => c.id !== selectedCaseId);
    const next = others[Math.floor(Math.random() * others.length)] || ECG_CASES[0];
    setQuizMode(true);
    setSelectedCaseId(next.id);
    setShowAnswer(false);
    setUserGuess(null);
  };

  const renderEcgWaveform = (type: string) => {
    // Interactive synthetic SVG path simulating ECG strip
    let pathD = "";
    if (type === 'normal') {
      pathD = "M 0 50 Q 20 48 40 50 Q 50 42 60 50 L 70 50 L 75 58 L 85 10 L 95 62 L 100 50 L 120 50 Q 140 35 160 50 L 200 50 " +
              "M 200 50 Q 220 48 240 50 Q 250 42 260 50 L 270 50 L 275 58 L 285 10 L 295 62 L 300 50 L 320 50 Q 340 35 360 50 L 400 50 " +
              "M 400 50 Q 420 48 440 50 Q 450 42 460 50 L 470 50 L 475 58 L 485 10 L 495 62 L 500 50 L 520 50 Q 540 35 560 50 L 600 50";
    } else if (type === 'stemi-anterior') {
      // High elevated ST wave
      pathD = "M 0 50 Q 30 50 50 50 L 60 52 L 70 8 L 80 50 L 85 20 Q 120 18 140 50 L 180 50 " +
              "M 180 50 Q 210 50 230 50 L 240 52 L 250 8 L 260 50 L 265 20 Q 300 18 320 50 L 360 50 " +
              "M 360 50 Q 390 50 410 50 L 420 52 L 430 8 L 440 50 L 445 20 Q 480 18 500 50 L 540 50";
    } else if (type === 'stemi-inferior') {
      // Deep Q wave and ST elevation
      pathD = "M 0 50 Q 30 50 45 50 L 55 68 L 65 20 L 75 30 Q 100 25 125 50 L 170 50 " +
              "M 170 50 Q 200 50 215 50 L 225 68 L 235 20 L 245 30 Q 270 25 295 50 L 340 50 " +
              "M 340 50 Q 370 50 385 50 L 395 68 L 405 20 L 415 30 Q 440 25 465 50 L 510 50";
    } else if (type === 'afib') {
      // Chaotic baseline + irregular R-R intervals
      pathD = "M 0 50 Q 8 46 15 53 Q 22 47 30 52 L 35 60 L 42 12 L 50 58 L 56 49 " +
              "Q 65 47 75 54 Q 85 46 95 52 Q 105 48 115 53 L 120 60 L 127 12 L 135 58 L 140 50 " +
              "Q 155 48 170 53 Q 185 47 200 52 Q 220 48 240 53 L 245 60 L 252 12 L 260 58 L 266 50 " +
              "Q 275 47 285 53 Q 300 48 315 52 L 320 60 L 327 12 L 335 58 L 340 50 Q 360 48 380 52 " +
              "Q 400 47 420 53 L 425 60 L 432 12 L 440 58 L 446 50 Q 460 48 480 53 L 485 60 L 492 12 L 500 58 L 506 50";
    } else if (type === 'flutter') {
      // Continuous sawtooth waves at 300 bpm, regular QRS every 2nd wave
      pathD = "M 0 50 L 15 35 L 30 65 L 45 35 L 50 12 L 60 65 L 75 35 L 90 65 L 105 35 L 110 12 L 120 65 " +
              "L 135 35 L 150 65 L 165 35 L 170 12 L 180 65 L 195 35 L 210 65 L 225 35 L 230 12 L 240 65 " +
              "L 255 35 L 270 65 L 285 35 L 290 12 L 300 65 L 315 35 L 330 65 L 345 35 L 350 12 L 360 65";
    } else if (type === 'vt') {
      // Broad bizarre regular QRS complexes
      pathD = "M 0 50 Q 15 80 30 15 Q 45 85 60 50 Q 75 80 90 15 Q 105 85 120 50 " +
              "Q 135 80 150 15 Q 165 85 180 50 Q 195 80 210 15 Q 225 85 240 50 " +
              "Q 255 80 270 15 Q 285 85 300 50 Q 315 80 330 15 Q 345 85 360 50 " +
              "Q 375 80 390 15 Q 405 85 420 50 Q 435 80 450 15 Q 465 85 480 50";
    } else if (type === 'bav3') {
      // Complete AV dissociation: slow wide QRS + independent P waves
      pathD = "M 0 50 Q 20 40 40 50 L 60 50 L 70 75 L 85 5 L 100 80 L 115 50 Q 140 38 160 50 " +
              "Q 185 40 200 50 L 230 50 Q 255 40 270 50 L 290 50 L 300 75 L 315 5 L 330 80 L 345 50 " +
              "Q 370 38 390 50 Q 415 40 430 50 L 460 50 Q 485 40 500 50 L 520 50 L 530 75 L 545 5 L 560 80 L 575 50";
    } else if (type === 'wpw') {
      // Short PR + Delta wave slurring
      pathD = "M 0 50 Q 20 42 35 50 L 45 50 L 58 35 L 68 8 L 78 58 L 85 50 Q 105 38 125 50 L 160 50 " +
              "M 160 50 Q 180 42 195 50 L 205 50 L 218 35 L 228 8 L 238 58 L 245 50 Q 265 38 285 50 L 320 50 " +
              "M 320 50 Q 340 42 355 50 L 365 50 L 378 35 L 388 8 L 398 58 L 405 50 Q 425 38 445 50 L 480 50";
    } else if (type === 'pericarditis') {
      // Depressed PR segment + concave saddle-shaped ST elevation
      pathD = "M 0 50 Q 14 43 28 52 L 46 56 L 52 58 L 60 12 L 68 54 L 74 36 Q 100 44 122 28 Q 134 40 144 50 L 175 50 " +
              "M 175 50 Q 189 43 203 52 L 221 56 L 227 58 L 235 12 L 243 54 L 249 36 Q 275 44 297 28 Q 309 40 319 50 L 350 50 " +
              "M 350 50 Q 364 43 378 52 L 396 56 L 402 58 L 410 12 L 418 54 L 424 36 Q 450 44 472 28 Q 484 40 494 50 L 540 50";
    } else if (type === 'bav2-mobitz1') {
      // Wenckebach: progressively longer PR, then dropped QRS after 4th P wave
      pathD = "M 0 50 Q 12 41 24 50 L 32 50 L 38 12 L 45 58 L 50 50 Q 68 38 85 50 L 105 50 " +
              "Q 117 41 129 50 L 152 50 L 158 12 L 165 58 L 170 50 Q 188 38 205 50 L 222 50 " +
              "Q 234 41 246 50 L 284 50 L 290 12 L 297 58 L 302 50 Q 320 38 337 50 L 355 50 " +
              "Q 367 41 379 50 L 455 50 " +
              "Q 467 41 479 50 L 487 50 L 493 12 L 500 58 L 505 50 Q 522 38 540 50";
    } else if (type === 'hyperk') {
      // Flattened P, wide QRS, tall peaked tented T waves
      pathD = "M 0 50 Q 16 48 30 50 L 50 50 L 58 62 L 72 16 L 88 64 L 98 50 L 114 48 L 128 8 L 142 48 L 175 50 " +
              "M 175 50 Q 191 48 205 50 L 225 50 L 233 62 L 247 16 L 263 64 L 273 50 L 289 48 L 303 8 L 317 48 L 350 50 " +
              "M 350 50 Q 366 48 380 50 L 400 50 L 408 62 L 422 16 L 438 64 L 448 50 L 464 48 L 478 8 L 492 48 L 540 50";
    } else if (type === 'tdp') {
      // Polymorphic spindle-shaped twisting around baseline
      pathD = "M 0 50 Q 10 22 20 50 Q 30 82 40 50 Q 50 12 60 50 Q 70 90 80 50 Q 90 18 100 50 Q 110 72 120 50 " +
              "Q 130 38 140 50 Q 150 60 160 50 Q 170 42 180 50 Q 190 68 200 50 Q 210 18 220 50 Q 230 88 240 50 " +
              "Q 250 10 260 50 Q 270 90 280 50 Q 290 25 300 50 Q 310 68 320 50 Q 330 42 340 50 Q 350 58 360 50 " +
              "Q 370 32 380 50 Q 390 80 400 50 Q 410 14 420 50 Q 430 88 440 50 Q 450 20 460 50 Q 470 72 480 50 Q 495 36 510 50 Q 525 66 540 50";
    }

    return (
      <svg className="w-full h-36 bg-[#040810] rounded-xl border border-cyan-950 overflow-hidden" viewBox="0 0 550 100">
        {/* ECG Grid Background */}
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#0e2a3b" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="url(#smallGrid)" />
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#005577" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Dynamic Trace */}
        <path d={pathD} fill="none" stroke="#00f2fe" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 mb-1">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Cardiologia Strumentale</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Simulatore Tracciati ECG Clinici</h1>
          <p className="text-xs text-slate-400 mt-1">
            Analisi del ritmo, sopraslivellamento ST, aritmie ventricolari e blocchi di conduzione d'esame.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {quizMode && quizStats.total > 0 && (
            <span className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              Score: {quizStats.correct}/{quizStats.total}
            </span>
          )}
          <button
            onClick={pickRandomBlindCase}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-2 border bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25"
            title="Estrae un tracciato casuale a diagnosi nascosta per interrogarsi a coppia"
          >
            <Shuffle className="w-4 h-4" />
            <span>Casuale (Esame a Coppia)</span>
          </button>
          <button
            onClick={() => {
              const nextQuiz = !quizMode;
              setQuizMode(nextQuiz);
              setShowAnswer(!nextQuiz);
              setUserGuess(null);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-2 border ${
              quizMode
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{quizMode ? 'Modalità Cieca ON' : 'Modalità Cieca'}</span>
          </button>
        </div>
      </div>

      {/* Case Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        {ECG_CASES.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCaseId(c.id);
              if (quizMode) {
                setShowAnswer(false);
                setUserGuess(null);
              }
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition border text-left ${
              selectedCaseId === c.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-lg shadow-cyan-950/50'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] text-slate-500 uppercase">{c.category}</div>
            <div className="font-semibold text-slate-200 mt-0.5">{quizMode && !showAnswer ? `Tracciato #${c.id.toUpperCase()}` : c.name}</div>
          </button>
        ))}
      </div>

      {/* ECG Monitor Box */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-900/40 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-900 pb-3 gap-2">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
              DERIVAZIONE {activeCase.lead} • 25 mm/s • 10 mm/mV
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              FC: {activeCase.heartRate} BPM
            </span>
            <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              RITMO: {quizMode && !showAnswer ? '???' : activeCase.rhythm}
            </span>
          </div>
        </div>

        {/* Dynamic Trace Canvas */}
        {renderEcgWaveform(activeCase.svgType)}

        {/* Quiz Guessing Buttons if in Quiz Mode */}
        {quizMode && !showAnswer && (
          <div className="pt-4 border-t border-slate-900 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-mono text-amber-400 font-semibold">
                🎯 Qual è la diagnosi corretta di questo tracciato? (Scegli o rispondi a voce col collega)
              </div>
              <button
                onClick={() => setShowAnswer(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 flex items-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Rivela Diagnosi</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ECG_CASES.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setUserGuess(opt.id);
                    setShowAnswer(true);
                    setQuizStats(prev => ({
                      correct: prev.correct + (opt.id === activeCase.id ? 1 : 0),
                      total: prev.total + 1
                    }));
                  }}
                  className="p-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-xl text-left text-xs text-slate-300 hover:text-white transition font-mono"
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clinical Details & Action Card */}
      {showAnswer && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in duration-200">
          {/* Diagnostic Features */}
          <div className="md:col-span-7 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <span>{activeCase.name}</span>
              </h2>
              {quizMode && userGuess && (
                <span className={`text-xs font-mono px-2.5 py-1 rounded-lg font-bold ${
                  userGuess === activeCase.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {userGuess === activeCase.id ? 'CORRETTO! 🎉' : 'ERRATO ❌'}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeCase.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider block">
                Criteri ECG Chiave d'Esame:
              </span>
              <ul className="space-y-1.5">
                {activeCase.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Emergency Management Card */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-rose-950/20 p-5 rounded-2xl border border-rose-900/30 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-rose-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-mono uppercase font-bold tracking-wider">
                  Condotta Terapeutica Immediata
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeCase.clinicalAction}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
              Corrispondenza Teoria Clinica: capitolo <span className="text-cyan-300 font-bold">Aritmologia Clinica & ECG</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
