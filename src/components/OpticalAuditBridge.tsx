import React, { useState, useEffect } from 'react';
import { AestheticMode } from '../types';
import { Microscope, ZoomIn, ZoomOut, Target, CheckCircle2, ShieldCheck, Activity, Eye } from 'lucide-react';

interface OpticalAuditBridgeProps {
  aestheticMode: AestheticMode;
}

export const OpticalAuditBridge: React.FC<OpticalAuditBridgeProps> = ({ aestheticMode }) => {
  const isAmber = aestheticMode === 'amber-gold';

  const [zoomLevel, setZoomLevel] = useState<number>(300);
  const [focusOffset, setFocusOffset] = useState<number>(0);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditComplete, setAuditComplete] = useState<boolean>(true);
  const [laserIntensity, setLaserIntensity] = useState<number>(85);

  const runAuditScan = () => {
    setIsAuditing(true);
    setAuditComplete(false);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 1800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[760px] font-mono text-xs">
      {/* Left Column: Microscope Controls & Telemetry */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-full">
        <div className={`p-4 rounded-xl border backdrop-blur-md ${
          isAmber ? 'bg-[#151004]/80 border-[#FFBF00]/30' : 'bg-[#100318]/80 border-[#FF00FF]/30'
        }`}>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-current/20">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Microscope className="w-4 h-4 text-emerald-400" />
              Valerie Optical Audit Bridge
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              300x Active
            </span>
          </div>

          <div className="space-y-3 text-[11px]">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Magnification:</span>
                <span className="text-white font-bold">{zoomLevel}x Optical</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(50, prev - 50))}
                  className="p-1 rounded bg-black/50 border border-white/20 text-gray-300 hover:text-white"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  className="flex-1 accent-emerald-400"
                />
                <button
                  onClick={() => setZoomLevel(prev => Math.min(1000, prev + 50))}
                  className="p-1 rounded bg-black/50 border border-white/20 text-gray-300 hover:text-white"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Laser Calibration:</span>
                <span className="text-cyan-300 font-bold">{laserIntensity}% Intensity</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={laserIntensity}
                onChange={(e) => setLaserIntensity(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Fine Optical Focus:</span>
                <span className="text-pink-300 font-bold">{focusOffset} µm</span>
              </div>
              <input
                type="range"
                min="-25"
                max="25"
                value={focusOffset}
                onChange={(e) => setFocusOffset(Number(e.target.value))}
                className="w-full accent-pink-400"
              />
            </div>

            <button
              onClick={runAuditScan}
              disabled={isAuditing}
              className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isAmber ? 'bg-[#FFBF00] text-black hover:bg-amber-400' : 'bg-[#00FFFF] text-black hover:bg-cyan-300'
              }`}
            >
              <Target className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'Auditing Silicon Lattice...' : 'Trigger Valerie 300x Scan'}</span>
            </button>
          </div>
        </div>

        {/* Telemetry Log */}
        <div className="p-4 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md flex-1 overflow-y-auto space-y-2">
          <span className="text-gray-400 uppercase tracking-wider block mb-2 font-bold">
            Valerie Telemetry Log
          </span>
          <div className="space-y-1.5 text-[10px] text-gray-300">
            <div className="p-2 rounded bg-black/60 border border-white/10">
              <span className="text-emerald-400 font-bold">[OPTICAL FEED]</span> Wireless 300x microscope locked. CMOS sensor: Sony IMX335 5MP.
            </div>
            <div className="p-2 rounded bg-black/60 border border-white/10">
              <span className="text-cyan-400 font-bold">[ALIGNMENT]</span> Silicon lattice diffraction: 0.04 µrad variance. Mobile clinic standards verified.
            </div>
            <div className="p-2 rounded bg-black/60 border border-white/10">
              <span className="text-amber-400 font-bold">[PRIMEBUS]</span> Optical audit frame routed to topic: <code className="text-amber-300">katz.valerie.audit.300x</code>.
            </div>
          </div>
        </div>
      </div>

      {/* Right 2 Columns: Live Microscope Viewport */}
      <div className={`lg:col-span-2 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden ${
        isAmber ? 'bg-[#0d0903]/85 border-[#FFBF00]/30' : 'bg-[#080210]/85 border-[#FF00FF]/30'
      }`}>
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white tracking-wide">
              VALERIE 300X WIRELESS OPTICAL SENSOR STREAM
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              {auditComplete ? 'LATTICE INTEGRITY NOMINAL' : 'SCANNING...'}
            </span>
          </div>
        </div>

        {/* Microscope Canvas Viewport */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden group">
          {/* Circular Lens Reticle */}
          <div className="relative w-[480px] h-[480px] rounded-full border-2 border-emerald-500/40 overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)] bg-gradient-to-tr from-emerald-950/40 via-black to-cyan-950/40">
            {/* Silicon Lattice Simulation Pattern */}
            <div 
              className="absolute inset-0 opacity-40 transition-transform duration-300"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(16, 185, 129, 0.4) 1px, transparent 1px), radial-gradient(circle, rgba(0, 255, 255, 0.3) 1px, transparent 1px)`,
                backgroundSize: `${Math.max(12, 400 / zoomLevel * 30)}px ${Math.max(12, 400 / zoomLevel * 30)}px`,
                backgroundPosition: `0 0, ${focusOffset}px ${focusOffset}px`,
                filter: isAuditing ? 'blur(1.5px)' : 'none'
              }}
            />

            {/* Laser Target Scan Sweep */}
            {isAuditing && (
              <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_#00ffff] animate-pulse top-1/2 -translate-y-1/2" />
            )}

            {/* Reticle Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-emerald-500/30" />
              <div className="h-full w-px bg-emerald-500/30 absolute" />
              <div className="w-32 h-32 rounded-full border border-emerald-500/50 absolute" />
              <div className="w-64 h-64 rounded-full border border-emerald-500/30 absolute" />
            </div>

            {/* In-Lens Overlay Readouts */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-emerald-400 font-mono tracking-widest bg-black/60 px-3 py-0.5 rounded-full border border-emerald-500/30">
              VALERIE OPTICAL SENSOR • MAG: {zoomLevel}X
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-cyan-300 font-mono tracking-wider bg-black/60 px-3 py-0.5 rounded-full border border-cyan-500/30">
              FOCUS: {focusOffset > 0 ? `+${focusOffset}` : focusOffset} µm • LASER: {laserIntensity}%
            </div>
          </div>

          {/* Vignette effect */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,black_80%)]" />

          {/* CRT Scanline */}
          <div className="absolute inset-0 crt-scanlines pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
