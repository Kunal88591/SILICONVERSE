import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Flame, 
  Cpu, 
  Activity, 
  Gauge,
  Sliders
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';

export const BottomStatus: React.FC = () => {
  const {
    executionState,
    isAutoRunning,
    toggleAutoRun,
    stepPipelineStage,
    stepFullInstruction,
    resetExecution,
    executionSpeedMs,
    setExecutionSpeedMs,
    thermalTelemetry,
    activeFaults
  } = useSimulationStore();

  const activeCompMeta = CHIP_COMPONENTS[executionState.activeComponent];
  const hotspotMeta = CHIP_COMPONENTS[thermalTelemetry.hotspotComponentId];

  return (
    <footer className="h-12 bg-[#0B1220]/95 border-t border-[#1E2D4A] px-4 flex items-center justify-between text-xs font-mono select-none z-30 backdrop-blur-md">
      {/* Left: Execution Controls & Pipeline Stage */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={toggleAutoRun}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            isAutoRunning
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 hover:bg-[#00E5FF]/30'
          }`}
          title={isAutoRunning ? 'Pause execution' : 'Run execution'}
        >
          {isAutoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Step Stage */}
        <button
          onClick={stepPipelineStage}
          disabled={isAutoRunning}
          className="px-2 py-1 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF]/50 text-slate-300 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1"
          title="Step one pipeline stage (Fetch -> Decode -> Execute -> Memory -> Writeback)"
        >
          <SkipForward className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Stage</span>
        </button>

        {/* Step Instruction */}
        <button
          onClick={stepFullInstruction}
          disabled={isAutoRunning}
          className="px-2 py-1 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-[#387BFF]/50 text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
          title="Step full instruction retirement"
        >
          <span>Inst</span>
        </button>

        {/* Reset */}
        <button
          onClick={resetExecution}
          className="p-1 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-slate-400 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          title="Reset processor execution"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Pipeline Stage Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#101A2C] border border-[#1E2D4A]">
          <span className="text-slate-500 text-[10px]">STAGE:</span>
          <span className={`font-semibold ${
            executionState.currentStage === 'IDLE' ? 'text-slate-400' : 'text-[#00E5FF]'
          }`}>
            {executionState.currentStage}
          </span>
        </div>

        {/* Active Component */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#101A2C] border border-[#1E2D4A]">
          <span className="text-slate-500 text-[10px]">ACTIVE UNIT:</span>
          <span className="text-slate-200 font-semibold truncate max-w-[120px]">
            {activeCompMeta?.name || 'IDLE'}
          </span>
        </div>
      </div>

      {/* Center: Live Execution Log readout */}
      <div className="hidden md:flex items-center gap-2 max-w-md truncate text-[11px] text-slate-300 px-3 py-1 bg-[#070B14]/80 rounded border border-[#1E2D4A]/60">
        <span className="text-[#00E5FF]">LOG:</span>
        <span className="truncate">{executionState.lastLog}</span>
      </div>

      {/* Right: Metrics & Speed Slider */}
      <div className="flex items-center gap-3">
        {/* Speed Slider */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
          <Sliders className="w-3 h-3 text-slate-500" />
          <span className="text-slate-500">{executionSpeedMs}ms</span>
          <input
            type="range"
            min={100}
            max={1500}
            step={50}
            value={executionSpeedMs}
            onChange={(e) => setExecutionSpeedMs(Number(e.target.value))}
            className="w-16 accent-[#00E5FF] cursor-pointer"
            title="Execution speed (ms per step)"
          />
        </div>

        {/* Cycle Count */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#101A2C] border border-[#1E2D4A]">
          <span className="text-slate-500 text-[10px]">CYC:</span>
          <span className="text-slate-200 font-semibold">{executionState.cycleCount}</span>
        </div>

        {/* Inst Count */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#101A2C] border border-[#1E2D4A]">
          <span className="text-slate-500 text-[10px]">INST:</span>
          <span className="text-[#387BFF] font-semibold">{executionState.instructionCount}</span>
        </div>

        {/* Thermal Hotspot Badge */}
        <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded bg-[#101A2C] border border-[#1E2D4A]">
          <Flame className="w-3 h-3 text-amber-400" />
          <span className="text-slate-500 text-[10px]">HOTSPOT:</span>
          <span className="text-amber-400 font-semibold">{hotspotMeta?.name} ({thermalTelemetry.maxTemperature.toFixed(0)}°C)</span>
        </div>
      </div>
    </footer>
  );
};
