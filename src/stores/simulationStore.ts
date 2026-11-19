import { create } from 'zustand';
import { 
  ChipComponentId, 
  ViewMode, 
  CameraPreset, 
  ThermalTelemetry, 
  SystemTelemetry, 
  GuidedScenario 
} from '@/types';
import { InstructionEngine, ExecutionState } from '@/engine/instructionEngine';
import { ThermalEngine } from '@/engine/thermalEngine';
import { SAMPLE_PROGRAMS, GUIDED_SCENARIOS, FAULT_DEFINITIONS } from '@/data/scenarios';

export interface AssistantMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    action: () => void;
  };
}

interface SimulationState {
  // Navigation & View Mode
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;

  // 3D Scene Interactions
  selectedComponentId: ChipComponentId | null;
  hoveredComponentId: ChipComponentId | null;
  setSelectedComponentId: (id: ChipComponentId | null) => void;
  setHoveredComponentId: (id: ChipComponentId | null) => void;
  isIsolated: boolean;
  setIsIsolated: (isolated: boolean) => void;

  // Layer Dissection & Exploded View
  explodedProgress: number; // 0.0 to 1.0
  setExplodedProgress: (val: number) => void;
  layerVisibility: {
    package: boolean;
    substrate: boolean;
    die: boolean;
    functional: boolean;
    interconnect: boolean;
  };
  toggleLayerVisibility: (layer: keyof SimulationState['layerVisibility']) => void;
  resetLayers: () => void;

  // Camera Presets
  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;

  // Instruction Execution Engine
  assemblyCode: string;
  setAssemblyCode: (code: string) => void;
  executionState: ExecutionState;
  isAutoRunning: boolean;
  executionSpeedMs: number;
  setExecutionSpeedMs: (ms: number) => void;
  stepPipelineStage: () => void;
  stepFullInstruction: () => void;
  toggleAutoRun: () => void;
  resetExecution: () => void;
  loadProgram: (key: string) => void;

  // Fault Injection Lab
  activeFaults: string[];
  injectFault: (faultId: string) => void;
  removeFault: (faultId: string) => void;
  clearAllFaults: () => void;

  // Thermal Simulation
  workloadPercent: number;
  setWorkloadPercent: (val: number) => void;
  coolingEfficiency: number;
  setCoolingEfficiency: (val: number) => void;
  thermalTelemetry: ThermalTelemetry;
  telemetryHistory: SystemTelemetry[];

  // Guided Scenarios / Demo Mode
  activeScenarioId: string | null;
  loadScenario: (scenarioId: string) => void;
  resetScenario: () => void;

  // AI Engineering Assistant
  assistantMessages: AssistantMessage[];
  sendAssistantMessage: (text: string) => void;
  clearAssistantChat: () => void;

