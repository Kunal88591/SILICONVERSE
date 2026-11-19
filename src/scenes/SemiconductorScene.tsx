import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { ChipPackage } from './ChipPackage';
import { ChipComponents } from './ChipComponents';
import { SignalPaths } from './SignalPaths';
import { ThermalOverlay } from './ThermalOverlay';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';

// Camera controller component that smoothly glides to presets or selected component
const CameraDirector: React.FC = () => {
  const { cameraPreset, selectedComponentId } = useSimulationStore();
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(10, 11, 10));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (selectedComponentId && CHIP_COMPONENTS[selectedComponentId]) {
      const meta = CHIP_COMPONENTS[selectedComponentId];
      targetLookAt.current.set(meta.position[0], meta.position[1], meta.position[2]);
      targetPos.current.set(meta.position[0] + 3.2, meta.position[1] + 4.0, meta.position[2] + 3.5);
      return;
    }

    switch (cameraPreset) {
      case 'top':
        targetPos.current.set(0, 14, 0.001);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'closeup':
        targetPos.current.set(0, 3.8, 4.2);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'exploded':
        targetPos.current.set(12, 13, 12);
        targetLookAt.current.set(0, 1.2, 0);
        break;
      case 'isometric':
      case 'reset':
      default:
        targetPos.current.set(9.5, 10.5, 9.5);
        targetLookAt.current.set(0, 0, 0);
        break;
    }
  }, [cameraPreset, selectedComponentId]);

  useFrame((_, delta) => {
    camera.position.lerp(targetPos.current, Math.min(1, delta * 3.5));
  });

  return null;
};

export const SemiconductorScene: React.FC = () => {
  const { explodedProgress, setSelectedComponentId } = useSimulationStore();

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{ position: [9.5, 10.5, 9.5], fov: 42 }}
        className="w-full h-full"
        onPointerMissed={() => setSelectedComponentId(null)}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#070B14']} />
        
        {/* Soft engineering fog for depth */}
        <fog attach="fog" args={['#070B14', 15, 38]} />

        {/* Ambient lighting */}
        <ambientLight intensity={0.55} color="#B0CDFF" />

        {/* Main overhead key light */}
        <directionalLight
          position={[6, 14, 8]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={35}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          color="#F0F8FF"
        />

        {/* Electric Blue Rim Backlight */}
        <directionalLight position={[-8, 6, -8]} intensity={1.1} color="#387BFF" />

        {/* Cyan Fill Light */}
        <directionalLight position={[0, -5, 0]} intensity={0.3} color="#00E5FF" />

        {/* Studio Technical Floor Grid */}
        <Grid
          position={[0, -1.8 - explodedProgress * 1.8, 0]}
          args={[30, 30]}
          cellSize={0.8}
          cellThickness={0.8}
          cellColor="#101F3B"
          sectionSize={4}
          sectionThickness={1.2}
          sectionColor="#00E5FF22"
          fadeDistance={25}
          fadeStrength={1.5}
        />

        {/* 3D Chip Subsystem Groups */}
        <group position={[0, 0, 0]}>
          <ChipPackage explodedProgress={explodedProgress} />
          <ChipComponents explodedProgress={explodedProgress} />
          <SignalPaths explodedProgress={explodedProgress} />
          <ThermalOverlay />
        </group>

        {/* Interactive Camera Orbit Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={3.5}
          maxDistance={28}
          maxPolarAngle={Math.PI / 2 + 0.05} // Prevent camera going completely underneath
        />

        {/* Camera Preset Transition Director */}
        <CameraDirector />
      </Canvas>
    </div>
  );
};
