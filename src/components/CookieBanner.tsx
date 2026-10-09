import React, { useState, useEffect } from 'react';
import { Cookie, X, ShieldCheck } from 'lucide-react';

interface CookieBannerProps {
  onOpenLegalModal: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenLegalModal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('medterminal_cookie_consent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      // LocalStorage might be restricted
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('medterminal_cookie_consent', 'accepted');
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-slate-200 ring-1 ring-white/10">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                <span>Informativa Cookie & Privacy</span>
              </h4>
              <button
                onClick={handleAccept}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                title="Chiudi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Questo portale universitario <strong>non usa cookie di profilazione o tracciamento pubblicitario</strong>. Memorizziamo solo nel tuo browser (<code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded font-mono">localStorage</code>) i progressi di studio, le risposte ai quiz e le tue impostazioni per l'esame.
            </p>
            <div className="flex items-center gap-2.5 mt-3 pt-2 border-t border-slate-800">
              <button
                onClick={handleAccept}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold font-mono transition shadow-sm"
              >
                Accetta & Continua
              </button>
              <button
                onClick={onOpenLegalModal}
                className="text-[11px] text-slate-400 hover:text-cyan-300 underline font-mono transition"
              >
                Leggi Note Legali
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
