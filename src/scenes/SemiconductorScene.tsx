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
  Eye, 
  Layers, 
  HelpCircle 
} from 'lucide-react';

interface CameraDirectorProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  isAutoRotate: boolean;
}

const CameraDirector: React.FC<CameraDirectorProps> = ({ controlsRef, isAutoRotate }) => {
  const { cameraPreset, selectedComponentId } = useSimulationStore();
  const { camera } = useThree();

  const targetPos = useRef(new THREE.Vector3(9.5, 10.5, 9.5));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(false);
  const transitionStart = useRef(0);

  useEffect(() => {
    isTransitioning.current = true;
    transitionStart.current = performance.now();

    if (selectedComponentId && CHIP_COMPONENTS[selectedComponentId]) {
      const meta = CHIP_COMPONENTS[selectedComponentId];
      targetLook.current.set(meta.position[0], meta.position[1], meta.position[2]);
      targetPos.current.set(meta.position[0] + 3.2, meta.position[1] + 4.2, meta.position[2] + 3.5);
      return;
    }

    switch (cameraPreset) {
      case 'top':
        targetPos.current.set(0, 14, 0.001);
        targetLook.current.set(0, 0, 0);
        break;
      case 'closeup':
        targetPos.current.set(0, 4.2, 4.5);
        targetLook.current.set(0, 0.3, 0);
        break;
      case 'exploded':
        targetPos.current.set(11, 13, 11);
        targetLook.current.set(0, 1.2, 0);
        break;
      case 'isometric':
      case 'reset':
      default:
        targetPos.current.set(9.5, 10.5, 9.5);
        targetLook.current.set(0, 0, 0);
        break;
    }
  }, [cameraPreset, selectedComponentId]);

  useFrame(() => {
    // Only interpolate camera when an explicit preset or selection change was triggered
    // and stop immediately after 750ms so user has 100% full OrbitControls freedom!
    if (isTransitioning.current) {
      const elapsed = performance.now() - transitionStart.current;
      if (elapsed > 750) {
        isTransitioning.current = false;
      } else {
        camera.position.lerp(targetPos.current, 0.08);
        if (controlsRef.current) {
          controlsRef.current.target.lerp(targetLook.current, 0.08);
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
    setCameraPreset,
    selectedComponentId 
  } = useSimulationStore();

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(false);

  // Manual zoom in helper
  const handleZoomIn = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(0.8);
      controlsRef.current.update();
    }
  };

  // Manual zoom out helper
  const handleZoomOut = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(1.2);
      controlsRef.current.update();
    }
  };

  // Manual reset helper
  const handleReset = () => {
    setCameraPreset('isometric');
    setSelectedComponentId(null);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(9.5, 10.5, 9.5);
      controlsRef.current.update();
    }
  };

  return (
    <div className="w-full h-full relative select-none overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [9.5, 10.5, 9.5], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerMissed={() => setSelectedComponentId(null)}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#070B14']} />
        
        {/* Engineering atmosphere fog */}
        <fog attach="fog" args={['#070B14', 18, 42]} />

        {/* Studio Lighting */}
        <ambientLight intensity={0.65} color="#CFE2FF" />

        <directionalLight
          position={[7, 16, 9]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-7}
          color="#FFFFFF"
        />

        {/* Back and side rim lights */}
        <directionalLight position={[-9, 7, -9]} intensity={1.2} color="#387BFF" />
        <directionalLight position={[0, -6, 0]} intensity={0.35} color="#00E5FF" />
        <pointLight position={[0, 4, 0]} intensity={0.8} color="#00E5FF" distance={15} />

        {/* Studio Technical Floor Grid */}
        <Grid
          position={[0, -1.8 - explodedProgress * 1.8, 0]}
          args={[32, 32]}
          cellSize={0.8}
          cellThickness={0.8}
          cellColor="#101F3B"
          sectionSize={4}
          sectionThickness={1.2}
          sectionColor="#00E5FF25"
          fadeDistance={28}
          fadeStrength={1.5}
        />

        {/* 3D Chip Subsystem */}
        <group position={[0, 0, 0]}>
          <ChipPackage explodedProgress={explodedProgress} />
          <ChipComponents explodedProgress={explodedProgress} />
          <SignalPaths explodedProgress={explodedProgress} />
          <ThermalOverlay />
        </group>

        {/* Fully responsive OrbitControls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.9}
          zoomSpeed={1.2}
          panSpeed={0.8}
          minDistance={2.5}
          maxDistance={35}
          maxPolarAngle={Math.PI / 2 + 0.05}
          autoRotate={isAutoRotate}
          autoRotateSpeed={1.2}
        />

        <CameraDirector controlsRef={controlsRef} isAutoRotate={isAutoRotate} />
      </Canvas>

      {/* Floating On-Screen 3D Interaction Toolbar */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-[#0B1220]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#1E2D4A] shadow-2xl">
        {/* Rotate / Auto-Spin Toggle */}
        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            isAutoRotate
              ? 'bg-[#00E5FF] text-[#070B14] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
              : 'text-slate-300 hover:text-white hover:bg-[#101A2C]'
          }`}
          title="Toggle Auto-Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
          <span>{isAutoRotate ? 'Rotating' : 'Auto Rotate'}</span>
        </button>

        <div className="w-px h-5 bg-[#1E2D4A]" />

        {/* Zoom In Button */}
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#101A2C] transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out Button */}
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#101A2C] transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Reset Camera Button */}
        <button
          onClick={handleReset}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#101A2C] transition-colors cursor-pointer"
          title="Reset Camera Position"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#1E2D4A]" />

        {/* Quick Camera Angles */}
        <button
          onClick={() => setCameraPreset('isometric')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
            cameraPreset === 'isometric' ? 'bg-[#387BFF]/20 text-[#387BFF] font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          3D Angle
        </button>
        <button
          onClick={() => setCameraPreset('top')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
            cameraPreset === 'top' ? 'bg-[#387BFF]/20 text-[#387BFF] font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Top View
        </button>
        <button
          onClick={() => setCameraPreset('closeup')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
            cameraPreset === 'closeup' ? 'bg-[#387BFF]/20 text-[#387BFF] font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Core Focus
        </button>
      </div>

      {/* Floating User-Friendly Navigation Tip */}
      <div className="absolute top-4 left-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-[#0B1220]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#1E2D4A]/60 text-xs text-slate-400 font-mono shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
        <span>Drag to rotate • Scroll to zoom • Click any chip part to inspect</span>
      </div>
    </div>
  );
};
