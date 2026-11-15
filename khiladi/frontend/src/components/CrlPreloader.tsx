import React, { useEffect, useState } from 'react';
import { KhiladiLogo } from './KhiladiLogo';

interface CrlPreloaderProps {
  onComplete: () => void;
}

const safeGetSession = (key: string): string | null => {
  try {
    return typeof window !== 'undefined' ? sessionStorage.getItem(key) : null;
  } catch (e) {
    return null;
  }
};

const safeSetSession = (key: string, val: string) => {
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, val);
    }
  } catch (e) {}
};

export const CrlPreloader: React.FC<CrlPreloaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'open' | 'zoom' | 'fade' | 'done'>('open');

  useEffect(() => {
    // Check if user already saw intro in current session
    const seen = safeGetSession('khiladi_intro_seen');
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    if (seen === 'true' || prefersReducedMotion) {
      setStage('done');
      onComplete();
      return;
    }

    // Sequence: 0ms: Open -> 700ms: Zoom In -> 1400ms: Fade -> 1800ms: Complete
    const t1 = setTimeout(() => setStage('zoom'), 600);
    const t2 = setTimeout(() => setStage('fade'), 1300);
    const t3 = setTimeout(() => {
      safeSetSession('khiladi_intro_seen', 'true');
      setStage('done');
      onComplete();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (stage === 'done') return null;

  const handleSkip = () => {
    safeSetSession('khiladi_intro_seen', 'true');
    setStage('done');
    onComplete();
  };

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#080C1F] select-none transition-opacity duration-500 ease-out ${
        stage === 'fade' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background glow lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#E81274] to-[#203A8C] rounded-full blur-[140px]" />
      </div>

      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          stage === 'zoom'
            ? 'scale-[2.4] opacity-0 blur-sm'
            : 'scale-100 opacity-100 blur-0'
        }`}
      >
        <KhiladiLogo size="lg" showSubtitle={false} />
        <div className="mt-4 font-mono text-xs tracking-[0.3em] text-[#D6AF60] uppercase">
          EST. 2008 // PRESSURE ARCHIVE
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 font-mono text-xs text-[#9DA3B4] hover:text-white uppercase tracking-widest border border-white/10 px-3 py-1.5 rounded-full transition-colors"
      >
        Skip [ESC]
      </button>
    </div>
  );
};
