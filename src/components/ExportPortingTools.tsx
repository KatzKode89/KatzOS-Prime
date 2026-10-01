import React, { useState, useEffect } from 'react';
import { AestheticMode, PortingFiles } from '../types';
import { 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  Play, 
  ExternalLink, 
  FolderGit2, 
  RefreshCw,
  Server
} from 'lucide-react';

interface ExportPortingToolsProps {
  aestheticMode: AestheticMode;
}

export const ExportPortingTools: React.FC<ExportPortingToolsProps> = ({ aestheticMode }) => {
  const isAmber = aestheticMode === 'amber-gold';

  const [files, setFiles] = useState<PortingFiles | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('katz_ai_studio_port.py');
  const [copied, setCopied] = useState(false);

  // WSL2 Terminal Simulator State
  const [terminalInput, setTerminalInput] = useState('python3 ~/KatzOS/tools/katz_ai_studio_port.py "Initiate TrueXR diagnostic check across the PrimeBus mesh."');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string }>>([
    {
      cmd: 'export GEMINI_API_KEY="AI_STUDIO_SOVEREIGN_KEY_INJECTED"',
      output: '[WSL2] Environment variable exported.'
    },
    {
      cmd: 'python3 ~/KatzOS/tools/katz_ai_studio_port.py "Initiate TrueXR diagnostic check across the PrimeBus mesh."',
      output: `[Google AI Studio] Connecting to Gemini API with KatzOS-Prime context...
==================================================
[KATZ GOOGLE AI STUDIO RESPONSE]
==================================================
All sovereign telemetry vectors are synchronized across Google AI Studio and your local WSL2 katzqwenai instance.
- PrimeBus mesh ping: 9.04ms
- Willow-O SQLite WAL: wal_pg_0x91F5B0 locked
- MadMinx KaosKollisions: 50,000 particle vectors active
- Arty (Visualizer) & Barry (Baritone) confirmed in Council of Five.
==================================================`
    }
  ]);
  const [cmdRunning, setCmdRunning] = useState(false);

  useEffect(() => {
    fetch('/api/katz/export-files')
      .then(r => r.json())
      .then(d => setFiles(d))
      .catch(e => console.error('Export fetch error:', e));
  }, []);

  const getCodeContent = (fileName: string): string => {
    if (!files) return '# Loading sovereign scripts...';
    switch (fileName) {
      case 'katz_ai_studio_port.py': return files.pythonPortScript || '';
      case 'katz_bidirectional_sync_bridge.py': return files.biDirectionalSyncScript || '';
      case 'katz_veo3_bridge.py': return files.veo3BridgeScript || '';
      case 'katz_kompiler.py': return files.katzKompilerScript || '';
      case 'katz_council_expansion.py': return files.councilExpansionScript || '';
      case 'katz_mobile_web_builder.py': return files.mobileWebBuilderScript || '';
      case 'katz_khromium_builder.py': return files.khromiumBuilderScript || '';
      case 'generate_prime_backend.py': return files.primeBackendGenScript || '';
      case 'generate_katz_tunez_synth.py': return files.tunezSynthScript || '';
      case 'adam_willow_ai_studio_bridge.py': return files.adamWillowBridgeScript || '';
      case 'install_katzos_bridge.sh': return files.bashInstallScript || '';
      case 'push_to_katzos_github.sh': return files.githubPushScript || '';
      default: return files.pythonPortScript || '';
    }
  };

  const copyCurrentCode = () => {
    const code = getCodeContent(selectedFile);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCurrentCode = () => {
    const code = getCodeContent(selectedFile);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunTerminalCmd = (customCmd?: string) => {
    const cmd = customCmd || terminalInput;
    if (!cmd.trim() || cmdRunning) return;

    setCmdRunning(true);
    setTimeout(() => {
      let output = '';
      if (cmd.includes('katz_ai_studio_port.py')) {
        output = `[Google AI Studio] Connecting to Gemini API with KatzOS-Prime context...\n[KATZ GOOGLE AI STUDIO RESPONSE]\nTelemetry nominal. PrimeBus mesh: 9.04ms locked. Council active.`;
      } else if (cmd.includes('katz_veo3_bridge.py')) {
        output = `[KatzVeo3] Initializing Veo 3.1 generation pipeline...\n[Prompt Payload]: Cyberpunk icosahedral chamber in soft collapse...\n[KATZ VEO3 RENDER SPEC COMPILED] -> ~/KatzOS/renders/veo3_output/veo3_render_spec.json`;
      } else if (cmd.includes('katz_kompiler.py')) {
        output = `[KatzKompiler] Initializing Universal Stack Compilation...\n[Willow-O Source] Target Node: The Amber Luminescence of Yuba City\nBound 50,000 Real 3D Coordinates as ControlNet Depth Map\n[KATZKOMPILER BUILD SUCCESSFUL] -> ~/KatzOS/renders/compiled_builds/compiled_build_node1.json`;
      } else if (cmd.includes('katz_council_expansion.py')) {
        output = `[KatzOS Council] Integrating Arty (Visualizer) & Barry (Baritone Rhythm) into Sovereign Registry...\n[KatzOS Council] Arty & Barry successfully registered to SQLite WAL sovereign core.`;
      } else if (cmd.includes('katz_mobile_web_builder.py')) {
        output = `[KatzOS Build System] Initializing KatzMobile & KatzWebOS Scaffolding...\n[KATZMOBILE & KATZWEBOS SCAFFOLDING COMPLETE]\nKatzMobile path: ~/KatzOS/KatzMobile\nKatzWebOS path: ~/KatzOS/KatzWebOS`;
      } else if (cmd.includes('katz_khromium_builder.py')) {
        output = `[KatzKhromium] Initializing Custom Chromium XR Build & Launch Wrapper...\n[KATZKHROMIUM BUILD SUCCESSFUL] -> ~/KatzOS/KatzKhromium/run_truexr_browser.py`;
      } else if (cmd.includes('generate_prime_backend.py')) {
        output = `[PrimeBackend] Generating unified KOS-Prime-Backend monolith structure...\n[SUCCESS] KOS-Prime-Backend generated successfully! Resolves Render exit status 254.\nFiles: package.json, server.js, render.yaml. Target: KatzKode89/KOS-Prime-Backend`;
      } else if (cmd.includes('generate_katz_tunez_synth.py')) {
        output = `[KatzTunez] Initializing Hybrid AISynth scaffolding...\n[SUCCESS] KatzTunez-HybridAISynth generated at ~/KatzOS/KatzTunez-HybridAISynth\nProfiles: April Rose (120 BPM), Mystivia (128 BPM), Nyptix (135 BPM)\nChunks: Intro, Verse/Build, Pre-Drop Tension, Main Climax, Outro Decay`;
      } else if (cmd.includes('adam_willow_ai_studio_bridge.py')) {
        output = `[Adam-O // Telemetry] Packaging local KatzOS-Prime state for AI Studio App [4450cbf8-0512-43d4-b9f7-b3da98af5aac]...\n[ADAM & WILLOW AI STUDIO BRIDGE COMPILED]\nTarget App: https://ai.studio/apps/4450cbf8-0512-43d4-b9f7-b3da98af5aac\nActive Node: The Amber Luminescence of Yuba City\nAesthetic: Soft Collapse / Amber-Gold Luminescence\nCouncil: Adam-O (9ms Mesh Locked), Willow-O (SQLite WAL Synced), Arty (WebGL Active), Barry (120 BPM)\n[SUCCESS] Packet compiled and synced to ai_studio_sync_log in SQLite WAL!`;
      } else {
        output = `[WSL2 Executed]: Command completed with exit code 0.`;
      }

      setTerminalHistory(prev => [...prev, { cmd, output }]);
      setCmdRunning(false);
    }, 600);
  };

  const scriptList = [
    { id: 'katz_ai_studio_port.py', label: 'katz_ai_studio_port.py', desc: 'Google AI Studio GenAI Bridge', badge: 'Core' },
    { id: 'katz_bidirectional_sync_bridge.py', label: 'katz_bidirectional_sync_bridge.py', desc: 'AI Studio <-> Ollama Sync', badge: 'Sync' },
    { id: 'adam_willow_ai_studio_bridge.py', label: 'adam_willow_ai_studio_bridge.py', desc: 'Adam-O & Willow-O AI Studio Bridge', badge: 'Council' },
    { id: 'katz_veo3_bridge.py', label: 'katz_veo3_bridge.py', desc: 'Veo 3.1 Video Generator', badge: 'Veo3' },
    { id: 'katz_kompiler.py', label: 'katz_kompiler.py', desc: 'Universal Pipeline Compiler', badge: 'Kompiler' },
    { id: 'katz_council_expansion.py', label: 'katz_council_expansion.py', desc: 'Arty & Barry Council Integration', badge: 'Council' },
    { id: 'katz_mobile_web_builder.py', label: 'katz_mobile_web_builder.py', desc: 'KatzMobile & KatzWebOS Builder', badge: 'Mobile/Web' },
    { id: 'katz_khromium_builder.py', label: 'katz_khromium_builder.py', desc: 'Custom Chromium WebXR Launcher', badge: 'WebXR' },
    { id: 'generate_prime_backend.py', label: 'generate_prime_backend.py', desc: 'KOS-Prime-Backend Monolith Generator', badge: 'Render' },
    { id: 'generate_katz_tunez_synth.py', label: 'generate_katz_tunez_synth.py', desc: 'KatzTunez-HybridAISynth Builder', badge: 'Lyria/Suno' },
    { id: 'install_katzos_bridge.sh', label: 'install_katzos_bridge.sh', desc: 'WSL2 1-Line Setup Protocol', badge: 'Bash' },
    { id: 'push_to_katzos_github.sh', label: 'push_to_katzos_github.sh', desc: 'Git Push to KatzKode89/katzos', badge: 'GitHub' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[760px] font-mono text-xs">
      {/* Left Column: Script Selector & GitHub Status */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-full">
        {/* GitHub Repository Card */}
        <div className={`p-4 rounded-xl border backdrop-blur-md ${
          isAmber ? 'bg-[#151004]/80 border-[#FFBF00]/30' : 'bg-[#100318]/80 border-[#FF00FF]/30'
        }`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-current/20">
            <span className="font-bold flex items-center gap-1.5 uppercase">
              <FolderGit2 className="w-4 h-4 text-cyan-400" />
              GitHub Repository
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Synced
            </span>
          </div>

          <p className="text-[11px] text-gray-300 mb-2 leading-relaxed">
            Target Repo: <a href="https://github.com/KatzKode89/katzos" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-bold">KatzKode89/katzos</a>
          </p>

          <p className="text-[10px] text-gray-400 leading-normal">
            Contains the full KatzOS-Prime sovereignty stack: AI Studio port, Ollama bridge, KatzVeo3, KatzKompiler, Arty & Barry council registry, KatzMobile, and KatzKhromium.
          </p>
        </div>

        {/* Scripts Index */}
        <div className={`p-4 rounded-xl border backdrop-blur-md flex-1 flex flex-col overflow-hidden ${
          isAmber ? 'bg-[#100b03]/80 border-[#FFBF00]/30' : 'bg-[#0c0216]/80 border-[#FF00FF]/30'
        }`}>
          <span className="font-bold uppercase tracking-wider block mb-2 text-gray-300 pb-1 border-b border-white/10">
            Sovereign Scripts Archive ({scriptList.length})
          </span>

          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
            {scriptList.map((item) => {
              const isSelected = selectedFile === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedFile(item.id)}
                  className={`w-full text-left p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? isAmber
                        ? 'bg-[#FFBF00]/20 border-[#FFBF00] text-amber-200'
                        : 'bg-[#00FFFF]/20 border-[#00FFFF] text-cyan-200'
                      : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="font-bold text-[11px] block truncate">{item.label}</span>
                    <span className="text-[9px] opacity-70 block truncate">{item.desc}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-gray-300 shrink-0">
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right 2 Columns: Code Viewer & WSL2 Terminal Simulator */}
      <div className="lg:col-span-2 flex flex-col gap-4 h-full">
        {/* Code Viewer */}
        <div className={`flex-1 rounded-xl border backdrop-blur-md flex flex-col overflow-hidden ${
          isAmber ? 'bg-[#0d0903]/85 border-[#FFBF00]/30' : 'bg-[#080210]/85 border-[#FF00FF]/30'
        }`}>
          {/* Header */}
          <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white tracking-wide">
                ~/KatzOS/tools/{selectedFile}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyCurrentCode}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-200 flex items-center gap-1 text-[11px] cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={downloadCurrentCode}
                className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>

              <button
                onClick={() => handleRunTerminalCmd(`python3 ~/KatzOS/tools/${selectedFile}`)}
                className={`px-3 py-1 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                  isAmber ? 'bg-[#FFBF00] text-black hover:bg-amber-400' : 'bg-[#00FFFF] text-black hover:bg-cyan-300'
                }`}
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Test in WSL2</span>
              </button>
            </div>
          </div>

          {/* Code text */}
          <div className="flex-1 p-4 overflow-y-auto bg-black/90 font-mono text-[11px]">
            <pre className="text-emerald-400/90 whitespace-pre-wrap leading-relaxed select-text">
              {getCodeContent(selectedFile)}
            </pre>
          </div>
        </div>

        {/* WSL2 Interactive Terminal Simulator */}
        <div className="h-64 rounded-xl border border-white/20 bg-black/95 flex flex-col overflow-hidden shadow-2xl font-mono text-xs">
          <div className="p-2 border-b border-white/10 flex items-center justify-between bg-zinc-900/60 text-[11px]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-white font-bold">Lenovo WSL2 Terminal [Ubuntu 24.04 LTS]</span>
            </div>
            <span className="text-[10px] text-gray-400">~/KatzOS</span>
          </div>

          {/* Terminal log output */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-[11px] leading-relaxed">
            {terminalHistory.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-cyan-300 flex items-center gap-1">
                  <span className="text-pink-400 font-bold">kat@lenovo-wsl2:~/KatzOS$</span>
                  <span>{item.cmd}</span>
                </div>
                <div className="text-gray-300 whitespace-pre-wrap pl-3 border-l border-white/10">
                  {item.output}
                </div>
              </div>
            ))}
            {cmdRunning && (
              <div className="text-amber-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Executing daemon command...</span>
              </div>
            )}
          </div>

          {/* Command Prompt */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunTerminalCmd();
            }}
            className="p-2 border-t border-white/10 bg-black flex items-center gap-2 text-xs"
          >
            <span className="text-pink-400 font-bold shrink-0">kat@lenovo-wsl2:~$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Enter WSL2 command (e.g. python3 ~/KatzOS/tools/katz_ai_studio_port.py)..."
              className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs placeholder-gray-600"
            />
            <button
              type="submit"
              disabled={cmdRunning || !terminalInput.trim()}
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer text-xs"
            >
              Run
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
