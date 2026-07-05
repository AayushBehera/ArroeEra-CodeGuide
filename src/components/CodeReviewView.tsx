import React, { useState } from "react";
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Play, 
  Check, 
  Sparkles,
  RefreshCw,
  Terminal,
  FileCode
} from "lucide-react";
import { CodeIssue } from "../types";

interface CodeReviewViewProps {
  currentModel: string;
  ollamaUrl?: string;
}

export default function CodeReviewView({ currentModel, ollamaUrl = "http://localhost:11434" }: CodeReviewViewProps) {
  // Original sample code loaded by default
  const defaultCode = `import pandas as pd
import numpy as np

class DataProcessor:
    def __init__(self, data_path):
        self.df = pd.read_csv(data_path)

    def clean_data(self):
        self.df.dropna(inplace=True)
        self.df['date'] = pd.to_datetime(self.df['date'])
        # Potential performance issue: iterate over rows
        for index, row in self.df.iterrows():
            row['value'] = row['value'] * 1.1
        return self.df

    def analyze(self):
        summary = self.df.describe()
        return summary

if __name__ == '__main__':
    processor = DataProcessor('data.csv')
    clean_df = processor.clean_data()
    print(clean_df.head())`;

  const [code, setCode] = useState(defaultCode);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>("issue-2");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Default code issues loaded
  const [issues, setIssues] = useState<CodeIssue[]>([
    {
      id: "issue-1",
      type: "success",
      category: "Code Structure",
      message: "The class structure and import statements are well-organized. Good use of pandas library.",
      lineStart: 1,
      lineEnd: 5,
      suggestion: "Action: None required."
    },
    {
      id: "issue-2",
      type: "warning",
      category: "Performance Issue",
      message: "Iterating over rows using 'iterrows' (lines 12-13) is inefficient for large datasets. Consider vectorization.",
      lineStart: 12,
      lineEnd: 13,
      suggestion: "Action: Refactor to use vectorized operation. See suggestions.",
      codeSnippet: "        self.df['value'] = self.df['value'] * 1.1"
    },
    {
      id: "issue-3",
      type: "info",
      category: "Readability Improvement",
      message: "Adding docstrings to methods would enhance long-term maintainability.",
      lineStart: 8,
      lineEnd: 8,
      suggestion: "Action: Consider adding docstrings. View example.",
      codeSnippet: '    """Clean dataframe by dropping NaN rows and converting dates."""'
    }
  ]);

  // Run real or simulated review via backend
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    const isOllamaModel = currentModel.startsWith("ollama-") || currentModel === "llama-3-8b";
    const modelName = currentModel.startsWith("ollama-") ? currentModel.replace("ollama-", "") : "llama3";
    const localOllamaUrl = ollamaUrl;

    if (isOllamaModel) {
      try {
        const reviewPrompt = `You are an expert code reviewer. Analyze the following python code for performance issues, bug risks, or style improvements.
Respond ONLY with a valid JSON array of issues (maximum 3 findings), matching this exact typescript structure:
Array<{
  id: string;
  type: "success" | "warning" | "info";
  category: string;
  message: string;
  lineStart: number;
  lineEnd: number;
  suggestion: string;
  codeSnippet?: string;
}>

Do NOT add any markdown formatting (like \`\`\`json) or conversational text around the JSON. Return only the raw JSON.

Code to review:
${code}
`;

        const res = await fetch(`${localOllamaUrl}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: modelName,
            prompt: reviewPrompt,
            stream: false
          })
        });

        if (!res.ok) {
          throw new Error("Ollama review failed");
        }

        const data = await res.json();
        let cleanedText = data.response?.trim() || "[]";
        if (cleanedText.startsWith("```json")) {
          cleanedText = cleanedText.substring(7);
        }
        if (cleanedText.endsWith("```")) {
          cleanedText = cleanedText.substring(0, cleanedText.length - 3);
        }
        cleanedText = cleanedText.trim();

        const parsedIssues = JSON.parse(cleanedText);
        if (Array.isArray(parsedIssues) && parsedIssues.length > 0) {
          setIssues(parsedIssues);
          setSelectedIssueId(parsedIssues[0].id);
        } else {
          throw new Error("Invalid format returned from Ollama");
        }
      } catch (ollamaErr) {
        console.warn("Local Ollama review failed or was offline, using fallback reviewer", ollamaErr);
        const fallbackIssues = [
          {
            id: "issue-ollama-1",
            type: "warning" as const,
            category: "Ollama Diagnostic",
            message: `CODEGuide attempted to execute a live local-first static analysis using Ollama (${modelName}) but the local endpoint was offline or CORS is blocked. Showing simulated findings.`,
            lineStart: 31,
            lineEnd: 33,
            suggestion: "Action: Run OLLAMA_ORIGINS=\"*\" ollama serve to analyze with your real local hardware.",
            codeSnippet: "        # Optimizing python performance requires local LLM compilation"
          },
          {
            id: "issue-ollama-2",
            type: "info" as const,
            category: "Structure Check",
            message: "DataProcessor class has clean method boundaries but lacks logging metrics.",
            lineStart: 24,
            lineEnd: 24,
            suggestion: "Action: Add import logging and initialize logger.",
            codeSnippet: "class DataProcessor:"
          }
        ];
        setIssues(fallbackIssues);
        setSelectedIssueId(fallbackIssues[0].id);
      } finally {
        setIsAnalyzing(false);
      }
      return;
    }

    try {
      const response = await fetch("/api/gemini/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code,
          language: "python",
          filename: "data_processor.py"
        })
      });
      const data = await response.json();
      if (data.issues && data.issues.length > 0) {
        setIssues(data.issues);
        setSelectedIssueId(data.issues[0].id);
      } else {
        alert("No clear issues identified by the AI code reviewer.");
      }
    } catch (e) {
      console.error("Analysis failed:", e);
      alert("Analysis failed. Reverting to local fallback parsing.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Physically replace code line selection
  const handleApplyChange = () => {
    const activeIssue = issues.find(i => i.id === selectedIssueId);
    if (!activeIssue || !activeIssue.codeSnippet) {
      alert("No code modification suggested for this card.");
      return;
    }

    const lines = code.split("\n");
    // Replace the range lineStart to lineEnd (1-based indices)
    const startIndex = activeIssue.lineStart - 1;
    const endIndex = activeIssue.lineEnd; // slice end is non-inclusive, perfect match

    const replacement = activeIssue.codeSnippet;
    
    // Construct new lines array
    const before = lines.slice(0, startIndex);
    const after = lines.slice(endIndex);
    const newLines = [...before, replacement, ...after];

    setCode(newLines.join("\n"));
    
    // Update issue state to mark as success or resolve
    setIssues(prev => prev.map(issue => 
      issue.id === selectedIssueId 
        ? { ...issue, type: "success" as const, message: "Applied successfully. Code vectorized and optimized.", suggestion: "Action: None required." } 
        : issue
    ));
    alert("Change applied successfully directly into python code buffer!");
  };

  // Find currently selected issue details for focus panel
  const currentIssue = issues.find(i => i.id === selectedIssueId);

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-white">
      {/* Left panel: Code Editor */}
      <div className="flex-1 border-r border-gray-100 flex flex-col h-full overflow-hidden bg-[#1c1b1b]">
        {/* Editor Tab Header */}
        <div className="h-11 bg-[#121111] border-b border-[#2d2c2c] flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FileCode size={14} className="text-gray-400" />
            <span className="font-mono text-xs text-[#e5e2e1] font-medium">data_processor.py</span>
            <span className="px-1.5 py-0.5 rounded bg-[#2d2c2c] text-[9px] text-gray-300 font-mono">
              PYTHON
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-gray-500">
              Active Model: {currentModel}
            </span>
          </div>
        </div>

        {/* Code Textarea Wrapper */}
        <div className="flex-1 flex overflow-auto relative font-mono text-xs text-[#e5e2e1] p-4 leading-relaxed">
          {/* Static Line Numbers (aligned) */}
          <div className="w-8 select-none text-right pr-4 text-gray-600 border-r border-[#2d2c2c] shrink-0">
            {code.split("\n").map((_, i) => (
              <div 
                key={i} 
                className={`h-5 ${currentIssue && i + 1 >= currentIssue.lineStart && i + 1 <= currentIssue.lineEnd ? "text-white font-semibold" : ""}`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Actual Editable Textarea overlaid or styled */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 pl-4 bg-transparent outline-none resize-none overflow-y-hidden font-mono text-xs text-[#e5e2e1] h-full"
            style={{ 
              lineHeight: "20px",
              tabSize: 4,
            }}
            id="code-editor-textarea"
          />

          {/* Highlight overlays on target lines */}
          {currentIssue && (
            <div 
              className="absolute left-12 right-0 bg-white/5 pointer-events-none border-l-2 border-white"
              style={{
                top: `${(currentIssue.lineStart - 1) * 20 + 16}px`,
                height: `${(currentIssue.lineEnd - currentIssue.lineStart + 1) * 20}px`
              }}
            />
          )}
        </div>

        {/* Bottom Editor Status Bar */}
        <div className="h-10 bg-[#121111] border-t border-[#2d2c2c] flex items-center justify-between px-4 text-[11px] text-gray-500 font-mono shrink-0">
          <div className="flex items-center gap-3">
            <span>Lines: {code.split("\n").length}</span>
            <span>Encoding: UTF-8</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Ready for compiler analysis</span>
          </div>
        </div>
      </div>

      {/* Right panel: Static Analysis and Suggestions */}
      <div className="w-full lg:w-[480px] flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
        
        {/* Review Title Header */}
        <div className="p-6 border-b border-gray-100 shrink-0 bg-white">
          <h2 className="font-sans text-base font-semibold text-black tracking-tight flex items-center gap-2">
            <Sparkles size={16} className="text-black" />
            AI Code Review & Analysis
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Static lint results & automated Gemini review rules.
          </p>
        </div>

        {/* List of findings */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {issues.map((issue) => {
            const isSelected = selectedIssueId === issue.id;
            
            // Render specific colors for success, warning, info
            let bgClass = isSelected ? "bg-white border-black shadow-sm" : "bg-white border-gray-200 hover:border-gray-400";
            let borderClass = isSelected ? "border-black" : "border-gray-200";
            let textAccent = "text-black";
            let icon = <Info size={16} className="text-black" />;

            if (issue.type === "success") {
              bgClass = isSelected ? "bg-white border-black shadow-sm" : "bg-white border-gray-100 hover:border-gray-300";
              borderClass = isSelected ? "border-black" : "border-gray-100";
              textAccent = "text-emerald-800";
              icon = <CheckCircle size={16} className="text-emerald-600" />;
            } else if (issue.type === "warning") {
              bgClass = isSelected ? "bg-white border-amber-500 shadow-sm" : "bg-white border-gray-200 hover:border-amber-400";
              borderClass = isSelected ? "border-amber-500" : "border-gray-200";
              textAccent = "text-amber-800";
              icon = <AlertTriangle size={16} className="text-amber-600" />;
            } else if (issue.type === "info") {
              bgClass = isSelected ? "bg-white border-black shadow-sm" : "bg-white border-gray-100 hover:border-gray-300";
              borderClass = isSelected ? "border-black" : "border-gray-100";
              textAccent = "text-gray-700";
              icon = <Info size={16} className="text-gray-600" />;
            }

            return (
              <button
                key={issue.id}
                id={`review-issue-card-${issue.id}`}
                onClick={() => setSelectedIssueId(issue.id)}
                className={`w-full text-left p-4 rounded border transition-all duration-200 ${bgClass} ${borderClass}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-sans font-bold text-[10px] uppercase tracking-wider ${textAccent}`}>
                        {issue.category}
                      </span>
                      <span className="font-mono text-[10px] text-gray-400">
                        Line {issue.lineStart === issue.lineEnd ? issue.lineStart : `${issue.lineStart}-${issue.lineEnd}`}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-gray-700 mt-1.5 leading-relaxed">
                      {issue.message}
                    </p>
                    <p className="font-sans text-[11px] font-medium text-gray-400 mt-2">
                      {issue.suggestion}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Panel for active recommendation */}
        <div className="p-6 bg-white border-t border-gray-100 shrink-0 space-y-4">
          <div className="rounded border border-gray-100 bg-[#FAFAFA] p-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-semibold text-black tracking-tight">
                Suggested Changes (Focus)
              </span>
              {currentIssue && currentIssue.codeSnippet && (
                <button
                  onClick={handleApplyChange}
                  className="font-sans text-xs font-semibold text-white bg-black hover:bg-neutral-800 px-3 py-1 rounded transition-colors flex items-center gap-1"
                  id="apply-code-change-btn"
                >
                  <Check size={12} /> Apply Change
                </button>
              )}
            </div>

            <div className="mt-3 bg-[#1c1b1b] p-3 rounded border border-[#2d2c2c] overflow-x-auto max-h-32">
              {currentIssue && currentIssue.codeSnippet ? (
                <pre className="font-mono text-[11px] text-[#e5e2e1] leading-relaxed">
                  <code>{currentIssue.codeSnippet}</code>
                </pre>
              ) : (
                <div className="font-sans text-xs text-gray-500 italic text-center py-4">
                  No automated code edits available for this card.
                </div>
              )}
            </div>
          </div>

          {/* Core Run Analysis Trigger */}
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-sans text-xs font-bold py-3 rounded transition-all disabled:opacity-55"
            id="run-full-analysis-btn"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={13} className="animate-spin" /> Analyzing Source Code...
              </>
            ) : (
              <>
                <Play size={13} fill="currentColor" /> Run Full AI Analysis
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
