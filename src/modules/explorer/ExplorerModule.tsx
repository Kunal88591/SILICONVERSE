import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Eye, 
  Compass, 
  Maximize2, 
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
    { id: 'all', label: 'All Units' },
    { id: 'execution', label: 'Execution' },
    { id: 'control', label: 'Control' },
    { id: 'storage', label: 'Caches & Regs' },
    { id: 'interconnect', label: 'Interconnect' },
    { id: 'timing', label: 'Timing & Clock' }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-4">
      {/* Top Floating Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Category Filter Pills */}
        <div className="flex items-center bg-[#0B1220]/90 backdrop-blur-md p-1 rounded-lg border border-[#1E2D4A] shadow-lg">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
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
        <div className="flex items-center gap-2 bg-[#0B1220]/90 backdrop-blur-md p-1 rounded-lg border border-[#1E2D4A] shadow-lg">
          {/* Isolation Switch */}
          <button
            onClick={() => setIsIsolated(!isIsolated)}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isIsolated
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#101A2C]'
            }`}
            title="Isolate selected component and dim others"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isIsolated ? 'Isolated' : 'Isolate'}</span>
          </button>

          {/* Layer Visibility Menu Toggle */}
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              showLayerMenu
                ? 'bg-[#387BFF]/20 text-[#387BFF] border border-[#387BFF]/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#101A2C]'
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
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#101A2C] transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer Toggle Dropdown Drawer */}
      {showLayerMenu && (
        <div className="absolute top-16 right-4 w-60 bg-[#0B1220]/95 backdrop-blur-md border border-[#1E2D4A] rounded-xl p-3 shadow-2xl pointer-events-auto space-y-2 font-mono text-xs z-30">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-[#1E2D4A] pb-1.5">
            Architectural Layers
          </div>
          <div className="space-y-1.5">
            {(
              [
                { key: 'package', label: 'Metallic Heat Lid' },
                { key: 'interconnect', label: 'Coherent Bus Interconnect' },
                { key: 'functional', label: 'Functional Silicon Blocks' },
                { key: 'die', label: 'Silicon Die Wafer' },
                { key: 'substrate', label: 'BGA Ceramic Substrate' }
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                onClick={() => toggleLayerVisibility(item.key)}
                className="flex items-center justify-between p-1.5 rounded bg-[#101A2C] hover:bg-[#16243D] cursor-pointer text-slate-300"
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
          <div className="pt-2 border-t border-[#1E2D4A] space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Stack Separation:</span>
              <span className="text-[#00E5FF]">{Math.round(explodedProgress * 100)}%</span>
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

      {/* Bottom Floating Quick Component Switcher Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pointer-events-auto max-w-full">
        {(Object.keys(CHIP_COMPONENTS) as ChipComponentId[])
          .filter((id) => selectedCategory === 'all' || CHIP_COMPONENTS[id].category === selectedCategory)
          .map((id) => {
            const comp = CHIP_COMPONENTS[id];
            const isSelected = selectedComponentId === id;

            return (
              <button
                key={id}
                onClick={() => setSelectedComponentId(isSelected ? null : id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md ${
                  isSelected
                    ? 'bg-[#00E5FF] text-[#070B14] font-semibold border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'bg-[#0B1220]/85 text-slate-300 border-[#1E2D4A] hover:border-[#00E5FF]/40 hover:bg-[#101A2C]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
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
