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
  ExternalLink
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';
import { FAULT_DEFINITIONS } from '@/data/scenarios';

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

  const component = selectedComponentId ? CHIP_COMPONENTS[selectedComponentId] : null;

  return (
    <aside className="w-80 bg-[#0B1220]/95 border-l border-[#1E2D4A] flex flex-col justify-between overflow-y-auto select-none z-20 backdrop-blur-md">
      {component ? (
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#1E2D4A] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: component.color }} />
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {component.category} UNIT
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100 tracking-wide mt-0.5">
                {component.fullName}
              </h3>
              <p className="text-xs text-[#00E5FF] font-mono">
                Identifier: [{component.id.toUpperCase()}]
              </p>
            </div>
            <button
              onClick={() => setSelectedComponentId(null)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-[#101A2C] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-[#101A2C] p-2.5 rounded border border-[#1E2D4A]">
              <div className="text-slate-500 text-[10px]">TEMPERATURE</div>
              <div className="text-sm font-semibold flex items-center gap-1 mt-0.5 text-amber-400">
                <Flame className="w-3.5 h-3.5" />
                <span>{(thermalTelemetry.componentTemperatures[component.id] || 35).toFixed(1)}°C</span>
              </div>
            </div>

            <div className="bg-[#101A2C] p-2.5 rounded border border-[#1E2D4A]">
              <div className="text-slate-500 text-[10px]">POWER RATING</div>
              <div className="text-sm font-semibold flex items-center gap-1 mt-0.5 text-cyan-400">
                <Zap className="w-3.5 h-3.5" />
                <span>{component.powerRating}</span>
              </div>
            </div>

            <div className="bg-[#101A2C] p-2.5 rounded border border-[#1E2D4A]">
              <div className="text-slate-500 text-[10px]">CLOCK DOMAIN</div>
              <div className="text-xs font-semibold text-slate-200 mt-1 truncate">
                {component.clockDomain}
              </div>
            </div>

            <div className="bg-[#101A2C] p-2.5 rounded border border-[#1E2D4A]">
              <div className="text-slate-500 text-[10px]">TRANSISTORS</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">
                {component.transistorCount}
              </div>
            </div>
          </div>

          {/* Functional Role */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Architectural Role</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#101A2C]/60 p-2.5 rounded border border-[#1E2D4A]/60">
              {component.functionalRole}
            </p>
          </div>

          {/* Microarchitectural Specifications */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Technical Specifications
            </div>
            <div className="bg-[#101A2C] rounded border border-[#1E2D4A] divide-y divide-[#1E2D4A] text-xs font-mono">
              {Object.entries(component.specifications).map(([key, val]) => (
                <div key={key} className="px-2.5 py-1.5 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">{key}</span>
                  <span className="text-slate-200 text-right truncate max-w-[140px]">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bus Interconnect Neighbors */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Interconnected Modules
            </div>
            <div className="flex flex-wrap gap-1.5">
              {component.connections.map((cId) => (
                <button
                  key={cId}
                  onClick={() => setSelectedComponentId(cId)}
                  className="px-2 py-1 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF]/60 text-[11px] font-mono text-slate-300 hover:text-[#00E5FF] transition-colors cursor-pointer"
                >
                  {CHIP_COMPONENTS[cId]?.name || cId}
                </button>
              ))}
            </div>
          </div>

          {/* Contextual Actions */}
          <div className="space-y-2 pt-2 border-t border-[#1E2D4A]">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Contextual Actions
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => setIsIsolated(!isIsolated)}
                className={`px-2.5 py-2 rounded border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isIsolated
                    ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]'
                    : 'bg-[#101A2C] text-slate-300 border-[#1E2D4A] hover:border-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isIsolated ? 'Show All' : 'Isolate'}</span>
              </button>

              <button
                onClick={() => setCameraPreset('closeup')}
                className="px-2.5 py-2 rounded border bg-[#101A2C] text-slate-300 border-[#1E2D4A] hover:border-[#387BFF] hover:text-[#387BFF] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Focus View</span>
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
                className="w-full px-2.5 py-2 rounded border bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Inject Fault into {component.name}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* System Microarchitecture Overview when no component is selected */
        <div className="p-4 space-y-4">
          <div className="border-b border-[#1E2D4A] pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF]">
              SYSTEM ARCHITECTURE
            </span>
            <h3 className="text-base font-bold text-slate-100 tracking-wide mt-0.5">
              Quantum-X9 Microarchitecture
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select any functional block on the 3D die to inspect live telemetry and schematics.
            </p>
          </div>

          {/* Quick Component Directory */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Functional Blocks (11)
            </div>
            <div className="space-y-1">
              {Object.values(CHIP_COMPONENTS).map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedComponentId(c.id)}
                  className="px-2.5 py-1.5 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF]/50 flex items-center justify-between text-xs cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-slate-300 group-hover:text-slate-100 font-medium">
                      {c.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-[#00E5FF]">
                    {c.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cache Hierarchy Summary */}
          <div className="space-y-2 pt-2 border-t border-[#1E2D4A]">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Memory Hierarchy
            </div>
            <div className="text-xs font-mono space-y-1.5 bg-[#101A2C]/60 p-3 rounded border border-[#1E2D4A]">
              <div className="flex justify-between text-slate-300">
                <span>L1I / L1D</span>
                <span className="text-[#00E5FF]">64 KB (3-4c)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>L2 Unified</span>
                <span className="text-[#387BFF]">1024 KB (12c)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>DDR5 DRAM</span>
                <span className="text-amber-400">102.4 GB/s (140c)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
