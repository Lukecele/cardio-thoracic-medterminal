import React, { useState } from 'react';
import { Volume2, Play, Square, Headphones, Info } from 'lucide-react';

const AUDIO_TRACKS = [
  { id: 's1-s2', name: 'Toni Cardiaci Normali (S1-S2)', videoId: 'tZ1OevIibH8', desc: 'Ritmo sinusale normale. S1 (chiusura mitrale/tricuspide) e S2 (chiusura aortica/polmonare).' },
  { id: 's3-gallop', name: 'Terzo Tono (S3) - Ritmo di Galoppo', videoId: 'e86j5W4iTz0', desc: 'Suono protodiastolico da riempimento ventricolare rapido (Scompenso cardiaco).' },
  { id: 'aortic-stenosis', name: 'Stenosi Aortica (Soffio Sistolico)', videoId: 'p2dE3kZlRHY', desc: 'Soffio mesosistolico in crescendo-decrescendo irradiato alle carotidi.' },
  { id: 'mitral-regurgitation', name: 'Insufficienza Mitralica', videoId: '8d2_9g0r1Y8', desc: 'Soffio olosistolico irradiato all\'ascella.' },
  { id: 'crackles', name: 'Rantoli Crepitanti (Polmoni)', videoId: 'yVqH3eH_MKE', desc: 'Suono a strappo secco in inspirazione (Edema polmonare, Polmonite).' },
  { id: 'wheezes', name: 'Sibili Espiratori (Polmoni)', videoId: 'TzFhN0bH2M0', desc: 'Suono continuo musicale in espirazione (Asma, BPCO).' }
];

const AuscultationDock: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<typeof AUDIO_TRACKS[0] | null>(null);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center space-x-3">
        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
          <Headphones className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">Libreria Auscultatoria</h2>
          <p className="text-xs text-slate-500">Reperti sonori ad alta fedeltà (USA Educational)</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Track List */}
        <div className="w-full md:w-1/2 border-r border-slate-100 overflow-y-auto custom-scrollbar p-2">
          {AUDIO_TRACKS.map((track) => (
            <button
              key={track.id}
              onClick={() => setActiveTrack(track)}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-all flex items-start space-x-3 ${
                activeTrack?.id === track.id 
                  ? 'bg-rose-50 border border-rose-200 shadow-sm' 
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className={`mt-0.5 rounded-full p-1.5 ${activeTrack?.id === track.id ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {activeTrack?.id === track.id ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
              </div>
              <div>
                <div className={`text-sm font-semibold ${activeTrack?.id === track.id ? 'text-rose-700' : 'text-slate-700'}`}>
                  {track.name}
                </div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {track.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Player Window (YouTube Iframe) */}
        <div className="w-full md:w-1/2 bg-slate-100 p-4 flex flex-col items-center justify-center relative">
          {activeTrack ? (
            <div className="w-full max-w-md w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl ring-4 ring-white">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube-nocookie.com/embed/${activeTrack.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeTrack.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="text-center p-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <Headphones className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-slate-600 font-medium">Seleziona un reperto</h3>
              <p className="text-sm text-slate-400 mt-2 max-w-[200px]">Usa le cuffie per apprezzare le frequenze cardiache più basse.</p>
            </div>
          )}

          {activeTrack && (
            <div className="mt-6 w-full max-w-md bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 leading-relaxed">{activeTrack.desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuscultationDock;
