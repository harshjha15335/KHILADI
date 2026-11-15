import React, { useState } from 'react';
import { KhiladiLogo } from './KhiladiLogo';
import { SoundToggle } from './SoundToggle';
import { playClickChime, playHoverChime } from '../utils/sound';
import { 
  Users, 
  Flame, 
  Award, 
  ShieldAlert, 
  FileText, 
  Compass, 
  SlidersHorizontal,
  Layers,
  Menu,
  X,
  ArrowRight
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 4 Primary Minimal Links as requested
  const primaryNav = [
    { id: 'home', label: 'Explore' },
    { id: 'database', label: 'Players' },
    { id: 'pressure-lab', label: 'Pressure Lab' },
    { id: 'rankings', label: 'Rankings' },
  ];

  // Secondary Deep-Dive Modules inside Menu Drawer
  const secondaryNav = [
    { id: 'war-room', label: 'Auction War Room', desc: `₹${rrPurseCr.toFixed(1)} Cr salary cap strategy`, icon: ShieldAlert },
    { id: 'comparison', label: 'Player Comparison', desc: 'Dual player head-to-head pressure analytics', icon: SlidersHorizontal },
    { id: 'batting-intel', label: 'Batting Intelligence', desc: 'Strike rate deltas and high-leverage boundaries', icon: Flame },
    { id: 'bowling-intel', label: 'Bowling Intelligence', desc: 'Death overs economy and dot-ball fortress', icon: Award },
    { id: 'command-centre', label: 'Command Centre', desc: 'Executive dashboard and competition telemetry', icon: Layers },
    { id: 'methodology', label: 'Methodology & PDF', desc: 'Empirical Bayes formulation and audit evidence', icon: FileText },
  ];

  const handleNavClick = (pageId: string) => {
    playClickChime();
    onNavigate(pageId);
    setDrawerOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#080C1F]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Wordmark (KHILADI) */}
          <div 
            className="cursor-pointer flex items-center gap-3 group"
            onClick={() => handleNavClick('home')}
            onMouseEnter={playHoverChime}
          >
            <div className="flex items-center gap-2.5">
              <span className="font-display font-black text-2xl tracking-tighter text-white group-hover:text-[#E81274] transition-colors">
                KHILADI
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 uppercase tracking-widest hidden sm:inline-block">
                RR SupeRR Selector
              </span>
            </div>
          </div>

          {/* Minimal 4-Link Primary Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {primaryNav.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={playHoverChime}
                  className={`text-sm font-medium tracking-wide transition-all duration-200 relative py-1 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E81274] rounded-full animate-in fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Sound Toggle + Menu Drawer Button */}
          <div className="flex items-center gap-4">
            <SoundToggle />

            {/* Menu Trigger Button */}
            <button
              onClick={() => {
                playClickChime();
                setDrawerOpen(true);
              }}
              onMouseEnter={playHoverChime}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-medium text-white flex items-center gap-2 transition-all hover:border-[#E81274]/50"
              aria-label="Open Full Navigation Menu"
            >
              <Menu className="w-4 h-4 text-[#E81274]" />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Full Editorial Menu Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setDrawerOpen(false)} />
          
          <div className="relative w-full max-w-md h-full bg-[#080C1F] border-l border-white/10 p-8 flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <div className="text-xl font-bold font-display text-white">Platform Navigation</div>
                  <div className="text-xs font-mono text-[#F5B400] mt-0.5">Rajasthan Royals Intelligence</div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Primary links on mobile */}
              <div className="py-4 space-y-1 md:hidden border-b border-white/10">
                <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Core Chapters</div>
                {primaryNav.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/5 hover:text-[#E81274]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Secondary Module Grid */}
              <div className="py-6 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-3">Intelligence & Strategy</div>
                {secondaryNav.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleNavClick(m.id)}
                    onMouseEnter={playHoverChime}
                    className="w-full p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[#E81274]/40 text-left transition-all group flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-white/5 text-[#E81274] group-hover:scale-110 transition-transform">
                      <m.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white group-hover:text-[#E81274] transition-colors flex items-center justify-between">
                        <span>{m.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-white/50 mt-0.5">{m.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Footer info */}
            <div className="pt-6 border-t border-white/10 text-xs font-mono text-white/40 space-y-1">
              <div className="text-white/60">Purse: <span className="text-[#F5B400] font-bold">₹{rrPurseCr.toFixed(1)} Cr</span></div>
              <div>Rajasthan Royals SupeRR Selector 2026</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
