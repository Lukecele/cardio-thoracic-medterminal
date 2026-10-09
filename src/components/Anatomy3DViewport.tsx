import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Play, Pause } from 'lucide-react';

interface Props {
  focusTarget?: string;
  onSelectTarget?: (target: string) => void;
}

export const Anatomy3DViewport: React.FC<Props> = ({ focusTarget = 'heart-valves', onSelectTarget }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelsRef = useRef<{ [key: string]: THREE.Object3D }>({});

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x07090e);
    scene.fog = new THREE.FogExp2(0x07090e, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 1.5, 6.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 2.5);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf43f5e, 1.8);
    dirLight2.position.set(-5, -4, -4);
    scene.add(dirLight2);

    // Anatomical Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. HEART MODEL
    const heartGroup = new THREE.Group();
    heartGroup.position.set(0, 0.2, 0);

    // Left Ventricle (muscular cone)
    const lvGeo = new THREE.ConeGeometry(0.75, 1.4, 24);
    const lvMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.3,
      metalness: 0.2,
      wireframe: false,
    });
    const lvMesh = new THREE.Mesh(lvGeo, lvMat);
    lvMesh.rotation.z = Math.PI + 0.25;
    lvMesh.position.set(-0.2, -0.4, 0);
    heartGroup.add(lvMesh);

    // Right Ventricle
    const rvGeo = new THREE.ConeGeometry(0.65, 1.2, 24);
    const rvMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.4 });
    const rvMesh = new THREE.Mesh(rvGeo, rvMat);
    rvMesh.rotation.z = Math.PI - 0.2;
    rvMesh.position.set(0.3, -0.3, 0.2);
    heartGroup.add(rvMesh);

    // Atria
    const atriaGeo = new THREE.SphereGeometry(0.6, 24, 24);
    const atriaMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 });
    const atriaMesh = new THREE.Mesh(atriaGeo, atriaMat);
    atriaMesh.position.set(0, 0.4, -0.1);
    heartGroup.add(atriaMesh);

    // Aortic Root & Valve Ring (Glowing Target)
    const valveGeo = new THREE.TorusGeometry(0.32, 0.08, 16, 32);
    const valveMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00b4d8,
      emissiveIntensity: 0.6,
      roughness: 0.1,
    });
    const valveMesh = new THREE.Mesh(valveGeo, valveMat);
    valveMesh.rotation.x = Math.PI / 2;
    valveMesh.position.set(-0.1, 0.55, 0.1);
    heartGroup.add(valveMesh);
    modelsRef.current['aortic-valve'] = valveMesh;
    modelsRef.current['heart-valves'] = heartGroup;

    // Coronary Arteries (Left and Right branches)
    const coronaryGroup = new THREE.Group();
    const lcaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.1, 0.45, 0.2),
      new THREE.Vector3(-0.35, 0.1, 0.35),
      new THREE.Vector3(-0.25, -0.5, 0.25),
      new THREE.Vector3(-0.15, -0.9, 0.1),
    ]);
    const lcaGeo = new THREE.TubeGeometry(lcaCurve, 20, 0.04, 8, false);
    const lcaMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.5 });
    const lcaMesh = new THREE.Mesh(lcaGeo, lcaMat);
    coronaryGroup.add(lcaMesh);
    heartGroup.add(coronaryGroup);
    modelsRef.current['coronary-arteries'] = coronaryGroup;

    rootGroup.add(heartGroup);

    // 2. VASCULAR TREE (Aorta, Carotids, Abdominal Aorta)
    const vascularGroup = new THREE.Group();

    // Aorta Arch Curve
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.1, 0.6, 0.1), // root
      new THREE.Vector3(-0.1, 1.2, 0.0), // ascending
      new THREE.Vector3(0.0, 1.45, -0.2), // arch apex
      new THREE.Vector3(0.35, 1.25, -0.3), // descending start
      new THREE.Vector3(0.35, 0.0, -0.3), // thoracic
      new THREE.Vector3(0.25, -1.2, -0.3), // abdominal suprarenal
      new THREE.Vector3(0.2, -1.8, -0.25), // abdominal infrarenal
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 40, 0.16, 16, false);
    const aortaMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.2,
      metalness: 0.3,
    });
    const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
    vascularGroup.add(aortaMesh);

    // Abdominal Aorta Aneurysm site (glowing bulb)
    const aaaGeo = new THREE.SphereGeometry(0.38, 20, 20);
    const aaaMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
      wireframe: false,
    });
    const aaaMesh = new THREE.Mesh(aaaGeo, aaaMat);
    aaaMesh.scale.set(1.1, 1.6, 1.1);
    aaaMesh.position.set(0.2, -1.8, -0.25);
    vascularGroup.add(aaaMesh);
    modelsRef.current['abdominal-aorta'] = aaaMesh;

    // Carotid Arteries (Branching up from arch)
    const carotidGroup = new THREE.Group();
    const lccaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 1.45, -0.15),
      new THREE.Vector3(0.2, 2.3, -0.1),
    ]);
    const rccaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, 1.4, -0.05),
      new THREE.Vector3(-0.25, 2.3, -0.1),
    ]);
    const carotidGeoL = new THREE.TubeGeometry(lccaCurve, 16, 0.06, 8, false);
    const carotidGeoR = new THREE.TubeGeometry(rccaCurve, 16, 0.06, 8, false);
    const carotidMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    carotidGroup.add(new THREE.Mesh(carotidGeoL, carotidMat));
    carotidGroup.add(new THREE.Mesh(carotidGeoR, carotidMat));
    vascularGroup.add(carotidGroup);
    modelsRef.current['carotid-arteries'] = carotidGroup;

    rootGroup.add(vascularGroup);
    modelsRef.current['vascular-tree'] = vascularGroup;

    // 3. LUNGS MODEL (Transparent Blue/Cyan)
    const lungGroup = new THREE.Group();
    const lungMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
      roughness: 0.6,
      wireframe: true,
    });

    // Right Lung (3 lobes)
    const rLungGeo = new THREE.ConeGeometry(0.9, 2.2, 16);
    const rLungMesh = new THREE.Mesh(rLungGeo, lungMat);
    rLungMesh.position.set(1.2, 0.3, -0.1);
    rLungMesh.rotation.z = -0.12;
    lungGroup.add(rLungMesh);

    // Left Lung (2 lobes with cardiac notch)
    const lLungGeo = new THREE.ConeGeometry(0.85, 2.0, 16);
    const lLungMesh = new THREE.Mesh(lLungGeo, lungMat);
    lLungMesh.position.set(-1.25, 0.3, -0.1);
    lLungMesh.rotation.z = 0.12;
    lungGroup.add(lLungMesh);

    // Trachea & Bronchi
    const tracheaGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 12);
    const tracheaMat = new THREE.MeshStandardMaterial({ color: 0x67e8f9, roughness: 0.4 });
    const tracheaMesh = new THREE.Mesh(tracheaGeo, tracheaMat);
    tracheaMesh.position.set(0, 1.6, -0.35);
    lungGroup.add(tracheaMesh);

    rootGroup.add(lungGroup);
    modelsRef.current['lungs-airways'] = lungGroup;

    // Mouse Interaction / Orbit Dragging
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
      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;
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

      // Pulsing heartbeat animation on ventricles
      const scale = 1.0 + Math.sin(elapsed * 5.0) * 0.04;
      heartGroup.scale.set(scale, scale, scale);

      // Auto-rotation if enabled and not dragging
      if (autoRotate && !isDragging) {
        rootGroup.rotation.y += delta * 0.35;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
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
  }, [autoRotate]);

  // Focus effect when target changes
  useEffect(() => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;

    switch (focusTarget) {
      case 'aortic-valve':
      case 'heart-valves':
        cam.position.set(0, 0.8, 4.2);
        break;
      case 'coronary-arteries':
        cam.position.set(-0.5, 0.2, 3.8);
        break;
      case 'lungs-airways':
        cam.position.set(0, 0.4, 5.8);
        break;
      case 'abdominal-aorta':
        cam.position.set(0.3, -1.6, 4.2);
        break;
      case 'carotid-arteries':
        cam.position.set(0, 1.9, 4.0);
        break;
      default:
        cam.position.set(0, 1.2, 6.2);
    }
  }, [focusTarget]);

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Viewport HUD Controls */}
      <div className="absolute top-3 left-3 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-mono text-cyan-300 font-semibold tracking-wider uppercase">WebGL 3D BioEngine</span>
      </div>

      <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-700/60">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-1.5 rounded text-xs transition ${autoRotate ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
          title={autoRotate ? 'Pausa rotazione' : 'Avvia rotazione'}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => {
            if (cameraRef.current) cameraRef.current.position.set(0, 1.2, 6.2);
          }}
          className="p-1.5 rounded text-xs text-slate-400 hover:text-white transition"
          title="Reset visuale"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hotspot Target Selector Pills */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 bg-slate-900/80 backdrop-blur-md p-2 rounded-lg border border-slate-800">
        {[
          { id: 'aortic-valve', label: 'Valvola Aortica (TAVI)' },
          { id: 'coronary-arteries', label: 'Coronarie (STEMI)' },
          { id: 'lungs-airways', label: 'Polmoni & Bronchi' },
          { id: 'abdominal-aorta', label: 'Aorta Addominale (AAA)' },
          { id: 'carotid-arteries', label: 'Carotidi (TSA)' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTarget && onSelectTarget(item.id)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition border ${
              focusTarget === item.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-medium'
                : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
