import React, { useState } from 'react';
import { 
  Network, 
  Cpu, 
  Layers, 
  GitCommit, 
  Zap, 
  Activity, 
  ArrowRight,
  Database,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';
import { ChipComponentId } from '@/types';

export const ArchitectureStudioModule: React.FC = () => {
  const { setSelectedComponentId, setActiveView } = useSimulationStore();
  const [activeTab, setActiveTab] = useState<'topology' | 'clock' | 'latency'>('topology');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full text-slate-200">
      {/* Header */}
      <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#387BFF]">
            <Network className="w-4 h-4" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              MICROARCHITECTURE & TOPOLOGY STUDIO
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 mt-0.5">
            Quantum-X9 Microarchitecture Blueprint
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Detailed schematics illustrating functional units, multi-stage pipeline flow, cache coherency protocols, and clock tree domains.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#101A2C] border border-[#1E2D4A] rounded-lg p-1">
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              activeTab === 'topology' ? 'bg-[#387BFF]/20 text-[#387BFF] font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            System Topology
          </button>
          <button
            onClick={() => setActiveTab('clock')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              activeTab === 'clock' ? 'bg-[#387BFF]/20 text-[#387BFF] font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clock Tree Domains
          </button>
          <button
            onClick={() => setActiveTab('latency')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              activeTab === 'latency' ? 'bg-[#387BFF]/20 text-[#387BFF] font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Latency & Bandwidth
          </button>
        </div>
      </div>

      {activeTab === 'topology' && (
        <div className="space-y-6">
          {/* Functional Unit Topology Map (Interactive Block Diagram) */}
          <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-6 space-y-6">
            <div className="border-b border-[#1E2D4A] pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100">Interconnect & Logic Crossbar Map</h2>
                <p className="text-xs text-slate-400">Click any functional block to inspect in 3D Explorer.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                256-BIT MESH INTERCONNECT
              </span>
            </div>

            {/* Hierarchical Visual Block Diagram */}
            <div className="space-y-4 font-mono text-xs">
              {/* Row 1: Memory & Subsystem */}
              <div className="p-4 rounded-xl bg-[#070B14] border border-[#1E2D4A] space-y-2">
                <div className="text-[10px] text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  <span>External Interface & Level 2 Unified Storage</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setSelectedComponentId('mem_ctrl');
                      setActiveView('explorer');
                    }}
                    className="p-3 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-amber-400 cursor-pointer transition-all"
                  >
                    <div className="font-bold text-amber-300">Memory Controller (Quad DDR5)</div>
                    <div className="text-[11px] text-slate-400 mt-1">102.4 GB/s PHY • 64-entry queue</div>
                  </div>
                  <div
                    onClick={() => {
                      setSelectedComponentId('l2');
                      setActiveView('explorer');
                    }}
                    className="p-3 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-[#0284C7] cursor-pointer transition-all"
                  >
                    <div className="font-bold text-[#38BDF8]">Level 2 Cache (1024 KB Unified)</div>
                    <div className="text-[11px] text-slate-400 mt-1">16-way set-assoc • 12 cycle latency</div>
                  </div>
                </div>
              </div>

              {/* Interconnect Crossbar Highway */}
              <div
                onClick={() => {
                  setSelectedComponentId('bus');
                  setActiveView('explorer');
                }}
                className="p-3 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-center font-bold text-[#00E5FF] tracking-wider hover:bg-[#00E5FF]/20 cursor-pointer transition-all"
              >
                ▲ COHERENT RING CROSSBAR INTERCONNECT (512 GB/s BISECTION BANDWIDTH) ▼
              </div>

              {/* Row 2: Split L1 Caches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    setSelectedComponentId('l1i');
                    setActiveView('explorer');
                  }}
                  className="p-3 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-emerald-400 cursor-pointer transition-all"
                >
                  <div className="font-bold text-emerald-400">L1 Instruction Cache (64 KB)</div>
                  <div className="text-[11px] text-slate-400 mt-1">8-way set-assoc • 3-cycle latency • Prefetch BTB</div>
                </div>

                <div
                  onClick={() => {
                    setSelectedComponentId('l1d');
                    setActiveView('explorer');
                  }}
                  className="p-3 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF] cursor-pointer transition-all"
                >
                  <div className="font-bold text-[#00E5FF]">L1 Data Cache (64 KB)</div>
                  <div className="text-[11px] text-slate-400 mt-1">8-way set-assoc • 4-cycle latency • Write-back</div>
                </div>
              </div>

              {/* Row 3: Core Execution Engine */}
              <div className="p-4 rounded-xl bg-[#070B14] border border-[#1E2D4A] space-y-2">
                <div className="text-[10px] text-[#387BFF] uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Execution & Control Pipeline Nucleus</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div
                    onClick={() => {
                      setSelectedComponentId('pc');
                      setActiveView('explorer');
                    }}
                    className="p-3 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-pink-400 cursor-pointer transition-all"
                  >
                    <div className="font-bold text-pink-400">Program Counter</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">64-bit Pointer</div>
                  </div>

                  <div
                    onClick={() => {
                      setSelectedComponentId('decoder');
                      setActiveView('explorer');
                    }}
                    className="p-3 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-sky-400 cursor-pointer transition-all"
                  >
                    <div className="font-bold text-sky-400">Inst Decoder</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">4-Wide Dispatch</div>
                  </div>

                  <div
                    onClick={() => {
                      setSelectedComponentId('registers');
                      setActiveView('explorer');
                    }}
                    className="p-3 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-purple-400 cursor-pointer transition-all"
                  >
                    <div className="font-bold text-purple-400">Register File</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">32 GPRs (4R / 2W)</div>
                  </div>

                  <div
                    onClick={() => {
                      setSelectedComponentId('alu');
                      setActiveView('explorer');
                    }}
                    className="p-3 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-orange-400 cursor-pointer transition-all"
                  >
                    <div className="font-bold text-orange-400">ALU Logic Unit</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">64-bit Int Core</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'clock' && (
        <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-6 space-y-4 font-mono text-xs">
          <div className="border-b border-[#1E2D4A] pb-3">
            <h2 className="text-base font-bold text-slate-100">Clock Domain Distribution & PLL Tree</h2>
            <p className="text-xs text-slate-400">Low-skew differential H-tree distribution network operating at up to 5.40 GHz boost.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#101A2C] border border-[#1E2D4A] space-y-2">
              <span className="text-xs font-bold text-[#F59E0B]">Primary Core Domain</span>
              <div className="text-2xl font-bold text-slate-100">4.80 GHz</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Drives the ALU, Decoder, Register File, and Control Unit. Dynamic voltage frequency scaling (DVFS) supports 1.4 GHz power saving to 5.4 GHz thermal boost.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#101A2C] border border-[#1E2D4A] space-y-2">
              <span className="text-xs font-bold text-[#00E5FF]">Mesh Interconnect Domain</span>
              <div className="text-2xl font-bold text-slate-100">4.00 GHz</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Synchronously clocks the on-chip ring crossbar interconnect and buffer queues, isolating core stalls from memory arbitration.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#101A2C] border border-[#1E2D4A] space-y-2">
              <span className="text-xs font-bold text-[#387BFF]">Memory PHY Domain</span>
              <div className="text-2xl font-bold text-slate-100">3.20 GHz</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Operates synchronous DDR5 command scheduling with sub-picosecond jitter calibration over external board trace impedances.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'latency' && (
        <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-6 space-y-4 font-mono text-xs">
          <div className="border-b border-[#1E2D4A] pb-3">
            <h2 className="text-base font-bold text-slate-100">Storage Hierarchy Latency Matrix</h2>
            <p className="text-xs text-slate-400">Sub-nanosecond to hundred-cycle access latency profiles across memory tiers.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1E2D4A] text-slate-400">
                  <th className="py-2.5 px-3">Memory Tier</th>
                  <th className="py-2.5 px-3">Capacity</th>
                  <th className="py-2.5 px-3">Access Latency</th>
                  <th className="py-2.5 px-3">Bandwidth</th>
                  <th className="py-2.5 px-3">Implementation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2D4A]">
                <tr>
                  <td className="py-3 px-3 font-bold text-purple-400">Register File</td>
                  <td className="py-3 px-3 text-slate-200">256 Bytes (32 x 64-bit)</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">1 Cycle (0.21 ns)</td>
                  <td className="py-3 px-3 text-slate-200">1.2 TB/s internal</td>
                  <td className="py-3 px-3 text-slate-400">Multi-port flip-flop cells</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-emerald-400">L1 Instruction Cache</td>
                  <td className="py-3 px-3 text-slate-200">64 KB</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">3 Cycles (0.62 ns)</td>
                  <td className="py-3 px-3 text-slate-200">307.2 GB/s</td>
                  <td className="py-3 px-3 text-slate-400">6T SRAM 8-way</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#00E5FF]">L1 Data Cache</td>
                  <td className="py-3 px-3 text-slate-200">64 KB</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">4 Cycles (0.83 ns)</td>
                  <td className="py-3 px-3 text-slate-200">307.2 GB/s</td>
                  <td className="py-3 px-3 text-slate-400">6T SRAM Dual-port</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#387BFF]">L2 Unified Cache</td>
                  <td className="py-3 px-3 text-slate-200">1024 KB</td>
                  <td className="py-3 px-3 text-amber-400 font-bold">12 Cycles (2.50 ns)</td>
                  <td className="py-3 px-3 text-slate-200">153.6 GB/s</td>
                  <td className="py-3 px-3 text-slate-400">High-density 6T SRAM SECDED ECC</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-amber-400">Main DRAM (DDR5)</td>
                  <td className="py-3 px-3 text-slate-200">32 GB Off-Chip</td>
                  <td className="py-3 px-3 text-red-400 font-bold">140 Cycles (29.1 ns)</td>
                  <td className="py-3 px-3 text-slate-200">102.4 GB/s</td>
                  <td className="py-3 px-3 text-slate-400">1T1C DRAM Quad-Channel PHY</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
