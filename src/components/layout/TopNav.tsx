import React from 'react';
import { 
  Cpu, 
  Activity, 
  Flame, 
  AlertTriangle, 
  Layers, 
  Play, 
  Pause,
  Bot,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  GitCommit,
  Terminal,
  LineChart
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
    activeFaults,
    isAutoRunning,
    toggleAutoRun
  } = useSimulationStore();

  const isThrottled = thermalTelemetry.throttlingActive || activeFaults.length > 0;

  // Clean, high-level user friendly modes
  const primaryModes: Array<{ id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'explorer', label: '3D Chip Tour', icon: Cpu },
    { id: 'dissection', label: 'Explode Layers', icon: Layers },
    { id: 'signal-flow', label: 'Data & Pipeline', icon: GitCommit },
    { id: 'instruction-sim', label: 'Assembly Lab', icon: Terminal },
    { id: 'fault-lab', label: 'Fault Test', icon: ShieldAlert },
    { id: 'thermal', label: 'Thermal Heat', icon: Flame },
    { id: 'analytics', label: 'Performance', icon: LineChart }
  ];

  return (
    <header className="h-16 bg-[#0B1220]/95 border-b border-[#1E2D4A] px-5 flex items-center justify-between select-none z-30 backdrop-blur-md">
      {/* Brand & Title */}
      <div className="flex items-center gap-6">
        <div 
          onClick={() => setActiveView('explorer')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#101A2C] border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] group-hover:border-[#00E5FF] group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wider text-slate-100 group-hover:text-[#00E5FF] transition-colors">
                SILICON<span className="text-[#00E5FF]">VERSE</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] font-mono border border-[#00E5FF]/20">
                Interactive Twin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
              Explore how computer processors work in 3D
            </p>
          </div>
        </div>

        {/* Primary Clean Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#101A2C]/80 p-1 rounded-xl border border-[#1E2D4A]">
          {primaryModes.map((m) => {
            const Icon = m.icon;
            const isActive = activeView === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveView(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00E5FF] text-[#070B14] font-semibold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#16243D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls: Guided Demo Selector & Health Status */}
      <div className="flex items-center gap-3">
        {/* Guided Demo Dropdown */}
        <div className="flex items-center gap-2 bg-[#101A2C] px-3 py-1.5 rounded-xl border border-[#1E2D4A]">
          <span className="text-xs text-slate-400 hidden sm:inline">Guided Tour:</span>
          <select
            value={activeScenarioId || ''}
            onChange={(e) => loadScenario(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-medium outline-none cursor-pointer"
          >
            {GUIDED_SCENARIOS.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0B1220] text-slate-200">
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Health & Temperature Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#101A2C] border border-[#1E2D4A] text-xs font-mono">
          <Flame className={`w-3.5 h-3.5 ${thermalTelemetry.maxTemperature >= 85 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
          <span className="text-slate-300 font-semibold">{thermalTelemetry.maxTemperature.toFixed(0)}°C</span>
          <span className="text-slate-600">•</span>
          <span className={isThrottled ? 'text-red-400 font-bold' : 'text-emerald-400 font-semibold'}>
            {isThrottled ? 'THROTTLED' : 'NOMINAL'}
          </span>
        </div>

        {/* Continuous Signal Play/Pause */}
        <button
          onClick={toggleAutoRun}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            isAutoRunning 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
              : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
          }`}
          title={isAutoRunning ? 'Pause signal animation' : 'Start signal animation'}
        >
          {isAutoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isAutoRunning ? 'Pause Signal' : 'Play Signal'}</span>
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={() => setActiveView('assistant')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
            activeView === 'assistant'
              ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.4)]'
              : 'bg-[#101A2C] text-[#8B5CF6] border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/10'
          }`}
          title="Ask Engineering AI"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden lg:inline">Ask AI</span>
        </button>
      </div>
    </header>
  );
};
