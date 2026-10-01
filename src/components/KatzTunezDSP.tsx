import React, { useRef, useEffect, useState } from 'react';
import { AestheticMode, SynthChunk, AliasMusicProfile } from '../types';
import { 
  Music, 
  Play, 
  Square, 
  Volume2, 
  Sliders, 
  Radio, 
  Sparkles, 
  Disc, 
  Cpu, 
  Layers, 
  Wand2, 
  Copy, 
  Check, 
  Download, 
  Terminal,
  Activity,
  Zap
} from 'lucide-react';
import { audioEngine } from '../utils/audioSynth';

interface KatzTunezDSPProps {
  aestheticMode: AestheticMode;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
}

const defaultChunks: SynthChunk[] = [
  {
    part: 'Intro',
    bars: 16,
    durationSeconds: 32,
    dspParameters: { cutoffHz: 380, resonance: 2.1, tapeDriveDb: 6, reverbWet: 0.45 },
    promptSeed: 'Subtle atmospheric pads and filtered pulse, gentle tape crackle introducing the harmonic root.'
  },
  {
    part: 'Verse / Build',
    bars: 32,
    durationSeconds: 64,
    dspParameters: { cutoffHz: 1200, resonance: 3.4, tapeDriveDb: 10, reverbWet: 0.35 },
    promptSeed: 'Full bassline engages, progressive arpeggio climbing with Barry baritone vocal cadence.'
  },
  {
    part: 'Pre-Drop Tension',
    bars: 8,
    durationSeconds: 16,
    dspParameters: { cutoffHz: 4500, resonance: 6.8, tapeDriveDb: 16, reverbWet: 0.65 },
    promptSeed: 'White noise riser sweep, kick drum dropout, sub-bass high-pass filter sweep, KaosKollisions stutter.'
  },
  {
    part: 'Main Climax',
    bars: 32,
    durationSeconds: 64,
    dspParameters: { cutoffHz: 18000, resonance: 1.8, tapeDriveDb: 14, reverbWet: 0.28 },
    promptSeed: 'Explosive full-frequency drop, 48Hz punch, volumetric synth chords, 90 FPS locked rhythm.'
  },
  {
    part: 'Outro Decay',
    bars: 16,
    durationSeconds: 32,
    dspParameters: { cutoffHz: 650, resonance: 2.0, tapeDriveDb: 8, reverbWet: 0.55 },
    promptSeed: 'Elements strip away to analog tape delay tail and ambient amber-gold harmonic resonance.'
  }
];

