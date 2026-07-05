import React, { useState } from "react";
import { 
  FolderGit2, Cpu, ArrowUpRight, CheckCircle, AlertTriangle, Zap, 
  History, Sparkles, ExternalLink, ChevronRight, RefreshCw, Layers,
  Lock, GitBranch, Terminal, ShieldAlert, Cpu as CpuIcon
} from "lucide-react";
import { Project } from "../types";
import { useLogicEngine } from "./LogicEngineContext";

interface DashboardViewProps {
  onNavigateToTab: (tab: string) => void;
  onSelectProject: (proj: Project) => void;
  activeProject: Project;
  projects: Project[];
  selectedFilesCount?: number;
}

export default function DashboardView({ 
  onNavigateToTab, 
  onSelectProject,
  activeProject,
  projects,
  selectedFilesCount = 2
}: DashboardViewProps) {
  const { metrics, isAnalyzing, refreshMetrics, performanceEngine } = useLogicEngine();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State to track dismissed and applied recommendations dynamically
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  // Derive real values from the Logic Engine
  const cpuUsage = metrics ? metrics.system.cpuLoad : 12;
  const memoryUsage = metrics ? metrics.system.memoryUsage : 48;
  const diskSpace = metrics?.system?.diskUsage !== undefined ? metrics.system.diskUsage : 24;
  const healthScore = metrics ? metrics.health.healthScore : 96.8;
  const totalFiles = metrics ? metrics.workspace.filesCount : 12;
  const totalLinesOfCode = metrics ? metrics.workspace.totalLinesOfCode : 1400;
  const contextSize = metrics ? metrics.workspace.totalLinesOfCode * 4.2 : 12419;

  // Compute active insights by merging static list with dynamic engine smells
  const activeInsights = React.useMemo(() => {
    const combined = [
      ...(metrics?.health?.codeSmells || []).map(smell => ({
        id: smell.id,
        title: smell.category,
        description: smell.message,
        type: smell.severity === "warning" ? ("security" as const) : ("perf" as const),
        targetFile: smell.file,
        impact: smell.impact,
        promptPreset: `Analyze and resolve the following code quality concern in '${smell.file}': ${smell.message}. Refactor to improve architectural alignment.`
      })),
      {
        id: "insight-1",
        title: "Performance Optimization",
        description: "Inefficient loop in server.ts / index routing layers",
        type: "perf" as const,
        targetFile: "server.ts",
        impact: "Reduce execution time by 80%",
        promptPreset: "Optimize server.ts router handlers and reduce database lookup times."
      },
      {
        id: "insight-2",
        title: "Security Hardening",
        description: "Static JWT token verification lacks expiration bounds",
        type: "security" as const,
        targetFile: "src/components/AuthRoute.tsx",
        impact: "Prevent unauthorized parameter expansion",
        promptPreset: "Verify auth route JWT validation logic, add expiration handling."
      },
      {
        id: "insight-3",
        title: "Database Indexing Leak",
        description: "Drizzle schemas lack indexes for session validation fields",
        type: "size" as const,
        targetFile: "src/db/schema.ts",
        impact: "Shave 320ms off query response latency",
        promptPreset: "Analyze pgTable structures in src/db/schema.ts, add high performance index definitions."
      }
    ];

    return combined
      .filter(item => !dismissedIds.includes(item.id))
      .map(item => ({
        ...item,
        applied: appliedIds.includes(item.id)
      }));
  }, [metrics, dismissedIds, appliedIds]);

  const handleRefreshMetrics = async () => {
    setIsRefreshing(true);
    await refreshMetrics();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const handleApplyFix = (id: string, promptPreset: string) => {
    setAppliedIds(prev => [...prev, id]);
    // Save to localstorage so Agentic Workspace can pick it up
    localStorage.setItem("arrowera_preset_prompt", promptPreset);
    onNavigateToTab("vibe_coding");
  };

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto bg-[#0a0b0d] text-neutral-200">
      
      {/* 1. UPPER COMMAND CENTER HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f2127] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Layers size={18} className="text-amber-400" />
              Workspace Intelligence
            </h1>
            <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 rounded font-mono font-bold">
              SYS_ACTIVE
            </span>
          </div>
          <p className="font-sans text-xs text-neutral-400 mt-1">
            Real-time operating telemetry, repository metrics, and proactive AI recommendations for your active environment.
          </p>
        </div>
        <button
          onClick={handleRefreshMetrics}
          className="flex items-center gap-2 bg-[#121316] hover:bg-[#1a1b20] border border-[#1f2127] hover:border-neutral-500 text-xs font-mono font-bold px-3 py-1.5 rounded transition-all text-white shadow-inner"
        >
          <RefreshCw size={12} className={isRefreshing ? "animate-spin text-amber-400" : ""} />
          <span>Sync Workspace state</span>
        </button>
      </div>

      {/* 2. REPOSITORY METRICS & CONTEXT GRIDS (The core supporting data) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 font-mono">
        
        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-3.5 space-y-1">
          <span className="text-[8.5px] uppercase font-bold text-neutral-500 block">Repository Health</span>
          <span className="text-lg font-bold text-white flex items-center gap-1">
            {healthScore}% <span className="text-[9px] text-emerald-400">({healthScore > 90 ? "A+" : "B"})</span>
          </span>
        </div>

        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-3.5 space-y-1">
          <span className="text-[8.5px] uppercase font-bold text-neutral-500 block">Context Size</span>
          <span className="text-lg font-bold text-amber-400">{Math.round(contextSize).toLocaleString()} tokens</span>
        </div>

        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-3.5 space-y-1">
          <span className="text-[8.5px] uppercase font-bold text-neutral-500 block">Indexed Files</span>
          <span className="text-lg font-bold text-white">{totalFiles} items</span>
        </div>

        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-3.5 space-y-1">
          <span className="text-[8.5px] uppercase font-bold text-neutral-500 block">AI Memory Alloc</span>
          <span className="text-lg font-bold text-white">{Math.min(5, Math.max(1, Math.round(totalFiles / 2)))} / 5 Slots</span>
        </div>

        <div className="col-span-2 md:col-span-4 lg:col-span-1 bg-[#0f1012] border border-[#1f2127] rounded-lg p-3.5 space-y-1">
          <span className="text-[8.5px] uppercase font-bold text-neutral-500 block">Express Service</span>
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 leading-none pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Port 3000 Bound
          </span>
        </div>

      </div>

      {/* 3. ROW 2 SPECIFIC ENGINEERING WORKBenches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-[#0f1012] border border-[#1f2127] rounded-lg p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f2127] pb-3">
            <h2 className="font-sans text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <FolderGit2 size={15} className="text-amber-400" />
              Active Workspace Repositories
            </h2>
            <span className="font-mono text-[9px] text-neutral-500 uppercase font-bold">Synchronized</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1f2127] text-neutral-400 font-mono uppercase text-[9px] tracking-wider">
                  <th className="pb-2.5 font-bold">Project Name</th>
                  <th className="pb-2.5 font-bold">Status</th>
                  <th className="pb-2.5 font-bold">Last Modified</th>
                  <th className="pb-2.5 font-bold">Active Branch</th>
                  <th className="pb-2.5 text-right font-bold">Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18191e] font-mono text-[11px]">
                {projects.map((proj) => {
                  const isActive = activeProject.name === proj.name;
                  return (
                    <tr 
                      key={proj.name}
                      className={`group hover:bg-[#121316]/50 transition-all ${isActive ? "bg-[#121316]/20" : ""}`}
                    >
                      <td className="py-3 font-sans font-bold text-white flex items-center gap-2">
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                        {proj.name}
                      </td>
                      <td className="py-3 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 font-bold uppercase tracking-wider">
                          {proj.status}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-400">{proj.lastModified}</td>
                      <td className="py-3 text-neutral-400">{proj.gitBranch}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onSelectProject(proj)}
                          className={`text-[9.5px] font-sans font-black px-2.5 py-1 rounded transition-colors ${
                            isActive 
                              ? "bg-amber-400 text-black font-extrabold" 
                              : "bg-[#121316] hover:bg-[#1a1b20] text-white border border-[#1f2127]"
                          }`}
                        >
                          {isActive ? "Active" : "Switch"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Virtual Machine Resource Meter */}
        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f2127] pb-3">
            <h2 className="font-sans text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <CpuIcon size={15} className="text-amber-400" />
              Environment Telemetry
            </h2>
            <span className="flex items-center gap-1 bg-[#121316] px-2 py-0.5 rounded border border-[#1f2127]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[8.5px] text-emerald-400 font-bold uppercase">Online</span>
            </span>
          </div>

          <div className="space-y-4 font-mono text-[10px]">
            {/* CPU Metric */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">VCPU Load</span>
                <span className="text-white font-bold">{cpuUsage}%</span>
              </div>
              <div className="h-1 bg-[#121316] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-500" 
                  style={{ width: `${cpuUsage}%` }} 
                />
              </div>
            </div>

            {/* Memory Metric */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">Sandbox Memory</span>
                <span className="text-white font-bold">{memoryUsage}%</span>
              </div>
              <div className="h-1 bg-[#121316] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-500" 
                  style={{ width: `${memoryUsage}%` }} 
                />
              </div>
            </div>

            {/* Disk Space */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">Persistent Disk space</span>
                <span className="text-white font-bold">{diskSpace}%</span>
              </div>
              <div className="h-1 bg-[#121316] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-neutral-600 transition-all duration-500" 
                  style={{ width: `${diskSpace}%` }} 
                />
              </div>
            </div>

            {/* Logic Engine Latency */}
            <div className="pt-2.5 border-t border-[#1f2127]/50 space-y-2">
              <span className="text-[9px] uppercase font-bold text-neutral-400 block font-sans tracking-wide">LogicEngine Service Latency</span>
              
              <div className="flex justify-between items-center text-[9.5px]">
                <span className="text-neutral-400">IPC Message Bus</span>
                <span className="text-amber-400 font-bold font-mono">{performanceEngine?.ipcLatencyMs || 2}ms</span>
              </div>
              <div className="w-full bg-[#121316] h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (performanceEngine?.ipcLatencyMs || 2) * 5)}%` }} 
                />
              </div>

              <div className="flex justify-between items-center text-[9.5px]">
                <span className="text-neutral-400">File Tree Scan</span>
                <span className="text-white font-bold font-mono">{performanceEngine?.fileWatchLatencyMs || 42}ms</span>
              </div>
              <div className="w-full bg-[#121316] h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (performanceEngine?.fileWatchLatencyMs || 42) / 2)}%` }} 
                />
              </div>

              <div className="flex justify-between items-center text-[9.5px]">
                <span className="text-neutral-400">Server Cold Startup</span>
                <span className="text-emerald-400 font-bold font-mono">{performanceEngine?.startupTimeMs || 158}ms</span>
              </div>
              <div className="w-full bg-[#121316] h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (performanceEngine?.startupTimeMs || 158) / 4)}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1f2127] flex justify-between items-center text-xs">
            <span className="font-sans text-neutral-400">Active Node container state</span>
            <button 
              onClick={() => onNavigateToTab("devops")}
              className="font-mono text-amber-400 hover:underline flex items-center gap-1 text-[10px] font-bold"
            >
              Stream logs <ChevronRight size={11} />
            </button>
          </div>
        </div>

      </div>

      {/* 4. THIRD ROW: ADVANCED AI ASSISTANT RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* AI Recommendations targeting Vibe Workspace */}
        <div className="lg:col-span-2 bg-[#0f1012] border border-[#1f2127] rounded-lg p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f2127] pb-3">
            <h2 className="font-sans text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              Proactive Workspace Suggestions
            </h2>
            <span className="font-mono text-[9px] text-neutral-500 font-bold uppercase">Dynamic recommendations</span>
          </div>

          <div className="space-y-3">
            {activeInsights.map((ins) => (
              <div 
                key={ins.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-[#1f2127] rounded hover:border-amber-400/20 transition-all bg-[#050506]"
              >
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    {ins.type === "perf" && <Zap size={14} className="text-amber-400" />}
                    {ins.type === "security" && <AlertTriangle size={14} className="text-rose-500" />}
                    {ins.type === "size" && <CheckCircle size={14} className="text-emerald-400" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans font-bold text-xs text-white leading-tight">
                      {ins.title}
                    </span>
                    <span className="font-sans text-xs text-neutral-400 mt-1">
                      {ins.description}
                    </span>
                    <span className="font-mono text-[9.5px] text-neutral-500 mt-1">
                      Impact: {ins.impact} • Target file: <code className="text-amber-400">{ins.targetFile}</code>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApplyFix(ins.id, ins.promptPreset)}
                    disabled={ins.applied}
                    className={`font-sans text-[10.5px] font-black px-3 py-1.5 rounded transition-all ${
                      ins.applied
                        ? "bg-emerald-950/40 text-emerald-400 cursor-not-allowed border border-emerald-900/40"
                        : "bg-amber-400 text-black hover:bg-amber-500 font-black shadow-sm"
                    }`}
                  >
                    {ins.applied ? "Synced ✓" : "Fix in Workspace ⭐"}
                  </button>
                  <button 
                    onClick={() => handleDismiss(ins.id)}
                    className="font-sans text-xs font-bold text-neutral-400 hover:text-white px-2.5 py-1.5 rounded bg-[#121316] hover:bg-[#1a1b20] transition-colors border border-transparent hover:border-[#1f2127]"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
            {activeInsights.length === 0 && (
              <div className="text-center py-8 text-neutral-500 font-mono text-xs">
                All workspace suggestions cleared or resolved!
              </div>
            )}
          </div>
        </div>

        {/* Git Branch History and Logs */}
        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f2127] pb-3">
            <h2 className="font-sans text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <History size={15} className="text-amber-400" />
              Active Workspace Commit stream
            </h2>
            <span className="font-mono text-[9px] text-neutral-500 font-bold uppercase">Git history</span>
          </div>

          <div className="space-y-4">
            {metrics?.git?.recentCommits && metrics.git.recentCommits.length > 0 ? (
              metrics.git.recentCommits.map((commit, index) => (
                <div key={commit.sha || index} className="flex gap-3 text-xs">
                  <div className="w-6 h-6 rounded bg-[#121316] border border-[#1f2127] flex items-center justify-center shrink-0 font-mono font-bold text-amber-400 text-[9px]">
                    {commit.sha ? commit.sha.substring(0, 4) : "git"}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-white">
                      <strong>{commit.author || "Developer"}</strong>: {commit.message}
                    </span>
                    <span className="font-mono text-[9.5px] text-neutral-500 mt-0.5">
                      {commit.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Fallback logs when git has no commits */}
                <div className="flex gap-3 text-xs">
                  <div className="w-6 h-6 rounded bg-[#121316] border border-[#1f2127] flex items-center justify-center shrink-0 font-mono font-bold text-neutral-400 text-[9px]">
                    {"</>"}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-white">
                      <strong>Orion Backend</strong>: refactored helper functions
                    </span>
                    <span className="font-mono text-[9.5px] text-neutral-500 mt-0.5">
                      #33 commits • 2 hours ago
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <div className="w-6 h-6 rounded bg-[#121316] border border-[#1f2127] flex items-center justify-center shrink-0 font-mono font-bold text-neutral-400 text-[9px]">
                    {"</>"}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-white">
                      <strong>Orion Backend</strong>: updated SQL parameters
                    </span>
                    <span className="font-mono text-[9.5px] text-neutral-500 mt-0.5">
                      #28 commits • 2 days ago
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
