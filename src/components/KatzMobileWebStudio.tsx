import React, { useState } from 'react';
import { AestheticMode } from '../types';
import { Smartphone, Monitor, Eye, Play, CheckCircle2, Copy, Check, Terminal, Send, RefreshCw, Layers } from 'lucide-react';

interface KatzMobileWebStudioProps {
  aestheticMode: AestheticMode;
}

export const KatzMobileWebStudio: React.FC<KatzMobileWebStudioProps> = ({ aestheticMode }) => {
  const isAmber = aestheticMode === 'amber-gold';

  const [activePlatform, setActivePlatform] = useState<'mobile' | 'webos' | 'khromium'>('mobile');

  // Mobile Simulator State
  const [mobilePrompt, setMobilePrompt] = useState('');
  const [mobileResponse, setMobileResponse] = useState('TrueXR Mobile Telemetry: Standby for sovereign directives...');
  const [mobileLoading, setMobileLoading] = useState(false);

  // WebOS Simulator State
  const [webosInput, setWebosInput] = useState('');
  const [webosLog, setWebosLog] = useState<string[]>([
    '[KatzWebOS v1.0] Initialized session with Google AI Studio API bridge.',
    '[PrimeBus] 9ms mesh connected. Arty and Barry active in Council registry. Ready for commands...'
  ]);

  // Khromium Builder State
  const [khromiumBuilding, setKhromiumBuilding] = useState(false);
  const [khromiumStatus, setKhromiumStatus] = useState<string | null>(null);

  const handleMobileQuery = () => {
    if (!mobilePrompt.trim()) return;
    setMobileLoading(true);
    const query = mobilePrompt;
    setMobilePrompt('');
    setMobileResponse(`Connecting to Google AI Studio via KatzOS PrimeBus 9ms mesh for: "${query}"...`);

    setTimeout(() => {
      setMobileResponse(`[KatzQwenAI // Arty & Barry Active]\nProcessed directive: "${query}"\n-> Amber-Gold Luminescence locked @ 120 BPM.\n-> KaosKollisions 50k particle tensors synced to TrueXR mobile HUD.`);
      setMobileLoading(false);
    }, 900);
  };

  const handleWebosTransmit = () => {
    if (!webosInput.trim()) return;
    const query = webosInput;
    setWebosInput('');
    setWebosLog(prev => [...prev, `> ${query}`]);

    setTimeout(() => {
      setWebosLog(prev => [
        ...prev,
        `[AI Studio Response]: Processed "${query}". Arty visualizer and Barry audio profile updated successfully across PrimeBus mesh.`
      ]);
    }, 600);
  };

  const handleBuildKhromium = async () => {
    setKhromiumBuilding(true);
    try {
      const res = await fetch('/api/katz/khromium/build', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setKhromiumStatus(data.message);
      }
    } catch (err) {
      console.error('Khromium build error:', err);
    } finally {
      setKhromiumBuilding(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[760px] font-mono text-xs">
      {/* Top Switcher Navigation */}
      <div className={`p-3 rounded-xl border backdrop-blur-md flex items-center justify-between ${
        isAmber ? 'bg-[#151004]/80 border-[#FFBF00]/30' : 'bg-[#100318]/80 border-[#FF00FF]/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex bg-black/50 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setActivePlatform('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-all ${
                activePlatform === 'mobile'
                  ? isAmber ? 'bg-[#FFBF00] text-black' : 'bg-[#00FFFF] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>KatzMobile Client</span>
            </button>

            <button
              onClick={() => setActivePlatform('webos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-all ${
                activePlatform === 'webos'
                  ? isAmber ? 'bg-[#FFBF00] text-black' : 'bg-[#00FFFF] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>KatzWebOS Desktop</span>
            </button>

            <button
              onClick={() => setActivePlatform('khromium')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-all ${
                activePlatform === 'khromium'
                  ? isAmber ? 'bg-[#FFBF00] text-black' : 'bg-[#FF00FF] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>KatzKhromium XR</span>
            </button>
          </div>
        </div>

        <span className="text-[10px] text-gray-400 hidden sm:inline-block">
          Cross-Platform Scaffolding Engine • React Native, WebOS & WebXR
        </span>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden">
        {/* 1. KatzMobile Interactive Phone View */}
        {activePlatform === 'mobile' && (
          <div className="h-full flex items-center justify-center p-4">
            {/* Phone Frame */}
            <div className="relative w-[340px] h-[640px] bg-[#050508] border-4 border-gray-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col p-4 border-t-8">
              {/* Notch */}
              <div className="w-28 h-4 bg-gray-800 rounded-b-xl mx-auto -mt-4 mb-2 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
              </div>

              {/* Mobile Header */}
              <div className="text-center pb-2 mb-2 border-b border-[#00ffff]/30">
                <h3 className="text-xs font-bold text-[#00ffff] tracking-wider">
                  KATZMOBILE // SOVEREIGN HUD
                </h3>
                <span className="text-[9px] text-[#ffbf00]">
                  Arty Style Theme • Barry 120 BPM Audio
                </span>
              </div>

              {/* Terminal Viewport */}
              <div className="flex-1 bg-black/60 border border-[#00ffff]/40 rounded-xl p-3 mb-3 overflow-y-auto">
                <p className="text-[11px] text-[#ffbf00] leading-relaxed whitespace-pre-wrap">
                  {mobileResponse}
                </p>
                {mobileLoading && (
                  <div className="text-[10px] text-cyan-300 mt-2 flex items-center gap-1">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    Connecting to Google AI Studio...
                  </div>
                )}
              </div>

              {/* Mobile Input & Button */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter sovereign directive..."
                  value={mobilePrompt}
                  onChange={(e) => setMobilePrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMobileQuery()}
                  className="w-full bg-black/80 border border-[#ffbf00]/50 rounded-lg p-2.5 text-xs text-white placeholder-cyan-500/50 focus:outline-none"
                />

                <button
                  onClick={handleMobileQuery}
                  disabled={mobileLoading || !mobilePrompt.trim()}
                  className="w-full bg-[#00ffff] hover:bg-cyan-300 text-[#050508] font-bold text-xs py-2.5 rounded-lg cursor-pointer transition-all shadow-[0_0_12px_rgba(0,255,255,0.4)] disabled:opacity-40"
                >
                  DISPATCH TO GEMINI AI STUDIO
                </button>
              </div>

              {/* Home indicator bar */}
              <div className="w-28 h-1 bg-white/20 rounded-full mx-auto mt-3" />
            </div>
          </div>
        )}

        {/* 2. KatzWebOS Interactive Desktop Environment */}
        {activePlatform === 'webos' && (
          <div className="h-full rounded-xl border border-[#00ffff]/40 bg-[#050508] flex flex-col overflow-hidden shadow-2xl font-mono text-xs">
            {/* WebOS Window Header */}
            <header className="bg-[rgba(0,20,30,0.8)] border-b border-[#00ffff] px-4 py-2 flex justify-between items-center text-xs">
              <span className="font-bold text-[#00ffff]">
                [KATZWEBOS v1.0 // SOVEREIGN BROWSER ENVIRONMENT]
              </span>
              <span className="text-[#ffbf00] text-[11px]">
                STATUS: ARTY & BARRY SYNCED | PRIMEBUS 9ms MESH LOCKED
              </span>
            </header>

            {/* Desktop Layout */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 p-4 gap-4 overflow-hidden">
              {/* Council Manifest Window */}
              <div className="border border-[rgba(0,255,255,0.4)] bg-[rgba(5,5,10,0.7)] rounded-lg p-3.5 flex flex-col">
                <h3 className="text-xs text-[#ffbf00] border-b border-[#ffbf00]/30 pb-2 mb-2 font-bold">
                  [COUNCIL MANIFEST]
                </h3>
                <div className="flex-1 bg-black/50 border border-[#00ffff]/20 p-3 rounded text-[11px] text-[#00ffcc] leading-relaxed space-y-1.5 overflow-y-auto">
                  <div>• <strong>Adam-O:</strong> Systems Core (NATS 9ms)</div>
                  <div>• <strong>Willow-O:</strong> SQLite WAL Manuscript</div>
                  <div>• <strong>Valerie:</strong> 300x Micro-Audit Grid</div>
                  <div>• <strong>Arty:</strong> TrueXR WebGL Shaders</div>
                  <div>• <strong>Barry:</strong> 120 BPM Baritone Anchor</div>
                </div>
              </div>

              {/* KatzQwenAI Cloud Terminal Window */}
              <div className="md:col-span-2 border border-[rgba(0,255,255,0.4)] bg-[rgba(5,5,10,0.7)] rounded-lg p-3.5 flex flex-col">
                <h3 className="text-xs text-[#ffbf00] border-b border-[#ffbf00]/30 pb-2 mb-2 font-bold">
                  [KATZQWENAI CLOUD TERMINAL // GOOGLE AI STUDIO BRIDGE]
                </h3>

                <div className="flex-1 bg-black/50 border border-[#00ffff]/20 p-3 rounded text-[11px] text-[#00ffcc] overflow-y-auto space-y-2 mb-3">
                  {webosLog.map((log, idx) => (
                    <div key={idx} className={log.startsWith('>') ? 'text-white font-bold' : log.includes('[AI Studio') ? 'text-[#ffbf00]' : 'text-[#00ffcc]'}>
                      {log}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter directive for KatzQwenAI..."
                    value={webosInput}
                    onChange={(e) => setWebosInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleWebosTransmit()}
                    className="flex-1 bg-black border border-[#00ffff] text-white p-2 rounded text-xs focus:outline-none font-mono"
                  />
                  <button
                    onClick={handleWebosTransmit}
                    className="bg-[#00ffff] text-black font-bold px-4 py-2 rounded text-xs cursor-pointer hover:bg-cyan-300"
                  >
                    TRANSMIT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. KatzKhromiumTrueXR WebXR Pass-Through Controller */}
        {activePlatform === 'khromium' && (
          <div className="h-full rounded-xl border border-pink-500/40 bg-[#080210] p-6 flex flex-col justify-between overflow-y-auto font-mono text-xs">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-pink-400" />
                  <h3 className="font-cyber font-bold text-white text-base">
                    KATZKHROMIUMTRUEXR // WEBXR PASS-THROUGH LAUNCHER
                  </h3>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Meta Quest 3 512GB Standalone
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">
                Configures hardware-accelerated pass-through and WebXR device APIs with AI Studio token injection flags, allowing your Meta Quest 3 standalone headset to run KatzWebOS and TrueXR glass HUD natively.
              </p>

              {/* Flags list */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2 mb-4">
                <span className="text-amber-400 font-bold block text-[11px] mb-2 uppercase">
                  Hardware-Accelerated Chromium XR Flags:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-cyan-300">
                  <div className="p-2 bg-black/40 rounded border border-white/10">--enable-webxr</div>
                  <div className="p-2 bg-black/40 rounded border border-white/10">--enable-xr-runtime</div>
                  <div className="p-2 bg-black/40 rounded border border-white/10">--enable-unsafe-webgpu</div>
                  <div className="p-2 bg-black/40 rounded border border-white/10">--enable-features=WebXR,WebXRARModule</div>
                  <div className="p-2 bg-black/40 rounded border border-white/10">--disable-background-timer-throttling</div>
                  <div className="p-2 bg-black/40 rounded border border-white/10">Target: http://localhost:8081/index.html</div>
                </div>
              </div>

              {khromiumStatus && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{khromiumStatus}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-gray-400 text-[11px]">
                Script output: <code className="text-pink-300">~/KatzOS/KatzKhromium/run_truexr_browser.py</code>
              </span>

              <button
                onClick={handleBuildKhromium}
                disabled={khromiumBuilding}
                className="px-5 py-2.5 rounded-lg bg-[#FF00FF] hover:bg-pink-400 text-white font-bold cursor-pointer transition-all shadow-[0_0_15px_rgba(255,0,255,0.4)] flex items-center gap-2"
              >
                {khromiumBuilding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{khromiumBuilding ? 'Building Khromium Shell...' : 'Compile KatzKhromium Launcher'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
