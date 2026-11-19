import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';
import { ChipComponentId } from '@/types';

interface SignalPathsProps {
  explodedProgress: number;
}

interface PulsePacket {
  progress: number;
  speed: number;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  color: string;
}

export const SignalPaths: React.FC<SignalPathsProps> = ({ explodedProgress }) => {
  const { layerVisibility, executionState, activeFaults } = useSimulationStore();

  const isBusFaulty = activeFaults.includes('mem_bus_fault');
  const interconnectY = 0.35 + explodedProgress * 2.2;

  // Interconnect predefined bus links between components
  const busLinks = useMemo(() => {
    const pairs: [ChipComponentId, ChipComponentId][] = [
      ['pc', 'l1i'],
      ['l1i', 'decoder'],
      ['decoder', 'cu'],
      ['decoder', 'registers'],
      ['cu', 'alu'],
      ['registers', 'alu'],
      ['alu', 'l1d'],
      ['l1d', 'registers'],
      ['l1d', 'l2'],
      ['l1i', 'l2'],
      ['l2', 'mem_ctrl'],
      ['cu', 'clock']
    ];

    return pairs.map(([src, dst]) => {
      const srcMeta = CHIP_COMPONENTS[src];
      const dstMeta = CHIP_COMPONENTS[dst];
      const start = new THREE.Vector3(srcMeta.position[0], 0, srcMeta.position[2]);
      const end = new THREE.Vector3(dstMeta.position[0], 0, dstMeta.position[2]);
      return { src, dst, start, end };
    });
  }, []);

  // Traveling signal pulse packets
  const pulsesRef = useRef<PulsePacket[]>([
    { progress: 0.1, speed: 0.015, startPos: new THREE.Vector3(-2.8, 0, 1.3), endPos: new THREE.Vector3(-2.8, 0, -0.6), color: '#00E5FF' },
    { progress: 0.4, speed: 0.02, startPos: new THREE.Vector3(-2.8, 0, -0.6), endPos: new THREE.Vector3(-1.4, 0, 0), color: '#387BFF' },
    { progress: 0.7, speed: 0.018, startPos: new THREE.Vector3(0, 0, 0), endPos: new THREE.Vector3(-1.4, 0, 1.3), color: '#8B5CF6' },
    { progress: 0.2, speed: 0.012, startPos: new THREE.Vector3(0, 0, -2.4), endPos: new THREE.Vector3(0, 0, -3.6), color: '#D97706' }
  ]);

  const packetMeshesRef = useRef<THREE.Mesh[]>([]);

  useFrame((_, delta) => {
    if (isBusFaulty) return; // Stalled bus freeze

    pulsesRef.current.forEach((p, idx) => {
      p.progress += p.speed * (delta * 60);
      if (p.progress >= 1.0) {
        p.progress = 0.0;
        // Optionally switch routes if active pipeline has specific path
        if (executionState.activePath) {
          const [s, d] = executionState.activePath;
          const sMeta = CHIP_COMPONENTS[s];
          const dMeta = CHIP_COMPONENTS[d];
          if (sMeta && dMeta) {
            p.startPos.set(sMeta.position[0], 0, sMeta.position[2]);
            p.endPos.set(dMeta.position[0], 0, dMeta.position[2]);
          }
        }
      }

      const mesh = packetMeshesRef.current[idx];
      if (mesh) {
        mesh.position.lerpVectors(p.startPos, p.endPos, p.progress);
      }
    });
  });

  if (!layerVisibility.interconnect) return null;

  return (
    <group position={[0, interconnectY, 0]}>
      {/* Central Crossbar Bus Highway Grid Plate */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[6.2, 0.04, 6.2]} />
        <meshStandardMaterial
          color="#031525"
          roughness={0.25}
          metalness={0.8}
          transparent={true}
          opacity={0.35}
        />
      </mesh>

      {/* Bus Wiring Traces */}
      {busLinks.map((link, idx) => {
        const isCurrentActivePath =
          executionState.activePath &&
          ((executionState.activePath[0] === link.src && executionState.activePath[1] === link.dst) ||
            (executionState.activePath[0] === link.dst && executionState.activePath[1] === link.src));

        const mid = new THREE.Vector3().addVectors(link.start, link.end).multiplyScalar(0.5);
        const distance = link.start.distanceTo(link.end);

        // Calculate rotation towards target
        const dir = new THREE.Vector3().subVectors(link.end, link.start).normalize();
        const rotY = Math.atan2(dir.x, dir.z);

        const busColor = isBusFaulty
          ? '#EF4444'
          : (isCurrentActivePath ? '#00E5FF' : '#1E3A8A');

        return (
          <group key={`bus-link-${idx}`}>
            {/* Bus Copper/Gold Channel Conduit */}
            <mesh
              position={[mid.x, 0.015, mid.z]}
              rotation={[-Math.PI / 2, 0, -rotY + Math.PI / 2]}
            >
              <planeGeometry args={[distance, 0.12]} />
              <meshBasicMaterial
                color={busColor}
                side={THREE.DoubleSide}
                transparent={true}
                opacity={isCurrentActivePath ? 0.95 : 0.45}
              />
            </mesh>

            {/* Glowing Center Core Trace */}
            <mesh
              position={[mid.x, 0.02, mid.z]}
              rotation={[-Math.PI / 2, 0, -rotY + Math.PI / 2]}
            >
              <planeGeometry args={[distance, 0.04]} />
              <meshBasicMaterial
                color={isBusFaulty ? '#EF4444' : (isCurrentActivePath ? '#FFFFFF' : '#387BFF')}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}

      {/* Traveling Data Pulse Packets */}
      {pulsesRef.current.map((pulse, idx) => (
        <mesh
          key={`pulse-pkt-${idx}`}
          ref={(el) => {
            if (el) packetMeshesRef.current[idx] = el;
          }}
          position={[pulse.startPos.x, 0.05, pulse.startPos.z]}
        >
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshBasicMaterial
            color={isBusFaulty ? '#EF4444' : pulse.color}
          />
        </mesh>
      ))}
    </group>
  );
};
