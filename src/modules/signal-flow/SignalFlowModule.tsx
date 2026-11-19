import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Sliders, 
  Cpu, 
  ArrowRight,
  GitCommit,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';
import { PipelineStage, ChipComponentId } from '@/types';

export const SignalFlowModule: React.FC = () => {
  const {
    executionState,
    isAutoRunning,
    toggleAutoRun,
    stepPipelineStage,
    stepFullInstruction,
    resetExecution,
    executionSpeedMs,
    setExecutionSpeedMs,
    setSelectedComponentId
  } = useSimulationStore();

  const stages: Array<{
    stage: PipelineStage;
    label: string;
    primaryUnit: ChipComponentId;
    busSignal: string;
  }> = [
    {
      stage: 'FETCH',
      label: 'Fetch',
      primaryUnit: 'pc',
      busSignal: 'PC -> L1I Cache'
    },
    {
      stage: 'DECODE',
      label: 'Decode',
      primaryUnit: 'decoder',
      busSignal: 'L1I -> Decoder'
    },
    {
      stage: 'EXECUTE',
      label: 'Execute',
      primaryUnit: 'alu',
      busSignal: 'Regs -> ALU Core'
    },
    {
      stage: 'MEMORY',
      label: 'Memory',
      primaryUnit: 'l1d',
      busSignal: 'ALU -> L1D / Bus'
    },
    {
      stage: 'WRITEBACK',
      label: 'Writeback',
      primaryUnit: 'registers',
      busSignal: 'Bus -> Reg File'
    }
  ];

  const currentInst = executionState.currentInstruction;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-5">
      {/* Top Floating Pipeline Stages Bar */}
      <div className="bg-[#080D1A]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-4 shadow-2xl pointer-events-auto max-w-4xl mx-auto w-full space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-[#00E5FF]" />
            <span className="text-xs font-mono font-bold tracking-wider text-white">
              5-STAGE PIPELINE SIGNAL FLOW
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Current Instruction:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] font-bold">
              {currentInst ? currentInst.raw : 'NOP'}
            </span>
          </div>
        </div>

        {/* 5 Stages Grid */}
        <div className="grid grid-cols-5 gap-2">
          {stages.map((st, idx) => {
            const isActive = executionState.currentStage === st.stage;
            const isPast =
              executionState.currentStage !== 'IDLE' &&
              stages.findIndex((s) => s.stage === executionState.currentStage) > idx;

            return (
              <div
                key={st.stage}
                onClick={() => setSelectedComponentId(st.primaryUnit)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00E5FF]/20 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    : isPast
                    ? 'bg-white/[0.04] border-emerald-500/40 text-slate-300'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className={isActive ? 'text-[#00E5FF]' : isPast ? 'text-emerald-400' : 'text-slate-400'}>
                    {st.stage}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />}
                </div>

                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  Unit: {CHIP_COMPONENTS[st.primaryUnit]?.name}
                </div>

                <div className="text-[9px] font-mono text-slate-500 mt-0.5 truncate">
                  {st.busSignal}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Step & Playback Controls Bar */}
      <div className="bg-[#080D1A]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-3.5 shadow-2xl pointer-events-auto max-w-xl mx-auto w-full space-y-2.5 mb-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={toggleAutoRun}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isAutoRunning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-[#00E5FF] text-[#050811] font-semibold hover:bg-[#00E5FF]/90 shadow-[0_0_12px_rgba(0,229,255,0.3)]'
              }`}
            >
              {isAutoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isAutoRunning ? 'Pause Stream' : 'Run Pipeline'}</span>
            </button>

            {/* Step Stage */}
            <button
              onClick={stepPipelineStage}
              disabled={isAutoRunning}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#00E5FF]/50 text-slate-200 text-xs font-medium disabled:opacity-40 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Step Stage</span>
            </button>

            {/* Step Inst */}
            <button
              onClick={stepFullInstruction}
              disabled={isAutoRunning}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#387BFF]/50 text-slate-200 text-xs font-medium disabled:opacity-40 cursor-pointer transition-colors"
            >
              <span>Step Inst</span>
            </button>

            {/* Reset */}
            <button
              onClick={resetExecution}
              className="p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-slate-400 text-slate-400 hover:text-white cursor-pointer transition-colors"
              title="Reset Execution"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed slider */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
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
        </div>

        {/* Live Step Explanation */}
        <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-slate-300 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
          <span className="leading-relaxed">{executionState.lastLog}</span>
        </div>
      </div>
    </div>
  );
};
