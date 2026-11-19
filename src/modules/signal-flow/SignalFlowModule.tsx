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
  AlertCircle
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
    description: string;
    busSignal: string;
  }> = [
    {
      stage: 'FETCH',
      label: '1. Instruction Fetch',
      primaryUnit: 'pc',
      description: 'Program Counter delivers address pointer to L1 Instruction Cache. 32-byte instruction block streamed to prefetch buffer.',
      busSignal: 'PC_OUT[63:0] -> L1I_ADDR_BUS'
    },
    {
      stage: 'DECODE',
      label: '2. Instruction Decode',
      primaryUnit: 'decoder',
      description: 'Opcode deconstructed into internal RISC micro-operations. Register operand indices parsed and hazard logic asserted.',
      busSignal: 'L1I_DATA_BUS -> DECODER_OPCODE[31:0]'
    },
    {
      stage: 'EXECUTE',
      label: '3. Execution & ALU',
      primaryUnit: 'alu',
      description: 'Operands extracted from Register File are computed in the 64-bit ALU or Address Generation Unit (AGU).',
      busSignal: 'REG_RS1 / REG_RS2 -> ALU_IN_A / ALU_IN_B'
    },
    {
      stage: 'MEMORY',
      label: '4. Memory Access',
      primaryUnit: 'l1d',
      description: 'Loads read requested operands from L1 Data Cache; Stores deposit values into store buffer queues pending retirement.',
      busSignal: 'ALU_ADDR_OUT -> L1D_SRAM_PORT'
    },
    {
      stage: 'WRITEBACK',
      label: '5. Register Write-Back',
      primaryUnit: 'registers',
      description: 'Computed arithmetic results or loaded memory data committed into destination architecture register (R0 - R7).',
      busSignal: 'WB_MUX_OUT -> PRF_WRITE_PORT[63:0]'
    }
  ];

  const currentInst = executionState.currentInstruction;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-6">
      {/* Top Floating Pipeline Stages Bar */}
      <div className="bg-[#0B1220]/95 backdrop-blur-md border border-[#1E2D4A] rounded-xl p-4 shadow-2xl pointer-events-auto max-w-5xl mx-auto w-full space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-2">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-[#00E5FF]" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-100">
              5-STAGE PIPELINE SIGNAL FLOW
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Current Instruction:</span>
            <span className="px-2 py-0.5 rounded bg-[#101A2C] border border-[#00E5FF]/40 text-[#00E5FF] font-semibold">
              {currentInst ? currentInst.raw : 'NONE'}
            </span>
          </div>
        </div>

        {/* Pipeline Stage Indicators */}
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
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00E5FF]/15 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                    : isPast
                    ? 'bg-[#101A2C] border-emerald-500/40 text-slate-300'
                    : 'bg-[#101A2C]/60 border-[#1E2D4A] text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                  <span className={isActive ? 'text-[#00E5FF]' : isPast ? 'text-emerald-400' : 'text-slate-400'}>
                    {st.stage}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />}
                </div>

                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  Unit: {CHIP_COMPONENTS[st.primaryUnit]?.name}
                </div>

                <div className="text-[9px] font-mono text-slate-500 mt-1 truncate">
                  {st.busSignal}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Step Control Panel */}
      <div className="bg-[#0B1220]/95 backdrop-blur-md border border-[#1E2D4A] rounded-xl p-4 shadow-2xl pointer-events-auto max-w-2xl mx-auto w-full space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={toggleAutoRun}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isAutoRunning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 hover:bg-[#00E5FF]/30'
              }`}
            >
              {isAutoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoRunning ? 'PAUSE PIPELINE' : 'RUN CONTINUOUS'}</span>
            </button>

            {/* Step Stage */}
            <button
              onClick={stepPipelineStage}
              disabled={isAutoRunning}
              className="px-3 py-1.5 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF]/50 text-slate-200 text-xs font-mono disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Step Stage</span>
            </button>

            {/* Step Instruction */}
            <button
              onClick={stepFullInstruction}
              disabled={isAutoRunning}
              className="px-3 py-1.5 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-[#387BFF]/50 text-slate-200 text-xs font-mono disabled:opacity-40 cursor-pointer"
            >
              <span>Step Inst</span>
            </button>

            {/* Reset */}
            <button
              onClick={resetExecution}
              className="p-1.5 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-slate-400 text-slate-400 hover:text-slate-200 cursor-pointer"
              title="Reset Execution"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed slider */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Cycle Delay:</span>
            <span className="text-[#00E5FF] font-semibold">{executionSpeedMs}ms</span>
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

        {/* Live Textual Execution Explanation */}
        <div className="p-2.5 rounded-lg bg-[#070B14] border border-[#1E2D4A] text-xs font-mono text-slate-300 flex items-start gap-2">
          <span className="text-[#00E5FF] font-semibold">SIGNAL BUS:</span>
          <span className="leading-relaxed">{executionState.lastLog}</span>
        </div>
      </div>
    </div>
  );
};
