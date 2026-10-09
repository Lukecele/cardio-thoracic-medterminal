import React, { useState } from 'react';
import { GitBranch, ShieldAlert, Heart, Scale } from 'lucide-react';

const Footer: React.FC = () => {
  const [legalModalOpen, setLegalModalOpen] = useState(false);

  return (
    <>
      <footer className="mt-12 py-6 border-t border-slate-200 text-center flex flex-col items-center space-y-4">
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-slate-500">
          <span>&copy; {new Date().getFullYear()} MedTerminal</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <a
            href="https://github.com/Lukecele/cardio-thoracic-medterminal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-slate-900 transition-colors"
          >
            <GitBranch className="w-4 h-4" />
            <span>Open Source (Lukecele)</span>
          </a>
          <span className="hidden sm:inline text-slate-300">|</span>
          <button
            onClick={() => setLegalModalOpen(true)}
            className="flex items-center space-x-1 hover:text-slate-900 transition-colors"
          >
            <Scale className="w-4 h-4" />
            <span>Privacy & Legale</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl px-4 text-center">
          Progetto open-source a scopo puramente didattico, basato sulle dispense "2FAST" di Lorenzo Pessetti.
          Non sostituisce in alcun modo il parere medico professionale.
        </p>
      </footer>

      {legalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-blue-600">
                <ShieldAlert className="w-5 h-5" />
                <h2 className="font-bold">Informazioni Legali & GDPR</h2>
              </div>
              <button
                onClick={() => setLegalModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-semibold transition"
              >
                Chiudi
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-5 text-sm text-slate-600 leading-relaxed">
              <div>
                <h3 className="font-bold text-slate-900 mb-1 flex items-center"><Heart className="w-4 h-4 mr-1.5 text-rose-500" /> Medical Disclaimer</h3>
                <p>MedTerminal è un aggregatore didattico creato esclusivamente per studenti di medicina. Nessuna informazione presente su questo sito deve essere utilizzata per diagnosi o trattamenti reali su pazienti. Le decisioni cliniche devono basarsi esclusivamente su linee guida ufficiali (ESC, ACC/AHA, ERS) e sul giudizio medico.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Copyright & Open Source</h3>
                <p>Il codice sorgente è rilasciato sotto licenza MIT. I contenuti teorici sono un'aggregazione delle dispense "2FAST" a cura di Lorenzo Pessetti. I modelli 3D e i reperti audio sono embed tramite iframe di terze parti (es. Sketchfab, YouTube) appartenenti ai legittimi proprietari.</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-1">GDPR & Cookie Policy (Ottobre 2026)</h3>
                <p>Questo sito web <strong>non utilizza cookie di profilazione</strong> o tracciamento a fini di marketing. Vengono impiegati esclusivamente cookie tecnici di prima parte (es. LocalStorage) necessari al salvataggio locale dei progressi dei quiz (Active Recall) sul tuo dispositivo. Nessun dato personale o clinico viene trasmesso a server esterni o database proprietari.</p>
                <p className="mt-2">Essendo il sito ospitato su Vercel, potresti essere soggetto ai log di diagnostica standard di Vercel Analytics in forma anonimizzata, nel pieno rispetto del GDPR.</p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => setLegalModalOpen(false)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-sm"
              >
                Ho compreso
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
