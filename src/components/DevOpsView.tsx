import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, 
  Play, 
  Activity, 
  ShieldAlert, 
  HardDrive, 
  Cpu, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Send,
  Zap,
  Gauge,
  RefreshCw,
  Clock,
  Server,
  Network,
  ActivitySquare,
  Sparkles,
  Search,
  Check
} from "lucide-react";
import { LogLine } from "../types";
import { useLogicEngine } from "./LogicEngineContext";

export default function DevOpsView() {
  const { metrics, refreshMetrics, isAnalyzing } = useLogicEngine();
  const [activeSubTab, setActiveSubTab] = useState<"infra" | "performance">("infra");
  const [isProfiling, setIsProfiling] = useState(false);
  const [activeServicesOnChart, setActiveServicesOnChart] = useState<Record<string, boolean>>({
    "File Indexer Scanner": true,
    "Dependency Resolver": true,
    "Static Code Analyst": true,
    "AST Graph Compiler": true,
    "Git Sync Engine": true,
    "System Telemetry Monitor": true
  });

  const [pipelineState, setPipelineState] = useState([
    { branch: "develop", commit: "3adefao", duration: "23s", status: "failed", id: "p-1" },
    { branch: "develop", commit: "8a2341f", duration: "3s", status: "success", id: "p-2" },
    { branch: "develop", commit: "7ca05ba", duration: "4s", status: "success", id: "p-3" },
    { branch: "develop", commit: "d2cd7e7", duration: "5s", status: "warning", id: "p-4" }
  ]);

  const [dockerLoad, setDockerLoad] = useState([12, 19, 32, 21, 29, 45, 38, 52, 41, 58, 62, 59, 48]);
  const [k8sPods, setK8sPods] = useState([35, 42, 38, 49, 58, 52, 61, 70, 64, 55, 68, 72, 80]);
  const [traffic, setTraffic] = useState([240, 290, 310, 280, 350, 420, 390, 410, 480, 520, 490, 460]);

  // Simulated live logging output
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "2026-07-03 10:42:38.629 [INFO] [arrowera.diagnostics] Streaming log diagnostics container sequence ID: bdpl5w...",
    "2026-07-03 10:42:36.657 [INFO] [arrowera.workspace] [a44035a]: Vectorized optimization applied on data_processor.js",
    "2026-07-03 10:42:36.669 [INFO] [arrowera.executor] [a410353]: Strapping docker sandbox environments",
    "2026-07-03 10:42:39.618 [WARN] [arrowera.security] [841495a]: Potential unauthorized parameter expansion detected in database router",
    "2026-07-03 10:42:49.639 [INFO] [arrowera.gateway] [a41035a]: Synchronized API cache to index.js"
  ]);

  const [commandInput, setCommandInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Stream logs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const services = ["diagnostics", "workspace", "security", "compiler", "db"];
      const levels = ["INFO", "WARN", "SUCCESS"];
      
      const randomService = services[Math.floor(Math.random() * services.length)];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      
      let msg = "";
      if (randomLevel === "INFO") {
        msg = `Heartbeat container tick. Memory footprint stabilized. Ingress active.`;
      } else if (randomLevel === "WARN") {
        msg = `High throughput threshold noticed on gateway router. Check configuration parameters.`;
      } else {
        msg = `Successfully compiled and built main layout package. 0 vulnerabilities found.`;
      }

      setTerminalLogs(prev => [...prev.slice(-40), `${timestamp} [${randomLevel}] [arrowera.${randomService}] ${msg}`]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim().toLowerCase();
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    let reply = "";
    if (cmd === "help") {
      reply = `Available commands: 
  - arrowera doctor: Scan workspace health and configuration parameters.
  - docker stats: List running Docker image files and metrics.
  - clear: Empty the diagnostics screen.
  - trigger-build: Re-run local CI/CD testing suite.`;
    } else if (cmd === "arrowera doctor") {
      reply = `ArrowEra CODEGuide Doctor (v1.2.0-stable) Results:
  [✓] Local Workspace Graph: Connected and parsed.
  [✓] Active Git Branch: develop.
  [!] Gemini connection status: Simulated mode (no GEMINI_API_KEY).
  [✓] Docker Ingress Gateway: Port 3000 mapping validated.`;
    } else if (cmd === "docker stats") {
      reply = `CONTAINER ID   NAME                 CPU %     MEM USAGE / LIMIT     NET I/O
  e84da3108ff3   orion-backend-core   12.4%     512MiB / 2GiB         1.2MB / 450KB
  7a2cd1ff09ab   arrowera-agent-bus   4.2%      210MiB / 1GiB         45KB / 12KB`;
    } else if (cmd === "clear") {
      setTerminalLogs([]);
      setCommandInput("");
      return;
    } else if (cmd === "trigger-build") {
      reply = `Triggering build sequence for develop branch...
  Parsing commits...
  [SUCCESS] All unit tests completed green in 4.2 seconds!`;
      
      // Update CI/CD Pipeline list in state
      const newPipeline = {
        branch: "develop",
        commit: "a" + Math.floor(Math.random() * 1000000).toString(16),
        duration: "4s",
        status: "success" as const,
        id: Math.random().toString()
      };
      setPipelineState(prev => [newPipeline, ...prev]);
    } else {
      reply = `Command not recognized: '${cmd}'. Type 'help' for instructions.`;
    }

    setTerminalLogs(prev => [
      ...prev,
      `$ ${commandInput}`,
      `${timestamp} [SYSTEM] ${reply}`
    ]);
    setCommandInput("");
  };

  const handleManualProfile = async () => {
    setIsProfiling(true);
    try {
      await refreshMetrics();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsProfiling(false), 800);
    }
  };

  const toggleServiceOnChart = (name: string) => {
    setActiveServicesOnChart(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Derive performance parameters
  const perf = metrics?.performance;
  const servicesList = perf?.services || [];
  const history = perf?.history || [];

  // Colors map for rendering graph
  const serviceColors: Record<string, string> = {
    "File Indexer Scanner": "#0d9488",
    "Dependency Resolver": "#7c3aed",
    "Static Code Analyst": "#e11d48",
    "AST Graph Compiler": "#d97706",
    "Git Sync Engine": "#0891b2",
    "System Telemetry Monitor": "#059669"
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full max-w-7xl mx-auto bg-[#0a0b0d] text-neutral-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <ActivitySquare className="text-amber-400" size={24} />
            DevOps & Infrastructure Center
          </h1>
          <p className="font-sans text-xs text-neutral-400 mt-1">
            Monitor orchestration metrics, container deployments, and live log diagnostics.
          </p>
        </div>
        
        {activeSubTab === "performance" && (
          <button
            onClick={handleManualProfile}
            disabled={isProfiling}
            className="flex items-center gap-2 font-sans text-xs font-bold bg-[#121316] hover:bg-[#1a1b20] border border-[#1f2127] text-white hover:text-amber-400 px-4 py-2 rounded-lg transition-all cursor-pointer"
          >
            <RefreshCw size={13} className={isProfiling ? "animate-spin text-amber-400" : ""} />
            {isProfiling ? "Profiling..." : "Trigger Live Profiling"}
          </button>
        )}
      </div>

      {/* Sub-tabs Selector */}
      <div className="flex border-b border-[#1f2127] gap-6">
        <button
          onClick={() => setActiveSubTab("infra")}
          className={`pb-3 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 cursor-pointer ${
            activeSubTab === "infra"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-neutral-500 hover:text-white"
          }`}
        >
          Infrastructure & Deployments
        </button>
        <button
          onClick={() => setActiveSubTab("performance")}
          className={`pb-3 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "performance"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-neutral-500 hover:text-white"
          }`}
        >
          <Zap size={13} className={activeSubTab === "performance" ? "text-amber-400" : ""} />
          LogicEngine Performance Profiler
        </button>
      </div>

      {activeSubTab === "infra" ? (
        <>
          {/* Grid: Infrastructure Sparklines */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Docker Container Spark */}
            <div className="bg-[#050506] border border-[#1f2127] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-white">Docker Containers</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                  Stable
                </span>
              </div>
              
              <div className="h-16 w-full flex items-end">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    points={dockerLoad.map((val, idx) => `${(idx / (dockerLoad.length - 1)) * 100},${40 - (val / 80) * 35}`).join(" ")}
                  />
                </svg>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-sans text-neutral-400">Active Load</span>
                <span className="font-mono font-bold text-white">{dockerLoad[dockerLoad.length - 1]}%</span>
              </div>
            </div>

            {/* Kubernetes Pods Spark */}
            <div className="bg-[#050506] border border-[#1f2127] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-white">Kubernetes Pods</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                  Stable
                </span>
              </div>
              
              <div className="h-16 w-full flex items-end">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                    points={k8sPods.map((val, idx) => `${(idx / (k8sPods.length - 1)) * 100},${40 - (val / 100) * 35}`).join(" ")}
                  />
                </svg>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-sans text-neutral-400">Total Allocations</span>
                <span className="font-mono font-bold text-white">{k8sPods[k8sPods.length - 1]} pods</span>
              </div>
            </div>

            {/* CI/CD Pipelines Spark */}
            <div className="bg-[#050506] border border-[#1f2127] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-white">CI/CD Pipelines</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[9px] font-bold uppercase tracking-wider">
                  Status
                </span>
              </div>
              
              <div className="h-16 w-full flex items-end gap-1 pb-1">
                {[30, 45, 60, 40, 80, 50, 70, 90, 65, 85].map((val, idx) => (
                  <div 
                    key={idx} 
                    className="flex-1 bg-[#121316] border border-[#1f2127] rounded-t-sm" 
                    style={{ height: `${val}%` }} 
                  >
                    <div className="w-full h-full bg-amber-400/40 rounded-t-sm" />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-sans text-neutral-400">Avg Success Rate</span>
                <span className="font-mono font-bold text-white">94.8%</span>
              </div>
            </div>

            {/* Network Traffic Spark */}
            <div className="bg-[#050506] border border-[#1f2127] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-white">Network Traffic</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                  Stable
                </span>
              </div>
              
              <div className="h-16 w-full flex items-end">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    points={traffic.map((val, idx) => `${(idx / (traffic.length - 1)) * 100},${40 - (val / 600) * 35}`).join(" ")}
                  />
                </svg>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-sans text-neutral-400">Ingress / Egress</span>
                <span className="font-mono font-bold text-white">{traffic[traffic.length - 1]}kb/s</span>
              </div>
            </div>

          </div>

          {/* CI/CD Pipeline status and Log Terminal layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Grid: Pipeline details */}
            <div className="lg:col-span-1 bg-[#050506] border border-[#1f2127] p-6 rounded-lg space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="font-sans text-sm font-bold tracking-tight mb-4 uppercase text-[10px] tracking-wider text-neutral-400">
                  CI/CD Pipeline Status
                </h2>

                <div className="divide-y divide-[#1f2127]">
                  {pipelineState.map((pipe) => (
                    <div key={pipe.id} className="py-3 flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-3">
                        {pipe.status === "success" && <CheckCircle size={14} className="text-emerald-500" />}
                        {pipe.status === "failed" && <XCircle size={14} className="text-red-500" />}
                        {pipe.status === "warning" && <AlertTriangle size={14} className="text-amber-500" />}
                        <div>
                          <div className="font-semibold text-white">{pipe.branch}</div>
                          <div className="font-mono text-[10px] text-neutral-500">commit: {pipe.commit}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-neutral-400 text-[11px]">{pipe.duration}</span>
                        <button 
                          onClick={() => alert(`Running pipeline sequence for commit ${pipe.commit}...`)}
                          className="p-1 hover:bg-[#121316] rounded transition-all text-neutral-400 hover:text-white cursor-pointer"
                          title="Rerun Pipeline"
                        >
                          <Play size={12} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleRunCommand({ preventDefault: () => {} } as any)}
                className="w-full text-center bg-amber-400 hover:bg-amber-500 text-[#0a0b0d] font-sans text-xs font-bold py-2.5 rounded transition-all mt-4 cursor-pointer"
              >
                Launch Integration Suite
              </button>
            </div>

            {/* Right Grid: Live Logs Terminals */}
            <div className="lg:col-span-2 bg-[#050506] border border-[#1f2127] p-6 rounded-lg flex flex-col justify-between h-[360px]">
              <div>
                <div className="flex items-center justify-between border-b border-[#1f2127] pb-3 mb-3 shrink-0">
                  <span className="font-mono text-xs text-[#e5e2e1] font-semibold flex items-center gap-2">
                    <Terminal size={14} className="text-emerald-500" />
                    Live Diagnostics & Logs
                  </span>
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">
                    Console Bus Online
                  </span>
                </div>

                <div className="h-[210px] overflow-y-auto space-y-1.5 font-mono text-[11px] text-[#e5e2e1] leading-relaxed select-text">
                  {terminalLogs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={log.startsWith("$") ? "text-emerald-400 font-semibold" : log.includes("[SUCCESS]") ? "text-emerald-400" : log.includes("[WARN]") ? "text-amber-400" : "text-gray-300"}
                    >
                      {log}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              </div>

              {/* Text input prompt */}
              <form onSubmit={handleRunCommand} className="flex gap-2 border-t border-[#1f2127] pt-3 shrink-0">
                <span className="font-mono text-xs text-emerald-500 font-bold flex items-center select-none">$</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="Type command here (e.g. 'help', 'arrowera doctor', 'trigger-build')..."
                  className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-[#e5e2e1] placeholder-neutral-600 focus:ring-0"
                  id="terminal-input"
                />
                <button 
                  type="submit" 
                  className="text-[#e5e2e1] hover:text-white p-1 hover:bg-[#121316] rounded transition-colors cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </form>

            </div>

          </div>
        </>
      ) : (
        <>
          {/* LogicEngine Performance Profiler Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            
            {/* Metric 1: Total Profiling Cycle */}
            <div className="bg-[#050506] border border-[#1f2127] rounded-lg p-5">
              <div className="flex items-center gap-2.5 text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
                <Clock size={14} className="text-amber-400" />
                Cycle Processing Time
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {perf?.startupTimeMs ?? 24}
                </span>
                <span className="text-xs text-neutral-400 font-mono">ms</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-2 font-sans">
                Full compile-time AST analysis & git sync loop latency.
              </p>
            </div>

            {/* Metric 2: IPC Local Latency */}
            <div className="bg-[#050506] border border-[#1f2127] rounded-lg p-5">
              <div className="flex items-center gap-2.5 text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
                <Gauge size={14} className="text-teal-400" />
                IPC Gateway Latency
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {perf?.ipcLatencyMs ?? 2}
                </span>
                <span className="text-xs text-neutral-400 font-mono">ms</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-2 font-sans">
                Inter-process channel roundtrip delay inside server runtime.
              </p>
            </div>

            {/* Metric 3: Polling Interval */}
            <div className="bg-[#050506] border border-[#1f2127] rounded-lg p-5">
              <div className="flex items-center gap-2.5 text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
                <RefreshCw size={14} className="text-rose-400 animate-pulse" />
                Profiling Refresh Rate
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold font-mono text-white">6,000</span>
                <span className="text-xs text-neutral-400 font-mono">ms</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-2 font-sans">
                Continuous background polling rate from client UI to local host.
              </p>
            </div>

            {/* Metric 4: Channels active */}
            <div className="bg-[#050506] border border-[#1f2127] rounded-lg p-5">
              <div className="flex items-center gap-2.5 text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
                <Server size={14} className="text-violet-400" />
                Engine Channels
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {servicesList.length || 6}
                </span>
                <span className="text-xs text-neutral-400 font-sans">Active</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-2 font-sans">
                Tracked services reporting latency profiles independently.
              </p>
            </div>

          </div>

          {/* Profiling Charts and Table layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Interactive SVGLatency Chart */}
            <div className="lg:col-span-2 bg-[#050506] border border-[#1f2127] p-6 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f2127] pb-3 mb-4 gap-2">
                  <div className="font-mono text-xs text-white font-semibold flex items-center gap-2">
                    <Activity size={14} className="text-amber-400" />
                    Internal Services Latency Trend
                  </div>
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">
                    Real-Time Microsecond Profile
                  </span>
                </div>

                {/* Service Selection Filter Toggles */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.keys(serviceColors).map(srvName => {
                    const color = serviceColors[srvName];
                    const isActive = activeServicesOnChart[srvName];
                    return (
                      <button
                        key={srvName}
                        onClick={() => toggleServiceOnChart(srvName)}
                        className={`px-2 py-1 rounded text-[10px] font-mono border transition-all flex items-center gap-1 cursor-pointer ${
                          isActive 
                            ? "bg-[#121316] text-white" 
                            : "bg-[#050506] text-neutral-500 border-neutral-800"
                        }`}
                        style={{ borderColor: isActive ? `${color}40` : "" }}
                      >
                        <span 
                          className="w-1.5 h-1.5 rounded-full inline-block" 
                          style={{ backgroundColor: color }}
                        />
                        {srvName.replace(" Scanner", "").replace(" Monitor", "")}
                        {isActive && <Check size={8} className="ml-0.5 text-neutral-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* The Custom Dynamic Latency SVG Chart */}
                {history.length === 0 ? (
                  <div className="h-[220px] flex flex-col items-center justify-center text-center text-neutral-500 font-mono text-xs border border-dashed border-[#1f2127] rounded-lg">
                    <RefreshCw className="animate-spin mb-2 text-neutral-400" size={18} />
                    Awaiting local performance cache payload...
                  </div>
                ) : (
                  <div className="relative">
                    <svg className="w-full h-[220px]" viewBox="0 0 600 220">
                      {/* Gridlines */}
                      {[0, 1, 2, 3, 4].map(i => {
                        const y = 15 + i * 43.75; // 175 / 4 = 43.75
                        return (
                          <g key={i}>
                            <line 
                              x1="40" 
                              y1={y} 
                              x2="580" 
                              y2={y} 
                              stroke="#1f2127" 
                              strokeWidth="1" 
                              strokeDasharray="2" 
                            />
                          </g>
                        );
                      })}

                      {/* Line Paths for active services */}
                      {(() => {
                        // Find dynamic scaling factor (maxLatencyMs)
                        let maxVal = 20;
                        history.forEach(entry => {
                          Object.keys(entry.services || {}).forEach(srvKey => {
                            if (activeServicesOnChart[srvKey]) {
                              const v = entry.services[srvKey];
                              if (typeof v === "number" && v > maxVal) {
                                maxVal = v;
                              }
                            }
                          });
                        });
                        maxVal = Math.ceil(maxVal * 1.15); // padding

                        return (
                          <>
                            {/* Y-Axis Labels */}
                            {[0, 1, 2, 3, 4].map(i => {
                              const y = 15 + i * 43.75;
                              const val = Math.round(maxVal - (i / 4) * maxVal);
                              return (
                                <text 
                                  key={i} 
                                  x="12" 
                                  y={y + 3} 
                                  fill="#6b7280" 
                                  fontSize="8" 
                                  fontFamily="monospace" 
                                  textAnchor="start"
                                >
                                  {val}ms
                                </text>
                              );
                            })}

                            {/* Service Polyline renderers */}
                            {Object.keys(serviceColors).map(srvName => {
                              if (!activeServicesOnChart[srvName]) return null;
                              const color = serviceColors[srvName];
                              
                              // Build SVG point list
                              const points = history.map((entry, idx) => {
                                const x = 40 + (idx / Math.max(1, history.length - 1)) * 540;
                                const latencyVal = entry.services?.[srvName] ?? 0;
                                const y = 190 - (latencyVal / maxVal) * 175;
                                return `${x},${y}`;
                              }).join(" ");

                              if (!points) return null;

                              return (
                                <g key={srvName}>
                                  <polyline
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="2"
                                    points={points}
                                    className="transition-all duration-300 animate-draw"
                                  />
                                  {/* Draw dots for the points */}
                                  {history.map((entry, idx) => {
                                    const x = 40 + (idx / Math.max(1, history.length - 1)) * 540;
                                    const latencyVal = entry.services?.[srvName] ?? 0;
                                    const y = 190 - (latencyVal / maxVal) * 175;
                                    return (
                                      <circle
                                        key={idx}
                                        cx={x}
                                        cy={y}
                                        r="3"
                                        fill="#0a0b0d"
                                        stroke={color}
                                        strokeWidth="1.5"
                                        className="hover:r-5 cursor-pointer transition-all duration-150"
                                      >
                                        <title>{`${srvName}\nTime: ${entry.timestamp}\nLatency: ${latencyVal} ms`}</title>
                                      </circle>
                                    );
                                  })}
                                </g>
                              );
                            })}

                            {/* X-Axis Labels */}
                            {history.length > 1 && [0, Math.floor((history.length - 1) / 2), history.length - 1].map((idx) => {
                              const entry = history[idx];
                              if (!entry) return null;
                              const x = 40 + (idx / (history.length - 1)) * 540;
                              return (
                                <text
                                  key={idx}
                                  x={x}
                                  y="212"
                                  fill="#6b7280"
                                  fontSize="8"
                                  fontFamily="monospace"
                                  textAnchor="middle"
                                >
                                  {entry.timestamp}
                                </text>
                              );
                            })}
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                )}
              </div>

              <div className="border-t border-[#1f2127] pt-4 mt-4 flex items-center justify-between text-[10px] text-neutral-400 font-sans">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live telemetry stream bound to `/api/logic-engine/metrics`
                </span>
                <span>History Limit: 20 ticks</span>
              </div>
            </div>

            {/* Right: Internal Services Profiler Table */}
            <div className="lg:col-span-1 bg-[#050506] border border-[#1f2127] p-6 rounded-lg flex flex-col justify-between">
              <div>
                <h2 className="font-sans text-sm font-bold tracking-tight mb-4 uppercase text-[10px] tracking-wider text-neutral-400">
                  Engine Channels Live Status
                </h2>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {servicesList.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500 font-mono text-xs">
                      Establishing profiling pipeline connection...
                    </div>
                  ) : (
                    servicesList.map((srv, idx) => {
                      const color = serviceColors[srv.name] || "#4b5563";
                      return (
                        <div key={idx} className="p-3 bg-[#0a0b0d] border border-[#1f2127] rounded hover:border-amber-400/20 transition-all">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-2 h-2 rounded-full inline-block"
                                style={{ backgroundColor: color }}
                              />
                              <span className="font-sans text-xs font-semibold text-white">
                                {srv.name}
                              </span>
                            </div>
                            
                            <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase tracking-wider ${
                              srv.status === "healthy" 
                                ? "bg-emerald-500/15 text-emerald-400" 
                                : "bg-amber-500/15 text-amber-400"
                            }`}>
                              {srv.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-3 text-[10.5px] font-mono text-neutral-400">
                            <div>
                              <span className="text-[9px] text-neutral-500 block uppercase font-bold">Latency</span>
                              <span className="text-white font-bold">{srv.latencyMs} ms</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-neutral-500 block uppercase font-bold">Cycle Weight</span>
                              <span className="text-white font-bold">{srv.loadPercent}%</span>
                            </div>
                          </div>

                          {/* Load Progress Bar */}
                          <div className="w-full bg-[#121316] h-1 rounded-full overflow-hidden mt-2.5">
                            <div 
                              className="h-full rounded-full transition-all duration-300"
                              style={{ 
                                width: `${srv.loadPercent}%`,
                                backgroundColor: color
                              }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1f2127] text-[10px] text-neutral-500 font-mono flex justify-between items-center">
                <span>Cycle total weight: 100%</span>
                <span>Active Spec 1.4-v</span>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
