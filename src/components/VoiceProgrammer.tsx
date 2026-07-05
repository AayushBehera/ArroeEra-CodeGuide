import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle, Play } from "lucide-react";

export default function VoiceProgrammer() {
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [lastCommand, setLastCommand] = useState("");
  const [assistantReply, setAssistantReply] = useState("");

  const voiceSuggestions = [
    "ArrowEra, scan security",
    "CODEGuide, refactor pandas loop",
    "Check system health stats",
    "Draft a commit message"
  ];

  const handleSpeechFeedback = (text: string) => {
    setAssistantReply(text);
    if (voiceEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTriggerCommand = (command: string) => {
    setIsListening(true);
    setLastCommand(command);
    setAssistantReply("Analyzing voice frequencies...");

    setTimeout(() => {
      setIsListening(false);
      let reply = "";
      const cmd = command.toLowerCase();

      if (cmd.includes("refactor") || cmd.includes("loop")) {
        reply = "Optimizing loops in your active data_processor file. I recommend replacing iterrows with pandas vectorized multiplication.";
      } else if (cmd.includes("security") || cmd.includes("scan")) {
        reply = "Security analysis complete. I identified potential vulnerability vectors in user controllers. Recommend parameterizing SQL commands.";
      } else if (cmd.includes("health") || cmd.includes("system")) {
        reply = "All modules stable. Memory footprint at sixty-five percent. CPU usage twenty-four percent.";
      } else if (cmd.includes("commit")) {
        reply = "Drafting commit message. Suggested title is: feat, add user profile update endpoint.";
      } else {
        reply = "Consensus established. Ready to delegate tasks to Architect or Planner agents.";
      }

      handleSpeechFeedback(reply);
    }, 1800);
  };

  const handlePushToTalk = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setAssistantReply("Listening for wake word: 'Hey ArrowEra'...");
    
    // Pick random suggestion to trigger automatically for high-fidelity simulation
    setTimeout(() => {
      const randCmd = voiceSuggestions[Math.floor(Math.random() * voiceSuggestions.length)];
      handleTriggerCommand(randCmd);
    }, 2000);
  };

  return (
    <div className="bg-[#FAFAFA] border border-gray-100 rounded p-5 space-y-4 shadow-sm select-none">
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-xs font-semibold text-black tracking-tight flex items-center gap-1.5">
          <Volume2 size={14} className="text-black" />
          Voice Pair Programmer
        </h3>

        {/* Audio Mute toggle */}
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className="text-gray-400 hover:text-black p-1 hover:bg-gray-100 rounded transition-colors"
          title={voiceEnabled ? "Mute Speech" : "Unmute Speech"}
        >
          {voiceEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>
      </div>

      {/* Voice visualizer block */}
      <div className="bg-white border border-gray-100 p-4 rounded flex flex-col items-center justify-center space-y-3 relative overflow-hidden shadow-sm">
        {isListening ? (
          <div className="flex items-center gap-1 h-6 py-2">
            {[1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4].map((v, i) => (
              <div 
                key={i} 
                className="w-1 bg-black rounded-full animate-bounce" 
                style={{ 
                  height: `${v * 4}px`,
                  animationDelay: `${i * 0.08}s`,
                  animationDuration: "0.6s"
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1 h-6 py-2">
            {[1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => (
              <div key={i} className="w-1 h-1.5 bg-gray-200 rounded-full" />
            ))}
          </div>
        )}

        <button
          onClick={handlePushToTalk}
          className={`flex items-center gap-2 font-sans text-[11px] font-semibold px-4 py-2 rounded-full border transition-all ${
            isListening 
              ? "bg-rose-50 border-rose-300 text-rose-700 font-medium shadow-sm" 
              : "bg-black hover:bg-neutral-800 border-transparent text-white shadow-sm"
          }`}
          id="ptt-button"
        >
          {isListening ? <MicOff size={12} /> : <Mic size={12} />}
          <span>{isListening ? "Listening..." : "Push to Talk"}</span>
        </button>
      </div>

      {/* Assistant spoken text output */}
      {(lastCommand || assistantReply) && (
        <div className="text-left space-y-1.5 text-[11px] border-t border-gray-100 pt-3 leading-relaxed">
          {lastCommand && (
            <p className="font-sans text-gray-500">
              <span className="font-mono text-[10px] uppercase font-bold text-gray-400">Command:</span> "{lastCommand}"
            </p>
          )}
          {assistantReply && (
            <p className="font-sans text-black">
              <span className="font-mono text-[10px] uppercase font-bold text-black">CODEGuide:</span> {assistantReply}
            </p>
          )}
        </div>
      )}

      {/* Suggestions shortcuts */}
      <div className="space-y-1.5 border-t border-gray-100 pt-3">
        <span className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
          Suggested Speech Shortcuts
        </span>
        <div className="flex flex-col gap-1">
          {voiceSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleTriggerCommand(s)}
              className="text-left font-mono text-[10px] text-gray-500 hover:text-black py-1 px-1.5 rounded bg-white hover:bg-gray-100 border border-gray-100 transition-colors truncate shadow-sm"
            >
              ➔ "{s}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
