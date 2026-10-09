import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Layers, RotateCcw, Play, Pause, Eye, Info, Box } from 'lucide-react';

interface Anatomy3DViewportProps {
  focusTarget?: string | null;
  onSelectTarget?: (target: string) => void;
}

type ModelType = 'heart' | 'aorta' | 'lungs';

interface AnatomicalPin {
  name: string;
  pos: [number, number, number];
  note: string;
}

const MODEL_CONFIGS: Record<ModelType, {
  name: string;
  badge: string;
  color: string;
  description: string;
  pins: AnatomicalPin[];
}> = {
  heart: {
    name: 'Cuore Umano & Camere Valvolari',
    badge: 'CARDIO-3D',
    color: 'rose',
    description: 'Modello volumetrico STL del miocardio: atri, ventricoli, solco interventricolare e radice dei grandi vasi.',
    pins: [
      { name: 'Ventricolo Sinistro (LV)', pos: [12, -15, 10], note: 'Parete ad alto spessore (8-11 mm). Camera ad alta pressione sistemica.' },
      { name: 'Ventricolo Destro (RV)', pos: [-15, -10, 15], note: 'Camera a bassa impedenza volumetrica. Rischio dilatazione in TEP massiva.' },
      { name: 'Bulbo & Radice Aortica', pos: [2, 22, -4], note: 'Sede dei seni di Valsalva e dell\'emergenza delle arterie coronarie.' },
      { name: 'Atrio Sinistro (LA)', pos: [10, 10, -18], note: 'Sede dei 4 sbocchi delle vene polmonari e dell\'auricola sinistra (trombogenesi in FA).' },
    ]
  },
  aorta: {
    name: 'Aorta Toraco-Addominale & Dilatazione Aneurismatica',
    badge: 'VASCULAR-3D',
    color: 'emerald',
    description: 'Modello STL dell\'aorta toracica con ectasia/dilatazione aneurismatica e rischio dissecativo (Stanford A/B).',
    pins: [
      { name: 'Arco Aortico & Tronchi Sovraortici', pos: [0, 30, 0], note: 'Origine del tronco anonimo brachiocefalico, carotide comune sx e succlavia sx.' },
      { name: 'Ectasia Aneurismatica', pos: [-5, 5, 8], note: 'Zona a massima tensione parietale secondo la legge di Laplace (T = P x r / 2h).' },
      { name: 'Aorta Discendente', pos: [6, -25, -10], note: 'Sede tipica per dissecazione Stanford Tipo B ed endoprotesi TEVAR.' },
    ]
  },
  lungs: {
    name: 'Albero Bronchiale & Gabbia Toracica (3D Polmoni)',
    badge: 'THORACIC-3D',
    color: 'sky',
    description: 'Ricostruzione anatomica parametrica dell\'albero tracheobronchiale (trachea, carena, 5 bronchi lobari) e gabbia toracica.',
    pins: [
      { name: 'Carena Tracheale', pos: [0, 6, 0], note: 'Biforcazione a livello T4-T5. Angolo acuto interbronchiale (sperone carenale).' },
      { name: 'Bronco Principale Destro', pos: [14, 0, 2], note: 'Più largo, più corto (2-3 cm) e più verticale del sinistro: frequente inalazione corpi estranei.' },
      { name: 'Bronco Principale Sinistro', pos: [-16, -2, -2], note: 'Più lungo (5 cm), decorso orizzontalizzato sotto l\'arco aortico.' },
      { name: 'Lobi Polmonari Destri (RUL, RML, RLL)', pos: [25, -10, 0], note: '3 lobi separati da scissura obliqua e orizzontale.' },
      { name: 'Lobi Polmonari Sinistri (LUL, LLL)', pos: [-25, -10, 0], note: '2 lobi separati da scissura principale obliqua con lingula.' },
    ]
  }
};

