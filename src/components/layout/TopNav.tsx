import React from 'react';
import { 
  Cpu, 
  Activity, 
  Flame, 
  AlertTriangle, 
  Camera, 
  Layers, 
  RotateCcw, 
  Play, 
  Pause,
  Sliders,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { GUIDED_SCENARIOS } from '@/data/scenarios';

export const TopNav: React.FC = () => {
  const {
    activeScenarioId,
    loadScenario,
    cameraPreset,
    setCameraPreset,
    activeFaults,
    thermalTelemetry,
    isAutoRunning,
    toggleAutoRun,
    activeView,
    setActiveView
  } = useSimulationStore();

  const isCritical = thermalTelemetry.throttlingActive || activeFaults.length > 0;

  return (
    <header className="h-14 bg-[#0B1220]/95 border-b border-[#1E2D4A] px-4 flex items-center justify-between z-30 select-none backdrop-blur-md">
      {/* Brand & Workspace Title */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => setActiveView('overview')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-[#101A2C] border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] group-hover:border-[#00E5FF] group-hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] transition-all">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider text-slate-100 group-hover:text-[#00E5FF] transition-colors">
                SILICON<span className="text-[#00E5FF]">VERSE</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] font-mono border border-[#00E5FF]/20">
                DT-X9 PRO
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>DIE: QUANTUM-X9</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">4.80 GHz HYPER-CORE</span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-[#1E2D4A] hidden md:block" />

        {/* Scenario Quick Selector */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-slate-400">Scenario:</span>
          <select
            value={activeScenarioId || ''}
            onChange={(e) => loadScenario(e.target.value)}
            className="bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF]/50 text-xs text-slate-200 rounded px-2.5 py-1 outline-none font-mono focus:border-[#00E5FF] transition-colors cursor-pointer"
          >
            {GUIDED_SCENARIOS.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0B1220] text-slate-200">
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center Live Telemetry Gauges */}
      <div className="hidden md:flex items-center gap-4 text-xs font-mono">
        {/* Core Clock */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#101A2C] border border-[#1E2D4A]">
          <Activity className="w-3.5 h-3.5 text-[#387BFF]" />
          <span className="text-slate-400">CLK:</span>
          <span className="text-slate-200 font-semibold">
            {thermalTelemetry.throttlingActive ? '1.40' : '4.80'} GHz
          </span>
        </div>

        {/* Junction Temp */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#101A2C] border ${
          thermalTelemetry.maxTemperature >= 85 
            ? 'border-red-500/60 text-red-400 bg-red-950/20' 
            : 'border-[#1E2D4A] text-slate-200'
        }`}>
          <Flame className={`w-3.5 h-3.5 ${thermalTelemetry.maxTemperature >= 85 ? 'text-red-400 animate-pulse' : 'text-[#F59E0B]'}`} />
          <span className="text-slate-400">TJ:</span>
          <span className="font-semibold">{thermalTelemetry.maxTemperature.toFixed(1)}°C</span>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] ${
          isCritical
            ? 'bg-red-500/10 border-red-500/40 text-red-400'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {isCritical ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{activeFaults.length > 0 ? `${activeFaults.length} FAULT ACTIVE` : 'THROTTLED'}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>NOMINAL EFFICIENCY</span>
            </>
          )}
        </div>
      </div>

      {/* Right Controls & Camera Presets */}
      <div className="flex items-center gap-2">
        {/* Auto Run Play/Pause */}
        <button
          onClick={toggleAutoRun}
          title={isAutoRunning ? 'Pause Instruction Stream' : 'Run Instruction Stream'}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            isAutoRunning 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 hover:bg-[#00E5FF]/30'
          }`}
        >
          {isAutoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isAutoRunning ? 'PAUSE' : 'RUN'}</span>
        </button>

        {/* Camera Preset Group */}
        <div className="flex items-center bg-[#101A2C] border border-[#1E2D4A] rounded p-0.5">
          <button
            onClick={() => setCameraPreset('isometric')}
            title="Isometric View"
            className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
              cameraPreset === 'isometric' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ISO
          </button>
          <button
            onClick={() => setCameraPreset('top')}
            title="Top-Down Die View"
            className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
              cameraPreset === 'top' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TOP
          </button>
          <button
            onClick={() => setCameraPreset('closeup')}
            title="Core Close-up View"
            className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
              cameraPreset === 'closeup' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CORE
          </button>
          <button
            onClick={() => setCameraPreset('exploded')}
            title="Exploded Layer View"
            className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
              cameraPreset === 'exploded' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            STACK
          </button>
        </div>

        {/* AI Assistant Quick Pill */}
        <button
          onClick={() => setActiveView('assistant')}
          className={`p-1.5 rounded border transition-colors cursor-pointer ${
            activeView === 'assistant' 
              ? 'bg-[#8B5CF6]/30 text-[#8B5CF6] border-[#8B5CF6]/60' 
              : 'bg-[#101A2C] text-slate-300 border-[#1E2D4A] hover:border-[#8B5CF6]/40 hover:text-[#8B5CF6]'
          }`}
          title="Open Engineering Assistant"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
