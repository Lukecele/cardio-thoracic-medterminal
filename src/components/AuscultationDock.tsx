import React, { useState, useRef, useEffect } from 'react';
import {
  Headphones, Play, Pause, RotateCcw, Volume2, VolumeX,
  Info, MapPin, Activity, Repeat, Zap, Sliders, Gauge, Sparkles
} from 'lucide-react';

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

export type AcousticFilter = 'flat' | 'diaphragm' | 'bell';

export const AUDIO_TRACKS: AuscultationTrack[] = [
  {
    id: 's1-s2',
    name: 'Toni Fisiologici Normali (S1 - S2)',
    category: 'cardiaca',
    file: '/audio/normal.mp3',
    focusArea: 'Focolaio Mitralico (V spazio emiclaveare sx) & Erb (III spazio sx)',
    stethoscopeHead: 'Membrana (Alte frequenze)',
    timing: 'S1 (chiusura mitro-tricuspidale) - S2 (chiusura aorto-polmonare)',
    clinicalSignificance: 'Ritmo sinusale normofrequente. S1 generato dalla chiusura delle valvole atrioventricolari. S2 generato dalla chiusura delle valvole semilunari con sdoppiamento fisiologico in inspirazione.',
    description: 'Toni cardiaci netti, ritmici, assenza di soffi da eiezione o rigurgito. Il tono S1 è più cupo e prolungato all\'apice; S2 è più secco e acuto alla base.',
    differential: ['Ritmo sinusale normale', 'Assenza di vizi valvolari organici']
  },
  {
    id: 'aortic-stenosis',
    name: 'Stenosi Aortica (Soffio Meso-sistolico ad Eiezione)',
    category: 'cardiaca',
    file: '/audio/lateas.mp3',
    focusArea: 'Focolaio Aortico (II spazio intercostale marginosternale dx) con irradiazione carotidea',
    stethoscopeHead: 'Membrana (Alte frequenze)',
    timing: 'Meso-sistolico in crescendo-decrescendo (a diamante) tra S1 e S2',
    clinicalSignificance: 'Ostacolo anatomico all\'efflusso ventricolare sinistro attraverso l\'orifizio aortico calcifico. Picco tardivo correlato a stenosi severa con polso parvus et tardus.',
    description: 'Timbro aspro, raspante, a diamante. Si irradia tipicamente bilateralmente lungo le arterie carotidi al collo. Tono S2 ridotto o sdoppiato in modo paradosso.',
    differential: ['Stenosi aortica calcifica senile', 'Bicuspidia aortica congenita', 'Cardiopatia ipertrofica ostruttiva (HOCM)']
  },
  {
    id: 'mitral-regurgitation',
    name: 'Insufficienza Mitralica (Soffio Olo-sistolico)',
    category: 'cardiaca',
    file: '/audio/mr.mp3',
    focusArea: 'Itto della punta (V spazio emiclaveare sx) con irradiazione al cavo ascellare',
    stethoscopeHead: 'Membrana (Alte frequenze)',
    timing: 'Olosistolico continuo: copre interamente l\'intervallo tra S1 e S2',
    clinicalSignificance: 'Rigurgito ematico dal ventricolo sinistro all\'atrio sinistro durante l\'intera sistole. Causato da prolasso dei lembi, rottura di corde o dilatazione dell\'anulus.',
    description: 'Soffio soffiante a getto di vapore, intensità uniforme che non si modifica significativamente con gli atti del respiro (segno di Rivero-Carvallo negativo).',
    differential: ['Insufficienza mitralica severa', 'Difetto del setto interventricolare (CIV)', 'Insufficienza tricuspidale']
  },
  {
    id: 'mitral-stenosis',
    name: 'Stenosi Mitralica (Schiocco & Rullio Diastolico)',
    category: 'cardiaca',
    file: '/audio/ms.mp3',
    focusArea: 'Apice cardiaco in decubito laterale sinistro di Pachon',
    stethoscopeHead: 'Campana (Basse frequenze)',
    timing: 'Proto-diastolico (schiocco d\'apertura) seguito da rullio mesodiastolico e rinforzo presistolico',
    clinicalSignificance: 'Ostacolo al riempimento ventricolare sinistro causato da fusione commissurale reumatica. Intervallo S2-OS inversamente proporzionale alla severità della stenosi.',
    description: 'S1 accentuato, schiocco d\'apertura (opening snap) ad alta frequenza e tipico rullio cupo a basse frequenze.',
    differential: ['Stenosi mitralica reumatica', 'Mixoma atriale sinistro', 'Flusso iperdinamico funzionale']
  },
  {
    id: 'aortic-regurgitation',
    name: 'Insufficienza Aortica (Soffio Diastolico in Decrescendo)',
    category: 'cardiaca',
    file: '/audio/ar.mp3',
    focusArea: 'Punto di Erb (III spazio intercostale parasternale sx) con paziente seduto proteso in avanti',
    stethoscopeHead: 'Membrana adesa',
    timing: 'Proto-diastolico immediato dopo S2 in decrescendo continuo',
    clinicalSignificance: 'Rigurgito di sangue dall\'aorta al ventricolo sinistro durante la diastole per incontinenza delle semilunari aortiche. Associato a polso scoccante di Corrigan e ampia pressione differenziale.',
    description: 'Soffio dolce, aspirativo, in decrescendo immediato dopo la chiusura valvolare aortica.',
    differential: ['Insufficienza aortica acuta o cronica', 'Insufficienza valvolare polmonare (soffio di Graham Steell)']
  },
  {
    id: 's3',
    name: 'Terzo Tono S3 (Galoppo Protodiastolico)',
    category: 'cardiaca',
    file: '/audio/s31.mp3',
    focusArea: 'Apice cardiaco / Itto della punta in decubito laterale sinistro',
    stethoscopeHead: 'Campana delicatamente appoggiata',
    timing: 'Protodiastolico: 120-180 ms dopo S2 durante la fase di riempimento rapido ventricolare',
    clinicalSignificance: 'Segno cardinale di sovraccarico di volume o disfunzione sistolica ventricolare sinistra nello scompenso cardiaco a ridotta frazione di eiezione (HFrEF).',
    description: 'Tono cupo a bassissima frequenza generato dalla brusca decelerazione della colonna ematica contro pareti ventricolari dilatate e non complianti. Ritmo a tre tempi (Kentucky).',
    differential: ['Scompenso cardiaco congestizio HFrEF', 'Galoppo fisiologico in bambini/giovani atleti', 'Insufficienza mitralica severa acuta']
  },
  {
    id: 's4',
    name: 'Quarto Tono S4 (Galoppo Presistolico)',
    category: 'cardiaca',
    file: '/audio/s41.mp3',
    focusArea: 'Focolaio mitralico o parasternale sinistro inferiore',
    stethoscopeHead: 'Campana (Basse frequenze)',
    timing: 'Telediastolico / presistolico: immediatamente prima di S1, coincidente con la sistole atriale',
    clinicalSignificance: 'Indice di ridotta distensibilità (compliance) della parete ventricolare per ipertrofia concentrica o ischemia acuta. Scomparsa in corso di fibrillazione atriale.',
    description: 'Tono presistolico a bassa tonalità generato dall\'eiezione atriale forzata contro un ventricolo rigido (Tennessee).',
    differential: ['Ipertrofia ventricolare da ipertensione arteriosa cronica', 'Cardiomiopatia ipertrofica', 'Ischemia miocardica acuta']
  },
  {
    id: 'pericardial-rub',
    name: 'Sfregamento Pericardico / Pleurico',
    category: 'cardiaca',
    file: '/audio/rub.mp3',
    focusArea: 'Lungo il margine parasternale sinistro (III-IV spazio), a paziente seduto proteso in avanti',
    stethoscopeHead: 'Membrana premuta con decisione',
    timing: 'Trifasico (sistole ventricolare, diastole ventricolare, sistole atriale)',
    clinicalSignificance: 'Segno patognomonico di pericardite acuta essudativo-fibrinosa o pleurite secca. Scompare se il versamento diventa massivo separando i foglietti sierosi.',
    description: 'Rumore superficiale aspro, simile al cuoio nuovo spiegazzato o al camminare sulla neve fresca ghiacciata.',
    differential: ['Pericardite acuta idiopatica o virale', 'Sindrome di Dressler post-infartuale', 'Sfregamento pleurico polmonare']
  },
  {
    id: 'crackles',
    name: 'Rantoli Crepitanti Tele-inspiratori (Crackles / Velcro)',
    category: 'polmonare',
    file: '/audio/crackles.mp3',
    focusArea: 'Campi polmonari postero-basali bilaterali',
    stethoscopeHead: 'Membrana adesa alla cute',
    timing: 'Tele-inspiratori (seconda metà dell\'inspirazione profonda)',
    clinicalSignificance: 'Disostruzione a scatto delle vie aeree distali e degli alveoli collassati per presenza di liquido trasudatizio (edema polmonare) o ispessimento fibroso interstiziale.',
    description: 'Rumore secco a crepitio, simile allo strofinio di ciocche di capelli tra le dita o allo strappo del velcro. Non modificato dalla tosse.',
    differential: ['Edema Polmonare Acuto cardiogeno', 'Fibrosi Polmonare Idiopatica (IPF pattern UIP)', 'Polmonite lobare consolidativa']
  },
  {
    id: 'wheezing',
    name: 'Sibili & Fischi Espiratori (Wheezing)',
    category: 'polmonare',
    file: '/audio/wheeze.mp3',
    focusArea: 'Ampi campi polmonari anteriori e posteriori, cavi ascellari',
    stethoscopeHead: 'Membrana',
    timing: 'Prevalentemente espiratori, polifonici e prolungati',
    clinicalSignificance: 'Flusso aereo ad alta turbolenza attraverso bronchi e bronchioli diffusamente ristretti per broncospasmo, edema mucoso ed ipersecrezione densa.',
    description: 'Rumori continui di tipo musicale, fischi acuti e gemiti associati a prolungamento marcato della fase espiratoria.',
    differential: ['Crisi d\'Asma Bronchiale acuta', 'Riacutizzazione di BPCO', 'Edema polmonare con asma cardiale']
  },
  {
    id: 'bronchial-breath',
    name: 'Soffio Tubarico / Bronchiale Patologico',
    category: 'polmonare',
    file: '/audio/b_breath.mp3',
    focusArea: 'Zona di addensamento polmonare (frequente al lobo medio o base destra)',
    stethoscopeHead: 'Membrana',
    timing: 'Inspiratorio ed espiratorio, con pausa tra le due fasi',
    clinicalSignificance: 'Trasmissione diretta dei suoni tracheali attraverso un parenchima polmonare reso privo d\'aria e solidificato da essudato infiammatorio o atelettasia compressiva con bronco pervio.',
    description: 'Suono aspro, tubare, a canna d\'organo, ad alta frequenza, udibile in periferia dove fisiologicamente si dovrebbe udire solo il murmur vescicolare.',
    differential: ['Polmonite lobare consolidativa franca', 'Addensamento neoplastico solido pervio', 'Sindrome consolidativa polmonare']
  }
];