export const Anatomy3DViewport: React.FC<Anatomy3DViewportProps> = ({ focusTarget, onSelectTarget }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeModel, setActiveModel] = useState<ModelType>('heart');
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPin, setSelectedPin] = useState<AnatomicalPin | null>(null);

  // Sync with prop
  useEffect(() => {
    if (!focusTarget) return;
    if (focusTarget === 'lungs' || focusTarget === 'thorax') {
      setActiveModel('lungs');
    } else if (focusTarget === 'aorta' || focusTarget === 'vessels' || focusTarget === 'carotid') {
      setActiveModel('aorta');
    } else if (focusTarget === 'heart') {
      setActiveModel('heart');
    }
  }, [focusTarget]);

  // Three.js Scene Setup
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090e);
    sceneRef.current = scene;

    // 2. Camera
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 10, 85);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 1.0;
    controls.minDistance = 20;
    controls.maxDistance = 180;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.8); // Cool blue key
    dirLight1.position.set(40, 50, 60);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf43f5e, 1.4); // Warm red rim
    dirLight2.position.set(-40, -30, -50);
    scene.add(dirLight2);

    const hemiLight = new THREE.HemisphereLight(0x1e293b, 0x0f172a, 0.8);
    scene.add(hemiLight);

    // Group for Model & Pins
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
    };
  }, []);

  // Update autoRotate when state changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Load Model Geometry whenever activeModel or wireframe changes
  useEffect(() => {
    const meshGroup = meshGroupRef.current;
    if (!meshGroup) return;

    // Clear previous model objects
    while (meshGroup.children.length > 0) {
      const child = meshGroup.children[0] as any;
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m: any) => m.dispose());
        else child.material.dispose();
      }
      meshGroup.remove(child);
    }
    setSelectedPin(null);
    setIsLoading(true);

    if (activeModel === 'heart' || activeModel === 'aorta') {
      const stlPath = activeModel === 'heart' ? '/models/heart.stl' : '/models/aorta_dilatation.stl';
      const loader = new STLLoader();

      loader.load(
        stlPath,
        (geometry) => {
          geometry.computeVertexNormals();
          geometry.center();
          geometry.computeBoundingSphere();
          
          const origRadius = geometry.boundingSphere?.radius || 100;
          const targetRadius = 22; // normalize model radius
          const scale = targetRadius / origRadius;
          geometry.scale(scale, scale, scale);

          const color = activeModel === 'heart' ? 0xe11d48 : 0x059669;
          const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.35,
            metalness: 0.15,
            wireframe: wireframe,
            flatShading: false,
          });

          const mesh = new THREE.Mesh(geometry, material);
          meshGroup.add(mesh);
          setIsLoading(false);
        },
        undefined,
        (err) => {
          console.error("Error loading STL:", err);
          setIsLoading(false);
        }
      );
    } else if (activeModel === 'lungs') {
      // Procedural Anatomical Bronchial Tree & Thorax
      const lungGroup = new THREE.Group();

      // 1. Trachea (Cylinder with rings)
      const tracheaGeo = new THREE.CylinderGeometry(2.4, 2.4, 22, 24);
      const tracheaMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.4,
        metalness: 0.1,
        wireframe: wireframe,
      });
      const trachea = new THREE.Mesh(tracheaGeo, tracheaMat);
      trachea.position.set(0, 16, 0);
      lungGroup.add(trachea);

      // Cartilage rings on Trachea
      for (let y = 6; y <= 25; y += 3) {
        const ringGeo = new THREE.TorusGeometry(2.6, 0.3, 8, 24);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, wireframe: wireframe });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(0, y, 0);
        ring.rotation.x = Math.PI / 2;
        lungGroup.add(ring);
      }

      // 2. Carina & Right Main Bronchus
      const rightBronchusGeo = new THREE.CylinderGeometry(1.8, 1.4, 14, 16);
      const rightBronchus = new THREE.Mesh(rightBronchusGeo, tracheaMat);
      rightBronchus.position.set(6, 1, 0);
      rightBronchus.rotation.z = -Math.PI / 6;
      lungGroup.add(rightBronchus);

      // 3. Left Main Bronchus (More horizontal & longer)
      const leftBronchusGeo = new THREE.CylinderGeometry(1.6, 1.3, 18, 16);
      const leftBronchus = new THREE.Mesh(leftBronchusGeo, tracheaMat);
      leftBronchus.position.set(-8, 0, 0);
      leftBronchus.rotation.z = Math.PI / 4;
      lungGroup.add(leftBronchus);

      // 4. Right Lobes: RUL, RML, RLL Bronchi
      const rUpperBranch = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.7, 10, 12), tracheaMat);
      rUpperBranch.position.set(13, 7, 2);
      rUpperBranch.rotation.z = -Math.PI / 3;
      lungGroup.add(rUpperBranch);

      const rLowerBranch = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.8, 14, 12), tracheaMat);
      rLowerBranch.position.set(12, -9, 0);
      rLowerBranch.rotation.z = -Math.PI / 10;
      lungGroup.add(rLowerBranch);

      // 5. Left Lobes: LUL & LLL Bronchi
      const lUpperBranch = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.7, 12, 12), tracheaMat);
      lUpperBranch.position.set(-16, 5, 2);
      lUpperBranch.rotation.z = Math.PI / 3;
      lungGroup.add(lUpperBranch);

      const lLowerBranch = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.8, 14, 12), tracheaMat);
      lLowerBranch.position.set(-16, -10, 0);
      lLowerBranch.rotation.z = Math.PI / 8;
      lungGroup.add(lLowerBranch);

      // 6. Translucent Lung Envelopes (Smooth anatomical silhouettes)
      const lungLobeMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: wireframe ? 0.3 : 0.45,
        roughness: 0.6,
        wireframe: wireframe,
      });

      // Right Lung Envelope (3 lobes merged volume)
      const rLungGeo = new THREE.SphereGeometry(15, 24, 24);
      rLungGeo.scale(0.85, 1.4, 0.75);
      const rLung = new THREE.Mesh(rLungGeo, lungLobeMat);
      rLung.position.set(18, -4, 0);
      lungGroup.add(rLung);

      // Left Lung Envelope (2 lobes, cardiac notch accommodation)
      const lLungGeo = new THREE.SphereGeometry(14, 24, 24);
      lLungGeo.scale(0.75, 1.35, 0.75);
      const lLung = new THREE.Mesh(lLungGeo, lungLobeMat);
      lLung.position.set(-18, -4, 0);
      lungGroup.add(lLung);

      // 7. Rib cage contours (Parametric 6 thoracic rib arches)
      for (let i = 0; i < 6; i++) {
        const ribY = 14 - i * 6;
        const ribRadius = 24 + i * 1.5;
        const ribGeo = new THREE.TorusGeometry(ribRadius, 0.3, 6, 32, Math.PI * 1.4);
        const ribMat = new THREE.MeshBasicMaterial({ color: 0x475569, wireframe: true, transparent: true, opacity: 0.4 });
        const rib = new THREE.Mesh(ribGeo, ribMat);
        rib.position.set(0, ribY, -2);
        rib.rotation.x = Math.PI / 2.3;
        rib.rotation.z = Math.PI * 0.8;
        lungGroup.add(rib);
      }

      meshGroup.add(lungGroup);
      setIsLoading(false);
    }
  }, [activeModel, wireframe]);

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleSelectModel = (model: ModelType) => {
    setActiveModel(model);
    onSelectTarget?.(model);
  };

  const config = MODEL_CONFIGS[activeModel];

  return (
    <div className="relative w-full h-full min-h-[480px] bg-[#07090e] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      
      {/* Top HUD Header */}
      <div className="absolute top-0 inset-x-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">{config.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {config.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1">{config.description}</p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg text-xs font-medium transition border ${
              autoRotate
                ? 'bg-blue-600/20 border-blue-500/30 text-blue-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Rotazione Automatica"
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded-lg text-xs font-medium transition border ${
              wireframe
                ? 'bg-purple-600/20 border-purple-500/30 text-purple-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Modalità Wireframe Mesh"
          >
            <Box className="w-4 h-4" />
          </button>

          <button
            onClick={resetView}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white transition"
            title="Reimposta Angolazione"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* WebGL Canvas Container */}
      <div ref={containerRef} className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm z-20">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <span className="text-xs font-mono text-blue-400 tracking-wider">RENDERING GEOMETRIA WEBGL...</span>
          </div>
        )}
      </div>

      {/* Selected Landmark Pin Note Box */}
      {selectedPin && (
        <div className="absolute top-16 left-4 right-4 sm:right-auto sm:max-w-md bg-slate-950/90 backdrop-blur-md border border-blue-500/30 rounded-xl p-3.5 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {selectedPin.name}
            </span>
            <button
              onClick={() => setSelectedPin(null)}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{selectedPin.note}</p>
        </div>
      )}

      {/* Anatomical Landmark Buttons (HUD Overlay) */}
      <div className="absolute bottom-16 inset-x-4 flex gap-1.5 overflow-x-auto custom-scrollbar pb-1 z-10 pointer-events-auto">
        {config.pins.map((pin, i) => (
          <button
            key={i}
            onClick={() => setSelectedPin(pin)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
              selectedPin?.name === pin.name
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                : 'bg-slate-900/80 backdrop-blur-md border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            📍 {pin.name}
          </button>
        ))}
      </div>

      {/* Bottom Model Switcher Dock */}
      <div className="bg-slate-950/90 backdrop-blur-md border-t border-slate-800 p-2.5 flex items-center justify-center gap-2 z-10">
        <button
          onClick={() => handleSelectModel('heart')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition border ${
            activeModel === 'heart'
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          ❤️ Cuore & Vasi (STL)
        </button>

        <button
          onClick={() => handleSelectModel('aorta')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition border ${
            activeModel === 'aorta'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          🩸 Aorta & Dissecazione (STL)
        </button>

        <button
          onClick={() => handleSelectModel('lungs')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition border ${
            activeModel === 'lungs'
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          🫁 Albero Bronchiale & Gabbia Toracica
        </button>
      </div>

    </div>
  );
};

export default Anatomy3DViewport;
