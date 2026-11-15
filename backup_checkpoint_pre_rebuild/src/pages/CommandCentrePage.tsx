import React from 'react';
import { KhiladiKineticText } from '../components/KhiladiKineticText';
import { playClickChime } from '../utils/sound';
import { 
  Layers, 
  Flame, 
  ShieldCheck, 
  Award, 
  Users, 
  ArrowRight, 
  Shield, 
  Activity, 
  Trophy 
} from 'lucide-react';

interface CommandCentrePageProps {
  onNavigate: (page: string) => void;
  rrPurseCr?: number;
}

export const CommandCentrePage: React.FC<CommandCentrePageProps> = ({ onNavigate, rrPurseCr = 120.0 }) => {
  return (
    <div className="min-h-screen bg-[#080C1F] text-[#F7F4FA] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="border-b border-[#29134F] pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E81274]/15 border border-[#E81274]/30 text-xs font-mono uppercase text-[#E81274]">
            <Layers className="w-3.5 h-3.5" />
            <span>Executive Overview & Control</span>
          </div>
          <KhiladiKineticText
            text="OPERATIONAL COMMAND CENTRE"
            className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white"
          />
          <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
            Central orchestration hub for the Rajasthan Royals SupeRR Selector campaign. Real-time data telemetry, high-stakes leverage metrics, and roster status.
          </p>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => { playClickChime(); onNavigate('rankings'); }}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#E81274] transition-all cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between text-white/50 text-xs font-mono uppercase">
              <span>Top 10 Rankings</span>
              <Award className="w-4 h-4 text-[#F5B400]" />
            </div>
            <div className="text-3xl font-black font-mono text-white group-hover:text-[#E81274] transition-colors">
              20 Players
            </div>
            <div className="text-xs text-white/50">Top 10 Batters & Bowlers verified</div>
          </div>

          <div 
            onClick={() => { playClickChime(); onNavigate('database'); }}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#85A9FF] transition-all cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between text-white/50 text-xs font-mono uppercase">
              <span>Player Archive</span>
              <Users className="w-4 h-4 text-[#85A9FF]" />
            </div>
            <div className="text-3xl font-black font-mono text-white group-hover:text-[#85A9FF] transition-colors">
              1,217
            </div>
            <div className="text-xs text-white/50">Whitelisted competition roster</div>
          </div>

          <div 
            onClick={() => { playClickChime(); onNavigate('pressure-lab'); }}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#E81274] transition-all cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between text-white/50 text-xs font-mono uppercase">
              <span>Pressure Balls</span>
              <Flame className="w-4 h-4 text-[#E81274]" />
            </div>
            <div className="text-3xl font-black font-mono text-[#E81274]">
              65,630
            </div>
            <div className="text-xs text-white/50">Leverage Index ≥ 1.80 deliveries</div>
          </div>

          <div 
            onClick={() => { playClickChime(); onNavigate('war-room'); }}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#F5B400] transition-all cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between text-white/50 text-xs font-mono uppercase">
              <span>Auction Purse</span>
              <Shield className="w-4 h-4 text-[#F5B400]" />
            </div>
            <div className="text-3xl font-black font-mono text-[#F5B400]">
              ₹{rrPurseCr.toFixed(1)} Cr
            </div>
            <div className="text-xs text-white/50">Available for 2026 auction draft</div>
          </div>
        </div>

        {/* Core Strategy Modules Navigation */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-display text-white">Platform Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'rankings', title: 'Top 10 Pressure Rankings', desc: 'Official submission tables for batters and bowlers under LI ≥ 1.8.', icon: Award, color: 'text-[#F5B400]' },
              { id: 'database', title: 'Archival Player Database', desc: 'CRL-style dense index of 1,217 players with IPL official portraits.', icon: Users, color: 'text-[#85A9FF]' },
              { id: 'pressure-lab', title: 'The Pressure Lab', desc: 'Ball-by-ball interactive timeline scrubber with live win probability.', icon: Flame, color: 'text-[#E81274]' },
              { id: 'batting-intel', title: 'Batting Intelligence', desc: 'Analysis of strike-rate deltas, dot ball resistance and death over power.', icon: Activity, color: 'text-emerald-400' },
              { id: 'bowling-intel', title: 'Bowling Intelligence', desc: 'Sub-10 economy death pacers and mystery spinners under pressure.', icon: ShieldCheck, color: 'text-[#85A9FF]' },
              { id: 'war-room', title: 'Auction War Room', desc: 'Interactive salary cap optimizer for the Rajasthan Royals squad.', icon: Shield, color: 'text-[#F5B400]' }
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => { playClickChime(); onNavigate(m.id); }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#E81274] transition-all cursor-pointer group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-white/5 ${m.color}`}>
                    <m.icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white group-hover:text-[#E81274] transition-colors">{m.title}</h4>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
