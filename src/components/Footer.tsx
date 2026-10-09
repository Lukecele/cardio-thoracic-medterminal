import React, { useState } from 'react';
import {
  GitBranch,
  ShieldAlert,
  Heart,
  Scale,
  X,
  Stethoscope,
  Terminal,
  Award,
  Sparkles,
  BookOpen,
  Coffee,
  CheckCircle2,
  Lock
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface FooterProps {
  externalLegalOpen?: boolean;
  onCloseExternalLegal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ externalLegalOpen, onCloseExternalLegal }) => {
  const [internalLegalOpen, setInternalLegalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<'disclaimer' | 'sources' | 'privacy'>('disclaimer');

  const isModalOpen = externalLegalOpen !== undefined ? externalLegalOpen : internalLegalOpen;
  const handleClose = () => {
    if (onCloseExternalLegal) onCloseExternalLegal();
    else setInternalLegalOpen(false);
  };
  const handleOpen = (tab: 'disclaimer' | 'sources' | 'privacy' = 'disclaimer') => {
    setActiveLegalTab(tab);
    setInternalLegalOpen(true);
  };

  return (
    <>
      <footer className="w-full border-t border-slate-800/80 bg-[#090d16] py-10 px-4 sm:px-8 mt-auto text-slate-400">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* TOP SECTION: 3 MODERN CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1: CREATORE & GITHUB (PROMINENT!) */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-500/60 transition-all shadow-lg flex flex-col justify-between space-y-4 group">
              <div>
                <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300">
                    Sviluppo & Progetto
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>Realizzato da</span>
                  <span className="text-cyan-400">Luca Celebrano</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Piattaforma ideata e sviluppata per trasformare la preparazione dell'esame universitario di Malattie dell'Apparato Cardiovascolare e Respiratorio in un'esperienza interattiva, visiva e priva di noia.
                </p>
              </div>

              {/* Big GitHub Button */}
              <a
                href="https://github.com/Lukecele/cardio-thoracic-medterminal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-400/60 text-slate-200 hover:text-white transition-all shadow-md group/btn"
              >
                <div className="flex items-center space-x-2.5">
                  <GithubIcon className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-xs font-bold font-mono">Lukecele / MedTerminal</div>
                    <div className="text-[10px] text-slate-500 font-mono">github.com/Lukecele</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 group-hover/btn:bg-cyan-500/30">
                  ★ Star
                </span>
              </a>
            </div>

            {/* CARD 2: RINGRAZIAMENTO LORENZO PESSETTI */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-500/60 transition-all shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-purple-400 mb-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-300">
                    Fonti Didattiche & Teoria
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Ringraziamento a <span className="text-purple-300">Lorenzo Pessetti</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Un ringraziamento speciale e sentito a <strong>Lorenzo Pessetti</strong>, dalle cui dispense e schemi didattici derivano le solide e complete basi teoriche utilizzate per la stesura dei 16 capitoli della piattaforma.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[11px] text-purple-300/80 font-mono">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Linee Guida ESC / AHA / ACC / ERS & Note Accademiche</span>
              </div>
            </div>

            {/* CARD 3: NOTE LEGALI, PRIVACY & COOKIE */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-500/60 transition-all shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                    Legal & Privacy GDPR
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Uso Didattico & Zero Tracking
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Piattaforma universitaria open-source creata esclusivamente per la preparazione d'esame. Non raccoglie dati personali, non usa cookie di profilazione e rispetta la privacy al 100%.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleOpen('disclaimer')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition"
                >
                  Disclaimer Medico
                </button>
                <button
                  onClick={() => handleOpen('privacy')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-emerald-300 hover:text-emerald-200 transition"
                >
                  Cookie & Privacy
                </button>
              </div>
            </div>

          </div>

          {/* GOLLUM EASTER EGG FOOTER BANNER */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🧙‍♂️</span>
              <p className="text-xs text-slate-400 italic font-serif">
                « Non vede dove il cuore lo porta, quando il sole è calato e la luna è morta »
                <span className="block not-italic text-[10px] text-slate-500 font-sans mt-0.5">
                  Dedicato a chi studia il diagramma di Wiggers alle 04:12 di notte prima dell'appello.
                </span>
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
              Esame di Cardiologia 2026
            </span>
          </div>

          {/* BOTTOM COPYRIGHT BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-850/80 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30" />
              <span>MedTerminal v2.0 • Realizzato da <strong>Luca Celebrano</strong> • Fonti teoriche: <strong>Lorenzo Pessetti</strong></span>
            </div>
            <div className="flex items-center space-x-4 text-[11px] font-mono">
              <button onClick={() => handleOpen('disclaimer')} className="hover:text-cyan-400 transition">
                Disclaimer
              </button>
              <span>•</span>
              <button onClick={() => handleOpen('privacy')} className="hover:text-cyan-400 transition">
                Privacy
              </button>
              <span>•</span>
              <a
                href="https://github.com/Lukecele"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition"
              >
                GitHub Profile
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* COMPREHENSIVE LEGAL, SOURCES & PRIVACY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center space-x-2.5 text-cyan-400">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold text-sm uppercase tracking-wider font-mono text-white">
                  Informazioni Didattiche, Crediti & Privacy
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-2 gap-2">
              <button
                onClick={() => setActiveLegalTab('disclaimer')}
                className={`pb-2.5 px-3 text-xs font-mono font-semibold transition border-b-2 ${
                  activeLegalTab === 'disclaimer'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Disclaimer Didattico
              </button>
              <button
                onClick={() => setActiveLegalTab('sources')}
                className={`pb-2.5 px-3 text-xs font-mono font-semibold transition border-b-2 ${
                  activeLegalTab === 'sources'
                    ? 'border-purple-400 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Crediti & Lorenzo Pessetti
              </button>
              <button
                onClick={() => setActiveLegalTab('privacy')}
                className={`pb-2.5 px-3 text-xs font-mono font-semibold transition border-b-2 ${
                  activeLegalTab === 'privacy'
                    ? 'border-emerald-400 text-emerald-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Privacy & Cookie Policy
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-5 text-xs text-slate-300 leading-relaxed">
              
              {activeLegalTab === 'disclaimer' && (
                <div className="space-y-4">
                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-slate-100 mb-1.5 flex items-center text-sm">
                      <Heart className="w-4 h-4 mr-2 text-rose-500" />
                      Finalità Esclusivamente Didattica Universitaria
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      MedTerminal è una web application concepita e sviluppata esclusivamente a scopo di <strong>studio curriculare, ripasso e simulazione accademica per l'esame universitario di Medicina e Chirurgia</strong> (in particolare per il corso integrato di Malattie dell'Apparato Cardiovascolare e Respiratorio).
                    </p>
                    <p className="text-slate-400 leading-relaxed mt-2">
                      Nessun calcolatore clinico, tracciato ECG, algoritmo diagnostico, audio o modello 3D deve essere utilizzato per la diagnosi o gestione terapeutica di pazienti reali. Per qualsiasi decisione clinica su pazienti in carne ed ossa, fare sempre riferimento alle linee guida internazionali vigenti (ESC, ACC/AHA, ERS, ESTS, ESVS) e al giudizio insindacabile del medico specialista.
                    </p>
                  </div>

                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-slate-100 mb-1.5 flex items-center text-sm">
                      <Lock className="w-4 h-4 mr-2 text-amber-500" />
                      Limitazione di Responsabilità
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      L'autore (Luca Celebrano) declina qualsiasi responsabilità per l'utilizzo improprio delle informazioni fornite o per eventuali discrepanze rispetto a testi universitari specifici scelti dalle commissioni d'esame dei singoli atenei.
                    </p>
                  </div>
                </div>
              )}

              {activeLegalTab === 'sources' && (
                <div className="space-y-4">
                  <div className="bg-purple-950/20 p-4 rounded-xl border border-purple-500/30">
                    <h3 className="font-bold text-purple-200 mb-1.5 flex items-center text-sm">
                      <Award className="w-4 h-4 mr-2 text-purple-400" />
                      Ringraziamento Speciale alle Fonti di Lorenzo Pessetti
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      Si esprime la più profonda gratitudine a <strong>Lorenzo Pessetti</strong> per il meticoloso lavoro di sintesi, raccolta dispense e note universitarie da cui sono tratte le fonti fondamentali della sezione teorica e dei quadri clinici trattati in questo portale. Senza il suo contributo e la chiarezza dei suoi compendi, questa digitalizzazione non sarebbe stata possibile.
                    </p>
                  </div>

                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-slate-100 mb-1.5 flex items-center text-sm">
                      <Terminal className="w-4 h-4 mr-2 text-cyan-400" />
                      Sviluppo & Architettura Software
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      L'intera applicazione interattiva, la suite di simulazione quiz, il visualizzatore d'auscultazione audio a 1 tocco, i motori grafici Three.js / WebGL e il sistema di ricerca globale sono stati sviluppati e manutenuti da <strong>Luca Celebrano</strong>. Il codice sorgente è aperto e disponibile su GitHub per tutti gli studenti.
                    </p>
                  </div>
                </div>
              )}

              {activeLegalTab === 'privacy' && (
                <div className="space-y-4">
                  <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30">
                    <h3 className="font-bold text-emerald-200 mb-1.5 flex items-center text-sm">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
                      100% Client-Side • Nessun Tracciamento o Cookie di Terze Parti
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      Questo sito <strong>non installa cookie di profilazione</strong>, né traccianti pubblicitari o script di monitoraggio comportamentale (Google Analytics, Meta Pixel, ecc.).
                    </p>
                  </div>

                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-slate-100 mb-1.5 flex items-center text-sm">
                      <Scale className="w-4 h-4 mr-2 text-blue-400" />
                      Uso Esclusivo del LocalStorage
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      Tutti i tuoi dati (le risposte ai quiz completati, il punteggio, i token di Active Recall e le preferenze di visualizzazione) vengono conservati <strong>esclusivamente sul tuo dispositivo</strong> tramite il <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded font-mono">localStorage</code> del browser. Nessun dato personale viene trasmesso o salvato su server remoti.
                    </p>
                  </div>
                </div>
              )}

            </div>
            
            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                MedTerminal • Studio Universitario
              </span>
              <button
                onClick={handleClose}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition shadow-lg"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