interface AuscultationDockProps {
  initialTrackId?: string | null;
}

export const AuscultationDock: React.FC<AuscultationDockProps> = ({ initialTrackId }) => {
  const [selectedTrack, setSelectedTrack] = useState<AuscultationTrack>(() => {
    if (initialTrackId) {
      const match = AUDIO_TRACKS.find(t => 
        t.id === initialTrackId || 
        ((initialTrackId === 'pleural-rub' || initialTrackId === 'rub') && t.id === 'pericardial-rub')
      );
      if (match) return match;
    }
    return AUDIO_TRACKS[0];
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'cardiaca' | 'polmonare'>('all');
  
  // Advanced Audio Controls State
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isBoosted, setIsBoosted] = useState<boolean>(false); // +6dB StethoBoost
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 1.0x vs 0.75x Didattico
  const [acousticFilter, setAcousticFilter] = useState<AcousticFilter>('flat'); // Standard, Membrana, Campana
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize Web Audio API nodes lazily on first user interaction
  const initAudioGraph = () => {
    if (!audioRef.current) return;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      try {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        if (!sourceNodeRef.current) {
          const source = ctx.createMediaElementSource(audioRef.current);
          sourceNodeRef.current = source;

          const filter = ctx.createBiquadFilter();
          filter.type = 'allpass';
          filterNodeRef.current = filter;

          const gain = ctx.createGain();
          const effectiveGain = (isMuted ? 0 : volume) * (isBoosted ? 2.0 : 1.0);
          gain.gain.setValueAtTime(effectiveGain, ctx.currentTime);
          gainNodeRef.current = gain;

          source.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
        }
      } catch (err) {
        console.warn("Web Audio API node routing fallback:", err);
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Sync acoustic filter node
  useEffect(() => {
    if (!filterNodeRef.current || !audioCtxRef.current) return;
    const filter = filterNodeRef.current;
    const now = audioCtxRef.current.currentTime;

    if (acousticFilter === 'flat') {
      filter.type = 'allpass';
    } else if (acousticFilter === 'diaphragm') {
      // High-pass filter at 180Hz isolates murmurs, clicks, and rubs by eliminating low rumble
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(180, now);
      filter.Q.setValueAtTime(0.7, now);
    } else if (acousticFilter === 'bell') {
      // Low-pass filter at 220Hz isolates S3, S4 gallops, and mitral stenosis rumble
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);
      filter.Q.setValueAtTime(0.8, now);
    }
  }, [acousticFilter]);

  // Sync Gain node & HTML5 volume
  useEffect(() => {
    const effectiveGain = (isMuted ? 0 : volume) * (isBoosted ? 2.0 : 1.0);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(effectiveGain, audioCtxRef.current.currentTime);
    } else if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : Math.min(1.0, volume);
    }
  }, [volume, isMuted, isBoosted]);

  // Sync Playback Speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (initialTrackId) {
      const match = AUDIO_TRACKS.find(t => 
        t.id === initialTrackId || 
        ((initialTrackId === 'pleural-rub' || initialTrackId === 'rub') && t.id === 'pericardial-rub')
      );
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
    initAudioGraph();
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
        loop={isLooping}
        preload="auto"
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
                REMASTER HD + GAIN BOOST
              </span>
            </h2>
            <p className="text-xs text-slate-400">Reperti sonori fisiopatologici con simulazione fonendoscopica (Membrana / Campana)</p>
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
                    <span className="font-semibold text-sm text-slate-100">{track.name}</span>
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded shrink-0 ${
                      track.category === 'cardiaca'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                    }`}>
                      {track.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{track.timing}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">📍 {track.focusArea}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Audio Console & Clinical Analysis Column */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900/60 p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* Active Track Banner & Master Controls */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {selectedTrack.category.toUpperCase()} • REPERTO ATTIVO
                  </span>
                  {isPlaying && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mt-1.5">{selectedTrack.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedTrack.timing}</p>
              </div>

              {/* Play / Pause Main Button */}
              <button
                onClick={togglePlay}
                className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-sm shadow-xl transition transform active:scale-95 shrink-0 ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                    : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-rose-500/20'
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
            <div className="flex items-center space-x-4">
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
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition"
                title="Riavvia dall'inizio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Master Acoustic Controls Toolbar */}
            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Left Column: Volume Slider & StethoBoost */}
              <div className="flex flex-col gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-slate-400 hover:text-white transition"
                      title={isMuted ? "Riattiva Audio" : "Disattiva Audio"}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span>Volume: {isMuted ? 'Muto' : `${Math.round(volume * 100)}%`}</span>
                  </div>
                  
                  {/* StethoBoost Toggle */}
                  <button
                    onClick={() => {
                      initAudioGraph();
                      setIsBoosted(!isBoosted);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide transition ${
                      isBoosted
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                    }`}
                    title="Amplificazione digitale +6 dB per altoparlanti a bassa potenza"
                  >
                    <Zap className={`w-3.5 h-3.5 ${isBoosted ? 'text-amber-400 fill-amber-400 animate-pulse' : ''}`} />
                    <span>StethoBoost {isBoosted ? '+6dB ON' : '+6dB'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="flex-1 accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Right Column: Loop Continuo & Velocità Didattica */}
              <div className="flex flex-col gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Repeat className="w-4 h-4 text-slate-400" />
                    <span>Modalità Riproduzione</span>
                  </div>

                  {/* Loop Toggle */}
                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition ${
                      isLooping
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                    title="Riproduzione continua a ciclo infinito come un vero fonendoscopio"
                  >
                    <Repeat className="w-3 h-3" />
                    <span>{isLooping ? 'Loop Continuo' : 'Singolo'}</span>
                  </button>
                </div>

                {/* Speed Selector */}
                <div className="flex items-center gap-1 pt-0.5">
                  <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
                  <span className="text-[11px] text-slate-400 mr-2">Velocità:</span>
                  <button
                    onClick={() => setPlaybackSpeed(1.0)}
                    className={`flex-1 py-1 text-[11px] font-medium rounded-md transition ${
                      playbackSpeed === 1.0
                        ? 'bg-rose-500 text-white font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    1.0x Normale
                  </button>
                  <button
                    onClick={() => setPlaybackSpeed(0.75)}
                    className={`flex-1 py-1 text-[11px] font-medium rounded-md transition ${
                      playbackSpeed === 0.75
                        ? 'bg-rose-500 text-white font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                    title="Rallentatore didattico per isolare frazioni di secondo tra S1, soffi e schiocchi"
                  >
                    0.75x Didattico
                  </button>
                </div>
              </div>

            </div>

            {/* Acoustic Filters (Filtro Fonendoscopio Littmann) */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Filtro Acustico Fonendoscopio
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {acousticFilter === 'flat' && 'Spettro lineare (20-20.000 Hz)'}
                  {acousticFilter === 'diaphragm' && 'Passa-Alto > 180 Hz (Isola Soffi)'}
                  {acousticFilter === 'bell' && 'Passa-Basso < 220 Hz (Isola S3, S4, Rullio)'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    initAudioGraph();
                    setAcousticFilter('flat');
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition text-center ${
                    acousticFilter === 'flat'
                      ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold">Standard</div>
                  <div className="text-[10px] opacity-75 mt-0.5">Lineare</div>
                </button>

                <button
                  onClick={() => {
                    initAudioGraph();
                    setAcousticFilter('diaphragm');
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition text-center ${
                    acousticFilter === 'diaphragm'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/10'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                  title="Attenua il rimbombo sub-bass e mette in primo piano i soffi ad alta frequenza"
                >
                  <div className="font-bold">🔘 Membrana</div>
                  <div className="text-[10px] opacity-75 mt-0.5">Soffi & Sfregamenti</div>
                </button>

                <button
                  onClick={() => {
                    initAudioGraph();
                    setAcousticFilter('bell');
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition text-center ${
                    acousticFilter === 'bell'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm shadow-sky-500/10'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                  title="Esclude i fruscii acuti per far emergere i suoni cupi a bassa frequenza"
                >
                  <div className="font-bold">🔔 Campana</div>
                  <div className="text-[10px] opacity-75 mt-0.5">Galoppi S3/S4 & Rullio</div>
                </button>
              </div>
            </div>

            {/* Clinical Listening Advice Banner */}
            <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-slate-300">
                <span className="font-semibold text-rose-300">Consiglio Clinico per l'Ascolto: </span>
                I soffi valvolari risiedono nella banda 150-600 Hz. Se utilizzi altoparlanti integrati del laptop o telefono, attiva <strong className="text-amber-300">StethoBoost (+6dB)</strong> e seleziona il filtro <strong className="text-rose-300">Membrana</strong> per esaltare le microturbolenze di stenosi e rigurgiti.
              </div>
            </div>

          </div>

          {/* Phonocardiogram / Cardiac & Pulmonary Cycle Visualizer */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-rose-400">
                <Activity className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {selectedTrack.category === 'cardiaca' ? 'Fasi del Ciclo Cardiaco & Timing Acustico' : 'Ciclo Ventilatorio & Timing Acustico'}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedTrack.category === 'cardiaca' ? 'S1 ➔ SISTOLE ➔ S2 ➔ DIASTOLE' : 'INSPIRAZIONE ➔ PAUSA ➔ ESPIRAZIONE'}
              </span>
            </div>

            {selectedTrack.category === 'cardiaca' ? (
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {/* S1 Phase */}
                <div className={`p-2.5 rounded-lg border transition ${
                  selectedTrack.id === 's1-s2' || selectedTrack.id === 's4'
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <div className="font-bold">S1</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Chiusura AV</div>
                </div>

                {/* Systole Phase */}
                <div className={`p-2.5 rounded-lg border transition ${
                  selectedTrack.id === 'aortic-stenosis' || selectedTrack.id === 'mitral-regurgitation' || selectedTrack.id === 'pericardial-rub'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 ring-1 ring-amber-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <div className="font-bold flex items-center justify-center gap-1">
                    SISTOLE
                    {(selectedTrack.id === 'aortic-stenosis' || selectedTrack.id === 'mitral-regurgitation') && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    {selectedTrack.id === 'aortic-stenosis' && 'Soffio a Diamante'}
                    {selectedTrack.id === 'mitral-regurgitation' && 'Soffio Olosistolico'}
                    {selectedTrack.id !== 'aortic-stenosis' && selectedTrack.id !== 'mitral-regurgitation' && 'Eiezione'}
                  </div>
                </div>

                {/* S2 Phase */}
                <div className={`p-2.5 rounded-lg border transition ${
                  selectedTrack.id === 's1-s2' || selectedTrack.id === 'aortic-regurgitation'
                    ? 'bg-sky-500/20 border-sky-500/40 text-sky-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <div className="font-bold">S2</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Semilunari</div>
                </div>

                {/* Diastole Phase */}
                <div className={`p-2.5 rounded-lg border transition ${
                  selectedTrack.id === 'mitral-stenosis' || selectedTrack.id === 'aortic-regurgitation' || selectedTrack.id === 's3' || selectedTrack.id === 'pericardial-rub'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <div className="font-bold flex items-center justify-center gap-1">
                    DIASTOLE
                    {(selectedTrack.id === 'mitral-stenosis' || selectedTrack.id === 'aortic-regurgitation' || selectedTrack.id === 's3') && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    {selectedTrack.id === 'mitral-stenosis' && 'Rullio & Snap'}
                    {selectedTrack.id === 'aortic-regurgitation' && 'Decrescendo'}
                    {selectedTrack.id === 's3' && 'Galoppo S3'}
                    {selectedTrack.id !== 'mitral-stenosis' && selectedTrack.id !== 'aortic-regurgitation' && selectedTrack.id !== 's3' && 'Riempimento'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* Inspiratory */}
                <div className={`p-2.5 rounded-lg border transition ${
                  selectedTrack.id === 'crackles' || selectedTrack.id === 'bronchial-breath'
                    ? 'bg-sky-500/20 border-sky-500/50 text-sky-200 ring-1 ring-sky-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <div className="font-bold">INSPIRAZIONE</div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    {selectedTrack.id === 'crackles' ? 'Crepitii Tele-inspiratori' : 'Flusso d\'aria'}
                  </div>
                </div>

                {/* Pause */}
                <div className="p-2.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-400">
                  <div className="font-bold">PAUSA</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Tele-inspiratoria</div>
                </div>

                {/* Expiratory */}
                <div className={`p-2.5 rounded-lg border transition ${
                  selectedTrack.id === 'wheezing' || selectedTrack.id === 'bronchial-breath'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 ring-1 ring-amber-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <div className="font-bold">ESPIRAZIONE</div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    {selectedTrack.id === 'wheezing' ? 'Sibili & Fischi' : 'Svuotamento'}
                  </div>
                </div>
              </div>
            )}
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

