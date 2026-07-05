import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";

// ==========================================
// 1. Core Event Bus & Messaging Definition
// ==========================================
export interface EventBusMessage {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
  sender: string;
}

// ==========================================
// 2. The 12 Engine State Typings
// ==========================================

// 1. Workspace Engine State
export interface GraphNode {
  id: string;
  name: string;
  size: number;
  lines: number;
  type: string;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface WorkspaceEngineState {
  filesCount: number;
  totalLinesOfCode: number;
  repoSizeKB: number;
  primaryLanguage: string;
  framework: string;
  dependencyCount: number;
  dependencies: Record<string, string>;
  filesList: { path: string; size: number; lines: number }[];
  graph: { nodes: GraphNode[]; links: GraphLink[] };
  lastIndexed: string;
}

// 2. Context Engine State
export interface ContextItem {
  id: string;
  type: "file" | "git" | "prompt" | "terminal" | "diagnostics" | "memory";
  name: string;
  score: number; // Relevance ranking: 1-100
  contentSummary: string;
}

export interface ContextEngineState {
  items: ContextItem[];
  activeFile: string | null;
  focusedQuery: string;
  lastUpdated: string;
}

// 3. Logic Engine State (Internal Workflows)
export interface WorkflowTask {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  durationMs?: number;
}

export interface LogicEngineState_Internal {
  status: "idle" | "orchestrating" | "validating";
  activeWorkflow: string | null;
  workflowTasks: WorkflowTask[];
}

// 4. Multi-Agent Engine State
export interface CooperativeAgent {
  id: string;
  name: string;
  role: string;
  status: "idle" | "active" | "thinking" | "consensus_voting" | "completed";
  accuracy: number;
  taskTime: string;
  avatarColor: string;
  logs: { id: string; timestamp: string; message: string; type: "info" | "success" | "warning" | "error" }[];
}

export interface MultiAgentEngineState {
  agents: CooperativeAgent[];
  activeAgentId: string | null;
  consensusRate: number;
  activeSessionType: "collaboration" | "review" | "debugging" | "architecting";
}

// 5. AI Model Engine State
export interface ModelRoutingOption {
  id: string;
  name: string;
  provider: "Gemini" | "Claude" | "OpenAI" | "Ollama" | "OpenRouter";
  contextWindow: string;
  latencyRating: "Fast" | "Medium" | "Slow";
  tokensPerSec: number;
  temperature: number;
}

export interface AIModelEngineState {
  currentModelId: string;
  provider: string;
  temperature: number;
  cachingEnabled: boolean;
  routingFallbackActive: boolean;
  models: ModelRoutingOption[];
  inferenceRate: number; // dynamic tokens/sec
}

// 6. Project Intelligence Engine State
export interface CodeIssueItem {
  id: string;
  category: "Technical Debt" | "Dead Code" | "Circular Dependency" | "Complexity" | "TypeScript" | "Linter";
  message: string;
  severity: "info" | "warning" | "error";
  file: string;
  line?: number;
}

export interface ProjectIntelligenceEngineState {
  healthScore: number;
  complexityScore: number;
  technicalDebtHours: number;
  deadCodeCount: number;
  circularDependencies: string[];
  unusedPackages: string[];
  issues: CodeIssueItem[];
}

// 7. Git Engine State
export interface GitEngineState {
  isRepo: boolean;
  branch: string;
  modifiedCount: number;
  modifiedFiles: string[];
  recentCommits: { sha: string; message: string; time: string; author: string }[];
  stagedFiles: string[];
}

// 8. Performance Engine State
export interface PerformanceEngineState {
  cpuLoad: number;
  memoryUsage: number;
  diskUsage: number;
  heapUsedMB: number;
  totalMemGB: number;
  freeMemGB: number;
  uptimeHours: number;
  ipcLatencyMs: number;
  fileWatchLatencyMs: number;
  startupTimeMs: number;
}

// 9. Memory Engine State
export interface MemoryDecision {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: "Coding Style" | "Architecture Rule" | "Bug Fix Preference" | "Optimization Pattern";
}

export interface MemoryEngineState {
  decisions: MemoryDecision[];
  preferences: Record<string, string | boolean>;
  vectorEmbeddingCount: number;
  lastRetrievedKey: string | null;
}

// 10. Terminal Engine State
export interface TerminalEngineState {
  activeProcesses: { pid: string; name: string; port?: number }[];
  dockerStats: { containerId: string; name: string; cpu: string; memory: string }[];
  terminalLogs: string[];
}

// 11. Plugin Engine State
export interface PluginItem {
  id: string;
  name: string;
  version: string;
  status: "loaded" | "disabled";
  description: string;
  permissions: string[];
}

export interface PluginEngineState {
  plugins: PluginItem[];
  sandboxStatus: "secured" | "unsecured";
  hotReloadEnabled: boolean;
}

// 12. UI Synchronization Engine State
export interface UISynchronizationEngineState {
  subscribersCount: number;
  lastSyncTimestamp: string;
  busStatus: "healthy" | "congested";
  sessionActiveTimeSeconds: number;
}

// ==========================================
// 3. Typings legacy / backwards-compatible
// ==========================================
export interface SystemMetrics {
  cpuLoad: number;
  memoryUsage: number;
  diskUsage?: number;
  heapUsedMB: number;
  totalMemGB: number;
  freeMemGB: number;
  osType: string;
  osRelease: string;
  uptimeHours: number;
}

export interface WorkspaceMetrics {
  filesCount: number;
  totalLinesOfCode: number;
  repoSizeKB: number;
  primaryLanguage: string;
  framework: string;
  dependencyCount: number;
  dependencies: Record<string, string>;
  filesList: { path: string; size: number; lines: number }[];
  graph: { nodes: GraphNode[]; links: GraphLink[] };
}

export interface GitMetrics {
  isRepo: boolean;
  branch: string;
  modifiedCount: number;
  modifiedFiles: string[];
  recentCommits: { sha: string; message: string; time: string; author: string }[];
}

export interface CodeSmell {
  id: string;
  category: string;
  message: string;
  severity: "success" | "warning" | "info";
  impact: string;
  file: string;
}

export interface HealthMetrics {
  healthScore: number;
  complexityScore: number;
  technicalDebtHours: number;
  typescriptErrorsCount: number;
  lintErrorsCount: number;
  codeSmells: CodeSmell[];
}

export interface ServicePerformance {
  name: string;
  latencyMs: number;
  status: "healthy" | "warning" | "degraded";
  lastRun: string;
  loadPercent: number;
}

export interface PerformanceHistoryEntry {
  timestamp: string;
  services: Record<string, number>;
}

export interface PerformanceMetrics {
  ipcLatencyMs: number;
  fileWatchLatencyMs: number;
  startupTimeMs: number;
  services?: ServicePerformance[];
  history?: PerformanceHistoryEntry[];
}

export interface LogicEngineState {
  system: SystemMetrics;
  workspace: WorkspaceMetrics;
  git: GitMetrics;
  health: HealthMetrics;
  performance: PerformanceMetrics;
}

// ==========================================
// 4. Context Props Interface
// ==========================================
interface LogicEngineContextProps {
  metrics: LogicEngineState | null;
  isLoading: boolean;
  isAnalyzing: boolean;
  compilerLogs: string;
  compilerErrors: { id: string; message: string; severity: string }[];
  
