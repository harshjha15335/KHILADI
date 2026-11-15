import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getAudioMuted, setAudioMuted, playSound } from "../utils/sound";

export const SoundToggle: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    setMuted(getAudioMuted());
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
    if (!next) {
      setTimeout(() => playSound("chime"), 50);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={!muted}
      title={muted ? "Enable interface sound" : "Mute interface sound"}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all duration-300 cursor-pointer ${
        muted
          ? "bg-[#FFFDF8] text-[#505A70] border-[#E8E6ED] hover:border-[#F5B1CE]"
          : "bg-[#FFEAF2] text-[#F22E83] border-[#F22E83] shadow-[0_2px_10px_rgba(242,46,131,0.2)] font-bold"
      } ${className}`}
    >
      {muted ? (
        <VolumeX className="w-3.5 h-3.5 text-[#68738A]" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-[#F22E83]" />
      )}
      <span>{muted ? "SOUND: OFF" : "SOUND: ON"}</span>
    </button>
  );
};
