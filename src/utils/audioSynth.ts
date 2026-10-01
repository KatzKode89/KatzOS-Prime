// Web Audio API DSP Synthesizer for KatzTunez
// Synthesizes 120 BPM April Rose Melodic House vs 135 BPM Nyptix Industrial Techno

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private bpm = 120;
  private mode: 'amber-gold' | 'neon-fracture' = 'amber-gold';
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private step = 0;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.analyser.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setMode(mode: 'amber-gold' | 'neon-fracture') {
    this.mode = mode;
    this.bpm = mode === 'amber-gold' ? 120 : 135;
    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.step = 0;

    const intervalMs = (60 / this.bpm / 4) * 1000; // 16th notes
    this.timerId = window.setInterval(() => {
      this.playStep();
      this.step = (this.step + 1) % 16;
    }, intervalMs);
  }

  public stop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playStep() {
    if (!this.ctx || !this.analyser) return;
    const now = this.ctx.currentTime;

    if (this.mode === 'amber-gold') {
      // 120 BPM April Rose Melodic House
      // 4-on-the-floor gentle warm kick
      if (this.step % 4 === 0) {
        this.playWarmKick(now);
      }
      // Off-beat open hi-hat
      if (this.step % 4 === 2) {
        this.playSoftHat(now);
      }
      // Lush warm pentatonic chord progression
      if (this.step % 8 === 0) {
        const chordNotes = this.step < 8 ? [146.83, 220.00, 261.63, 329.63] : [130.81, 196.00, 246.94, 293.66]; // Dm7 -> Cmaj7
        this.playAmberChords(chordNotes, now);
      }
    } else {
      // 135 BPM Nyptix Industrial Techno Drive
      // Driving distorted kick on every beat
      if (this.step % 4 === 0) {
        this.playIndustrialKick(now);
      }
      // 16th note metallic drive
      this.playIndustrialHihat(now, this.step % 2 === 0);
      // Aggressive synth stab
      if (this.step % 4 === 2 || this.step === 7 || this.step === 15) {
        this.playAcidStab(now, 110 + (this.step * 12));
      }
    }
  }

  private playWarmKick(time: number) {
    if (!this.ctx || !this.analyser) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(this.analyser);
    osc.start(time);
    osc.stop(time + 0.25);
  }

  private playSoftHat(time: number) {
    if (!this.ctx || !this.analyser) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(8000, time);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6000, time);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.analyser);
    osc.start(time);
    osc.stop(time + 0.08);
  }

  private playAmberChords(frequencies: number[], time: number) {
    if (!this.ctx || !this.analyser) return;
    frequencies.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, time);
      filter.frequency.exponentialRampToValueAtTime(1400, time + 0.4);

      gain.gain.setValueAtTime(0.07, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.analyser!);
      osc.start(time);
      osc.stop(time + 0.85);
    });
  }

  private playIndustrialKick(time: number) {
    if (!this.ctx || !this.analyser) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.15);

    gain.gain.setValueAtTime(0.85, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.analyser);
    osc.start(time);
    osc.stop(time + 0.28);
  }

  private playIndustrialHihat(time: number, isAccent: boolean) {
    if (!this.ctx || !this.analyser) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(11000, time);

    const vol = isAccent ? 0.2 : 0.08;
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.connect(gain);
    gain.connect(this.analyser);
    osc.start(time);
    osc.stop(time + 0.05);
  }

  private playAcidStab(time: number, freq: number) {
    if (!this.ctx || !this.analyser) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, time);
    filter.Q.setValueAtTime(8, time);
    filter.frequency.exponentialRampToValueAtTime(400, time + 0.18);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.analyser);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  // Barry the Bunny (Baritone RMVPE RVC v2 Voice Preview)
  public speakBarryVoicePreview(text = "Barry the Bunny baritone online. PrimeBus telemetry confirmed.") {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.55; // Low baritone
      utterance.rate = 0.88;
      utterance.volume = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }

  // DJ KrazyKat (Subharmonic crossfader)
  public speakDJVoicePreview(text = "DJ KrazyKat dropping 135 BPM industrial techno drive into the TrueXR cockpit.") {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.35; // Energetic electro
      utterance.rate = 1.15;
      window.speechSynthesis.speak(utterance);
    }
  }
}

export const audioEngine = new AudioEngine();
