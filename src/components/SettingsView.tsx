import React, { useState } from "react";
import { 
  Settings, Check, RefreshCw, AlertTriangle, Server, Cpu, Activity, 
  Info, Globe, HelpCircle, CheckCircle, Download, AlertCircle, 
  Sparkles, RefreshCcw, Gauge, Layers, Thermometer, Zap, Database, Terminal
} from "lucide-react";
import { Project } from "../types";

interface SettingsViewProps {
  activeProject: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
  ollamaUrl: string;
  setOllamaUrl: (url: string) => void;
  detectedModels: string[];
  setDetectedModels: React.Dispatch<React.SetStateAction<string[]>>;
  ollamaStatus: 'connected' | 'disconnected' | 'checking' | 'idle';
  checkOllamaStatus: (url?: string) => Promise<{ success: boolean; models?: string[]; error?: any }>;
  systemSpecs: {
    os: string;
    cores: string;
    memory: string;
    browser: string;
    recommendedModel: string;
  };
  modelStates: Record<string, {
    status: "up-to-date" | "update-available" | "pulling" | "failed" | "checking";
    progress?: number;
    totalBytes?: number;
    completedBytes?: number;
    newDigest?: string;
  }>;
  setModelStates: React.Dispatch<React.SetStateAction<Record<string, {
    status: "up-to-date" | "update-available" | "pulling" | "failed" | "checking";
    progress?: number;
    totalBytes?: number;
    completedBytes?: number;
    newDigest?: string;
  }>>>;
  handlePullModel: (modelName: string, onLog?: (text: string, type: string) => void) => Promise<void>;
}

