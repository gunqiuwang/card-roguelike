// Audio manager for game sounds
class AudioManager {
  private audioContext: AudioContext | null = null;
  private muted: boolean = false;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (this.muted) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  playCardPlay(): void {
    this.playTone(440, 0.1, 'sine');
  }

  playAttack(): void {
    this.playTone(220, 0.15, 'sawtooth');
  }

  playHeal(): void {
    this.playTone(880, 0.2, 'sine');
    setTimeout(() => this.playTone(1100, 0.1, 'sine'), 100);
  }

  playVictory(): void {
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine'), i * 150);
    });
  }

  playDefeat(): void {
    [400, 350, 300, 250].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sawtooth'), i * 200);
    });
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }
}

export const audioManager = new AudioManager();

// Haptic feedback
export function vibrate(duration: number = 50): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}

export function vibratePattern(pattern: number[]): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}