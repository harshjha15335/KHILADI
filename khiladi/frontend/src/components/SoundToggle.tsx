import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { getAudioMuted, setAudioMuted, playSound } from '../utils/sound';

export const SoundToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    setMuted(getAudioMuted());
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
    if (!next) {
      setTimeout(() => playSound('chime'), 50);
    }
  };

  return (
    <button
      onClick={toggle}
      title={muted ? "Enable interface sound (AUGE Sound System)" : "Mute interface sound"}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all duration-300 ${
        muted
          ? 'bg-[#080C1F]/80 text-[#9DA3B4] border-white/10 hover:border-white/20'
          : 'bg-[#E81274]/20 text-[#F7F4FA] border-[#E81274]/60 shadow-[0_0_12px_rgba(232,18,116,0.3)]'
      } ${className}`}
    >
      {muted ? <VolumeX className="w-3.5 h-3.5 text-[#9DA3B4]" /> : <Volume2 className="w-3.5 h-3.5 text-[#E81274]" />}
      <span>{muted ? 'SOUND: OFF' : 'SOUND: ON'}</span>
    </button>
  );
};
