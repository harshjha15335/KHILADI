import React from 'react';

interface KhiladiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
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
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Rajasthan Royals Inspired Royal Crest Shield */}
      <div className={`${current.crest} relative flex items-center justify-center shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(232,18,116,0.6)]">
          <defs>
            <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E81274" />
              <stop offset="60%" stopColor="#203A8C" />
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
          <path d="M42 72 Q50 78 58 72" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`${current.title} font-display font-bold tracking-tight text-white uppercase`}>
            KHILADI
          </span>
          <span className="font-sans font-medium text-xs px-1.5 py-0.5 rounded bg-[#E81274]/20 text-[#E81274] border border-[#E81274]/30">
            खिलाड़ी
          </span>
        </div>
        {showSubtitle && (
          <span className={`${current.badge} font-mono tracking-widest text-[#D6AF60] uppercase font-semibold`}>
            Cricket Intelligence // RR
          </span>
        )}
      </div>
    </div>
  );
};
