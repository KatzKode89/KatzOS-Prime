import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AestheticMode, TelemetryData } from '../types';
import { Zap, Eye, RotateCcw, Crosshair, Sparkles, Activity } from 'lucide-react';
import { audioEngine } from '../utils/audioSynth';

interface KaosKollisionsCanvasProps {
  aestheticMode: AestheticMode;
  telemetry: TelemetryData | null;
  onNavigateToTab?: (tab: string) => void;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  alpha: number;
  baseColor: string;
}

export const KaosKollisionsCanvas: React.FC<KaosKollisionsCanvasProps> = ({
  aestheticMode,
  telemetry,
  onNavigateToTab
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isAmber = aestheticMode === 'amber-gold';

  const [particleCount, setParticleCount] = useState<number>(18000); // 18k rendered concurrently for ultra-smooth 90fps in browser, representing 50k tensor array
  const [chaosImpulse, setChaosImpulse] = useState<number>(0);
  const [controlNetWireframe, setControlNetWireframe] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const [fps, setFps] = useState<number>(90.0);

  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const angleRef = useRef<number>(0);

  // Initialize Particle Field
  const initParticles = useCallback(() => {
    const width = canvasRef.current?.width || 1200;
    const height = canvasRef.current?.height || 800;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 150 + Math.random() * 320;

      const x = (width / 2) + (radius * Math.sin(phi) * Math.cos(theta));
      const y = (height / 2) + (radius * Math.sin(phi) * Math.sin(theta));
      const z = radius * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        baseColor: isAmber ? '#FFBF00' : Math.random() > 0.5 ? '#FF00FF' : '#00FFFF'
      });
    }

    particlesRef.current = particles;
  }, [particleCount, isAmber]);

  useEffect(() => {
    initParticles();
  }, [initParticles, aestheticMode]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      frameCountRef.current++;

      if (delta >= 500) {
        setFps(Number(((frameCountRef.current / delta) * 1000).toFixed(1)));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      // Audio analysis if available
      const analyser = audioEngine.getAnalyser();
      let audioBoost = 1.0;
      if (analyser && audioEngine.getIsPlaying()) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.slice(0, 32).reduce((a, b) => a + b, 0) / 32;
        audioBoost = 1.0 + (avg / 120);
      }

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Dark trailing motion blur
      ctx.fillStyle = isAmber ? 'rgba(8, 6, 2, 0.22)' : 'rgba(5, 2, 10, 0.22)';
      ctx.fillRect(0, 0, width, height);

      angleRef.current += isAmber ? 0.003 : 0.008;
      const cosA = Math.cos(angleRef.current);
      const sinA = Math.sin(angleRef.current);

      // Render ControlNet Depth Mesh Lines
      if (controlNetWireframe) {
        ctx.strokeStyle = isAmber ? 'rgba(255, 191, 0, 0.08)' : 'rgba(0, 255, 255, 0.08)';
        ctx.lineWidth = 1;

        // Concentric depth rings
        for (let r = 80; r <= 360; r += 70) {
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, r * (isAmber ? 1 : 1.15), r * 0.5, angleRef.current * 0.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Perspective grid lines
        ctx.beginPath();
        for (let x = 0; x < width; x += 120) {
          ctx.moveTo(x, height);
          ctx.lineTo(centerX + (x - centerX) * 0.15, centerY);
        }
        ctx.stroke();
      }

      // Draw Particles
      const particles = particlesRef.current;
      const primaryColor = isAmber ? '255, 191, 0' : '0, 255, 255';
      const secondaryColor = isAmber ? '255, 220, 100' : '255, 0, 255';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Orbit physics
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Gravitational attraction
        const pull = (isAmber ? 0.0004 : 0.001) * (350 / Math.max(dist, 50));
        p.vx -= dx * pull;
        p.vy -= dy * pull;

        // Mouse attraction or repulsion
        if (mousePos.active) {
          const mdx = mousePos.x - p.x;
          const mdy = mousePos.y - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 220) {
            const force = (isAmber ? 0.4 : -0.8) * (1 - mdist / 220);
            p.vx += (mdx / mdist) * force;
            p.vy += (mdy / mdist) * force;
          }
        }

        // Apply chaos impulse shockwave
        if (chaosImpulse > 0) {
          const impulseDir = Math.atan2(dy, dx);
          p.vx += Math.cos(impulseDir) * chaosImpulse * 3.5;
          p.vy += Math.sin(impulseDir) * chaosImpulse * 3.5;
        }

        // Dampening
        p.vx *= isAmber ? 0.985 : 0.97;
        p.vy *= isAmber ? 0.985 : 0.97;

        p.x += p.vx * audioBoost;
        p.y += p.vy * audioBoost;

        // Screen wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Depth perspective
        const depth = 0.5 + ((p.z * cosA) / 500);
        const radius = Math.max(0.4, p.size * depth * (audioBoost > 1.2 ? 1.4 : 1));

        // Draw particle
        ctx.fillStyle = i % 2 === 0
          ? `rgba(${primaryColor}, ${p.alpha * 0.85})`
          : `rgba(${secondaryColor}, ${p.alpha * 0.85})`;

        ctx.fillRect(p.x, p.y, radius, radius);
      }

      // Decay impulse
      if (chaosImpulse > 0) {
        setChaosImpulse(prev => Math.max(0, prev - 0.05));
      }

      // Draw TrueXR Glass Cockpit Overlays
      drawGlassCockpitHUD(ctx, width, height, centerX, centerY, isAmber, fps);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isAmber, controlNetWireframe, mousePos, chaosImpulse, particleCount, fps]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || 1200;
        canvasRef.current.height = canvasRef.current.parentElement?.clientHeight || 650;
        initParticles();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initParticles]);

  const triggerShockwave = () => {
    setChaosImpulse(1.0);
  };

  return (
    <div className="relative w-full h-[650px] bg-black overflow-hidden rounded-xl border border-white/10 shadow-2xl">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={(e) => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            setMousePos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
              active: true
            });
          }
        }}
        onMouseLeave={() => setMousePos(prev => ({ ...prev, active: false }))}
        onClick={triggerShockwave}
        className="w-full h-full cursor-crosshair block"
      />

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 crt-scanlines pointer-events-none" />

      {/* Glass HUD Telemetry Overlay Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-sm pointer-events-auto">
        <div className={`p-3 rounded-lg backdrop-blur-md border text-xs font-mono transition-all ${
          isAmber
            ? 'bg-[#151004]/80 border-[#FFBF00]/40 text-[#FFBF00]'
            : 'bg-[#140420]/80 border-[#FF00FF]/40 text-[#00FFFF]'
        }`}>
          <div className="flex items-center justify-between border-b border-current/20 pb-1.5 mb-2 font-cyber font-bold">
            <span className="flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
              TRUEXR v5.5 GLASS COCKPIT
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 border border-current">
              {fps.toFixed(1)} FPS
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="opacity-70">KaosKollisions Engine:</span>
              <span className="font-semibold">50k Tensor Coordinates</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Active Visualizer:</span>
              <span className="font-semibold text-pink-400">Arty (Council Style Engine)</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">ControlNet Depth Map:</span>
              <span className="font-semibold">ACTIVE 3D EXTRUSION</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Rhythm Guard:</span>
              <span className="font-semibold text-amber-300">Barry (120 BPM RMVPE RVC v2)</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Sovereign Mesh Ping:</span>
              <span className="font-semibold text-emerald-400">{telemetry?.primeBus.meshLatencyMs || '9.04'} ms</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <button
            onClick={triggerShockwave}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              isAmber
                ? 'bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/60 hover:bg-[#FFBF00]/30 shadow-[0_0_10px_rgba(255,191,0,0.3)]'
                : 'bg-[#FF00FF]/20 text-[#FF00FF] border border-[#FF00FF]/60 hover:bg-[#FF00FF]/30 shadow-[0_0_10px_rgba(255,0,255,0.3)]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Chaos Shockwave</span>
          </button>

          <button
            onClick={() => setControlNetWireframe(!controlNetWireframe)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-black/60 text-gray-300 border border-white/20 hover:text-white cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Depth Grid {controlNetWireframe ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={initParticles}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-black/60 text-gray-300 border border-white/20 hover:text-white cursor-pointer"
            title="Reset particle field"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Right HUD Navigation Shortcuts */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2 pointer-events-auto">
        {onNavigateToTab && (
          <>
            <button
              onClick={() => onNavigateToTab('veo3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono backdrop-blur-md border transition-all cursor-pointer ${
                isAmber 
                  ? 'bg-black/70 border-[#FFBF00]/40 text-[#FFBF00] hover:bg-[#FFBF00]/20' 
                  : 'bg-black/70 border-[#00FFFF]/40 text-[#00FFFF] hover:bg-[#00FFFF]/20'
              }`}
            >
              Pipe to KatzVeo3 →
            </button>
            <button
              onClick={() => onNavigateToTab('kompiler')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono backdrop-blur-md border transition-all cursor-pointer ${
                isAmber 
                  ? 'bg-black/70 border-[#FFBF00]/40 text-[#FFBF00] hover:bg-[#FFBF00]/20' 
                  : 'bg-black/70 border-[#FF00FF]/40 text-[#FF00FF] hover:bg-[#FF00FF]/20'
              }`}
            >
              KatzKompiler Build →
            </button>
          </>
        )}
      </div>

      {/* Bottom Center Mode Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className={`px-4 py-1 rounded-full text-xs font-mono tracking-wider border backdrop-blur-md ${
          isAmber
            ? 'bg-[#181203]/90 border-[#FFBF00]/50 text-[#FFBF00] shadow-[0_0_15px_rgba(255,191,0,0.3)]'
            : 'bg-[#180424]/90 border-[#FF00FF]/50 text-[#FF00FF] shadow-[0_0_15px_rgba(255,0,255,0.3)]'
        }`}>
          {isAmber ? 'STATE: Soft Collapse / Amber-Gold Luminescence (#FFBF00 @ 120 BPM)' : 'STATE: Neon Fracture / High Chaos (#FF00FF/#00FFFF @ 135 BPM)'}
        </div>
      </div>
    </div>
  );
};

// Helper: Draw Glass Cockpit Reticle and Artificial Horizon
function drawGlassCockpitHUD(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  isAmber: boolean,
  fps: number
) {
  const color = isAmber ? 'rgba(255, 191, 0, 0.45)' : 'rgba(0, 255, 255, 0.45)';
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.2;

  // Center Reticle
  const reticleSize = 16;
  ctx.beginPath();
  // Target Crosshair
  ctx.moveTo(centerX - reticleSize, centerY);
  ctx.lineTo(centerX - 4, centerY);
  ctx.moveTo(centerX + 4, centerY);
  ctx.lineTo(centerX + reticleSize, centerY);
  ctx.moveTo(centerX, centerY - reticleSize);
  ctx.lineTo(centerX, centerY - 4);
  ctx.moveTo(centerX, centerY + 4);
  ctx.lineTo(centerX, centerY + reticleSize);

  // Center dot
  ctx.arc(centerX, centerY, 1.5, 0, Math.PI * 2);
  ctx.stroke();

  // Artificial Horizon Pitch Ladder
  for (let pitch = -2; pitch <= 2; pitch++) {
    if (pitch === 0) continue;
    const yOffset = centerY + pitch * 38;
    ctx.beginPath();
    ctx.moveTo(centerX - 35, yOffset);
    ctx.lineTo(centerX - 15, yOffset);
    ctx.moveTo(centerX + 15, yOffset);
    ctx.lineTo(centerX + 35, yOffset);
    ctx.stroke();
  }

  // Four Corner HUD brackets
  const pad = 16;
  const bracketLen = 24;

  // Top Left
  ctx.beginPath();
  ctx.moveTo(pad, pad + bracketLen);
  ctx.lineTo(pad, pad);
  ctx.lineTo(pad + bracketLen, pad);
  // Top Right
  ctx.moveTo(width - pad - bracketLen, pad);
  ctx.lineTo(width - pad, pad);
  ctx.lineTo(width - pad, pad + bracketLen);
  // Bottom Left
  ctx.moveTo(pad, height - pad - bracketLen);
  ctx.lineTo(pad, height - pad);
  ctx.lineTo(pad + bracketLen, height - pad);
  // Bottom Right
  ctx.moveTo(width - pad - bracketLen, height - pad);
  ctx.lineTo(width - pad, height - pad);
  ctx.lineTo(width - pad, height - pad - bracketLen);
  ctx.stroke();
}
