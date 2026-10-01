import React from 'react';
import { 
  Sparkles, 
  Activity, 
  Terminal, 
  BookOpen, 
  Video, 
  Cpu, 
  Users, 
  Microscope, 
  Music, 
  Download, 
  Play, 
  Square,
  Zap,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { AestheticMode, TelemetryData } from '../types';

interface SovereignHeaderProps {
  aestheticMode: AestheticMode;
  onToggleAesthetic: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  telemetry: TelemetryData | null;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
}

export const SovereignHeader: React.FC<SovereignHeaderProps> = ({
  aestheticMode,
  onToggleAesthetic,
  activeTab,
  onSelectTab,
  telemetry,
  isPlayingAudio,
  onToggleAudio,
}) => {
  const isAmber = aestheticMode === 'amber-gold';

  const navItems = [
    { id: 'cockpit', label: 'TrueXR Cockpit', icon: Layers, badge: '90 FPS' },
    { id: 'chat', label: 'Bi-Directional Bridge', icon: Terminal, badge: 'Gemini ⇋ Ollama' },
    { id: 'adamwillow', label: 'Adam & Willow Bridge', icon: ArrowRightLeft, badge: 'App 4450cbf8' },
    { id: 'council', label: 'Council of Five', icon: Users, badge: 'Arty & Barry' },
    { id: 'veo3', label: 'KatzVeo3 Studio', icon: Video, badge: 'Veo 3.1' },
    { id: 'kompiler', label: 'KatzKompiler', icon: Cpu, badge: 'v1.0.0-PRIME' },
    { id: 'mobileweb', label: 'KatzMobile & WebOS', icon: Zap, badge: 'WebXR' },
    { id: 'primebackend', label: 'PrimeBackend', icon: Activity, badge: 'Render' },
    { id: 'manuscript', label: 'Willow-O Manuscript', icon: BookOpen, badge: 'WAL Mode' },
    { id: 'optical', label: '300x Optical Audit', icon: Microscope, badge: 'Valerie' },
    { id: 'audio', label: 'KatzTunez DSP', icon: Music, badge: 'Lyria & DSP' },
    { id: 'tools', label: 'WSL2 Porting & Git', icon: Download, badge: 'KatzKode89' },
  ];

  return (
    <header className={`w-full border-b backdrop-blur-md transition-colors duration-500 sticky top-0 z-50 ${
      isAmber 
        ? 'bg-[#0c0903]/90 border-[#FFBF00]/30 shadow-[0_4px_25px_rgba(255,191,0,0.12)]' 
        : 'bg-[#090311]/90 border-[#FF00FF]/30 shadow-[0_4px_25px_rgba(0,255,255,0.12)]'
    }`}>
      {/* Top Telemetry Ticker Ribbon */}
      <div className={`px-4 py-1 text-xs border-b flex items-center justify-between font-mono ${
        isAmber 
          ? 'bg-[#1a1303]/60 border-[#FFBF00]/20 text-[#FFBF00]' 
          : 'bg-[#180424]/60 border-[#FF00FF]/20 text-[#00FFFF]'
      }`}>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-bold tracking-wider">
            <span className={`w-2 h-2 rounded-full animate-ping ${isAmber ? 'bg-[#FFBF00]' : 'bg-[#00FFFF]'}`}></span>
            NATS PRIMEBUS: <span className="font-semibold">{telemetry?.primeBus.meshLatencyMs || '9.04'}ms</span> JETSTREAM MESH
          </span>
          <span className="hidden sm:inline-block opacity-40">|</span>
          <span className="hidden md:inline-flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            WILLOW-O WAL: <span className="font-semibold">{telemetry?.willowO.lastCommittedWal || 'wal_pg_0x91F5B0'}</span>
          </span>
          <span className="hidden lg:inline-block opacity-40">|</span>
          <span className="hidden lg:inline-flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            KAOSKOLLISIONS: <span className="font-semibold">50,000 PARTICLE DEPTH VECTORS</span>
          </span>
          <span className="hidden xl:inline-block opacity-40">|</span>
          <span className="hidden xl:inline-flex items-center gap-1">
            NEXUS: <span className="text-white/80">Yuba City, CA (Kat / April Rose / Mystivia / Nyptix)</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded bg-black/40 border border-current">
            <span>VR: Quest 3 512GB</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>

          {/* Audio Engine Button */}
          <button
            onClick={onToggleAudio}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
              isPlayingAudio
                ? isAmber 
                  ? 'bg-[#FFBF00] text-black shadow-[0_0_10px_rgba(255,191,0,0.8)]' 
                  : 'bg-[#FF00FF] text-white shadow-[0_0_10px_rgba(255,0,255,0.8)]'
                : 'bg-black/40 text-gray-300 hover:text-white border border-gray-700'
            }`}
            title="Toggle KatzTunez DSP WebAudio playback"
          >
            {isPlayingAudio ? <Square className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current" />}
            <span>DSP {isPlayingAudio ? (isAmber ? '120 BPM' : '135 BPM') : 'OFF'}</span>
          </button>

          {/* Aesthetic Toggle */}
          <button
            onClick={onToggleAesthetic}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
              isAmber
                ? 'bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/50 hover:bg-[#FFBF00]/30'
                : 'bg-[#FF00FF]/20 text-[#FF00FF] border border-[#FF00FF]/50 hover:bg-[#FF00FF]/30'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{isAmber ? 'Soft Collapse (120 BPM #FFBF00)' : 'Neon Fracture (135 BPM High Chaos)'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-3 shrink-0">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-lg border transition-all ${
            isAmber
              ? 'bg-[#FFBF00]/20 border-[#FFBF00] text-[#FFBF00] shadow-[0_0_15px_rgba(255,191,0,0.4)]'
              : 'bg-[#00FFFF]/20 border-[#00FFFF] text-[#00FFFF] shadow-[0_0_15px_rgba(0,255,255,0.4)]'
          }`}>
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cyber font-bold tracking-wider text-base text-white">
                KATZ<span className={isAmber ? 'text-[#FFBF00]' : 'text-[#00FFFF]'}>GOOGLE</span>AI<span className={isAmber ? 'text-[#FFBF00]' : 'text-[#FF00FF]'}>STUDIO</span>
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight uppercase ${
                isAmber ? 'bg-[#FFBF00]/20 text-[#FFBF00]' : 'bg-[#FF00FF]/20 text-[#FF00FF]'
              }`}>
                Prime v1.0.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono leading-tight">
              Sovereign Lenovo WSL2 & TrueXR Glass Cockpit Bridge
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? isAmber
                      ? 'bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/60 shadow-[0_0_12px_rgba(255,191,0,0.25)]'
                      : 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/60 shadow-[0_0_12px_rgba(0,255,255,0.25)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    isActive
                      ? isAmber ? 'bg-[#FFBF00]/30 text-amber-200' : 'bg-[#00FFFF]/30 text-cyan-200'
                      : 'bg-white/5 text-gray-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
