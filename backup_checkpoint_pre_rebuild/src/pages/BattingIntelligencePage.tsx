import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { KhiladiKineticText } from '../components/KhiladiKineticText';
import { playClickChime } from '../utils/sound';
import { Flame, TrendingUp, Search, Award } from 'lucide-react';

interface BattingIntelligencePageProps {
  onSelectPlayer: (player: Player) => void;
}

export const BattingIntelligencePage: React.FC<BattingIntelligencePageProps> = ({ onSelectPlayer }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/data/player_database.json')
      .then(r => r.json())
      .then((data: Player[]) => {
        // filter batters with at least 10 high-pressure balls
        const filtered = data
          .filter(p => p.batting.press_balls >= 10)
          .sort((a, b) => b.batting.press_sr - a.batting.press_sr);
        setPlayers(filtered);
      });
  }, []);

  const displayed = players.filter(p => 
    p.player_name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 30);

  return (
    <div className="min-h-screen bg-[#080C1F] text-[#F7F4FA] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-[#29134F] pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E81274]/15 border border-[#E81274]/30 text-xs font-mono uppercase text-[#E81274]">
            <Flame className="w-3.5 h-3.5" />
            <span>High-Leverage Batting Metrics</span>
          </div>
          <KhiladiKineticText
            text="CLUTCH BATTING INTELLIGENCE"
            className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white"
          />
          <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
            Decomposing batting potency when required run rates spike. Highlighting positive strike-rate delta over regular baseline.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search clutch batters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#E81274]"
          />
        </div>

        {/* Batters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((p) => (
            <div
              key={p.player_id}
              onClick={() => {
                playClickChime();
                onSelectPlayer(p);
              }}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#E81274] transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-white group-hover:text-[#E81274] transition-colors truncate">
                    {p.player_name}
                  </h4>
                  <span className="text-xs text-white/50">{p.role} • ID #{p.player_id}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#F5B400]">
                    PII {p.pressure_impact_index.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/5">
                <div className="p-2 rounded bg-black/30">
                  <div className="text-[9px] font-mono uppercase text-white/40">Pressure SR</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {p.batting.press_sr.toFixed(1)}
                  </div>
                </div>
                <div className="p-2 rounded bg-black/30">
                  <div className="text-[9px] font-mono uppercase text-white/40">Overall SR</div>
                  <div className="text-sm font-bold font-mono text-white/70 mt-0.5">
                    {p.batting.overall_sr.toFixed(1)}
                  </div>
                </div>
                <div className={`p-2 rounded bg-black/30 ${p.batting.sr_delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <div className="text-[9px] font-mono uppercase text-white/40">SR Delta</div>
                  <div className="text-sm font-bold font-mono mt-0.5">
                    {p.batting.sr_delta > 0 ? `+${p.batting.sr_delta.toFixed(1)}` : p.batting.sr_delta.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-mono text-white/60 pt-1">
                <span>Pressure Balls: {p.batting.press_balls}</span>
                <span>Boundary %: {p.batting.press_boundary_pct.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
