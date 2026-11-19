import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Activity, 
  Flame, 
  Zap, 
  Wrench,
  TrendingDown,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { FAULT_DEFINITIONS } from '@/data/scenarios';
import { CHIP_COMPONENTS } from '@/data/chipComponents';

export const FaultLabModule: React.FC = () => {
  const {
    activeFaults,
    injectFault,
    removeFault,
    clearAllFaults,
    setSelectedComponentId,
    setActiveView,
    thermalTelemetry,
    telemetryHistory
  } = useSimulationStore();

  const [selectedFaultId, setSelectedFaultId] = useState<string>('alu_overflow_fault');

  const fault = FAULT_DEFINITIONS[selectedFaultId] || FAULT_DEFINITIONS['alu_overflow_fault'];
  const isFaultInjected = activeFaults.includes(fault.id);
  const targetComp = CHIP_COMPONENTS[fault.componentId];

  // Baseline vs Active metrics for comparison
  const baselineMetrics = {
    ipc: 2.45,
    clockGHz: 4.80,
    tempC: 45.0,
    errorRate: 0.0
  };

  const currentMetrics = {
    ipc: isFaultInjected
      ? Math.max(0.4, 2.45 * (1 - fault.telemetryImpact.throughputDropPct / 100))
      : 2.45,
    clockGHz: isFaultInjected
      ? Math.max(1.4, 4.80 - fault.telemetryImpact.clockPenaltyGHz)
      : 4.80,
    tempC: isFaultInjected
      ? 45.0 + fault.telemetryImpact.tempIncreaseC
      : 45.0,
    errorRate: isFaultInjected
      ? fault.telemetryImpact.errorRatePct
      : 0.0
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full text-slate-200">
      {/* Return to 3D Chip Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('explorer')}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#00E5FF]/40 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span>← Back to 3D Chip View</span>
        </button>
      </div>
      {/* Header */}
      <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              VIRTUAL FAULT INJECTION & SILICON DIAGNOSTICS LAB
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 mt-0.5">
            Hardware Stress, Defect Emulation & Recovery
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Select a hardware failure mode to inject into the active silicon die. Observe the ripple effect across the execution pipeline, bus throughput, and thermal equilibrium.
          </p>
        </div>

        {/* Global Reset Button */}
        {activeFaults.length > 0 && (
          <button
            onClick={clearAllFaults}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All Active Faults ({activeFaults.length})</span>
          </button>
        )}
      </div>

      {/* Main Grid: Fault Directory on Left, Diagnostic Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (5 cols): Failure Scenario Selector */}
        <div className="lg:col-span-5 bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-3">
          <div className="text-xs font-mono font-bold text-slate-200 border-b border-[#1E2D4A] pb-2 flex items-center justify-between">
            <span>Defined Defect Scenarios</span>
            <span className="text-slate-500">{Object.keys(FAULT_DEFINITIONS).length} Profiles</span>
          </div>

          <div className="space-y-2">
            {Object.values(FAULT_DEFINITIONS).map((f) => {
              const isSelected = selectedFaultId === f.id;
              const isActive = activeFaults.includes(f.id);
              const comp = CHIP_COMPONENTS[f.componentId];

              return (
                <div
                  key={f.id}
                  onClick={() => {
                    setSelectedFaultId(f.id);
                    setSelectedComponentId(f.componentId);
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#101A2C] border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                      : 'bg-[#101A2C]/60 border-[#1E2D4A] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-400 animate-pulse' : 'bg-slate-500'}`} />
                      <span className="text-xs font-bold text-slate-100">{f.title}</span>
                    </div>

                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                      f.severity === 'critical'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}>
                      {f.severity}
                    </span>
                  </div>

                  <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Target: <strong className="text-slate-200">{comp?.name}</strong></span>
                    <span>•</span>
                    <span className={isActive ? 'text-red-400 font-semibold' : 'text-slate-500'}>
                      {isActive ? 'STATUS: INJECTED' : 'INACTIVE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col (7 cols): Detailed Fault Diagnostic & Mitigation Console */}
        <div className="lg:col-span-7 bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-5">
          {/* Header & Inject/Clear Action */}
          <div className="flex items-start justify-between border-b border-[#1E2D4A] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-400">
                  DEFECT PROFILE SPECIFICATION
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-mono text-[#00E5FF]">Target: {targetComp?.name}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mt-1">{fault.title}</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{fault.description}</p>
            </div>

            <button
              onClick={() => {
                if (isFaultInjected) {
                  removeFault(fault.id);
                } else {
                  injectFault(fault.id);
                }
              }}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                isFaultInjected
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30'
                  : 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isFaultInjected ? 'Clear This Fault' : 'Inject Hardware Fault'}</span>
            </button>
          </div>

          {/* Comparative Metrics: Baseline vs Active State */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Telemetry Impact Comparison (Nominal vs Current)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              {/* IPC */}
              <div className="bg-[#101A2C] p-3 rounded-lg border border-[#1E2D4A]">
                <div className="text-[10px] text-slate-500">EFFECTIVE IPC</div>
                <div className={`text-base font-bold mt-1 ${isFaultInjected ? 'text-red-400' : 'text-slate-100'}`}>
                  {currentMetrics.ipc.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Base: {baselineMetrics.ipc.toFixed(2)}
                </div>
              </div>

              {/* Clock Freq */}
              <div className="bg-[#101A2C] p-3 rounded-lg border border-[#1E2D4A]">
                <div className="text-[10px] text-slate-500">CLOCK SPEED</div>
                <div className={`text-base font-bold mt-1 ${isFaultInjected ? 'text-amber-400' : 'text-slate-100'}`}>
                  {currentMetrics.clockGHz.toFixed(2)} GHz
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Base: {baselineMetrics.clockGHz.toFixed(2)} GHz
                </div>
              </div>

              {/* Temperature */}
              <div className="bg-[#101A2C] p-3 rounded-lg border border-[#1E2D4A]">
                <div className="text-[10px] text-slate-500">TEMP RISE</div>
                <div className={`text-base font-bold mt-1 ${isFaultInjected ? 'text-red-400' : 'text-slate-100'}`}>
                  {currentMetrics.tempC.toFixed(1)}°C
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Base: {baselineMetrics.tempC.toFixed(1)}°C
                </div>
              </div>

              {/* Error Rate */}
              <div className="bg-[#101A2C] p-3 rounded-lg border border-[#1E2D4A]">
                <div className="text-[10px] text-slate-500">ERROR RATE</div>
                <div className={`text-base font-bold mt-1 ${currentMetrics.errorRate > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {currentMetrics.errorRate.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Base: 0.0%
                </div>
              </div>
            </div>
          </div>

          {/* Observable Symptoms */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Observable Symptoms & Telemetry Anomalies
            </div>
            <div className="space-y-1.5 bg-[#101A2C]/60 p-3 rounded-lg border border-[#1E2D4A] text-xs">
              {fault.symptoms.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Corrective Actions */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recommended Microarchitectural Mitigations</span>
            </div>
            <div className="space-y-1.5 bg-[#101A2C]/60 p-3 rounded-lg border border-[#1E2D4A] text-xs">
              {fault.recommendedActions.map((act, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