  // Ticker updater for continuous simulation telemetry
  tickTelemetry: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => {
  const initialProgramKey = 'fibonacci';
  const initialCode = SAMPLE_PROGRAMS[initialProgramKey].code;
  const initialInstructions = InstructionEngine.parseAssembly(initialCode);
  const initialExec = InstructionEngine.createInitialState(initialInstructions);
  const initialThermal = ThermalEngine.calculateThermalState(45, 85, []);
  
  // Create initial 10 telemetry points for nice chart baseline
  const now = Date.now();
  const initialTelemetryHistory: SystemTelemetry[] = [];
  for (let i = 9; i >= 0; i--) {
    const pt = ThermalEngine.generateTelemetryPoint(
      now - (i * 1500),
      initialThermal,
      [],
      Math.max(0, 100 - i * 10),
      Math.max(0, 40 - i * 4)
    );
    initialTelemetryHistory.push(pt);
  }

  return {
    activeView: 'overview',
    setActiveView: (view) => set({ activeView: view }),

    selectedComponentId: null,
    hoveredComponentId: null,
    setSelectedComponentId: (id) => set({ selectedComponentId: id }),
    setHoveredComponentId: (id) => set({ hoveredComponentId: id }),
    isIsolated: false,
    setIsIsolated: (isolated) => set({ isIsolated: isolated }),

    explodedProgress: 0,
    setExplodedProgress: (val) => set({ explodedProgress: Math.max(0, Math.min(1, val)) }),
    layerVisibility: {
      package: true,
      substrate: true,
      die: true,
      functional: true,
      interconnect: true
    },
    toggleLayerVisibility: (layer) =>
      set((state) => ({
        layerVisibility: {
          ...state.layerVisibility,
          [layer]: !state.layerVisibility[layer]
        }
      })),
    resetLayers: () =>
      set({
        explodedProgress: 0,
        layerVisibility: {
          package: true,
          substrate: true,
          die: true,
          functional: true,
          interconnect: true
        }
      }),

    cameraPreset: 'isometric',
    setCameraPreset: (preset) => set({ cameraPreset: preset }),

    assemblyCode: initialCode,
    setAssemblyCode: (code) => {
      const parsed = InstructionEngine.parseAssembly(code);
      const newState = InstructionEngine.createInitialState(parsed);
      set({ assemblyCode: code, executionState: newState, isAutoRunning: false });
    },
    executionState: initialExec,
    isAutoRunning: false,
    executionSpeedMs: 500,
    setExecutionSpeedMs: (ms) => set({ executionSpeedMs: ms }),

    stepPipelineStage: () => {
      const { executionState, activeFaults } = get();
      const hasAlu = activeFaults.includes('alu_overflow_fault');
      const hasCache = activeFaults.includes('cache_coherence_fault');
      const hasBus = activeFaults.includes('mem_bus_fault');

      const next = InstructionEngine.step(executionState, hasAlu, hasCache, hasBus);
      set({ executionState: next });
    },

    stepFullInstruction: () => {
      const { executionState, activeFaults } = get();
      const hasAlu = activeFaults.includes('alu_overflow_fault');
      const hasCache = activeFaults.includes('cache_coherence_fault');
      const hasBus = activeFaults.includes('mem_bus_fault');

      const next = InstructionEngine.completeInstruction(executionState, hasAlu, hasCache, hasBus);
      set({ executionState: next });
    },

    toggleAutoRun: () => set((state) => ({ isAutoRunning: !state.isAutoRunning })),

    resetExecution: () => {
      const { assemblyCode } = get();
      const parsed = InstructionEngine.parseAssembly(assemblyCode);
      const fresh = InstructionEngine.createInitialState(parsed);
      set({ executionState: fresh, isAutoRunning: false });
    },

    loadProgram: (key: string) => {
      const prog = SAMPLE_PROGRAMS[key];
      if (prog) {
        const parsed = InstructionEngine.parseAssembly(prog.code);
        const fresh = InstructionEngine.createInitialState(parsed);
        set({
          assemblyCode: prog.code,
          executionState: fresh,
          isAutoRunning: false
        });
      }
    },

    // Fault injection
    activeFaults: [],
    injectFault: (faultId: string) => {
      set((state) => {
        if (state.activeFaults.includes(faultId)) return state;
        const newFaults = [...state.activeFaults, faultId];
        const faultDef = FAULT_DEFINITIONS[faultId];
        const nextThermal = ThermalEngine.calculateThermalState(
          state.workloadPercent,
          state.coolingEfficiency,
          newFaults
        );
        return {
          activeFaults: newFaults,
          selectedComponentId: faultDef ? faultDef.componentId : state.selectedComponentId,
          thermalTelemetry: nextThermal
        };
      });
    },
    removeFault: (faultId: string) => {
      set((state) => {
        const newFaults = state.activeFaults.filter((f) => f !== faultId);
        const nextThermal = ThermalEngine.calculateThermalState(
          state.workloadPercent,
          state.coolingEfficiency,
          newFaults
        );
        return {
          activeFaults: newFaults,
          thermalTelemetry: nextThermal
        };
      });
    },
    clearAllFaults: () => {
      set((state) => ({
        activeFaults: [],
        thermalTelemetry: ThermalEngine.calculateThermalState(
          state.workloadPercent,
          state.coolingEfficiency,
          []
        )
      }));
    },

    // Thermal
    workloadPercent: 45,
    setWorkloadPercent: (val) => {
      set((state) => ({
        workloadPercent: val,
        thermalTelemetry: ThermalEngine.calculateThermalState(val, state.coolingEfficiency, state.activeFaults)
      }));
    },
    coolingEfficiency: 85,
    setCoolingEfficiency: (val) => {
      set((state) => ({
        coolingEfficiency: val,
        thermalTelemetry: ThermalEngine.calculateThermalState(state.workloadPercent, val, state.activeFaults)
      }));
    },
    thermalTelemetry: initialThermal,
    telemetryHistory: initialTelemetryHistory,

    // Guided Scenarios
    activeScenarioId: 'scenario_nominal',
    loadScenario: (scenarioId: string) => {
      const scenario = GUIDED_SCENARIOS.find((s) => s.id === scenarioId);
      if (!scenario) return;

      const faults = scenario.faultToInject ? [scenario.faultToInject] : [];
      const nextThermal = ThermalEngine.calculateThermalState(
        scenario.workload,
        scenario.cooling,
        faults
      );

      if (scenario.programToLoad && SAMPLE_PROGRAMS[scenario.programToLoad]) {
        get().loadProgram(scenario.programToLoad);
      }

      set({
        activeScenarioId: scenario.id,
        workloadPercent: scenario.workload,
        coolingEfficiency: scenario.cooling,
        activeFaults: faults,
        selectedComponentId: scenario.targetComponent || null,
        thermalTelemetry: nextThermal
      });
    },
    resetScenario: () => {
      get().loadScenario('scenario_nominal');
    },

    // AI Assistant
    assistantMessages: [
      {
        id: 'msg-init-1',
        sender: 'assistant',
        text: 'Welcome to the SiliconVerse Semiconductor Engineering Console. I am your microarchitectural telemetry and diagnostics assistant. Select any component on the 3D die, or ask me about instruction pipelining, fault injection, or thermal throttling.',
        timestamp: '10:00:00 AM'
      }
    ],
    sendAssistantMessage: (text: string) => {
      const timeStr = new Date().toLocaleTimeString();
      const userMsg: AssistantMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text,
        timestamp: timeStr
      };

      const { selectedComponentId, activeFaults, thermalTelemetry } = get();

      // Rule-based architectural response generation
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('alu') || (selectedComponentId === 'alu' && (lower.includes('what') || lower.includes('explain') || lower.includes('do')))) {
        reply = 'The Arithmetic Logic Unit (ALU) is the core computational block executing 64-bit integer addition, subtraction, multiplication, and logical boolean vectors. In our simulated chip, it features a 3-stage superscalar integer pipeline with direct forwarding bypasses. ' +
          (activeFaults.includes('alu_overflow_fault') ? '⚠️ WARNING: An active arithmetic logic fault is currently injected in the ALU, inducing integer parity bit corruption.' : 'Currently operating in nominal status at ~4.8 GHz.');
      } else if (lower.includes('cache') || lower.includes('l1') || lower.includes('l2')) {
        reply = 'The cache hierarchy features split L1 caches (64KB L1 Instruction + 64KB L1 Data with 3-4 cycle latency) and a unified 1MB Level 2 cache (12 cycles latency). ' +
          (activeFaults.includes('cache_coherence_fault') ? '⚠️ NOTICE: L1 Data Cache tag corruption is currently active, forcing cache miss rates above 45%.' : 'Cache coherency is governed by hardware MOESI directory snooping over the internal crossbar.');
      } else if (lower.includes('fetch') || lower.includes('pipeline') || lower.includes('cycle') || lower.includes('decode')) {
        reply = 'The CPU implements a classic 5-stage pipeline: FETCH (PC reads instruction from L1I) → DECODE (Opcode translated into micro-ops and register pointers identified) → EXECUTE (ALU or address generation) → MEMORY (L1 Data Cache read/write) → WRITEBACK (retirement into Register File). Check the Signal Flow Lab to step through each cycle visually.';
      } else if (lower.includes('thermal') || lower.includes('hot') || lower.includes('temp') || lower.includes('heat')) {
        reply = `Current peak junction temperature is ${thermalTelemetry.maxTemperature}°C at the ${thermalTelemetry.hotspotComponentId.toUpperCase()} hotspot. Dynamic thermal throttling triggers at 92°C to prevent electromigration breakdown. ${thermalTelemetry.throttlingActive ? '⚠️ PROCHOT# assertion is currently ACTIVE, throttling core frequency!' : 'Thermal headroom remains within safe operating limits.'}`;
      } else if (lower.includes('fault') || lower.includes('failure') || lower.includes('error')) {
        if (activeFaults.length === 0) {
          reply = 'No active hardware faults are currently injected into the silicon die. You can inject faults such as ALU malfunction, Cache corruption, or Clock PLL phase jitter in the Fault Injection Lab.';
        } else {
          reply = `There are currently ${activeFaults.length} active fault scenario(s) injected: [${activeFaults.join(', ')}]. These are actively impacting instruction throughput and thermal dissipation. Check the Fault Injection Lab for automated mitigation procedures.`;
        }
      } else if (selectedComponentId) {
        reply = `Component [${selectedComponentId.toUpperCase()}] is selected. It resides on the ${get().selectedComponentId === 'bus' ? 'interconnect' : 'silicon die functional'} layer. Current temperature: ${thermalTelemetry.componentTemperatures[selectedComponentId] || 35}°C. Ask me specific questions about its role in the pipeline or performance characteristics!`;
      } else {
        reply = 'SiliconVerse is configured as an interactive digital twin. You can click any component on the 3D chip package to inspect its microarchitectural specifications, or launch ready-made demonstration scenarios from the top bar.';
      }

      const assistantMsg: AssistantMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString()
      };

      set((state) => ({
        assistantMessages: [...state.assistantMessages, userMsg, assistantMsg]
      }));
    },
    clearAssistantChat: () => {
      set({
        assistantMessages: [
          {
            id: 'msg-reset',
            sender: 'assistant',
            text: 'Assistant conversation cleared. Select a component or ask an architectural query to begin.',
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      });
    },

    tickTelemetry: () => {
      const state = get();
      const now = Date.now();
      const newPt = ThermalEngine.generateTelemetryPoint(
        now,
        state.thermalTelemetry,
        state.activeFaults,
        state.executionState.cycleCount,
        state.executionState.instructionCount
      );

      // Keep rolling 25 points
      const updatedHistory = [...state.telemetryHistory.slice(-24), newPt];
      set({ telemetryHistory: updatedHistory });
    }
  };
});
