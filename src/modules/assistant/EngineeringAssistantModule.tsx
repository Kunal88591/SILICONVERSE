import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  Cpu, 
  Flame, 
  ShieldAlert, 
  Terminal,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useSimulationStore } from '@/stores/simulationStore';
import { CHIP_COMPONENTS } from '@/data/chipComponents';

export const EngineeringAssistantModule: React.FC = () => {
  const {
    assistantMessages,
    sendAssistantMessage,
    clearAssistantChat,
    selectedComponentId,
    activeFaults,
    thermalTelemetry
  } = useSimulationStore();

  const [inputQuery, setInputQuery] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantMessages]);

  const handleSend = () => {
    if (!inputQuery.trim()) return;
    sendAssistantMessage(inputQuery.trim());
    setInputQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const suggestedPrompts = [
    'Explain the Fetch-Decode-Execute pipeline stages',
    'What is the function of the selected component?',
    'What happens if the L1 Data Cache fails?',
    'Why does junction temperature trigger thermal throttling?',
    'How does the Bus Interconnect manage cache coherency?'
  ];

  const selectedMeta = selectedComponentId ? CHIP_COMPONENTS[selectedComponentId] : null;

  return (
    <div className="p-6 max-w-5xl mx-auto h-full flex flex-col justify-between text-slate-200">
      {/* Top Header */}
      <div className="bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-100">
                AI Microarchitecture Engineering Assistant
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
                LOCAL KNOWLEDGE BASE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Context: {selectedMeta ? `Targeting [${selectedMeta.name}]` : 'Die System Overview'} • {activeFaults.length} Faults Active • {thermalTelemetry.maxTemperature.toFixed(1)}°C
            </p>
          </div>
        </div>

        <button
          onClick={clearAssistantChat}
          className="p-2 rounded-lg bg-[#101A2C] border border-[#1E2D4A] hover:border-slate-400 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          title="Clear Chat History"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
        {assistantMessages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-xl border text-xs leading-relaxed ${
                  isAssistant
                    ? 'bg-[#101A2C] border-[#1E2D4A] text-slate-200'
                    : 'bg-[#387BFF]/20 border-[#387BFF]/40 text-blue-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1.5 border-b border-[#1E2D4A]/60 pb-1">
                  <span>{isAssistant ? 'ENGINEERING ASSISTANT' : 'WORKSTATION OPERATOR'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-line font-sans">{msg.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
          <span className="text-slate-500 shrink-0">Quick Prompts:</span>
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => sendAssistantMessage(p)}
              className="px-2.5 py-1 rounded bg-[#101A2C] border border-[#1E2D4A] hover:border-[#8B5CF6]/50 text-slate-300 hover:text-[#8B5CF6] whitespace-nowrap transition-colors cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-2 shadow-xl focus-within:border-[#8B5CF6] transition-colors">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedMeta
                ? `Ask about ${selectedMeta.fullName} or microarchitecture...`
                : 'Ask a question about microprocessor architecture, pipelines, or thermal throttling...'
            }
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-200 outline-none font-sans"
          />

          <button
            onClick={handleSend}
            disabled={!inputQuery.trim()}
            className="px-4 py-2 rounded-lg bg-[#8B5CF6] text-white hover:bg-[#7C3AED] disabled:opacity-40 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
