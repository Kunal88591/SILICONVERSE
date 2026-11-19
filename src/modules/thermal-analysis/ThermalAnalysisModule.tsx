import React from 'react';
import { 
  Flame, 
  Wind, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Info,
  RotateCcw
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';
import { ChipComponentId } from '@/types';

export const ThermalAnalysisModule: React.FC = () => {
  const {
    workloadPercent,
    setWorkloadPercent,
    coolingEfficiency,
    setCoolingEfficiency,
    thermalTelemetry,
    setSelectedComponentId
  } = useSimulationStore();

  const hotspotMeta = CHIP_COMPONENTS[thermalTelemetry.hotspotComponentId];
  const isThrottled = thermalTelemetry.throttlingActive;

  const getHeatmapColor = (temp: number) => {
    if (temp <= 35) return 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/30';
    if (temp <= 55) return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30';
    if (temp <= 75) return 'text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/30';
    if (temp <= 90) return 'text-[#F97316] bg-[#F97316]/10 border-[#F97316]/30';
    return 'text-[#EF4444] bg-[#EF4444]/20 border-[#EF4444]/50 animate-pulse font-bold';
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-5">
      {/* Top Floating Glass Thermal Controls */}
      <div className="bg-[#080D1A]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-4 shadow-2xl pointer-events-auto max-w-4xl mx-auto w-full space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
          <div className="flex items-center gap-2 text-amber-400">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase">
              LIVE THERMAL HEATMAP & DYNAMIC THROTTLING
            </span>
          </div>

          {/* Throttling Alert Badge */}
          <div className={`px-3 py-1 rounded-full border text-xs font-mono font-semibold flex items-center gap-1.5 ${
            isThrottled
              ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            {isThrottled ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>PROCHOT# (THROTTLED AT 1.4 GHz)</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SAFE THERMAL MARGIN</span>
              </>
            )}
          </div>
        </div>

        {/* Sliders and Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          {/* Workload Slider */}
          <div className="bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>Workload:</span>
              </span>
              <span className="text-yellow-400 font-bold">{workloadPercent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={workloadPercent}
              onChange={(e) => setWorkloadPercent(Number(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer h-1.5 bg-white/[0.1] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Idle</span>
              <span>100% Stress</span>
            </div>
          </div>

          {/* Cooling Fan Slider */}
          <div className="bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Cooling:</span>
              </span>
              <span className="text-[#00E5FF] font-bold">{coolingEfficiency}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={coolingEfficiency}
              onChange={(e) => setCoolingEfficiency(Number(e.target.value))}
              className="w-full accent-[#00E5FF] cursor-pointer h-1.5 bg-white/[0.1] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>{thermalTelemetry.fanRpm} RPM</span>
              <span>100% Cryo</span>
            </div>
          </div>

          {/* Hotspot Location */}
          <div className="bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider flex justify-between">
              <span>HOTSPOT</span>
              <Flame className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className={`text-xl font-bold ${thermalTelemetry.maxTemperature >= 85 ? 'text-red-400' : 'text-slate-100'}`}>
              {thermalTelemetry.maxTemperature.toFixed(1)}°C
            </div>
            <div className="text-[10px] text-amber-400 truncate">
              Core: {hotspotMeta?.name}
            </div>
          </div>

          {/* Average Die Temp */}
          <div className="bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider flex justify-between">
              <span>DIE AVERAGE</span>
              <Activity className="w-3.5 h-3.5 text-[#387BFF]" />
            </div>
            <div className="text-xl font-bold text-slate-100">
              {thermalTelemetry.avgTemperature.toFixed(1)}°C
            </div>
            <div className="text-[10px] text-slate-400">
              Ambient: {thermalTelemetry.ambientTemp.toFixed(1)}°C
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick Thermal Badges List */}
      <div className="bg-[#080D1A]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-3 shadow-2xl pointer-events-auto max-w-4xl mx-auto w-full mb-16 overflow-x-auto">
        <div className="flex items-center gap-2 text-xs font-mono">
          {(Object.keys(CHIP_COMPONENTS) as ChipComponentId[]).map((id) => {
            const comp = CHIP_COMPONENTS[id];
            const temp = thermalTelemetry.componentTemperatures[id] || 35;
            const isHotspot = thermalTelemetry.hotspotComponentId === id;

            return (
              <button
                key={id}
                onClick={() => setSelectedComponentId(id)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${getHeatmapColor(temp)}`}
              >
                <span>{comp.name}:</span>
                <span className="font-bold">{temp.toFixed(1)}°C</span>
                {isHotspot && <span className="text-[9px] px-1 rounded bg-red-500 text-white font-bold">HOT</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
