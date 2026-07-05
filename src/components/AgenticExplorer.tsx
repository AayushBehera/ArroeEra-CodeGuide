import React, { useState } from "react";
import { 
  SlidersHorizontal, Sparkles, UploadCloud, Search, 
  ChevronDown, ChevronUp, FolderOpen, Folder, FileText,
  Files, Database, GitBranch, Cpu, Settings, ShieldAlert,
  Info
} from "lucide-react";

interface AgenticExplorerProps {
  selectedFiles: string[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<string[]>>;
  autoScanEnabled: boolean;
  setAutoScanEnabled: (val: boolean) => void;
  workspaceFiles: any[];
  expandedFolders: Record<string, boolean>;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  fileSearchTerm: string;
  setFileSearchTerm: (val: string) => void;
  handleFolderImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  playClickSound: () => void;
  activeEditorFile: string;
  onOpenFile: (path: string) => void;
}

export default function AgenticExplorer({
  selectedFiles,
  setSelectedFiles,
  autoScanEnabled,
  setAutoScanEnabled,
  workspaceFiles,
  expandedFolders,
  setExpandedFolders,
  fileSearchTerm,
  setFileSearchTerm,
  handleFolderImport,
  playClickSound,
  activeEditorFile,
  onOpenFile
}: AgenticExplorerProps) {
  const [activeRailTab, setActiveRailTab] = useState<"files" | "settings">("files");
  const [isMemoryExpanded, setIsMemoryExpanded] = useState(true);

  return (
    <div className="flex h-full bg-[#0c0d0e] text-[#c5c6c9] font-sans overflow-hidden select-none border-r border-[#1f2127]">
      
      {/* 1. COMPACT ACTIVITY BAR (Cursor Rail) */}
      <div className="w-[48px] bg-[#070809] border-r border-[#1a1b1e] flex flex-col items-center py-4 justify-between shrink-0">
        <div className="flex flex-col gap-5 items-center w-full">
          {/* Logo element */}
          <div className="w-7 h-7 rounded-lg bg-[#1e2025] flex items-center justify-center text-amber-400 font-mono font-black text-xs animate-pulse">
            A
          </div>

          {/* Activity Icons */}
          <button
            onClick={() => { playClickSound(); setActiveRailTab("files"); }}
            className={`p-2.5 rounded-xl transition-all relative group ${
              activeRailTab === "files" ? "text-white bg-[#1e2025]" : "text-neutral-500 hover:text-neutral-200"
            }`}
            title="Workspace Explorer"
          >
            <Files size={18} />
            <span className="absolute left-14 bg-black text-white text-[9px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">
              Explorer (Files)
            </span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveRailTab("settings"); }}
            className={`p-2.5 rounded-xl transition-all relative group ${
              activeRailTab === "settings" ? "text-white bg-[#1e2025]" : "text-neutral-500 hover:text-neutral-200"
            }`}
            title="Context Controls"
          >
            <Settings size={18} />
            <span className="absolute left-14 bg-black text-white text-[9px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">
              Context Settings
            </span>
          </button>
        </div>

        {/* Bottom Rail status indicator */}
        <div className="flex flex-col gap-4 items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
          <Cpu size={16} className="text-neutral-600 hover:text-neutral-300 transition-colors cursor-pointer" />
        </div>
      </div>

