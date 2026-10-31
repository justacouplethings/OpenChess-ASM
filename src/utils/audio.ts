// Audio Synthesizer for Chess Sound Effects
// Pure Web Audio API synthesis guaranteeing instant zero-latency playback with zero external dependencies

export type SoundEffect =
  | 'move'
  | 'capture'
  | 'check'
  | 'castle'
  | 'promote'
  | 'start'
  | 'end'
  | 'lowtime'
  | 'illegal'
  | 'premove';

class ChessAudioEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private volume: number = 0.8;

  constructor() {
    // Lazy initialized on first user interaction to comply with browser autoplay policies
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public play(effect: SoundEffect) {
    if (!this.soundEnabled) return;
    switch (effect) {
      case 'move':
        this.playMove();
        break;
      case 'capture':
        this.playCapture();
        break;
      case 'check':
        this.playCheck();
        break;
      case 'castle':
        this.playCastle();
        break;
      case 'promote':
        this.playPromote();
        break;
      case 'start':
        this.playGameStart();
        break;
      case 'end':
        this.playGameOver();
        break;
      case 'lowtime':
        this.playLowTime();
        break;
      case 'illegal':
        this.playIllegal();
        break;
      case 'premove':
        this.playPremove();
        break;
    }
  }

  // Chess.com style soft wooden piece tap
  public playMove() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.075);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);

    const baseGain = 0.35 * this.volume;
    gain.gain.setValueAtTime(baseGain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.075);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.075);
  }

  // Sharp piece capture knock with transient pop
  public playCapture() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.09);

    const baseGain = 0.55 * this.volume;
    gain.gain.setValueAtTime(baseGain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  // High alert chime on check
  public playCheck() {
    const ctx = this.getContext();
    if (!ctx) return;

    const freqs = [880, 1046.5]; // A5 -> C6
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      const baseGain = 0.3 * this.volume;
      gain.gain.setValueAtTime(baseGain, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  }

  // Castling double tap
  public playCastle() {
    this.playMove();
    setTimeout(() => this.playMove(), 90);
  }

  // Promotion fanfare flourish
  public playPromote() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.05;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      const baseGain = 0.28 * this.volume;
      gain.gain.setValueAtTime(baseGain, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.28);
    });
  }

  // Game start ascending notification
  public playGameStart() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25]; // A major
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      const baseGain = 0.25 * this.volume;
      gain.gain.setValueAtTime(baseGain, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  // Game over chord
  public playGameOver() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C major chord
    notes.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const baseGain = 0.25 * this.volume;
      gain.gain.setValueAtTime(baseGain, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    });
  }

  // Low time alert (10 seconds remaining tick)
  public playLowTime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, ctx.currentTime);

    const baseGain = 0.2 * this.volume;
    gain.gain.setValueAtTime(baseGain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  // Illegal move buzzer
  public playIllegal() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, ctx.currentTime);

    const baseGain = 0.2 * this.volume;
    gain.gain.setValueAtTime(baseGain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  // Premove confirmation tick
  public playPremove() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.04);

    const baseGain = 0.15 * this.volume;
    gain.gain.setValueAtTime(baseGain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }
}

export const sound = new ChessAudioEngine();
