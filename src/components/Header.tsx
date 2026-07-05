import React, { useState } from "react";
import { Search, Bell, Shield, Cloud, Terminal, CheckCircle, X, Download, AlertCircle, RefreshCw } from "lucide-react";

interface HeaderProps {
  currentModel: string;
  setCurrentModel: (model: string) => void;
  geminiConfigured: boolean;
  onOpenCommandPalette: () => void;
  detectedModels?: string[];
  ollamaStatus?: 'connected' | 'disconnected' | 'checking' | 'idle';
  modelStates?: Record<string, {
    status: "up-to-date" | "update-available" | "pulling" | "failed" | "checking";
    progress?: number;
    totalBytes?: number;
    completedBytes?: number;
    newDigest?: string;
  }>;
  handlePullModel?: (modelName: string) => Promise<void>;
  toastNotification?: {
    modelName: string;
    newDigest: string;
    visible: boolean;
  } | null;
  setToastNotification?: React.Dispatch<React.SetStateAction<{
    modelName: string;
    newDigest: string;
    visible: boolean;
  } | null>>;
  user: any;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

export default function Header({
  currentModel,
  setCurrentModel,
  geminiConfigured,
  onOpenCommandPalette,
  detectedModels = [],
  ollamaStatus = 'idle',
  modelStates = {},
  handlePullModel,
  toastNotification = null,
  setToastNotification,
  user,
  onSignIn,
  onSignOut
}: HeaderProps) {
  const models = [
    { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash (Cloud/Local)" },
    { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro (Premium)" },
    ...(detectedModels.length > 0
      ? detectedModels.map((m) => ({ id: `ollama-${m}`, name: `Ollama: ${m} (Local)` }))
      : [{ id: "llama-3-8b", name: "Ollama Llama 3 (Local-first)" }]
    ),
    { id: "claude-3-opus", name: "Claude 3 Opus (Hybrid)" }
  ];

  return (
    <header className="h-16 bg-[#090a0b] border-b border-[#1a1b1e] flex items-center justify-between px-6 shrink-0 z-10">
      {/* Left Search Bar / Command Palette link */}
      <div className="flex items-center gap-4 w-1/3">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between bg-[#121316] hover:bg-[#1a1b20] border border-[#1f2127] hover:border-neutral-500 rounded px-3 py-1.5 text-left text-xs text-neutral-400 transition-all focus:outline-none"
          id="header-command-palette-trigger"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="text-neutral-500" />
            <span className="font-sans">Search files or type command...</span>
          </div>
          <kbd className="font-mono bg-[#1a1b20] border border-[#1f2127] px-1.5 py-0.5 rounded text-[10px] text-neutral-500 shadow-sm">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 text-neutral-300">
        {/* Model Router */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
            Model Routing:
          </span>
          <select
            id="header-model-selector"
            value={currentModel}
            onChange={(e) => setCurrentModel(e.target.value)}
            className="bg-[#121316] border border-[#1f2127] rounded text-xs px-2.5 py-1.5 font-sans font-bold text-white hover:border-neutral-500 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#121316] text-white">
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gemini Active Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#121316] border border-[#1f2127]">
          {geminiConfigured ? (
            <>
              <CheckCircle size={12} className="text-emerald-400" />
              <span className="font-sans text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Gemini Active
              </span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-sans text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Local Simulator
              </span>
            </>
          )}
        </div>

        {/* Ollama Local Active Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#121316] border border-[#1f2127]">
          {ollamaStatus === "connected" ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-sans text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Ollama Active ({detectedModels.length})
              </span>
            </>
          ) : ollamaStatus === "checking" ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-spin" />
              <span className="font-sans text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Scanning...
              </span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
              <span className="font-sans text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Ollama Offline
              </span>
            </>
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 border-l border-[#1a1b1e] pl-4">
          <button 
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#121316] rounded transition-colors relative"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full" />
          </button>
          
          <div className="flex items-center gap-2 pl-2">
            {user ? (
              <>
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-amber-500 overflow-hidden flex items-center justify-center relative group">
                  <img 
                    src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100"} 
                    alt="Developer Avatar"
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full"
                  />
                  <button 
                    onClick={onSignOut}
                    className="absolute inset-0 bg-black/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono font-black text-red-400 tracking-tight"
                    title="Sign Out"
                  >
                    Logout
                  </button>
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="font-sans text-[11px] font-bold text-white leading-none">
                    {user.displayName || "Staff Architect"}
                  </span>
                  <span className="font-mono text-[9px] text-neutral-500 mt-0.5 truncate max-w-[125px]">
                    {user.email}
                  </span>
                </div>
              </>
            ) : (
              <button
                onClick={onSignIn}
                className="bg-amber-400 hover:bg-amber-500 text-black font-sans text-[10px] font-black py-1 px-3 rounded shadow-sm transition-all flex items-center gap-1"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating non-intrusive local model update toast notification */}
      {toastNotification && toastNotification.visible && (
        <div className="fixed top-18 right-6 w-80 bg-[#0f1012] border border-[#1f2127] rounded-lg shadow-2xl p-4 z-50 animate-in slide-in-from-top-4 duration-300 text-neutral-200">
          <div className="flex gap-3">
            <div className="mt-0.5 shrink-0">
              {modelStates[toastNotification.modelName]?.status === "up-to-date" ? (
                <div className="bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 p-1.5 rounded-full">
                  <CheckCircle size={15} />
                </div>
              ) : modelStates[toastNotification.modelName]?.status === "pulling" ? (
                <div className="bg-[#121316] text-amber-400 p-1.5 rounded-full animate-spin">
                  <RefreshCw size={15} />
                </div>
              ) : (
                <div className="bg-[#121316] text-amber-400 p-1.5 rounded-full">
                  <AlertCircle size={15} />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-sans font-bold text-xs text-white">
                  {modelStates[toastNotification.modelName]?.status === "up-to-date" 
                    ? "Model Synced!" 
                    : modelStates[toastNotification.modelName]?.status === "pulling"
                      ? "Updating local model..."
                      : "Registry Update Available"
                  }
                </span>
                <button
                  onClick={() => setToastNotification?.(null)}
                  className="text-neutral-500 hover:text-white p-0.5 rounded transition-colors"
                >
                  <X size={13} />
                </button>
              </div>

              <p className="font-mono text-[9px] bg-[#121316] border border-[#1f2127] inline-block px-1.5 py-0.5 rounded text-amber-400 mt-1 truncate max-w-full">
                {toastNotification.modelName}
              </p>

              <p className="font-sans text-[11px] text-neutral-400 mt-1.5 leading-relaxed">
                {modelStates[toastNotification.modelName]?.status === "up-to-date" 
                  ? "Local image has been successfully pulled and is now fully up-to-date with the registry."
                  : modelStates[toastNotification.modelName]?.status === "pulling" 
                    ? `Downloading model layers... ${modelStates[toastNotification.modelName]?.progress || 0}%`
                    : "A newer build is available on the Ollama registry. Layer digests differ."
                }
              </p>

              {modelStates[toastNotification.modelName]?.status === "pulling" && (
                <div className="mt-2.5 space-y-1">
                  <div className="w-full bg-[#121316] rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${modelStates[toastNotification.modelName]?.progress || 0}%` }}
                    />
                  </div>
                </div>
              )}

              {modelStates[toastNotification.modelName]?.status !== "pulling" && modelStates[toastNotification.modelName]?.status !== "up-to-date" && (
                <div className="mt-3.5 flex gap-2">
                  <button
                    onClick={() => handlePullModel?.(toastNotification.modelName)}
                    className="flex-1 bg-amber-400 hover:bg-amber-500 text-black font-sans text-[10px] font-black py-1.5 px-3 rounded shadow-sm transition-all flex items-center justify-center gap-1"
                  >
                    <Download size={10} />
                    Pull Update
                  </button>
                  <button
                    onClick={() => setToastNotification?.(null)}
                    className="bg-[#121316] hover:bg-[#1a1b20] border border-[#1f2127] text-white font-sans text-[10px] font-bold py-1.5 px-3 rounded transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {modelStates[toastNotification.modelName]?.status === "up-to-date" && (
                <div className="mt-3">
                  <button
                    onClick={() => setToastNotification?.(null)}
                    className="w-full bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900/40 font-sans text-[10px] font-bold py-1.5 px-3 rounded transition-all text-center block"
                  >
                    Awesome
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
