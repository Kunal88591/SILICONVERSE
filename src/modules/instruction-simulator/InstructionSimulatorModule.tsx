import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  FileCode, 
  Database, 
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { SAMPLE_PROGRAMS } from '@/data/scenarios';

export const InstructionSimulatorModule: React.FC = () => {
  const {
    assemblyCode,
    setAssemblyCode,
    executionState,
    isAutoRunning,
    toggleAutoRun,
    stepPipelineStage,
    stepFullInstruction,
    resetExecution,
    loadProgram,
    activeFaults
  } = useSimulationStore();

  const [selectedSampleKey, setSelectedSampleKey] = useState<string>('fibonacci');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full text-slate-200">
      {/* Top Header & Program Selector Bar */}
      <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#387BFF]">
            <Terminal className="w-4 h-4" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              INSTRUCTION SET ARCHITECTURE (ISA) WORKSTATION
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 mt-0.5">
            Quantum-X9 Micro-Engine & Assembly Simulator
          </h1>
        </div>

        {/* Sample Program Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">Sample Program:</span>
          <select
            value={selectedSampleKey}
            onChange={(e) => {
              setSelectedSampleKey(e.target.value);
              loadProgram(e.target.value);
            }}
            className="bg-[#101A2C] border border-[#1E2D4A] hover:border-[#387BFF]/50 text-xs text-slate-200 rounded px-3 py-1.5 outline-none font-mono focus:border-[#387BFF] transition-colors cursor-pointer"
          >
            {Object.entries(SAMPLE_PROGRAMS).map(([k, prog]) => (
              <option key={k} value={k} className="bg-[#0B1220]">
                {prog.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Code Editor on Left, Registers & RAM on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Assembly Code Editor & Controls */}
        <div className="lg:col-span-7 bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-xs font-mono font-bold text-slate-200">
                Source Editor: Quantum RISC Assembly
              </span>
            </div>

            {/* Execution Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAutoRun}
                className={`px-3 py-1 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isAutoRunning
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 hover:bg-[#00E5FF]/30'
                }`}
              >
                {isAutoRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isAutoRunning ? 'PAUSE' : 'RUN'}</span>
              </button>

              <button
                onClick={stepPipelineStage}
                disabled={isAutoRunning}
                className="px-2.5 py-1 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF]/50 text-slate-200 text-xs font-mono disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <SkipForward className="w-3 h-3 text-[#00E5FF]" />
                <span>Stage</span>
              </button>

              <button
                onClick={stepFullInstruction}
                disabled={isAutoRunning}
                className="px-2.5 py-1 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-[#387BFF]/50 text-slate-200 text-xs font-mono disabled:opacity-40 cursor-pointer"
              >
                <span>Inst</span>
              </button>

              <button
                onClick={resetExecution}
                className="p-1 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-slate-400 text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Reset Execution"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Textarea Code Editor */}
          <div className="relative font-mono text-xs">
            <textarea
              value={assemblyCode}
              onChange={(e) => setAssemblyCode(e.target.value)}
              rows={14}
              className="w-full bg-[#070B14] text-slate-200 p-4 rounded-lg border border-[#1E2D4A] focus:border-[#387BFF] outline-none font-mono text-xs leading-relaxed resize-none selection:bg-[#387BFF]/30"
              spellCheck={false}
            />
          </div>

          {/* Execution Telemetry Summary */}
          <div className="grid grid-cols-4 gap-2 text-xs font-mono bg-[#101A2C] p-3 rounded-lg border border-[#1E2D4A]">
            <div>
              <div className="text-[10px] text-slate-500">PROGRAM COUNTER</div>
              <div className="text-sm font-bold text-[#00E5FF]">
                0x{executionState.pc.toString(16).padStart(2, '0').toUpperCase()}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">CYCLE COUNT</div>
              <div className="text-sm font-bold text-slate-200">{executionState.cycleCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">RETIRED INST</div>
              <div className="text-sm font-bold text-slate-200">{executionState.instructionCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">EXECUTION STATE</div>
              <div className={`text-sm font-bold ${executionState.isHalted ? 'text-amber-400' : 'text-emerald-400'}`}>
                {executionState.isHalted ? 'HALTED' : executionState.currentStage}
              </div>
            </div>
          </div>

          {/* Log Message */}
          <div className="p-2.5 rounded bg-[#070B14] border border-[#1E2D4A] text-xs font-mono text-slate-300">
            <span className="text-[#387BFF] font-semibold">STAGE DETAIL: </span>
            <span>{executionState.lastLog}</span>
          </div>
        </div>

        {/* Right Column (5 cols): Register File & RAM Viewer */}
        <div className="lg:col-span-5 space-y-6">
          {/* General Purpose Registers Table (R0 - R7) */}
          <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  Register File (64-Bit GPRs)
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Latency: 1 Cycle</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {Object.entries(executionState.registers).map(([regName, val]) => (
                <div
                  key={regName}
                  className="bg-[#101A2C] p-2 rounded border border-[#1E2D4A] flex items-center justify-between"
                >
                  <span className="font-bold text-[#8B5CF6]">{regName}:</span>
                  <div className="text-right">
                    <span className="text-slate-100 font-semibold">{val}</span>
                    <span className="text-[10px] text-slate-500 ml-1.5">
                      (0x{val.toString(16).toUpperCase()})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RAM Hex Grid (64 Words) */}
          <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#D97706]" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  Data Memory RAM Grid (64 Words)
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">DDR5 Channel 0</span>
            </div>

            <div className="grid grid-cols-8 gap-1 text-[11px] font-mono max-h-56 overflow-y-auto p-1 bg-[#070B14] rounded border border-[#1E2D4A]">
              {executionState.memory.map((val, idx) => (
                <div
                  key={idx}
                  className={`p-1.5 rounded text-center border ${
                    val !== 0
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-[#101A2C]/60 border-transparent text-slate-600'
                  }`}
                  title={`RAM[${idx}]: ${val} (0x${val.toString(16)})`}
                >
                  <div className="text-[8px] text-slate-500 font-normal">{idx}</div>
                  <div>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
