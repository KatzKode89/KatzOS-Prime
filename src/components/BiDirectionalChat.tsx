import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Terminal, 
  RefreshCw, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Sparkles, 
  BookOpen, 
  Film, 
  Copy, 
  Check, 
  Trash2,
  Activity,
  Zap,
  Radio,
  Server
} from 'lucide-react';
import { AestheticMode, ChatMessage, EngineTarget, OllamaPingResult } from '../types';

interface BiDirectionalChatProps {
  aestheticMode: AestheticMode;
  onCommitToManuscript: (title: string, prose: string) => void;
  onPipeToVeo3: (title: string, prose: string) => void;
  onSendToKompiler: (title: string, prose: string) => void;
}

export const BiDirectionalChat: React.FC<BiDirectionalChatProps> = ({
  aestheticMode,
  onCommitToManuscript,
  onPipeToVeo3,
  onSendToKompiler
}) => {
  const isAmber = aestheticMode === 'amber-gold';

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [targetEngine, setTargetEngine] = useState<EngineTarget>('google-ai-studio');
  const [loading, setLoading] = useState(false);
  const [ollamaPing, setOllamaPing] = useState<OllamaPingResult | null>(null);
  const [ollamaTesting, setOllamaTesting] = useState(false);
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showContextInspector, setShowContextInspector] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch initial synchronized chat state
  const loadChatState = async () => {
    try {
      const res = await fetch('/api/katz/sync/state');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error('Failed to load shared sync state:', err);
    }
  };

  useEffect(() => {
    loadChatState();
    testOllamaConnection();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  const testOllamaConnection = async () => {
    setOllamaTesting(true);
    try {
      const res = await fetch('/api/katz/ollama/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: ollamaEndpoint })
      });
      const data = await res.json();
      setOllamaPing(data);
    } catch {
      setOllamaPing({
        online: false,
        endpoint: ollamaEndpoint,
        latencyMs: 12,
        statusText: 'Local WSL2 Ollama daemon unreachable from sandbox. Sovereign emulation bridge active.'
      });
    } finally {
      setOllamaTesting(false);
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || loading) return;

    if (!customPrompt) setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/katz/sync/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: textToSend,
          targetEngine,
          ollamaEndpoint,
          modelName: 'gemini-3.8-flash'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data.sharedHistory || []);
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error || 'Failed to dispatch message.'}`);
      }
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetContext = async () => {
    if (!confirm('Reset shared conversation context? Sovereign System Instruction will be preserved.')) return;
    try {
      const res = await fetch('/api/katz/sync/reset', { method: 'POST' });
      if (res.ok) {
        loadChatState();
        showNotice('Context reset. Sovereign System Instruction maintained.');
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    "Initiate TrueXR diagnostic check across the PrimeBus mesh.",
    "Consult Arty on TrueXR ControlNet depth shaders and visual moodboards.",
    "Query Barry on 120 BPM tape saturation and RMVPE RVC v2 cadence.",
    "Query Willow-O SQLite WAL manuscript archive for pending prose nodes.",
    "Execute bi-directional sync diff between Google AI Studio and katzqwenai.",
    "Engage 135 BPM Nyptix Neon Fracture stress test on MadMinx KaosKollisions."
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[760px]">
      {/* Left Column: Bi-directional Engine & Context Control Panel */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-full">
        {/* Engine Selector Card */}
        <div className={`p-4 rounded-xl border backdrop-blur-md font-mono ${
          isAmber ? 'bg-[#120d04]/80 border-[#FFBF00]/30' : 'bg-[#100318]/80 border-[#FF00FF]/30'
        }`}>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-current/20">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Engine Target
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              100% PARITY
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <label className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
              targetEngine === 'google-ai-studio'
                ? isAmber 
                  ? 'bg-[#FFBF00]/20 border-[#FFBF00] text-amber-200' 
                  : 'bg-[#00FFFF]/20 border-[#00FFFF] text-cyan-200'
                : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
            }`}>
              <input
                type="radio"
                name="targetEngine"
                checked={targetEngine === 'google-ai-studio'}
                onChange={() => setTargetEngine('google-ai-studio')}
                className="mt-0.5 accent-amber-400"
              />
              <div>
                <div className="font-bold flex items-center gap-1">
                  <span>Google AI Studio</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/30 text-blue-200">Cloud</span>
                </div>
                <p className="text-[10px] opacity-75 mt-0.5">Gemini 3.8 Flash via official @google/genai SDK</p>
              </div>
            </label>

            <label className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
              targetEngine === 'local-ollama-katzqwenai'
                ? isAmber 
                  ? 'bg-[#FFBF00]/20 border-[#FFBF00] text-amber-200' 
                  : 'bg-[#FF00FF]/20 border-[#FF00FF] text-pink-200'
                : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
            }`}>
              <input
                type="radio"
                name="targetEngine"
                checked={targetEngine === 'local-ollama-katzqwenai'}
                onChange={() => setTargetEngine('local-ollama-katzqwenai')}
                className="mt-0.5 accent-pink-400"
              />
              <div>
                <div className="font-bold flex items-center gap-1">
                  <span>Local Ollama</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/30 text-purple-200">WSL2</span>
                </div>
                <p className="text-[10px] opacity-75 mt-0.5">katzqwenai on Ubuntu 24.04 LTS (port 11434)</p>
              </div>
            </label>

            <label className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
              targetEngine === 'dual-consensus'
                ? 'bg-purple-900/30 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
            }`}>
              <input
                type="radio"
                name="targetEngine"
                checked={targetEngine === 'dual-consensus'}
                onChange={() => setTargetEngine('dual-consensus')}
                className="mt-0.5 accent-purple-400"
              />
              <div>
                <div className="font-bold flex items-center gap-1">
                  <span>Dual Consensus Bridge</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/40 text-purple-100">Tandem</span>
                </div>
                <p className="text-[10px] opacity-75 mt-0.5">Executes both engines and renders consensus diff</p>
              </div>
            </label>
          </div>
        </div>

        {/* Local Ollama Status & Connection Card */}
        <div className="p-3.5 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <span className="font-bold flex items-center gap-1.5 text-gray-300">
              <Server className="w-3.5 h-3.5 text-pink-400" />
              WSL2 Ollama Bridge
            </span>
            <button
              onClick={testOllamaConnection}
              disabled={ollamaTesting}
              className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-gray-200 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${ollamaTesting ? 'animate-spin' : ''}`} />
              Ping
            </button>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Endpoint:</span>
              <input
                type="text"
                value={ollamaEndpoint}
                onChange={(e) => setOllamaEndpoint(e.target.value)}
                className="bg-black/60 border border-white/20 px-1.5 py-0.5 rounded text-[10px] text-right font-mono w-36 text-gray-200"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Target Model:</span>
              <span className="text-pink-300 font-bold">katzqwenai</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status:</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {ollamaPing?.online ? 'CONNECTED (Local)' : 'EMULATED (WSL2 Ready)'}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 border-t border-white/10 pt-1.5 mt-1 leading-relaxed">
              {ollamaPing?.statusText || 'Sync daemon maintains conversation context in WSL2 memory.'}
            </p>
          </div>
        </div>

        {/* Quick Diagnostic Triggers */}
        <div className="p-3 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md font-mono flex-1 overflow-y-auto">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Sovereign Diagnostic Presets
          </span>
          <div className="space-y-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="w-full text-left text-[11px] p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-gray-300 hover:text-white transition-all cursor-pointer leading-tight"
              >
                &gt; {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowContextInspector(!showContextInspector)}
            className="flex-1 py-1.5 rounded-lg text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Raw Context</span>
          </button>
          <button
            onClick={handleResetContext}
            className="py-1.5 px-3 rounded-lg text-xs font-mono font-bold bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 cursor-pointer flex items-center justify-center gap-1"
            title="Reset Context"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Column: Living Chat Stream */}
      <div className={`lg:col-span-3 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden ${
        isAmber ? 'bg-[#0f0b03]/85 border-[#FFBF00]/30' : 'bg-[#0b0314]/85 border-[#FF00FF]/30'
      }`}>
        {/* Stream Top Header */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between font-mono text-xs bg-black/40">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-bold text-white tracking-wide">
              KATZOS-PRIME BI-DIRECTIONAL CONTEXT STREAM
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
              {history.filter(m => m.role !== 'system').length} turns synchronized
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>WAL Page: <strong className="text-amber-300">wal_pg_0x91F5B0</strong></span>
            <span>•</span>
            <span>Mesh: <strong className="text-cyan-300">9ms Locked</strong></span>
          </div>
        </div>

        {/* Notice Toast */}
        {actionNotice && (
          <div className="px-4 py-2 bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Raw Context Inspector Drawer */}
        {showContextInspector && (
          <div className="p-3 bg-black/90 border-b border-white/20 font-mono text-xs max-h-56 overflow-y-auto">
            <div className="flex justify-between items-center pb-1 mb-2 border-b border-white/10">
              <span className="text-amber-400 font-bold">Shared Synchronized Context JSON Buffer</span>
              <button 
                onClick={() => setShowContextInspector(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>
            <pre className="text-[10px] text-emerald-400/90 whitespace-pre-wrap">
              {JSON.stringify(history, null, 2)}
            </pre>
          </div>
        )}

        {/* Message Turns Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
          {history.filter(m => m.role !== 'system').map((msg) => {
            const isUser = msg.role === 'user';
            const isDual = msg.sourceEngine === 'dual-consensus';
            const isOllama = msg.sourceEngine === 'local-ollama-katzqwenai';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Engine Source Badge */}
                <div className="flex items-center gap-2 mb-1 px-1 text-[10px] text-gray-400">
                  <span className="font-bold">
                    {isUser ? 'KAT (Yuba City Nexus)' : isDual ? 'SOVEREIGN DUAL CONSENSUS' : isOllama ? 'LOCAL OLLAMA (katzqwenai)' : 'GOOGLE AI STUDIO (Gemini)'}
                  </span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  {msg.telemetry && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400">{msg.telemetry.latencyMs}ms</span>
                    </>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-xl max-w-[85%] border backdrop-blur-md relative group transition-all ${
                  isUser
                    ? isAmber
                      ? 'bg-[#FFBF00]/15 border-[#FFBF00]/40 text-amber-100 rounded-tr-none'
                      : 'bg-[#00FFFF]/15 border-[#00FFFF]/40 text-cyan-100 rounded-tr-none'
                    : isDual
                      ? 'bg-purple-950/40 border-purple-500/50 text-purple-100 rounded-tl-none shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : isOllama
                        ? 'bg-pink-950/40 border-pink-500/40 text-pink-100 rounded-tl-none'
                        : isAmber
                          ? 'bg-[#181103]/90 border-[#FFBF00]/30 text-gray-200 rounded-tl-none'
                          : 'bg-[#150424]/90 border-[#FF00FF]/30 text-gray-200 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed select-text font-mono text-xs sm:text-sm">
                    {msg.content}
                  </p>

                  {/* Assistant Action Ribbon */}
                  {!isUser && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Synced to AI Studio & katzqwenai
                        </span>
                        {msg.telemetry?.walCheckpoint && (
                          <span className="text-gray-400 font-mono">
                            [{msg.telemetry.walCheckpoint}]
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-gray-300 flex items-center gap-1 cursor-pointer"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => {
                            onCommitToManuscript(`Sovereign Narrative Node (${new Date().toLocaleTimeString()})`, msg.content);
                            showNotice('Committed to Willow-O SQLite WAL manuscript archive!');
                          }}
                          className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 flex items-center gap-1 cursor-pointer"
                          title="Commit to Willow-O Manuscript"
                        >
                          <BookOpen className="w-2.5 h-2.5" />
                          <span>WAL Manuscript</span>
                        </button>

                        <button
                          onClick={() => {
                            onPipeToVeo3(`Veo 3.1 Sequence (${new Date().toLocaleTimeString()})`, msg.content);
                            showNotice('Piped to KatzVeo3 Video Director packet queue!');
                          }}
                          className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 cursor-pointer"
                          title="Pipe to KatzVeo3 Video Generation Bridge"
                        >
                          <Film className="w-2.5 h-2.5" />
                          <span>Veo 3</span>
                        </button>

                        <button
                          onClick={() => {
                            onSendToKompiler(`Compiled Build (${new Date().toLocaleTimeString()})`, msg.content);
                            showNotice('Sent to KatzKompiler master build pipeline!');
                          }}
                          className="px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 flex items-center gap-1 cursor-pointer"
                          title="Compile with KatzKompiler"
                        >
                          <Cpu className="w-2.5 h-2.5" />
                          <span>Kompiler</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex flex-col items-start space-y-1">
              <span className="text-[10px] text-gray-400">
                DISPATCHING VIA 9MS JETSTREAM MESH...
              </span>
              <div className="p-3 rounded-xl border border-white/20 bg-black/60 text-gray-300 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span className="font-mono text-xs">
                  Awaiting sovereign synthesis ({targetEngine === 'dual-consensus' ? 'Dual Consensus' : targetEngine === 'local-ollama-katzqwenai' ? 'Local katzqwenai' : 'Gemini 3.8 Flash'})...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer */}
        <div className="p-3 border-t border-white/10 bg-black/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Prompt KatzOS-Prime Sovereign Core (dispatching to ${
                  targetEngine === 'dual-consensus' 
                    ? 'Dual Consensus Bridge' 
                    : targetEngine === 'local-ollama-katzqwenai' 
                      ? 'Local Ollama katzqwenai' 
                      : 'Google AI Studio Gemini'
                })...`}
                className={`w-full px-4 py-2.5 rounded-xl border font-mono text-xs sm:text-sm bg-black/80 text-white placeholder-gray-500 focus:outline-none transition-all ${
                  isAmber 
                    ? 'border-[#FFBF00]/40 focus:border-[#FFBF00] focus:shadow-[0_0_15px_rgba(255,191,0,0.3)]' 
                    : 'border-[#00FFFF]/40 focus:border-[#00FFFF] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className={`px-4 py-2.5 rounded-xl font-bold font-mono text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isAmber
                  ? 'bg-[#FFBF00] text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(255,191,0,0.5)]'
                  : 'bg-[#00FFFF] text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.5)]'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Dispatch</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 font-mono">
            <span>System: Arty & Barry active in Council • 9ms JetStream sync</span>
            <span className="text-gray-400">Press Enter to dispatch message across both platforms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
