// Tactile Haptic Feedback Utility using the Web Vibration API
// Supports single pulses, patterned pulses, and respect user settings.

class HapticManager {
  public enabled: boolean = true;

  constructor() {
    try {
      const stored = localStorage.getItem('vibecheck_haptics');
      if (stored !== null) {
        this.enabled = stored === 'true';
      }
    } catch {
      this.enabled = true;
    }
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem('vibecheck_haptics', String(this.enabled));
    } catch {
      // ignore
    }
    if (this.enabled) {
      this.light();
    }
    return this.enabled;
  }

  private canVibrate(): boolean {
    return this.enabled && typeof window !== 'undefined' && 'vibrate' in navigator;
  }

  /**
   * Ultra-light click feedback (10ms)
   * Perfect for option selects, tab switches, and quick taps
   */
  public light() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate(10);
    } catch {
      // ignore
    }
  }

  /**
   * Medium click feedback (25ms)
   * For button presses, theme cycling, modal open/close
   */
  public medium() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate(25);
    } catch {
      // ignore
    }
  }

  /**
   * Heavy impact pulse (45ms)
   * For question advancement and mode launches
   */
  public heavy() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate(45);
    } catch {
      // ignore
    }
  }

  /**
   * Celebratory success rhythm: [15ms, 50ms pause, 25ms, 50ms pause, 35ms]
   * For quiz results, streak increases, and Instagram Story exports
   */
  public success() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate([15, 50, 25, 50, 35]);
    } catch {
      // ignore
    }
  }

  /**
   * Dramatic savage roast burn rhythm: [30ms, 40ms pause, 50ms, 40ms pause, 70ms]
   * For Roast Me mode reveals
   */
  public savage() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate([30, 40, 50, 40, 70]);
    } catch {
      // ignore
    }
  }
}

export const haptics = new HapticManager();
