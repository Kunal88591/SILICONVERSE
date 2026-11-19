import React from 'react';
import { 
  Cpu, 
  Layers, 
  GitCommit, 
  Terminal, 
  ShieldAlert, 
  Flame, 
  LineChart, 
  Bot, 
  Sparkles,
  ChevronDown,
  Activity
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { GUIDED_SCENARIOS } from '@/data/scenarios';
import { ViewMode } from '@/types';

export const TopNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeScenarioId,
    loadScenario,
    thermalTelemetry,
    activeFaults
  } = useSimulationStore();

  const isCritical = thermalTelemetry.throttlingActive || activeFaults.length > 0;

  const navItems: Array<{ id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'explorer', label: '3D Explore', icon: Cpu },
    { id: 'dissection', label: 'Exploded View', icon: Layers },
    { id: 'signal-flow', label: 'Data Flow', icon: GitCommit },
    { id: 'fault-lab', label: 'Fault Test', icon: ShieldAlert },
    { id: 'thermal', label: 'Thermals', icon: Flame },
    { id: 'instruction-sim', label: 'Assembly Lab', icon: Terminal },
    { id: 'analytics', label: 'Telemetry', icon: LineChart }
  ];

  return (
    <header className="h-14 bg-[#080D1A]/90 backdrop-blur-xl border-b border-white/[0.08] px-5 flex items-center justify-between z-40 select-none shadow-xl">
      {/* Brand & Processor Badge */}
      <div 
        onClick={() => setActiveView('explorer')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF]/20 to-[#387BFF]/20 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.25)] group-hover:scale-105 transition-all">
          <Cpu className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-sm tracking-widest text-white uppercase group-hover:text-[#00E5FF] transition-colors">
            SILICON<span className="text-[#00E5FF]">VERSE</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-slate-300">
            Quantum-X9 • 4.80 GHz
          </span>
        </div>
      </div>

      {/* Center Segmented Glass Nav Pill */}
      <nav className="flex items-center gap-1 bg-[#101728]/80 p-1 rounded-xl border border-white/[0.06] shadow-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00E5FF] text-[#050811] font-semibold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Guided Demos + Live Telemetry Badge + AI Assistant */}
      <div className="flex items-center gap-2.5">
        {/* Guided Tour Dropdown */}
        <div className="relative flex items-center bg-[#101728]/80 px-2.5 py-1.5 rounded-lg border border-white/[0.06] text-xs">
          <span className="text-slate-400 font-mono text-[11px] mr-1.5 hidden md:inline">Demo:</span>
          <select
            value={activeScenarioId || ''}
            onChange={(e) => loadScenario(e.target.value)}
            className="bg-transparent text-slate-200 font-medium text-xs outline-none cursor-pointer pr-4"
          >
            {GUIDED_SCENARIOS.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0B1220] text-slate-200">
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#101728]/80 border border-white/[0.06] text-xs font-mono">
          <Flame className={`w-3.5 h-3.5 ${thermalTelemetry.maxTemperature >= 85 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
          <span className="text-slate-200 font-semibold">{thermalTelemetry.maxTemperature.toFixed(0)}°C</span>
          <span className="text-slate-600">•</span>
          <span className={isCritical ? 'text-red-400 font-bold' : 'text-emerald-400'}>
            {isCritical ? (activeFaults.length > 0 ? `${activeFaults.length} FAULT` : 'THROTTLED') : 'NOMINAL'}
          </span>
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={() => setActiveView(activeView === 'assistant' ? 'explorer' : 'assistant')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
            activeView === 'assistant'
              ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.4)]'
              : 'bg-[#101728]/80 text-[#8B5CF6] border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/15'
          }`}
          title="Ask Engineering AI"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>
      </div>
    </header>
  );
};
