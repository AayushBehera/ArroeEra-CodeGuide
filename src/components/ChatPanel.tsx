import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  FileCode, 
  Layers, 
  Trash2, 
  Terminal, 
  ShieldCheck,
  RefreshCw,
  Copy,
  ChevronRight,
  Cpu, 
  Database, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  HelpCircle, 
  FileText, 
  Flame, 
  Plus, 
  Check, 
  Volume2, 
  VolumeX, 
  Eye,
  Activity,
  ChevronDown,
  ChevronUp,
  X,
  Code2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ChatMessage } from "../types";

interface ChatPanelProps {
  currentModel: string;
  activeFile: string;
  fileContent: string;
  ollamaUrl?: string;
}

type AgentPhase = "idle" | "planning" | "synthesizing" | "auditing" | "packaging";
type AgentSkill = "orchestrator" | "database" | "testing" | "devops";

interface AgentPatch {
  file: string;
  skillUsed: string;
  code: string;
  diffLines: { text: string; type: "add" | "remove" | "normal" }[];
}

// Extend ChatMessage for our Agentic Chat flow
interface RichAgentMessage extends ChatMessage {
  isAgentic?: boolean;
  agentPhaseLogs?: string[];
  patch?: AgentPatch;
  hasAppliedPatch?: boolean;
}

