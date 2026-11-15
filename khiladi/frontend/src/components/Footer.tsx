import React from 'react';
import { KhiladiLogo } from './KhiladiLogo';
import { playClickChime } from '../utils/sound';
import { Shield, ExternalLink, Award, FileText } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative bg-[#050714] border-t border-[#29134F]/80 text-[#F7F4FA]/70 pt-16 pb-12 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#E81274]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid: Brand, Mission, Quick Links, Competition Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <KhiladiLogo size="md" showSubtitle={true} />
            <p className="text-xs text-white/60 leading-relaxed">
              KHILADI (खिलाड़ी) is an independent cricket pressure intelligence platform engineered for the Rajasthan Royals SupeRR Selector Season 2 competition on Unstop.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#F5B400]">
              <Award className="w-3.5 h-3.5" />
              <span>Rajasthan Royals SupeRR Selector 2026</span>
            </div>
          </div>

          {/* Core Analytics Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/90">
              Intelligence Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('rankings'); }}
                  className="hover:text-[#E81274] transition-colors"
                >
                  Top 10 Batters & Bowlers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('database'); }}
                  className="hover:text-[#E81274] transition-colors"
                >
                  Canonical Player Archive (1,217)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('pressure-lab'); }}
                  className="hover:text-[#E81274] transition-colors"
                >
                  Pressure Lab & Ball Scrubber
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('batting-intel'); }}
                  className="hover:text-[#E81274] transition-colors"
                >
                  High-Leverage Batting Metrics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('bowling-intel'); }}
                  className="hover:text-[#E81274] transition-colors"
                >
                  Death Overs Bowling Index
                </button>
              </li>
            </ul>
          </div>

          {/* Strategy & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/90">
              Strategy & War Room
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('war-room'); }}
                  className="hover:text-[#E81274] transition-colors"
                >
                  Auction War Room (₹120 Cr Purse)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('comparison'); }}
                  className="hover:text-[#E81274] transition-colors"
                >
                  Head-to-Head Comparison
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('command-centre'); }}
                  className="hover:text-[#E81274] transition-colors"
                >
                  Executive Command Centre
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { playClickChime(); onNavigate('methodology'); }}
                  className="hover:text-[#E81274] transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-[#E81274]" />
                  <span>Submission Methodology Report</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Strict Data Rights & Compliance */}
          <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#85A9FF] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Data & Rights Integrity
            </h4>
            <p className="text-[11px] text-white/50 leading-relaxed">
              All player records are strictly limited to the canonical competition dataset (<code>competition_team_player_mapping.csv</code>). Player headshots are authenticated solely from the official IPL platform (<code>iplt20.com</code>).
            </p>
            <div className="pt-1">
              <a
                href="https://www.iplt20.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#85A9FF] hover:text-white"
              >
                <span>Official IPL Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© 2026 KHILADI Platform • Built for Rajasthan Royals SupeRR Selector • All Rights Reserved</p>
          <p className="font-mono text-[11px]">Designed with inspiration from Delta Cafés, AUGE, Cyera & CRL</p>
        </div>
      </div>
    </footer>
  );
};
