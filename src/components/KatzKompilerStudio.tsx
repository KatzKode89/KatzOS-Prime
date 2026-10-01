import React, { useState, useEffect } from 'react';
import { AestheticMode, KatzKompilerBuild } from '../types';
import { 
  Cpu, 
  Play, 
  Layers, 
  CheckCircle2, 
  Film, 
  Copy, 
  Check, 
  RefreshCw, 
  Zap,
  Activity,
  ArrowRight
} from 'lucide-react';

interface KatzKompilerStudioProps {
  aestheticMode: AestheticMode;
  onNavigateToTab?: (tab: string) => void;
}

export const KatzKompilerStudio: React.FC<KatzKompilerStudioProps> = ({
  aestheticMode,
  onNavigateToTab
}) => {
  const isAmber = aestheticMode === 'amber-gold';

  const [builds, setBuilds] = useState<KatzKompilerBuild[]>([]);
  const [selectedBuild, setSelectedBuild] = useState<KatzKompilerBuild | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nodeTitle, setNodeTitle] = useState('The Amber Luminescence of Yuba City (Chapter 1)');
  const [proseOverride, setProseOverride] = useState('');
  const [pipingToVeo3, setPipingToVeo3] = useState(false);

  const fetchBuilds = async () => {
    try {
      const res = await fetch('/api/katz/kompiler/builds');
      if (res.ok) {
        const data = await res.json();
        setBuilds(data.builds || []);
        if (data.builds?.length > 0 && !selectedBuild) {
          setSelectedBuild(data.builds[0]);
        }
      }
    } catch (err) {
      console.error('Fetch builds error:', err);
    }
  };

  useEffect(() => {
    fetchBuilds();
  }, []);

  const handleRunCompilation = async () => {
    setIsCompiling(true);
    try {
      const res = await fetch('/api/katz/kompiler/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeTitle,
          proseOverride: proseOverride || undefined,
          aestheticOverride: isAmber ? 'Soft Collapse / Amber-Gold Luminescence' : 'Neon Fracture / High Chaos'
        })
      });
      if (res.ok) {
        const data = await res.json();
        fetchBuilds();
        setSelectedBuild(data.build);
      }
    } catch (err) {
      console.error('Kompiler run error:', err);
    } finally {
      setIsCompiling(false);
    }
  };

  const handlePipeToVeo3 = async (buildId: string) => {
    setPipingToVeo3(true);
    try {
      const res = await fetch('/api/katz/kompiler/pipe-to-veo3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId })
      });
      if (res.ok) {
        fetchBuilds();
        if (onNavigateToTab) {
          onNavigateToTab('veo3');
        }
      }
    } catch (err) {
      console.error('Pipe to Veo3 error:', err);
    } finally {
      setPipingToVeo3(false);
    }
  };

  const copyManifest = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[760px] font-mono text-xs">
      {/* Left Column: Build List & Master Compiler Control */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-full">
        {/* Compilation Launcher Card */}
        <div className={`p-4 rounded-xl border backdrop-blur-md ${
          isAmber ? 'bg-[#151004]/80 border-[#FFBF00]/30' : 'bg-[#12031c]/80 border-[#FF00FF]/30'
        }`}>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-current/20">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              KatzKompiler v1.0.0-PRIME
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
              Universal Pipeline
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div>
              <label className="text-gray-400 block mb-1">Target Narrative Node:</label>
              <input
                type="text"
                value={nodeTitle}
                onChange={(e) => setNodeTitle(e.target.value)}
                placeholder="Narrative node identifier..."
                className="w-full bg-black/60 border border-white/20 rounded px-2.5 py-1.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Custom Prose Directive (optional):</label>
              <textarea
                value={proseOverride}
                onChange={(e) => setProseOverride(e.target.value)}
                placeholder="Leave blank to pull directly from Willow-O SQLite WAL..."
                rows={2}
                className="w-full bg-black/60 border border-white/20 rounded px-2.5 py-1.5 text-white focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleRunCompilation}
              disabled={isCompiling}
              className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isAmber
                  ? 'bg-[#FFBF00] text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(255,191,0,0.4)]'
                  : 'bg-[#FF00FF] text-white hover:bg-pink-400 shadow-[0_0_15px_rgba(255,0,255,0.4)]'
              }`}
            >
              {isCompiling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isCompiling ? 'Compiling Universal Stack...' : 'Run Master Compilation'}</span>
            </button>
          </div>
        </div>

        {/* Compiled Manifests List */}
        <div className={`p-4 rounded-xl border backdrop-blur-md flex-1 flex flex-col overflow-hidden ${
          isAmber ? 'bg-[#100b03]/80 border-[#FFBF00]/30' : 'bg-[#0c0216]/80 border-[#FF00FF]/30'
        }`}>
          <span className="font-bold uppercase tracking-wider block mb-2 text-gray-300 pb-1 border-b border-white/10">
            Compiled Manifests ({builds.length})
          </span>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {builds.map((build) => {
              const isSelected = selectedBuild?.id === build.id;
              return (
                <div
                  key={build.id}
                  onClick={() => setSelectedBuild(build)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? isAmber
                        ? 'bg-[#FFBF00]/20 border-[#FFBF00] text-amber-200 shadow-[0_0_10px_rgba(255,191,0,0.2)]'
                        : 'bg-[#FF00FF]/20 border-[#FF00FF] text-pink-200 shadow-[0_0_10px_rgba(255,0,255,0.2)]'
                      : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1 font-bold">
                    <span>{build.manifestFile}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                      {build.harmonic_spine.bpm} BPM
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-white/90 truncate">{build.target_node}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-1">{build.particle_telemetry.status}</p>

                  {build.linkedToVeo3 && (
                    <div className="flex items-center gap-1 text-[9px] text-cyan-400 mt-2 font-bold">
                      <Film className="w-2.5 h-2.5" />
                      <span>Linked to KatzVeo3 Video Engine</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Build Manifest & Pipeline Inspector */}
      <div className={`lg:col-span-2 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden ${
        isAmber ? 'bg-[#0d0903]/85 border-[#FFBF00]/30' : 'bg-[#080210]/85 border-[#FF00FF]/30'
      }`}>
        {/* Header */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-white tracking-wide">
              UNIVERSAL BUILD MANIFEST INSPECTOR
            </span>
            {selectedBuild && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-amber-300">
                {selectedBuild.manifestFile}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedBuild && (
              <button
                onClick={() => copyManifest(JSON.stringify(selectedBuild, null, 2))}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-200 flex items-center gap-1 text-[11px] cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            )}

            {selectedBuild && (
              <button
                onClick={() => handlePipeToVeo3(selectedBuild.id)}
                disabled={pipingToVeo3}
                className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
              >
                <Film className="w-3 h-3" />
                <span>Pipe to KatzVeo3 →</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {/* Quick Metrics Summary */}
          {selectedBuild && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-black/50 border border-white/10">
                <span className="text-gray-400 block text-[10px]">HARMONIC SPINE</span>
                <span className="text-amber-300 font-bold text-sm">{selectedBuild.harmonic_spine.bpm} BPM</span>
                <p className="text-[10px] text-gray-400 mt-0.5">{selectedBuild.harmonic_spine.protocol}</p>
              </div>

              <div className="p-3 rounded-lg bg-black/50 border border-white/10">
                <span className="text-gray-400 block text-[10px]">CONTROLNET DEPTH</span>
                <span className="text-cyan-300 font-bold text-sm">50,000 Particle Tensors</span>
                <p className="text-[10px] text-gray-400 mt-0.5">Bound from latest_xyz.npy</p>
              </div>

              <div className="p-3 rounded-lg bg-black/50 border border-white/10">
                <span className="text-gray-400 block text-[10px]">TRUEXR RENDERING</span>
                <span className="text-emerald-300 font-bold text-sm">90 FPS Locked</span>
                <p className="text-[10px] text-gray-400 mt-0.5">Motion scale: {selectedBuild.truexr_rendering_parameters.motion_scale}</p>
              </div>
            </div>
          )}

          {/* Raw JSON Manifest View */}
          <div className="p-4 rounded-xl bg-black/90 border border-white/10">
            <span className="text-gray-400 block text-[10px] mb-2 font-bold uppercase tracking-wider">
              Output File: {selectedBuild?.outputPath || '~/KatzOS/renders/compiled_builds/build_manifest.json'}
            </span>
            <pre className="text-purple-300 leading-relaxed overflow-x-auto whitespace-pre-wrap text-[11px]">
              {selectedBuild ? JSON.stringify(selectedBuild, null, 2) : 'No build manifest selected.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
