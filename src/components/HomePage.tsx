import React from 'react';
import {
  BookOpen,
  Stethoscope,
  Activity,
  Wind,
  Droplets,
  Heart,
  Layers,
  Headphones,
  Zap,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Calculator,
  Pill,
  Award,
  CheckCircle2,
  HelpCircle,
  FileText,
  Search,
  Scale,
  Smile
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export type NavTabType =
  | 'theory'
  | 'quiz'
  | 'oral'
  | 'scanner'
  | 'ecg'
  | 'pfr'
  | 'ega'
  | 'tnm'
  | 'flowcharts'
  | 'pharma'
  | 'imaging'
  | 'calculators'
  | 'auscultation';

interface HomePageProps {
  onNavigate: (tab: NavTabType) => void;
  onOpen3D: () => void;
  onOpenSearch: () => void;
  onOpenLegalModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpen3D,
  onOpenSearch,
  onOpenLegalModal
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 py-4 sm:py-6 px-1 sm:px-2">
      
      {/* 1. HERO HEADER: INTRODUZIONE AL PORTALE D'ESAME */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-[#07090e] border border-cyan-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-mono font-medium">
            <Heart className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20 shrink-0" />
            <span>PORTALE ACCADEMICO • STUDIO ESAME INTEGRATO</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            MedTerminal <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">Cardio-Toracico</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            La piattaforma interattiva ideata per superare l'esame integrato di <strong className="text-white">Malattie dell'Apparato Cardiovascolare e Respiratorio</strong>. Niente muri di testo infiniti: solo quadri clinici ad alto rendimento, simulazioni orali, auscultazioni reali sincronizzate e modelli anatomici 3D.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => onNavigate('theory')}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm font-mono transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Inizia dai 16 Capitoli</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('oral')}
              className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs sm:text-sm font-mono font-semibold transition flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-purple-400" />
              <span>Simulatore Orale</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="px-3.5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-mono transition flex items-center justify-center gap-2"
              title="Cerca (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cerca Argomento (Ctrl+K)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. PROMINENT AUTORI & FONTI (LUCA CELEBRANO & LORENZO PESSETTI) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
              Sviluppo del Progetto & Fonti Didattiche
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Crediti Ufficiali</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* CARD 1: LUCA CELEBRANO (PROMINENT GITHUB) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-cyan-500/40 p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-5 group hover:border-cyan-400 transition-all">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  Ideatore & Sviluppatore
                </span>
                <span className="hidden sm:inline text-[11px] font-mono text-slate-500">Full-Stack Medical UI</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Realizzato da</span>
                  <span className="text-cyan-400 underline decoration-cyan-500/40 underline-offset-4">
                    Luca Celebrano
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-sans">
                  Progettato e sviluppato per superare le noiose dispense universitarie e offrire a studenti e specializzandi un ambiente clinico fluido, visivo e interattivo: dalla fonoteca con audio reali alle simulazioni orali ad alto stress.
                </p>
              </div>
            </div>

            {/* GITHUB PROMINENT ACTIONS */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2">
              <a
                href="https://github.com/Lukecele/cardio-thoracic-medterminal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-cyan-950/50 border border-slate-750 hover:border-cyan-400 text-white transition-all shadow-md group/btn gap-2"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <GithubIcon className="w-5 h-5 text-white shrink-0 group-hover/btn:scale-110 transition-transform" />
                  <div className="min-w-0 text-left">
                    <div className="text-xs font-bold font-mono text-white truncate">Lukecele / MedTerminal</div>
                    <div className="text-[10px] text-slate-400 font-mono">Codice Open Source</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                  ★ Star
                </span>
              </a>

              <a
                href="https://github.com/Lukecele"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5 text-xs font-mono shrink-0"
                title="Profilo GitHub di Luca Celebrano"
              >
                <span>Profilo GitHub (@Lukecele)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* CARD 2: LORENZO PESSETTI (TEORIA & DISPENSE) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-purple-500/30 p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-purple-500/60 transition-all">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  Fonti Teoriche & Quadri Clinici
                </span>
                <span className="hidden sm:inline text-[11px] font-mono text-purple-400/80">Dispense d'Ateneo</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Ringraziamento a</span>
                  <span className="text-purple-300">Lorenzo Pessetti</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-sans">
                  Un ringraziamento fondamentale e doveroso a <strong>Lorenzo Pessetti</strong>: dalle sue eccellenti dispense universitarie, schemi di sintesi e appunti di reparto provengono le solide basi teoriche che strutturano l'intero impianto didattico dei 16 capitoli e dei casi clinici della piattaforma.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-purple-300/80">
              <div className="flex items-center gap-1.5 min-w-0">
                <Award className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-[11px] truncate">Linee Guida ESC / AHA / ACC / ERS</span>
              </div>
              <span className="hidden sm:inline text-[10px] text-slate-500">Corso Integrato</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. GUIDA AL SITO & NAVIGAZIONE RAPIDA */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
              Mappa del Portale: Come Orientarsi per l'Esame
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Sezioni Chiave</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* TEORIA */}
          <div
            onClick={() => onNavigate('theory')}
            className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                  16 CAPITOLI
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                1. Teoria & Linee Guida Integrali
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cardiologia medica, cardiochirurgia, pneumologia, chirurgia toracica e vascolare. Con 4 punti cardine d'esame e trabocchetti docenti.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Apri la Teoria</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* SIMULATORE ORALE */}
          <div
            onClick={() => onNavigate('oral')}
            className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-bold">
                  5 STAZIONI
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                2. Simulatore d'Esame Orale
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Domande a cascata del docente su casi caldi: STEMI acuto, Shock cardiogeno, Embolia Polmonare, Stenosi Aortica e BPCO riacutizzata.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Simula l'Orale</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* QUIZ DATABASE */}
          <div
            onClick={() => onNavigate('quiz')}
            className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                  48 MCQ ESAME
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                3. Database Quesiti Scritti
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quiz d'esame con razionale clinico ragionato, Active Recall opzionale e statistiche di risposta per testare la preparazione.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Esercitati sui Quiz</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* FONOTECA AUSCULTATORIA */}
          <div
            onClick={() => onNavigate('auscultation')}
            className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-300 font-bold">
                  AUDIO REALE
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                4. Fonoteca & Auscultazioni
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ascolto reale dei focolai: S1/S2 fisiologici e sdoppiati, soffi sistolici da eiezione e rigurgito, rullio diastolico mitralico e murmuri.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono text-rose-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Ascolta i Soffi</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* MONITOR ECG */}
          <div
            onClick={() => onNavigate('ecg')}
            className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-bold">
                  12 DERIVAZIONI
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                5. Monitor ECG & Ritmi
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tracciati elettrocardiografici interattivi: STEMI, BAV di grado I/II/III, fibrillazione atriale, tachicardie ventricolari e flutter.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Interpreta ECG</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* ATLANTE 3D & STRUMENTI */}
          <div
            onClick={onOpen3D}
            className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-bold">
                  WEBGL + HD
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                6. Atlante Anatomico 3D & Tavole HD
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modelli tridimensionali del cuore, albero bronchiale e coronarie, con fallback automatico su tavole illustrate HD per mobile.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono text-sky-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Lancia Atlante 3D</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

        </div>

        {/* QUICK TOOLS STRIP */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">Tool Clinici Rapidi:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('ega')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono text-[11px] transition"
            >
              Interpretatore EGA
            </button>
            <button
              onClick={() => onNavigate('pfr')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono text-[11px] transition"
            >
              Spirometria PFR
            </button>
            <button
              onClick={() => onNavigate('tnm')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono text-[11px] transition"
            >
              Stadiazione TNM
            </button>
            <button
              onClick={() => onNavigate('pharma')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono text-[11px] transition"
            >
              Prontuario Farmaci
            </button>
            <button
              onClick={() => onNavigate('calculators')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono text-[11px] transition"
            >
              Score Clinici (CHA₂DS₂-VASc, CURB-65)
            </button>
          </div>
        </div>
      </section>

      {/* 4. ANGOLO DECOMPRESSIONE & I DUE MONITI DI GOLLUM (EASTER EGGS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
              Angolo Decompressione: I Due Moniti di Gollum per l'Esame
            </h2>
          </div>
          <span className="text-[11px] font-mono text-amber-400/80">Anti-Panico Pre-Appello</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 px-1 leading-relaxed">
          Chiunque abbia preparato questo esame conosce la fase in cui il sonno scarseggia e i diagrammi di pressione-volume iniziano a parlarti. Due citazioni d'autore per ricordarsi di respirare e non farsi prendere dal panico:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* GOLLUM CUORE: STUDIO NOTTURNO */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#090d18] border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col sm:flex-row items-center sm:items-start gap-3.5 sm:gap-4 shadow-lg text-center sm:text-left">
            <img
              src="/easter-eggs/gollum_cuore.jpg"
              alt="Gollum e il cuore anatomico"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-amber-500/30 shadow-md shrink-0"
            />
            <div className="space-y-2 flex-1 min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 inline-block">
                🌙 Pausa Notturna • Studio Folle
              </span>
              <p className="text-xs sm:text-sm font-serif italic text-amber-200 leading-snug">
                « Non vede dove il cuore lo porta, quando il sole è calato e la luna è morta »
              </p>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                La tipica reazione dello studente alle 03:45 di notte prima dell'appello. Se ti ritrovi ad accarezzare il miocardio sul tablet sussurrando <em>"il mio tesssoro"</em>... chiudi tutto, bevi un sorso d'acqua e riposati: il cervello ha bisogno di sonno per consolidare le informazioni.
              </p>
            </div>
          </div>

          {/* GOLLUM FREDDO: IL GELO DELL'ORALE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#090d18] border border-cyan-500/30 hover:border-cyan-500/60 transition-all flex flex-col sm:flex-row items-center sm:items-start gap-3.5 sm:gap-4 shadow-lg text-center sm:text-left">
            <img
              src="/easter-eggs/gollum_freddo.jpg"
              alt="Gollum congelato"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-cyan-500/30 shadow-md shrink-0"
            />
            <div className="space-y-2 flex-1 min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 inline-block">
                🧊 Il Brivido dell'Orale • Gelo alle Ossa
              </span>
              <p className="text-xs sm:text-sm font-serif italic text-cyan-200 leading-snug">
                « Fredda la mano le ossa e il cuore, freddo il corpo del viaggiatore »
              </p>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                La sensazione fisica esatta del gelo nella schiena quando ti siedi davanti alla commissione, il docente ti fissa in silenzio, fa roteare la penna e ti chiede la complicanza acuta a sorpresa. Niente panico: respira e ragiona a step clinici!
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. AVVERTENZE LEGALI & DISCLAIMER RAPIDO */}
      <section className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <Scale className="w-5 h-5 text-slate-400 shrink-0" />
          <p>
            <strong>Finalità Esclusivamente Didattica:</strong> Piattaforma universitaria open-source concepita per lo studio curriculare e la simulazione d'esame. Non costituisce presidio medico diagnostico.
          </p>
        </div>
        <button
          onClick={onOpenLegalModal}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs whitespace-nowrap transition"
        >
          Leggi Note Legali & Privacy
        </button>
      </section>

    </div>
  );
};

export default HomePage;
