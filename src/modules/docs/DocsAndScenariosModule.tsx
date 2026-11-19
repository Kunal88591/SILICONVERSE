import React, { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Terminal, 
  Flame, 
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  SplitSquareVertical
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { GUIDED_SCENARIOS } from '@/data/scenarios';
import { GuidedScenario } from '@/types';

export const DocsAndScenariosModule: React.FC = () => {
  const {
    activeScenarioId,
    loadScenario,
    resetScenario,
    setActiveView,
    activeFaults,
    thermalTelemetry,
    executionState
  } = useSimulationStore();

  const [activeTab, setActiveTab] = useState<'scenarios' | 'isa' | 'guide'>('scenarios');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(activeScenarioId || 'scenario_nominal');

  const scenario = GUIDED_SCENARIOS.find((s) => s.id === selectedScenarioId) || GUIDED_SCENARIOS[0];
  const isCurrentlyLoaded = activeScenarioId === scenario.id;

  const isaInstructions = [
    { opcode: 'LOAD', syntax: 'LOAD Rd, Imm / Rs', format: 'R-Type / I-Type', description: 'Loads either an immediate constant or memory operand into general-purpose register Rd.' },
    { opcode: 'STORE', syntax: 'STORE Rs, Addr', format: 'S-Type', description: 'Writes register operand Rs directly into data memory RAM at address Addr.' },
    { opcode: 'ADD', syntax: 'ADD Rd, Rs1, Rs2', format: 'R-Type', description: 'Computes Rd = Rs1 + Rs2 using 64-bit carry-lookahead integer adder.' },
    { opcode: 'SUB', syntax: 'SUB Rd, Rs1, Rs2', format: 'R-Type', description: 'Computes Rd = Rs1 - Rs2 using 2s-complement arithmetic inversion.' },
    { opcode: 'MUL', syntax: 'MUL Rd, Rs1, Rs2', format: 'R-Type', description: 'Computes Rd = Rs1 * Rs2 utilizing the two-cycle integer multiplier array.' },
    { opcode: 'AND', syntax: 'AND Rd, Rs1, Rs2', format: 'R-Type', description: 'Performs bitwise logical AND between 64-bit registers Rs1 and Rs2.' },
    { opcode: 'OR',  syntax: 'OR Rd, Rs1, Rs2', format: 'R-Type', description: 'Performs bitwise logical OR between 64-bit registers Rs1 and Rs2.' },
    { opcode: 'XOR', syntax: 'XOR Rd, Rs1, Rs2', format: 'R-Type', description: 'Performs bitwise logical exclusive-OR between 64-bit registers Rs1 and Rs2.' },
    { opcode: 'JMP', syntax: 'JMP TargetAddr', format: 'J-Type', description: 'Unconditionally updates Program Counter (PC) to target address TargetAddr.' },
    { opcode: 'BEQ', syntax: 'BEQ Rs1, Rs2, Target', format: 'B-Type', description: 'Branches to Target if operands Rs1 and Rs2 evaluate as strictly equal.' },
    { opcode: 'HALT', syntax: 'HALT', format: 'Special', description: 'Ceases instruction pipeline clocking and places the processor into safe idle mode.' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full text-slate-200">
      {/* Header */}
      <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00E5FF]">
            <BookOpen className="w-4 h-4" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              SCENARIO EXPERIMENTS & ARCHITECTURAL REFERENCE
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 mt-0.5">
            Academic Demonstration Lab & Documentation
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Run reproducible, step-by-step semiconductor experiments designed for classroom instruction, university lab assignments, and technical reviews.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#101A2C] border border-[#1E2D4A] rounded-lg p-1">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              activeTab === 'scenarios' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Demonstration Experiments
          </button>
          <button
            onClick={() => setActiveTab('isa')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              activeTab === 'isa' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ISA Manual (11 Opcodes)
          </button>
        </div>
      </div>

      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Scenario Selector List */}
          <div className="lg:col-span-5 bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-200 border-b border-[#1E2D4A] pb-2 flex items-center justify-between">
              <span>Guided Lab Scenarios</span>
              <span className="text-slate-500">{GUIDED_SCENARIOS.length} Total</span>
            </div>

            <div className="space-y-2.5">
              {GUIDED_SCENARIOS.map((s) => {
                const isSelected = selectedScenarioId === s.id;
                const isLoaded = activeScenarioId === s.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedScenarioId(s.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#101A2C] border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                        : 'bg-[#101A2C]/60 border-[#1E2D4A] hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-100">{s.title}</div>
                      {isLoaded && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{s.subtitle}</div>

                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span>Workload: {s.workload}%</span>
                      <span>•</span>
                      <span>Cooling: {s.cooling}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (7 cols): Experiment Walkthrough & Controls */}
          <div className="lg:col-span-7 bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-6 space-y-5">
            {/* Header & Launch Button */}
            <div className="flex items-start justify-between border-b border-[#1E2D4A] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF]">
                  EXPERIMENT LABORATORY PROTOCOL
                </span>
                <h2 className="text-lg font-bold text-slate-100 mt-0.5">{scenario.title}</h2>
                <p className="text-xs font-semibold text-[#387BFF] mt-0.5">{scenario.subtitle}</p>
              </div>

              <button
                onClick={() => loadScenario(scenario.id)}
                className="px-4 py-2.5 rounded-lg bg-[#00E5FF] text-[#070B14] font-mono text-xs font-bold tracking-wider uppercase hover:bg-[#00E5FF]/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isCurrentlyLoaded ? 'Reload Experiment' : 'Start Experiment'}</span>
              </button>
            </div>

            {/* Experiment Description */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Objective & Hypothesis
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#101A2C] p-3 rounded-lg border border-[#1E2D4A]">
                {scenario.description}
              </p>
            </div>

            {/* Step-by-Step Guided Instructions */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Step-by-Step Demonstration Guide
              </div>
              <div className="space-y-2">
                {scenario.stepGuide.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#101A2C] border border-[#1E2D4A] flex items-start gap-3 text-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-300 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Telemetry Observations */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Expected Experimental Observations
              </div>
              <div className="space-y-1.5 bg-[#101A2C]/60 p-3.5 rounded-lg border border-[#1E2D4A] text-xs">
                {scenario.expectedObservations.map((obs, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{obs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick jump to relevant modules */}
            <div className="pt-2 border-t border-[#1E2D4A] flex items-center gap-3">
              <button
                onClick={() => setActiveView('signal-flow')}
                className="px-3 py-1.5 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF] text-xs font-mono text-slate-300 hover:text-[#00E5FF] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Observe in Signal Flow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveView('thermal')}
                className="px-3 py-1.5 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-amber-400 text-xs font-mono text-slate-300 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Thermal Heatmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'isa' && (
        <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-6 space-y-4 font-mono text-xs">
          <div className="border-b border-[#1E2D4A] pb-3">
            <h2 className="text-base font-bold text-slate-100">Quantum-X9 Instruction Set Architecture (ISA)</h2>
            <p className="text-xs text-slate-400">Deterministic 64-bit micro-engine instruction specifications.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1E2D4A] text-slate-400">
                  <th className="py-2.5 px-3">Opcode</th>
                  <th className="py-2.5 px-3">Assembly Syntax</th>
                  <th className="py-2.5 px-3">Encoding Format</th>
                  <th className="py-2.5 px-3">Functional Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2D4A]">
                {isaInstructions.map((inst) => (
                  <tr key={inst.opcode} className="hover:bg-[#101A2C] transition-colors">
                    <td className="py-3 px-3 font-bold text-[#00E5FF]">{inst.opcode}</td>
                    <td className="py-3 px-3 text-slate-200">{inst.syntax}</td>
                    <td className="py-3 px-3 text-slate-400">{inst.format}</td>
                    <td className="py-3 px-3 text-slate-300">{inst.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
