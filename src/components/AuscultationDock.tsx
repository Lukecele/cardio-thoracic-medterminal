import React, { useState, useRef, useEffect } from 'react';
import { Headphones, Play, Pause, RotateCcw, Volume2, Info, MapPin, Activity } from 'lucide-react';

export interface AuscultationTrack {
  id: string;
  name: string;
  category: 'cardiaca' | 'polmonare';
  file: string;
  focusArea: string;
  stethoscopeHead: string;
  maneuver?: string;
  timing: string;
  clinicalSignificance: string;
  description: string;
  differential: string[];
}

export const AUDIO_TRACKS: AuscultationTrack[] = [
  {
    id: 's1-s2',
    name: 'Toni Cardiaci Fisiologici (S1 - S2)',
    category: 'cardiaca',
    file: '/audio/s1-s2.ogg',
    focusArea: 'Focolaio Mitralico (V spazio emiclaveare sx) & Erb (III spazio sx)',
    stethoscopeHead: 'Membrana (Alte frequenze)',
    timing: 'S1 (inizio sistole) - S2 (inizio diastole)',
    clinicalSignificance: 'Ritmo sinusale normofrequente. S1 generato dalla chiusura delle valvole atrioventricolari (mitrale precede tricuspide). S2 generato dalla chiusura delle valvole semilunari (componente aortica A2 precede la polmonare P2 con sdoppiamento fisiologico in inspirazione).',
    description: 'Toni cardiaci netti, ritmici, assenza di soffi da eiezione o rigurgito. Il tono S1 è più sordo e prolungato all\'apice; S2 è più secco e acuto alla base.',
    differential: ['Ritmo sinusale normale', 'Assenza di vizi valvolari organici']
  },
  {
    id: 'systolic-murmur',
    name: 'Stenosi Aortica (Soffio Meso-sistolico ad Eiezione)',
    category: 'cardiaca',
    file: '/audio/systolic-murmur.ogg',
    focusArea: 'Focolaio Aortico (II spazio intercostale marginosternale dx) con irradiazione carotidea',
    stethoscopeHead: 'Membrana (Alte frequenze)',
    timing: 'Meso-sistolico in crescendo-decrescendo (a diamante) tra S1 e S2',
    clinicalSignificance: 'Ostacolo anatomico all\'eiezione ventricolare sinistra attraverso l\'orifizio aortico calcifico o bicuspide. Intensità Levine 3/6-4/6 con polso parvus et tardus.',
    description: 'Timbro aspro, raspante, a diamante. Si irradia bilateralmente lungo le arterie carotidi al collo. Tono S2 spesso attenuato o sdoppiato in modo paradosso (A2 ritardata).',
    differential: ['Stenosi aortica degenerativa senile', 'Bicuspidia aortica congenita', 'Cardiopatia ipertrofica ostruttiva (HOCM)']
  },
  {
    id: 'vsd-pansystolic',
    name: 'Insufficienza Mitralica / VSD (Soffio Olo-sistolico)',
    category: 'cardiaca',
    file: '/audio/vsd-pansystolic.wav',
    focusArea: 'Itto della punta (V spazio emiclaveare) con irradiazione al cavo ascellare',
    stethoscopeHead: 'Membrana (Alte frequenze)',
    timing: 'Olosistolico continuo: copre interamente l\'intervallo tra S1 e S2',
    clinicalSignificance: 'Rigurgito patologico ad alta velocità dal ventricolo sinistro verso l\'atrio sinistro a bassa pressione durante l\'intera contrazione sistolica. Tipico di prolasso lembi, dilatazione anulus, o rottura muscolo papillare post-STEMI.',
    description: 'Soffio a getto di vapore, intensità uniforme dall\'inizio alla fine della sistole. Non si modifica con la respirazione (differenza rispetto all\'insufficienza tricuspidale che aumenta col segno di Rivero-Carvallo).',
    differential: ['Insufficienza mitralica severa', 'Difetto del setto interventricolare (CIV)', 'Insufficienza tricuspidale']
  },
  {
    id: 'afib',
    name: 'Fibrillazione Atriale (Aritmia Totale & Deficit di Polso)',
    category: 'cardiaca',
    file: '/audio/afib.ogg',
    focusArea: 'Ascoltazione sistematica all\'apice e focolai della base con palpazione contemporanea del polso radiale',
    stethoscopeHead: 'Membrana & Campana',
    timing: 'Irregolarmente irregolare (assenza di scansione ritmica costante)',
    clinicalSignificance: 'Attività atriale disorganizzata (350-600 bpm) con conduzione nodale AV caotica. Variabilità marcata dell\'intervallo diastolico R-R e conseguente variabilità del volume di eiezione sistolico (ampiezza di S1 fluttuante).',
    description: 'Cadenza caotica, toni forti alternati a toni deboli. Presenza di deficit di polso (battiti uditi al torace che non generano un\'onda pulsatile periferica percepibile al polso radiale).',
    differential: ['Fibrillazione Atriale', 'Flutter Atriale con conduzione variabile', 'Extrasistolia ventricolare polimorfa frequente']
  },
  {
    id: 'tachycardia',
    name: 'Tachicardia Parossistica (FC > 150 bpm)',
    category: 'cardiaca',
    file: '/audio/tachycardia.ogg',
    focusArea: 'Precordio / Apice cardiaco',
    stethoscopeHead: 'Membrana (Alte frequenze)',
    timing: 'Ritmo tachicardico regolare ad elevatissima cadenza, diastole quasi azzerata',
    clinicalSignificance: 'Accorciamento critico del tempo di riempimento diastolico ventricolare con riduzione della portata cardiaca e aumentato consumo miocardico di ossigeno.',
    description: 'Ritmo embrionale (tic-tac continuo in cui S1 e S2 assumono la medesima durata e intensità fonica).',
    differential: ['Tachicardia Sinusale severa', 'Tachicardia Parossistica Sopraventricolare (AVNRT/AVRT)', 'Tachicardia Ventricolare monomorfa']
  },
  {
    id: 'crackles',
    name: 'Rantoli Crepitanti Tele-inspiratori (Crackles)',
    category: 'polmonare',
    file: '/audio/crackles.ogg',
    focusArea: 'Campi polmonari postero-basali bilaterali',
    stethoscopeHead: 'Membrana adesa alla cute',
    timing: 'Tele-inspiratori (seconda metà dell\'inspirazione profonda)',
    clinicalSignificance: 'Suono discontinua a scoppiettio generato dall\'apertura improvvisa a scatto delle vie aeree distali e degli alveoli collassati da trasudato liquido o fibrosi interstiziale (re-opening acustico).',
    description: 'Rumore secco, simile allo sfregamento di ciocche di capelli tra le dita o al suono del velcro che si apre. Non si modificano con i colpi di tosse (a differenza dei rantoli grossolani bronchiali).',
    differential: ['Edema Polmonare Acuto cardiogeno', 'Fibrosi Polmonare Idiopatica (Velcro crackles)', 'Polmonite lobare consolidativa']
  },
  {
    id: 'wheezing',
    name: 'Sibili Espiratori Musicali (Wheezing)',
    category: 'polmonare',
    file: '/audio/wheezing.ogg',
    focusArea: 'Ampi campi polmonari anteriori e posteriori, cavi ascellari',
    stethoscopeHead: 'Membrana',
    timing: 'Prevalentemente espiratori, polifonici e prolungati',
    clinicalSignificance: 'Flusso aereo ad alta turbolenza attraverso bronchi e bronchioli diffusamente stenotici per broncospasmo, edema mucoso ed ipersecrezione densa. Tempo espiratorio marcatamente prolungato.',
    description: 'Rumori continui di tipo musicale, fischi acuti e gemiti che possono diventare udibili anche a distanza dall\'orecchio nudo senza fonendoscopio.',
    differential: ['Crisi d\'Asma Bronchiale acuta', 'Riacutizzazione di BPCO', 'Scompenso cardiaco sinistro acuto ("Asma cardiale")']
  }
];

