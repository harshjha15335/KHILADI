// AUGE-inspired Web Audio API synthesis
// Audio must begin muted unless user opts in. Persistent toggle in localStorage.

let audioCtx: AudioContext | null = null;
let isMuted: boolean = true;
let lastSoundAt = 0;

const safeGetStorage = (key: string): string | null => {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  } catch (e) {
    return null;
  }
};

const safeSetStorage = (key: string, val: string) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, val);
    }
  } catch (e) {}
};

// Initialize mute state from localStorage (default: true)
const stored = safeGetStorage('khiladi_sound_enabled');
isMuted = stored !== 'true';

export const getAudioMuted = () => isMuted;

export const setAudioMuted = (muted: boolean) => {
  isMuted = muted;
  safeSetStorage('khiladi_sound_enabled', (!muted).toString());
};

const initAudio = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playSound = (type: 'hover_tick' | 'button_click' | 'modal_open' | 'quiz_select' | 'chime') => {
  if (isMuted) return;
  const timestamp = performance.now();
  if (timestamp - lastSoundAt < 70) return;
  lastSoundAt = timestamp;
  try {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    const now = audioCtx.currentTime;

    if (type === 'hover_tick') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.03);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'button_click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'modal_open') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'quiz_select') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.1);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'chime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    // Silently handle web audio restrictions
  }
};

export const playHoverChime = () => playSound('hover_tick');
export const playClickChime = () => playSound('button_click');
