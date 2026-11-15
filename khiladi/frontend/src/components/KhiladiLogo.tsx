import React from 'react';

interface KhiladiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
}

export const KhiladiLogo: React.FC<KhiladiLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true
}) => {
  const sizeMap = {
    sm: { crest: 'w-7 h-7', title: 'text-lg', badge: 'text-[9px]' },
    md: { crest: 'w-10 h-10', title: 'text-2xl', badge: 'text-[11px]' },
    lg: { crest: 'w-16 h-16', title: 'text-4xl', badge: 'text-sm' },
    hero: { crest: 'w-28 h-28 sm:w-36 sm:h-36', title: 'text-5xl sm:text-6xl', badge: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-4 select-none ${className}`}>
      {/* Rajasthan Royals Inspired Royal Crest Shield */}
      <div className={`${current.crest} relative flex items-center justify-center shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_24px_rgba(232,18,116,0.7)]">
          <defs>
            <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E81274" />
              <stop offset="50%" stopColor="#203A8C" />
              <stop offset="100%" stopColor="#D6AF60" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D061" />
              <stop offset="100%" stopColor="#D6AF60" />
            </linearGradient>
          </defs>
          {/* Royal Shield Outline */}
          <path
            d="M50 5 L88 22 C88 65 50 95 50 95 C50 95 12 65 12 22 Z"
            fill="url(#crestGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
          />
          {/* Crown / Lion Monogram Motif */}
          <path
            d="M32 46 L38 28 L50 38 L62 28 L68 46 L60 52 L50 48 L40 52 Z"
            fill="url(#goldGrad)"
          />
          <circle cx="50" cy="62" r="5" fill="#FFFFFF" />
          <path
            d="M36 72 Q50 66 64 72"
            stroke="url(#goldGrad)"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      </div>

      {size !== 'hero' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-display font-black tracking-tighter text-white ${current.title}`}>
              KHILADI
            </span>
            <span className="text-[#E81274] font-bold text-xs uppercase font-mono">
              खिलाड़ी
            </span>
          </div>
          {showSubtitle && (
            <span className={`font-mono text-white/50 tracking-widest uppercase ${current.badge}`}>
              Cricket Pressure Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};
