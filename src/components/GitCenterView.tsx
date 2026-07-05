import React, { useState } from "react";
import { 
  GitBranch, 
  Sparkles, 
  Check, 
  ChevronRight, 
  FileCode, 
  Plus, 
  Minus,
  RefreshCw,
  GitPullRequest
} from "lucide-react";

export default function GitCenterView() {
  const changedFiles = [
    { name: "src/api/users.js", additions: 8, deletions: 4, type: "js", id: "f1" },
    { name: "src/components/Button.vue", additions: 12, deletions: 2, type: "vue", id: "f2" },
    { name: "tests/unit/user.spec.js", additions: 4, deletions: 0, type: "test", id: "f3" },
    { name: "package.json", additions: 1, deletions: 1, type: "json", id: "f4" }
  ];

  const [activeFileId, setActiveFileId] = useState("f1");
  const [selectedCommitMsg, setSelectedCommitMsg] = useState("feat: add user profile update endpoint");
  const [prTitle, setPrTitle] = useState("feat: add user profile update endpoint");
  const [prDescription, setPrDescription] = useState("fix: resolve linting errors in user API, refactor: optimize user data fetching, and update data_processor.py.");
  const [isGenerating, setIsGenerating] = useState(false);

  const [diffLines, setDiffLines] = useState([
    { type: "normal", leftNum: 1, rightNum: 1, text: "import { React } from 'react'" },
    { type: "normal", leftNum: 2, rightNum: 2, text: "import { users } from '../users'" },
    { type: "normal", leftNum: 3, rightNum: 3, text: "" },
    { type: "normal", leftNum: 4, rightNum: 4, text: "export default src/Api(Users) => {" },
    { type: "normal", leftNum: 5, rightNum: 5, text: "  const users = Lancen(" },
    { type: "normal", leftNum: 6, rightNum: 6, text: "    const users = getETAunt(ctent, enc: unobte" },
    { type: "normal", leftNum: 7, rightNum: 7, text: "" },
    { type: "added", leftNum: null, rightNum: 8, text: "+   if (outscxhanas() => {" },
    { type: "added", leftNum: null, rightNum: 9, text: "+     feat: add userprofile update" },
    { type: "added", leftNum: null, rightNum: 10, text: "+     const users = {profile update endpoint}" },
    { type: "added", leftNum: null, rightNum: 11, text: "+     usrs: get erasth," },
    { type: "deleted", leftNum: 8, rightNum: null, text: "-   const endbant = {.user}" },
    { type: "added", leftNum: null, rightNum: 12, text: "+     const optimize userdata fetching" },
    { type: "added", leftNum: null, rightNum: 13, text: "+     const at resout = true," },
    { type: "added", leftNum: null, rightNum: 14, text: "+     refactor: optimize user data fetching" },
    { type: "added", leftNum: null, rightNum: 15, text: "+   });" },
    { type: "added", leftNum: null, rightNum: 16, text: "+ });" },
    { type: "normal", leftNum: 9, rightNum: 17, text: "" },
    { type: "normal", leftNum: 10, rightNum: 18, text: "export default user(user)" }
  ]);

  const commitSuggestions = [
    "feat: add user profile update endpoint",
    "fix: resolve linting errors in user API",
    "refactor: optimize user data fetching"
  ];

  const handleSelectSuggestion = (msg: string) => {
    setSelectedCommitMsg(msg);
    setPrTitle(msg);
  };

  const handleGenerateAssistantData = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/gemini/git", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: changedFiles.map(f => f.name),
          diff: JSON.stringify(diffLines)
        })
      });
      const data = await res.json();
      if (data.suggestedMessages) {
        setPrTitle(data.prTitle);
        setPrDescription(data.prDescription);
        setSelectedCommitMsg(data.suggestedMessages[0]);
      }
    } catch (e) {
      console.error(e);
      alert("AI generator failed. Keeping high-fidelity simulated draft.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCommit = () => {
    alert(`Committed successfully with message: "${selectedCommitMsg}"`);
  };

  const handleCreatePR = () => {
    alert(`Pull Request Draft Created!\nTitle: ${prTitle}\nDescription: ${prDescription.slice(0, 80)}...`);
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div>
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-black flex items-center gap-2">
          <GitBranch size={22} className="text-[#0070F3]" />
          Git Center & Version Control
        </h1>
        <p className="font-sans text-xs text-gray-500 mt-1">
          Review file additions/deletions, request commits, and draft Pull Requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column: Changed Files */}
        <div className="bg-[#FAFAFA] border border-gray-100 rounded p-5 space-y-4 shadow-sm">
          <div className="font-sans font-bold text-[10px] text-gray-400 uppercase tracking-widest">
            Changed Files (Active: develop)
          </div>

          <div className="space-y-1">
            {changedFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => {
                  setActiveFileId(file.id);
                  if (file.id === "f4") {
                    setDiffLines([
                      { type: "normal", leftNum: 1, rightNum: 1, text: "{" },
                      { type: "normal", leftNum: 2, rightNum: 2, text: '  "name": "react-example",' },
                      { type: "deleted", leftNum: 3, rightNum: null, text: '  "version": "0.0.0",' },
                      { type: "added", leftNum: null, rightNum: 3, text: '  "version": "1.2.0",' }
                    ]);
                  } else {
                    setDiffLines([
                      { type: "normal", leftNum: 1, rightNum: 1, text: "import { React } from 'react'" },
                      { type: "added", leftNum: null, rightNum: 8, text: "+   if (outscxhanas() => {" },
                      { type: "deleted", leftNum: 8, rightNum: null, text: "-   const endbant = {.user}" }
                    ]);
                  }
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded transition-colors font-sans text-xs ${
                  activeFileId === file.id 
                    ? "bg-black text-white" 
                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode size={14} className={activeFileId === file.id ? "text-white" : "text-gray-400"} />
                  <span className="truncate font-mono text-[11px]">{file.name}</span>
                </div>
                <div className="flex gap-1 shrink-0 font-mono text-[9px] font-bold">
                  {file.additions > 0 && <span className="text-emerald-600">+{file.additions}</span>}
                  {file.deletions > 0 && <span className="text-rose-600">-{file.deletions}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center Panel: Diff Viewer */}
        <div className="lg:col-span-2 border border-gray-100 rounded bg-white overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="h-11 bg-[#FAFAFA] border-b border-gray-100 flex items-center justify-between px-4">
            <span className="font-mono text-xs text-black font-semibold">
              {changedFiles.find(f => f.id === activeFileId)?.name || "Diff Viewer"}
            </span>
            <span className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider">UNCOMMITTED CHANGES</span>
          </div>

          <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <tbody>
                {diffLines.map((line, index) => {
                  let rowBg = "hover:bg-gray-50";
                  let textColor = "text-black";
                  if (line.type === "added") {
                    rowBg = "bg-emerald-50/50 hover:bg-emerald-100/30";
                    textColor = "text-emerald-900";
                  } else if (line.type === "deleted") {
                    rowBg = "bg-rose-50/50 hover:bg-rose-100/30";
                    textColor = "text-rose-900";
                  }

                  return (
                    <tr key={index} className={`font-mono ${rowBg}`}>
                      {/* Left Line Number */}
                      <td className="w-8 select-none text-right pr-2 text-gray-400 border-r border-gray-100 text-[10px]">
                        {line.leftNum !== null ? line.leftNum : ""}
                      </td>
                      {/* Right Line Number */}
                      <td className="w-8 select-none text-right pr-4 text-gray-400 border-r border-gray-100 text-[10px]">
                        {line.rightNum !== null ? line.rightNum : ""}
                      </td>
                      {/* Code string */}
                      <td className={`pl-4 whitespace-pre ${textColor}`}>
                        {line.text}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Assistant Controls */}
        <div className="bg-[#FAFAFA] border border-gray-100 rounded p-5 space-y-6 shadow-sm">
          {/* AI Commit Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={12} className="text-black" />
                AI Commit Assistant
              </span>
            </div>

            <div className="space-y-2">
              {commitSuggestions.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSuggestion(msg)}
                  className={`w-full text-left p-2.5 rounded border text-xs font-sans transition-all ${
                    selectedCommitMsg === msg 
                      ? "bg-white border-black text-black font-semibold shadow-sm" 
                      : "bg-white border-gray-200 hover:border-gray-400 text-gray-500"
                  }`}
                >
                  {msg}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <div className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">Selected message:</div>
              <input 
                type="text" 
                value={selectedCommitMsg} 
                onChange={(e) => setSelectedCommitMsg(e.target.value)}
                className="w-full mt-1 bg-white border border-gray-100 rounded px-2.5 py-1.5 font-sans text-xs focus:outline-none focus:border-black"
                id="commit-message-input"
              />
            </div>

            <button
              onClick={handleCommit}
              className="w-full text-center bg-black hover:bg-neutral-800 text-white font-sans text-xs font-bold py-2.5 rounded transition-all"
              id="git-commit-btn"
            >
              Generate Commit
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* PR Draft */}
          <div className="space-y-3">
            <span className="font-sans font-bold text-[10px] text-gray-400 uppercase tracking-widest">
              PR Draft Generator
            </span>

            <div className="space-y-2.5">
              <div>
                <label className="text-[9px] font-mono text-gray-400 uppercase font-bold">Title</label>
                <input 
                  type="text" 
                  value={prTitle} 
                  onChange={(e) => setPrTitle(e.target.value)}
                  className="w-full mt-0.5 bg-white border border-gray-100 rounded px-2.5 py-1.5 font-sans text-xs focus:outline-none focus:border-black"
                  id="pr-title-input"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-gray-400 uppercase font-bold">Description</label>
                <textarea 
                  value={prDescription} 
                  onChange={(e) => setPrDescription(e.target.value)}
                  className="w-full mt-0.5 bg-white border border-gray-100 rounded px-2.5 py-1.5 font-sans text-xs h-20 resize-none focus:outline-none focus:border-black leading-relaxed"
                  id="pr-desc-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleGenerateAssistantData}
                disabled={isGenerating}
                className="bg-white hover:bg-gray-50 border border-gray-100 text-black font-sans text-xs font-semibold py-2 rounded transition-all flex items-center justify-center gap-1"
                id="git-pr-generate-btn"
              >
                {isGenerating ? <RefreshCw size={11} className="animate-spin" /> : "AI Regen"}
              </button>
              <button
                onClick={handleCreatePR}
                className="bg-black hover:bg-neutral-800 text-white font-sans text-xs font-bold py-2 rounded transition-all flex items-center justify-center gap-1"
                id="git-pr-create-btn"
              >
                <GitPullRequest size={12} /> Draft PR
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
