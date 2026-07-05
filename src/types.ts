export interface Project {
  name: string;
  status: 'Active' | 'Inactive';
  lastModified: string;
  gitBranch: string;
  repoUrl: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'running' | 'error';
  accuracy: number;
  taskTime: string;
  logs: AgentLog[];
}

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileItem[];
  content?: string;
  language?: string;
}

export interface CodeIssue {
  id: string;
  type: 'success' | 'warning' | 'info';
  category: string;
  message: string;
  lineStart: number;
  lineEnd: number;
  suggestion: string;
  codeSnippet?: string;
}

export interface CommitMessage {
  type: string;
  message: string;
}

export interface DevOpsMetric {
  name: string;
  value: number;
  history: number[];
  unit: string;
}

export interface LogLine {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  service: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  modelUsed?: string;
  fileReferences?: string[];
}
