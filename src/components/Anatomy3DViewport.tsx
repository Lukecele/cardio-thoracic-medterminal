import React, { useState } from 'react';
import { Layers, Activity, Maximize2, RefreshCw } from 'lucide-react';

interface Anatomy3DViewportProps {
  focusTarget?: string | null;
  onSelectTarget?: (target: string) => void;
}

const MODELS = {
  heart: {
    id: 'heart',
    name: 'Cuore e Vasi (Alta Definizione)',
    // Using a known educational 3D heart model embed URL (Sketchfab example)
    url: 'https://sketchfab.com/models/c68fa8d39dc64f1db48dfa646049a4e9/embed?autostart=1&ui_controls=1&ui_infos=0&ui_watermark=0&ui_stop=0',
  },
  lungs: {
    id: 'lungs',
    name: 'Polmoni e Gabbia Toracica',
    // Using a known educational lungs/thorax model embed URL
    url: 'https://sketchfab.com/models/30a3eb71f28646bba84b16c1410ad542/embed?autostart=1&ui_controls=1&ui_infos=0&ui_watermark=0',
  },
  vessels: {
    id: 'vessels',
    name: 'Sistema Vascolare',
    // Generic vascular system embed
    url: 'https://sketchfab.com/models/2f7c0a969b824147ac3fbaeb30121a97/embed?autostart=1&ui_infos=0&ui_watermark=0',
  }
};

const Anatomy3DViewport: React.FC<Anatomy3DViewportProps> = ({ focusTarget, onSelectTarget }) => {
  const [activeModel, setActiveModel] = useState<keyof typeof MODELS>('heart');
  const [isLoading, setIsLoading] = useState(true);

  // Auto-switch model based on props from TheoryViewer
  React.useEffect(() => {
    if (focusTarget === 'lungs' || focusTarget === 'thorax') setActiveModel('lungs');
    else if (focusTarget === 'carotid' || focusTarget === 'aorta') setActiveModel('vessels');
    else if (focusTarget === 'heart') setActiveModel('heart');
  }, [focusTarget]);

  const currentModel = MODELS[activeModel];

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner flex flex-col">
      
      {/* Header bar */}
      <div className="absolute top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2 text-slate-700">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold">Atlante Interattivo 3D</span>
        </div>
        <button 
          onClick={() => window.open(currentModel.url.replace('/embed', ''), '_blank')}
          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Apri a schermo intero"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Iframe Container */}
      <div className="flex-1 relative bg-slate-200 w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-0">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <span className="text-sm text-slate-500 font-medium animate-pulse">Caricamento modello 3D ad alta risoluzione...</span>
          </div>
        )}
        
        <iframe
          key={currentModel.id}
          title={currentModel.name}
          className="absolute inset-0 w-full h-full border-none z-0"
          src={currentModel.url}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Bottom Switcher */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-lg z-10 max-w-[90%] overflow-x-auto custom-scrollbar">
        {(Object.keys(MODELS) as Array<keyof typeof MODELS>).map((key) => (
          <button
            key={key}
            onClick={() => {
              setIsLoading(true);
              setActiveModel(key);
              onSelectTarget?.(key);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeModel === key
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {MODELS[key].name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Anatomy3DViewport;
