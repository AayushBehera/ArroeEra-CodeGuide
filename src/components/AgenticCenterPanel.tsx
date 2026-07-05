import React, { useState } from "react";
import { 
  FileCode, Split, Check, Plus, RefreshCw, X, Folder, FileText,
  ChevronDown, ChevronUp, Terminal, Trash2, Maximize2, Minimize2, Copy, Play
} from "lucide-react";

interface AgenticCenterPanelProps {
  activeEditorFile: string;
  onOpenFile: (path: string) => void;
  virtualWorkspaceContents: Record<string, string>;
  proposedPatch: any;
  setProposedPatch: React.Dispatch<React.SetStateAction<any>>;
  isApplyingPatch: boolean;
  handleApplyWorkspacePatch: (msgId?: string) => void;
  hasAppliedPatch: boolean;
  setHasAppliedPatch: React.Dispatch<React.SetStateAction<boolean>>;
  diffViewMode: "diff" | "side";
  setDiffViewMode: (mode: "diff" | "side") => void;
  playClickSound: () => void;
  addLog: (msg: string, type?: "info" | "success" | "warn" | "error" | "code") => void;
  workspaceFiles: any[];
  agentLogs: any[];
  setAgentLogs: React.Dispatch<React.SetStateAction<any[]>>;
  logsEndRef: React.RefObject<HTMLDivElement | null>;
  leftPanelExpanded?: boolean;
  setLeftPanelExpanded?: (expanded: boolean) => void;
}

