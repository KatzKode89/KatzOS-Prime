/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AestheticMode, TelemetryData, ManuscriptNode } from './types';
import { audioEngine } from './utils/audioSynth';
import { SovereignHeader } from './components/SovereignHeader';
import { KaosKollisionsCanvas } from './components/KaosKollisionsCanvas';
import { BiDirectionalChat } from './components/BiDirectionalChat';
import { KatzVeo3Studio } from './components/KatzVeo3Studio';
import { KatzKompilerStudio } from './components/KatzKompilerStudio';
import { SovereignCouncilView } from './components/SovereignCouncilView';
import { WillowOManuscript } from './components/WillowOManuscript';
import { OpticalAuditBridge } from './components/OpticalAuditBridge';
import { KatzTunezDSP } from './components/KatzTunezDSP';
import { KatzMobileWebStudio } from './components/KatzMobileWebStudio';
import { PrimeBackendPanel } from './components/PrimeBackendPanel';
import { AdamWillowBridgePanel } from './components/AdamWillowBridgePanel';
import { ExportPortingTools } from './components/ExportPortingTools';

export default function App() {
  const [aestheticMode, setAestheticMode] = useState<AestheticMode>('amber-gold');
  const [activeTab, setActiveTab] = useState<string>('cockpit');
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [globalNotice, setGlobalNotice] = useState<string | null>(null);

  // Poll live telemetry periodically
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/katz/telemetry');
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data);
        }
      } catch (err) {
        console.warn('Telemetry polling error:', err);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAesthetic = () => {
    const nextMode: AestheticMode = aestheticMode === 'amber-gold' ? 'neon-fracture' : 'amber-gold';
    setAestheticMode(nextMode);
    audioEngine.setMode(nextMode);
    showNotice(
      nextMode === 'amber-gold'
        ? 'Aesthetic State: Soft Collapse / Amber-Gold Luminescence (#FFBF00 @ 120 BPM)'
        : 'Aesthetic State: Neon Fracture / High Chaos (#FF00FF/#00FFFF @ 135 BPM)'
    );
  };

  const handleToggleAudio = () => {
    const playing = audioEngine.toggle();
    setIsPlayingAudio(playing);
    showNotice(
      playing
        ? `KatzTunez DSP audio started: ${aestheticMode === 'amber-gold' ? '120 BPM April Rose Melodic House' : '135 BPM Nyptix Industrial Techno'}`
        : 'KatzTunez DSP audio paused.'
    );
  };

  const showNotice = (msg: string) => {
    setGlobalNotice(msg);
    setTimeout(() => setGlobalNotice(null), 4000);
  };

  // Cross-system pipeline triggers
  const handleCommitToManuscript = async (title: string, prose: string) => {
    try {
      const res = await fetch('/api/katz/willow-manuscript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          prose,
          authorAlias: aestheticMode === 'amber-gold' ? 'April Rose' : 'Nyptix',
          tags: ['Sovereign Council', 'Live Chat Capture']
        })
      });
      if (res.ok) {
        showNotice(`Committed narrative node "${title}" into Willow-O SQLite WAL!`);
      }
    } catch (err) {
      console.error('Commit error:', err);
    }
  };

  const handlePipeToVeo3 = async (title: string, prose: string) => {
    try {
      const res = await fetch('/api/katz/veo3/compile-director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          prose,
          grading: aestheticMode === 'amber-gold' ? 'Amber-Gold Luminescence' : 'Neon Fracture / High Chaos',
          motion_scale: aestheticMode === 'amber-gold' ? 0.35 : 0.85,
          audio_directive: aestheticMode === 'amber-gold' ? '120 BPM April Rose Melodic House' : '135 BPM Nyptix Industrial Techno Drive'
        })
      });
      if (res.ok) {
        showNotice(`Director packet compiled and piped to KatzVeo3 Video Engine!`);
        setActiveTab('veo3');
      }
    } catch (err) {
      console.error('Veo3 pipe error:', err);
    }
  };

  const handleSendToKompiler = async (title: string, prose: string) => {
    try {
      const res = await fetch('/api/katz/kompiler/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeTitle: title,
          proseOverride: prose,
          aestheticOverride: aestheticMode === 'amber-gold' ? 'Soft Collapse / Amber-Gold Luminescence' : 'Neon Fracture / High Chaos'
        })
      });
      if (res.ok) {
        showNotice(`Universal build manifest compiled by KatzKompiler!`);
        setActiveTab('kompiler');
      }
    } catch (err) {
      console.error('Kompiler error:', err);
    }
  };

  const isAmber = aestheticMode === 'amber-gold';

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col transition-colors duration-700 ${
      isAmber ? 'bg-[#060401]' : 'bg-[#040108]'
    }`}>
      {/* Sovereign Header Navigation */}
      <SovereignHeader
        aestheticMode={aestheticMode}
        onToggleAesthetic={handleToggleAesthetic}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        telemetry={telemetry}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={handleToggleAudio}
      />

      {/* Global Toast Notification */}
      {globalNotice && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-2.5 rounded-xl border text-xs font-mono shadow-2xl backdrop-blur-md flex items-center gap-2 ${
            isAmber 
              ? 'bg-[#1a1202]/95 border-[#FFBF00] text-[#FFBF00] shadow-[0_0_20px_rgba(255,191,0,0.3)]' 
              : 'bg-[#180324]/95 border-[#00FFFF] text-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.3)]'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{globalNotice}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-6 overflow-hidden">
        {activeTab === 'cockpit' && (
          <KaosKollisionsCanvas
            aestheticMode={aestheticMode}
            telemetry={telemetry}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'chat' && (
          <BiDirectionalChat
            aestheticMode={aestheticMode}
            onCommitToManuscript={handleCommitToManuscript}
            onPipeToVeo3={handlePipeToVeo3}
            onSendToKompiler={handleSendToKompiler}
          />
        )}

        {activeTab === 'adamwillow' && (
          <AdamWillowBridgePanel
            aestheticMode={aestheticMode}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'council' && (
          <SovereignCouncilView
            aestheticMode={aestheticMode}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'veo3' && (
          <KatzVeo3Studio
            aestheticMode={aestheticMode}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'kompiler' && (
          <KatzKompilerStudio
            aestheticMode={aestheticMode}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'mobileweb' && (
          <KatzMobileWebStudio
            aestheticMode={aestheticMode}
          />
        )}

        {activeTab === 'primebackend' && (
          <PrimeBackendPanel
            aestheticMode={aestheticMode}
          />
        )}

        {activeTab === 'manuscript' && (
          <WillowOManuscript
            aestheticMode={aestheticMode}
            onSelectNodeForKompiler={(node: ManuscriptNode) => {
              handleSendToKompiler(node.title, node.prose);
            }}
          />
        )}

        {activeTab === 'optical' && (
          <OpticalAuditBridge
            aestheticMode={aestheticMode}
          />
        )}

        {activeTab === 'audio' && (
          <KatzTunezDSP
            aestheticMode={aestheticMode}
            isPlayingAudio={isPlayingAudio}
            onToggleAudio={handleToggleAudio}
          />
        )}

        {activeTab === 'tools' && (
          <ExportPortingTools
            aestheticMode={aestheticMode}
          />
        )}
      </main>

      {/* Sovereign Cockpit Footer */}
      <footer className={`border-t py-3 px-6 text-[11px] font-mono flex items-center justify-between flex-wrap gap-2 transition-colors duration-500 ${
        isAmber ? 'bg-[#090602] border-[#FFBF00]/20 text-gray-400' : 'bg-[#080210] border-[#FF00FF]/20 text-gray-400'
      }`}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-white">KATZOS-PRIME // SOVEREIGN HUB</span>
          <span>•</span>
          <span>Nexus: Yuba City, CA (Kat / April Rose / Mystivia / Nyptix)</span>
          <span>•</span>
          <span className="text-emerald-400">PrimeBus: 9ms Locked</span>
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          <span>Council of Five: <strong className="text-pink-300">Arty, Barry, Adam-O, Willow-O, Valerie</strong></span>
          <span>•</span>
          <span>GitHub: <a href="https://github.com/KatzKode89/katzos" target="_blank" rel="noreferrer" className="text-cyan-400 underline">KatzKode89/katzos</a></span>
        </div>
      </footer>
    </div>
  );
}
