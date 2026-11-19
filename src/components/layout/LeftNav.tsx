import React from 'react';
import {
  LayoutDashboard,
  Box,
  Network,
  Layers,
  GitCommit,
  Terminal,
  ShieldAlert,
  Flame,
  LineChart,
  Bot,
  BookOpen
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { ViewMode } from '@/types';

interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const LeftNav: React.FC = () => {
  const { activeView, setActiveView, activeFaults, thermalTelemetry } = useSimulationStore();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'explorer', label: 'Chip Explorer', icon: Box },
    { id: 'architecture', label: 'Architecture Studio', icon: Network },
    { id: 'dissection', label: 'Layer Dissection', icon: Layers },
    { id: 'signal-flow', label: 'Signal Flow Lab', icon: GitCommit, badge: 'PIPELINE', badgeColor: 'text-[#00E5FF] bg-[#00E5FF]/10' },
    { id: 'instruction-sim', label: 'Instruction Sim', icon: Terminal, badge: 'ASM', badgeColor: 'text-[#387BFF] bg-[#387BFF]/10' },
    { 
      id: 'fault-lab', 
      label: 'Fault Injection Lab', 
      icon: ShieldAlert, 
      badge: activeFaults.length > 0 ? `${activeFaults.length} ERR` : undefined,
      badgeColor: 'text-red-400 bg-red-500/10'
    },
    { 
      id: 'thermal', 
      label: 'Thermal Analysis', 
      icon: Flame, 
      badge: `${thermalTelemetry.maxTemperature.toFixed(0)}°C`,
      badgeColor: thermalTelemetry.maxTemperature >= 80 ? 'text-red-400 bg-red-500/10' : 'text-amber-400 bg-amber-500/10'
    },
    { id: 'analytics', label: 'Performance Analytics', icon: LineChart },
    { id: 'assistant', label: 'Engineering AI', icon: Bot, badge: 'AI', badgeColor: 'text-[#8B5CF6] bg-[#8B5CF6]/10' },
    { id: 'docs', label: 'Scenario Library', icon: BookOpen }
  ];

  return (
    <aside className="w-60 bg-[#0B1220]/95 border-r border-[#1E2D4A] flex flex-col justify-between select-none z-20 backdrop-blur-md">
      {/* Navigation List */}
      <div className="py-3 px-2 space-y-0.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
          Workstation Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#101A2C] text-[#00E5FF] border border-[#00E5FF]/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#101A2C]/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00E5FF]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border border-current/20 ${item.badgeColor || 'text-slate-400 bg-slate-800'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Die Spec Micro-card */}
      <div className="p-3 border-t border-[#1E2D4A] bg-[#070B14]/80">
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>PROCESS TECH</span>
          <span className="text-[#00E5FF]">3nm FinFET</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-400">
          <div>Die: <span className="text-slate-200">64.5 mm²</span></div>
          <div>Gates: <span className="text-slate-200">5.8B</span></div>
          <div>TDP: <span className="text-slate-200">95W</span></div>
          <div>VCore: <span className="text-slate-200">1.12 V</span></div>
        </div>
      </div>
    </aside>
  );
};
