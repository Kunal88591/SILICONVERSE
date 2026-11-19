import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Eye, 
  Compass, 
  RotateCcw,
  Sliders,
  Filter,
  Check
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';
import { ComponentCategory, ChipComponentId } from '@/types';

export const ExplorerModule: React.FC = () => {
  const {
    selectedComponentId,
    setSelectedComponentId,
    isIsolated,
    setIsIsolated,
    cameraPreset,
    setCameraPreset,
    layerVisibility,
    toggleLayerVisibility,
    resetLayers,
    explodedProgress,
    setExplodedProgress
  } = useSimulationStore();

  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const categories: Array<{ id: ComponentCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Chip Parts' },
    { id: 'execution', label: 'Execution (ALU)' },
    { id: 'control', label: 'Control & Decode' },
    { id: 'storage', label: 'Caches & Registers' },
    { id: 'interconnect', label: 'Data Bus' },
    { id: 'timing', label: 'Clock & Timing' }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-5">
      {/* Top Floating Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 bg-[#0B1220]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#1E2D4A] shadow-lg">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#00E5FF] text-[#070B14] font-semibold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#101A2C]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Mode & Camera Action Pills */}
        <div className="flex items-center gap-2 bg-[#0B1220]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#1E2D4A] shadow-lg">
          {/* Isolation Switch */}
          <button
            onClick={() => setIsIsolated(!isIsolated)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isIsolated
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#101A2C]'
            }`}
            title="Isolate selected component and dim others"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isIsolated ? 'Isolated' : 'Isolate Part'}</span>
          </button>

          {/* Layer Visibility Menu Toggle */}
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              showLayerMenu
                ? 'bg-[#387BFF]/20 text-[#387BFF] border border-[#387BFF]/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#101A2C]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layers</span>
          </button>

          {/* Reset View */}
          <button
            onClick={() => {
              setCameraPreset('isometric');
              setSelectedComponentId(null);
              resetLayers();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#101A2C] transition-colors cursor-pointer"
            title="Reset All"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer Toggle Dropdown Drawer */}
      {showLayerMenu && (
        <div className="absolute top-18 right-5 w-64 bg-[#0B1220]/95 backdrop-blur-md border border-[#1E2D4A] rounded-2xl p-4 shadow-2xl pointer-events-auto space-y-3 font-sans text-xs z-30">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider border-b border-[#1E2D4A] pb-2 font-bold flex justify-between items-center">
            <span>Physical Chip Layers</span>
            <button onClick={() => setShowLayerMenu(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-1.5">
            {(
              [
                { key: 'package', label: 'Metal Heat Lid (IHS)' },
                { key: 'interconnect', label: 'Data Bus Highway' },
                { key: 'functional', label: 'Silicon Cores & Logic' },
                { key: 'die', label: 'Silicon Die Wafer' },
                { key: 'substrate', label: 'Green PCB & Solder Balls' }
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                onClick={() => toggleLayerVisibility(item.key)}
                className="flex items-center justify-between p-2 rounded-lg bg-[#101A2C] hover:bg-[#16243D] cursor-pointer text-slate-200"
              >
                <span>{item.label}</span>
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                  layerVisibility[item.key] ? 'bg-[#00E5FF] text-[#070B14]' : 'bg-slate-700 text-slate-400'
                }`}>
                  {layerVisibility[item.key] && <Check className="w-3 h-3" />}
                </span>
              </div>
            ))}
          </div>

          {/* Exploded View Mini Slider */}
          <div className="pt-2 border-t border-[#1E2D4A] space-y-1.5">
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

      {/* Floating Quick Component Switcher Carousel (positioned comfortably above bottom toolbar) */}
      <div className="mb-14 flex items-center gap-2 overflow-x-auto pb-1 pointer-events-auto max-w-full">
        {(Object.keys(CHIP_COMPONENTS) as ChipComponentId[])
          .filter((id) => selectedCategory === 'all' || CHIP_COMPONENTS[id].category === selectedCategory)
          .map((id) => {
            const comp = CHIP_COMPONENTS[id];
            const isSelected = selectedComponentId === id;

            return (
              <button
                key={id}
                onClick={() => setSelectedComponentId(isSelected ? null : id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md ${
                  isSelected
                    ? 'bg-[#00E5FF] text-[#070B14] font-semibold border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'bg-[#0B1220]/85 text-slate-300 border-[#1E2D4A] hover:border-[#00E5FF]/40 hover:bg-[#101A2C]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: isSelected ? '#070B14' : comp.color }}
                />
                <span>{comp.name}</span>
              </button>
            );
          })}
      </div>
    </div>
  );
};
