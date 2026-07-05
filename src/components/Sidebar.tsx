import React from "react";
import { 
  LayoutDashboard, 
  Code2, 
  Cpu, 
  Activity, 
  GitBranch, 
  BookOpen, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Terminal,
  Flame
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  isCollapsed, 
  setIsCollapsed 
}: SidebarProps) {
  const menuItems = [
    { id: "workspace", label: "Workspace Intelligence", icon: LayoutDashboard },
    { id: "vibe_coding", label: "Agentic Workspace ⭐", icon: Flame },
    { id: "agents", label: "AI Agents", icon: Cpu },
    { id: "project_intelligence", label: "Project Intelligence", icon: Code2 },
    { id: "git", label: "Git Center", icon: GitBranch },
    { id: "devops", label: "System Health", icon: Activity },
    { id: "docs", label: "Docs & Architecture", icon: BookOpen },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div 
      className={`h-screen bg-[#070809] border-r border-[#1a1b1e] flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      id="sidebar-container"
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 border-b border-[#1a1b1e] bg-[#090a0b] flex items-center px-4 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-6 h-6 bg-amber-400 flex items-center justify-center rounded text-black shrink-0 font-bold text-xs select-none shadow-sm shadow-amber-400/20">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-black"><path d="M12 2L2 19h20L12 2zm0 4.5L18.5 17h-13L12 6.5z"/></svg>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-sans font-black text-sm tracking-tight text-white uppercase leading-none">
                  ArrowEra
                </span>
                <span className="font-mono text-[9px] text-amber-400 font-bold tracking-widest uppercase mt-0.5">
                  CODEGUIDE
                </span>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-neutral-500 hover:text-white p-1 hover:bg-[#121316] rounded transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            id="sidebar-toggle-btn"
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1 text-[8.5px] font-black text-neutral-500 uppercase tracking-widest font-mono">
              Workspace Intelligence
            </div>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all text-left text-xs border ${
                  isActive 
                    ? "bg-[#121316] border-[#fbbf24]/30 text-white font-bold" 
                    : "text-neutral-400 hover:text-white hover:bg-[#0c0d0e] border-transparent"
                }`}
              >
                <Icon size={15} className={`shrink-0 ${isActive ? "text-amber-400" : "text-neutral-500"}`} />
                {!isCollapsed && (
                  <span className="font-sans tracking-tight">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#1a1b1e] bg-[#090a0b]">
        <div className="flex items-center gap-3 px-3 py-2 text-xs text-neutral-400">
          <Terminal size={14} className="shrink-0 text-neutral-500" />
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-mono text-[8.5px] text-neutral-500 truncate">v1.4.2-stable</span>
              <span className="font-mono text-[8.5px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> Local Engine Active
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
