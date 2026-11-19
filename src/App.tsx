import React, { useEffect } from 'react';
import { useSimulationStore } from '@/stores/simulationStore';
import { TopNav } from '@/components/layout/TopNav';
import { LeftNav } from '@/components/layout/LeftNav';
import { RightInspector } from '@/components/layout/RightInspector';
import { BottomStatus } from '@/components/layout/BottomStatus';
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
import { ArchitectureStudioModule } from '@/modules/architecture/ArchitectureStudioModule';
import { OverviewModule } from '@/modules/overview/OverviewModule';

export const App: React.FC = () => {
  const {
    activeView,
    tickTelemetry,
    isAutoRunning,
    stepPipelineStage,
    executionSpeedMs
  } = useSimulationStore();

  // Background Telemetry Ticker (updates rolling telemetry buffer)
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

  // Determine whether current view is 3D scene dominant
  const is3DView = activeView === 'explorer' || activeView === 'dissection' || activeView === 'signal-flow';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070B14] text-slate-200">
      {/* 1. TOP NAVIGATION HEADER */}
      <TopNav />

      {/* 2. MAIN HORIZONTAL SHELL */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation */}
        <LeftNav />

        {/* Central Workspace */}
        <main className="flex-1 relative overflow-hidden bg-[#070B14] flex flex-col">
          {/* Always-mounted 3D Scene (preserves WebGL context and camera state) */}
          <div className={`w-full h-full absolute inset-0 ${is3DView ? 'z-0' : 'hidden pointer-events-none'}`}>
            <SemiconductorScene />
          </div>

          {/* Active View Module Layer */}
          <div className={`relative z-10 w-full h-full overflow-hidden ${is3DView ? 'pointer-events-none' : 'pointer-events-auto'}`}>
            {activeView === 'overview' && <OverviewModule />}
            {activeView === 'explorer' && <ExplorerModule />}
            {activeView === 'architecture' && <ArchitectureStudioModule />}
            {activeView === 'dissection' && <DissectionModule />}
            {activeView === 'signal-flow' && <SignalFlowModule />}
            {activeView === 'instruction-sim' && <InstructionSimulatorModule />}
            {activeView === 'fault-lab' && <FaultLabModule />}
            {activeView === 'thermal' && <ThermalAnalysisModule />}
            {activeView === 'analytics' && <PerformanceAnalyticsModule />}
            {activeView === 'assistant' && <EngineeringAssistantModule />}
            {activeView === 'docs' && <DocsAndScenariosModule />}
          </div>

          {/* Floating Contextual Inspector (appears smoothly when a component is clicked) */}
          <RightInspector />
        </main>
      </div>

      {/* 3. BOTTOM STATUS BAR */}
      <BottomStatus />
    </div>
  );
};

export default App;
