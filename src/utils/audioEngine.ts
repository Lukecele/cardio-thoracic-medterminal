// Web Audio API Synthesizer for Medical Auscultation Sounds
// Generates realistic cardiac heart sounds (S1, S2, S3, murmurs) and respiratory sounds (wheezes, crackles)

class AuscultationEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentInterval: number | null = null;
  private currentNodes: (AudioNode | { stop?: () => void })[] = [];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public stop() {
    this.isPlaying = false;
    if (this.currentInterval) {
      window.clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
    for (const node of this.currentNodes) {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          node.stop();
        }
        if ('disconnect' in node && typeof node.disconnect === 'function') {
          node.disconnect();
        }
      } catch {
        // ignore disconnect errors
      }
    }
    this.currentNodes = [];
  }

  // Play S1 + S2 normal heart sounds
  public playHeartSound(type: 's1-s2' | 'aortic-stenosis' | 's3-gallop' = 's1-s2') {
    this.stop();
    const ctx = this.getContext();
    this.isPlaying = true;

    const beatCycle = () => {
      if (!this.isPlaying) return;
      const now = ctx.currentTime;

      // S1 sound (low pitch ~60-80 Hz, booming)
      this.triggerTone(now, 70, 0.12, 0.4);

      if (type === 'aortic-stenosis') {
        // Harsh crescendo-decrescendo systolic murmur between S1 and S2
        this.triggerNoiseMurmur(now + 0.08, 0.22, 0.35);
      }

      // S2 sound (higher pitch ~100-120 Hz, snappier)
      const s2Time = now + 0.32;
      this.triggerTone(s2Time, 110, 0.08, 0.35);

      if (type === 's3-gallop') {
        // S3 sound in early diastole (~120ms after S2, low pitch ~50 Hz, dull)
        this.triggerTone(s2Time + 0.14, 55, 0.10, 0.25);
      }
    };

    // 72 bpm -> cycle every 830ms
    beatCycle();
    this.currentInterval = window.setInterval(beatCycle, 850);
  }

  // Play respiratory sounds (asthma wheezes or crackles)
  public playLungSound(type: 'wheezing' | 'crackles' = 'wheezing') {
    this.stop();
    const ctx = this.getContext();
    this.isPlaying = true;

    const breathCycle = () => {
      if (!this.isPlaying) return;
      const now = ctx.currentTime;

      if (type === 'wheezing') {
        // Expiratory musical high pitch whistling (400-600 Hz harmonic oscillator)
        this.triggerWheeze(now + 0.8, 1.6, 520, 0.25);
        this.triggerWheeze(now + 1.0, 1.4, 640, 0.18);
      } else {
        // Fine end-inspiratory Velcro crackles (rapid bursts of filtered impulse noise)
        for (let i = 0; i < 8; i++) {
          this.triggerPop(now + 0.4 + i * 0.09, 0.2);
        }
      }
    };

    breathCycle();
    // 14 breaths/min -> ~4.2s per breath cycle
    this.currentInterval = window.setInterval(breathCycle, 3600);
  }

  private triggerTone(startTime: number, freq: number, duration: number, gainVal: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private triggerNoiseMurmur(startTime: number, duration: number, maxGain: number) {
    if (!this.ctx) return;
    // Buffer noise
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter for harsh murmur
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, startTime);
    filter.Q.setValueAtTime(2.0, startTime);

    const gain = this.ctx.createGain();
    const half = duration / 2;
    // Diamond shape: crescendo - decrescendo
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(maxGain, startTime + half);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  private triggerWheeze(startTime: number, duration: number, freq: number, maxGain: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.linearRampToValueAtTime(freq * 1.05, startTime + duration * 0.5);
    osc.frequency.linearRampToValueAtTime(freq * 0.95, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(maxGain, startTime + 0.2);
    gain.gain.linearRampToValueAtTime(maxGain * 0.8, startTime + duration - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private triggerPop(startTime: number, maxGain: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, startTime);

    gain.gain.setValueAtTime(maxGain, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.02);
  }
}

export const audioEngine = new AuscultationEngine();
