import React, { useState } from 'react';
import { GitBranch, ShieldAlert, Heart, Scale, X, Stethoscope, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  const [legalModalOpen, setLegalModalOpen] = useState(false);

  return (
    <>
      <footer className="w-full border-t border-slate-850 bg-slate-950/80 backdrop-blur-md py-6 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-slate-400 font-mono">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-slate-300">MedTerminal v2.0</span>
            </div>
            <span>•</span>
            <span>Compendio Curriculare Integrato (5 Discipline)</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-slate-400 font-mono">
            <a
              href="https://github.com/Lukecele/cardio-thoracic-medterminal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 hover:text-cyan-400 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub (Lukecele)</span>
            </a>
            <span>•</span>
            <button
              onClick={() => setLegalModalOpen(true)}
              className="flex items-center space-x-1.5 hover:text-cyan-400 transition-colors"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Disclaimer & GDPR</span>
            </button>
          </div>

        </div>

        <div className="max-w-4xl mx-auto mt-3 text-center text-[11px] text-slate-600 leading-relaxed font-sans">
          Progetto didattico accademico open-source per la preparazione dell'esame integrato di Cardiologia, Cardiochirurgia, Pneumologia, Chirurgia Toracica e Vascolare. Non costituisce presidio medico diagnostico o terapeutico.
        </div>
      </footer>

      {/* LEGAL & DISCLAIMER MODAL */}
      {legalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center space-x-2 text-cyan-400">
                <ShieldAlert className="w-5 h-5" />
                <h2 className="font-bold text-sm uppercase tracking-wider font-mono">
                  Informazioni Didattiche, Legali & GDPR
                </h2>
              </div>
              <button
                onClick={() => setLegalModalOpen(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-5 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-1.5 flex items-center text-sm">
                  <Heart className="w-4 h-4 mr-2 text-rose-500" />
                  Medical Disclaimer
                </h3>
                <p className="text-slate-400">
                  MedTerminal è una web application concepita e sviluppata esclusivamente a scopo di studio e simulazione accademica per studenti di medicina e chirurgia. Nessun calcolatore, tracciato ECG, algoritmo o reperto auscultatorio deve essere utilizzato per la diagnosi o gestione terapeutica di pazienti reali. Fare sempre riferimento alle linee guida internazionali vigenti (ESC, ACC/AHA, ERS, ESTS, ESVS).
                </p>
              </div>
              
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-1.5 flex items-center text-sm">
                  <Stethoscope className="w-4 h-4 mr-2 text-blue-500" />
                  Fonti dei Dati & Proprietà Intellettuale
                </h3>
                <p className="text-slate-400">
                  La teoria clinica integrale deriva dalle linee guida internazionali vigenti e dai compendi accademici universitari (ESC, ERS, ACC/AHA, SICCH, SICVE). I modelli 3D sono elaborazioni WebGL Three.js con rendering volumetrico anatomico. I tracciati audio derivano da registrazioni fonocardiografiche didattiche fisiologiche.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-1.5 flex items-center text-sm">
                  <Scale className="w-4 h-4 mr-2 text-emerald-500" />
                  Privacy & Cookie Policy (GDPR Compliance)
                </h3>
                <p className="text-slate-400">
                  L'applicazione <strong>non installa cookie di profilazione</strong> né strumenti di tracciamento commerciale. I progressi didattici, le statistiche dei quiz e i token di Active Recall sono memorizzati esclusivamente in locale nel <code className="text-cyan-400 bg-slate-900 px-1 py-0.5 rounded font-mono">localStorage</code> del browser dell'utente e non vengono condivisi con server remoti.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
              <button
                onClick={() => setLegalModalOpen(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition shadow-lg"
              >
                Ho compreso • Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
