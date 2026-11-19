import React from 'react';
import { 
  Layers, 
  RotateCcw, 
  Sliders, 
  Check, 
  Sparkles
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';

export const DissectionModule: React.FC = () => {
  const {
    explodedProgress,
    setExplodedProgress,
    layerVisibility,
    toggleLayerVisibility,
    resetLayers,
    setCameraPreset
  } = useSimulationStore();

  const layersInfo = [
    {
      id: 'package',
      name: 'Heat Spreader Lid (IHS)',
      role: 'Conducts heat from the silicon die outward.',
      yOffset: `+${(1.2 + explodedProgress * 3.5).toFixed(2)}`,
      color: '#64748B'
    },
    {
      id: 'interconnect',
      name: 'Interconnect Data Bus',
      role: 'High-speed copper crossbar highway carrying data.',
      yOffset: `+${(0.35 + explodedProgress * 2.2).toFixed(2)}`,
      color: '#00E5FF'
    },
    {
      id: 'functional',
      name: 'Active Silicon Cores',
      role: 'The 11 functional compute and memory blocks.',
      yOffset: `+${(explodedProgress * 1.5).toFixed(2)}`,
      color: '#387BFF'
    },
    {
      id: 'die',
      name: 'Monolithic Silicon Die',
      role: 'Pure monocrystalline silicon base wafer.',
      yOffset: '0.00 (Base)',
      color: '#1E293B'
    },
    {
      id: 'substrate',
      name: 'PCB Carrier & BGA Balls',
      role: 'Connects electrical pins to the socket motherboard.',
      yOffset: `-${(explodedProgress * 1.8).toFixed(2)}`,
      color: '#10B981'
    }
  ] as const;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-6">
      {/* Left Floating Explode Control Glass Card */}
      <div className="w-80 bg-[#080D1A]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 shadow-2xl pointer-events-auto space-y-4">
        <div className="border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2 text-[#00E5FF]">
            <Layers className="w-4 h-4" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
              EXPLODED ARCHITECTURE
            </span>
          </div>
          <h2 className="text-base font-bold text-white tracking-wide mt-1">
            Layer Dissection
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Separate the semiconductor packaging into distinct physical layers along the Y axis.
          </p>
        </div>

        {/* Continuous Separation Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Separation Distance:</span>
            <span className="text-[#00E5FF] font-bold text-sm">
              {Math.round(explodedProgress * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={explodedProgress}
            onChange={(e) => setExplodedProgress(Number(e.target.value))}
            className="w-full accent-[#00E5FF] cursor-pointer h-2 bg-white/[0.06] rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Compact (0%)</span>
            <span>Mid (50%)</span>
            <span>Fully Exploded (100%)</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <button
            onClick={() => setExplodedProgress(0)}
            className="py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#00E5FF]/40 text-slate-300 transition-colors cursor-pointer"
          >
            Compact
          </button>
          <button
            onClick={() => setExplodedProgress(0.5)}
            className="py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#00E5FF]/40 text-slate-300 transition-colors cursor-pointer"
          >
            50%
          </button>
          <button
            onClick={() => {
              setExplodedProgress(1.0);
              setCameraPreset('exploded');
            }}
            className="py-1.5 rounded-lg bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] font-semibold transition-colors cursor-pointer"
          >
            100%
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={resetLayers}
          className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-slate-400 text-slate-300 text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Arrangement</span>
        </button>
      </div>

      {/* Right Drawer: Layer Specification */}
      <div className="w-80 self-end bg-[#080D1A]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-4 shadow-2xl pointer-events-auto space-y-2.5 max-h-[75vh] overflow-y-auto">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/[0.08] pb-2 flex items-center justify-between font-bold">
          <span>Physical Layers</span>
          <span className="text-[#00E5FF]">5 Tiers</span>
        </div>

        <div className="space-y-2">
          {layersInfo.map((l) => {
            const isVisible = layerVisibility[l.id];

            return (
              <div
                key={l.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  isVisible
                    ? 'bg-white/[0.04] border-white/[0.08]'
                    : 'bg-white/[0.02] border-white/[0.04] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-xs font-semibold text-white">{l.name}</span>
                  </div>
                  <button
                    onClick={() => toggleLayerVisibility(l.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border cursor-pointer ${
                      isVisible
                        ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isVisible ? 'ON' : 'OFF'}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {l.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
