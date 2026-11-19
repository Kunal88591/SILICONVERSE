import React, { useEffect, useState } from 'react';
import { useSimulationStore } from '@/stores/simulationStore';
import { TopNav } from '@/components/layout/TopNav';
import { RightInspector } from '@/components/layout/RightInspector';
import { SemiconductorScene } from '@/scenes/SemiconductorScene';

// View Modules
import { ExplorerModule } from '@/modules/explorer/ExplorerModule';
import { DissectionModule } from '@/modules/dissection/DissectionModule';
import { SignalFlowModule } from '@/modules/signal-flow/SignalFlowModule';
import { InstructionSimulatorModule } from '@/modules/instruction-simulator/InstructionSimulatorModule';
import { FaultLabModule } from '@/modules/fault-lab/FaultLabModule';
import { ThermalAnalysisModule } from '@/modules/thermal-analysis/ThermalAnalysisModule';
import { PerformanceAnalyticsModule } from '@/modules/analytics/PerformanceAnalyticsModule';
import { EngineeringAssistantModule } from '@/modules/assistant/EngineeringAssistantModule';
import { DocsAndScenariosModule } from '@/modules/docs/DocsAndScenariosModule';

export const App: React.FC = () => {
  const {
    activeView,
    tickTelemetry,
    isAutoRunning,
    stepPipelineStage,
    executionSpeedMs
  } = useSimulationStore();

  // Background Telemetry Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      tickTelemetry();
    }, 1500);
    return () => clearInterval(timer);
  }, [tickTelemetry]);

  // Automated Pipeline Execution Stepper
  useEffect(() => {
    if (!isAutoRunning) return;
    const interval = setInterval(() => {
      stepPipelineStage();
    }, executionSpeedMs);
    return () => clearInterval(interval);
  }, [isAutoRunning, stepPipelineStage, executionSpeedMs]);

  // 3D-centric views where the 3D canvas is full-screen
  const is3DView = 
    activeView === 'explorer' || 
    activeView === 'dissection' || 
    activeView === 'signal-flow' || 
    activeView === 'thermal';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#050811] text-slate-100 font-sans antialiased">
      {/* 1. ULTRA-SLEEK PROFESSIONAL TOP NAVIGATION */}
      <TopNav />

      {/* 2. FULL-VIEWPORT WORKSPACE */}
      <main className="flex-1 relative w-full h-full overflow-hidden bg-[#050811]">
        {/* Full-bleed 3D Semiconductor Scene (Always active and visible in 3D views) */}
        <div className={`w-full h-full absolute inset-0 transition-opacity duration-500 ${is3DView ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'}`}>
          <SemiconductorScene />
        </div>

        {/* Floating Contextual Modules Layer */}
        {activeView === 'explorer' && <ExplorerModule />}
        {activeView === 'dissection' && <DissectionModule />}
        {activeView === 'signal-flow' && <SignalFlowModule />}
        {activeView === 'thermal' && <ThermalAnalysisModule />}

        {/* Dedicated Fullscreen Lab Views (Clean glass cards with back button to 3D) */}
        {activeView === 'instruction-sim' && (
          <div className="relative z-10 w-full h-full bg-[#050811]/95 backdrop-blur-xl overflow-y-auto">
            <InstructionSimulatorModule />
          </div>
        )}
        {activeView === 'fault-lab' && (
          <div className="relative z-10 w-full h-full bg-[#050811]/95 backdrop-blur-xl overflow-y-auto">
            <FaultLabModule />
          </div>
        )}
        {activeView === 'analytics' && (
          <div className="relative z-10 w-full h-full bg-[#050811]/95 backdrop-blur-xl overflow-y-auto">
            <PerformanceAnalyticsModule />
          </div>
        )}
        {activeView === 'assistant' && (
          <div className="relative z-10 w-full h-full bg-[#050811]/95 backdrop-blur-xl overflow-y-auto">
            <EngineeringAssistantModule />
          </div>
        )}
        {activeView === 'docs' && (
          <div className="relative z-10 w-full h-full bg-[#050811]/95 backdrop-blur-xl overflow-y-auto">
            <DocsAndScenariosModule />
          </div>
        )}

        {/* Right Contextual Component Dossier (Appears only when clicked) */}
        <RightInspector />
      </main>
    </div>
  );
};

export default App;
