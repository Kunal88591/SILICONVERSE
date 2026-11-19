import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { ChipPackage } from './ChipPackage';
import { ChipComponents } from './ChipComponents';
import { SignalPaths } from './SignalPaths';
import { ThermalOverlay } from './ThermalOverlay';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  Layers, 
  HelpCircle,
  Eye
} from 'lucide-react';

interface CameraDirectorProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  isAutoRotate: boolean;
}

const CameraDirector: React.FC<CameraDirectorProps> = ({ controlsRef }) => {
  const { cameraPreset, selectedComponentId } = useSimulationStore();
  const { camera } = useThree();

  const targetPos = useRef(new THREE.Vector3(8.0, 8.5, 8.0));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(false);
  const transitionStart = useRef(0);

  useEffect(() => {
    isTransitioning.current = true;
    transitionStart.current = performance.now();

    if (selectedComponentId && CHIP_COMPONENTS[selectedComponentId]) {
      const meta = CHIP_COMPONENTS[selectedComponentId];
      targetLook.current.set(meta.position[0], meta.position[1], meta.position[2]);
      targetPos.current.set(meta.position[0] + 2.8, meta.position[1] + 3.6, meta.position[2] + 3.0);
      return;
    }

    switch (cameraPreset) {
      case 'top':
        targetPos.current.set(0, 12, 0.001);
        targetLook.current.set(0, 0, 0);
        break;
      case 'closeup':
        targetPos.current.set(0, 3.6, 3.8);
        targetLook.current.set(0, 0.2, 0);
        break;
      case 'exploded':
        targetPos.current.set(9.5, 11, 9.5);
        targetLook.current.set(0, 0.8, 0);
        break;
      case 'isometric':
      case 'reset':
      default:
        targetPos.current.set(8.0, 8.5, 8.0);
        targetLook.current.set(0, 0, 0);
        break;
    }
  }, [cameraPreset, selectedComponentId]);

  useFrame(() => {
    // Only animate camera position during explicit transitions for 600ms, then hand 100% control to OrbitControls!
    if (isTransitioning.current) {
      const elapsed = performance.now() - transitionStart.current;
      if (elapsed > 600) {
        isTransitioning.current = false;
      } else {
        camera.position.lerp(targetPos.current, 0.1);
        if (controlsRef.current) {
          controlsRef.current.target.lerp(targetLook.current, 0.1);
          controlsRef.current.update();
        }
      }
    }
  });

  return null;
};

export const SemiconductorScene: React.FC = () => {
  const { 
    explodedProgress, 
    setSelectedComponentId, 
    cameraPreset, 
    setCameraPreset 
  } = useSimulationStore();

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(false);

  // Manual zoom in helper
  const handleZoomIn = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(0.82);
      controlsRef.current.update();
    }
  };

  // Manual zoom out helper
  const handleZoomOut = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(1.22);
      controlsRef.current.update();
    }
  };

  // Manual reset helper
  const handleReset = () => {
    setCameraPreset('isometric');
    setSelectedComponentId(null);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(8.0, 8.5, 8.0);
      controlsRef.current.update();
    }
  };

  return (
    <div className="w-full h-full relative select-none overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [8.0, 8.5, 8.0], fov: 40 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerMissed={() => setSelectedComponentId(null)}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#050811']} />
        
        {/* Soft engineering atmosphere fog */}
        <fog attach="fog" args={['#050811', 20, 50]} />

        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.75} color="#D8E8FF" />

        {/* Top Key Light */}
        <directionalLight
          position={[8, 18, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={45}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
          color="#FFFFFF"
        />

        {/* Electric Blue and Cyan Rim Backlights */}
        <directionalLight position={[-10, 8, -10]} intensity={1.4} color="#387BFF" />
        <directionalLight position={[0, -6, 0]} intensity={0.4} color="#00E5FF" />
        <pointLight position={[0, 4.5, 0]} intensity={1.0} color="#00E5FF" distance={16} />

        {/* Studio Technical Floor Grid (with valid 6-char hex colors) */}
        <Grid
          position={[0, -1.6 - explodedProgress * 1.8, 0]}
          args={[32, 32]}
          cellSize={0.8}
          cellThickness={0.8}
          cellColor="#0D182E"
          sectionSize={4}
          sectionThickness={1.2}
          sectionColor="#142B52"
          fadeDistance={28}
          fadeStrength={1.4}
        />

        {/* 3D Chip Subsystem */}
        <group position={[0, 0, 0]}>
          <ChipPackage explodedProgress={explodedProgress} />
          <ChipComponents explodedProgress={explodedProgress} />
          <SignalPaths explodedProgress={explodedProgress} />
          <ThermalOverlay />
        </group>

        {/* Highly responsive OrbitControls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.9}
          zoomSpeed={1.2}
          panSpeed={0.8}
          minDistance={2.0}
          maxDistance={35}
          maxPolarAngle={Math.PI / 2 + 0.05}
          autoRotate={isAutoRotate}
          autoRotateSpeed={1.2}
        />

        <CameraDirector controlsRef={controlsRef} isAutoRotate={isAutoRotate} />
      </Canvas>

      {/* Floating Centered Bottom 3D Toolbar (Apple/Figma/Spline style) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-[#080D1A]/90 backdrop-blur-2xl px-3 py-2 rounded-2xl border border-white/[0.1] shadow-2xl">
        {/* Auto Rotate Toggle */}
        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            isAutoRotate
              ? 'bg-[#00E5FF] text-[#050811] font-semibold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
          }`}
          title="Toggle Smooth Auto-Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
          <span>{isAutoRotate ? 'Rotating' : 'Auto Rotate'}</span>
        </button>

        <div className="w-px h-5 bg-white/[0.1] mx-1" />

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Reset Camera */}
        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          title="Reset Camera View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/[0.1] mx-1" />

        {/* Camera Angle Presets */}
        <button
          onClick={() => setCameraPreset('isometric')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            cameraPreset === 'isometric' ? 'bg-[#387BFF]/20 text-[#387BFF] font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Isometric
        </button>
        <button
          onClick={() => setCameraPreset('top')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            cameraPreset === 'top' ? 'bg-[#387BFF]/20 text-[#387BFF] font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Top-Down
        </button>
        <button
          onClick={() => setCameraPreset('closeup')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            cameraPreset === 'closeup' ? 'bg-[#387BFF]/20 text-[#387BFF] font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Core Focus
        </button>
      </div>
    </div>
  );
};