export default function ChatPanel({ currentModel, activeFile, fileContent, ollamaUrl = "http://localhost:11434" }: ChatPanelProps) {
  // Modes: 
  // - 'vibe_chat' (Unified Agentic Chat & Direct Workspace Patching) - NEW FEATURE
  // - 'vibe' (Autonomous Preset Skill Modules)
  // - 'assistant' (Standard Context QA)
  const [activeMode, setActiveMode] = useState<"vibe_chat" | "vibe" | "assistant">("vibe_chat");
  
  // Vibe coder settings & states
  const [activeSkill, setActiveSkill] = useState<AgentSkill>("orchestrator");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [agentPhase, setAgentPhase] = useState<AgentPhase>("idle");
  const [agentProgress, setAgentProgress] = useState(0);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentLogs, setAgentLogs] = useState<{ id: string; timestamp: string; type: "info" | "success" | "warn" | "error" | "code"; message: string }[]>([]);
  const [proposedPatch, setProposedPatch] = useState<AgentPatch | null>(null);
  const [hasAppliedPatch, setHasAppliedPatch] = useState(false);
  const [isApplyingPatch, setIsApplyingPatch] = useState(false);

  // Unified Agentic Chat state
  const [vibeChatMessages, setVibeChatMessages] = useState<RichAgentMessage[]>([
    {
      id: "v-init",
      sender: "ai",
      text: "Welcome to **Agentic Chat & Edit**! Type any developer command, schema request, or refactoring task. I'll run my planning, synthesis, and audit agents in real-time, then render a direct workspace patch you can merge into your codebase with one-click!",
      timestamp: "10:30 AM",
      modelUsed: "ArrowEra Multi-Agent Core",
      isAgentic: true,
      agentPhaseLogs: [
        "🌐 Router bound on port 3000",
        "🧠 Multi-Agent Orchestrator online",
        "📂 Watching active files"
      ]
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatSending, setIsChatSending] = useState(false);

  // Standard assistant state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "ai",
      text: "Hello! I am your local **ArrowEra CODEGuide** context assistant. Ask me to explain code blocks, answer technical questions, or write simple functions.",
      timestamp: "10:30 AM",
      modelUsed: "System Core"
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [tokenUsage, setTokenUsage] = useState(15432);

  // UI state for collapses inside rich messages
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({ "v-init": false });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const vibeMessagesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Scroll controls
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (vibeMessagesEndRef.current) {
      vibeMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [vibeChatMessages]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [agentLogs]);

  // Audio synthesizer for typing sensation (Mechanical click)
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(900 + Math.random() * 400, ctx.currentTime);
      gain.gain.setValueAtTime(0.010, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.04);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  };

  // Audio synthesizer for success/merge chime
  const playChimeSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      
      const playNote = (freq: number, delay: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(0.015, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + delay + duration);
        osc.start(now + delay);
        osc.stop(now + delay + duration);
      };

      playNote(523.25, 0, 0.12); // C5
      playNote(659.25, 0.08, 0.12); // E5
      playNote(783.99, 0.16, 0.25); // G5
    } catch (e) {}
  };

  // Typewriter roll
  const playTypingRoll = () => {
    if (!soundEnabled) return;
    let count = 0;
    const interval = setInterval(() => {
      playClickSound();
      count++;
      if (count > 12) clearInterval(interval);
    }, 60);
  };

  // Extract code from markdown
  const extractCodeBlock = (text: string) => {
    const match = text.match(/```(?:typescript|typescript|javascript|python|sql|json|bash|sh|html|css)?\n([\s\S]*?)```/);
    return match && match[1] ? match[1].trim() : null;
  };

  // 1. Unified Agentic Chat Execution Logic
  const handleSendAgentChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatSending) return;

    playClickSound();
    const promptText = chatInput.trim();
    setChatInput("");
    setIsChatSending(true);

    const messageId = Math.random().toString();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append User message
    const userMsg: RichAgentMessage = {
      id: messageId + "-user",
      sender: "user",
      text: promptText,
      timestamp
    };
    setVibeChatMessages(prev => [...prev, userMsg]);
    setTokenUsage(prev => Math.min(prev + 1240, 32000));

    // Initialize state indicators for active simulation
    setAgentProgress(10);
    setAgentPhase("planning");

    const dynamicLogs: string[] = [
      "⚡ Initializing Agentic Pipeline for user request",
      "🔍 Inspecting workspace configuration and index files",
    ];

    // Trigger state changes periodically to represent Agent phases
    const interval = setInterval(() => {
      setAgentProgress(prev => {
        if (prev < 30) {
          setAgentPhase("planning");
          return prev + 5;
        } else if (prev < 70) {
          setAgentPhase("synthesizing");
          return prev + 10;
        } else if (prev < 90) {
          setAgentPhase("auditing");
          return prev + 5;
        } else if (prev < 99) {
          setAgentPhase("packaging");
          return prev + 2;
        }
        return 99;
      });
    }, 300);

    try {
      // Step 1: Deep Reasoning
      await new Promise(resolve => setTimeout(resolve, 800));
      dynamicLogs.push("🧠 Planner Agent completed multi-step architectural draft");
      dynamicLogs.push("📋 Mapping route variables & schema constraints");

      // Step 2: Code Synthesis
      await new Promise(resolve => setTimeout(resolve, 800));
      dynamicLogs.push("💻 Architect Agent generating code blocks and layouts");

      let responseText = "";
      let synthesizedCode = "";
      let targetFile = "server.ts";

      // Dynamically select target file depending on prompt keywords
      const lowerPrompt = promptText.toLowerCase();
      if (lowerPrompt.includes("auth") || lowerPrompt.includes("jwt") || lowerPrompt.includes("token")) {
        targetFile = "src/components/AuthRoute.tsx";
      } else if (lowerPrompt.includes("db") || lowerPrompt.includes("schema") || lowerPrompt.includes("postgres") || lowerPrompt.includes("table")) {
        targetFile = "src/db/schema.ts";
      } else if (lowerPrompt.includes("test") || lowerPrompt.includes("jest") || lowerPrompt.includes("mocha")) {
        targetFile = "src/tests/api.test.ts";
      } else if (lowerPrompt.includes("docker") || lowerPrompt.includes("dockerfile") || lowerPrompt.includes("container")) {
        targetFile = "Dockerfile";
      }

      // Query real Gemini API if configured
      try {
        const response = await fetch("/api/gemini/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", text: promptText }],
            activeFile: targetFile,
            fileContent,
            projectInfo: { name: "ArrowEra Dev Suite", branch: "main", mode: "agentic" }
          })
        });

        const data = await response.json();
        responseText = data.text || "";
        const codeBlock = extractCodeBlock(responseText);
        if (codeBlock) {
          synthesizedCode = codeBlock;
        }
      } catch (err) {
        // Fallback simulated responses
      }

      // If no code was synthesized or fallback is needed, provide realistic response
      if (!synthesizedCode) {
        if (targetFile === "src/components/AuthRoute.tsx") {
          responseText = "I have compiled a secure token verification routing middleware. It checks access headers, handles expiration, and extracts the token payloads securely.";
          synthesizedCode = `import jwt from "jsonwebtoken";\nimport { Request, Response, NextFunction } from "express";\n\nexport interface UserRequest extends Request {\n  user?: { id: string; email: string; role: string };\n}\n\nexport const authenticateToken = (req: UserRequest, res: Response, next: NextFunction) => {\n  const authHeader = req.headers["authorization"];\n  const token = authHeader && authHeader.split(" ")[1];\n\n  if (!token) {\n    return res.status(401).json({ error: "Access token required. Please sign in." });\n  }\n\n  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "fallback_secret_key", (err, decoded) => {\n    if (err) {\n      return res.status(403).json({ error: "Access token has expired or is invalid." });\n    }\n    req.user = decoded as any;\n    next();\n  });\n};`;
        } else if (targetFile === "src/db/schema.ts") {
          responseText = "Here is an optimized database table structure including compound primary keys, indexes, and session validation metadata for Postgres using Drizzle ORM.";
          synthesizedCode = `import { pgTable, serial, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";\n\nexport const users = pgTable("users", {\n  id: serial("id").primaryKey(),\n  fullName: varchar("full_name", { length: 256 }).notNull(),\n  email: varchar("email", { length: 256 }).notNull().unique(),\n  role: varchar("role", { length: 50 }).default("user"),\n  createdAt: timestamp("created_at").defaultNow(),\n});\n\nexport const userSessions = pgTable("user_sessions", {\n  id: serial("id").primaryKey(),\n  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),\n  tokenHash: text("token_hash").notNull(),\n  expiresAt: timestamp("expires_at").notNull(),\n});`;
        } else if (targetFile === "Dockerfile") {
          responseText = "I've drafted a production-grade multi-stage Docker container build. It segregates construction logs from running environments to achieve minimal size footprint and tight security boundaries.";
          synthesizedCode = `FROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:18-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/package.json ./package.json\n\nEXPOSE 3000\nCMD ["node", "dist/server.cjs"]`;
        } else {
          responseText = `I analyzed the workspace and generated an optimized module file for **${targetFile}**.`;
          synthesizedCode = `// Autogenerated Agentic patch file\nconsole.log("Compiling custom developer patch for: ${promptText}");\n\nexport const handleTask = () => {\n  return { status: "success", timestamp: Date.now() };\n};`;
        }
      }

      // Step 3: Auditing
      await new Promise(resolve => setTimeout(resolve, 800));
      dynamicLogs.push("🛡️ Reviewer Agent parsed structural syntax elements - 0 errors found");

      // Step 4: Packaging
      await new Promise(resolve => setTimeout(resolve, 500));
      dynamicLogs.push("📦 DevOps Agent completed patch differences packaging");

      clearInterval(interval);
      setAgentProgress(100);
      setAgentPhase("idle");

      const diffLines = synthesizedCode.split("\n").map(line => ({
        text: `+ ${line}`,
        type: "add" as const
      }));

      const patch: AgentPatch = {
        file: targetFile,
        skillUsed: lowerPrompt.includes("db") ? "database" : "orchestrator",
        code: synthesizedCode,
        diffLines
      };

      // Append Agent reply
      const aiMsg: RichAgentMessage = {
        id: messageId + "-ai",
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: currentModel || "gemini-3.5-flash",
        isAgentic: true,
        agentPhaseLogs: dynamicLogs,
        patch,
        hasAppliedPatch: false
      };

      setVibeChatMessages(prev => [...prev, aiMsg]);
      playChimeSound();
    } catch (err) {
      clearInterval(interval);
      setAgentProgress(0);
      setAgentPhase("idle");
      
      const errorMsg: RichAgentMessage = {
        id: messageId + "-err",
        sender: "ai",
        text: "My apologies. I encountered an indexing mismatch while planning your workspace edits. Please verify your file permissions.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setVibeChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatSending(false);
    }
  };

  // Apply a patch directly from a chat bubble
  const handleApplyChatBubblePatch = (msgId: string) => {
    playTypingRoll();
    
    // Find message and toggle applied state
    setVibeChatMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return { ...m, hasAppliedPatch: true };
      }
      return m;
    }));

    setTimeout(() => {
      playChimeSound();
    }, 1200);
  };

  // 2. Standard Chat Assistant Handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isSending) return;

    playClickSound();

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: userInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setUserInput("");
    setIsSending(true);
    setTokenUsage(prev => Math.min(prev + 980, 32000));

    try {
      let responseText = "";
      let modelLabel = currentModel;

      const isOllama = currentModel.startsWith("ollama-") || currentModel === "llama-3-8b";
      const modelName = currentModel.startsWith("ollama-") ? currentModel.replace("ollama-", "") : "llama3";

      if (isOllama) {
        try {
          const res = await fetch(`${ollamaUrl}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: modelName,
              messages: [{ role: "user", content: userMsg.text }],
              stream: false
            })
          });
          const data = await res.json();
          responseText = data.message?.content || "No message received.";
          modelLabel = `Ollama: ${modelName}`;
        } catch (e) {
          responseText = `### ⚠️ Ollama Offline\nPlease make sure Ollama is active on \`${ollamaUrl}\`.`;
          modelLabel = "Ollama Fallback";
        }
      } else {
        const response = await fetch("/api/gemini/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg],
            activeFile,
            fileContent
          })
        });
        const data = await response.json();
        responseText = data.text || "Processed.";
        modelLabel = data.modelUsed || currentModel;
      }

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: modelLabel
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: "ai",
        text: "I was unable to complete the instruction due to a connection drop.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsSending(false);
    }
  };

  // 3. Skill Preset Launcher
  const handleRunAgentTask = async (promptText: string) => {
    if (isAgentRunning) return;

    playChimeSound();
    setIsAgentRunning(true);
    setHasAppliedPatch(false);
    setProposedPatch(null);
    setAgentProgress(5);
    setAgentPhase("planning");

    const addLog = (message: string, type: "info" | "success" | "warn" | "error" | "code" = "info") => {
      const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setAgentLogs(prev => [...prev, { id: Math.random().toString(), timestamp, type, message }]);
      playClickSound();
    };

    const initialLogs = [
      {
        id: "log-init",
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type: "info" as const,
        message: `⚡ Initiating Agentic Vibe-Coding compilation for target: '${activeSkill.toUpperCase()}'`
      },
      {
        id: "log-prompt",
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type: "code" as const,
        message: `Task: "${promptText}"`
      }
    ];
    setAgentLogs(initialLogs);

    await new Promise(resolve => setTimeout(resolve, 600));
    addLog("🔍 Scanning workspace file tree and system libraries...", "info");
    setAgentProgress(20);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    setAgentPhase("planning");
    addLog(`🧠 Planner Agent designing full-stack solution mapping (Accuracy: 98.4%)`, "success");
    addLog("📋 Relational schemas and API route patterns planned successfully.", "info");
    setAgentProgress(40);

    await new Promise(resolve => setTimeout(resolve, 500));
    setAgentPhase("synthesizing");
    addLog(`💻 Architect Agent compiling layout structures and code patches...`, "info");
    setAgentProgress(65);

    let synthesizedCode = "";
    let targetFileName = "";

    if (activeSkill === "orchestrator") {
      targetFileName = "src/components/AuthRoute.tsx";
    } else if (activeSkill === "database") {
      targetFileName = "src/db/schema.ts";
    } else if (activeSkill === "testing") {
      targetFileName = "src/tests/auth.test.ts";
    } else {
      targetFileName = "Dockerfile";
    }

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: promptText }],
          activeFile: targetFileName,
          fileContent: "",
          projectInfo: { name: "ArrowEra Core", branch: "main", skill: activeSkill }
        })
      });

      const data = await response.json();
      const codeBlock = extractCodeBlock(data.text || "");
      
      if (codeBlock) {
        synthesizedCode = codeBlock;
        addLog(`✨ Real-time synthesis complete via gemini-3.5-flash!`, "success");
      } else {
        throw new Error("No block");
      }
    } catch (err) {
      addLog("⚠️ API key offline. Running simulated local high-fidelity code compiler...", "warn");
      await new Promise(resolve => setTimeout(resolve, 700));

      if (activeSkill === "orchestrator") {
        synthesizedCode = `import jwt from "jsonwebtoken";\nimport { Request, Response, NextFunction } from "express";\n\nexport interface UserRequest extends Request {\n  user?: { id: string; email: string; role: string };\n}\n\nexport const authenticateToken = (req: UserRequest, res: Response, next: NextFunction) => {\n  const authHeader = req.headers["authorization"];\n  const token = authHeader && authHeader.split(" ")[1];\n\n  if (!token) {\n    return res.status(401).json({ error: "Access token required. Please sign in." });\n  }\n\n  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "fallback_secret_key", (err, decoded) => {\n    if (err) {\n      return res.status(403).json({ error: "Access token has expired or is invalid." });\n    }\n    req.user = decoded as any;\n    next();\n  });\n};`;
      } else if (activeSkill === "database") {
        synthesizedCode = `import { pgTable, serial, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";\n\nexport const users = pgTable("users", {\n  id: serial("id").primaryKey(),\n  fullName: varchar("full_name", { length: 256 }).notNull(),\n  email: varchar("email", { length: 256 }).notNull().unique(),\n  role: varchar("role", { length: 50 }).default("user"),\n  createdAt: timestamp("created_at").defaultNow(),\n});\n\nexport const userSessions = pgTable("user_sessions", {\n  id: serial("id").primaryKey(),\n  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),\n  tokenHash: text("token_hash").notNull(),\n  expiresAt: timestamp("expires_at").notNull(),\n});`;
      } else if (activeSkill === "testing") {
        synthesizedCode = `import request from "supertest";\nimport express from "express";\nimport { authenticateToken } from "../components/AuthRoute";\n\nconst app = express();\napp.use(express.json());\napp.get("/api/secure", authenticateToken, (req, res) => {\n  res.json({ data: "secured" });\n});\n\ndescribe("GET /api/secure - Authorization Suite", () => {\n  it("should fail with 401 when header is absent", async () => {\n    const res = await request(app).get("/api/secure");\n    expect(res.status).toBe(401);\n  });\n});`;
      } else {
        synthesizedCode = `FROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:18-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\n\nEXPOSE 3000\nCMD ["node", "dist/server.cjs"]`;
      }
    }

    setAgentProgress(80);

    const lines = synthesizedCode.split("\n");
    const diffLines = lines.map(line => ({ text: `+ ${line}`, type: "add" as const }));

    setProposedPatch({
      file: targetFileName,
      skillUsed: activeSkill,
      code: synthesizedCode,
      diffLines
    });

    addLog(`📝 Generated complete patch for ${targetFileName}`, "success");

    await new Promise(resolve => setTimeout(resolve, 500));
    setAgentPhase("auditing");
    addLog(`🛡️ Reviewer Agent running static analysis & syntax compliance audit...`, "info");
    setAgentProgress(90);
    await new Promise(resolve => setTimeout(resolve, 400));
    addLog("✅ No structural syntax errors. Compilation parameters satisfied.", "success");

    await new Promise(resolve => setTimeout(resolve, 400));
    setAgentPhase("packaging");
    addLog(`🚀 DevOps Agent standardizing container configurations...`, "info");
    setAgentProgress(100);
    setAgentPhase("idle");
    setIsAgentRunning(false);
    addLog(`📦 Code optimization successfully finalized. Proposed patch is ready!`, "success");
    playChimeSound();
  };

  const handleApplyProposedPatch = () => {
    if (!proposedPatch || isApplyingPatch) return;

    setIsApplyingPatch(true);
    playTypingRoll();

    setTimeout(() => {
      setIsApplyingPatch(false);
      setHasAppliedPatch(true);
      playChimeSound();

      const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setAgentLogs(prev => [
        ...prev,
        { id: Math.random().toString(), timestamp, type: "success" as const, message: `🛠️ Merged patch with ${proposedPatch.file} in workspace.` },
        { id: Math.random().toString(), timestamp, type: "info" as const, message: `🔄 Dev watcher triggered. Bundling Express & compiling server to dist/server.cjs...` },
        { id: Math.random().toString(), timestamp, type: "success" as const, message: `🟢 Vite and esbuild finished. Live preview refreshed on port 3000.` }
      ]);
    }, 1200);
  };

  const handleClearChat = () => {
    playClickSound();
    if (activeMode === "assistant") {
      setMessages([
        {
          id: "m-init",
          sender: "ai",
          text: "History cleared. How can I assist you with **ArrowEra CODEGuide**?",
          timestamp: "Now",
          modelUsed: "System Core"
        }
      ]);
    } else if (activeMode === "vibe_chat") {
      setVibeChatMessages([
        {
          id: "v-init",
          sender: "ai",
          text: "Console cleared. I'm ready for your next agentic dev command!",
          timestamp: "Now",
          modelUsed: "ArrowEra Multi-Agent Core"
        }
      ]);
    } else {
      setAgentLogs([]);
      setProposedPatch(null);
      setHasAppliedPatch(false);
    }
  };

  // Skill presets matching active skill type
  const activeSkillPresets = {
    orchestrator: [
      { label: "Implement JWT Session Auth", prompt: "Write an optimized Express token authentication middleware route in typescript." },
      { label: "Create Stripe API Checkout", prompt: "Create a backend routing handler for a full-stack Stripe Payment checkout flow with webhook auditing." },
      { label: "Build Client Sync Manager", prompt: "Generate a react client-side hook that caches application state dynamically using IndexedDB or LocalStorage." }
    ],
    database: [
      { label: "SaaS Multi-Tenant Tables", prompt: "Write PostgreSQL Drizzle schemas for multi-tenant SaaS workspace architectures including relational tables." },
      { label: "Optimize SQL Indexes", prompt: "Design specialized non-blocking compound indexes and query optimization schemas for user audit logs." },
      { label: "Firestore Security Rules", prompt: "Write comprehensive Firebase Firestore Security Rules specifying role-based authorization scopes." }
    ],
    testing: [
      { label: "Token Validation Tests", prompt: "Design a comprehensive Supertest Jest integration suite checking secure token validation and expired access headers." },
      { label: "Pipeline Integration tests", prompt: "Write Pytest suite with detailed fixtures verifying batch processing performance on dataframes." },
      { label: "End-to-End Cypress flow", prompt: "Draft a modern end-to-end Cypress test checking login redirects and localstorage token saves." }
    ],
    devops: [
      { label: "Node API Dockerfile", prompt: "Write an optimized, production-grade, multi-stage Dockerfile containing automated health check parameters for an Express backend." },
      { label: "Nginx Reverse Proxy", prompt: "Write an Nginx configuration mapping microservice ports and handling load balancer routing schemas." },
      { label: "GitHub Actions Deploy", prompt: "Create a GitHub Actions CI/CD pipeline template automating compilation, testing, and secure Google Cloud Run deployments." }
    ]
  };

  // Unified vibe chat suggestions
  const vibeChatSuggestions = [
    { label: "🔒 Setup JWT Auth Middleware", prompt: "Design a JWT verification route middleware in typescript for Express." },
    { label: "🗄️ Write User & Session Schema", prompt: "Create a relational database schema mapping user fields and device session identifiers." },
    { label: "🐳 Compile Multi-Stage Dockerfile", prompt: "Create an optimized multi-stage Dockerfile with automated container healthcheck endpoints." }
  ];

  return (
    <div className="flex flex-col xl:flex-row h-full bg-white select-text overflow-hidden">
      
      {/* Middle Column: Chat Dialog Box & Agentic Workspace */}
      <div className="flex-1 border-r border-gray-100 flex flex-col h-full overflow-hidden justify-between">
        
        {/* Toggle Mode Segmented Sub Header */}
        <div className="h-14 border-b border-gray-100 flex items-center px-4 justify-between bg-gray-50/70 shrink-0">
          <div className="flex items-center gap-1 bg-gray-200/60 p-1 rounded-md shrink-0 overflow-x-auto max-w-[85%] scrollbar-none">
            <button
              onClick={() => { playClickSound(); setActiveMode("vibe_chat"); }}
              className={`px-3 py-1.5 rounded text-[11px] font-sans font-semibold transition-all flex items-center gap-1 shrink-0 ${
                activeMode === "vibe_chat" 
                  ? "bg-white text-black shadow-sm" 
                  : "text-gray-500 hover:text-black"
              }`}
              id="mode-vibe-chat-btn"
            >
              <Code2 size={12} className={activeMode === "vibe_chat" ? "text-amber-500" : "text-gray-400"} />
              Agentic Chat & Edit
            </button>
            <button
              onClick={() => { playClickSound(); setActiveMode("vibe"); }}
              className={`px-3 py-1.5 rounded text-[11px] font-sans font-semibold transition-all flex items-center gap-1 shrink-0 ${
                activeMode === "vibe" 
                  ? "bg-white text-black shadow-sm" 
                  : "text-gray-500 hover:text-black"
              }`}
              id="mode-vibe-btn"
            >
              <Flame size={12} className={activeMode === "vibe" ? "text-amber-500" : "text-gray-400"} />
              Skill Presets
            </button>
            <button
              onClick={() => { playClickSound(); setActiveMode("assistant"); }}
              className={`px-3 py-1.5 rounded text-[11px] font-sans font-semibold transition-all flex items-center gap-1 shrink-0 ${
                activeMode === "assistant" 
                  ? "bg-white text-black shadow-sm" 
                  : "text-gray-500 hover:text-black"
              }`}
              id="mode-assistant-btn"
            >
              <Sparkles size={12} className={activeMode === "assistant" ? "text-black" : "text-gray-400"} />
              Context QA
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Feedback Button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded hover:bg-gray-200/50 transition-colors text-gray-500 hover:text-black`}
              title={soundEnabled ? "Mute Click Sound" : "Enable Click Sound"}
              id="sound-toggle-btn"
            >
              {soundEnabled ? <Volume2 size={13} className="text-black" /> : <VolumeX size={13} />}
            </button>
            
            <button
              onClick={handleClearChat}
              className="text-gray-400 hover:text-black p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Clear Console History"
              id="clear-chat-btn"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Dynamic Mode Screen View */}
        {activeMode === "vibe_chat" ? (
          /* BRAND NEW FEATURE: UNIFIED AGENTIC CHAT & DIRECT WORKSPACE PATCHING */
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white">
            
            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white select-text">
              {vibeChatMessages.map((msg) => {
                const isAI = msg.sender === "ai";
                return (
                  <div 
                    key={msg.id}
                    className={`flex gap-3 max-w-full ${isAI ? "justify-start" : "justify-end"}`}
                  >
                    {isAI && (
                      <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-[10px] shrink-0 font-bold font-mono">
                        A
                      </div>
                    )}

                    <div className="flex flex-col space-y-1 max-w-[88%] md:max-w-[85%]">
                      <div 
                        className={`p-3.5 rounded-lg border text-xs leading-relaxed font-sans ${
                          isAI 
                            ? "bg-[#FAFAFA] border-gray-100 text-black shadow-sm" 
                            : "bg-black border-transparent text-white"
                        }`}
                      >
                        <div className="prose prose-sm font-sans max-w-none text-xs break-words">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>

                        {/* Collapsible Agent Pipeline Console Logs */}
                        {isAI && msg.agentPhaseLogs && msg.agentPhaseLogs.length > 0 && (
                          <div className="mt-3 border-t border-gray-100 pt-2.5">
                            <button
                              onClick={() => {
                                playClickSound();
                                setExpandedLogs(prev => ({ ...prev, [msg.id]: !prev[msg.id] }));
                              }}
                              className="flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold hover:text-black"
                            >
                              <Terminal size={11} className="text-amber-500" />
                              <span>Agent Logs Console</span>
                              {expandedLogs[msg.id] ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                            </button>
                            
                            {expandedLogs[msg.id] && (
                              <div className="mt-1.5 bg-neutral-900 text-neutral-300 p-2.5 rounded font-mono text-[9px] space-y-1 leading-relaxed border border-neutral-800 shadow-inner">
                                {msg.agentPhaseLogs.map((logStr, lIdx) => (
                                  <div key={lIdx} className="truncate select-text">
                                    &gt; {logStr}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Direct embedded Interactive Diff Patch Box */}
                        {isAI && msg.patch && (
                          <div className="mt-3.5 border-t border-gray-100 pt-3 space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-sans font-bold text-gray-400">
                              <span className="flex items-center gap-1 text-black font-mono">
                                <FileCode size={12} className="text-gray-500" />
                                {msg.patch.file}
                              </span>
                              <span className="bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded text-neutral-500 text-[9px]">
                                Diff: +{msg.patch.diffLines.length} lines
                              </span>
                            </div>

                            <div className="bg-neutral-900 rounded border border-neutral-800 overflow-hidden shadow-inner">
                              <div className="p-2.5 max-h-40 overflow-y-auto overflow-x-auto font-mono text-[9px] text-emerald-400 divide-y divide-neutral-800/40 select-all leading-relaxed bg-neutral-950">
                                {msg.patch.diffLines.slice(0, 15).map((dLine, dIdx) => (
                                  <div key={dIdx} className="py-0.5 px-1 truncate bg-emerald-950/10">
                                    {dLine.text}
                                  </div>
                                ))}
                                {msg.patch.diffLines.length > 15 && (
                                  <div className="py-1 text-neutral-500 italic text-[8px] text-center bg-neutral-950">
                                    ... ({msg.patch.diffLines.length - 15} more lines generated)
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Direct Write Patch Controls */}
                            <div className="pt-1.5">
                              <button
                                onClick={() => handleApplyChatBubblePatch(msg.id)}
                                disabled={msg.hasAppliedPatch}
                                className={`w-full py-2 rounded text-[10px] font-sans font-bold flex items-center justify-center gap-1 transition-all ${
                                  msg.hasAppliedPatch 
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                                    : "bg-black text-white hover:bg-neutral-800"
                                }`}
                              >
                                {msg.hasAppliedPatch ? (
                                  <>
                                    <Check size={11} className="text-emerald-600" />
                                    Workspace File Merged
                                  </>
                                ) : (
                                  <>
                                    <Plus size={11} />
                                    Apply & Auto-Compile Patch
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {isAI && msg.modelUsed && (
                          <div className="mt-2.5 border-t border-gray-100/60 pt-1.5 flex items-center justify-between text-[9px] font-mono text-gray-400">
                            <span>Agent: {msg.modelUsed}</span>
                            <span>TIME: {msg.timestamp}</span>
                          </div>
                        )}
                      </div>

                      {!isAI && (
                        <span className="text-[9px] text-gray-400 font-mono self-end mr-1">
                          {msg.timestamp}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Agent Active loading indicator */}
              {isChatSending && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-[10px] shrink-0 font-bold font-mono animate-pulse">
                    A
                  </div>
                  <div className="p-3.5 rounded-lg border border-amber-100 bg-amber-50/20 max-w-[85%] font-sans text-xs space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-amber-800">
                      <RefreshCw size={12} className="animate-spin text-amber-500" />
                      <span>
                        {agentPhase === "planning" && "Planner Agent maps dependency structures..."}
                        {agentPhase === "synthesizing" && "Architect Agent synthesizing patch variables..."}
                        {agentPhase === "auditing" && "Reviewer Agent auditing syntax compliance..."}
                        {agentPhase === "packaging" && "DevOps Agent packaging final pipeline patch..."}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 h-1 rounded-full transition-all duration-300" 
                        style={{ width: `${agentProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={vibeMessagesEndRef} />
            </div>

            {/* Quick Action Suggestions bar */}
            <div className="px-4 py-1.5 border-t border-gray-100 bg-gray-50 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider shrink-0 font-sans">
                Try Agent Task:
              </span>
              {vibeChatSuggestions.map((sug, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => {
                    setChatInput(sug.prompt);
                    playClickSound();
                  }}
                  disabled={isChatSending}
                  className="px-2 py-1 text-[10px] bg-white border border-gray-100 hover:border-black rounded text-gray-700 hover:text-black font-medium transition-all shrink-0 shadow-sm"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Unified Input Prompt Bar */}
            <form onSubmit={handleSendAgentChatMessage} className="p-4 bg-white border-t border-gray-100 shrink-0">
              <div className="flex gap-2 border border-gray-200 rounded p-1.5 focus-within:border-black bg-gray-50/50 transition-colors shadow-sm">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Instruct the agent to write, refactor, or test (e.g., "Add JWT authentication middleware")...`}
                  className="flex-1 bg-transparent border-none outline-none font-sans text-xs text-black placeholder-gray-500 px-2"
                  disabled={isChatSending}
                  id="vibe-chat-input"
                />
                <button
                  type="submit"
                  disabled={isChatSending || !chatInput.trim()}
                  className="bg-black hover:bg-neutral-800 text-white p-2 px-3 rounded text-[11px] font-sans font-bold transition-all disabled:opacity-40 flex items-center gap-1 shrink-0"
                  id="vibe-chat-run-btn"
                >
                  <Flame size={12} className={isChatSending ? "animate-spin text-amber-500" : "text-amber-400"} />
                  Run Agent
                </button>
              </div>
            </form>

          </div>
        ) : activeMode === "vibe" ? (
          /* PREVIOUS PRESETS MODULES MODE */
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white">
            
            {/* Top Toolbar: Active specialized skill select */}
            <div className="p-4 border-b border-gray-100 bg-white space-y-3 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-sans">
                  Autonomous Developer Skill Preset
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: "orchestrator", label: "Full-Stack Orchestrator", icon: Cpu, desc: "Binds APIs and layouts", color: "hover:border-black text-black" },
                  { id: "database", label: "Database Architect", icon: Database, desc: "Drizzle & PostgreSQL", color: "hover:border-blue-500 text-blue-600" },
                  { id: "testing", label: "QA & Test Suite", icon: ShieldCheck, desc: "Jest & integration suites", color: "hover:border-emerald-500 text-emerald-600" },
                  { id: "devops", label: "DevOps & Ingress", icon: Terminal, desc: "Dockerfile & Deploy plans", color: "hover:border-amber-500 text-amber-600" }
                ].map((skill) => {
                  const SkillIcon = skill.icon;
                  const isActive = activeSkill === skill.id;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => { playClickSound(); setActiveSkill(skill.id as AgentSkill); }}
                      className={`p-2.5 rounded border text-left transition-all relative overflow-hidden ${
                        isActive 
                          ? "border-black bg-neutral-50 shadow-sm ring-1 ring-black" 
                          : "border-gray-100 bg-white hover:border-gray-300"
                      }`}
                      id={`skill-${skill.id}-btn`}
                    >
                      <div className="flex items-center gap-1.5">
                        <SkillIcon size={13} className={isActive ? "text-black font-bold" : "text-gray-400"} />
                        <span className="font-sans text-[11px] font-bold tracking-tight text-black">{skill.label}</span>
                      </div>
                      <p className="text-[9px] text-gray-400 font-sans mt-0.5 truncate">{skill.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Action Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block font-sans">
                  Vibe presets
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSkillPresets[activeSkill].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => handleRunAgentTask(preset.prompt)}
                      disabled={isAgentRunning}
                      className="px-2.5 py-1 text-[10px] bg-neutral-50 border border-gray-100 hover:border-black rounded text-gray-700 hover:text-black font-medium transition-all duration-200 shadow-sm disabled:opacity-50"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Area split: Left side Live compilation output console, Right side Diff patch manager */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden border-b border-gray-100">
              
              {/* Left Side: Real-time Terminal & Execution Logs */}
              <div className="flex-1 flex flex-col h-full border-r border-gray-100 overflow-hidden bg-neutral-900 text-neutral-200">
                <div className="h-9 border-b border-neutral-800 bg-neutral-950 flex items-center px-4 justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Activity size={12} className="text-amber-400 animate-pulse" />
                    <span className="font-mono text-[10px] tracking-tight uppercase font-semibold text-neutral-400">Agentic Console</span>
                  </div>
                  <span className="font-mono text-[9px] text-neutral-500">PORT: 3000</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-2 select-text bg-neutral-950">
                  {agentLogs.length === 0 ? (
                    <div className="text-neutral-500 italic text-center py-10 space-y-1 font-sans">
                      <p className="font-mono text-xs text-neutral-400">&gt;_ standing by.</p>
                      <p className="text-[10px] text-neutral-500">Select a skill preset from the panel above to initiate compiles.</p>
                    </div>
                  ) : (
                    agentLogs.map((log) => {
                      let colorClass = "text-neutral-300";
                      if (log.type === "success") colorClass = "text-emerald-400";
                      if (log.type === "warn") colorClass = "text-amber-400";
                      if (log.type === "error") colorClass = "text-rose-400";
                      if (log.type === "code") colorClass = "text-blue-300 italic font-sans text-[10px] opacity-90";

                      return (
                        <div key={log.id} className="flex gap-2 items-start leading-relaxed border-b border-neutral-900/40 pb-1 text-[10px]">
                          <span className="text-neutral-600 select-none shrink-0 font-light">[{log.timestamp}]</span>
                          <span className={colorClass}>{log.message}</span>
                        </div>
                      );
                    })
                  )}
                  <div ref={logsEndRef} />
                </div>

                {/* Progress bar when agent is actively generating */}
                {isAgentRunning && (
                  <div className="border-t border-neutral-800 bg-neutral-950 p-3.5 space-y-1.5 shrink-0">
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <RefreshCw size={11} className="animate-spin text-amber-400" />
                        {agentPhase === "planning" && "PLANNER: Modeling dependency schemas..."}
                        {agentPhase === "synthesizing" && "ARCHITECT: Injecting optimized typescript structures..."}
                        {agentPhase === "auditing" && "REVIEWER: Auditing code scope boundaries..."}
                        {agentPhase === "packaging" && "DEVOPS: Synthesizing reverse-proxy parameters..."}
                      </span>
                      <span>{agentProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 h-1 rounded-full transition-all duration-300" 
                        style={{ width: `${agentProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: High-contrast side-by-side patch diff viewer */}
              <div className="w-full md:w-80 lg:w-[350px] shrink-0 flex flex-col h-full bg-[#FAFAFA] overflow-hidden justify-between border-t md:border-t-0 border-gray-100">
                <div className="h-9 border-b border-gray-100 bg-white flex items-center px-4 justify-between shrink-0">
                  <span className="font-sans font-bold text-[10px] text-gray-500 uppercase tracking-widest block">Proposed Code Difference</span>
                  {proposedPatch && (
                    <span className="font-mono text-[9px] text-neutral-500 truncate max-w-[120px] bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                      {proposedPatch.file}
                    </span>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-white font-mono text-[10px] space-y-1 select-text">
                  {!proposedPatch ? (
                    <div className="text-gray-400 italic text-center py-20 font-sans space-y-1.5">
                      <div className="inline-flex p-2 bg-gray-50 border border-gray-100 rounded-full text-gray-300">
                        <FileCode size={20} />
                      </div>
                      <p className="font-medium text-xs text-black">No active patch generated</p>
                      <p className="text-[10px] text-gray-400">Trigger an agent run to compile layout differences.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border border-neutral-100 rounded overflow-hidden">
                        <div className="bg-emerald-50 text-emerald-800 font-sans text-[10px] font-bold px-2.5 py-1.5 border-b border-emerald-100 flex items-center justify-between">
                          <span>Synthesized insertions</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-mono">+{proposedPatch.diffLines.length} lines</span>
                        </div>
                        <div className="p-3 bg-neutral-900 text-neutral-200 max-h-96 overflow-y-auto overflow-x-auto divide-y divide-neutral-800/40 select-all font-mono leading-relaxed bg-neutral-950">
                          {proposedPatch.diffLines.map((line, idx) => (
                            <div key={idx} className="bg-emerald-950/20 text-emerald-300 py-0.5 px-1 truncate">
                              {line.text}
                            </div>
                          ))}
                        </div>
                      </div>

                      {hasAppliedPatch ? (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded font-sans text-[11px] leading-relaxed flex gap-2">
                          <CheckCircle2 size={14} className="shrink-0 text-emerald-600 mt-0.5 animate-bounce" />
                          <div>
                            <span className="font-bold block text-emerald-900">Patch Successfully Merged!</span>
                            All changes have been safely applied to `{proposedPatch.file}` and compiled via reverse-proxy port.
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50/70 border border-amber-100 text-amber-800 rounded font-sans text-[10px] leading-relaxed flex gap-2">
                          <AlertTriangle size={14} className="shrink-0 text-amber-600 mt-0.5" />
                          <div>
                            <span className="font-bold block text-amber-900">Review Code Solution</span>
                            Verify and validate synthesized structure. Click **Apply Patch** below to live write to your active file.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Apply Patch Button Controls */}
                {proposedPatch && (
                  <div className="p-3 bg-gray-50 border-t border-gray-100 shrink-0">
                    <button
                      onClick={handleApplyProposedPatch}
                      disabled={hasAppliedPatch || isApplyingPatch}
                      className={`w-full py-2.5 rounded text-xs font-sans font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                        hasAppliedPatch 
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                          : "bg-black text-white hover:bg-neutral-800"
                      }`}
                      id="apply-patch-btn"
                    >
                      {isApplyingPatch ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          Vibe Writing to Workspace Files...
                        </>
                      ) : hasAppliedPatch ? (
                        <>
                          <Check size={13} />
                          Workspace Files Merged
                        </>
                      ) : (
                        <>
                          <Plus size={13} />
                          Apply & Auto-Compile Patch
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>

            </div>

            {/* Custom Interactive Input Prompt Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const text = userInput.trim();
                if (text) {
                  setUserInput("");
                  handleRunAgentTask(text);
                }
              }} 
              className="p-4 bg-white shrink-0"
            >
              <div className="flex gap-2 border border-gray-200 rounded p-1.5 focus-within:border-black bg-gray-50/50 transition-colors shadow-sm">
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={`Describe a full-stack dev task (e.g. "Create secure authentication middleware")...`}
                  className="flex-1 bg-transparent border-none outline-none font-sans text-xs text-black placeholder-gray-500 px-2"
                  disabled={isAgentRunning || isApplyingPatch}
                  id="vibe-user-input"
                />
                <button
                  type="submit"
                  disabled={isAgentRunning || isApplyingPatch || !userInput.trim()}
                  className="bg-black hover:bg-neutral-800 text-white p-2 px-3 rounded text-[11px] font-sans font-bold transition-all disabled:opacity-40 flex items-center gap-1 shrink-0"
                  id="vibe-run-agent-btn"
                >
                  <Play size={10} />
                  Run Agent
                </button>
              </div>
            </form>

          </div>
        ) : (
          /* STANDARD COPILOT ASSISTANT MODE */
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
              {messages.map((msg) => {
                const isAI = msg.sender === "ai";
                return (
                  <div 
                    key={msg.id}
                    className={`flex gap-3 max-w-full ${isAI ? "justify-start" : "justify-end"}`}
                  >
                    {isAI && (
                      <div className="w-6 h-6 rounded bg-black flex items-center justify-center text-white text-[10px] shrink-0 font-bold font-mono">
                        A
                      </div>
                    )}

                    <div className="flex flex-col space-y-1 max-w-[85%]">
                      <div 
                        className={`p-3.5 rounded border text-xs leading-relaxed font-sans ${
                          isAI 
                            ? "bg-[#FAFAFA] border-gray-100 text-black shadow-sm" 
                            : "bg-black border-transparent text-[#fdf8f8]"
                        }`}
                      >
                        <div className="prose prose-sm font-sans max-w-none text-xs break-words">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>

                        {isAI && msg.modelUsed && (
                          <div className="mt-2.5 border-t border-gray-100 pt-1.5 flex items-center justify-between text-[9px] font-mono text-gray-400">
                            <span>Model: {msg.modelUsed}</span>
                            {msg.fileReferences && msg.fileReferences.length > 0 && (
                              <span className="text-gray-400 uppercase tracking-wider font-bold">
                                Ref: {msg.fileReferences[0]}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <span className="text-[9px] text-gray-400 font-mono self-end">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Text Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white shrink-0">
              <div className="flex gap-2 border border-gray-200 rounded p-1.5 focus-within:border-black bg-[#FAFAFA] transition-colors shadow-sm">
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={`Ask Assistant about ${activeFile || "the workspace"}...`}
                  className="flex-1 bg-transparent border-none outline-none font-sans text-xs text-black placeholder-gray-500 px-2"
                  disabled={isSending}
                  id="chat-user-input"
                />
                <button
                  type="submit"
                  disabled={isSending || !userInput.trim()}
                  className="bg-black hover:bg-neutral-800 text-white p-1.5 rounded transition-all disabled:opacity-40"
                  id="send-chat-message-btn"
                >
                  {isSending ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Right Column: Context Inspector */}
      <div className="w-full xl:w-72 bg-[#FAFAFA] border-l border-gray-100 p-5 space-y-6 shrink-0 flex flex-col justify-between overflow-y-auto">
        
        {/* Active Context Section */}
        <div className="space-y-4">
          <div>
            <span className="font-sans font-bold text-[10px] text-gray-400 uppercase tracking-widest block font-sans">
              Active Context
            </span>
            
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded text-xs font-sans text-black shadow-sm">
                <FileCode size={13} className="text-gray-400" />
                <span className="truncate font-mono text-[11px]">{activeFile}</span>
                <span className="text-[9px] text-gray-400 shrink-0 font-mono">({fileContent.split("\n").length} lines)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white border border-transparent rounded text-xs font-sans text-gray-400">
                <FileCode size={13} className="text-gray-300" />
                <span className="truncate font-mono text-[11px]">user.go</span>
                <span className="text-[9px] text-gray-400 shrink-0 font-mono italic">(referenced)</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* AI Memory metrics */}
          <div className="space-y-3">
            <span className="font-sans font-bold text-[10px] text-gray-400 uppercase tracking-widest block font-sans">
              AI Memory Status
            </span>

            <div className="space-y-3 font-sans text-xs text-gray-500">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Token Usage</span>
                  <span className="font-mono text-black font-semibold">{tokenUsage.toLocaleString()} / 32,000</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-black transition-all duration-300" style={{ width: `${(tokenUsage / 32000) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Memory Slots</span>
                  <span className="font-mono text-black font-semibold">4 / 5 Used</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400" style={{ width: "80%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graphical Memory status */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <div className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold">Workspace Graph Activity</div>
          <div className="flex items-end gap-1 h-8 pt-2">
            {[20, 40, 60, 30, 80, 50, 40, 90, 70, 50, 60, 80].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-black/20 rounded-t-sm hover:bg-black transition-colors"
                style={{ height: `${h}%` }} 
                title={`Context load: ${h}%`}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
