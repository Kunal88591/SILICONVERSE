import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';
import { ChipComponentId } from '@/types';

interface ChipComponentsProps {
  explodedProgress: number;
}

export const ChipComponents: React.FC<ChipComponentsProps> = ({ explodedProgress }) => {
  const {
    selectedComponentId,
    hoveredComponentId,
    setSelectedComponentId,
    setHoveredComponentId,
    isIsolated,
    layerVisibility,
    activeView,
    activeFaults,
    thermalTelemetry,
    executionState
  } = useSimulationStore();

  const isThermalMode = activeView === 'thermal';
  const groupRef = useRef<THREE.Group>(null);

  // Compute thermal color mapping (Blue 24°C -> Cyan 45°C -> Green 60°C -> Yellow 80°C -> Red 100°C)
  const getThermalColor = (temp: number): string => {
    if (temp <= 30) return '#1E3A8A'; // Deep blue
    if (temp <= 45) return '#06B6D4'; // Cyan
    if (temp <= 60) return '#10B981'; // Emerald Green
    if (temp <= 75) return '#EAB308'; // Amber Yellow
    if (temp <= 90) return '#F97316'; // Orange
    return '#EF4444'; // Critical Red
  };

  // Functional layer vertical lift in exploded view
  const functionalY = explodedProgress * 1.5;

  return (
    <group ref={groupRef} position={[0, functionalY, 0]}>
      {layerVisibility.functional &&
        (Object.keys(CHIP_COMPONENTS) as ChipComponentId[]).map((id) => {
          // Bus is rendered separately on interconnect layer if needed
          if (id === 'bus') return null;

          const meta = CHIP_COMPONENTS[id];
          const isSelected = selectedComponentId === id;
          const isHovered = hoveredComponentId === id;
          const isFaulty = activeFaults.some(f => f.includes(id));
          const isActiveInPipeline = executionState.activeComponent === id;
          const temp = thermalTelemetry.componentTemperatures[id] || 35;

          // Determine opacity under isolation
          let opacity = 1.0;
          if (isIsolated && selectedComponentId && selectedComponentId !== id) {
            opacity = 0.15;
          }

          // Base block color
          let baseColor = isThermalMode ? getThermalColor(temp) : meta.color;
          let emissive = '#000000';
          let emissiveIntensity = 0.0;

          if (isFaulty) {
            baseColor = '#EF4444';
            emissive = '#EF4444';
            emissiveIntensity = 0.85;
          } else if (isSelected) {
            emissive = '#00E5FF';
            emissiveIntensity = 0.75;
          } else if (isActiveInPipeline) {
            emissive = '#387BFF';
            emissiveIntensity = 0.55;
          } else if (isHovered) {
            emissive = meta.color;
            emissiveIntensity = 0.4;
          }

          const [x, y, z] = meta.position;
          const [w, h, d] = meta.dimensions;

          return (
            <group
              key={id}
              position={[x, y, z]}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedComponentId(isSelected ? null : id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredComponentId(id);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredComponentId(null);
                document.body.style.cursor = 'default';
              }}
            >
              {/* Main 3D Silicon Functional Block */}
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[w, h, d]} />
                <meshStandardMaterial
                  color={baseColor}
                  emissive={emissive}
                  emissiveIntensity={emissiveIntensity}
                  roughness={isThermalMode ? 0.35 : 0.25}
                  metalness={0.7}
                  transparent={opacity < 1}
                  opacity={opacity}
                />
              </mesh>

              {/* Micro-Circuit Surface Grid Plating (adds high-tech microelectronics texture) */}
              <mesh position={[0, h / 2 + 0.015, 0]}>
                <boxGeometry args={[w * 0.94, 0.01, d * 0.94]} />
                <meshStandardMaterial
                  color="#0F172A"
                  roughness={0.15}
                  metalness={0.9}
                  wireframe={true}
                  transparent={opacity < 1}
                  opacity={opacity * 0.75}
                />
              </mesh>

              {/* Sub-circuit internal logic banks (procedural stepped chiplets) */}
              <mesh position={[0, h / 2 + 0.03, 0]}>
                <boxGeometry args={[w * 0.82, 0.02, d * 0.82]} />
                <meshStandardMaterial
                  color={isFaulty ? '#DC2626' : (isSelected ? '#00E5FF' : baseColor)}
                  roughness={0.4}
                  metalness={0.8}
                  transparent={opacity < 1}
                  opacity={opacity * 0.6}
                />
              </mesh>

              {/* Selection Bounding Wireframe Cage */}
              {(isSelected || isHovered || isFaulty) && (
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[w + 0.08, h + 0.08, d + 0.08]} />
                  <meshBasicMaterial
                    color={isFaulty ? '#EF4444' : (isSelected ? '#00E5FF' : '#387BFF')}
                    wireframe={true}
                  />
                </mesh>
              )}

              {/* Pulsing Core Ring for Active Execution Stage */}
              {isActiveInPipeline && (
                <mesh position={[0, h / 2 + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[w * 0.3, w * 0.36, 24]} />
                  <meshBasicMaterial
                    color="#00E5FF"
                    side={THREE.DoubleSide}
                    transparent={true}
                    opacity={0.85}
                  />
                </mesh>
              )}

              {/* 3D Component Identifier Label */}
              <Text
                position={[0, h / 2 + 0.12, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={w > 2 ? 0.22 : 0.18}
                color={isSelected ? '#00E5FF' : (isFaulty ? '#FCA5A5' : '#FFFFFF')}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.025}
                outlineColor="#050811"
              >
                {meta.name}
              </Text>

              {/* Live Temperature or Fault Indicator Badge */}
              <Text
                position={[0, h / 2 + 0.12, d * 0.38]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.13}
                color={isFaulty ? '#EF4444' : (isThermalMode ? (temp > 80 ? '#EF4444' : '#FBBF24') : '#94A3B8')}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#050811"
              >
                {isFaulty ? '⚠️ FAULT' : `${temp.toFixed(1)}°C`}
              </Text>
            </group>
          );
        })}
    </group>
  );
};
