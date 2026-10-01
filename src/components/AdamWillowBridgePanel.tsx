import React, { useState, useEffect } from 'react';
import { AestheticMode } from '../types';
import { 
  Shield, 
  BookOpen, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Activity, 
  Database, 
  ArrowRightLeft,
  Sparkles,
  Zap
} from 'lucide-react';

interface AdamWillowBridgePanelProps {
  aestheticMode: AestheticMode;
  onNavigateToTab?: (tab: string) => void;
}

export const AdamWillowBridgePanel: React.FC<AdamWillowBridgePanelProps> = ({
  aestheticMode,
  onNavigateToTab
}) => {
  const isAmber = aestheticMode === 'amber-gold';
  const appId = "4450cbf8-0512-43d4-b9f7-b3da98af5aac";
  const appEndpoint = `https://ai.studio/apps/${appId}`;

  const [bridgeStatus, setBridgeStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cloudDirective, setCloudDirective] = useState('');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchBridgeStatus = async () => {
    try {
      const res = await fetch('/api/katz/bridge/adam-willow/status');
      if (res.ok) {
        const data = await res.json();
        setBridgeStatus(data);
      }
    } catch (err) {
      console.warn('Bridge status fetch error:', err);
    }
  };

  useEffect(() => {
    fetchBridgeStatus();
    const interval = setInterval(fetchBridgeStatus, 6000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Simulate Push from Lenovo WSL2 local SQLite WAL into Cloud AI Studio App
  const handleSimulateLocalPush = async () => {
    setLoading(true);
    try {
      const packet = {
        source: "KatzOS-Prime Lenovo WSL2 Node",
        timestamp: new Date().toISOString(),
        app_target: appEndpoint,
        council_status: {
          adam_o: "ONLINE - NATS 9ms Mesh Locked",
          willow_o: "ONLINE - SQLite WAL Synced",
          arty: "ONLINE - TrueXR WebGL Shaders Active",
          barry: "ONLINE - 120 BPM April Rose Protocol"
        },
        active_manuscript_node: isAmber ? "The Amber Luminescence of Yuba City" : "Neon Fracture Transient Rips",
        aesthetic_state: isAmber ? "Soft Collapse / Amber-Gold Luminescence (#FFBF00)" : "Neon Fracture / High Chaos (#00FFFF)",
        prose_snippet: isAmber
          ? "Under the amber canopy of Yuba City, Adam-O verified the 9.04ms JetStream spine as Willow-O committed wal_pg_0x91F5B0."
          : "Transient spikes rupture the 9ms JetStream boundary; containment stress verified by Adam-O and logged to WAL."
      };

      const res = await fetch('/api/katz/bridge/adam-willow/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packet)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`[Adam & Willow Bridge] State packet synchronized from WSL2 to Cloud App ${appId}!`);
        fetchBridgeStatus();
      }
    } catch (err) {
      console.error('Simulate push error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dispatch cloud directive back down into WSL2 SQLite WAL
  const handleDispatchCloudDirective = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cloudDirective.trim()) return;

    setLoading(true);
    const directive = cloudDirective.trim();
    setCloudDirective('');

    try {
      const res = await fetch('/api/katz/bridge/adam-willow/dispatch-directive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directive,
          author: "Kat (Yuba City Sovereign Core)"
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Directive transmitted down to Lenovo WSL2 SQLite WAL archive!`);
        fetchBridgeStatus();
      }
    } catch (err) {
      console.error('Dispatch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyScriptExecutionCommand = () => {
    const cmd = `python3 ~/KatzOS/tools/adam_willow_ai_studio_bridge.py`;
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 h-[760px] font-mono text-xs overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-2.5 rounded-lg bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 flex items-center justify-between text-xs animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">APP: {appId}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-4 backdrop-blur-md ${
        isAmber ? 'bg-[#151004]/80 border-[#FFBF00]/30' : 'bg-[#100318]/80 border-[#FF00FF]/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg">
            <ArrowRightLeft className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white tracking-wider">
                ADAM-O & WILLOW-O CLOUD AI STUDIO BRIDGE
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                ACTIVE BI-DIRECTIONAL HARNESS
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Target App ID: <span className="text-cyan-300 font-bold">{appId}</span> • Syncs Lenovo WSL2 SQLite WAL with Cloud AI Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateLocalPush}
            disabled={loading}
            className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
              isAmber 
                ? 'bg-[#FFBF00] text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(255,191,0,0.4)]' 
                : 'bg-[#00FFFF] text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.4)]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Push Local State Packet</span>
          </button>

          <button
            onClick={copyScriptExecutionCommand}
            className="px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-gray-300 hover:text-white flex items-center gap-1.5 cursor-pointer text-[11px]"
            title="Copy WSL2 execution command"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy WSL2 CMD'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">
        {/* Left Column: Council Agents & Active Sync Packet (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full overflow-y-auto pr-1">
          {/* Agent Dual Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Adam-O Card */}
            <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-[#001424]/60 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  Adam-O
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200 font-bold">
                  9ms MESH
                </span>
              </div>
              <p className="text-[10px] text-gray-300 mb-2 leading-relaxed">
                Systems architecture, NATS PrimeBus mesh verification, WSL2 daemon telemetry, and hardening.
              </p>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Status: ONLINE (Mesh Locked)</span>
              </div>
            </div>

            {/* Willow-O Card */}
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-[#1e1402]/60 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Willow-O
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 font-bold">
                  SQLite WAL
                </span>
              </div>
              <p className="text-[10px] text-gray-300 mb-2 leading-relaxed">
                Narrative manuscript engine, SQLite living archive, WAL checkpoints, and prose ingestion.
              </p>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Status: ONLINE (WAL Synced)</span>
              </div>
            </div>
          </div>

          {/* Active Synced Packet Inspector */}
          <div className={`p-4 rounded-xl border backdrop-blur-md flex-1 flex flex-col overflow-hidden ${
            isAmber ? 'bg-[#0e0903]/80 border-[#FFBF00]/30' : 'bg-[#090212]/80 border-[#FF00FF]/30'
          }`}>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <span className="font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Active Bridge Packet (Latest Sync)
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {bridgeStatus?.latestPacket?.timestamp || 'Ready'}
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
              <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px]">
                <div className="text-gray-400 text-[10px] mb-0.5">SOURCE NODE:</div>
                <div className="text-white font-bold">{bridgeStatus?.latestPacket?.source || 'KatzOS-Prime Lenovo WSL2 Node'}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px]">
                <div className="text-gray-400 text-[10px] mb-0.5">ACTIVE MANUSCRIPT NODE:</div>
                <div className="text-amber-300 font-bold">{bridgeStatus?.latestPacket?.active_manuscript_node || 'The Amber Luminescence of Yuba City'}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px]">
                <div className="text-gray-400 text-[10px] mb-0.5">AESTHETIC STATE:</div>
                <div className="text-cyan-300 font-semibold">{bridgeStatus?.latestPacket?.aesthetic_state || 'Soft Collapse / Amber-Gold Luminescence'}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px]">
                <div className="text-gray-400 text-[10px] mb-0.5">PROSE SNIPPET (WILLOW-O):</div>
                <p className="text-gray-200 text-[10px] leading-relaxed italic bg-black/40 p-2 rounded border border-white/5">
                  "{bridgeStatus?.latestPacket?.prose_snippet || 'Under the amber canopy of Yuba City, the PrimeBus mesh stabilized at precisely 9.04ms.'}"
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono">
                <div className="text-gray-400 mb-1">COUNCIL MESH BINDINGS:</div>
                <div className="grid grid-cols-2 gap-1 text-[9px] text-gray-300">
                  <div>Adam-O: <span className="text-emerald-400 font-bold">9ms Locked</span></div>
                  <div>Willow-O: <span className="text-emerald-400 font-bold">WAL Synced</span></div>
                  <div>Arty: <span className="text-emerald-400 font-bold">WebGL Active</span></div>
                  <div>Barry: <span className="text-emerald-400 font-bold">120 BPM</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bi-Directional Transmit & SQLite ai_studio_sync_log (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 h-full overflow-hidden">
          {/* Cloud -> WSL2 Directive Dispatch Box */}
          <div className={`p-4 rounded-xl border backdrop-blur-md ${
            isAmber ? 'bg-[#151004]/80 border-[#FFBF00]/30' : 'bg-[#100318]/80 border-[#FF00FF]/30'
          }`}>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-4 h-4 text-cyan-400" />
                Transmit Cloud Directive to Local WSL2 SQLite WAL
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                Cloud ➔ WSL2
              </span>
            </div>

            <form onSubmit={handleDispatchCloudDirective} className="space-y-2">
              <input
                type="text"
                value={cloudDirective}
                onChange={(e) => setCloudDirective(e.target.value)}
                placeholder="e.g. Adam-O run 300x optical audit test; Willow-O checkpoint Chapter 11 living prose..."
                className="w-full bg-black/60 border border-white/20 rounded p-2 text-white text-[11px] focus:outline-none"
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-gray-400">
                  Target: ~/KatzOS/data/katz_telemetry.db (ai_studio_sync_log table)
                </span>
                <button
                  type="submit"
                  disabled={loading || !cloudDirective.trim()}
                  className={`px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isAmber ? 'bg-[#FFBF00] text-black hover:bg-amber-400' : 'bg-[#FF00FF] text-white hover:bg-pink-600'
                  }`}
                >
                  <Send className="w-3 h-3" />
                  <span>Transmit to SQLite WAL</span>
                </button>
              </div>
            </form>
          </div>

          {/* SQLite ai_studio_sync_log Table Viewer */}
          <div className={`p-4 rounded-xl border backdrop-blur-md flex-1 flex flex-col overflow-hidden ${
            isAmber ? 'bg-[#0d0903]/85 border-[#FFBF00]/30' : 'bg-[#080210]/85 border-[#FF00FF]/30'
          }`}>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white tracking-wide">
                  SQLITE ARCHIVE // ai_studio_sync_log
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300">
                  {bridgeStatus?.syncLogs?.length || 1} Entries
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchBridgeStatus}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Refresh Log</span>
                </button>
              </div>
            </div>

            {/* Sync Table */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {(bridgeStatus?.syncLogs || []).map((log: any) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg border border-white/10 bg-black/60 hover:border-white/25 transition-all text-[11px]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono">#{log.id}</span>
                      <span className="font-semibold text-cyan-300">{log.agentSource}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      log.syncStatus.includes('SUCCESS') || log.syncStatus.includes('READY')
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {log.syncStatus}
                    </span>
                  </div>

                  <div className="text-[10px] text-gray-400 font-mono mb-1.5">
                    Timestamp: {log.timestamp}
                  </div>

                  {log.payloadSummary && (
                    <div className="bg-black/80 p-2 rounded border border-white/5 text-[10px] font-mono text-gray-300 overflow-x-auto">
                      {typeof log.payloadSummary === 'string'
                        ? log.payloadSummary
                        : JSON.stringify(log.payloadSummary, null, 2)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Terminal Command Tip */}
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-cyan-400" />
                Query in WSL2: <code className="text-cyan-300">sqlite3 ~/KatzOS/data/katz_telemetry.db "SELECT * FROM ai_studio_sync_log ORDER BY id DESC LIMIT 5;"</code>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
