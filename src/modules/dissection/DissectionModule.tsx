import React from 'react';
import { 
  Layers, 
  Eye, 
  RotateCcw, 
  ChevronRight, 
  Sliders, 
  Check, 
  Maximize2,
  Sparkles,
  Info
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
      name: 'Integrated Heat Spreader (IHS)',
      description: 'Nickel-plated electrolytic copper protective lid designed to uniformly conduct thermal energy from the silicon die to the external liquid cooling solution.',
      yOffset: `+${(0.6 + explodedProgress * 3.5).toFixed(2)} units`,
      color: '#64748B'
    },
    {
      id: 'interconnect',
      name: 'Metal Interconnect & Crossbar Layer',
      description: 'Multilevel low-capacitance copper/ruthenium interconnect lines transporting gigabytes-per-second bus traffic and high-speed clock pulses.',
      yOffset: `+${(0.35 + explodedProgress * 2.2).toFixed(2)} units`,
      color: '#00E5FF'
    },
    {
      id: 'functional',
      name: 'Active Transistor Functional Blocks',
      description: '3nm FinFET monolithic silicon layer housing 5.8 billion logic gates divided into execution, control, cache, and timing sectors.',
      yOffset: `+${(explodedProgress * 1.5).toFixed(2)} units`,
      color: '#387BFF'
    },
    {
      id: 'die',
      name: 'Silicon Die Wafer & Ground Shield',
      description: 'High-purity monocrystalline silicon substrate wafer with boron-doped guard rings for substrate noise isolation.',
      yOffset: '0.00 units (Baseline)',
      color: '#0F172A'
    },
    {
      id: 'substrate',
      name: 'Ceramic Packaging Substrate & BGA',
      description: 'Multi-layer bismaleimide-triazine (BT) laminate substrate with ball-grid-array (BGA) solder contacts interfacing with the socket motherboard.',
      yOffset: `-${(explodedProgress * 1.8).toFixed(2)} units`,
      color: '#10B981'
    }
  ] as const;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-6">
      {/* Left Control Card: Separation Slider & Presets */}
      <div className="w-80 bg-[#0B1220]/95 backdrop-blur-md border border-[#1E2D4A] rounded-xl p-5 shadow-2xl pointer-events-auto space-y-4">
        <div className="border-b border-[#1E2D4A] pb-3">
          <div className="flex items-center gap-2 text-[#00E5FF]">
            <Layers className="w-4 h-4" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              LAYER DISSECTION STUDIO
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-100 tracking-wide mt-1">
            Exploded Chip Stack
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Separate the semiconductor packaging into distinct physical layers along the Y vertical axis.
          </p>
        </div>

        {/* Continuous Separation Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Exploded Separation:</span>
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
            className="w-full accent-[#00E5FF] cursor-pointer h-2 bg-[#101A2C] rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% Compact</span>
            <span>50% Inspect</span>
            <span>100% Fully Exploded</span>
          </div>
        </div>

        {/* Quick Separation Presets */}
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <button
            onClick={() => setExplodedProgress(0)}
            className="py-1.5 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF]/40 text-slate-300 transition-colors cursor-pointer"
          >
            Compact (0%)
          </button>
          <button
            onClick={() => setExplodedProgress(0.5)}
            className="py-1.5 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-[#00E5FF]/40 text-slate-300 transition-colors cursor-pointer"
          >
            Mid (50%)
          </button>
          <button
            onClick={() => {
              setExplodedProgress(1.0);
              setCameraPreset('exploded');
            }}
            className="py-1.5 rounded bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] font-semibold transition-colors cursor-pointer"
          >
            Full (100%)
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={resetLayers}
          className="w-full py-2 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-slate-400 text-slate-300 text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Arrangement & Visibility</span>
        </button>
      </div>

      {/* Right Drawer: Layer Specification Dossier */}
      <div className="w-96 self-end bg-[#0B1220]/95 backdrop-blur-md border border-[#1E2D4A] rounded-xl p-5 shadow-2xl pointer-events-auto space-y-3 max-h-[80vh] overflow-y-auto">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#1E2D4A] pb-2 flex items-center justify-between">
          <span>Architectural Layer Hierarchy</span>
          <span className="text-[#00E5FF]">5 Tiers</span>
        </div>

        <div className="space-y-2.5">
          {layersInfo.map((l) => {
            const isVisible = layerVisibility[l.id];

            return (
              <div
                key={l.id}
                className={`p-3 rounded-lg border transition-all ${
                  isVisible
                    ? 'bg-[#101A2C] border-[#1E2D4A]'
                    : 'bg-[#101A2C]/40 border-[#1E2D4A]/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-xs font-semibold text-slate-100">{l.name}</span>
                  </div>
                  <button
                    onClick={() => toggleLayerVisibility(l.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border cursor-pointer ${
                      isVisible
                        ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isVisible ? 'VISIBLE' : 'HIDDEN'}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  {l.description}
                </p>

                <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between pt-1 border-t border-[#1E2D4A]/50">
                  <span>Relative Position:</span>
                  <span className="text-slate-300">{l.yOffset}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
