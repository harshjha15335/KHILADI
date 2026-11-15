import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { playSound } from '../utils/sound';

interface KhiladiAnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'gold' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export const KhiladiAnimatedButton: React.FC<KhiladiAnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  showArrow = true,
  className = '',
  type = 'button'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs font-mono tracking-wider',
    md: 'px-6 py-3 text-sm font-display font-semibold tracking-wide',
    lg: 'px-8 py-4 text-base font-display font-bold tracking-wide',
  };

  const variantStyles = {
    primary: {
      border: 'border-[#E81274]/50',
      bgBase: 'bg-[#101B4B]/80',
      fill: 'bg-gradient-to-r from-[#E81274] to-[#203A8C]',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_rgba(232,18,116,0.35)]'
    },
    secondary: {
      border: 'border-white/20',
      bgBase: 'bg-[#080C1F]',
      fill: 'bg-white',
      text: isHovered ? 'text-[#080C1F]' : 'text-white',
      glow: 'shadow-[0_0_15px_rgba(255,255,255,0.15)]'
    },
    gold: {
      border: 'border-[#D6AF60]/60',
      bgBase: 'bg-[#101B4B]',
      fill: 'bg-gradient-to-r from-[#D6AF60] to-[#E81274]',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_rgba(214,175,96,0.4)]'
    },
    outline: {
      border: 'border-[#E81274]',
      bgBase: 'bg-transparent',
      fill: 'bg-[#E81274]',
      text: 'text-[#F7F4FA]',
      glow: 'shadow-[0_0_15px_rgba(232,18,116,0.2)]'
    }
  };

  const current = variantStyles[variant];

  const handleClick = () => {
    playSound('button_click');
    if (onClick) onClick();
  };

  return (
    <button
      type={type}
      onMouseEnter={() => {
        setIsHovered(true);
        playSound('hover_tick');
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-3 rounded-full border overflow-hidden select-none cursor-pointer transition-all duration-300 ease-out ${sizeClasses[size]} ${current.border} ${current.bgBase} ${current.text} ${isHovered ? current.glow : ''} ${isPressed ? 'scale-95' : 'scale-100'} ${className}`}
    >
      {/* Delta-style upward-wiping masked background pill */}
      <span
        className={`absolute inset-0 w-full h-full ${current.fill} transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none rounded-full`}
        style={{
          transform: isHovered ? 'translateY(0%)' : 'translateY(100%)',
        }}
      />

      {/* Button text label */}
      <span className="relative z-10 transition-transform duration-300 ease-out flex items-center gap-2">
        {children}
      </span>

      {/* Arrow icon with subtle hover displacement */}
      {showArrow && (
        <span
          className="relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: isHovered ? 'translate(2px, -2px) scale(1.15)' : 'translate(0px, 0px) scale(1.0)',
          }}
        >
          <ArrowUpRight className="w-4 h-4" />
        </span>
      )}
    </button>
  );
};
