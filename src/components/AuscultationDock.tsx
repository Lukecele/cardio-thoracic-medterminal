import React, { useState } from 'react';
import { Play, Square, Activity, Waves } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const AuscultationDock: React.FC = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);

  const sounds = [
    {
      id: 's1-s2',
      name: 'Toni Fisiologici S1-S2',
      category: 'Cuore Fisiologico',
      timing: 'Sistole / Diastole normale',
      play: () => audioEngine.playHeartSound('s1-s2'),
    },
    {
      id: 'aortic-stenosis',
      name: 'Soffio Stenosi Aortica',
      category: 'Valvulopatia',
      timing: 'Mesosistolico a diamante (crescendo-decrescendo)',
      play: () => audioEngine.playHeartSound('aortic-stenosis'),
    },
    {
      id: 's3-gallop',
      name: 'Terzo Tono S3 (Galoppo)',
      category: 'Scompenso Cardiaco',
      timing: 'Protodiastolico (riempimento rapido ventricolare)',
      play: () => audioEngine.playHeartSound('s3-gallop'),
    },
    {
      id: 'asthma-wheezing',
      name: 'Sibili Espiratori Asmatici',
      category: 'Vie Aeree / Asma',
      timing: 'Rumore secco continuo musicale in espirazione',
      play: () => audioEngine.playLungSound('wheezing'),
    },
    {
      id: 'lung-crackles',
      name: 'Rantoli Crepitanti a Velcro',
      category: 'Parenchima / Fibrosi',
      timing: 'Rumori umidi discontinui tele-inspiratori',
      play: () => audioEngine.playLungSound('crackles'),
    },
  ];

  const handleToggle = (id: string, playFn: () => void) => {
    if (activeSound === id) {
      audioEngine.stop();
      setActiveSound(null);
    } else {
      playFn();
      setActiveSound(id);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-200">
            Auscultation Soundboard & Synthesizer
          </h3>
        </div>
        {activeSound && (
          <button
            onClick={() => {
              audioEngine.stop();
              setActiveSound(null);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs hover:bg-rose-500/30 transition"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Ferma Audio</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sounds.map((sound) => {
          const isPlaying = activeSound === sound.id;
          return (
            <div
              key={sound.id}
              onClick={() => handleToggle(sound.id, sound.play)}
              className={`p-3 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
                isPlaying
                  ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    {sound.category}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                      isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPlaying ? <Waves className="w-3.5 h-3.5" /> : <Play className="w-3 h-3 ml-0.5" />}
                  </div>
                </div>
                <div className="font-semibold text-slate-200 text-sm mb-1">{sound.name}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{sound.timing}</div>
              </div>

              {isPlaying && (
                <div className="mt-3 flex items-center space-x-1">
                  <span className="h-2 w-1 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-4 w-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-6 w-1 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="h-3 w-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                  <span className="h-5 w-1 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '250ms' }} />
                  <span className="text-[11px] font-mono text-rose-400 ml-2">Audio loop in corso...</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
