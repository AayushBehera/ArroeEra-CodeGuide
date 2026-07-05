import React, { useState } from "react";
import { 
  Cpu, Play, Layers, Activity, Terminal, CheckCircle2, Clock, 
  TrendingUp, ShieldAlert, Settings, RefreshCw, Sparkles, Send, Flame
} from "lucide-react";
import { useLogicEngine } from "./LogicEngine";

export default function AgentsHubView({ onNavigateToTab }: { onNavigateToTab?: (tab: string) => void }) {
  const { metrics, multiAgentEngine, triggerAgentCollaboration } = useLogicEngine();
  const agents = multiAgentEngine.agents;

  const globalBenchmark = metrics ? `ArrowEra ${metrics.workspace.framework}` : "ArrowEra Multi-Agent Core v2";
  const resourceUsage = metrics ? metrics.system.memoryUsage : 62;
  const [activeAgentId, setActiveAgentId] = useState<string | null>("agent-planner");

  const handleOpenInWorkspace = (agentName: string) => {
    localStorage.setItem("arrowera_preset_prompt", `Task for ${agentName}: Refactor code blocks, optimize structures, and review architectural consistency.`);
    if (onNavigateToTab) {
      onNavigateToTab("vibe_coding");
    }
  };

  const activeAgent = agents.find(a => a.id === activeAgentId);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto bg-[#0a0b0d] text-neutral-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f2127] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Cpu size={18} className="text-amber-400" />
              AI Agent Console
            </h1>
            <span className="text-[9px] bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
              COOPERATIVE AGENTS ONLINE
            </span>
          </div>
          <p className="font-sans text-xs text-neutral-400 mt-1">
            Orchestrate collaborative autonomous specialists, check consensus telemetry, and deploy agents directly inside the workspace.
          </p>
        </div>

        <button
          onClick={() => triggerAgentCollaboration("collaboration")}
          className="bg-amber-400 hover:bg-amber-500 text-black font-sans text-xs font-bold px-4 py-2 rounded-md transition-all flex items-center gap-1.5 shadow"
        >
          <RefreshCw size={12} className="animate-spin-slow" />
          <span>Assemble Collaboration Consensus</span>
        </button>
      </div>

      {/* Global Telemetry Bar */}
      <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-neutral-400 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white uppercase tracking-wider text-[10px]">Consensus Bus telemetry</span>
        </div>
        <div className="flex items-center gap-5 text-[11px]">
          <div className="flex items-center gap-2">
            <span>Model Core:</span>
            <span className="text-amber-400 font-bold bg-[#121316] border border-[#1f2127] px-2 py-0.5 rounded font-mono">
              {globalBenchmark}
            </span>
          </div>
          <div className="w-px h-4 bg-[#1f2127]" />
          <div className="flex items-center gap-2">
            <span>Cooperative Consensus:</span>
            <span className="text-emerald-400 font-bold bg-[#121316] border border-[#1f2127] px-2 py-0.5 rounded font-mono">
              {multiAgentEngine.consensusRate}%
            </span>
          </div>
          <div className="w-px h-4 bg-[#1f2127]" />
          <div className="flex items-center gap-2">
            <span>RAM/VRAM Load:</span>
            <span className="text-white font-bold bg-[#121316] border border-[#1f2127] px-2 py-0.5 rounded font-mono">
              {resourceUsage}%
            </span>
          </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => {
          const isSelected = activeAgentId === agent.id;
          return (
            <div 
              key={agent.id}
              onClick={() => setActiveAgentId(agent.id)}
              className={`bg-[#0f1012] border rounded-lg p-5 flex flex-col justify-between transition-all cursor-pointer ${
                isSelected ? "border-amber-400 shadow-lg" : "border-[#1f2127] hover:border-neutral-500"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-400" />
                    {agent.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      agent.status !== "idle" ? "bg-emerald-500 animate-pulse" : "bg-neutral-600"
                    }`} />
                    <span className="font-mono text-[9px] uppercase font-bold text-neutral-400">
                      {agent.status}
                    </span>
                  </span>
                </div>
                <div className="font-mono text-[9.5px] text-amber-400 font-bold uppercase tracking-wider">
                  {agent.role}
                </div>
              </div>

              {/* Action Log List */}
              <div className="my-4 space-y-1.5 border-t border-b border-[#1f2127] py-3 flex-1">
                <span className="text-[8.5px] uppercase font-bold tracking-wider text-neutral-500 block font-mono">
                  Live Log stream
                </span>
                <div className="space-y-1 max-h-24 overflow-y-auto no-scrollbar font-mono text-[10px]">
                  {agent.logs.map((log) => (
                    <div key={log.id} className="flex gap-2">
                      <span className="text-neutral-500 shrink-0 select-none">
                        [{log.timestamp}]
                      </span>
                      <span className="text-neutral-300 leading-tight">
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom stats & Workspace Launch */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-neutral-500 text-[8px] uppercase tracking-wider">Time</span>
                    <span className="font-bold text-white">{agent.taskTime}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-neutral-500 text-[8px] uppercase tracking-wider">Accuracy</span>
                    <span className="font-bold text-white">{agent.accuracy}%</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenInWorkspace(agent.name);
                  }}
                  className="bg-[#121316] hover:bg-amber-400 border border-[#1f2127] hover:border-amber-400 hover:text-black text-[10px] text-white font-sans font-bold px-3 py-1.5 rounded-md transition-all shadow-inner flex items-center gap-1"
                >
                  <Flame size={10} />
                  <span>Open in Workspace</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resource Allocation Nodes */}
      {activeAgent && (
        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f2127] pb-3">
            <h3 className="font-sans text-xs font-bold text-white tracking-tight flex items-center gap-2 uppercase tracking-wider">
              <Layers size={13} className="text-amber-400" />
              Agent Core Memory Pool: {activeAgent.name} Context
            </h3>
            <span className="font-mono text-[9px] text-neutral-500 uppercase font-bold">Consensus Bus Slots</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[11px]">
            <div className="bg-[#050506] border border-[#1f2127] p-4 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] uppercase font-bold text-neutral-500">Token Allocation</span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {metrics ? (metrics.workspace.totalLinesOfCode * 4).toLocaleString() : "15,432"}
                </span>
              </div>
              <div className="w-full bg-[#121316] h-1 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-amber-400" style={{ width: metrics ? `${Math.min(100, (metrics.workspace.totalLinesOfCode / 5000) * 100)}%` : "48%" }} />
              </div>
            </div>

            <div className="bg-[#050506] border border-[#1f2127] p-4 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] uppercase font-bold text-neutral-500">Memory Slots</span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {metrics ? `${metrics.workspace.filesCount} / ${metrics.workspace.filesCount + 5} Active` : "4 / 5 Used"}
                </span>
              </div>
              <div className="w-full bg-[#121316] h-1 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-neutral-400" style={{ width: metrics ? `${(metrics.workspace.filesCount / (metrics.workspace.filesCount + 5)) * 100}%` : "80%" }} />
              </div>
            </div>

            <div className="bg-[#050506] border border-[#1f2127] p-4 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] uppercase font-bold text-neutral-500">Consensus Rate</span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {metrics ? `${metrics.health.healthScore}%` : "98.4%"}
                </span>
              </div>
              <div className="w-full bg-[#121316] h-1 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-emerald-500" style={{ width: metrics ? `${metrics.health.healthScore}%` : "98.4%" }} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
