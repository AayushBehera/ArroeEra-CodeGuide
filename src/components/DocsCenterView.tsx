import React, { useState } from "react";
import { 
  BookOpen, Bold, Italic, Code, Link2, Layers, Sparkles, Plus,
  Cpu, Activity, Terminal, GitBranch, Settings, RefreshCw, Send, CheckCircle2, AlertTriangle, Play, HelpCircle, HardDrive, ShieldCheck, Pocket, Key, Flame, FileText
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLogicEngine, EventBusMessage } from "./LogicEngine";

export default function DocsCenterView() {
  const {
    events,
    publishEvent,
    workspaceEngine,
    contextEngine,
    logicEngine: logicEng,
    multiAgentEngine,
    aiModelEngine,
    projectIntelligenceEngine,
    gitEngine,
    performanceEngine,
    memoryEngine,
    terminalEngine,
    pluginEngine,
    uiSyncEngine,
    triggerWorkflow,
    triggerAgentCollaboration,
    updateModelSettings,
    addMemoryDecision,
    togglePlugin,
    executeTerminalCommand
  } = useLogicEngine();

  // Switch between Tabs: "docs" (Documentation & README) and "engine-os" (ArrowEra Core 12-Engine OS Monitor)
  const [activeTab, setActiveTab] = useState<"docs" | "engine-os">("engine-os");

  // Documentation editor states
  const initialDocs = `graph TD
  A[Client] --> B[Load Balancer]
  B --> C[API Gateway]
  C --> D[Microservice A]
  C --> E[Microservice B]

# README

The high-fidelity UML system architecture details the client connection parameters, the routing criteria handled by our API Gateway, and the load balancing limits enforced on our cloud services.

## Architecture Guidelines
- **Orion Backend**: Responsible for caching data payloads securely.
- **Titanium Core API**: Handles heavy vectorized pandas dataframes.

## Microservices
- **Microservice A**: Reads and writes PostgreSQL database transactions safely.
- **Microservice B**: Aggregates user activities and telemetry records.`;

  const [editorText, setEditorText] = useState(initialDocs);
  const [sessionNotes, setSessionNotes] = useState([
    { id: "n-1", timestamp: "1 hour ago", text: "Recent engineering session: vectorized pandas bottlenecks resolved." },
    { id: "n-2", timestamp: "2 days ago", text: "Orion Backend: Potential SQL injection vectors checked & sanitized." }
  ]);
  const [newNote, setNewNote] = useState("");

  const handleInsertToolbar = (syntax: string) => {
    setEditorText(prev => prev + "\n" + syntax);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSessionNotes(prev => [
      { id: Math.random().toString(), timestamp: "Just now", text: newNote.trim() },
      ...prev
    ]);
    setNewNote("");
  };

  const parseMarkdownOnly = (text: string) => {
    return text.split("\n").filter(line => !line.trim().startsWith("graph") && !line.trim().startsWith("A[") && !line.trim().startsWith("B[") && !line.trim().startsWith("C[") && !line.trim().startsWith("D[") && !line.trim().startsWith("E[") && !line.trim().includes("-->")).join("\n");
  };

  // Custom event trigger state
  const [customEventType, setCustomEventType] = useState("CommandDispatched");
  const [customEventPayload, setCustomEventPayload] = useState('{"command": "npm run build"}');

  const handleSendCustomEvent = () => {
    try {
      const parsed = JSON.parse(customEventPayload);
      publishEvent(customEventType, parsed, "user-ui");
    } catch {
      publishEvent(customEventType, { raw: customEventPayload }, "user-ui");
    }
  };

  // Memory additions
  const [memTitle, setMemTitle] = useState("");
  const [memDesc, setMemDesc] = useState("");
  const [memCategory, setMemCategory] = useState<"Coding Style" | "Architecture Rule" | "Bug Fix Preference" | "Optimization Pattern">("Coding Style");

  const handleAddMemory = () => {
    if (!memTitle || !memDesc) return;
    addMemoryDecision(memTitle, memDesc, memCategory);
    setMemTitle("");
    setMemDesc("");
  };

  // Workflow trigger state
  const [selectedWorkflow, setSelectedWorkflow] = useState("Security Scan Pipeline");
  const workflowsList = [
    { name: "Security Scan Pipeline", tasks: [{ name: "Trigger SonarQube" }, { name: "Run audit tool" }, { name: "Generate security credentials report" }] },
    { name: "Production Compiler Optimization", tasks: [{ name: "Clear ES Cache" }, { name: "Optimize TS imports" }, { name: "Assemble Webpack bundler targets" }] },
    { name: "Local Database Migration Test", tasks: [{ name: "Drizzle push schema" }, { name: "Verify PG sync parameters" }, { name: "Seed core models metadata" }] }
  ];

  const handleRunWorkflow = () => {
    const matched = workflowsList.find(w => w.name === selectedWorkflow);
    if (matched) {
      triggerWorkflow(matched.name, matched.tasks);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto bg-[#0a0b0d] text-neutral-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f2127] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <BookOpen size={18} className="text-amber-400" />
              Docs & Core Engine OS Monitor
            </h1>
            <span className="text-[9px] bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
              OPERATING SYSTEM MONITORS ACTIVE
            </span>
          </div>
          <p className="font-sans text-xs text-neutral-400 mt-1">
            Toggle between code documentation tools and the live interactive 12-Engine operating system state controller.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex bg-[#0f1012] p-1 rounded-lg border border-[#1f2127] shrink-0 font-sans text-xs">
          <button 
            onClick={() => setActiveTab("engine-os")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "engine-os" ? "bg-[#1d1e22] text-white shadow" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Activity size={13} className="text-amber-400" />
            12-Engine OS Monitor
          </button>
          <button 
            onClick={() => setActiveTab("docs")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "docs" ? "bg-[#1d1e22] text-white shadow" : "text-neutral-400 hover:text-white"
            }`}
          >
            <FileText size={13} />
            System Docs Editor
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: SYSTEM DOCS EDITOR
          ======================================================== */}
      {activeTab === "docs" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Editor */}
            <div className="border border-[#1f2127] rounded-lg bg-[#0f1012] overflow-hidden flex flex-col justify-between min-h-[460px] shadow-xl">
              <div className="bg-[#121316] border-b border-[#1f2127]">
                <div className="h-11 border-b border-[#1f2127] flex items-center px-4 justify-between">
                  <span className="font-sans text-xs font-bold text-white tracking-tight">
                    README & Architecture Editor
                  </span>
                  <span className="font-mono text-[9px] text-neutral-500 font-bold uppercase tracking-wider">MARKDOWN + MERMAID</span>
                </div>

                {/* Toolbar */}
                <div className="p-2 flex flex-wrap gap-1 items-center bg-[#0d0e10]">
                  <button 
                    onClick={() => handleInsertToolbar("**Text**")}
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1d1e22] rounded transition-all" 
                    title="Bold"
                  >
                    <Bold size={13} />
                  </button>
                  <button 
                    onClick={() => handleInsertToolbar("*Text*")}
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1d1e22] rounded transition-all" 
                    title="Italic"
                  >
                    <Italic size={13} />
                  </button>
                  <button 
                    onClick={() => handleInsertToolbar("`Code`")}
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1d1e22] rounded transition-all" 
                    title="Code Block"
                  >
                    <Code size={13} />
                  </button>
                  <button 
                    onClick={() => handleInsertToolbar("[Link](https://)")}
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1d1e22] rounded transition-all" 
                    title="Link"
                  >
                    <Link2 size={13} />
                  </button>
                  <div className="w-px h-4 bg-[#1f2127] mx-1" />
                  <button 
                    onClick={() => handleInsertToolbar("graph TD\n  A[Start] --> B[Process]")}
                    className="px-2 py-1 text-[9px] font-sans font-bold uppercase tracking-wider border border-[#1f2127] hover:border-amber-400 rounded transition-all flex items-center gap-1 bg-[#121316] text-amber-400"
                  >
                    <Layers size={11} /> + Mermaid Diagram
                  </button>
                </div>
              </div>

              {/* Editor Textarea */}
              <div className="flex-1 p-4 font-mono text-xs text-neutral-200 leading-relaxed bg-[#0a0b0d]">
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  className="w-full h-full min-h-[300px] bg-transparent outline-none border-none resize-none overflow-y-auto font-mono text-neutral-200"
                  style={{ tabSize: 4 }}
                  id="docs-markdown-textarea"
                />
              </div>
            </div>

            {/* Right Column: Live Preview */}
            <div className="border border-[#1f2127] rounded-lg bg-[#0f1012] overflow-hidden flex flex-col shadow-xl">
              <div className="h-11 bg-[#121316] border-b border-[#1f2127] flex items-center justify-between px-4">
                <span className="font-sans text-xs font-bold text-white tracking-tight">
                  Live Preview
                </span>
                <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider animate-pulse">
                  AUTO-RENDER ACTIVE
                </span>
              </div>

              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Visual UML Diagram */}
                <div className="border border-[#1f2127] bg-[#070809] rounded-md p-5 flex flex-col items-center justify-center space-y-4">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-bold">
                    UML Architecture Flowchart
                  </span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 py-4 select-none">
                    <div className="border border-amber-400/30 bg-[#0f1012] px-4 py-2 rounded text-xs font-mono font-medium text-amber-400 shadow-sm">
                      Client Node
                    </div>
                    <span className="text-neutral-600 font-mono text-xs">➔</span>
                    <div className="border border-neutral-600 bg-[#0f1012] px-4 py-2 rounded text-xs font-mono font-medium text-white shadow-sm">
                      Nginx Gateway
                    </div>
                    <span className="text-neutral-600 font-mono text-xs">➔</span>
                    <div className="border border-neutral-600 bg-[#0f1012] px-4 py-2 rounded text-xs font-mono font-medium text-white shadow-sm">
                      Express App (3000)
                    </div>
                    <span className="text-neutral-600 font-mono text-xs">➔</span>
                    <div className="flex flex-col gap-2">
                      <div className="border border-emerald-400/30 bg-[#0f1012] px-3 py-1 rounded text-[11px] font-mono font-medium text-emerald-400 shadow-sm">
                        12 Core Engines
                      </div>
                      <div className="border border-neutral-600 bg-[#0f1012] px-3 py-1 rounded text-[11px] font-mono font-medium text-white shadow-sm">
                        Filesystem IO
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rendered Markdown */}
                <div className="prose prose-invert prose-sm font-sans max-w-none text-neutral-300 leading-relaxed space-y-4 text-xs">
                  <ReactMarkdown>{parseMarkdownOnly(editorText)}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* Session Notes */}
          <div className="bg-[#0f1012] border border-[#1f2127] p-6 rounded-lg shadow-xl space-y-4">
            <h3 className="font-sans text-sm font-bold text-white tracking-tight">
              Session Notes & Meeting Logs
            </h3>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input 
                type="text" 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Type engineering session note, design outcome, or code audit consensus..."
                className="flex-1 bg-[#0a0b0d] border border-[#1f2127] rounded px-3 py-2 font-sans text-xs focus:outline-none focus:border-amber-400 text-neutral-200"
                id="docs-note-input"
              />
              <button 
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-black font-sans text-xs font-bold px-4 py-2 rounded transition-all flex items-center gap-1 shrink-0"
              >
                <Plus size={12} /> Add Note
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {sessionNotes.map(note => (
                <div key={note.id} className="flex gap-3 text-xs bg-[#0a0b0d] p-3 rounded border border-[#1f2127] items-start shadow-inner">
                  <span className="font-mono text-amber-400 shrink-0 select-none text-[10px]">
                    {note.timestamp}
                  </span>
                  <p className="font-sans text-neutral-300 leading-relaxed">
                    {note.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ========================================================
          TAB 2: ARROWERA CORE 12-ENGINE OPERATING SYSTEM MONITOR
          ======================================================== */}
      {activeTab === "engine-os" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Bento-grid of the 12 Engines */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            
            {/* 1. Workspace Engine */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400">
                    <Layers size={14} />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white">1. Workspace Engine</span>
                    <span className="font-mono text-[8px] text-neutral-500 block uppercase font-bold">STATE: COMPILATION BOUND</span>
                  </div>
                </div>
                <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  Active
                </span>
              </div>
              <div className="font-mono text-[10px] space-y-1 bg-[#050506] p-2.5 rounded border border-[#1c1d22]">
                <div className="flex justify-between"><span className="text-neutral-500">Files Index:</span><span className="text-white font-bold">{workspaceEngine.filesCount} modules</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Volume:</span><span className="text-white font-bold">{workspaceEngine.totalLinesOfCode.toLocaleString()} LOC</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Primary Tech:</span><span className="text-amber-400 font-bold">{workspaceEngine.primaryLanguage}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Framework:</span><span className="text-white font-bold">{workspaceEngine.framework}</span></div>
              </div>
              <div className="text-[10px] font-mono text-neutral-400">
                Last scan: <span className="text-neutral-300 font-bold">{workspaceEngine.lastIndexed}</span>
              </div>
            </div>

            {/* 2. Context Engine */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-violet-400/10 border border-violet-400/20 text-violet-400">
                    <Activity size={14} />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white">2. Context Engine</span>
                    <span className="font-mono text-[8px] text-neutral-500 block uppercase font-bold">STATE: AST SYNC</span>
                  </div>
                </div>
                <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  Active
                </span>
              </div>
              <div className="font-mono text-[10px] space-y-1 bg-[#050506] p-2.5 rounded border border-[#1c1d22]">
                <div className="flex justify-between"><span className="text-neutral-500">Focus File:</span><span className="text-white font-bold truncate max-w-[100px]">{contextEngine.activeFile || "None"}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Active Slots:</span><span className="text-violet-400 font-bold">{contextEngine.items.length} nodes</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Relevance Mean:</span><span className="text-white font-bold">84.3%</span></div>
              </div>
              <div className="text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                <span>Refreshed: {contextEngine.lastUpdated}</span>
              </div>
            </div>

            {/* 3. Logic Engine */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400">
                    <Terminal size={14} />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white">3. Logic Engine</span>
                    <span className="font-mono text-[8px] text-neutral-500 block uppercase font-bold">STATE: EVENT COORDINATOR</span>
                  </div>
                </div>
                <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                  logicEng.status === "idle" ? "bg-zinc-500/10 border border-zinc-500/20 text-neutral-400" : "bg-amber-400/10 border border-amber-400/20 text-amber-400 animate-pulse"
                }`}>
                  {logicEng.status}
                </span>
              </div>
              
              {/* Trigger work task */}
              <div className="space-y-2">
                <select 
                  value={selectedWorkflow}
                  onChange={(e) => setSelectedWorkflow(e.target.value)}
                  className="w-full bg-[#050506] border border-[#1f2127] rounded px-2 py-1 text-[10px] font-mono text-white focus:outline-none"
                >
                  {workflowsList.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
                </select>

                <button
                  onClick={handleRunWorkflow}
                  disabled={logicEng.status !== "idle"}
                  className="w-full bg-[#1c1d22] hover:bg-amber-400 hover:text-black disabled:opacity-50 text-white font-sans text-[10px] font-bold py-1.5 rounded transition-all flex items-center justify-center gap-1 border border-[#1f2127]"
                >
                  <Play size={10} />
                  <span>Execute Workflow</span>
                </button>
              </div>

              {/* Workflow stack display */}
              {logicEng.activeWorkflow && (
                <div className="bg-[#050506] p-2 rounded border border-[#1f2127] font-mono text-[9px] text-neutral-400 space-y-1 animate-pulse">
                  <div className="font-bold text-white truncate">{logicEng.activeWorkflow}</div>
                  {logicEng.workflowTasks.map(t => (
                    <div key={t.id} className="flex justify-between items-center">
                      <span>• {t.name}</span>
                      <span className={`font-bold uppercase ${
                        t.status === "completed" ? "text-emerald-400" : t.status === "running" ? "text-amber-400 animate-pulse" : "text-neutral-600"
                      }`}>{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Multi-Agent Engine */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-rose-400/10 border border-rose-400/20 text-rose-400">
                    <Cpu size={14} />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white">4. Multi-Agent Engine</span>
                    <span className="font-mono text-[8px] text-neutral-500 block uppercase font-bold">STATE: COOPERATIVE MATRIX</span>
                  </div>
                </div>
                <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  98.4% Sync
                </span>
              </div>
              <div className="font-mono text-[10px] space-y-1 bg-[#050506] p-2.5 rounded border border-[#1c1d22]">
                <div className="flex justify-between"><span className="text-neutral-500">Active Pool:</span><span className="text-white font-bold">{multiAgentEngine.agents.length} Agent Nodes</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Task Mode:</span><span className="text-rose-400 font-bold uppercase">{multiAgentEngine.activeSessionType}</span></div>
              </div>
              <button
                onClick={() => triggerAgentCollaboration("review")}
                className="w-full bg-[#1c1d22] hover:bg-rose-500 hover:text-black text-white border border-[#1f2127] hover:border-rose-500 font-sans text-[10px] font-bold py-1.5 rounded transition-all"
              >
                Assemble Consensus Session
              </button>
            </div>

            {/* 5. AI Model Engine */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white">5. AI Model Engine</span>
                    <span className="font-mono text-[8px] text-neutral-500 block uppercase font-bold">STATE: INFERENCE DELEGATOR</span>
                  </div>
                </div>
                <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase animate-pulse">
                  {aiModelEngine.inferenceRate} t/s
                </span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="text-[8.5px] uppercase font-bold text-neutral-500 block mb-1">Active Route Path</label>
                  <select 
                    value={aiModelEngine.currentModelId}
                    onChange={(e) => updateModelSettings(e.target.value, aiModelEngine.temperature)}
                    className="w-full bg-[#050506] border border-[#1f2127] rounded px-2 py-1 text-[10px] font-mono text-white focus:outline-none"
                  >
                    {aiModelEngine.models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>

                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-neutral-500">Temp Coefficient:</span>
                  <span className="text-emerald-400 font-bold">{aiModelEngine.temperature}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={aiModelEngine.temperature}
                  onChange={(e) => updateModelSettings(aiModelEngine.currentModelId, parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 bg-neutral-800 h-1 rounded"
                />
              </div>
            </div>

            {/* 6. Project Intelligence Engine */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400">
                    <ShieldCheck size={14} />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white">6. Project Intelligence</span>
                    <span className="font-mono text-[8px] text-neutral-500 block uppercase font-bold">STATE: AST METRICS CODEAUDIT</span>
                  </div>
                </div>
                <span className="text-[8px] bg-amber-400/10 border border-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  Score {projectIntelligenceEngine.healthScore}%
                </span>
              </div>
              <div className="font-mono text-[10px] space-y-1 bg-[#050506] p-2.5 rounded border border-[#1c1d22]">
                <div className="flex justify-between"><span className="text-neutral-500">Code Complexity:</span><span className="text-white font-bold">{projectIntelligenceEngine.complexityScore} Index</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Unused Packages:</span><span className="text-red-400 font-bold">{projectIntelligenceEngine.unusedPackages.length} units</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Active Code smells:</span><span className="text-amber-400 font-bold">{projectIntelligenceEngine.issues.length} active</span></div>
              </div>
              <div className="text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                <span>Technical Debt: {projectIntelligenceEngine.technicalDebtHours} hours</span>
              </div>
            </div>

            {/* 7. Git Engine */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-blue-400/10 border border-blue-400/20 text-blue-400">
                    <GitBranch size={14} />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white">7. Git Engine</span>
                    <span className="font-mono text-[8px] text-neutral-500 block uppercase font-bold">STATE: VCS REVISION SNAPSHOT</span>
                  </div>
                </div>
                <span className="text-[8px] bg-[#1a1b1e] border border-[#1f2127] text-neutral-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  {gitEngine.branch}
                </span>
              </div>
              <div className="font-mono text-[10px] space-y-1 bg-[#050506] p-2.5 rounded border border-[#1c1d22]">
                <div className="flex justify-between"><span className="text-neutral-500">Uncommitted file count:</span><span className="text-white font-bold">{gitEngine.modifiedCount} files</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">VCS Repository found:</span><span className="text-blue-400 font-bold">{gitEngine.isRepo ? "Yes (Git)" : "No"}</span></div>
              </div>
              <div className="text-[10px] font-mono text-neutral-400 truncate max-w-full">
                Sha: <span className="text-neutral-300 font-bold">{gitEngine.recentCommits[0]?.sha || "HEAD"}</span>
              </div>
            </div>

            {/* 8. Performance Engine */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
                    <Activity size={14} />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white">8. Performance Engine</span>
                    <span className="font-mono text-[8px] text-neutral-500 block uppercase font-bold">STATE: SYSTEM TELEMETRY</span>
                  </div>
                </div>
                <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  {performanceEngine.ipcLatencyMs} ms IPC
                </span>
              </div>
              <div className="font-mono text-[10px] space-y-1 bg-[#050506] p-2.5 rounded border border-[#1c1d22]">
                <div className="flex justify-between"><span className="text-neutral-500">VRAM/VPU Engine load:</span><span className="text-white font-bold">{performanceEngine.cpuLoad}%</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Node Resident heap:</span><span className="text-white font-bold">{performanceEngine.heapUsedMB} MB</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">File Watch Delay:</span><span className="text-emerald-400 font-bold">{performanceEngine.fileWatchLatencyMs} ms</span></div>
              </div>
              <div className="text-[10px] font-mono text-neutral-400 flex justify-between">
                <span>Total Host RAM: {performanceEngine.totalMemGB} GB</span>
                <span>Active hours: {performanceEngine.uptimeHours.toFixed(1)}</span>
              </div>
            </div>

            {/* 9. Memory Engine */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-sky-400/10 border border-sky-400/20 text-sky-400">
                    <HardDrive size={14} />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white">9. Memory Engine</span>
                    <span className="font-mono text-[8px] text-neutral-500 block uppercase font-bold">STATE: VECTORS PREFERENCES</span>
                  </div>
                </div>
                <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  {memoryEngine.vectorEmbeddingCount} Vectors
                </span>
              </div>

              {/* Add Memory Form */}
              <div className="space-y-1.5 bg-[#050506] p-2 rounded border border-[#1f2127]">
                <input 
                  type="text"
                  placeholder="Style rule title..."
                  value={memTitle}
                  onChange={(e) => setMemTitle(e.target.value)}
                  className="w-full bg-[#0d0e10] border border-[#1f2127] rounded px-1.5 py-0.5 text-[9px] font-mono text-white focus:outline-none"
                />
                <textarea 
                  placeholder="Behavior/preference summary..."
                  value={memDesc}
                  onChange={(e) => setMemDesc(e.target.value)}
                  className="w-full h-8 bg-[#0d0e10] border border-[#1f2127] rounded px-1.5 py-0.5 text-[9px] font-mono text-white focus:outline-none resize-none"
                />
                <button
                  onClick={handleAddMemory}
                  className="w-full bg-[#1c1d22] hover:bg-sky-400 hover:text-black font-sans text-[8px] font-bold py-1 rounded transition-all"
                >
                  Inject Rule Node
                </button>
              </div>

              <div className="text-[10px] font-mono text-neutral-400">
                Active Preferences: <span className="text-white font-bold">{Object.keys(memoryEngine.preferences).length} properties</span>
              </div>
            </div>

            {/* 10. Terminal Engine */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-zinc-400/10 border border-zinc-400/20 text-zinc-400">
                    <Terminal size={14} />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white">10. Terminal Engine</span>
                    <span className="font-mono text-[8px] text-neutral-500 block uppercase font-bold">STATE: PIPELINE PROCESS RUNNER</span>
                  </div>
                </div>
                <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase animate-pulse">
                  Ready
                </span>
              </div>
              <div className="font-mono text-[10px] space-y-1 bg-[#050506] p-2.5 rounded border border-[#1c1d22]">
                <div className="flex justify-between"><span className="text-neutral-500">Child PIDs:</span><span className="text-white font-bold">{terminalEngine.activeProcesses.length} channels</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Container memory:</span><span className="text-zinc-400 font-bold">{terminalEngine.dockerStats[0]?.memory || "512 MB"}</span></div>
              </div>
              <div className="text-[10px] font-mono text-neutral-400 truncate">
                Main PID: <span className="text-neutral-300 font-bold">{terminalEngine.activeProcesses[0]?.pid || "None"}</span>
              </div>
            </div>

            {/* 11. Plugin Engine */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400">
                    <Pocket size={14} />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white">11. Plugin Engine</span>
                    <span className="font-mono text-[8px] text-neutral-500 block uppercase font-bold">STATE: CUSTOM SANDBOX EXTENSIONS</span>
                  </div>
                </div>
                <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  {pluginEngine.sandboxStatus}
                </span>
              </div>
              
              {/* Dynamic plugin loading list */}
              <div className="space-y-1 bg-[#050506] p-2 rounded border border-[#1f2127] max-h-24 overflow-y-auto no-scrollbar font-mono text-[9px]">
                {pluginEngine.plugins.map(p => (
                  <div key={p.id} className="flex justify-between items-center py-0.5 border-b border-[#0d0e10]">
                    <span className="truncate max-w-[120px] text-white">{p.name}</span>
                    <button 
                      onClick={() => togglePlugin(p.id)}
                      className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        p.status === "loaded" ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {p.status === "loaded" ? "Loaded" : "Disabled"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-[10px] font-mono text-neutral-400">
                Sandbox restrictions: <span className="text-emerald-400 font-bold">Enforced</span>
              </div>
            </div>

            {/* 12. UI Synchronization Engine */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400">
                    <Settings size={14} />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white">12. UI Sync Engine</span>
                    <span className="font-mono text-[8px] text-neutral-500 block uppercase font-bold">STATE: REAL-TIME BINDING</span>
                  </div>
                </div>
                <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  {uiSyncEngine.busStatus}
                </span>
              </div>
              <div className="font-mono text-[10px] space-y-1 bg-[#050506] p-2.5 rounded border border-[#1c1d22]">
                <div className="flex justify-between"><span className="text-neutral-500">State Subscribers:</span><span className="text-white font-bold">{uiSyncEngine.subscribersCount} listeners</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Dynamic Intervals:</span><span className="text-white font-bold">12 pipelines</span></div>
              </div>
              <div className="text-[10px] font-mono text-neutral-400">
                Synchronized: <span className="text-neutral-300 font-bold">{uiSyncEngine.lastSyncTimestamp}</span>
              </div>
            </div>

          </div>

          {/* Centralized Event Bus Live Monitor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Live Event bus feed */}
            <div className="lg:col-span-2 bg-[#0f1012] border border-[#1f2127] rounded-lg p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1f2127] pb-3">
                <div className="flex items-center gap-2">
                  <Activity size={15} className="text-amber-400" />
                  <h3 className="font-sans text-xs font-bold text-white tracking-tight uppercase tracking-wider">
                    Centralized Event Bus Live Broker Stream
                  </h3>
                </div>
                <span className="font-mono text-[8.5px] bg-[#050506] border border-[#1f2127] px-2 py-0.5 rounded text-neutral-400 font-bold">
                  {events.length} LOGGED MESSAGES
                </span>
              </div>

              {/* Log view */}
              <div className="bg-[#050506] p-4 rounded-lg border border-[#1f2127] h-64 overflow-y-auto font-mono text-[11px] space-y-2 no-scrollbar shadow-inner">
                {events.length > 0 ? (
                  events.map(ev => (
                    <div key={ev.id} className="flex gap-2.5 hover:bg-[#0f1012] p-1 rounded transition-colors items-start">
                      <span className="text-neutral-500 shrink-0 select-none">[{ev.timestamp}]</span>
                      <span className="text-amber-400 font-bold shrink-0">@{ev.sender}</span>
                      <span className="text-neutral-500 shrink-0">➔</span>
                      <span className="text-white font-bold shrink-0">{ev.type}</span>
                      <span className="text-neutral-400 truncate flex-1">
                        {JSON.stringify(ev.payload)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-neutral-500 text-center py-12 italic">
                    Central Event Bus initialized. Dispatching real-time workspace signals...
                  </div>
                )}
              </div>
            </div>

            {/* Right: Dispatch custom Event Bus message */}
            <div className="bg-[#0f1012] border border-[#1f2127] rounded-lg p-5 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#1f2127] pb-3">
                  <h3 className="font-sans text-xs font-bold text-white tracking-tight uppercase tracking-wider flex items-center gap-2">
                    <Send size={13} className="text-amber-400" />
                    Dispatch Signal broker
                  </h3>
                  <span className="font-mono text-[9px] text-neutral-500">API GATEWAY</span>
                </div>

                <div className="space-y-4 mt-4 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Signal Type</label>
                    <input 
                      type="text"
                      value={customEventType}
                      onChange={(e) => setCustomEventType(e.target.value)}
                      placeholder="e.g., CodeSmellDetected, TestSucceeded..."
                      className="w-full bg-[#0a0b0d] border border-[#1f2127] rounded px-3 py-2 font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">JSON Payload parameters</label>
                    <textarea 
                      value={customEventPayload}
                      onChange={(e) => setCustomEventPayload(e.target.value)}
                      placeholder='{"key": "value"}'
                      rows={3}
                      className="w-full bg-[#0a0b0d] border border-[#1f2127] rounded px-3 py-2 font-mono text-white focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendCustomEvent}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-sans text-xs font-bold py-2 rounded.md transition-all shadow-md flex items-center justify-center gap-1.5 py-2"
              >
                <Flame size={12} />
                <span>Inject Custom Signal</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
