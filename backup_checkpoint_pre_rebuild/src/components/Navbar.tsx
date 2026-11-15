import React, { useState } from 'react';
import { KhiladiLogo } from './KhiladiLogo';
import { SoundToggle } from './SoundToggle';
import { playHoverChime, playClickChime } from '../utils/sound';
import { 
  BarChart3, 
  Users, 
  Flame, 
  Award, 
  ShieldAlert, 
  FileText, 
  Compass, 
  SlidersHorizontal,
  Layers,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  rrPurseCr?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onNavigate, 
  rrPurseCr = 120.0 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'command-centre', label: 'Command Centre', icon: Layers },
    { id: 'rankings', label: 'Top 10 Rankings', icon: Award, highlight: true },
    { id: 'database', label: 'Player Database', icon: Users },
    { id: 'pressure-lab', label: 'Pressure Lab', icon: Flame },
    { id: 'batting-intel', label: 'Batting Intel', icon: BarChart3 },
    { id: 'bowling-intel', label: 'Bowling Intel', icon: BarChart3 },
    { id: 'comparison', label: 'Comparison', icon: SlidersHorizontal },
    { id: 'war-room', label: 'War Room', icon: ShieldAlert },
    { id: 'methodology', label: 'Methodology & PDF', icon: FileText }
  ];

  const handleNavClick = (pageId: string) => {
    playClickChime();
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080C1F]/85 backdrop-blur-xl border-b border-[#29134F]/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          className="cursor-pointer flex items-center gap-3 group"
          onClick={() => handleNavClick('home')}
          onMouseEnter={playHoverChime}
        >
          <KhiladiLogo size="sm" showSubtitle={true} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={playHoverChime}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-[#E81274]/20 border border-[#E81274]/60 shadow-[0_0_12px_rgba(232,18,116,0.3)]'
                    : item.highlight
                    ? 'text-[#F5B400] hover:text-white hover:bg-white/5 border border-[#F5B400]/40'
                    : 'text-[#F7F4FA]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-3.5 h-3.5 opacity-80" />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-[#E81274] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Purse, Sound Toggle, Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Live RR Purse Ticker */}
          <div className="hidden sm:flex flex-col items-end px-3 py-1 rounded-lg bg-[#203A8C]/20 border border-[#203A8C]/40">
            <span className="text-[10px] tracking-wider uppercase text-[#F5B400] font-mono">
              RR Auction Purse
            </span>
            <span className="text-xs font-mono font-bold text-white tracking-tight">
              ₹{rrPurseCr.toFixed(1)} Cr
            </span>
          </div>

          {/* Sound Toggle */}
          <SoundToggle />

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => {
              playClickChime();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="xl:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#080C1F]/98 border-b border-[#29134F] px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#E81274]/20 border border-[#E81274]/60 text-white'
                    : 'text-[#F7F4FA]/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4 text-[#E81274]" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono text-[#F5B400] px-2">
            <span>Rajasthan Royals Purse:</span>
            <span className="font-bold text-white">₹{rrPurseCr.toFixed(1)} Cr</span>
          </div>
        </div>
      )}
    </header>
  );
};
