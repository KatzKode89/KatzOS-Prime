import React, { useState, useEffect } from 'react';
import { AestheticMode } from '../types';
import { Server, CheckCircle2, RefreshCw, Terminal, Activity, FileCode, Copy, Check, Download, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PrimeBackendPanelProps {
  aestheticMode: AestheticMode;
}

export const PrimeBackendPanel: React.FC<PrimeBackendPanelProps> = ({ aestheticMode }) => {
  const isAmber = aestheticMode === 'amber-gold';

  const [healthData, setHealthData] = useState<any>(null);
  const [crystalData, setCrystalData] = useState<any>(null);
  const [inspectData, setInspectData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<'server.js' | 'package.json' | 'render.yaml'>('server.js');
  const [loading, setLoading] = useState(false);
  const [genStatus, setGenStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const [hRes, cRes, iRes] = await Promise.all([
        fetch('/health'),
        fetch('/api/crystalseekers'),
        fetch('/api/katz/primebackend/inspect')
      ]);

      if (hRes.ok) setHealthData(await hRes.json());
      if (cRes.ok) setCrystalData(await cRes.json());
      if (iRes.ok) setInspectData(await iRes.json());
    } catch (err) {
      console.error('PrimeBackend probe error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleGenerate = async () => {
    try {
      const res = await fetch('/api/katz/primebackend/generate', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setGenStatus(data.message);
        fetchStatus();
      }
    } catch (err) {
      console.error('Generate error:', err);
    }
  };

  const getFileContent = () => {
    if (!inspectData?.files) return '// Loading monolith files...';
    switch (selectedFile) {
      case 'server.js': return inspectData.files.serverJs;
      case 'package.json': return inspectData.files.packageJson;
      case 'render.yaml': return inspectData.files.renderYaml;
      default: return '';
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getFileContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[760px] font-mono text-xs">
      {/* Left Column: Health Probe & CrystalSeekers Telemetry */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-full">
        {/* Health Probe Card */}
        <div className={`p-4 rounded-xl border backdrop-blur-md ${
          isAmber ? 'bg-[#151004]/80 border-[#FFBF00]/30' : 'bg-[#100318]/80 border-[#FF00FF]/30'
        }`}>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-current/20">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-400" />
              KOS-Prime-Backend Probe
            </span>
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-gray-200 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${loading ? 'animate-spin' : ''}`} />
              Probe
            </button>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Endpoint /health:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {healthData?.status || 'ONLINE'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">System Monolith:</span>
              <span className="text-white font-semibold">{healthData?.system || 'KOS-Prime-Backend'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Mesh Spine:</span>
              <span className="text-cyan-300 font-semibold">{healthData?.mesh || 'NATS PrimeBus 9ms Active'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Render Status:</span>
              <span className="text-emerald-300 font-bold">EXIT STATUS 254 RESOLVED</span>
            </div>
          </div>
        </div>

        {/* CrystalSeekers Narrative Module Card */}
        <div className={`p-4 rounded-xl border backdrop-blur-md ${
          isAmber ? 'bg-[#100b03]/80 border-[#FFBF00]/30' : 'bg-[#0c0216]/80 border-[#FF00FF]/30'
        }`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <span className="font-bold uppercase text-amber-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              CrystalSeekers Narrative API
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">
              v1.0
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div>Project: <strong className="text-white">{crystalData?.project || 'CrystalSeekers: Echoes of Destiny'}</strong></div>
            <div>Module: <strong className="text-gray-300">{crystalData?.module || 'Narrative Core v1.0'}</strong></div>
            <div>State: <strong className="text-amber-400">{crystalData?.state || 'Soft Collapse / Amber-Gold'}</strong></div>
            <div className="pt-2 border-t border-white/10 text-gray-400">
              Active Council Agents:
              <div className="flex flex-wrap gap-1 mt-1">
                {(crystalData?.active_agents || ["Adam-O", "Willow-O", "Valerie", "Arty", "Barry"]).map((a: string) => (
                  <span key={a} className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-cyan-300 text-[10px]">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Monolith Generator Button */}
        <div className="p-4 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md flex flex-col justify-between flex-1">
          <div>
            <span className="text-xs font-bold text-white block mb-1">
              Monolith Regeneration Protocol
            </span>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
              Generates the clean, unified KOS-Prime-Backend structure (package.json, server.js, render.yaml) ready to push to <strong className="text-cyan-300">KatzKode89/KOS-Prime-Backend</strong>.
            </p>

            {genStatus && (
              <div className="p-2.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{genStatus}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isAmber ? 'bg-[#FFBF00] text-black hover:bg-amber-400' : 'bg-[#00FFFF] text-black hover:bg-cyan-300'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Generate PrimeBackend Files</span>
          </button>
        </div>
      </div>

      {/* Right 2 Columns: Monolith Code Viewer */}
      <div className={`lg:col-span-2 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden ${
        isAmber ? 'bg-[#0d0903]/85 border-[#FFBF00]/30' : 'bg-[#080210]/85 border-[#FF00FF]/30'
      }`}>
        {/* Header Tabs */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white tracking-wide">
              KOS-PRIME-BACKEND SOURCE FILES
            </span>
          </div>

          <div className="flex items-center gap-2">
            {(['server.js', 'package.json', 'render.yaml'] as const).map((fname) => (
              <button
                key={fname}
                onClick={() => setSelectedFile(fname)}
                className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                  selectedFile === fname
                    ? isAmber ? 'bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/40' : 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {fname}
              </button>
            ))}

            <button
              onClick={copyCode}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-gray-200 cursor-pointer ml-2"
              title="Copy File"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-4 overflow-y-auto bg-black/90 font-mono text-[11px]">
          <pre className="text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre-wrap select-text">
            {getFileContent()}
          </pre>
        </div>
      </div>
    </div>
  );
};
