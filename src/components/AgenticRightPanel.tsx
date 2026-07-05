import React from "react";
import { 
  Sparkles, Send, Terminal, ChevronDown, ChevronUp, Check, Plus, 
  Cpu, Activity, SlidersHorizontal, ArrowRight, Brain, ShieldAlert, FileText, Folder, GitBranch,
  RefreshCw
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AgenticRightPanelProps {
  currentModel: string;
  activeSkill: "orchestrator" | "database" | "testing" | "devops";
  setActiveSkill: (skill: "orchestrator" | "database" | "testing" | "devops") => void;
  isAgentRunning: boolean;
  promptInput: string;
  setPromptInput: React.Dispatch<React.SetStateAction<string>>;
  handleExecuteAgenticTask: (customPrompt?: string) => void;
  vibeChatMessages: any[];
  expandedLogs: Record<string, boolean>;
  setExpandedLogs: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedFiles: string[];
  targetFile: string;
  setTargetFile: (file: string) => void;
  popularTargetFiles: string[];
  standalonePresets: any;
  playClickSound: () => void;
  playChimeSound: () => void;
  addLog: (msg: string, type?: "info" | "success" | "warn" | "error" | "code") => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  agentPhase: string;
  agentProgress: number;
  hasAppliedPatch: boolean;
  handleApplyWorkspacePatch: (msgId?: string) => void;
  isApplyingPatch: boolean;
}

export default function AgenticRightPanel({
  currentModel,
  activeSkill,
  setActiveSkill,
  isAgentRunning,
  promptInput,
  setPromptInput,
  handleExecuteAgenticTask,
  vibeChatMessages,
  expandedLogs,
  setExpandedLogs,
  selectedFiles,
  targetFile,
  setTargetFile,
  popularTargetFiles,
  standalonePresets,
  playClickSound,
  playChimeSound,
  addLog,
  messagesEndRef,
  agentPhase,
  agentProgress,
  hasAppliedPatch,
  handleApplyWorkspacePatch,
  isApplyingPatch
}: AgenticRightPanelProps) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0b0d] text-neutral-200 select-text font-sans">
      
      {/* 1. CHAT PANEL HEADER */}
      <div className="px-4 py-3 border-b border-[#1f2127] bg-[#0f1012] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <Brain size={14} className="text-amber-400 animate-pulse" />
          <span className="font-sans text-[11px] font-extrabold uppercase tracking-wider text-white">
            AI Composer Chat
          </span>
        </div>

        {/* Model and Speed Pill */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
            <Sparkles size={9} className="animate-spin" />
            {currentModel}
          </span>
        </div>
      </div>

      {/* 2. MAIN ACTIVE AGENT & ACTION PRESETS SLIDER */}
      <div className="px-4 py-3 bg-[#0d0e11] border-b border-[#1f2127] space-y-2 shrink-0 select-none">
        <div className="flex items-center justify-between text-[8px] font-bold text-neutral-400 uppercase tracking-wider">
          <span>Target Team Role Agent</span>
          <span>Click to Switch Context presets</span>
        </div>

        {/* Horizontal Chips */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "orchestrator", label: "Full Stack", role: "APIs & Core" },
            { id: "database", label: "DB Architect", role: "Drizzle / Schema" },
            { id: "testing", label: "QA & Unit Tests", role: "Jest Suites" },
            { id: "devops", label: "DevOps", role: "Docker & Ingress" }
          ].map((chip) => {
            const isActive = activeSkill === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => { playClickSound(); setActiveSkill(chip.id as any); }}
                className={`px-2.5 py-1 rounded border text-[9.5px] font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                  isActive
                    ? "bg-amber-400 text-black border-amber-400 font-black ring-1 ring-amber-400"
                    : "bg-[#121316] text-neutral-400 border-[#1f2127] hover:border-neutral-500 hover:text-white"
                }`}
              >
                <span className={`w-1 h-1 rounded-full ${isActive ? "bg-black animate-ping" : "bg-neutral-600"}`} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Inline Presets Slider */}
        <div className="pt-2 border-t border-[#1f2127]/50 space-y-1">
          <span className="text-[8px] font-mono font-bold text-neutral-500 uppercase block">
            Agent Prompt Presets
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full select-none no-scrollbar">
            {standalonePresets[activeSkill].map((preset: any, idx: number) => (
              <button
                key={idx}
                onClick={() => {
                  playClickSound();
                  setPromptInput(preset.prompt);
                  handleExecuteAgenticTask(preset.prompt);
                }}
                disabled={isAgentRunning}
                className="px-2.5 py-1 text-[8.5px] bg-[#121316] hover:bg-[#1a1b20] text-neutral-300 hover:text-amber-400 border border-[#1f2127] hover:border-amber-400/40 rounded whitespace-nowrap transition-all shadow-inner font-mono flex items-center gap-1"
              >
                <span>💡 {preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MULTI-AGENT LIVE PIPELINE HUD (Shown when generating) */}
      {isAgentRunning && (
        <div className="px-4 py-3 bg-[#0d0e11] border-b border-[#1f2127] space-y-2 select-none shrink-0 animate-in fade-in duration-300">
          <div className="flex justify-between items-center text-[9px] font-mono">
            <span className="text-amber-400 font-bold uppercase animate-pulse flex items-center gap-1">
              <Activity size={10} className="animate-spin" />
              Agent Core Status: {agentPhase.toUpperCase()}ING...
            </span>
            <span className="text-white font-bold">{agentProgress}%</span>
          </div>

          {/* Staggered mini progress tracker */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { phase: "planning", label: "Plan" },
              { phase: "synthesizing", label: "Draft" },
              { phase: "auditing", label: "Audit" },
              { phase: "packaging", label: "Pack" }
            ].map((p, idx) => {
              const phasesList = ["planning", "synthesizing", "auditing", "packaging"];
              const currentIdx = phasesList.indexOf(agentPhase);
              const stepIdx = phasesList.indexOf(p.phase);
              const isPast = currentIdx > stepIdx;
              const isCurrent = currentIdx === stepIdx;

              return (
                <div key={idx} className="flex flex-col space-y-1">
                  <div className={`h-1 rounded-full ${
                    isPast 
                      ? "bg-emerald-500" 
                      : isCurrent 
                        ? "bg-amber-400 animate-pulse" 
                        : "bg-neutral-800"
                  }`} />
                  <span className={`text-[8px] text-center font-mono uppercase ${
                    isPast ? "text-emerald-500 font-bold" : isCurrent ? "text-amber-400 font-bold" : "text-neutral-500"
                  }`}>
                    {p.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. EXPANDED CONVERSATION STREAM FEED */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {vibeChatMessages.map((msg) => {
          const isAI = msg.sender === "ai";
          return (
            <div key={msg.id} className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"} animate-in fade-in duration-200`}>
              
              {isAI && (
                <div className="w-6 h-6 rounded-lg bg-[#1e2025] text-amber-400 border border-amber-400/20 flex items-center justify-center text-[9px] font-mono font-black shrink-0">
                  AI
                </div>
              )}

              <div className="flex flex-col space-y-1 max-w-[85%]">
                
                {/* Chat Bubble container */}
                <div className={`p-4 rounded-xl border text-[11px] leading-relaxed font-sans shadow-md ${
                  isAI 
                    ? "bg-[#121316] border-[#1f2127] text-neutral-200 space-y-3" 
                    : "bg-[#1e2025] border-[#2d3139] text-white"
                }`}>
                  
                  {/* Auto Scan Indicator Card */}
                  {isAI && msg.autoResolvedFile && (
                    <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-2.5 space-y-1.5 font-sans">
                      <div className="flex items-center justify-between text-[8.5px] uppercase font-bold tracking-wide">
                        <span className="text-amber-400 flex items-center gap-1">
                          <Sparkles size={9} className="animate-spin" />
                          Resolved target file
                        </span>
                        <span className="text-neutral-400 font-mono">Confidence: 99%</span>
                      </div>
                      <div className="font-mono text-[9px] text-white bg-[#0a0b0d] px-2 py-1 rounded border border-[#1f2127] flex items-center gap-1 truncate font-semibold">
                        📂 {msg.autoResolvedFile}
                      </div>

                      {msg.scannedFiles && msg.scannedFiles.length > 0 && (
                        <div className="pt-1.5 border-t border-[#1f2127]/50">
                          <span className="text-[8px] font-bold text-neutral-500 block mb-1">
                            🔎 Semantic scanned relevance ratings:
                          </span>
                          <div className="space-y-0.5 max-h-[80px] overflow-y-auto pr-1 no-scrollbar">
                            {msg.scannedFiles.map((sf: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-[8px] text-neutral-400 font-mono">
                                <span className={sf.isSelected ? "text-amber-400 font-extrabold" : "text-neutral-500"}>
                                  {sf.isSelected ? "➔ " : ""}{sf.path}
                                </span>
                                <span className={sf.isSelected ? "text-amber-400 font-bold" : "text-neutral-500"}>
                                  {sf.matchConfidence}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Intent Explanation Block */}
                  {isAI && msg.humanExplanation && (
                    <div className="bg-[#0a0b0d] border border-[#1f2127] rounded-lg p-2.5 space-y-0.5 font-sans">
                      <span className="text-[8px] font-bold text-neutral-500 uppercase block tracking-wider">
                        AI Intent Solution Overview
                      </span>
                      <p className="text-neutral-300 font-sans text-[10px] leading-relaxed">
                        {msg.humanExplanation}
                      </p>
                    </div>
                  )}

                  {/* Changes action items checklist */}
                  {isAI && msg.changesChecklist && msg.changesChecklist.length > 0 && (
                    <div className="space-y-1 bg-[#0a0b0d] border border-[#1f2127] rounded-lg p-2.5 font-sans">
                      <span className="text-[8px] font-bold text-neutral-500 uppercase block tracking-wider">
                        Proposed patch checkpoints
                      </span>
                      <div className="space-y-1">
                        {msg.changesChecklist.map((chk: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[9.5px]">
                            {chk.completed ? (
                              <Check size={10} className="text-emerald-400 mt-0.5 shrink-0" />
                            ) : (
                              <ShieldAlert size={10} className="text-amber-400 mt-0.5 shrink-0" />
                            )}
                            <span className={chk.completed ? "text-neutral-500 line-through" : "text-neutral-200 font-semibold"}>
                              {chk.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main markdown description response text */}
                  <div className="prose prose-sm prose-invert font-sans max-w-none text-[11px] text-neutral-200 break-words leading-relaxed">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>

                  {/* Pipeline logs expansion inline inside bubble */}
                  {isAI && msg.agentPhaseLogs && (
                    <div className="pt-2 border-t border-[#1f2127]">
                      <button
                        onClick={() => {
                          playClickSound();
                          setExpandedLogs(prev => ({ ...prev, [msg.id]: !prev[msg.id] }));
                        }}
                        className="flex items-center gap-1 text-[8.5px] text-neutral-400 font-mono font-bold hover:text-white"
                      >
                        <Terminal size={10} className="text-amber-400 animate-pulse" />
                        <span>Show compiler sequence logs</span>
                        {expandedLogs[msg.id] ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      </button>
                      {expandedLogs[msg.id] && (
                        <div className="mt-1 bg-[#050506] text-neutral-300 p-2 rounded font-mono text-[8.5px] space-y-0.5 leading-relaxed border border-[#1f2127] shadow-inner">
                          {msg.agentPhaseLogs.map((log: string, lIdx: number) => (
                            <div key={lIdx} className="text-emerald-400 font-mono">&gt; {log}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Inline apply patch quick click */}
                  {isAI && msg.patch && (
                    <div className="border-t border-[#1f2127] pt-2.5 space-y-2">
                      <div className="flex items-center justify-between text-[8px] font-bold text-neutral-500 font-mono uppercase">
                        <span>📂 File: {msg.patch.file.split("/").pop()}</span>
                        <span className="text-emerald-500 font-mono font-bold">+{msg.patch.diffLines.length} Lines suggested</span>
                      </div>
                      <button
                        onClick={() => handleApplyWorkspacePatch(msg.id)}
                        disabled={msg.hasAppliedPatch || isApplyingPatch}
                        className={`w-full py-1.5 rounded-lg text-[9px] font-sans font-bold flex items-center justify-center gap-1 transition-all ${
                          msg.hasAppliedPatch 
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50" 
                            : "bg-amber-400 text-black hover:bg-amber-500 shadow-sm font-extrabold animate-pulse"
                        }`}
                      >
                        {msg.hasAppliedPatch ? <Check size={10} className="text-emerald-400 font-black" /> : <Plus size={10} />}
                        {msg.hasAppliedPatch ? "Changes written & active" : "Merge AI suggested changes"}
                      </button>
                    </div>
                  )}

                </div>

                {/* Bubble timestamp */}
                <span className="text-[8px] text-neutral-500 font-mono self-end pr-1.5 mt-0.5">
                  {msg.timestamp}
                </span>

              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 5. DOCK SYSTEM PROMPT COMPOSER BAR (Cursor Cmd+I Composer format) */}
      <div className="border-t border-[#1f2127] bg-[#0f1012] p-4 space-y-3 shrink-0 shadow-2xl select-none">
        
        {/* Workspace context reference pills */}
        <div className="flex flex-wrap items-center gap-1 text-[9.5px]">
          <span className="text-neutral-500 font-bold uppercase mr-1 text-[8.5px] font-mono">@Modifiers:</span>
          
          <button
            onClick={() => {
              playClickSound();
              setPromptInput(prev => `${prev} @File:${selectedFiles[0] || "server.ts"}`);
              addLog(`📎 Context file ${selectedFiles[0] || "server.ts"} appended reference tag to prompt.`, "info");
            }}
            className="px-2 py-0.5 bg-[#121316] hover:bg-[#1e2025] border border-[#1f2127] hover:border-neutral-500 rounded text-neutral-300 hover:text-white transition-all flex items-center gap-1 font-mono text-[8.5px]"
            title="Appends selected active context files"
          >
            <FileText size={9} className="text-amber-400" />
            <span>@File</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setPromptInput(prev => `${prev} @Folder:src/components`);
              addLog("📎 Context location folder appended reference tag to prompt.", "info");
            }}
            className="px-2 py-0.5 bg-[#121316] hover:bg-[#1e2025] border border-[#1f2127] hover:border-neutral-500 rounded text-neutral-300 hover:text-white transition-all flex items-center gap-1 font-mono text-[8.5px]"
            title="Appends project folders"
          >
            <Folder size={9} className="text-amber-500" />
            <span>@Folder</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setPromptInput(prev => `${prev} @Terminal:logs`);
              addLog("📎 Context terminal diagnostics appended reference tag to prompt.", "info");
            }}
            className="px-2 py-0.5 bg-[#121316] hover:bg-[#1e2025] border border-[#1f2127] hover:border-neutral-500 rounded text-neutral-300 hover:text-white transition-all flex items-center gap-1 font-mono text-[8.5px]"
            title="Appends error stdout streams"
          >
            <Terminal size={9} className="text-amber-400" />
            <span>@Terminal</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setPromptInput(prev => `${prev} @Git:diff`);
              addLog("📎 Context Git staged differences appended reference tag to prompt.", "info");
            }}
            className="px-2 py-0.5 bg-[#121316] hover:bg-[#1e2025] border border-[#1f2127] hover:border-neutral-500 rounded text-neutral-300 hover:text-white transition-all flex items-center gap-1 font-mono text-[8.5px]"
            title="Appends Git branches status"
          >
            <GitBranch size={9} className="text-amber-400" />
            <span>@Git</span>
          </button>
        </div>

        {/* Input box row */}
        <div className="flex flex-col md:flex-row gap-2.5 items-stretch">
          
          {/* Target reference dropdown selection */}
          <div className="flex flex-col justify-center min-w-[130px] shrink-0">
            <span className="text-[8px] font-bold text-neutral-400 uppercase block mb-1 font-mono">
              Target File Route
            </span>
            <select
              value={targetFile}
              onChange={(e) => { playClickSound(); setTargetFile(e.target.value); }}
              className="bg-[#121316] border border-[#1f2127] rounded p-1.5 text-[10.5px] text-white font-mono focus:border-neutral-500 outline-none transition-all shadow-inner"
            >
              {popularTargetFiles.map((f, idx) => (
                <option key={idx} value={f} className="font-mono">{f === "auto" ? "✨ auto-detect" : f.split("/").pop()}</option>
              ))}
            </select>
          </div>

          {/* Prompt composer container */}
          <div className="flex-1 flex items-center bg-[#121316] hover:bg-[#1a1b20] focus-within:bg-[#070809] focus-within:border-neutral-400 border border-[#1f2127] rounded-lg p-1.5 transition-all shadow-inner">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={`Command your team... (e.g., "Write an optimized postgres db schema")`}
              className="flex-1 bg-transparent border-none outline-none font-sans text-xs text-white placeholder-gray-500 px-2.5 min-h-[35px]"
              disabled={isAgentRunning}
              onKeyDown={(e) => {
                if (e.key === "Enter" && promptInput.trim() && !isAgentRunning) {
                  handleExecuteAgenticTask();
                }
              }}
            />

            {/* Voice Transcribe simulation trigger */}
            <button
              onClick={() => {
                playClickSound();
                setPromptInput("Verify and audit all JWT token access roles in server.ts");
                addLog("🎙️ Voice transcription captured: 'Verify and audit all JWT token access roles in server.ts'", "info");
              }}
              className="p-1.5 text-neutral-400 hover:text-white transition-all shrink-0"
              title="Simulate Speech Transcription Input"
            >
              <Activity size={13} className="text-amber-400 animate-pulse" />
            </button>

            {/* Send Synthesis */}
            <button
              onClick={() => handleExecuteAgenticTask()}
              disabled={isAgentRunning || !promptInput.trim()}
              className="bg-amber-400 hover:bg-amber-500 text-black p-2 px-3.5 rounded text-[11px] font-sans font-black transition-all disabled:opacity-40 flex items-center gap-1.5 shrink-0 shadow-md"
            >
              {isAgentRunning ? (
                <>
                  <RefreshCw size={11} className="animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send size={11} />
                  <span>Synthesize</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
