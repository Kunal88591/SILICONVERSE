import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Flame, 
  Sliders,
  Sparkles
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
    thermalTelemetry
  } = useSimulationStore();

  const activeCompMeta = CHIP_COMPONENTS[executionState.activeComponent];

  return (
    <footer className="h-14 bg-[#0B1220]/95 border-t border-[#1E2D4A] px-5 flex items-center justify-between text-xs font-mono select-none z-30 backdrop-blur-md">
      {/* Left: Execution Controls & Simple Status */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={toggleAutoRun}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            isAutoRunning
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 hover:bg-[#00E5FF]/30'
          }`}
          title={isAutoRunning ? 'Pause signal animation' : 'Run signal animation'}
        >
          {isAutoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isAutoRunning ? 'Pause' : 'Play Signal'}</span>
        </button>

        {/* Step One Stage Button */}
        <button
          onClick={stepPipelineStage}
          disabled={isAutoRunning}
          className="px-3 py-1.5 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF]/50 text-slate-200 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1.5"
          title="Step through the 5-stage CPU pipeline one cycle at a time"
        >
          <SkipForward className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Step Cycle</span>
        </button>

        {/* Step Full Instruction Button */}
        <button
          onClick={stepFullInstruction}
          disabled={isAutoRunning}
          className="px-3 py-1.5 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-[#387BFF]/50 text-slate-200 disabled:opacity-40 transition-colors cursor-pointer hidden sm:block"
          title="Step one full instruction"
        >
          <span>Step Instruction</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={resetExecution}
          className="p-1.5 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-slate-400 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Reset processor state"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Current Active Pipeline Stage Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#101A2C] border border-[#1E2D4A]">
          <span className="text-slate-500 text-[11px]">ACTIVE STAGE:</span>
          <span className="text-[#00E5FF] font-bold">
            {executionState.currentStage}
          </span>
          {activeCompMeta && (
            <span className="text-slate-400 text-[11px] hidden md:inline">
              ({activeCompMeta.name})
            </span>
          )}
        </div>
      </div>

      {/* Center: Friendly Plain-English Log Readout */}
      <div className="hidden lg:flex items-center gap-2 max-w-lg truncate text-xs text-slate-300 px-3.5 py-1.5 bg-[#070B14] rounded-lg border border-[#1E2D4A]">
        <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
        <span className="truncate">{executionState.lastLog}</span>
      </div>

      {/* Right: Counters & Speed Control */}
      <div className="flex items-center gap-3">
        {/* Speed Slider */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span>Delay: {executionSpeedMs}ms</span>
          <input
            type="range"
            min={100}
            max={1500}
            step={50}
            value={executionSpeedMs}
            onChange={(e) => setExecutionSpeedMs(Number(e.target.value))}
            className="w-20 accent-[#00E5FF] cursor-pointer"
          />
        </div>

        {/* Cycle Count */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#101A2C] border border-[#1E2D4A]">
          <span className="text-slate-500">Cycles:</span>
          <span className="text-slate-100 font-bold">{executionState.cycleCount}</span>
        </div>

        {/* Retired Instructions */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#101A2C] border border-[#1E2D4A]">
          <span className="text-slate-500">Instructions:</span>
          <span className="text-[#387BFF] font-bold">{executionState.instructionCount}</span>
        </div>
      </div>
    </footer>
  );
};