export default function AgenticCenterPanel({
  activeEditorFile,
  onOpenFile,
  virtualWorkspaceContents,
  proposedPatch,
  setProposedPatch,
  isApplyingPatch,
  handleApplyWorkspacePatch,
  hasAppliedPatch,
  setHasAppliedPatch,
  diffViewMode,
  setDiffViewMode,
  playClickSound,
  addLog,
  workspaceFiles,
  agentLogs,
  setAgentLogs,
  logsEndRef,
  leftPanelExpanded,
  setLeftPanelExpanded
}: AgenticCenterPanelProps) {
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(true);
  const [terminalHeight, setTerminalHeight] = useState("h-48");

  // A high-fidelity code tokenizer for standard JS/TS/JSON contents inside our IDE editor
  const highlightCodeText = (filePath: string, code: string) => {
    if (!code) {
      return <div className="text-neutral-500 italic font-mono text-center py-12">// Empty file in workspace</div>;
    }

    const lines = code.split("\n");
    return lines.map((line, idx) => {
      // Style comment rows immediately
      if (line.trim().startsWith("//") || line.trim().startsWith("/*") || line.trim().startsWith("*")) {
        return (
          <span key={idx} className="text-[#6272a4] italic font-mono block">
            {line}
          </span>
        );
      }

      let escaped = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      // Apply highlighting for JS/TS keywords
      const keywords = [
        "import", "from", "export", "default", "const", "let", "var",
        "function", "return", "class", "interface", "extends", "implements",
        "await", "async", "try", "catch", "new", "if", "else", "for", "while",
        "of", "in"
      ];
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, "g");
        escaped = escaped.replace(regex, `<span class="text-[#ff79c6] font-bold">${kw}</span>`);
      });

      // Types keywords
      const types = [
        "Request", "Response", "NextFunction", "UserRequest", "User",
        "pgTable", "serial", "text", "timestamp", "varchar", "integer"
      ];
      types.forEach(ty => {
        const regex = new RegExp(`\\b${ty}\\b`, "g");
        escaped = escaped.replace(regex, `<span class="text-[#8be9fd]">${ty}</span>`);
      });

      // Highlight strings
      escaped = escaped.replace(/(["'`])(.*?)\1/g, `<span class="text-[#f1fa8c]">$&</span>`);

      // Highlight numbers
      escaped = escaped.replace(/\b(\d+)\b/g, `<span class="text-[#bd93f9]">$1</span>`);

      return (
        <span 
          key={idx} 
          className="font-mono block min-h-[17px] text-[#f8f8f2] break-all whitespace-pre"
          dangerouslySetInnerHTML={{ __html: escaped || " " }}
        />
      );
    });
  };

  // Extract core file name
  const getFileName = (path: string) => {
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  // Get active file list for tabs (preset a few popular ones plus active)
  const tabsList = Array.from(new Set([
    "src/components/AuthRoute.tsx",
    "src/db/schema.ts",
    "server.ts",
    "src/App.tsx",
    activeEditorFile
  ])).filter(p => {
    // Only show file paths that exist or match current file
    return p === activeEditorFile || workspaceFiles.some(w => w.path === p);
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0b0d] text-neutral-200">
      
      {/* 1. IDE FILE TABS BAR */}
      <div className="bg-[#0f1012] border-b border-[#1f2127] flex items-center justify-between shrink-0 select-none overflow-x-auto no-scrollbar">
        <div className="flex">
          {tabsList.map((filePath) => {
            const isActive = activeEditorFile === filePath;
            return (
              <div
                key={filePath}
                onClick={() => { playClickSound(); onOpenFile(filePath); }}
                className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-mono cursor-pointer border-r border-[#1f2127] transition-all relative ${
                  isActive 
                    ? "bg-[#0a0b0d] text-white border-b-2 border-b-amber-400 font-bold" 
                    : "bg-[#0e0e10]/60 text-neutral-500 hover:bg-[#121316] hover:text-neutral-300"
                }`}
              >
                <FileText size={11} className={isActive ? "text-amber-400" : "text-neutral-600"} />
                <span>{getFileName(filePath)}</span>
                
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                )}
              </div>
            );
          })}
        </div>

        {/* View mode actions */}
        <div className="flex items-center gap-3 pr-3">
          {setLeftPanelExpanded && (
            <div className="flex items-center gap-2 border-r border-[#1f2127] pr-3 select-none">
              <span className="text-[9px] font-mono text-neutral-500 uppercase font-semibold">
                Explorer
              </span>
              <button
                onClick={() => {
                  playClickSound();
                  setLeftPanelExpanded(!leftPanelExpanded);
                }}
                className="relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-neutral-800"
                style={{
                  backgroundColor: leftPanelExpanded ? "#f59e0b" : "#262626"
                }}
                title={leftPanelExpanded ? "Hide File Explorer slider" : "Show File Explorer slider"}
              >
                <span
                  className="pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  style={{
                    transform: leftPanelExpanded ? "translateX(16px)" : "translateX(0px)"
                  }}
                />
              </button>
            </div>
          )}
          <span className="text-[9px] text-neutral-600 font-mono hidden md:inline">
            SYSTEM: ACTIVE WRITER
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>

      {/* 2. CORE EDITOR CONTAINER PANEL (Big Screen) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Floating Patch Proposal Bar (Cursor-like CMD+K patch bar) */}
        {proposedPatch && proposedPatch.file === activeEditorFile && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#121316] border-2 border-amber-500/80 rounded-xl p-3 shadow-2xl z-50 w-[94%] max-w-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 animate-pulse shrink-0">
                <FileCode size={13} />
              </span>
              <div>
                <p className="text-[10px] font-bold text-white uppercase font-mono">
                  Suggested AI Code Patch Ready
                </p>
                <p className="text-[9px] text-neutral-400 font-sans mt-0.5">
                  Proposed improvements for <code className="text-amber-300 font-mono">{getFileName(activeEditorFile)}</code>. Review the comparative diff below.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
              {/* Diff View toggler */}
              <div className="bg-[#0a0b0d] rounded p-0.5 flex gap-0.5 border border-[#1f2127]">
                <button
                  onClick={() => { playClickSound(); setDiffViewMode("diff"); }}
                  className={`px-2 py-0.5 rounded text-[8.5px] font-bold transition-all ${
                    diffViewMode === "diff" ? "bg-amber-500 text-black font-extrabold" : "text-neutral-500 hover:text-white"
                  }`}
                >
                  Unified
                </button>
                <button
                  onClick={() => { playClickSound(); setDiffViewMode("side"); }}
                  className={`px-2 py-0.5 rounded text-[8.5px] font-bold transition-all ${
                    diffViewMode === "side" ? "bg-amber-500 text-black font-extrabold" : "text-neutral-500 hover:text-white"
                  }`}
                >
                  Side-by-Side
                </button>
              </div>

              {/* Reject */}
              <button
                onClick={() => {
                  playClickSound();
                  setProposedPatch(null);
                  setHasAppliedPatch(false);
                  addLog(`❌ AI proposed patch for '${getFileName(activeEditorFile)}' rejected and discarded.`, "warn");
                }}
                className="px-2.5 py-1 text-[8.5px] font-bold bg-rose-950/40 text-rose-400 hover:bg-rose-900/30 rounded border border-rose-900/50 transition-all"
              >
                Reject
              </button>

              {/* Accept & Merge */}
              <button
                onClick={() => handleApplyWorkspacePatch()}
                disabled={hasAppliedPatch || isApplyingPatch}
                className={`px-3 py-1 text-[8.5px] font-extrabold rounded flex items-center gap-1 transition-all shadow-md ${
                  hasAppliedPatch
                    ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/50"
                    : "bg-amber-400 text-black hover:bg-amber-500 animate-pulse"
                }`}
              >
                {isApplyingPatch ? (
                  <RefreshCw size={10} className="animate-spin text-black" />
                ) : hasAppliedPatch ? (
                  <Check size={10} />
                ) : (
                  <Plus size={10} />
                )}
                <span>{hasAppliedPatch ? "Merged Successfully" : "Accept & Merge"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Code Area */}
        <div className="flex-1 overflow-auto p-4 select-text">
          {proposedPatch && proposedPatch.file === activeEditorFile ? (
            /* COMPARATIVE DIFF VIEWER OVERLAY MODE */
            <div className="h-full flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2127] pb-1">
                <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase">
                  DIFFERENCE COMPARISON: {getFileName(activeEditorFile)}
                </span>
                <span className="text-[8.5px] text-amber-400 bg-amber-950/40 border border-amber-900/30 px-1.5 py-0.2 rounded font-mono">
                  Interactive Merge Sandbox
                </span>
              </div>

              {diffViewMode === "side" ? (
                /* Side-by-Side Panel (Desktop Grid) */
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-hidden h-full">
                  
                  {/* Left Side: Before */}
                  <div className="border border-[#1f2127] rounded-lg overflow-hidden flex flex-col bg-[#070809]">
                    <div className="bg-[#0f1012] border-b border-[#1f2127] px-3 py-1.5 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-neutral-500 font-mono uppercase">Original Code</span>
                      <span className="text-[7.5px] bg-neutral-900 text-neutral-400 font-bold px-1 rounded uppercase">Read-Only</span>
                    </div>
                    <div className="p-3 overflow-auto font-mono text-[10px] leading-relaxed max-w-full flex-1">
                      {(() => {
                        const lines = (proposedPatch.originalCode || "").split("\n");
                        return lines.map((line: string, idx: number) => (
                          <div key={idx} className="flex hover:bg-[#121316]/50">
                            <span className="w-8 shrink-0 text-right pr-2 select-none text-neutral-600 border-r border-[#1a1b1e] mr-2 text-[8px] font-mono font-semibold">
                              {idx + 1}
                            </span>
                            <span className="whitespace-pre font-mono block flex-1 text-neutral-400 select-text break-all">
                              {line || " "}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Right Side: After */}
                  <div className="border border-[#1f2127] rounded-lg overflow-hidden flex flex-col bg-[#070809]">
                    <div className="bg-[#0f1012] border-b border-[#1f2127] px-3 py-1.5 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-white font-mono uppercase">Suggested Changes</span>
                      <span className="text-[7.5px] bg-emerald-950/80 text-emerald-400 border border-emerald-900/50 font-extrabold px-1 rounded uppercase tracking-wide">AI Generation</span>
                    </div>
                    <div className="p-3 overflow-auto font-mono text-[10px] leading-relaxed max-w-full flex-1">
                      {(() => {
                        const lines = (proposedPatch.code || "").split("\n");
                        return lines.map((line: string, idx: number) => (
                          <div key={idx} className="flex hover:bg-[#121316] bg-emerald-950/10">
                            <span className="w-8 shrink-0 text-right pr-2 select-none text-emerald-600 border-r border-[#1a1b1e] mr-2 text-[8px] font-mono font-semibold bg-emerald-950/20">
                              {idx + 1}
                            </span>
                            <span className="whitespace-pre font-mono block flex-1 text-[#f8f8f2] select-text break-all font-bold">
                              {line || " "}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                </div>
              ) : (
                /* Unified Unified Diff Code block */
                <div className="flex-1 bg-[#070809] border border-[#1f2127] rounded-lg overflow-auto shadow-inner p-3 font-mono text-[9.5px]">
                  {proposedPatch.diffLines.map((line: any, idx: number) => {
                    const isAdd = line.type === "add" || line.text.startsWith("+");
                    const isRemove = line.type === "remove" || line.text.startsWith("-");
                    const rowBg = isAdd ? "bg-emerald-950/20 text-emerald-400" : isRemove ? "bg-rose-950/20 text-rose-400" : "text-neutral-400";
                    return (
                      <div key={idx} className={`py-0.5 px-2 font-mono select-text truncate ${rowBg}`}>
                        {line.text}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* REGULAR STANDARD CODE VIEWING MODE */
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-[#1f2127] pb-1.5 select-none shrink-0 mb-3">
                <span className="text-[9.5px] font-mono text-neutral-500 font-bold uppercase flex items-center gap-1">
                  <Play size={9} className="text-emerald-500 fill-emerald-500" />
                  WORKSPACE SOURCE: {activeEditorFile}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playClickSound();
                      navigator.clipboard.writeText(virtualWorkspaceContents[activeEditorFile] || "");
                      addLog(`📋 Copied contents of ${getFileName(activeEditorFile)} to clipboard.`, "info");
                    }}
                    className="p-1 hover:bg-[#121316] hover:text-white rounded border border-[#1f2127] transition-all text-neutral-500 flex items-center gap-1 text-[8px] font-mono"
                    title="Copy full file code"
                  >
                    <Copy size={9} />
                    <span>COPY</span>
                  </button>
                  <span className="text-[8px] text-neutral-600 font-mono">
                    SIZE: {Math.round((virtualWorkspaceContents[activeEditorFile] || "").length / 102.4) / 10} KB
                  </span>
                </div>
              </div>

              {/* Code lines container */}
              <div className="flex-1 overflow-auto bg-[#070809] border border-[#1a1b1e] rounded-lg p-4 flex">
                {/* Line Numbers column */}
                <div className="select-none text-neutral-600 font-mono text-[10px] text-right pr-3.5 border-r border-[#1e2025] mr-3.5 w-8 shrink-0 leading-relaxed font-bold">
                  {(virtualWorkspaceContents[activeEditorFile] || "").split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Styled TS Code contents column */}
                <div className="flex-1 overflow-x-auto text-[10.5px] leading-relaxed max-w-full font-mono">
                  {highlightCodeText(activeEditorFile, virtualWorkspaceContents[activeEditorFile] || "")}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 3. COLLAPSIBLE TERMINAL LOGS DRAWER (At the bottom, VS Code style!) */}
      <div className={`border-t border-[#1f2127] bg-[#070809] flex flex-col shrink-0 select-none ${isTerminalExpanded ? terminalHeight : "h-9"}`}>
        {/* Terminal Header Tab */}
        <div className="bg-[#0f1012] px-3 py-1.5 border-b border-[#1f2127] flex items-center justify-between shrink-0 cursor-pointer"
             onClick={() => { playClickSound(); setIsTerminalExpanded(!isTerminalExpanded); }}>
          <div className="flex items-center gap-2">
            <Terminal size={11} className="text-amber-400 animate-pulse" />
            <span className="text-[9.5px] uppercase font-mono font-bold text-white tracking-wider">
              Output: Mechanical Bundler & Run Logs
            </span>
            <span className="text-[8px] bg-[#121316] text-neutral-400 px-1.5 py-0.2 rounded font-mono font-semibold">
              Port: 3000 Bound
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Terminal height toggles */}
            {isTerminalExpanded && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); playClickSound(); setTerminalHeight(terminalHeight === "h-48" ? "h-72" : "h-48"); }}
                  className="p-0.5 hover:bg-[#121316] rounded text-neutral-500 hover:text-white"
                  title="Toggle Tall Terminal Pane"
                >
                  <Maximize2 size={9} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); playClickSound(); setAgentLogs([]); }}
                  className="p-0.5 hover:bg-[#121316] rounded text-neutral-500 hover:text-white"
                  title="Clear console buffer"
                >
                  <Trash2 size={9} />
                </button>
              </>
            )}
            <button className="text-neutral-500 hover:text-white">
              {isTerminalExpanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
            </button>
          </div>
        </div>

        {/* Scrollable Log Buffer Terminal */}
        {isTerminalExpanded && (
          <div className="flex-1 overflow-y-auto p-3 font-mono text-[9px] bg-[#050506] text-neutral-300 space-y-1 select-all no-scrollbar">
            {agentLogs.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center text-neutral-600 space-y-1 select-none">
                <Terminal size={16} className="opacity-40" />
                <p className="italic">Terminal stdout stream is clear. AI actions feed active run metrics.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {agentLogs.map((log) => {
                  let textClass = "text-neutral-400";
                  if (log.type === "success") textClass = "text-emerald-400 font-bold";
                  else if (log.type === "warn") textClass = "text-amber-400";
                  else if (log.type === "error") textClass = "text-rose-400 font-bold";
                  else if (log.type === "code") textClass = "text-neutral-500";
                  
                  return (
                    <div key={log.id} className="flex gap-2 items-start border-b border-neutral-900/30 pb-0.5 last:border-0">
                      <span className="text-neutral-700 select-none">[{log.timestamp}]</span>
                      <div className={`flex-1 ${textClass} break-all font-mono select-text`}>
                        {log.type === "code" ? (
                          <span className="bg-[#121316] px-1 rounded text-neutral-400 select-all font-mono">
                            {log.message}
                          </span>
                        ) : (
                          log.message
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