export const KatzTunezDSP: React.FC<KatzTunezDSPProps> = ({
  aestheticMode,
  isPlayingAudio,
  onToggleAudio
}) => {
  const isAmber = aestheticMode === 'amber-gold';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sub-view toggle
  const [subView, setSubView] = useState<'dsp' | 'hybrid-synth'>('hybrid-synth');

  // DSP & RVC State
  const [activeVoice, setActiveVoice] = useState<'Barry' | 'DJ KrazyKat' | 'April Rose' | 'Nyptix'>('Barry');
  const [tapeSaturation, setTapeSaturation] = useState<number>(12);
  const [voiceSpeechInput, setVoiceSpeechInput] = useState<string>("Barry the Bunny resonant baritone online. 120 BPM tape saturation locked.");

  // Hybrid AI Synth State
  const [selectedAlias, setSelectedAlias] = useState<'April Rose' | 'Mystivia' | 'Nyptix'>('April Rose');
  const [customPromptDirective, setCustomPromptDirective] = useState('');
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<any>(null);
  const [scaffoldStatus, setScaffoldStatus] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Initial fetch for synth profiles
  useEffect(() => {
    fetch('/api/katz/tunez-synth/inspect')
      .then(res => res.json())
      .then(data => {
        if (data.profiles && data.profiles['April Rose']) {
          setGeneratedOutput({
            alias: 'April Rose',
            bpm: 120,
            key: 'F# Minor',
            genre: data.profiles['April Rose'].genre,
            aesthetic: data.profiles['April Rose'].aesthetic,
            lyriaPrompt: data.profiles['April Rose'].lyriaPromptTemplate,
            sunoPrompt: data.profiles['April Rose'].sunoPromptTemplate,
            chunks: data.chunksTemplate
          });
        }
      })
      .catch(err => console.warn('Synth inspect error:', err));
  }, []);

  // Oscilloscope & Frequency Analyzer Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const drawVisualizer = () => {
      animId = requestAnimationFrame(drawVisualizer);
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = 'rgba(10, 6, 2, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const analyser = audioEngine.getAnalyser();
      if (!analyser || !isPlayingAudio) {
        // Flatline idle line
        ctx.strokeStyle = isAmber ? 'rgba(255, 191, 0, 0.3)' : 'rgba(0, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      // Draw Waveform Oscilloscope
      ctx.lineWidth = 2;
      ctx.strokeStyle = isAmber ? '#FFBF00' : '#00FFFF';
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Frequency Spectrum Bars
      const freqData = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(freqData);

      const barWidth = (width / 48) - 2;
      let barX = 0;

      for (let i = 0; i < 48; i++) {
        const barHeight = (freqData[i * 2] / 255) * (height / 2);

        ctx.fillStyle = isAmber
          ? `rgba(255, 191, 0, ${0.3 + (freqData[i * 2] / 255) * 0.7})`
          : `rgba(255, 0, 255, ${0.3 + (freqData[i * 2] / 255) * 0.7})`;

        ctx.fillRect(barX, height - barHeight, barWidth, barHeight);
        barX += barWidth + 2;
      }
    };

    drawVisualizer();
    return () => cancelAnimationFrame(animId);
  }, [isPlayingAudio, isAmber, subView]);

  const handleTestVoice = () => {
    if (activeVoice === 'Barry') {
      audioEngine.speakBarryVoicePreview(voiceSpeechInput);
    } else if (activeVoice === 'DJ KrazyKat') {
      audioEngine.speakDJVoicePreview(voiceSpeechInput);
    } else {
      audioEngine.speakBarryVoicePreview(voiceSpeechInput);
    }
  };

  const handleGenerateSynthPrompts = async () => {
    setIsGeneratingPrompts(true);
    try {
      const res = await fetch('/api/katz/tunez-synth/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alias: selectedAlias,
          customDirectives: customPromptDirective
        })
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedOutput(data);
      }
    } catch (err) {
      console.error('Synth generate error:', err);
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const handleScaffoldSynthEngine = async () => {
    try {
      const res = await fetch('/api/katz/tunez-synth/scaffold', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setScaffoldStatus(data.message);
        setTimeout(() => setScaffoldStatus(null), 4000);
      }
    } catch (err) {
      console.error('Scaffold error:', err);
    }
  };

  const copyText = (txt: string, section: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="flex flex-col gap-4 h-[760px] font-mono text-xs overflow-hidden">
      {/* Top Engine Selector Bar */}
      <div className={`p-3 rounded-xl border flex items-center justify-between flex-wrap gap-3 backdrop-blur-md ${
        isAmber ? 'bg-[#151004]/80 border-[#FFBF00]/30' : 'bg-[#100318]/80 border-[#FF00FF]/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-pink-400 animate-pulse" />
            <span className="font-bold text-sm tracking-wider text-white">
              KATZTUNEZ-HYBRID AI SYNTH ENGINE
            </span>
          </div>
          <span className="hidden sm:inline-block opacity-40">|</span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-semibold">
            Google Lyria & Suno AI Bridge
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-400">
            <Radio className="w-3.5 h-3.5" />
            NATS PrimeBus: 9ms Sync
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubView('hybrid-synth')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              subView === 'hybrid-synth'
                ? isAmber 
                  ? 'bg-[#FFBF00] text-black shadow-[0_0_15px_rgba(255,191,0,0.5)]' 
                  : 'bg-[#FF00FF] text-white shadow-[0_0_15px_rgba(255,0,255,0.5)]'
                : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hybrid AI Synth & Chunks</span>
          </button>

          <button
            onClick={() => setSubView('dsp')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              subView === 'dsp'
                ? isAmber 
                  ? 'bg-[#FFBF00] text-black shadow-[0_0_15px_rgba(255,191,0,0.5)]' 
                  : 'bg-[#00FFFF] text-black shadow-[0_0_15px_rgba(0,255,255,0.5)]'
                : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>WebAudio DSP & RVC Cloner</span>
          </button>

          <button
            onClick={onToggleAudio}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isPlayingAudio
                ? isAmber ? 'bg-[#FFBF00] text-black' : 'bg-[#FF00FF] text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isPlayingAudio ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlayingAudio ? 'Stop DSP' : 'Test DSP Beat'}</span>
          </button>
        </div>
      </div>

      {scaffoldStatus && (
        <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center justify-between text-xs animate-fadeIn">
          <span>{scaffoldStatus}</span>
          <span className="text-[10px] text-emerald-400 font-bold">DIRECTORY: ~/KatzOS/KatzTunez-HybridAISynth</span>
        </div>
      )}

      {/* Main Content Area */}
      {subView === 'hybrid-synth' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">
          {/* Left Column: Alias Selector & Directives (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4 h-full overflow-y-auto pr-1">
            {/* Alias Profiles */}
            <div className={`p-4 rounded-xl border backdrop-blur-md ${
              isAmber ? 'bg-[#151004]/80 border-[#FFBF00]/30' : 'bg-[#100318]/80 border-[#FF00FF]/30'
            }`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Disc className="w-4 h-4 text-pink-400" />
                  Musical Alias Profiles
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                  Council Audio
                </span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    alias: 'April Rose',
                    genre: 'Melodic Deep House',
                    bpm: 120,
                    key: 'F# Minor',
                    color: '#FFBF00',
                    desc: 'Soft Collapse / Amber-Gold (#FFBF00). Warm analog Moog sub, 48Hz, 909 kick, nostalgic tape warmth.'
                  },
                  {
                    alias: 'Mystivia',
                    genre: 'Ethereal Cinematic Trance',
                    bpm: 128,
                    key: 'D Minor',
                    color: '#9945FF',
                    desc: 'CrystalSeekers: Echoes of Destiny (#9945FF). Shimmering arps, celestial choir swells, crystalline stereo field.'
                  },
                  {
                    alias: 'Nyptix',
                    genre: 'Industrial Cyberpunk Techno Drive',
                    bpm: 135,
                    key: 'C Minor',
                    color: '#00FFFF',
                    desc: 'Neon Fracture / High Chaos (#00FFFF/#FF00FF). Distorted 303 acid, transient clippers, warehouse pressure.'
                  }
                ].map((item) => (
                  <button
                    key={item.alias}
                    onClick={() => setSelectedAlias(item.alias as any)}
                    className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedAlias === item.alias
                        ? 'border-current bg-white/10 shadow-lg'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                    style={{ borderColor: selectedAlias === item.alias ? item.color : undefined }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm" style={{ color: item.color }}>{item.alias}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white">
                        {item.bpm} BPM // {item.key}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-200 block mb-1 font-semibold">{item.genre}</span>
                    <p className="text-[10px] text-gray-400 leading-normal">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Directives & Controls */}
            <div className={`p-4 rounded-xl border backdrop-blur-md flex-1 flex flex-col justify-between ${
              isAmber ? 'bg-[#100b03]/80 border-[#FFBF00]/30' : 'bg-[#0c0216]/80 border-[#FF00FF]/30'
            }`}>
              <div>
                <span className="font-bold uppercase tracking-wider block mb-2 text-white">
                  Creative Directives & Theme Override
                </span>
                <p className="text-[10px] text-gray-400 mb-2 leading-relaxed">
                  Directives are compiled into exact Google Lyria sonic vectors and Suno v3.5 structural tokens with Barry baritone vocal anchors.
                </p>

                <textarea
                  value={customPromptDirective}
                  onChange={(e) => setCustomPromptDirective(e.target.value)}
                  placeholder="e.g. Include 300x optical audit microscopy resonance, analog tape compression at +14dB, and Barry baritone ambient spoken breakdown..."
                  rows={3}
                  className="w-full bg-black/60 border border-white/20 rounded p-2 text-white text-[11px] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <button
                  onClick={handleGenerateSynthPrompts}
                  disabled={isGeneratingPrompts}
                  className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isAmber ? 'bg-[#FFBF00] text-black hover:bg-amber-400' : 'bg-[#FF00FF] text-white hover:bg-pink-600'
                  }`}
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{isGeneratingPrompts ? 'Synthesizing with Gemini...' : `Generate Lyria & Suno Audio Spec`}</span>
                </button>

                <button
                  onClick={handleScaffoldSynthEngine}
                  className="w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 cursor-pointer text-[11px]"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Scaffold ~/KatzOS/KatzTunez-HybridAISynth</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Part Chunk Arranger & Lyria/Suno Spec (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4 h-full overflow-y-auto pr-1">
            {/* Multi-Part Chunk Arranger Card */}
            <div className={`p-4 rounded-xl border backdrop-blur-md ${
              isAmber ? 'bg-[#0d0903]/85 border-[#FFBF00]/30' : 'bg-[#080210]/85 border-[#FF00FF]/30'
            }`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white tracking-wide">
                    MULTI-PART CHUNKING STRATEGY ({selectedAlias})
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span>Tempo: <strong className="text-white">{generatedOutput?.bpm || 120} BPM</strong></span>
                  <span>•</span>
                  <span>Key: <strong className="text-white">{generatedOutput?.key || 'F# Minor'}</strong></span>
                </div>
              </div>

              {/* Chunk Sequence Visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                {(generatedOutput?.chunks || defaultChunks).map((chunk: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-white/10 bg-black/60 flex flex-col justify-between hover:border-white/30 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">PART {idx + 1}</span>
                        <span className="text-[9px] px-1 rounded bg-white/10 text-gray-300">
                          {chunk.bars} BARS
                        </span>
                      </div>
                      <span className="font-bold text-white text-[11px] block truncate">{chunk.part}</span>
                      <p className="text-[9px] text-gray-400 mt-1 leading-normal line-clamp-3">
                        {chunk.promptSeed}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/10 text-[9px] space-y-0.5 text-gray-400">
                      <div>Duration: <span className="text-white font-mono">{chunk.durationSeconds || 32}s</span></div>
                      <div>LP Cutoff: <span className="text-amber-300">{chunk.dspParameters?.cutoffHz || 1000}Hz</span></div>
                      <div>Tape Drive: <span className="text-pink-300">+{chunk.dspParameters?.tapeDriveDb || 10}dB</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Prompts for Lyria & Suno */}
            <div className={`p-4 rounded-xl border backdrop-blur-md flex-1 flex flex-col overflow-hidden ${
              isAmber ? 'bg-[#0d0903]/85 border-[#FFBF00]/30' : 'bg-[#080210]/85 border-[#FF00FF]/30'
            }`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Google Lyria & Suno AI Model Prompts
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Ready for Generation
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {/* Google Lyria Card */}
                <div className="p-3 rounded-lg border border-white/10 bg-black/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      Google Lyria Audio Model Prompt Directive:
                    </span>
                    <button
                      onClick={() => copyText(generatedOutput?.lyriaPrompt || '', 'lyria')}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-gray-300 flex items-center gap-1 text-[10px] cursor-pointer"
                    >
                      {copiedSection === 'lyria' ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                      <span>{copiedSection === 'lyria' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-cyan-200/90 whitespace-pre-wrap leading-relaxed select-text bg-black/80 p-2 rounded border border-white/5">
                    {generatedOutput?.lyriaPrompt || 'Generating Google Lyria prompt directive...'}
                  </pre>
                </div>

                {/* Suno v3.5 Architecture Card */}
                <div className="p-3 rounded-lg border border-white/10 bg-black/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
                      <Music className="w-3 h-3 text-pink-400" />
                      Suno v3.5 Meta-Tagged Structure:
                    </span>
                    <button
                      onClick={() => copyText(generatedOutput?.sunoPrompt || '', 'suno')}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-gray-300 flex items-center gap-1 text-[10px] cursor-pointer"
                    >
                      {copiedSection === 'suno' ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                      <span>{copiedSection === 'suno' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-pink-200/90 whitespace-pre-wrap leading-relaxed select-text bg-black/80 p-2 rounded border border-white/5">
                    {generatedOutput?.sunoPrompt || 'Generating Suno structural tags...'}
                  </pre>
                </div>

                {/* AI Prompt Block (Gemini Deep Analysis) */}
                {generatedOutput?.aiPromptBlock && (
                  <div className="p-3 rounded-lg border border-white/10 bg-black/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                        <Wand2 className="w-3 h-3 text-amber-400" />
                        Gemini Master Sound Engineering Breakdown:
                      </span>
                      <button
                        onClick={() => copyText(generatedOutput.aiPromptBlock, 'analysis')}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-gray-300 flex items-center gap-1 text-[10px] cursor-pointer"
                      >
                        {copiedSection === 'analysis' ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                        <span>{copiedSection === 'analysis' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-[10px] font-mono text-amber-200/90 whitespace-pre-wrap leading-relaxed select-text bg-black/80 p-2 rounded border border-white/5 max-h-36 overflow-y-auto">
                      {generatedOutput.aiPromptBlock}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DSP & Voice Cloner View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Left Column: DSP Clock & Voice Router */}
          <div className="lg:col-span-1 flex flex-col gap-4 h-full overflow-y-auto pr-1">
            {/* DSP Clock Card */}
            <div className={`p-4 rounded-xl border backdrop-blur-md ${
              isAmber ? 'bg-[#151004]/80 border-[#FFBF00]/30' : 'bg-[#100318]/80 border-[#FF00FF]/30'
            }`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-current/20">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-pink-400" />
                  KatzTunez Audio Synth
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">
                  WebAudio DSP
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 block text-[10px]">CLOCK SOURCE</span>
                    <span className="text-white font-bold text-sm">
                      {isAmber ? '120 BPM (April Rose)' : '135 BPM (Nyptix Drive)'}
                    </span>
                  </div>

                  <button
                    onClick={onToggleAudio}
                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      isPlayingAudio
                        ? isAmber ? 'bg-[#FFBF00] text-black shadow-[0_0_15px_rgba(255,191,0,0.5)]' : 'bg-[#FF00FF] text-white shadow-[0_0_15px_rgba(255,0,255,0.5)]'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isPlayingAudio ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlayingAudio ? 'Mute' : 'Play Beat'}</span>
                  </button>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-[11px]">
                    <span className="text-gray-400">Analog Tape Saturation:</span>
                    <span className="text-amber-300 font-bold">{tapeSaturation} dB</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={tapeSaturation}
                    onChange={(e) => setTapeSaturation(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Local RVC v2 Voice Cloner Card */}
            <div className={`p-4 rounded-xl border backdrop-blur-md flex-1 flex flex-col justify-between ${
              isAmber ? 'bg-[#100b03]/80 border-[#FFBF00]/30' : 'bg-[#0c0216]/80 border-[#FF00FF]/30'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-current/20">
                  <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    Local RVC v2 Voice Cloner
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    RMVPE Pitch
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { id: 'Barry', label: 'Barry the Bunny', desc: 'Resonant Baritone' },
                    { id: 'DJ KrazyKat', label: 'DJ KrazyKat', desc: 'Subharmonic Voice' },
                    { id: 'April Rose', label: 'April Rose', desc: 'Melodic Vocal Filter' },
                    { id: 'Nyptix', label: 'Nyptix', desc: 'Vocoded Drive' }
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setActiveVoice(v.id as any);
                        if (v.id === 'Barry') {
                          setVoiceSpeechInput("Barry the Bunny resonant baritone online. 120 BPM tape saturation locked.");
                        } else if (v.id === 'DJ KrazyKat') {
                          setVoiceSpeechInput("DJ KrazyKat dropping 135 BPM industrial techno drive into the TrueXR cockpit.");
                        }
                      }}
                      className={`p-2 rounded-lg text-left border cursor-pointer transition-all ${
                        activeVoice === v.id
                          ? isAmber ? 'bg-[#FFBF00]/20 border-[#FFBF00] text-amber-200' : 'bg-[#00FFFF]/20 border-[#00FFFF] text-cyan-200'
                          : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <span className="font-bold block text-[11px] truncate">{v.label}</span>
                      <span className="text-[9px] opacity-70 block truncate">{v.desc}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-gray-400 block mb-1 text-[10px]">Speech Directive Payload:</label>
                  <textarea
                    value={voiceSpeechInput}
                    onChange={(e) => setVoiceSpeechInput(e.target.value)}
                    rows={3}
                    className="w-full bg-black/60 border border-white/20 rounded p-2 text-white text-[11px] focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              <button
                onClick={handleTestVoice}
                className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-all mt-3 ${
                  isAmber ? 'bg-[#FFBF00] text-black hover:bg-amber-400' : 'bg-[#00FFFF] text-black hover:bg-cyan-300'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Speak via {activeVoice} Voice Engine</span>
              </button>
            </div>
          </div>

          {/* Right 2 Columns: Oscilloscope & Spectrum Display */}
          <div className={`lg:col-span-2 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden ${
            isAmber ? 'bg-[#0d0903]/85 border-[#FFBF00]/30' : 'bg-[#080210]/85 border-[#FF00FF]/30'
          }`}>
            <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-bold text-white tracking-wide">
                  REAL-TIME DSP OSCILLOSCOPE & SPECTRUM ANALYZER
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span>Sample Rate: 48kHz</span>
                <span>•</span>
                <span>FFT: 256 Bins</span>
              </div>
            </div>

            {/* Visualizer Canvas */}
            <div className="flex-1 relative bg-black p-4 flex flex-col items-center justify-center">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full h-full max-h-[480px] rounded-lg border border-white/10 bg-black/90 shadow-2xl block"
              />

              {/* CRT Scanline */}
              <div className="absolute inset-0 crt-scanlines pointer-events-none" />

              {/* Overlay Status */}
              <div className="absolute top-8 left-8 text-[11px] font-mono text-gray-400 bg-black/70 p-3 rounded-lg border border-white/10 backdrop-blur-md">
                <div>DSP State: <strong className={isPlayingAudio ? 'text-emerald-400' : 'text-gray-500'}>{isPlayingAudio ? 'STREAMING' : 'MUTED'}</strong></div>
                <div>Active Profile: <strong className="text-white">{isAmber ? 'April Rose Melodic House' : 'Nyptix Industrial Drive'}</strong></div>
                <div>BPM Guard: <strong className="text-amber-300">{isAmber ? '120 BPM' : '135 BPM'}</strong></div>
                <div>Voice Stem: <strong className="text-pink-300">{activeVoice} (RMVPE RVC v2)</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
