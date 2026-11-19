import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';

export const ThermalOverlay: React.FC = () => {
  const { activeView, thermalTelemetry } = useSimulationStore();
  const auraRef = useRef<THREE.Mesh>(null);

  const isThermalActive = activeView === 'thermal' || thermalTelemetry.throttlingActive;
  const hotspotMeta = CHIP_COMPONENTS[thermalTelemetry.hotspotComponentId];

  useFrame((state) => {
    if (!auraRef.current) return;
    const time = state.clock.getElapsedTime();
    // Gentle thermal shimmering
    const scale = 1.0 + Math.sin(time * 3) * 0.05;
    auraRef.current.scale.set(scale, 1, scale);
  });

  if (!isThermalActive || !hotspotMeta) return null;

  const [hx, , hz] = hotspotMeta.position;
  const isCritical = thermalTelemetry.maxTemperature >= 90;

  return (
    <group position={[hx, 0.45, hz]}>
      {/* Concentrated Hotspot Thermal Halo */}
      <mesh ref={auraRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, hotspotMeta.dimensions[0] * 0.8, 32]} />
        <meshBasicMaterial
          color={isCritical ? '#EF4444' : '#F59E0B'}
          transparent={true}
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center Thermal Core Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.05, 0.25, 24]} />
        <meshBasicMaterial
          color={isCritical ? '#FF0055' : '#FFD600'}
          transparent={true}
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
