export class TextToSpeechReader {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  isSupported(): boolean {
    return this.synth !== null;
  }

  speak(
    text: string,
    rate: number = 1.0,
    pitch: number = 1.0,
    onWord?: (charIndex: number, length: number) => void,
    onEnd?: () => void
  ): void {
    if (!this.synth) return;

    this.stop();

    // Clean HTML tags and excessive whitespace
    const cleanText = text.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = Math.min(2, Math.max(0.5, rate));
    utterance.pitch = Math.min(2, Math.max(0.5, pitch));

    // Choose an English natural voice if available (e.g. Microsoft David/Zira or Natural on Windows)
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Microsoft') || v.name.includes('Google'))
    ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onWord) {
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          onWord(event.charIndex, event.charLength || 5);
        }
      };
    }

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.isSpeakingState = true;
    this.synth.speak(utterance);
  }

  pause(): void {
    if (this.synth && this.isSpeakingState) {
      this.synth.pause();
    }
  }

  resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingState = false;
      this.currentUtterance = null;
    }
  }

  isPlaying(): boolean {
    return this.isSpeakingState;
  }
}

export const ttsReader = new TextToSpeechReader();
