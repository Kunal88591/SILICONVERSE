import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '@/stores/simulationStore';

interface ChipPackageProps {
  explodedProgress: number; // 0.0 to 1.0
}

export const ChipPackage: React.FC<ChipPackageProps> = ({ explodedProgress }) => {
  const { layerVisibility } = useSimulationStore();

  // Procedural BGA Solder Balls (grid on bottom of substrate)
  const bgaBalls = useMemo(() => {
    const balls: [number, number, number][] = [];
    const count = 12;
    const spacing = 0.65;
    const offset = ((count - 1) * spacing) / 2;

    for (let x = 0; x < count; x++) {
      for (let z = 0; z < count; z++) {
        // Exclude central area directly under die
        const posX = x * spacing - offset;
        const posZ = z * spacing - offset;
        if (Math.abs(posX) > 1.3 || Math.abs(posZ) > 1.3) {
          balls.push([posX, -0.42, posZ]);
        }
      }
    }
    return balls;
  }, []);

  // Gold bond pads along substrate periphery
  const bondPads = useMemo(() => {
    const pads: [number, number, number, number][] = [];
    const step = 0.55;
    const padCount = 14;
    const span = ((padCount - 1) * step) / 2;

    for (let i = 0; i < padCount; i++) {
      const p = i * step - span;
      pads.push([p, 0.01, -3.9, 0]);
      pads.push([p, 0.01, 3.9, 0]);
      pads.push([-3.9, 0.01, p, Math.PI / 2]);
      pads.push([3.9, 0.01, p, Math.PI / 2]);
    }
    return pads;
  }, []);

  // Compute layer Y offsets based on explodedProgress
  const substrateY = -explodedProgress * 1.8;
  const dieBaseY = 0;
  // Lid sits high enough or lifts high so it doesn't block the die view
  const lidY = 1.2 + explodedProgress * 3.5;

  return (
    <group>
      {/* 1. SUBSTRATE LAYER (Organic PCB carrier with BGA balls) */}
      {layerVisibility.substrate && (
        <group position={[0, substrateY, 0]}>
          {/* Main PCB substrate plate */}
          <mesh position={[0, -0.2, 0]} receiveShadow castShadow>
            <boxGeometry args={[8.8, 0.35, 8.8]} />
            <meshStandardMaterial
              color="#0A2F1D"
              roughness={0.4}
              metalness={0.25}
            />
          </mesh>

          {/* Substrate Chamfered Bevel Edge */}
          <mesh position={[0, -0.01, 0]}>
            <boxGeometry args={[8.6, 0.04, 8.6]} />
            <meshStandardMaterial
              color="#061E13"
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>

          {/* Gold Pin 1 Marker */}
          <mesh position={[-3.9, 0.03, -3.9]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.3, 3]} />
            <meshStandardMaterial
              color="#F59E0B"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Perimeter Gold Contact Pads */}
          {bondPads.map((pad, idx) => (
            <mesh key={`pad-${idx}`} position={[pad[0], pad[1], pad[2]]} rotation={[0, pad[3], 0]}>
              <boxGeometry args={[0.35, 0.02, 0.18]} />
              <meshStandardMaterial
                color="#FBBF24"
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
          ))}

          {/* Solder Balls (Ball Grid Array - BGA) */}
          {bgaBalls.map((pos, idx) => (
            <mesh key={`bga-${idx}`} position={pos} castShadow>
              <sphereGeometry args={[0.13, 10, 10]} />
              <meshStandardMaterial
                color="#CBD5E1"
                metalness={0.92}
                roughness={0.18}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* 2. SILICON DIE BASE LAYER (Substrate Interposer & Monolithic Silicon Base) */}
      {layerVisibility.die && (
        <group position={[0, dieBaseY, 0]}>
          {/* Silicon Interposer Carrier */}
          <mesh position={[0, 0.02, 0]} receiveShadow>
            <boxGeometry args={[7.2, 0.08, 7.2]} />
            <meshStandardMaterial
              color="#0B132B"
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Highly Reflective Silicon Wafer Die Surface */}
          <mesh position={[0, 0.07, 0]} receiveShadow>
            <boxGeometry args={[6.8, 0.05, 6.8]} />
            <meshStandardMaterial
              color="#0F172A"
              roughness={0.12}
              metalness={0.88}
            />
          </mesh>

          {/* Perimeter Ground Guard Ring */}
          <mesh position={[0, 0.09, 0]}>
            <boxGeometry args={[6.6, 0.02, 6.6]} />
            <meshStandardMaterial
              color="#D97706"
              metalness={0.95}
              roughness={0.2}
              wireframe={true}
            />
          </mesh>
        </group>
      )}

      {/* 3. METALLIC HEAT SPREADER (IHS Package Lid - Semi-transparent or elevated so die is visible) */}
      {layerVisibility.package && (
        <group position={[0, lidY, 0]}>
          {/* Semi-transparent metallic heat spreader with window so internal components are visible */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[8.0, 0.35, 8.0]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.9}
              roughness={0.25}
              transparent={true}
              opacity={explodedProgress > 0.05 ? 0.85 : 0.25}
            />
          </mesh>

          {/* Outer Package Flange Lip */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[8.4, 0.06, 8.4]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.9}
              roughness={0.3}
              transparent={true}
              opacity={explodedProgress > 0.05 ? 0.9 : 0.35}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
