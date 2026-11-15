import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { playClickChime } from '../utils/sound';
import { ShieldCheck, TrendingDown, Search } from 'lucide-react';

interface BowlingIntelligencePageProps {
  onSelectPlayer: (player: Player) => void;
}

export const BowlingIntelligencePage: React.FC<BowlingIntelligencePageProps> = ({ onSelectPlayer }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/data/player_database.json')
      .then(r => r.json())
      .then((data: Player[]) => {
        const filtered = data
          .filter(p => (p.bowling.pressure_balls || 0) >= 12 && p.bowling.pressure_econ && p.bowling.pressure_econ > 0)
          .sort((a, b) => (a.bowling.pressure_econ || 99) - (b.bowling.pressure_econ || 99));
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FF] border border-[#B3D4FF] text-xs font-mono uppercase text-[#2549BD] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Death Overs Bowling Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#22263C]">
            DEATH OVERS BOWLING FORTRESS
          </h1>
          <p className="text-sm text-[#505A70] max-w-2xl leading-relaxed">
            Measuring dot-ball percentage and run-suppression composure in high-leverage overs 16–20.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search clutch bowlers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E8E6ED] text-sm text-[#22263C] placeholder-[#68738A] focus:outline-none focus:border-[#2549BD] shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-3xl border border-[#E8E6ED] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#EAF5FF] border-b border-[#B3D4FF]/60 text-xs font-mono uppercase text-[#505A70]">
              <tr>
                <th className="py-4 px-6">Bowler</th>
                <th className="py-4 px-6 text-right">Death Balls</th>
                <th className="py-4 px-6 text-right">Pressure Econ</th>
                <th className="py-4 px-6 text-right">Normal Econ</th>
                <th className="py-4 px-6 text-right">Econ Delta</th>
                <th className="py-4 px-6 text-right">Pressure Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6ED]">
              {displayed.map(p => (
                <tr
                  key={p.player_id}
                  onClick={() => { playClickChime(); onSelectPlayer(p); }}
                  className="hover:bg-[#EAF5FF]/40 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#22263C] group-hover:text-[#2549BD] transition-colors">{p.player_name}</div>
                    <div className="text-[10px] font-mono text-[#68738A]">ID #{p.player_id}</div>
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-[#505A70]">{p.bowling.pressure_balls || 0}</td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-[#2549BD]">{(p.bowling.pressure_econ || 0).toFixed(2)}</td>
                  <td className="py-4 px-6 text-right font-mono text-[#505A70]">{(p.bowling.normal_econ || 0).toFixed(2)}</td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-emerald-600">
                    {(p.bowling.econ_delta || 0).toFixed(2)}
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
