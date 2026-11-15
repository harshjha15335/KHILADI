import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { playClickChime } from '../utils/sound';
import { Flame, TrendingUp, Search } from 'lucide-react';

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
        const filtered = data
          .filter(p => (p.batting.pressure_balls || 0) >= 10)
          .sort((a, b) => (b.batting.pressure_sr || 0) - (a.batting.pressure_sr || 0));
        setPlayers(filtered);
      });
  }, []);

  const displayed = players.filter(p => 
    p.player_name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 30);

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#22263C] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-[#E8E6ED] pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEAF2] border border-[#F5B1CE] text-xs font-mono uppercase text-[#F22E83] font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>High-Leverage Batting Metrics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#22263C]">
            CLUTCH BATTING INTELLIGENCE
          </h1>
          <p className="text-sm text-[#505A70] max-w-2xl leading-relaxed">
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
            className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E8E6ED] text-sm text-[#22263C] placeholder-[#68738A] focus:outline-none focus:border-[#F22E83] shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-3xl border border-[#E8E6ED] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FFF3F8] border-b border-[#F5B1CE]/60 text-xs font-mono uppercase text-[#505A70]">
              <tr>
                <th className="py-4 px-6">Batter</th>
                <th className="py-4 px-6 text-right">Pressure Balls</th>
                <th className="py-4 px-6 text-right">Pressure SR</th>
                <th className="py-4 px-6 text-right">Normal SR</th>
                <th className="py-4 px-6 text-right">SR Delta</th>
                <th className="py-4 px-6 text-right">Pressure Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6ED]">
              {displayed.map(p => (
                <tr
                  key={p.player_id}
                  onClick={() => { playClickChime(); onSelectPlayer(p); }}
                  className="hover:bg-[#FFF1F7] transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#22263C] group-hover:text-[#F22E83] transition-colors">{p.player_name}</div>
                    <div className="text-[10px] font-mono text-[#68738A]">ID #{p.player_id}</div>
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-[#505A70]">{p.batting.pressure_balls || 0}</td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-[#F22E83]">{(p.batting.pressure_sr || 0).toFixed(1)}</td>
                  <td className="py-4 px-6 text-right font-mono text-[#505A70]">{(p.batting.normal_sr || 0).toFixed(1)}</td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-emerald-600">
                    +{(p.batting.sr_delta || 0).toFixed(1)}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-black text-[#22263C]">{(p.pressure_score || 0).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