      {/* 2. SIDEBAR PANEL CONTENTS */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {activeRailTab === "files" ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Explorer Section Title Header */}
            <div className="px-4 py-3 border-b border-[#1f2127] flex items-center justify-between shrink-0 bg-[#090a0b]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white font-mono">
                Explorer: Workspace
              </span>
              <span className="text-[9px] bg-[#1e2025] text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                {selectedFiles.length} context
              </span>
            </div>

            {/* Scrollable File List Panel */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
              
              {/* Dynamic Context Auto-Scan control */}
              <div className="bg-[#121316] border border-[#1f2127] rounded-lg p-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-neutral-200 font-sans flex items-center gap-1 uppercase tracking-wider">
                    ⚡ AI Auto-Scan
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setAutoScanEnabled(!autoScanEnabled);
                    }}
                    className={`relative inline-flex h-4 w-7.5 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      autoScanEnabled ? "bg-amber-500" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        autoScanEnabled ? "translate-x-3.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[8.5px] text-gray-400 font-sans leading-relaxed">
                  Automatically attaches relevant files to context based on your query.
                </p>
                {autoScanEnabled && (
                  <div className="inline-flex items-center gap-1 text-[8px] font-bold text-amber-400 bg-amber-950/40 border border-amber-900/30 px-1.5 py-0.5 rounded animate-pulse">
                    <Sparkles size={8} /> Auto-Context Sync Active
                  </div>
                )}
              </div>

              {/* Workspace Search & Filter */}
              <div className="space-y-1">
                <span className="text-[8.5px] font-bold text-neutral-400 uppercase tracking-wider block font-sans">
                  Workspace Files
                </span>
                <div className="relative">
                  <Search size={11} className="absolute left-2.5 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    value={fileSearchTerm}
                    onChange={(e) => setFileSearchTerm(e.target.value)}
                    placeholder="Filter files or enter custom path..."
                    className="w-full bg-[#121316] border border-[#1f2127] rounded pl-7 pr-2 py-1.5 text-[9.5px] text-white font-mono placeholder-gray-500 focus:border-neutral-500 outline-none transition-all"
                  />
                  {fileSearchTerm.trim() !== "" && !workspaceFiles.some(f => f.path.toLowerCase() === fileSearchTerm.trim().toLowerCase()) && (
                    <button
                      onClick={() => {
                        playClickSound();
                        const newPath = fileSearchTerm.trim();
                        if (newPath) {
                          setSelectedFiles(prev => [...prev, newPath]);
                          onOpenFile(newPath);
                          setFileSearchTerm("");
                        }
                      }}
                      className="absolute right-1 top-1 text-[8px] font-bold bg-[#1e2025] text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>

              {/* Hierarchical Files View */}
              <div className="border border-[#1f2127] rounded bg-[#0a0b0d] p-1.5 space-y-0.5 max-h-[260px] overflow-y-auto no-scrollbar">
                {workspaceFiles
                  .filter(file => {
                    if (fileSearchTerm.trim() === "") return true;
                    return file.path.toLowerCase().includes(fileSearchTerm.toLowerCase());
                  })
                  .map((file) => {
                    const isSelectedContext = selectedFiles.includes(file.path);
                    const isEditing = activeEditorFile === file.path;
                    const parentParts = file.path.split("/");
                    
                    const isRootOrParentExpanded = parentParts.length === 1 || 
                      parentParts.slice(0, -1).every((_, i) => {
                        const partialPath = parentParts.slice(0, i + 1).join("/");
                        return expandedFolders[partialPath];
                      });

                    if (!isRootOrParentExpanded && fileSearchTerm.trim() === "") {
                      return null;
                    }

                    const indent = (parentParts.length - 1) * 7;

                    if (file.isFolder) {
                      const isExpanded = expandedFolders[file.path];
                      return (
                        <button
                          key={file.path}
                          onClick={() => {
                            playClickSound();
                            setExpandedFolders(prev => ({ ...prev, [file.path]: !isExpanded }));
                          }}
                          style={{ paddingLeft: `${indent}px` }}
                          className="w-full flex items-center gap-1.5 py-1 text-left text-[9.5px] font-bold text-neutral-400 hover:text-white hover:bg-[#121316] rounded transition-all"
                        >
                          {isExpanded ? <ChevronDown size={9} className="text-neutral-500" /> : <ChevronUp size={9} className="text-neutral-500" />}
                          {isExpanded ? <FolderOpen size={10} className="text-amber-500" /> : <Folder size={10} className="text-amber-600" />}
                          <span className="truncate">{file.name}</span>
                        </button>
                      );
                    }

                    return (
                      <div
                        key={file.path}
                        style={{ paddingLeft: `${indent + 10}px` }}
                        onClick={() => {
                          playClickSound();
                          onOpenFile(file.path);
                        }}
                        className={`flex items-center justify-between p-1 rounded text-[9.5px] cursor-pointer group border transition-all ${
                          isEditing 
                            ? "bg-[#1f2127] border-[#3b82f6] text-white" 
                            : "bg-transparent border-transparent text-neutral-400 hover:bg-[#121316] hover:text-neutral-200"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          {/* Small checkbox on the side to manage dynamic context selection */}
                          <input
                            type="checkbox"
                            checked={isSelectedContext}
                            onChange={(e) => {
                              e.stopPropagation();
                              playClickSound();
                              if (autoScanEnabled) {
                                setAutoScanEnabled(false);
                              }
                              if (isSelectedContext) {
                                setSelectedFiles(prev => prev.filter(f => f !== file.path));
                              } else {
                                setSelectedFiles(prev => [...prev, file.path]);
                              }
                            }}
                            className="rounded border-[#1f2127] bg-[#121316] text-amber-500 focus:ring-0 focus:ring-offset-0 h-3 w-3 cursor-pointer shrink-0"
                            title="Include file in AI prompt context"
                          />
                          <FileText size={9.5} className={isEditing ? "text-amber-400" : "text-neutral-500"} />
                          <span className={`font-mono text-[9.5px] truncate ${isEditing ? "font-bold text-white" : ""}`}>
                            {file.name}
                          </span>
                        </div>
                        
                        {isSelectedContext && (
                          <span className="text-[7.5px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1 py-0.1 rounded uppercase scale-90 font-mono font-bold">
                            CTX
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Tree action helper row */}
              <div className="flex gap-2 justify-between items-center text-[8px] font-bold uppercase tracking-wider">
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedFiles([]);
                    setAutoScanEnabled(false);
                  }}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  Clear Context
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedFiles(["package.json", "server.ts", "src/App.tsx", "src/types.ts"]);
                    setAutoScanEnabled(false);
                  }}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  Defaults
                </button>
              </div>

              {/* Drag and Drop Local file state mount */}
              <div className="border border-dashed border-[#262930] hover:border-neutral-500 rounded-lg p-2.5 space-y-1.5 bg-[#121316]/50 hover:bg-[#121316] transition-all flex flex-col text-center">
                <span className="text-[9px] font-bold text-neutral-300 font-sans flex items-center justify-between">
                  📁 Mount Local Directory
                  <span className="text-[7.5px] bg-[#1e2025] text-neutral-400 px-1 py-0.2 rounded">HTML5</span>
                </span>
                <p className="text-[8px] text-gray-400 font-sans leading-normal text-left">
                  Upload files directly to make them browsable inside the active IDE.
                </p>
                
                <label className="flex items-center justify-center gap-1.5 w-full bg-[#1e2025] hover:bg-neutral-800 text-white rounded py-1 text-[9.5px] font-bold cursor-pointer transition-all border border-[#262930]">
                  <UploadCloud size={11} className="text-amber-400" />
                  <span>Choose Workspace Folder</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFolderImport}
                    {...{ webkitdirectory: "", directory: "" }}
                  />
                </label>
              </div>

            </div>
          </div>
        ) : (
          /* SETTINGS PANEL CONTENTS */
          <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            <div className="border-b border-[#1f2127] pb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white font-mono block">
                ⚙️ IDE Context Setup
              </span>
              <p className="text-[8.5px] text-gray-400 mt-1">Configure active parameters of our engineering environment.</p>
            </div>

            {/* Pinned Workspace Memory */}
            <div className="space-y-2">
              <button 
                onClick={() => { playClickSound(); setIsMemoryExpanded(!isMemoryExpanded); }}
                className="w-full flex items-center justify-between text-[9px] font-bold text-neutral-200 uppercase tracking-wide bg-[#121316] p-2 rounded"
              >
                <span>🧠 Workspace Memory</span>
                {isMemoryExpanded ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
              </button>
              
              {isMemoryExpanded && (
                <div className="bg-[#0a0b0d] p-2.5 rounded border border-[#1f2127] space-y-2">
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Target Framework</span>
                    <span className="font-mono text-[9px] text-white flex items-center gap-1">
                      <span className="w-1 h-1 rounded bg-[#3b82f6]"></span> React SPA + Express Server (Full Stack)
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Production Build Output</span>
                    <span className="font-mono text-[9px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded bg-emerald-400"></span> dist/server.cjs (CommonJS Bundle)
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Active Database</span>
                    <span className="font-mono text-[9px] text-amber-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded bg-amber-400"></span> PostgreSQL / Drizzle Schemas
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* General tips */}
            <div className="bg-[#121316] border border-[#1f2127] rounded-lg p-2.5 space-y-1">
              <span className="text-[8.5px] font-bold text-neutral-300 font-sans flex items-center gap-1 uppercase">
                <Info size={10} className="text-amber-400" /> Workspace Isolation
              </span>
              <p className="text-[8px] text-gray-400 leading-normal">
                Files modified in this session are compiled in-memory inside the browser and localstorage, allowing secure sandbox execution before direct physical commits.
              </p>
            </div>
          </div>
        )}

        {/* Footer credit status indicator */}
        <div className="p-2 bg-[#070809] border-t border-[#1f2127] text-neutral-500 text-[8px] font-mono flex items-center justify-between">
          <span>BRANCH: main</span>
          <span className="text-emerald-500 font-bold">● CLOUD WORKSPACE</span>
        </div>

      </div>

    </div>
  );
}