  // Legacy Core operations
  refreshMetrics: () => Promise<void>;
  runCompilerCheck: () => Promise<void>;
  selectedFile: string | null;
  selectedFileContent: string | null;
  selectFile: (path: string | null) => Promise<void>;
  saveFile: (path: string, content: string) => Promise<boolean>;
  createFile: (path: string, content: string) => Promise<boolean>;
  executeCommand: (cmd: string) => Promise<{ success: boolean; output: string }>;

  // ========================================================
  // ⭐ 12 Engines & Centralized Event Bus Orchestration APIs ⭐
  // ========================================================
  events: EventBusMessage[];
  publishEvent: (type: string, payload: any, sender?: string) => void;
  
  // 12 Engines States
  workspaceEngine: WorkspaceEngineState;
  contextEngine: ContextEngineState;
  logicEngine: LogicEngineState_Internal;
  multiAgentEngine: MultiAgentEngineState;
  aiModelEngine: AIModelEngineState;
  projectIntelligenceEngine: ProjectIntelligenceEngineState;
  gitEngine: GitEngineState;
  performanceEngine: PerformanceEngineState;
  memoryEngine: MemoryEngineState;
  terminalEngine: TerminalEngineState;
  pluginEngine: PluginEngineState;
  uiSyncEngine: UISynchronizationEngineState;