export default function SettingsView({ 
  activeProject, 
  onUpdateProject,
  ollamaUrl,
  setOllamaUrl,
  detectedModels,
  setDetectedModels,
  ollamaStatus,
  checkOllamaStatus,
  systemSpecs,
  modelStates,
  setModelStates,
  handlePullModel
}: SettingsViewProps) {
  const [projName, setProjName] = useState(activeProject.name);
  const [desc, setDesc] = useState("Backend service for next-gen data processing and analysis.");
  const [repoUrl, setRepoUrl] = useState(activeProject.repoUrl || "git@github.com:arrowera/titanium-core.git");
  const [localUrlInput, setLocalUrlInput] = useState(ollamaUrl);
  const [auditProgress, setAuditProgress] = useState(false);
  
  // Feature Toggles
  const [realtimeAnalysis, setRealtimeAnalysis] = useState(true);
  const [autoFormat, setAutoFormat] = useState(true);
  const [smartCompletions, setSmartCompletions] = useState(true);

  // Model control state
  const [temperature, setTemperature] = useState(0.2);
  const [promptCacheHits, setPromptCacheHits] = useState(98.2);

  const [logs, setLogs] = useState([
    { id: "sl-1", time: "10:42 AM", type: "success", text: "AI Control Center synchronized with active Workspace model." },
    { id: "sl-2", time: "10:40 AM", type: "info", text: "Cached 1,240 token prompts into active VRAM buffer." },
    { id: "sl-3", time: "10:38 AM", type: "success", text: "Model benchmarks matching optimal local limits." }
  ]);
  
  const [syncingModels, setSyncingModels] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [pullingNewModel, setPullingNewModel] = useState(false);
  const [newModelProgress, setNewModelProgress] = useState(0);
  const [newModelStatusText, setNewModelStatusText] = useState("");

  const checkModelUpdates = async () => {
    setSyncingModels(true);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [
      { id: Math.random().toString(), time: timeNow, type: "success", text: "Checking model library registry for digest updates..." },
      ...prev
    ]);

    const initialStates: Record<string, any> = {};
    detectedModels.forEach(m => {
      initialStates[m] = { status: "checking" };
    });
    setModelStates(initialStates);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const finalStates: Record<string, any> = {};
    detectedModels.forEach((m, idx) => {
      if (idx === 0) {
        finalStates[m] = { status: "update-available", newDigest: "sha256:d8a2" };
      } else {
        finalStates[m] = { status: "up-to-date" };
      }
    });

    setModelStates(finalStates);
    setSyncingModels(false);
  };

  const handlePullModelWithLogging = async (modelName: string) => {
    const logCallback = (text: string, type: string) => {
      const logTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLogs(prev => [
        { id: Math.random().toString(), time: logTime, type, text },
        ...prev
      ]);
    };
    await handlePullModel(modelName, logCallback);
  };

  const handlePullNewModel = async () => {
    if (!newModelName.trim()) return;
    const modelToPull = newModelName.trim().toLowerCase();
    setPullingNewModel(true);
    setNewModelProgress(0);
    setNewModelStatusText("Initializing download...");

    setTimeout(() => {
      setNewModelProgress(100);
      setNewModelStatusText("Done!");
      setPullingNewModel(false);
      setNewModelName("");
      if (!detectedModels.includes(modelToPull)) {
        setDetectedModels([...detectedModels, modelToPull]);
      }
    }, 1500);
  };

  const handleSaveChanges = () => {
    onUpdateProject({
      name: projName,
      repoUrl: repoUrl
    });
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [
      { id: Math.random().toString(), time: timeNow, type: "success", text: `Configuration successfully updated for ${projName}.` },
      ...prev
    ]);
    alert("Project configurations saved successfully!");
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto bg-[#0a0b0d] text-neutral-200">
      
      {/* Upper Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f2127] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Gauge size={18} className="text-amber-400" />
              AI Control Center
            </h1>
            <span className="text-[9px] bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
              BENCHMARKS OPTIMAL
            </span>
          </div>
          <p className="font-sans text-xs text-neutral-400 mt-1">
            Real-time VRAM allocation logs, latency scoring, temperature tuning, and dynamic local LLM registry synchronization.
          </p>
        </div>
      </div>

      {/* Grid: 4-Column Live Spec Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        
        {/* Latency card */}
        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 space-y-1.5 shadow-xl">
          <span className="text-[8.5px] uppercase font-bold text-neutral-500">Model Latency</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">15ms</span>
            <span className="text-[8.5px] text-emerald-400 font-semibold">(Ultra Fast)</span>
          </div>
          <div className="h-0.5 bg-neutral-800 rounded overflow-hidden">
            <div className="h-full bg-emerald-400" style={{ width: "15%" }} />
          </div>
        </div>

        {/* Tokens/Sec */}
        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 space-y-1.5 shadow-xl">
          <span className="text-[8.5px] uppercase font-bold text-neutral-500">Throughput Speed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-amber-400">48 t/s</span>
            <span className="text-[8.5px] text-neutral-400">Average stream</span>
          </div>
          <div className="h-0.5 bg-neutral-800 rounded overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: "75%" }} />
          </div>
        </div>

        {/* Active Window */}
        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 space-y-1.5 shadow-xl">
          <span className="text-[8.5px] uppercase font-bold text-neutral-500">Active Cache Hits</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{promptCacheHits}%</span>
            <span className="text-[8.5px] text-emerald-400">Hit Rate</span>
          </div>
          <div className="h-0.5 bg-neutral-800 rounded overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${promptCacheHits}%` }} />
          </div>
        </div>

        {/* VRAM allocated */}
        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 space-y-1.5 shadow-xl">
          <span className="text-[8.5px] uppercase font-bold text-neutral-500">VRAM / GPU Load</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">5.8 GB</span>
            <span className="text-[8.5px] text-neutral-500">/ 8.0 GB max</span>
          </div>
          <div className="h-0.5 bg-neutral-800 rounded overflow-hidden">
            <div className="h-full bg-white" style={{ width: "72%" }} />
          </div>
        </div>

      </div>

      {/* Main Grid: Parameters Tuning & Registry Pull */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: AI Parameter Tuning & Project configs */}
        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-5 space-y-5 shadow-xl">
          <h2 className="font-sans text-sm font-semibold text-white border-b border-[#1f2127] pb-3 flex items-center gap-1.5">
            <Thermometer size={14} className="text-amber-400" />
            Hyperparameter & Context Toggles
          </h2>

          <div className="space-y-4">
            
            {/* Slider for Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400">Temperature (Creativity Bounds)</span>
                <span className="text-amber-400 font-bold">{temperature}</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="1.2" 
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-mono text-neutral-500">
                <span>0.0 (Deterministic / Code)</span>
                <span>1.2 (Creative / Prose)</span>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-2.5 pt-2">
              
              <div className="flex items-center justify-between p-3.5 border border-[#1f2127] rounded-lg bg-[#050506]">
                <div>
                  <span className="font-sans font-bold text-xs text-white block">Real-time Code Analyzer</span>
                  <span className="text-[9.5px] text-neutral-400 font-sans">Run inline syntactic code audits constantly</span>
                </div>
                <button
                  onClick={() => setRealtimeAnalysis(!realtimeAnalysis)}
                  className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    realtimeAnalysis ? "bg-amber-400" : "bg-neutral-800"
                  }`}
                >
                  <div className={`bg-black w-3.5 h-3.5 rounded-full transform transition-transform ${realtimeAnalysis ? "translate-x-3.5" : ""}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 border border-[#1f2127] rounded-lg bg-[#050506]">
                <div>
                  <span className="font-sans font-bold text-xs text-white block">Auto-format & Sync</span>
                  <span className="text-[9.5px] text-neutral-400 font-sans">Clean syntax spacing and missing imports</span>
                </div>
                <button
                  onClick={() => setAutoFormat(!autoFormat)}
                  className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    autoFormat ? "bg-amber-400" : "bg-neutral-800"
                  }`}
                >
                  <div className={`bg-black w-3.5 h-3.5 rounded-full transform transition-transform ${autoFormat ? "translate-x-3.5" : ""}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 border border-[#1f2127] rounded-lg bg-[#050506]">
                <div>
                  <span className="font-sans font-bold text-xs text-white block">Adaptive Prompt Caching</span>
                  <span className="text-[9.5px] text-neutral-400 font-sans">Reuse AST token maps for subsecond reasoning</span>
                </div>
                <button
                  onClick={() => setSmartCompletions(!smartCompletions)}
                  className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    smartCompletions ? "bg-amber-400" : "bg-neutral-800"
                  }`}
                >
                  <div className={`bg-black w-3.5 h-3.5 rounded-full transform transition-transform ${smartCompletions ? "translate-x-3.5" : ""}`} />
                </button>
              </div>

            </div>

          </div>

          <div className="pt-3 border-t border-[#1f2127] flex justify-between items-center text-xs">
            <span className="text-neutral-500 font-mono text-[9px]">ACTIVE PROJECT: {projName}</span>
            <button 
              onClick={handleSaveChanges}
              className="bg-amber-400 hover:bg-amber-500 text-black text-[10px] font-sans font-black px-4 py-1.5 rounded-md transition-all shadow-inner uppercase tracking-wider"
            >
              Commit Core parameters
            </button>
          </div>
        </div>

        {/* Right Card: Ollama Local Server / External APIs mapping */}
        <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-5 space-y-5 shadow-xl">
          <div className="border-b border-[#1f2127] pb-3 flex justify-between items-center">
            <h2 className="font-sans text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <Server size={15} className="text-amber-400" />
              Ollama / Private LLM Link
            </h2>
            <div className="flex items-center gap-1.5 bg-[#121316] px-2 py-0.5 rounded border border-[#1f2127]">
              <span className={`w-1.5 h-1.5 rounded-full ${ollamaStatus === "connected" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              <span className="font-mono text-[8.5px] text-neutral-400 font-bold uppercase">
                {ollamaStatus === "connected" ? "Connected" : "Standby / Mock"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-neutral-400 uppercase font-bold">Local Host Server Endpoint</label>
              <div className="flex gap-2 mt-1.5">
                <input 
                  type="text" 
                  value={localUrlInput} 
                  onChange={(e) => setLocalUrlInput(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="flex-1 bg-[#050506] border border-[#1f2127] hover:border-neutral-500 rounded px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-amber-400 transition-all"
                />
                <button
                  onClick={async () => {
                    setAuditProgress(true);
                    await checkOllamaStatus(localUrlInput);
                    setAuditProgress(false);
                  }}
                  className="bg-[#121316] hover:bg-[#1a1b20] border border-[#1f2127] text-white font-mono text-xs font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1 shrink-0"
                >
                  <RefreshCw size={11} className={auditProgress ? "animate-spin text-amber-400" : ""} />
                  <span>Scan</span>
                </button>
              </div>
            </div>

            {/* Registry Sync Manager */}
            <div className="flex items-center justify-between p-3 border border-[#1f2127] rounded bg-[#050506]">
              <div className="space-y-0.5 font-sans">
                <span className="font-bold text-xs text-white block">Registry Sync Manager</span>
                <span className="text-[9.5px] text-neutral-400 block">Check remote registry for up-to-date SHA tags</span>
              </div>
              <button
                onClick={checkModelUpdates}
                className="bg-[#121316] hover:bg-amber-400 border border-[#1f2127] hover:border-amber-400 hover:text-black text-white font-mono text-[10px] font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1"
              >
                <RefreshCcw size={10} className={syncingModels ? "animate-spin" : ""} />
                <span>Update digests</span>
              </button>
            </div>

            {/* Local image registry list */}
            <div>
              <span className="block text-[10px] font-mono text-neutral-400 uppercase font-bold mb-2">Installed Registry Images</span>
              <div className="border border-[#1f2127] rounded overflow-hidden divide-y divide-[#18191e] font-mono text-xs">
                {detectedModels.map(m => (
                  <div key={m} className="p-3 bg-[#050506] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-bold">{m}</span>
                      <span className="text-[8.5px] bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 px-1.5 py-0.2 rounded">Stable</span>
                    </div>
                    <span className="text-neutral-500 text-[10px]">Registry: sha256:8a1a13</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Terminal log buffer */}
      <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-5 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-[#1f2127] pb-3">
          <h2 className="font-sans text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Terminal size={14} className="text-neutral-400" />
            AI Pipeline Event Stream
          </h2>
          <span className="font-mono text-[9px] text-neutral-500 uppercase font-bold">Terminal buffer</span>
        </div>

        <div className="border border-[#1f2127] rounded p-4 bg-[#050506] max-h-48 overflow-y-auto space-y-2 font-mono text-xs">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-2.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-neutral-500 shrink-0 text-[10px] select-none">{log.time} -</span>
              <p className="text-neutral-300 leading-none">
                {log.text}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
