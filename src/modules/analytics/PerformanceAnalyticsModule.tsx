import React, { useState } from 'react';
import { 
  LineChart as LineChartIcon, 
  Activity, 
  Zap, 
  Flame, 
  Gauge, 
  Download, 
  Layers, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useSimulationStore } from '@/stores/simulationStore';

export const PerformanceAnalyticsModule: React.FC = () => {
  const { telemetryHistory, activeScenarioId, loadScenario } = useSimulationStore();
  const [activeTab, setActiveTab] = useState<'charts' | 'benchmark'>('charts');

  // Format CSV download
  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Time', 'CPU Utilization (%)', 'Clock (GHz)', 'Power (W)', 'IPC', 'Memory BW (GB/s)', 'Temp Max (C)', 'Temp Avg (C)'];
    const rows = telemetryHistory.map((pt) => [
      pt.timestamp,
      pt.timeLabel,
      pt.cpuUtilization,
      pt.clockFrequency,
      pt.powerWatts,
      pt.ipc,
      pt.memoryBandwidthGBs,
      pt.tempMax,
      pt.tempAvg
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `siliconverse_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full text-slate-200">
      {/* Top Header */}
      <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00E5FF]">
            <LineChartIcon className="w-4 h-4" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              REAL-TIME PERFORMANCE TELEMETRY & ANALYTICS
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 mt-0.5">
            Microarchitectural Performance Monitoring Unit (PMU)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Live hardware counters recording core frequency scaling, dynamic capacitive power draw, instruction retirement rates, and bus throughput.
          </p>
        </div>

        {/* Export & Tab Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#101A2C] border border-[#1E2D4A] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'charts' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Telemetry
            </button>
            <button
              onClick={() => setActiveTab('benchmark')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'benchmark' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Scenario Matrix
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF]/50 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {activeTab === 'charts' ? (
        /* Recharts 2x2 Grid of Live Time-Series Graphs */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Clock Frequency & Power */}
          <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-2 text-xs font-mono">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#387BFF]" />
                <span>Clock Frequency (GHz) & Power (Watts)</span>
              </span>
              <span className="text-slate-500">Dual Hardware Rail</span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryHistory}>
                  <defs>
                    <linearGradient id="freqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#387BFF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#387BFF" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" opacity={0.5} />
                  <XAxis dataKey="timeLabel" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={10} domain={[0, 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#070B14', borderColor: '#1E2D4A', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="powerWatts" name="Power (W)" stroke="#F59E0B" fillOpacity={1} fill="url(#powerGrad)" />
                  <Area type="monotone" dataKey="clockFrequency" name="Clock (GHz)" stroke="#387BFF" fillOpacity={1} fill="url(#freqGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Thermal Junction Temperatures */}
          <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-2 text-xs font-mono">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-400" />
                <span>Junction Temperatures: Max vs Average (°C)</span>
              </span>
              <span className="text-slate-500">Thermal Diode Array</span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryHistory}>
                  <defs>
                    <linearGradient id="tempMaxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" opacity={0.5} />
                  <XAxis dataKey="timeLabel" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={10} domain={[20, 110]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#070B14', borderColor: '#1E2D4A', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="tempMax" name="Max Temp (°C)" stroke="#EF4444" fillOpacity={1} fill="url(#tempMaxGrad)" />
                  <Line type="monotone" dataKey="tempAvg" name="Avg Temp (°C)" stroke="#00E5FF" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Instruction Throughput (IPC) */}
          <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-2 text-xs font-mono">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
                <span>Instructions Per Cycle (IPC Efficiency)</span>
              </span>
              <span className="text-slate-500">Commit Stage</span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryHistory}>
                  <defs>
                    <linearGradient id="ipcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" opacity={0.5} />
                  <XAxis dataKey="timeLabel" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={10} domain={[0, 4.0]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#070B14', borderColor: '#1E2D4A', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="ipc" name="IPC" stroke="#8B5CF6" fillOpacity={1} fill="url(#ipcGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Memory Interconnect Bandwidth */}
          <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-2 text-xs font-mono">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-[#00E5FF]" />
                <span>Memory Crossbar Throughput (GB/s)</span>
              </span>
              <span className="text-slate-500">DDR5 Interposer</span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryHistory}>
                  <defs>
                    <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" opacity={0.5} />
                  <XAxis dataKey="timeLabel" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={10} domain={[0, 120]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#070B14', borderColor: '#1E2D4A', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="memoryBandwidthGBs" name="Memory (GB/s)" stroke="#00E5FF" fillOpacity={1} fill="url(#memGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        /* Benchmark & Comparative Scenario Table */
        <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-4">
          <div className="border-b border-[#1E2D4A] pb-3">
            <h2 className="text-base font-bold text-slate-100">Scenario Benchmark Comparison</h2>
            <p className="text-xs text-slate-400">
              Deterministic architectural telemetry comparisons across predefined operational states.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-[#1E2D4A] text-slate-400">
                  <th className="py-2.5 px-3">Operating Mode</th>
                  <th className="py-2.5 px-3">Workload</th>
                  <th className="py-2.5 px-3">Clock Freq</th>
                  <th className="py-2.5 px-3">TDP Power</th>
                  <th className="py-2.5 px-3">Max Temp</th>
                  <th className="py-2.5 px-3">IPC</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2D4A]">
                {[
                  { name: 'Idle Baseline', load: '10%', clk: '1.80 GHz', pwr: '24.5 W', temp: '31.2°C', ipc: '0.80', status: 'Nominal', scenario: 'scenario_nominal' },
                  { name: 'Nominal Execution', load: '45%', clk: '4.80 GHz', pwr: '54.2 W', temp: '48.5°C', ipc: '2.45', status: 'Optimal', scenario: 'scenario_nominal' },
                  { name: 'Synthetic Heavy Stress', load: '95%', clk: '4.80 GHz', pwr: '92.4 W', temp: '76.8°C', ipc: '2.80', status: 'Elevated Heat', scenario: 'scenario_high_workload' },
                  { name: 'ALU Logic Failure', load: '65%', clk: '3.60 GHz', pwr: '62.0 W', temp: '68.0°C', ipc: '0.78', status: 'Defective Core', scenario: 'scenario_alu_failure' },
                  { name: 'Thermal Runaway Safe-Mode', load: '100%', clk: '1.40 GHz', pwr: '88.5 W', temp: '104.2°C', ipc: '0.65', status: 'Throttled (PROCHOT#)', scenario: 'scenario_thermal_overload' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#101A2C] transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-100">{row.name}</td>
                    <td className="py-3 px-3 text-slate-300">{row.load}</td>
                    <td className="py-3 px-3 text-[#387BFF] font-semibold">{row.clk}</td>
                    <td className="py-3 px-3 text-amber-400">{row.pwr}</td>
                    <td className="py-3 px-3 text-red-400">{row.temp}</td>
                    <td className="py-3 px-3 text-[#8B5CF6] font-semibold">{row.ipc}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#101A2C] border border-[#1E2D4A] text-[10px] text-slate-300">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => loadScenario(row.scenario)}
                        className="px-2.5 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 text-[11px] transition-colors cursor-pointer"
                      >
                        Load
                      </button>
                    </td>
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
