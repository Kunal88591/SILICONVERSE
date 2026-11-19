import React from 'react';
import { 
  Cpu, 
  Activity, 
  Flame, 
  Zap, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  Sliders,
  Layers,
  Terminal,
  Play
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';
import { GUIDED_SCENARIOS } from '@/data/scenarios';
import { ChipComponentId } from '@/types';

export const OverviewModule: React.FC = () => {
  const {
    thermalTelemetry,
    telemetryHistory,
    activeFaults,
    setSelectedComponentId,
    setActiveView,
    loadScenario,
    executionState
  } = useSimulationStore();

  const latestTelemetry = telemetryHistory[telemetryHistory.length - 1] || {
    cpuUtilization: 45,
    clockFrequency: 4.8,
    powerWatts: 48.5,
    ipc: 2.45,
    memoryBandwidthGBs: 42.0
  };

  const isHealthy = activeFaults.length === 0 && !thermalTelemetry.throttlingActive;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full text-slate-200">
      {/* Hero Welcome & Platform Status Banner */}
      <div className="bg-gradient-to-r from-[#101A2C] via-[#0B1220] to-[#101A2C] border border-[#1E2D4A] rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                SYSTEM WORKSTATION ACTIVE
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-xs text-slate-400 font-mono">Architecture: Quantum-X9 (64-Bit Superscalar)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              SiliconVerse Engineering Console
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time interactive digital twin and microarchitectural simulation environment. Inspect procedural 3D silicon, execute assembly programs, inject hardware faults, and analyze thermal characteristics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('explorer')}
              className="px-4 py-2.5 rounded-lg bg-[#00E5FF] text-[#070B14] font-semibold text-xs tracking-wider uppercase hover:bg-[#00E5FF]/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>Enter 3D Explorer</span>
            </button>

            <button
              onClick={() => setActiveView('instruction-sim')}
              className="px-4 py-2.5 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-[#387BFF]/60 text-slate-200 font-semibold text-xs tracking-wider uppercase hover:text-[#387BFF] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>Assembly Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live System Telemetry Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Core Frequency */}
        <div className="bg-[#101A2C]/90 border border-[#1E2D4A] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>CLOCK FREQ</span>
            <Activity className="w-4 h-4 text-[#387BFF]" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-slate-100">
              {latestTelemetry.clockFrequency.toFixed(2)} <span className="text-xs font-normal text-slate-400">GHz</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
              Base: 4.80 GHz
            </div>
          </div>
        </div>

        {/* Junction Temp */}
        <div className="bg-[#101A2C]/90 border border-[#1E2D4A] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>JUNCTION TJ</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className={`text-xl font-bold font-mono ${thermalTelemetry.maxTemperature >= 85 ? 'text-red-400' : 'text-slate-100'}`}>
              {thermalTelemetry.maxTemperature.toFixed(1)} <span className="text-xs font-normal text-slate-400">°C</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              Limit: 105.0°C
            </div>
          </div>
        </div>

        {/* CPU Utilization */}
        <div className="bg-[#101A2C]/90 border border-[#1E2D4A] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>UTILIZATION</span>
            <Gauge className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-slate-100">
              {latestTelemetry.cpuUtilization} <span className="text-xs font-normal text-slate-400">%</span>
            </div>
            <div className="w-full bg-[#070B14] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#00E5FF] h-full rounded-full transition-all duration-300"
                style={{ width: `${latestTelemetry.cpuUtilization}%` }}
              />
            </div>
          </div>
        </div>

        {/* Power Watts */}
        <div className="bg-[#101A2C]/90 border border-[#1E2D4A] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>POWER (TDP)</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-slate-100">
              {latestTelemetry.powerWatts.toFixed(1)} <span className="text-xs font-normal text-slate-400">W</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              TDP Ceiling: 95.0W
            </div>
          </div>
        </div>

        {/* IPC */}
        <div className="bg-[#101A2C]/90 border border-[#1E2D4A] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>EFFICIENCY IPC</span>
            <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-slate-100">
              {latestTelemetry.ipc.toFixed(2)}
            </div>
            <div className="text-[10px] font-mono text-purple-400 mt-0.5">
              Peak: 4.0 uops/cyc
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-[#101A2C]/90 border border-[#1E2D4A] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>STATUS</span>
            {isHealthy ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className="mt-2">
            <div className={`text-sm font-bold font-mono uppercase ${isHealthy ? 'text-emerald-400' : 'text-red-400'}`}>
              {isHealthy ? 'NOMINAL' : 'DEGRADED'}
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              {activeFaults.length} Fault(s) Active
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Section: Component Health Matrix + Guided Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Component Health Matrix */}
        <div className="lg:col-span-2 bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-100">Functional Component Matrix</h2>
              <p className="text-xs text-slate-400">
                Live operating status, thermal levels, and transistor density across all 11 silicon blocks.
              </p>
            </div>
            <button
              onClick={() => setActiveView('explorer')}
              className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>3D Inspector</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {(Object.keys(CHIP_COMPONENTS) as ChipComponentId[]).map((id) => {
              const comp = CHIP_COMPONENTS[id];
              const isFaulty = activeFaults.some((f) => f.includes(id));
              const temp = thermalTelemetry.componentTemperatures[id] || 35;
              const isActiveInPipe = executionState.activeComponent === id;

              return (
                <div
                  key={id}
                  onClick={() => {
                    setSelectedComponentId(id);
                    setActiveView('explorer');
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isFaulty
                      ? 'bg-red-500/10 border-red-500/40 hover:bg-red-500/20'
                      : isActiveInPipe
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF]/40 hover:bg-[#00E5FF]/20'
                      : 'bg-[#101A2C] border-[#1E2D4A] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: isFaulty ? '#EF4444' : comp.color }}
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                        <span>{comp.name}</span>
                        {isActiveInPipe && (
                          <span className="text-[9px] font-mono px-1 rounded bg-[#00E5FF]/20 text-[#00E5FF]">
                            ACTIVE
                          </span>
                        )}
                        {isFaulty && (
                          <span className="text-[9px] font-mono px-1 rounded bg-red-500/20 text-red-400">
                            FAULT
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate max-w-[160px]">
                        {comp.transistorCount} • {comp.siliconArea}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <div className={temp >= 80 ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                      {temp.toFixed(1)}°C
                    </div>
                    <div className="text-[10px] text-slate-500">{comp.category}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Quick Guided Scenarios */}
        <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-4">
          <div className="border-b border-[#1E2D4A] pb-3">
            <h2 className="text-base font-bold text-slate-100">Ready-Made Scenarios</h2>
            <p className="text-xs text-slate-400">
              One-click reproducible architectural experiments for live demonstrations.
            </p>
          </div>

          <div className="space-y-2.5">
            {GUIDED_SCENARIOS.slice(0, 4).map((s) => (
              <div
                key={s.id}
                onClick={() => loadScenario(s.id)}
                className="p-3 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF]/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-[#00E5FF] transition-colors">
                    {s.title}
                  </div>
                  <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00E5FF] transition-colors" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span>Load: {s.workload}%</span>
                  <span>•</span>
                  <span>Cooling: {s.cooling}%</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveView('docs')}
            className="w-full py-2 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-slate-400 text-xs font-mono text-slate-300 hover:text-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View All Experiment Scenarios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
