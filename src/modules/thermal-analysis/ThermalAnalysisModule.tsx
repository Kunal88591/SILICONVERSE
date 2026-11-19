import React from 'react';
import { 
  Flame, 
  Wind, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Gauge, 
  Zap, 
  Sliders, 
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

  const getHeatmapClass = (temp: number) => {
    if (temp <= 35) return 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/30';
    if (temp <= 55) return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30';
    if (temp <= 75) return 'text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/30';
    if (temp <= 90) return 'text-[#F97316] bg-[#F97316]/10 border-[#F97316]/30';
    return 'text-[#EF4444] bg-[#EF4444]/20 border-[#EF4444]/50 animate-pulse';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full text-slate-200">
      {/* Header */}
      <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400">
            <Flame className="w-4 h-4" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              THERMAL DISSIPATION & DYNAMIC THROTTLING LAB
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 mt-0.5">
            Junction Temperature & Heat Diffusion Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Deterministic thermal modeling based on capacitive switching power and convective heat transfer. Adjust workload intensity and active cooling fan velocity.
          </p>
        </div>

        {/* Throttling Alert Badge */}
        <div className={`px-4 py-2.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-2 ${
          isThrottled
            ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        }`}>
          {isThrottled ? (
            <>
              <AlertTriangle className="w-4 h-4" />
              <span>PROCHOT# ASSERTED (CORE THROTTLED)</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>THERMAL MARGIN NOMINAL</span>
            </>
          )}
        </div>
      </div>

      {/* Main Sliders & Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Workload Slider */}
        <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Processing Workload:</span>
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
            className="w-full accent-yellow-400 cursor-pointer h-2 bg-[#101A2C] rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% Idle</span>
            <span>50% Typical</span>
            <span>100% Synthetic Stress</span>
          </div>
        </div>

        {/* Cooling Efficiency Slider */}
        <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Cooling Solution:</span>
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
            className="w-full accent-[#00E5FF] cursor-pointer h-2 bg-[#101A2C] rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Fan: {thermalTelemetry.fanRpm} RPM</span>
            <span>100% Liquid Cryo</span>
          </div>
        </div>

        {/* Peak Hotspot Gauge */}
        <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-4 space-y-1 font-mono">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>HOTSPOT TEMPERATURE</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className={`text-2xl font-bold mt-1 ${thermalTelemetry.maxTemperature >= 85 ? 'text-red-400' : 'text-slate-100'}`}>
            {thermalTelemetry.maxTemperature.toFixed(1)}°C
          </div>
          <div className="text-xs text-amber-400 mt-0.5 truncate">
            Location: {hotspotMeta?.name}
          </div>
        </div>

        {/* Average Die Temperature */}
        <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-4 space-y-1 font-mono">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>AVERAGE DIE TJ</span>
            <Activity className="w-3.5 h-3.5 text-[#387BFF]" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {thermalTelemetry.avgTemperature.toFixed(1)}°C
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Ambient: {thermalTelemetry.ambientTemp.toFixed(1)}°C
          </div>
        </div>
      </div>

      {/* Component Temperatures Table & Heatmap Legend */}
      <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2D4A] pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-100">Live Component Thermal Map</h2>
            <p className="text-xs text-slate-400">
              Discrete silicon junction temperatures across all functional blocks.
            </p>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-[#1E3A8A] text-white">Cool &lt;35°</span>
            <span className="px-1.5 py-0.5 rounded bg-[#06B6D4] text-[#070B14]">Nominal 50°</span>
            <span className="px-1.5 py-0.5 rounded bg-[#EAB308] text-[#070B14]">Warm 70°</span>
            <span className="px-1.5 py-0.5 rounded bg-[#F97316] text-[#070B14]">Hot 85°</span>
            <span className="px-1.5 py-0.5 rounded bg-[#EF4444] text-white">Critical 100°+</span>
          </div>
        </div>

        {/* 11 Component Thermal Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {(Object.keys(CHIP_COMPONENTS) as ChipComponentId[]).map((id) => {
            const comp = CHIP_COMPONENTS[id];
            const temp = thermalTelemetry.componentTemperatures[id] || 35;
            const isHotspot = thermalTelemetry.hotspotComponentId === id;

            return (
              <div
                key={id}
                onClick={() => setSelectedComponentId(id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${getHeatmapClass(temp)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{comp.name}</span>
                  {isHotspot && (
                    <span className="text-[9px] font-mono px-1 rounded bg-red-500 text-white font-bold">
                      HOTSPOT
                    </span>
                  )}
                </div>

                <div className="text-lg font-bold font-mono mt-1">
                  {temp.toFixed(1)}°C
                </div>

                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>Rating: {comp.powerRating}</span>
                  <span>{comp.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simplified Thermodynamic Equations Documentation Box */}
      <div className="bg-[#101A2C] border border-[#1E2D4A] rounded-xl p-4 text-xs font-mono text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-[#00E5FF]">
          <Info className="w-4 h-4" />
          <span className="font-bold uppercase tracking-wider">Governing Thermal Equations & Physics</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Dynamic power dissipation is governed by <code className="text-[#00E5FF]">P = C_eff · V² · f + P_leakage(T)</code>. Heat conduction follows Fourier's law with thermal resistance theta: <code className="text-[#00E5FF]">T_j = T_ambient + P · Theta_JA · (1 - Cooling_eff)</code>. When junction temperature breaches 92°C, the processor asserts hardware signal <code className="text-red-400">PROCHOT#</code> to enforce dynamic frequency downclocking.
        </p>
      </div>
    </div>
  );
};
