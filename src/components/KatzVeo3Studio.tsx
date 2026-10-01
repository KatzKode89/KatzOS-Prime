import React, { useState, useEffect } from 'react';
import { AestheticMode, DirectorPacket } from '../types';
import { 
  Film, 
  Play, 
  Sparkles, 
  Sliders, 
  CheckCircle, 
  Clock, 
  FileCode, 
  RefreshCw, 
  Send,
  Layers,
  Zap,
  Volume2
} from 'lucide-react';

interface KatzVeo3StudioProps {
  aestheticMode: AestheticMode;
  onNavigateToTab?: (tab: string) => void;
}

export const KatzVeo3Studio: React.FC<KatzVeo3StudioProps> = ({ aestheticMode, onNavigateToTab }) => {
  const isAmber = aestheticMode === 'amber-gold';

  const [packets, setPackets] = useState<DirectorPacket[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<DirectorPacket | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [batchRendering, setBatchRendering] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'director' | 'preview' | 'spec'>('preview');

  // Form for compiling new director packet
  const [title, setTitle] = useState('');
  const [prose, setProse] = useState('');
  const [grading, setGrading] = useState<'Amber-Gold Luminescence' | 'Neon Fracture / High Chaos' | '300x Optical Valerie Audit'>(
    isAmber ? 'Amber-Gold Luminescence' : 'Neon Fracture / High Chaos'
  );
  const [motionScale, setMotionScale] = useState(0.35);

  const fetchPackets = async () => {
    try {
      const res = await fetch('/api/katz/veo3/packets');
      if (res.ok) {
        const data = await res.json();
        setPackets(data.packets || []);
        if (data.packets?.length > 0 && !selectedPacket) {
          setSelectedPacket(data.packets[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching director packets:', err);
    }
  };

  useEffect(() => {
    fetchPackets();
  }, []);

  const handleGenerateSequence = async (packetId: string) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/katz/veo3/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packetId })
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedPacket(data.packet);
        fetchPackets();
        setActiveTab('spec');
      }
    } catch (err) {
      console.error('Veo3 generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBatchRender = async () => {
    setBatchRendering(true);
    try {
      const res = await fetch('/api/katz/veo3/batch-render', { method: 'POST' });
      if (res.ok) {
        fetchPackets();
      }
    } catch (err) {
      console.error('Batch render error:', err);
    } finally {
      setBatchRendering(false);
    }
  };

  const handleCompileNewPacket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prose.trim()) return;

    try {
      const res = await fetch('/api/katz/veo3/compile-director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          prose,
          grading,
          motion_scale: motionScale,
          audio_directive: grading === 'Neon Fracture / High Chaos' ? '135 BPM Nyptix Industrial Drive' : '120 BPM April Rose Melodic House'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTitle('');
        setProse('');
        fetchPackets();
        setSelectedPacket(data.packet);
      }
    } catch (err) {
      console.error('Compile packet error:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[760px] font-mono">
      {/* Left Column: Director Script Queue & Compiler */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-full">
        {/* Packets List */}
        <div className={`p-4 rounded-xl border backdrop-blur-md flex-1 flex flex-col overflow-hidden ${
          isAmber ? 'bg-[#120d04]/80 border-[#FFBF00]/30' : 'bg-[#100318]/80 border-[#FF00FF]/30'
        }`}>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-current/20">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              Director Scripts (director_*.json)
            </span>
            <button
              onClick={handleBatchRender}
              disabled={batchRendering}
              className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                isAmber
                  ? 'bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/40 hover:bg-[#FFBF00]/30'
                  : 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/40 hover:bg-[#00FFFF]/30'
              }`}
            >
              {batchRendering ? 'Rendering...' : 'Batch Render All'}
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {packets.map((pkt) => {
              const isSelected = selectedPacket?.id === pkt.id;
              const isCompiled = pkt.status === 'COMPILED';
              return (
                <div
                  key={pkt.id}
                  onClick={() => setSelectedPacket(pkt)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? isAmber
                        ? 'bg-[#FFBF00]/20 border-[#FFBF00] text-amber-200 shadow-[0_0_10px_rgba(255,191,0,0.2)]'
                        : 'bg-[#00FFFF]/20 border-[#00FFFF] text-cyan-200 shadow-[0_0_10px_rgba(0,255,255,0.2)]'
                      : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1 font-bold">
                    <span>{pkt.packetFile}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded ${
                      isCompiled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {pkt.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-white/90 truncate">{pkt.title}</p>
                  <p className="text-[10px] opacity-70 truncate mt-1">{pkt.prose_directive}</p>

                  <div className="flex items-center justify-between text-[9px] mt-2 pt-1 border-t border-white/10 opacity-75">
                    <span>{pkt.video_params.grading}</span>
                    <span>{pkt.video_params.target_fps} FPS • {pkt.video_params.resolution}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compile New Director Packet Form */}
        <form
          onSubmit={handleCompileNewPacket}
          className={`p-3.5 rounded-xl border backdrop-blur-md text-xs ${
            isAmber ? 'bg-[#151004]/70 border-[#FFBF00]/30' : 'bg-[#140320]/70 border-[#FF00FF]/30'
          }`}
        >
          <span className="font-bold uppercase tracking-wider block mb-2 text-gray-300">
            Compile New Director Packet
          </span>
          <div className="space-y-2 text-[11px]">
            <input
              type="text"
              placeholder="Sequence Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/60 border border-white/20 rounded px-2 py-1 text-white placeholder-gray-500 focus:outline-none"
            />
            <textarea
              placeholder="Prose Directive (Willow-O narrative text)..."
              value={prose}
              onChange={(e) => setProse(e.target.value)}
              rows={2}
              className="w-full bg-black/60 border border-white/20 rounded px-2 py-1 text-white placeholder-gray-500 focus:outline-none resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={grading}
                onChange={(e) => setGrading(e.target.value as 'Amber-Gold Luminescence' | 'Neon Fracture / High Chaos' | '300x Optical Valerie Audit')}
                className="bg-black/60 border border-white/20 rounded px-1.5 py-1 text-white text-[10px]"
              >
                <option value="Amber-Gold Luminescence">Amber-Gold #FFBF00 (120 BPM)</option>
                <option value="Neon Fracture / High Chaos">Neon Fracture (135 BPM)</option>
                <option value="300x Optical Valerie Audit">300x Optical Audit</option>
              </select>
              <div className="flex items-center gap-1 text-[10px] text-gray-300">
                <span>Motion:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.05"
                  value={motionScale}
                  onChange={(e) => setMotionScale(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>
            </div>
            <button
              type="submit"
              className={`w-full py-1.5 rounded font-bold cursor-pointer transition-all ${
                isAmber
                  ? 'bg-[#FFBF00] text-black hover:bg-amber-400 shadow-[0_0_10px_rgba(255,191,0,0.4)]'
                  : 'bg-[#00FFFF] text-black hover:bg-cyan-300 shadow-[0_0_10px_rgba(0,255,255,0.4)]'
              }`}
            >
              + Compile to Director Script
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Video Studio Preview & Render Specification */}
      <div className={`lg:col-span-2 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden ${
        isAmber ? 'bg-[#0e0903]/85 border-[#FFBF00]/30' : 'bg-[#090212]/85 border-[#FF00FF]/30'
      }`}>
        {/* Studio Tabs Header */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs bg-black/40">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white tracking-wide">
              KATZVEO3 // VEO 3.1 RENDERING PIPELINE
            </span>
            {selectedPacket && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-amber-300">
                {selectedPacket.packetFile}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                activeTab === 'preview'
                  ? isAmber ? 'bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/40' : 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Cinematic Preview
            </button>
            <button
              onClick={() => setActiveTab('spec')}
              className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                activeTab === 'spec'
                  ? isAmber ? 'bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/40' : 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Veo 3.1 Spec JSON
            </button>
          </div>
        </div>

        {/* Studio Content */}
        <div className="flex-1 p-5 overflow-y-auto">
          {activeTab === 'preview' ? (
            <div className="flex flex-col gap-4 h-full">
              {/* Cinematic Viewport */}
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/20 shadow-2xl flex items-center justify-center group">
                {/* Simulated Film Grain & Scanline */}
                <div className="absolute inset-0 crt-scanlines" />

                {/* Simulated Cinematic Camera Motion & Lighting Canvas */}
                <div className={`absolute inset-0 transition-all duration-1000 ${
                  selectedPacket?.video_params.grading === 'Neon Fracture / High Chaos'
                    ? 'bg-gradient-to-tr from-[#FF00FF]/25 via-black to-[#00FFFF]/20'
                    : selectedPacket?.video_params.grading === '300x Optical Valerie Audit'
                      ? 'bg-gradient-to-tr from-emerald-950/40 via-black to-cyan-950/30'
                      : 'bg-gradient-to-tr from-[#FFBF00]/25 via-black to-amber-900/20'
                }`} />

                {/* 3D Horizon Grid Lines */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                {/* Cinematic Letterbox Bars */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-black z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-black z-10" />

                {/* Centered Render Telemetry Card */}
                <div className="relative z-20 text-center max-w-lg p-6 rounded-xl backdrop-blur-md bg-black/60 border border-white/10">
                  <span className={`text-[10px] uppercase font-bold tracking-widest block mb-1 ${
                    isAmber ? 'text-[#FFBF00]' : 'text-[#00FFFF]'
                  }`}>
                    Google Veo 3.1 Pipeline • 90 FPS Sovereign Render
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">
                    {selectedPacket?.title || 'Cyberpunk icosahedral chamber'}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed italic mb-4">
                    "{selectedPacket?.prose_directive}"
                  </p>

                  <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      Motion: {selectedPacket?.video_params.motion_scale}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                      Audio: {selectedPacket?.video_params.audio_directive.substring(0, 20)}...
                    </span>
                  </div>
                </div>

                {/* Watermark */}
                <div className="absolute top-8 right-4 text-[9px] font-mono text-white/50 tracking-wider z-20">
                  KATZVEO3 // VEO-3.1-GENERATE-001
                </div>
              </div>

              {/* Execution Controls */}
              <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Render Status: {selectedPacket?.status === 'COMPILED' ? 'SPEC COMPILED (Ready)' : 'PENDING PIPELINE'}
                  </span>
                  <p className="text-[11px] text-gray-400">
                    Target: {selectedPacket?.targetOutputFile || `~/KatzOS/renders/veo3_output/veo3_render_${selectedPacket?.packetFile.replace('.json', '')}.mp4`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => selectedPacket && handleGenerateSequence(selectedPacket.id)}
                    disabled={isGenerating}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
                      isAmber
                        ? 'bg-[#FFBF00] text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(255,191,0,0.5)]'
                        : 'bg-[#00FFFF] text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.5)]'
                    }`}
                  >
                    {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isGenerating ? 'Compiling Veo 3 Spec...' : 'Execute KatzVeo3 Bridge'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Output File: {selectedPacket?.targetOutputFile || `~/KatzOS/renders/veo3_output/veo3_render_spec.json`}</span>
                <span className="text-emerald-400 font-bold">100% Deterministic Render Spec</span>
              </div>
              <pre className="p-4 rounded-xl bg-black/90 border border-white/10 text-[11px] text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {selectedPacket?.renderSpec || JSON.stringify({
                  model: 'veo-3.1-generate-001',
                  status: 'PENDING_GENERATION',
                  prose_directive: selectedPacket?.prose_directive,
                  parameters: selectedPacket?.video_params
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
