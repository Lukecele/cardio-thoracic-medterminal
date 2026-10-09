import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { RotateCcw, Play, Pause, Layers, RefreshCw } from 'lucide-react';

interface Props {
  focusTarget?: string;
  onSelectTarget?: (target: string) => void;
}

export const Anatomy3DViewport: React.FC<Props> = ({ focusTarget = 'heart-valves', onSelectTarget }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [manualModel, setManualModel] = useState<'heart' | 'aorta' | 'lungs' | null>(null);
  const [lastTarget, setLastTarget] = useState<string>(focusTarget);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);

  // If focusTarget changed from parent, reset manual override
  if (lastTarget !== focusTarget) {
    setLastTarget(focusTarget);
    setManualModel(null);
  }

  const derivedModel = focusTarget.includes('aorta') || focusTarget.includes('aneurysm')
    ? 'aorta'
    : focusTarget.includes('lung') || focusTarget.includes('pneumo')
    ? 'lungs'
    : 'heart';

  const activeModel = manualModel ?? derivedModel;

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentMeshRef = useRef<THREE.Mesh | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x06080d);
    scene.fog = new THREE.FogExp2(0x06080d, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Medical Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 2.2);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const topLight = new THREE.PointLight(0x10b981, 1.8, 10);
    topLight.position.set(0, 4, 2);
    scene.add(topLight);

    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // Loader for STL files
    const loader = new STLLoader();
    setIsLoading(true);

    const loadModel = (modelType: 'heart' | 'aorta' | 'lungs') => {
      // Clear previous meshes from group
      while (rootGroup.children.length > 0) {
        rootGroup.remove(rootGroup.children[0]);
      }

      const stlPath = modelType === 'heart' ? '/models/heart.stl' : modelType === 'aorta' ? '/models/aorta_dilatation.stl' : null;

      if (stlPath) {
        loader.load(
          stlPath,
          (geometry) => {
            geometry.center();
            geometry.computeVertexNormals();

            const material = new THREE.MeshPhysicalMaterial({
              color: modelType === 'heart' ? 0xbe123c : 0xd97706,
              roughness: 0.25,
              metalness: 0.15,
              clearcoat: 0.6,
              clearcoatRoughness: 0.1,
              wireframe: wireframeMode,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(0.025, 0.025, 0.025);
            if (modelType === 'aorta') {
              mesh.scale.set(0.018, 0.018, 0.018);
              mesh.rotation.x = -Math.PI / 2;
            } else {
              mesh.rotation.x = -Math.PI / 2 + 0.2;
            }

            rootGroup.add(mesh);
            currentMeshRef.current = mesh;
            setIsLoading(false);
          },
          undefined,
          (err) => {
            console.warn('Error loading STL model, falling back to procedural model:', err);
            createProceduralFallback(modelType);
            setIsLoading(false);
          }
        );
      } else {
        // Lungs procedural representation
        createProceduralFallback('lungs');
        setIsLoading(false);
      }
    };

    const createProceduralFallback = (type: string) => {
      if (type === 'lungs') {
        const lungGroup = new THREE.Group();
        const mat = new THREE.MeshPhysicalMaterial({
          color: 0x06b6d4,
          transparent: true,
          opacity: 0.5,
          roughness: 0.3,
          wireframe: wireframeMode,
        });
        const rLung = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.2, 32), mat);
        rLung.position.set(1.1, 0.2, 0);
        rLung.rotation.z = -0.15;
        const lLung = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.0, 32), mat);
        lLung.position.set(-1.1, 0.2, 0);
        lLung.rotation.z = 0.15;
        lungGroup.add(rLung);
        lungGroup.add(lLung);
        rootGroup.add(lungGroup);
      }
    };

    loadModel(activeModel);

    // Mouse drag interaction
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      rootGroup.rotation.y += deltaX * 0.007;
      rootGroup.rotation.x += deltaY * 0.007;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Pulsing heartbeat animation if heart is loaded
      if (activeModel === 'heart' && currentMeshRef.current) {
        const pulse = 1.0 + Math.sin(elapsed * 4.5) * 0.025;
        currentMeshRef.current.scale.set(0.025 * pulse, 0.025 * pulse, 0.025 * pulse);
      }

      // Auto rotation
      if (autoRotate && !isDragging) {
        rootGroup.rotation.y += delta * 0.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(dom)) {
        mount.removeChild(dom);
      }
    };
  }, [activeModel, autoRotate, wireframeMode]);

  return (
    <div className="relative w-full h-full min-h-[420px] bg-slate-950/90 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center space-x-2 text-cyan-400 font-mono text-xs">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Caricamento Mesh Clinica Segmentata...</span>
        </div>
      )}

      {/* Floating HUD Controls */}
      <div className="absolute top-3 left-3 flex items-center space-x-2 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-mono text-cyan-300 font-bold tracking-wider uppercase">
          Anatomical STL BioEngine
        </span>
      </div>

      <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-slate-900/95 backdrop-blur-md p-1 rounded-lg border border-slate-700/60">
        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          className={`p-1.5 rounded text-xs transition ${wireframeMode ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
          title="Toggle Wireframe / Shader pieno"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-1.5 rounded text-xs transition ${autoRotate ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
          title={autoRotate ? 'Pausa rotazione' : 'Avvia rotazione'}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => {
            if (cameraRef.current) cameraRef.current.position.set(0, 1.2, 5.5);
            if (rootGroupRef.current) {
              rootGroupRef.current.rotation.set(0, 0, 0);
            }
          }}
          className="p-1.5 rounded text-xs text-slate-400 hover:text-white transition"
          title="Reset visuale"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Anatomical Model Switcher Pills */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-800">
        <div className="flex space-x-1.5">
          <button
            onClick={() => {
              setManualModel('heart');
              onSelectTarget?.('heart');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
              activeModel === 'heart'
                ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            Cuore Umano (STL)
          </button>
          <button
            onClick={() => {
              setManualModel('aorta');
              onSelectTarget?.('aorta');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
              activeModel === 'aorta'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            Dilatazione Aortica (NIH STL)
          </button>
          <button
            onClick={() => {
              setManualModel('lungs');
              onSelectTarget?.('lungs');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
              activeModel === 'lungs'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            Gabbia & Polmoni
          </button>
        </div>

        <div className="hidden sm:block text-[11px] font-mono text-slate-400">
          Segmentazione TAC/RMN reale
        </div>
      </div>
    </div>
  );
};
