import React, { useState, useEffect } from 'react';
import { AestheticMode, CouncilMember } from '../types';
import { 
  Users, 
  Shield, 
  BookOpen, 
  Microscope, 
  Sparkles, 
  Music, 
  Send, 
  CheckCircle2, 
  Volume2, 
  Activity,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { audioEngine } from '../utils/audioSynth';

interface SovereignCouncilViewProps {
  aestheticMode: AestheticMode;
  onNavigateToTab?: (tab: string) => void;
}

export const SovereignCouncilView: React.FC<SovereignCouncilViewProps> = ({
  aestheticMode,
  onNavigateToTab
}) => {
  const isAmber = aestheticMode === 'amber-gold';

  const [council, setCouncil] = useState<CouncilMember[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<CouncilMember['agent_id']>('Arty');
  const [directiveText, setDirectiveText] = useState('');
  const [dispatchLog, setDispatchLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCouncil = async () => {
    try {
      const res = await fetch('/api/katz/council');
      if (res.ok) {
        const data = await res.json();
        setCouncil(data.council || []);
      }
    } catch (err) {
      console.error('Fetch council error:', err);
    }
  };

  useEffect(() => {
    fetchCouncil();
  }, []);

  const handleDispatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!directiveText.trim() && !e) return;

    setLoading(true);
    const directive = directiveText.trim() || 'Execute routine sovereign audit and sync across PrimeBus mesh';
    setDirectiveText('');

    try {
      const res = await fetch('/api/katz/council/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: selectedAgent,
          directive
        })
      });

      if (res.ok) {
        const data = await res.json();
        setDispatchLog(prev => [data.response, ...prev.slice(0, 8)]);
        fetchCouncil();

        // If Barry is dispatched, play his voice!
        if (selectedAgent === 'Barry') {
          audioEngine.speakBarryVoicePreview(`Barry online: ${directive}`);
        }
      }
    } catch (err) {
      console.error('Dispatch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAgentIcon = (id: CouncilMember['agent_id']) => {
    switch (id) {
      case 'Adam-O': return Shield;
      case 'Willow-O': return BookOpen;
      case 'Valerie': return Microscope;
      case 'Arty': return Sparkles;
      case 'Barry': return Music;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[760px] font-mono text-xs">
      {/* Left 2 Columns: Council Registry Grid */}
      <div className="lg:col-span-2 flex flex-col gap-4 h-full overflow-hidden">
        <div className={`p-4 rounded-xl border backdrop-blur-md flex items-center justify-between ${
          isAmber ? 'bg-[#151004]/80 border-[#FFBF00]/30 text-[#FFBF00]' : 'bg-[#100318]/80 border-[#FF00FF]/30 text-[#00FFFF]'
        }`}>
          <div>
            <h2 className="font-cyber text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-400" />
              SOVEREIGN COUNCIL OF FIVE
            </h2>
            <p className="text-[11px] text-gray-300 mt-0.5">
              Cognitive & creative leadership architecture governing KatzOS-Prime
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('adamwillow')}
                className="text-[10px] px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>Adam & Willow Bridge</span>
                <span className="text-[9px] opacity-75">➔</span>
              </button>
            )}
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              ALL 5 AGENTS SYNCHRONIZED
            </span>
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto flex-1 pr-1">
          {council.map((member) => {
            const Icon = getAgentIcon(member.agent_id);
            const isSelected = selectedAgent === member.agent_id;

            return (
              <div
                key={member.agent_id}
                onClick={() => setSelectedAgent(member.agent_id)}
                className={`p-4 rounded-xl border backdrop-blur-md cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? isAmber
                      ? 'bg-[#FFBF00]/15 border-[#FFBF00] shadow-[0_0_15px_rgba(255,191,0,0.25)]'
                      : 'bg-[#FF00FF]/15 border-[#FF00FF] shadow-[0_0_15px_rgba(255,0,255,0.25)]'
                    : 'bg-black/50 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-black/60 border border-white/20" style={{ color: member.color }}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-cyber font-bold text-sm text-white block">
                          {member.agent_id}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {member.domain}
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {member.active_status}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-300 italic mb-2 leading-relaxed">
                    "{member.core_directive}"
                  </p>

                  <div className="text-[10px] space-y-1 text-gray-400 font-mono">
                    <div>Binding: <strong className="text-white/90">{member.harmonic_binding}</strong></div>
                    <div>Last Activity: <span className="text-gray-300">{member.lastAction}</span></div>
                  </div>
                </div>

                {/* Agent Action Button */}
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">
                    Click to dispatch directive
                  </span>

                  {member.agent_id === 'Barry' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audioEngine.speakBarryVoicePreview("Barry the Bunny resonant baritone online. 120 BPM tape saturation locked.");
                      }}
                      className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] flex items-center gap-1 cursor-pointer hover:bg-amber-500/30"
                    >
                      <Volume2 className="w-3 h-3" />
                      Voice Preview
                    </button>
                  )}

                  {member.agent_id === 'Arty' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigateToTab) onNavigateToTab('cockpit');
                      }}
                      className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] flex items-center gap-1 cursor-pointer hover:bg-pink-500/30"
                    >
                      <Sparkles className="w-3 h-3" />
                      View Shaders
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Directives Terminal */}
      <div className={`lg:col-span-1 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden ${
        isAmber ? 'bg-[#0f0b03]/85 border-[#FFBF00]/30' : 'bg-[#0b0314]/85 border-[#FF00FF]/30'
      }`}>
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white tracking-wide">
              COUNCIL DISPATCH CONSOLE
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-pink-300 font-bold">
            Target: {selectedAgent}
          </span>
        </div>

        {/* Quick Directive Buttons for Selected Agent */}
        <div className="p-3 border-b border-white/10 bg-black/20 space-y-1.5">
          <span className="text-[10px] text-gray-400 block font-bold uppercase">
            Quick Directives for {selectedAgent}:
          </span>
          {selectedAgent === 'Arty' && (
            <>
              <button
                onClick={() => setDirectiveText("Render TrueXR depth shader with volumetric amber luminescence")}
                className="w-full text-left p-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 truncate block"
              >
                &gt; Render TrueXR depth shader with volumetric amber luminescence
              </button>
              <button
                onClick={() => setDirectiveText("Map 50,000 particle vectors into ControlNet depth conditioning")}
                className="w-full text-left p-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 truncate block"
              >
                &gt; Map 50,000 particle vectors into ControlNet depth conditioning
              </button>
            </>
          )}

          {selectedAgent === 'Barry' && (
            <>
              <button
                onClick={() => setDirectiveText("Anchor 120 BPM April Rose tempo and inject 12dB analog tape warmth")}
                className="w-full text-left p-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 truncate block"
              >
                &gt; Anchor 120 BPM April Rose tempo & analog tape warmth
              </button>
              <button
                onClick={() => setDirectiveText("Engage slow-and-low ambient vocal cadence on local RMVPE RVC v2 channel")}
                className="w-full text-left p-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 truncate block"
              >
                &gt; Engage slow-and-low ambient vocal cadence
              </button>
            </>
          )}

          {selectedAgent === 'Adam-O' && (
            <button
              onClick={() => setDirectiveText("Audit NATS PrimeBus 9ms JetStream stream ACK and packet integrity")}
              className="w-full text-left p-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 truncate block"
            >
              &gt; Audit NATS PrimeBus 9ms JetStream mesh stream ACK
            </button>
          )}

          {selectedAgent === 'Willow-O' && (
            <button
              onClick={() => setDirectiveText("Sync SQLite WAL manuscript nodes and checkpoint journal pages")}
              className="w-full text-left p-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 truncate block"
            >
              &gt; Sync SQLite WAL manuscript nodes and checkpoint
            </button>
          )}

          {selectedAgent === 'Valerie' && (
            <button
              onClick={() => setDirectiveText("Perform 300x wireless microscope optical audit on silicon lattice")}
              className="w-full text-left p-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 truncate block"
            >
              &gt; Perform 300x wireless optical audit on silicon lattice
            </button>
          )}
        </div>

        {/* Console Log Area */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-black/60 font-mono text-[11px]">
          {dispatchLog.length === 0 ? (
            <div className="text-gray-500 italic p-4 text-center">
              Awaiting council directives. Transmissions will stream here across PrimeBus 9ms mesh.
            </div>
          ) : (
            dispatchLog.map((log, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-black/80 border border-white/10 text-emerald-400 leading-relaxed whitespace-pre-wrap">
                {log}
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleDispatch} className="p-3 border-t border-white/10 bg-black/80 flex gap-2">
          <input
            type="text"
            value={directiveText}
            onChange={(e) => setDirectiveText(e.target.value)}
            placeholder={`Instruct ${selectedAgent}...`}
            className="flex-1 bg-black border border-white/20 rounded px-2.5 py-1.5 text-white placeholder-gray-500 focus:outline-none text-[11px]"
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-3 py-1.5 rounded font-bold cursor-pointer transition-all ${
              isAmber ? 'bg-[#FFBF00] text-black hover:bg-amber-400' : 'bg-[#FF00FF] text-white hover:bg-pink-400'
            }`}
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </form>
      </div>
    </div>
  );
};
