// SiliconVerse - Core Semiconductor Types & Interfaces

export type ChipComponentId = 
  | 'alu'
  | 'cu'
  | 'registers'
  | 'l1i'
  | 'l1d'
  | 'l2'
  | 'mem_ctrl'
  | 'decoder'
  | 'pc'
  | 'bus'
  | 'clock';

export type ComponentCategory = 
  | 'execution'
  | 'control'
  | 'storage'
  | 'interconnect'
  | 'timing';

export type ComponentStatus = 
  | 'nominal'
  | 'active'
  | 'warning'
  | 'critical'
  | 'offline'
  | 'faulty';

export type ArchitecturalLayer = 
  | 'package'
  | 'interconnect'
  | 'functional'
  | 'die'
  | 'substrate';

export interface RegisterState {
  name: string;
  val: number;
  hex: string;
  description: string;
}

export interface ChipComponentMetadata {
  id: ChipComponentId;
  name: string;
  fullName: string;
  category: ComponentCategory;
  description: string;
  functionalRole: string;
  transistorCount: string;
  siliconArea: string;
  powerRating: string; // e.g. "18.4 W"
  clockDomain: string; // e.g. "4.8 GHz"
  layer: ArchitecturalLayer;
  position: [number, number, number]; // [x, y, z] in 3D scene
  dimensions: [number, number, number]; // [width, height, depth]
  color: string;
  emissiveColor: string;
  connections: ChipComponentId[];
  specifications: Record<string, string | number>;
  detailedExplanation: string[];
}

export type PipelineStage = 'FETCH' | 'DECODE' | 'EXECUTE' | 'MEMORY' | 'WRITEBACK' | 'IDLE';

export interface PipelineStageInfo {
  stage: PipelineStage;
  activeComponent: ChipComponentId;
  name: string;
  description: string;
  busSignal: string;
}

export type Opcode = 
  | 'LOAD'
  | 'STORE'
  | 'ADD'
  | 'SUB'
  | 'MUL'
  | 'AND'
  | 'OR'
  | 'XOR'
  | 'JMP'
  | 'BEQ'
  | 'HALT'
  | 'NOP';

export interface Instruction {
  address: number;
  raw: string;
  opcode: Opcode;
  dest?: string;
  src1?: string;
  src2?: string;
  immediate?: number;
  comment?: string;
}

export interface InstructionProgram {
  id: string;
  name: string;
  description: string;
  code: string;
}

export type FaultSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface FaultDefinition {
  id: string;
  title: string;
  componentId: ChipComponentId;
  severity: FaultSeverity;
  description: string;
  symptoms: string[];
  systemConsequences: string[];
  telemetryImpact: {
    throughputDropPct: number;
    tempIncreaseC: number;
    clockPenaltyGHz: number;
    errorRatePct: number;
  };
  recommendedActions: string[];
}

export interface ActiveFault {
  faultId: string;
  injectedAt: number;
  componentId: ChipComponentId;
  status: 'active' | 'mitigated' | 'resolved';
}

export interface ThermalTelemetry {
  ambientTemp: number; // °C
  workloadPercent: number; // 0 - 100
  coolingEfficiency: number; // 0 - 100
  fanRpm: number;
  throttlingActive: boolean;
  maxTemperature: number; // °C
  avgTemperature: number; // °C
  hotspotComponentId: ChipComponentId;
  componentTemperatures: Record<ChipComponentId, number>;
}

export interface SystemTelemetry {
  timestamp: number;
  timeLabel: string;
  cpuUtilization: number; // %
  clockFrequency: number; // GHz
  powerWatts: number;
  ipc: number; // Instructions per cycle
  memoryBandwidthGBs: number;
  instructionCount: number;
  cycleCount: number;
  tempMax: number;
  tempAvg: number;
}

export interface GuidedScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'nominal' | 'stress' | 'fault';
  targetComponent?: ChipComponentId;
  workload: number;
  cooling: number;
  faultToInject?: string;
  expectedObservations: string[];
  stepGuide: string[];
  programToLoad?: string;
}

export type ViewMode = 
  | 'overview'
  | 'explorer'
  | 'architecture'
  | 'dissection'
  | 'signal-flow'
  | 'instruction-sim'
  | 'fault-lab'
  | 'thermal'
  | 'analytics'
  | 'assistant'
  | 'scenarios'
  | 'docs';

export type CameraPreset = 'isometric' | 'top' | 'closeup' | 'exploded' | 'reset';
