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
  BookOpen,
  Info
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
    { id: 'explorer', label: '3D Chip Tour', icon: Cpu },
    { id: 'dissection', label: 'Explode Layers', icon: Layers },
    { id: 'signal-flow', label: 'Pipeline & Data', icon: GitCommit },
    { id: 'instruction-sim', label: 'Assembly Code', icon: Terminal },
    { 
      id: 'fault-lab', 
      label: 'Fault Testing', 
      icon: ShieldAlert, 
      badge: activeFaults.length > 0 ? `${activeFaults.length} Err` : undefined,
      badgeColor: 'text-red-400 bg-red-500/20'
    },
    { 
      id: 'thermal', 
      label: 'Thermal Heat', 
      icon: Flame, 
      badge: `${thermalTelemetry.maxTemperature.toFixed(0)}°`,
      badgeColor: thermalTelemetry.maxTemperature >= 80 ? 'text-red-400 bg-red-500/20' : 'text-amber-400 bg-amber-500/20'
    },
    { id: 'analytics', label: 'Performance', icon: LineChart },
    { id: 'assistant', label: 'Engineering AI', icon: Bot },
    { id: 'docs', label: 'Experiment Guide', icon: BookOpen }
  ];

  return (
    <aside className="w-56 bg-[#0B1220]/95 border-r border-[#1E2D4A] flex flex-col justify-between select-none z-20 backdrop-blur-md">
      {/* Navigation List */}
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          Workstation Views
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00E5FF] text-[#070B14] font-semibold shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#101A2C]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#070B14]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-[#070B14] text-[#00E5FF]' : item.badgeColor
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Helpful Hint Card at bottom */}
      <div className="p-4 border-t border-[#1E2D4A] bg-[#070B14]/60 m-2 rounded-xl">
        <div className="flex items-center gap-1.5 text-xs text-[#00E5FF] font-semibold mb-1">
          <Info className="w-3.5 h-3.5" />
          <span>Quick Tip</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          Click any component on the 3D chip to learn what it does in simple terms.
        </p>
      </div>
    </aside>
  );
};
