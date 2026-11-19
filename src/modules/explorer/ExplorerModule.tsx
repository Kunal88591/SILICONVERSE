import React, { useState } from 'react';
import { 
  Layers, 
  Eye, 
  RotateCcw,
  Sliders,
  Check,
  ChevronDown
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';
import { ChipComponentId } from '@/types';

export const ExplorerModule: React.FC = () => {
  const {
    selectedComponentId,
    setSelectedComponentId,
    isIsolated,
    setIsIsolated,
    setCameraPreset,
    layerVisibility,
    toggleLayerVisibility,
    resetLayers,
    explodedProgress,
    setExplodedProgress
  } = useSimulationStore();

  const [showLayerMenu, setShowLayerMenu] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 p-5 flex flex-col justify-between">
      {/* Top Floating Glass Bar */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        {/* Subtle status hint */}
        <div className="flex items-center gap-2 bg-[#080D1A]/80 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/[0.08] shadow-lg text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span>Click any 3D component to inspect • Left-click drag to rotate • Scroll to zoom</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 bg-[#080D1A]/80 backdrop-blur-xl p-1.5 rounded-xl border border-white/[0.08] shadow-lg">
          {/* Quick Component Picker Dropdown */}
          <div className="relative">
            <select
              value={selectedComponentId || ''}
              onChange={(e) => setSelectedComponentId(e.target.value ? (e.target.value as ChipComponentId) : null)}
              className="bg-[#101728] border border-white/[0.08] text-xs font-medium text-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer pr-6"
            >
              <option value="">Select Chip Component...</option>
              {Object.values(CHIP_COMPONENTS).map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0B1220]">
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Isolate Part */}
          <button
            onClick={() => setIsIsolated(!isIsolated)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isIsolated
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
            title="Isolate selected component and dim others"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isIsolated ? 'Isolated' : 'Isolate'}</span>
          </button>

          {/* Layer Controls Toggle */}
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              showLayerMenu
                ? 'bg-[#387BFF]/20 text-[#387BFF] border border-[#387BFF]/40'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layers</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={() => {
              setCameraPreset('isometric');
              setSelectedComponentId(null);
              resetLayers();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Reset All"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer Visibility Menu Drawer */}
      {showLayerMenu && (
        <div className="absolute top-18 right-5 w-64 bg-[#080D1A]/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-4 shadow-2xl pointer-events-auto space-y-3 font-sans text-xs z-30">
          <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider border-b border-white/[0.08] pb-2 font-bold flex justify-between items-center">
            <span>Physical Layer Stacks</span>
            <button onClick={() => setShowLayerMenu(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-1.5">
            {(
              [
                { key: 'package', label: 'Metal Heat Lid (IHS)' },
                { key: 'interconnect', label: 'Data Bus Highway' },
                { key: 'functional', label: 'Active Silicon Logic' },
                { key: 'die', label: 'Monolithic Silicon Die' },
                { key: 'substrate', label: 'BGA Carrier Substrate' }
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                onClick={() => toggleLayerVisibility(item.key)}
                className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer text-slate-200 transition-colors"
              >
                <span>{item.label}</span>
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                  layerVisibility[item.key] ? 'bg-[#00E5FF] text-[#050811]' : 'bg-slate-700 text-slate-400'
                }`}>
                  {layerVisibility[item.key] && <Check className="w-3 h-3" />}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Separation Slider */}
          <div className="pt-2 border-t border-white/[0.08] space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Stack Separation:</span>
              <span className="text-[#00E5FF] font-bold">{Math.round(explodedProgress * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={explodedProgress}
              onChange={(e) => setExplodedProgress(Number(e.target.value))}
              className="w-full accent-[#00E5FF] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Empty bottom space to allow 3D Canvas toolbar to shine */}
      <div />
    </div>
  );
};