interface AuscultationDockProps {
  initialTrackId?: string | null;
}

export const AuscultationDock: React.FC<AuscultationDockProps> = ({ initialTrackId }) => {
  const [selectedTrack, setSelectedTrack] = useState<AuscultationTrack>(() => {
    if (initialTrackId) {
      const match = AUDIO_TRACKS.find(t => t.id === initialTrackId);
      if (match) return match;
    }
    return AUDIO_TRACKS[0];
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'cardiaca' | 'polmonare'>('all');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (initialTrackId) {
      const match = AUDIO_TRACKS.find(t => t.id === initialTrackId);
      if (match) setSelectedTrack(match);
    }
  }, [initialTrackId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [selectedTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback error:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const filteredTracks = AUDIO_TRACKS.filter(t => filterType === 'all' || t.category === filterType);

  const formatSec = (s: number) => {
    if (isNaN(s)) return '0:00';
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full animate-in fade-in duration-300">
      
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={selectedTrack.file}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Header bar */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Libreria Auscultatoria Ufficiale
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AUDIO REALE STEREO
              </span>
            </h2>
            <p className="text-xs text-slate-400">Reperti sonori fisiopatologici ad alta fedeltà con localizzazione anatomica</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filterType === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tutti ({AUDIO_TRACKS.length})
          </button>
          <button
            onClick={() => setFilterType('cardiaca')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filterType === 'cardiaca' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cuore
          </button>
          <button
            onClick={() => setFilterType('polmonare')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filterType === 'polmonare' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Polmoni
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Track Selection Column */}
        <div className="lg:col-span-5 border-r border-slate-800 flex flex-col bg-slate-950/40 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {filteredTracks.map(track => {
            const isCurrent = track.id === selectedTrack.id;
            return (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isCurrent
                    ? 'bg-rose-950/30 border-rose-500/40 shadow-lg text-slate-100 ring-1 ring-rose-500/20'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCurrent && isPlaying ? <Volume2 className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm truncate text-slate-100">{track.name}</span>
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      track.category === 'cardiaca'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                    }`}>
                      {track.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{track.timing}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-mono">📍 {track.focusArea}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Audio Console & Clinical Analysis Column */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900/60 p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* Active Track Banner */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-[11px] font-mono tracking-wider uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {selectedTrack.category.toUpperCase()} • REPERTO ATTIVO
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5">{selectedTrack.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedTrack.timing}</p>
              </div>

              {/* Play / Pause Main Button */}
              <button
                onClick={togglePlay}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold text-sm shadow-xl transition transform active:scale-95 shrink-0 ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>In Riproduzione...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                    <span>Ascolta Reperto</span>
                  </>
                )}
              </button>
            </div>

            {/* Audio Waveform / Visualizer Simulation */}
            <div className="h-14 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center px-4 gap-1.5 overflow-hidden">
              {Array.from({ length: 48 }).map((_, i) => {
                const height = isPlaying
                  ? Math.max(15, Math.sin(i * 0.4 + currentTime * 8) * 80 + 30)
                  : 12;
                return (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className={`flex-1 rounded-full transition-all duration-75 ${
                      isPlaying
                        ? i % 4 === 0 ? 'bg-rose-400' : 'bg-rose-500/70'
                        : 'bg-slate-700'
                    }`}
                  />
                );
              })}
            </div>

            {/* Scrubber & Timestamps */}
            <div className="mt-4 flex items-center space-x-4">
              <span className="text-xs font-mono text-slate-400 w-10 text-right">{formatSec(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 1}
                step="0.05"
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-400 w-10">{formatSec(duration)}</span>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    setCurrentTime(0);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg"
                title="Riavvia"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Focal Point & Stethoscope Recommendation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-rose-400 mb-2">
                <MapPin className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Focolaio di Massima Udibilità</h4>
              </div>
              <p className="text-sm text-slate-200 font-medium">{selectedTrack.focusArea}</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-sky-400 mb-2">
                <Activity className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Testina Fonendoscopio</h4>
              </div>
              <p className="text-sm text-slate-200 font-medium">{selectedTrack.stethoscopeHead}</p>
            </div>
          </div>

          {/* Clinical Significance & Semiotics */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Info className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Correlazione Fisiopatologica</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{selectedTrack.clinicalSignificance}</p>
            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
              {selectedTrack.description}
            </p>
          </div>

          {/* Differential Diagnosis Tags */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Diagnosi Differenziale e Condizioni Associate
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedTrack.differential.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AuscultationDock;