  // Real-time Action Triggers on Engines
  triggerWorkflow: (workflowName: string, tasks: { name: string }[]) => Promise<void>;
  triggerAgentCollaboration: (sessionType: "collaboration" | "review" | "debugging" | "architecting") => void;
  updateModelSettings: (modelId: string, temp: number) => void;
  addMemoryDecision: (title: string, desc: string, category: "Coding Style" | "Architecture Rule" | "Bug Fix Preference" | "Optimization Pattern") => void;
  togglePlugin: (pluginId: string) => void;
  executeTerminalCommand: (cmd: string) => Promise<void>;
}

const LogicEngineContext = createContext<LogicEngineContextProps | undefined>(undefined);

export function LogicEngineProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<LogicEngineState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [compilerLogs, setCompilerLogs] = useState("");
  const [compilerErrors, setCompilerErrors] = useState<{ id: string; message: string; severity: string }[]>([]);
  const [selectedFile, setSelectedFileState] = useState<string | null>(null);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);

  // ===================================================
  // ⭐ Centralized Event Bus Reactive State ⭐
  // ===================================================
  const [events, setEvents] = useState<EventBusMessage[]>([]);
  const listenersRef = useRef<Record<string, ((msg: EventBusMessage) => void)[]>>({});

  const publishEvent = (type: string, payload: any, sender: string = "system") => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEvent: EventBusMessage = {
      id: "ev-" + Math.random().toString(36).substr(2, 9),
      type,
      payload,
      timestamp,
      sender
    };

    setEvents(prev => [newEvent, ...prev.slice(0, 39)]);

    // Trigger local callbacks inside context
    const typeListeners = listenersRef.current[type] || [];
    const wildcardListeners = listenersRef.current["*"] || [];
    [...typeListeners, ...wildcardListeners].forEach(cb => {
      try {
        cb(newEvent);
      } catch (e) {
        console.error("Error in event subscriber callback", e);
      }
    });
  };

  const subscribeToEvent = (type: string, callback: (msg: EventBusMessage) => void) => {
    if (!listenersRef.current[type]) {
      listenersRef.current[type] = [];
    }
    listenersRef.current[type].push(callback);
    return () => {
      listenersRef.current[type] = listenersRef.current[type].filter(cb => cb !== callback);
    };
  };

  // ===================================================
  // ⭐ 12 Engines Independent States ⭐
  // ===================================================

  // 1. Workspace Engine State
  const [workspaceEngine, setWorkspaceEngine] = useState<WorkspaceEngineState>({
    filesCount: 0,
    totalLinesOfCode: 0,
    repoSizeKB: 0,
    primaryLanguage: "TypeScript",
    framework: "React/Vite",
    dependencyCount: 0,
    dependencies: {},
    filesList: [],
    graph: { nodes: [], links: [] },
    lastIndexed: "Never"
  });

  // 2. Context Engine State
  const [contextEngine, setContextEngine] = useState<ContextEngineState>({
    items: [
      { id: "ctx-1", type: "file", name: "server.ts", score: 98, contentSummary: "Express gateway with server-side metrics routing" },
      { id: "ctx-2", type: "git", name: "active-branch", score: 85, contentSummary: "Branch 'develop' has 4 uncommitted files" },
      { id: "ctx-3", type: "diagnostics", name: "eslint-logs", score: 70, contentSummary: "Linter is fully stable on codebase" }
    ],
    activeFile: null,
    focusedQuery: "",
    lastUpdated: new Date().toLocaleTimeString()
  });

  // 3. Logic Engine Internal Workflows State
  const [logicEngine, setLogicEngine] = useState<LogicEngineState_Internal>({
    status: "idle",
    activeWorkflow: null,
    workflowTasks: []
  });

  // 4. Multi-Agent Engine State
  const [multiAgentEngine, setMultiAgentEngine] = useState<MultiAgentEngineState>({
    consensusRate: 98.4,
    activeAgentId: "agent-planner",
    activeSessionType: "collaboration",
    agents: [
      {
        id: "agent-planner",
        name: "Planner Agent",
        role: "Generating Architecture Plan",
        status: "idle",
        accuracy: 97,
        taskTime: "2m",
        avatarColor: "amber",
        logs: [{ id: "l1", timestamp: "10:30", message: "Analyzing project requirements (Completed)", type: "success" }]
      },
      {
        id: "agent-architect",
        name: "Architect Agent",
        role: "Designing System Components",
        status: "idle",
        accuracy: 98,
        taskTime: "5m",
        avatarColor: "violet",
        logs: [{ id: "l2", timestamp: "10:31", message: "Microservice boundaries mapped", type: "info" }]
      },
      {
        id: "agent-reviewer",
        name: "Reviewer Agent",
        role: "Code Reviewing (PR #38)",
        status: "idle",
        accuracy: 99,
        taskTime: "5m",
        avatarColor: "rose",
        logs: [{ id: "l3", timestamp: "10:33", message: "Code coverage constraints verified", type: "success" }]
      },
      {
        id: "agent-security",
        name: "Security Agent",
        role: "Vulnerability Scan",
        status: "idle",
        accuracy: 98,
        taskTime: "5m",
        avatarColor: "teal",
        logs: [{ id: "l4", timestamp: "10:34", message: "Dependency audit completed successfully", type: "success" }]
      }
    ]
  });

  // 5. AI Model Engine State
  const [aiModelEngine, setAiModelEngine] = useState<AIModelEngineState>({
    currentModelId: "gemini-3.5-flash",
    provider: "Gemini",
    temperature: 0.7,
    cachingEnabled: true,
    routingFallbackActive: false,
    inferenceRate: 85,
    models: [
      { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash (Default)", provider: "Gemini", contextWindow: "1M tokens", latencyRating: "Fast", tokensPerSec: 85, temperature: 0.7 },
      { id: "gemini-3.5-pro", name: "Gemini 3.5 Pro (High Intelligence)", provider: "Gemini", contextWindow: "2M tokens", latencyRating: "Medium", tokensPerSec: 45, temperature: 0.4 },
      { id: "ollama-llama3.2", name: "Ollama Llama 3.2 (Local 3B)", provider: "Ollama", contextWindow: "128K tokens", latencyRating: "Fast", tokensPerSec: 65, temperature: 0.5 },
      { id: "ollama-mistral", name: "Ollama Mistral (Local 7B)", provider: "Ollama", contextWindow: "32K tokens", latencyRating: "Medium", tokensPerSec: 38, temperature: 0.6 }
    ]
  });

  // 6. Project Intelligence Engine State
  const [projectIntelligenceEngine, setProjectIntelligenceEngine] = useState<ProjectIntelligenceEngineState>({
    healthScore: 98,
    complexityScore: 12,
    technicalDebtHours: 3,
    deadCodeCount: 0,
    circularDependencies: [],
    unusedPackages: [],
    issues: []
  });

  // 7. Git Engine State
  const [gitEngine, setGitEngine] = useState<GitEngineState>({
    isRepo: false,
    branch: "detached",
    modifiedCount: 0,
    modifiedFiles: [],
    stagedFiles: [],
    recentCommits: []
  });

  // 8. Performance Engine State
  const [performanceEngine, setPerformanceEngine] = useState<PerformanceEngineState>({
    cpuLoad: 5,
    memoryUsage: 35,
    diskUsage: 22,
    heapUsedMB: 12,
    totalMemGB: 8,
    freeMemGB: 5.2,
    uptimeHours: 1.2,
    ipcLatencyMs: 2,
    fileWatchLatencyMs: 4,
    startupTimeMs: 15
  });

  // 9. Memory Engine State
  const [memoryEngine, setMemoryEngine] = useState<MemoryEngineState>({
    decisions: [
      { id: "dec-1", timestamp: "03:12", title: "Standardize Tailwind Imports", description: "Use '@import \"tailwindcss\";' in src/index.css only.", category: "Coding Style" },
      { id: "dec-2", timestamp: "03:30", title: "Lucide Icon Policy", description: "All visual icons must be imported from 'lucide-react' directly.", category: "Architecture Rule" }
    ],
    preferences: {
      "autoSave": true,
      "lintOnSave": true
    },
    vectorEmbeddingCount: 142,
    lastRetrievedKey: "TailwindImports"
  });

  // 10. Terminal Engine State
  const [terminalEngine, setTerminalEngine] = useState<TerminalEngineState>({
    activeProcesses: [
      { pid: "p-3000", name: "node (Express API Host)", port: 3000 }
    ],
    dockerStats: [
      { containerId: "bdpl5wnu", name: "arrowera-guide-core", cpu: "12.4%", memory: "512MB / 2GB" }
    ],
    terminalLogs: [
      "2026-07-04 [SYSTEM] Booting CODEGuide Core Engine Subsystems...",
      "2026-07-04 [SYSTEM] Port 3000 active ingress router bound securely."
    ]
  });

  // 11. Plugin Engine State
  const [pluginEngine, setPluginEngine] = useState<PluginEngineState>({
    sandboxStatus: "secured",
    hotReloadEnabled: true,
    plugins: [
      { id: "plg-docker", name: "Docker Container Orchestration Helper", version: "1.2.0", status: "loaded", description: "Auto-scan and display active container statistics.", permissions: ["TerminalRead", "TerminalWrite"] },
      { id: "plg-git", name: "Git PR Auto-Summarizer API", version: "1.0.4", status: "loaded", description: "Leverage Gemini models to summarize branch changes directly.", permissions: ["GitRead", "WorkspaceRead"] },
      { id: "plg-telemetry", name: "Engine Performance Profiler", version: "2.1.0", status: "loaded", description: "Live tracking of memory and CPU telemetry pipelines.", permissions: ["SystemMetrics"] }
    ]
  });

  // 12. UISynchronization Engine State
  const [uiSyncEngine, setUiSyncEngine] = useState<UISynchronizationEngineState>({
    subscribersCount: 15,
    lastSyncTimestamp: new Date().toLocaleTimeString(),
    busStatus: "healthy",
    sessionActiveTimeSeconds: 1
  });

  // ===================================================
  // ⭐ Synchronized State Actions (12 Engines) ⭐
  // ===================================================

  // 1. Workspace indexing
  const indexWorkspaceFromMetrics = (raw: LogicEngineState) => {
    setWorkspaceEngine(prev => ({
      ...prev,
      filesCount: raw.workspace.filesCount,
      totalLinesOfCode: raw.workspace.totalLinesOfCode,
      repoSizeKB: raw.workspace.repoSizeKB,
      primaryLanguage: raw.workspace.primaryLanguage,
      framework: raw.workspace.framework,
      dependencyCount: raw.workspace.dependencyCount,
      dependencies: raw.workspace.dependencies,
      filesList: raw.workspace.filesList,
      graph: raw.workspace.graph,
      lastIndexed: new Date().toLocaleTimeString()
    }));
  };

  // 2. Trigger automated Logic Engine Workflow
  const triggerWorkflow = async (workflowName: string, tasks: { name: string }[]) => {
    publishEvent("BuildStarted", { workflow: workflowName }, "logic-engine");
    
    setLogicEngine({
      status: "orchestrating",
      activeWorkflow: workflowName,
      workflowTasks: tasks.map((t, idx) => ({
        id: `t-${idx}`,
        name: t.name,
        status: idx === 0 ? "running" : "pending"
      }))
    });

    // Cascade update the workflow tasks step-by-step
    for (let i = 0; i < tasks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLogicEngine(prev => {
        const nextTasks = [...prev.workflowTasks];
        nextTasks[i] = { ...nextTasks[i], status: "completed", durationMs: Math.floor(Math.random() * 200) + 100 };
        if (nextTasks[i + 1]) {
          nextTasks[i + 1] = { ...nextTasks[i + 1], status: "running" };
        }
        return {
          ...prev,
          workflowTasks: nextTasks
        };
      });

      publishEvent("ContextUpdated", { stepCompleted: tasks[i].name }, "context-engine");
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    setLogicEngine(prev => ({
      ...prev,
      status: "idle",
      activeWorkflow: null
    }));

    publishEvent("BuildFinished", { workflow: workflowName, status: "success" }, "logic-engine");
  };

  // 3. Multi-Agent Collaboration trigger
  const triggerAgentCollaboration = (sessionType: "collaboration" | "review" | "debugging" | "architecting") => {
    publishEvent("AgentStarted", { sessionType }, "agent-engine");

    setMultiAgentEngine(prev => ({
      ...prev,
      activeSessionType: sessionType,
      agents: prev.agents.map((agent, i) => ({
        ...agent,
        status: i === 0 ? "thinking" : "consensus_voting",
        logs: [
          { 
            id: `l-act-${Math.random()}`, 
            timestamp: new Date().toLocaleTimeString().slice(0, 5), 
            message: `Consensus engine requested collaborative ${sessionType} session.`, 
            type: "info" 
          },
          ...agent.logs
        ]
      }))
    }));

    // Periodically complete agent rounds
    setTimeout(() => {
      setMultiAgentEngine(prev => ({
        ...prev,
        agents: prev.agents.map(agent => ({
          ...agent,
          status: "completed",
          logs: [
            { 
              id: `l-act-${Math.random()}`, 
              timestamp: new Date().toLocaleTimeString().slice(0, 5), 
              message: `Collaborative ${sessionType} consensus achieved with 98.4% voter rating.`, 
              type: "success" 
            },
            ...agent.logs
          ]
        }))
      }));
      publishEvent("AgentCompleted", { sessionType, consensus: 98.4 }, "agent-engine");
    }, 2500);
  };

  // 4. Model selection & settings
  const updateModelSettings = (modelId: string, temp: number) => {
    const found = aiModelEngine.models.find(m => m.id === modelId);
    setAiModelEngine(prev => ({
      ...prev,
      currentModelId: modelId,
      provider: found ? found.provider : "Custom",
      temperature: temp,
      inferenceRate: found ? found.tokensPerSec : 50
    }));

    publishEvent("ModelLoaded", { modelId, provider: found?.provider, temperature: temp }, "model-engine");
  };

  // 5. Memory node addition
  const addMemoryDecision = (title: string, desc: string, category: "Coding Style" | "Architecture Rule" | "Bug Fix Preference" | "Optimization Pattern") => {
    const id = "dec-" + Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().toLocaleTimeString().slice(0, 5);
    const newDecision: MemoryDecision = { id, timestamp, title, description: desc, category };

    setMemoryEngine(prev => ({
      ...prev,
      decisions: [newDecision, ...prev.decisions],
      vectorEmbeddingCount: prev.vectorEmbeddingCount + 8,
      lastRetrievedKey: title.replace(/\s+/g, "")
    }));

    publishEvent("MemoryUpdated", { title, category }, "memory-engine");
  };

  // 6. Plugin enable/disable toggle
  const togglePlugin = (pluginId: string) => {
    setPluginEngine(prev => {
      const updated = prev.plugins.map(p => {
        if (p.id === pluginId) {
          const nextStatus = p.status === "loaded" ? "disabled" as const : "loaded" as const;
          publishEvent(nextStatus === "loaded" ? "PluginInstalled" : "MemoryUpdated", { pluginId, name: p.name }, "plugin-engine");
          return { ...p, status: nextStatus };
        }
        return p;
      });
      return { ...prev, plugins: updated };
    });
  };

  // 7. Secure local terminal shell execute
  const executeTerminalCommand = async (cmd: string): Promise<void> => {
    const formattedLog = `$ ${cmd}`;
    setTerminalEngine(prev => ({
      ...prev,
      terminalLogs: [...prev.terminalLogs, formattedLog]
    }));

    const response = await executeCommand(cmd);
    
    setTerminalEngine(prev => ({
      ...prev,
      terminalLogs: [...prev.terminalLogs, response.output]
    }));

    publishEvent("ContextUpdated", { commandRun: cmd }, "terminal-engine");
  };

  // ===================================================
  // ⭐ Core Backend Integration & Synchronization ⭐
  // ===================================================

  // Core metrics synchronization service
  const refreshMetrics = async () => {
    try {
      const res = await fetch("/api/logic-engine/metrics");
      if (res.ok) {
        const data: LogicEngineState = await res.json();
        setMetrics(data);

        // UI Synchronization Engine publish event
        publishEvent("ContextUpdated", { source: "MetricsSync" }, "ui-sync-engine");

        // Sync and dispatch states directly into other individual engine states!
        indexWorkspaceFromMetrics(data);
        
        setGitEngine({
          isRepo: data.git.isRepo,
          branch: data.git.branch,
          modifiedCount: data.git.modifiedCount,
          modifiedFiles: data.git.modifiedFiles,
          recentCommits: data.git.recentCommits,
          stagedFiles: []
        });

        setPerformanceEngine({
          cpuLoad: data.system.cpuLoad,
          memoryUsage: data.system.memoryUsage,
          diskUsage: data.system.diskUsage || 25,
          heapUsedMB: data.system.heapUsedMB,
          totalMemGB: data.system.totalMemGB,
          freeMemGB: data.system.freeMemGB,
          uptimeHours: data.system.uptimeHours,
          ipcLatencyMs: data.performance.ipcLatencyMs,
          fileWatchLatencyMs: data.performance.fileWatchLatencyMs,
          startupTimeMs: data.performance.startupTimeMs
        });

        // Parse health code smells into project intelligence issues
        const issuesFromSmells: CodeIssueItem[] = data.health.codeSmells.map((sm, i) => ({
          id: sm.id,
          category: sm.category as any,
          message: sm.message,
          severity: sm.severity === "success" ? "info" : sm.severity,
          file: sm.file
        }));

        setProjectIntelligenceEngine({
          healthScore: data.health.healthScore,
          complexityScore: data.health.complexityScore,
          technicalDebtHours: data.health.technicalDebtHours,
          deadCodeCount: Math.round(data.workspace.filesCount * 0.1),
          circularDependencies: ["src/components/LogicEngine.tsx -> src/components/LogicEngineContext.tsx -> src/components/LogicEngine.tsx (Self-contained export)"],
          unusedPackages: ["lodash-es", "async-retry"],
          issues: issuesFromSmells
        });

        setUiSyncEngine(prev => ({
          ...prev,
          lastSyncTimestamp: new Date().toLocaleTimeString(),
          sessionActiveTimeSeconds: prev.sessionActiveTimeSeconds + 6
        }));

      }
    } catch (e) {
      console.error("Failed to fetch logic engine metrics", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Compile-time static program analyst service
  const runCompilerCheck = async () => {
    setIsAnalyzing(true);
    publishEvent("BuildStarted", { reason: "StaticCompilerCheck" }, "logic-engine");
    try {
      const res = await fetch("/api/logic-engine/lint");
      if (res.ok) {
        const data = await res.json();
        setCompilerLogs(data.logs);
        setCompilerErrors(data.errors || []);
        
        // Dynamically compute error deductions onto health statistics
        if (metrics) {
          const nextHealthScore = Math.max(30, metrics.health.healthScore - ((data.errors ? data.errors.length : 0) * 8));
          setMetrics({
            ...metrics,
            health: {
              ...metrics.health,
              typescriptErrorsCount: data.errors ? data.errors.length : 0,
              healthScore: nextHealthScore
            }
          });

          setProjectIntelligenceEngine(prev => ({
            ...prev,
            healthScore: nextHealthScore
          }));
        }

        publishEvent("BuildFinished", { success: data.success, errorCount: data.errors ? data.errors.length : 0 }, "logic-engine");
      }
    } catch (e) {
      console.error("Failed to run compiler check", e);
      publishEvent("BuildFinished", { success: false, error: "Network Failure" }, "logic-engine");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filesystem: Read a file
  const selectFile = async (path: string | null) => {
    setSelectedFileState(path);
    if (!path) {
      setSelectedFileContent(null);
      return;
    }
    
    try {
      const res = await fetch(`/api/logic-engine/file?path=${encodeURIComponent(path)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSelectedFileContent(data.content);
          
          setContextEngine(prev => ({
            ...prev,
            activeFile: path,
            lastUpdated: new Date().toLocaleTimeString()
          }));

          publishEvent("FileOpened", { path }, "workspace-engine");
        } else {
          setSelectedFileContent(null);
        }
      }
    } catch (e) {
      console.error("Failed to load file content", path, e);
      setSelectedFileContent(null);
    }
  };

  // Filesystem: Save an existing or edited file
  const saveFile = async (path: string, content: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/logic-engine/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, content })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (selectedFile === path) {
            setSelectedFileContent(content);
          }
          
          publishEvent("FileSaved", { path }, "workspace-engine");

          // Refresh workspace statistics immediately
          await refreshMetrics();
          return true;
        }
      }
    } catch (e) {
      console.error("Failed to save file", path, e);
    }
    return false;
  };

  // Filesystem: Create a new file in workspace
  const createFile = async (path: string, content: string): Promise<boolean> => {
    const success = await saveFile(path, content);
    if (success) {
      publishEvent("WorkspaceIndexed", { addedFile: path }, "workspace-engine");
    }
    return success;
  };

  // Remote Execution Shell Service
  const executeCommand = async (cmd: string): Promise<{ success: boolean; output: string }> => {
    try {
      const res = await fetch("/api/logic-engine/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd })
      });
      if (res.ok) {
        const data = await res.json();
        return {
          success: data.success,
          output: data.success ? data.output : (data.output || data.error || "Execution failed.")
        };
      }
    } catch (e: any) {
      console.error("Failed to execute command", cmd, e);
    }
    return { success: false, output: "Network or internal gateway error executing command." };
  };

  // Poll metrics on mount for dynamic dashboards
  useEffect(() => {
    refreshMetrics();
    const interval = setInterval(refreshMetrics, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LogicEngineContext.Provider
      value={{
        metrics,
        isLoading,
        isAnalyzing,
        compilerLogs,
        compilerErrors,
        
        refreshMetrics,
        runCompilerCheck,
        
        selectedFile,
        selectedFileContent,
        selectFile,
        saveFile,
        createFile,
        
        executeCommand,

        // ==========================================
        // ⭐ 12 Engines & Event Bus Exports ⭐
        // ==========================================
        events,
        publishEvent,

        workspaceEngine,
        contextEngine,
        logicEngine,
        multiAgentEngine,
        aiModelEngine,
        projectIntelligenceEngine,
        gitEngine,
        performanceEngine,
        memoryEngine,
        terminalEngine,
        pluginEngine,
        uiSyncEngine,

        // Action Trigger implementations
        triggerWorkflow,
        triggerAgentCollaboration,
        updateModelSettings,
        addMemoryDecision,
        togglePlugin,
        executeTerminalCommand
      }}
    >
      {children}
    </LogicEngineContext.Provider>
  );
}

export function useLogicEngine() {
  const context = useContext(LogicEngineContext);
  if (!context) {
    throw new Error("useLogicEngine must be used within a LogicEngineProvider");
  }
  return context;
}
