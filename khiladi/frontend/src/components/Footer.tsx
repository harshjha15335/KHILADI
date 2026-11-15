import React from 'react';
import { playClickChime } from '../utils/sound';
import { Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative bg-[#FFFDF8] border-t border-[#E8E6ED] text-[#505A70] pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid: Brand, Mission, Quick Links, Competition Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <span className="font-display font-black text-2xl tracking-tighter text-[#22263C]">
              KHILADI
            </span>
            <p className="text-xs text-[#68738A] leading-relaxed">
              KHILADI (खिलाड़ी) is an independent cricket pressure intelligence platform engineered for the Rajasthan Royals SupeRR Selector Season 2 competition on Unstop.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#2549BD]">
              <Award className="w-3.5 h-3.5 text-[#F22E83]" />
              <span>Rajasthan Royals SupeRR Selector 2026</span>
            </div>
          </div>

          {/* Core Analytics Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#22263C] font-bold">
              Intelligence Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('rankings'); }}
                  className="hover:text-[#F22E83] transition-colors cursor-pointer"
                >
                  Top 10 Batters & Bowlers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('database'); }}
                  className="hover:text-[#F22E83] transition-colors cursor-pointer"
                >
                  Canonical Player Archive (1,217)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('pressure-lab'); }}
                  className="hover:text-[#F22E83] transition-colors cursor-pointer"
                >
                  Pressure Lab & Ball Scrubber
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('batting-intel'); }}
                  className="hover:text-[#F22E83] transition-colors cursor-pointer"
                >
                  High-Leverage Batting Metrics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('bowling-intel'); }}
                  className="hover:text-[#F22E83] transition-colors cursor-pointer"
                >
                  Death Overs Bowling Index
                </button>
              </li>
            </ul>
          </div>

          {/* Strategy & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#22263C] font-bold">
              Strategy & War Room
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('war-room'); }}
                  className="hover:text-[#F22E83] transition-colors cursor-pointer"
                >
                  Auction War Room (₹120 Cr Purse)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('comparison'); }}
                  className="hover:text-[#F22E83] transition-colors cursor-pointer"
                >
                  Head-to-Head Comparison
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('command-centre'); }}
                  className="hover:text-[#F22E83] transition-colors cursor-pointer"
                >
                  Command Centre
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('methodology'); }}
                  className="hover:text-[#F22E83] transition-colors cursor-pointer"
                >
                  Methodology & PDF Audit
                </button>
              </li>
            </ul>
          </div>

          {/* Scientific Integrity */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#22263C] font-bold">
              Governance & Whitelist
            </h4>
            <div className="p-3.5 rounded-xl bg-[#FFEAF2] border border-[#F5B1CE] text-[11px] text-[#505A70] leading-relaxed">
              <span className="font-bold text-[#F22E83] block mb-1">100% Whitelist Enforced</span>
              Strictly limited to the 1,217 players verified in the official competition data pack. Zero hallucinated external rosters.
            </div>
            <div className="text-[11px] text-[#68738A]">
              Portraits sourced exclusively from IPL official player pages under fair use research standards.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 border-t border-[#E8E6ED] flex flex-col sm:flex-row items-center justify-between text-xs text-[#68738A] gap-4">
          <div>
            © 2026 KHILADI Intelligence. Built for Rajasthan Royals SupeRR Selector S2.
          </div>
          <div className="flex items-center gap-6">
            <span>Delta Cafés Reference Blueprint</span>
            <span>AUGE XP Motion Design</span>
            <span>Cyera Interaction Mechanics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
