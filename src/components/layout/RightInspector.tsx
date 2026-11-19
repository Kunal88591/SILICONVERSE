import React from 'react';
import { 
  X, 
  Cpu, 
  Zap, 
  Flame, 
  Activity, 
  Layers, 
  ShieldAlert, 
  Eye, 
  Compass, 
  Info,
  ChevronRight,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';
import { FAULT_DEFINITIONS } from '@/data/scenarios';

// Plain-English simple descriptions and real-world analogies
const PLAIN_ENGLISH_EXPLANATIONS: Record<string, { summary: string; analogy: string }> = {
  alu: {
    summary: 'The Arithmetic Logic Unit is the mathematical calculator of the processor. It does all the addition, subtraction, multiplication, and logical true/false decisions.',
    analogy: 'Like the powerful pistons in a sports car engine doing the actual mechanical work.'
  },
  cu: {
    summary: 'The Control Unit is the manager or conductor. It reads instructions and signals all the other components when to work and what to do.',
    analogy: 'Like an air traffic controller directing planes so nothing crashes.'
  },
  registers: {
    summary: 'The Register File is the ultra-fast immediate scratchpad memory right inside the processor core. Data sits here while being actively computed.',
    analogy: 'Like having tools in your hands right at your workbench instead of walking to the storage room.'
  },
  l1i: {
    summary: 'The Level 1 Instruction Cache is a super-fast memory pocket that stores the very next instructions the CPU is about to execute.',
    analogy: 'Like keeping your recipe book open to the exact page you are cooking.'
  },
  l1d: {
    summary: 'The Level 1 Data Cache stores the actual data numbers you are working on, making memory reads sub-nanosecond fast.',
    analogy: 'Like having the ingredients already chopped and sitting on your cutting board.'
  },
  l2: {
    summary: 'The Level 2 Cache is a larger reservoir of memory sitting between the ultra-fast L1 cache and the slower main computer RAM.',
    analogy: 'Like having a refrigerator in your kitchen before needing to drive to the grocery store.'
  },
  mem_ctrl: {
    summary: 'The Memory Controller manages communication between the processor die and external DDR5 computer memory chips.',
    analogy: 'Like the shipping and receiving dock of a major warehouse.'
  },
  decoder: {
    summary: 'The Instruction Decoder translates high-level software code (like ADD or LOAD) into tiny electrical signals that hardware circuits can execute.',
    analogy: 'Like an interpreter translating foreign speech into clear instructions you understand.'
  },
  pc: {
    summary: 'The Program Counter holds the address of the next instruction to execute, making sure the processor runs code in the right order.',
    analogy: 'Like a bookmark moving line-by-line down a page of instructions.'
  },
  bus: {
    summary: 'The Bus Interconnect is the high-speed electronic highway system that carries data packets back and forth between all chip parts.',
    analogy: 'Like a multi-lane express highway connecting different districts in a city.'
  },
  clock: {
    summary: 'The Clock Distribution Unit produces billions of rhythmic electrical pulses every second (4.8 GHz) to keep every part synchronized.',
    analogy: 'Like the beat of a drummer keeping an entire orchestra playing in perfect harmony.'
  }
};

export const RightInspector: React.FC = () => {
  const {
    selectedComponentId,
    setSelectedComponentId,
    isIsolated,
    setIsIsolated,
    setCameraPreset,
    thermalTelemetry,
    activeFaults,
    injectFault,
    setActiveView
  } = useSimulationStore();

  if (!selectedComponentId) return null;

  const component = CHIP_COMPONENTS[selectedComponentId];
  if (!component) return null;

  const plain = PLAIN_ENGLISH_EXPLANATIONS[component.id] || {
    summary: component.description,
    analogy: 'Crucial microarchitectural unit.'
  };

  const isFaulty = activeFaults.some(f => f.includes(component.id));
  const temp = thermalTelemetry.componentTemperatures[component.id] || 35;

  return (
    <aside className="absolute top-20 right-6 w-96 max-h-[82vh] bg-[#0B1220]/95 backdrop-blur-md border border-[#1E2D4A] rounded-2xl shadow-2xl flex flex-col justify-between overflow-y-auto select-none z-30 transition-all">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1E2D4A] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: component.color }} />
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {component.category} UNIT
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 tracking-wide mt-1">
              {component.fullName}
            </h3>
            <span className="text-xs text-[#00E5FF] font-mono">
              Identifier: [{component.name}]
            </span>
          </div>

          <button
            onClick={() => setSelectedComponentId(null)}
            className="p-1.5 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-slate-400 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plain-English "What It Does" Box */}
        <div className="p-3.5 rounded-xl bg-[#101A2C] border border-[#00E5FF]/20 space-y-2">
          <div className="text-[11px] font-mono text-[#00E5FF] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>What This Does (Simple Terms)</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {plain.summary}
          </p>
          <div className="text-[11px] text-amber-300 font-sans italic pt-1 border-t border-[#1E2D4A]">
            💡 Real-World Analogy: {plain.analogy}
          </div>
        </div>

        {/* Live Status Gauges */}
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="bg-[#101A2C] p-2.5 rounded-lg border border-[#1E2D4A]">
            <div className="text-[10px] text-slate-400">LIVE TEMPERATURE</div>
            <div className={`text-base font-bold flex items-center gap-1.5 mt-0.5 ${
              temp >= 85 ? 'text-red-400' : 'text-amber-400'
            }`}>
              <Flame className="w-3.5 h-3.5" />
              <span>{temp.toFixed(1)}°C</span>
            </div>
          </div>

          <div className="bg-[#101A2C] p-2.5 rounded-lg border border-[#1E2D4A]">
            <div className="text-[10px] text-slate-400">POWER DRAW</div>
            <div className="text-base font-bold text-cyan-400 flex items-center gap-1.5 mt-0.5">
              <Zap className="w-3.5 h-3.5" />
              <span>{component.powerRating}</span>
            </div>
          </div>

          <div className="bg-[#101A2C] p-2.5 rounded-lg border border-[#1E2D4A]">
            <div className="text-[10px] text-slate-400">CLOCK DOMAIN</div>
            <div className="text-xs font-semibold text-slate-200 mt-1 truncate">
              {component.clockDomain}
            </div>
          </div>

          <div className="bg-[#101A2C] p-2.5 rounded-lg border border-[#1E2D4A]">
            <div className="text-[10px] text-slate-400">TRANSISTORS</div>
            <div className="text-xs font-semibold text-slate-200 mt-1">
              {component.transistorCount}
            </div>
          </div>
        </div>

        {/* Interconnected Neighbors */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Connected Parts on Chip
          </div>
          <div className="flex flex-wrap gap-1.5">
            {component.connections.map((cId) => (
              <button
                key={cId}
                onClick={() => setSelectedComponentId(cId)}
                className="px-2.5 py-1 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF]/60 text-xs font-mono text-slate-300 hover:text-[#00E5FF] transition-colors cursor-pointer"
              >
                {CHIP_COMPONENTS[cId]?.name || cId}
              </button>
            ))}
          </div>
        </div>

        {/* Contextual Actions */}
        <div className="pt-2 border-t border-[#1E2D4A] space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => setIsIsolated(!isIsolated)}
              className={`py-2 rounded-lg border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isIsolated
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]'
                  : 'bg-[#101A2C] text-slate-300 border-[#1E2D4A] hover:border-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isIsolated ? 'Show All' : 'Isolate Part'}</span>
            </button>

            <button
              onClick={() => setCameraPreset('closeup')}
              className="py-2 rounded-lg border bg-[#101A2C] text-slate-300 border-[#1E2D4A] hover:border-[#387BFF] hover:text-[#387BFF] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Focus Camera</span>
            </button>
          </div>

          {/* Quick Fault Injection if scenario available */}
          {Object.values(FAULT_DEFINITIONS).some(f => f.componentId === component.id) && (
            <button
              onClick={() => {
                const fault = Object.values(FAULT_DEFINITIONS).find(f => f.componentId === component.id);
                if (fault) {
                  injectFault(fault.id);
                  setActiveView('fault-lab');
                }
              }}
              className="w-full py-2.5 rounded-lg border bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Test Fault Injection on {component.name}</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
