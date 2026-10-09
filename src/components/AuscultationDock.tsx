import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Activity, Volume2, VolumeX } from 'lucide-react';

interface SoundItem {
  id: string;
  name: string;
  category: string;
  timing: string;
  file: string;
  clinicalSignificance: string;
}

export const AuscultationDock: React.FC = () => {
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const realClinicalSounds: SoundItem[] = [
    {
      id: 's1-s2',
      name: 'Toni Fisiologici S1-S2 (61 bpm)',
      category: 'Cardiologia / Fisiologia',
      timing: 'Ritmo sinusale normale (Lub-Dub)',
      file: '/audio/s1-s2.ogg',
      clinicalSignificance: 'Chiusura fisiologica delle valvole AV (S1) e semilunari (S2). Registrazione stetoscopica reale.'
    },
    {
      id: 'systolic-murmur',
      name: 'Soffio Sistolico Reale',
      category: 'Valvulopatia / Stenosi Aortica',
      timing: 'Mesosistolico a diamante (crescendo-decrescendo)',
      file: '/audio/systolic-murmur.ogg',
      clinicalSignificance: 'Flusso turbolento attraverso valvola semilunare stenotica o rigurgito mitro-tricuspidale.'
    },
    {
      id: 'vsd-pansystolic',
      name: 'Soffio Olosistolico (VSD / Regurgito)',
      category: 'Cardiopatie Congenite / DIV',
      timing: 'Olosistolico a getto di vapore costante da S1 a S2',
      file: '/audio/vsd-pansystolic.wav',
      clinicalSignificance: 'Shunt sinistro-destro attraverso difetto del setto interventricolare o insufficienza mitralica severa.'
    },
    {
      id: 'afib',
      name: 'Fibrillazione Atriale (Ritmo Caotico)',
      category: 'Aritmie / Elettrofisiologia',
      timing: 'Completamente irregolare (irregolarmente irregolare)',
      file: '/audio/afib.ogg',
      clinicalSignificance: 'Mancanza di contrazione atriale coordinata, toni di intensità variabile da battito a battito.'
    },
    {
      id: 'tachycardia',
      name: 'Tachicardia Ventricolare/Sopraventricolare (150 bpm)',
      category: 'Aritmie ad Alta Frequenza',
      timing: 'Battiti rapidi ritmici > 140-150 bpm',
      file: '/audio/tachycardia.ogg',
      clinicalSignificance: 'Rientro nodale o tachicardia da sforzo; diastole marcatamente accorciata.'
    },
    {
      id: 'wheezing',
      name: 'Sibili Espiratori Asmatici',
      category: 'Pneumologia / Asma & BPCO',
      timing: 'Rumore secco musicale continuo in espirazione',
      file: '/audio/wheezing.ogg',
      clinicalSignificance: 'Vibrazione delle pareti bronchiali per severo restringimento del calibro da broncospasmo.'
    },
    {
      id: 'crackles',
      name: 'Rantoli Crepitanti di Polmonite',
      category: 'Pneumologia / Infezioni & Alveoli',
      timing: 'Rumori umidi discontinui tele-inspiratori',
      file: '/audio/crackles.ogg',
      clinicalSignificance: 'Apertura esplosiva degli alveoli e bronchioli collassati contenenti essudato infiammatorio.'
    }
  ];

  const currentSound = realClinicalSounds.find(s => s.id === activeSoundId);

  const handlePlayToggle = (sound: SoundItem) => {
    if (activeSoundId === sound.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setActiveSoundId(sound.id);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = sound.file;
        audioRef.current.currentTime = 0;
        audioRef.current.volume = volume;
        audioRef.current.play().catch(e => console.log('Audio playback error:', e));
      }
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      // Loop seamlessly
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-2xl">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" loop />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100">
              Registrazioni Stetoscopiche Reali (Stetofonografia)
            </h3>
            <p className="text-[11px] text-slate-400">Tracce audio cliniche reali da stetoscopio medico (nessuna sintesi fittizia).</p>
          </div>
        </div>

        {isPlaying && currentSound && (
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline text-xs font-mono text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60">
              {currentSound.name}
            </span>
            <button
              onClick={handleStop}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/50 text-xs font-mono hover:bg-rose-500/30 transition"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Audio</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Real Audio Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {realClinicalSounds.map((sound) => {
          const isSelected = activeSoundId === sound.id;
          const isCurrentlyActive = isSelected && isPlaying;

          return (
            <div
              key={sound.id}
              onClick={() => handlePlayToggle(sound)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                isCurrentlyActive
                  ? 'bg-rose-950/30 border-rose-500/80 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/40'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                    {sound.category}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                      isCurrentlyActive
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isCurrentlyActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </div>
                </div>

                <div className="font-bold text-slate-100 text-sm mb-1">{sound.name}</div>
                <div className="text-xs text-slate-400 leading-snug">{sound.timing}</div>
                <div className="text-[11px] text-slate-500 mt-2 font-sans italic">{sound.clinicalSignificance}</div>
              </div>

              {isCurrentlyActive && (
                <div className="mt-3 pt-2.5 border-t border-rose-900/40 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2 w-1 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-4 w-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-6 w-1 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="h-3 w-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                    <span className="h-5 w-1 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '250ms' }} />
                    <span className="text-[11px] font-mono text-rose-400 ml-2">In riproduzione (Loop)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {currentTime.toFixed(1)}s {duration > 0 ? `/ ${duration.toFixed(1)}s` : ''}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Volume control slider */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-2">
          {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
          <span>Volume Stetoscopio:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
            }}
            className="w-24 accent-rose-500 cursor-pointer"
          />
        </div>
        <span className="text-[11px] text-slate-500">Formato originale stetoscopico OGG/WAV 44.1kHz</span>
      </div>
    </div>
  );
};
