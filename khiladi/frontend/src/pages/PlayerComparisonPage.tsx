import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { KhiladiKineticText } from '../components/KhiladiKineticText';
import { playClickChime } from '../utils/sound';
import { SlidersHorizontal, Flame, Shield, ArrowRight } from 'lucide-react';

interface PlayerComparisonPageProps {
  onSelectPlayer: (player: Player) => void;
}

export const PlayerComparisonPage: React.FC<PlayerComparisonPageProps> = ({ onSelectPlayer }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerAId, setPlayerAId] = useState<number>(3297); // Shimron Hetmyer
  const [playerBId, setPlayerBId] = useState<number>(6423); // Riyan Parag

  useEffect(() => {
    fetch('/data/player_database.json')
      .then(r => r.json())
      .then((data: Player[]) => setPlayers(data));
  }, []);

  const playerA = players.find(p => p.player_id === playerAId) || players[0];
  const playerB = players.find(p => p.player_id === playerBId) || players[1];

  return (
    <div className="min-h-screen bg-[#080C1F] text-[#F7F4FA] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border-b border-[#29134F] pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E81274]/15 border border-[#E81274]/30 text-xs font-mono uppercase text-[#E81274]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Head-to-Head Diagnostics</span>
          </div>
          <KhiladiKineticText
            text="CLUTCH PLAYER COMPARISON"
            className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white"
          />
          <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
            Compare two whitelisted players side-by-side across leverage index pressure samples, strike rate deltas, and defensive dot ball percentages.
          </p>
        </div>

        {/* Player Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase text-white/60 mb-2">Select Player A</label>
            <select
              value={playerAId}
              onChange={(e) => setPlayerAId(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white focus:outline-none focus:border-[#E81274]"
            >
              {players.map(p => (
                <option key={p.player_id} value={p.player_id} className="bg-[#080C1F]">
                  {p.player_name} ({p.role}) - PII {p.pressure_impact_index.toFixed(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/60 mb-2">Select Player B</label>
            <select
              value={playerBId}
              onChange={(e) => setPlayerBId(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white focus:outline-none focus:border-[#85A9FF]"
            >
              {players.map(p => (
                <option key={p.player_id} value={p.player_id} className="bg-[#080C1F]">
                  {p.player_name} ({p.role}) - PII {p.pressure_impact_index.toFixed(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Matrix */}
        {playerA && playerB && (
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-8">
            <div className="grid grid-cols-2 gap-8 text-center pb-6 border-b border-white/10">
              <div onClick={() => onSelectPlayer(playerA)} className="cursor-pointer group">
                <div className="w-24 h-24 mx-auto mb-2 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden">
                  {playerA.cutout_url || playerA.portrait_url ? (
                    <img src={playerA.cutout_url || playerA.portrait_url} alt={playerA.player_name} className="w-full h-full object-contain" />
                  ) : <Shield className="w-10 h-10 text-white/30" />}
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-[#E81274] transition-colors">{playerA.player_name}</h3>
                <span className="text-xs text-white/50">{playerA.role} • ID #{playerA.player_id}</span>
              </div>

              <div onClick={() => onSelectPlayer(playerB)} className="cursor-pointer group">
                <div className="w-24 h-24 mx-auto mb-2 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden">
                  {playerB.cutout_url || playerB.portrait_url ? (
                    <img src={playerB.cutout_url || playerB.portrait_url} alt={playerB.player_name} className="w-full h-full object-contain" />
                  ) : <Shield className="w-10 h-10 text-white/30" />}
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-[#85A9FF] transition-colors">{playerB.player_name}</h3>
                <span className="text-xs text-white/50">{playerB.role} • ID #{playerB.player_id}</span>
              </div>
            </div>

            {/* Metrics Rows */}
            <div className="space-y-4 font-mono text-sm">
              {[
                { label: 'Pressure Impact Index (PII)', valA: playerA.pressure_impact_index.toFixed(1), valB: playerB.pressure_impact_index.toFixed(1), higherBetter: true },
                { label: 'High-Pressure Strike Rate', valA: playerA.batting.press_sr.toFixed(1), valB: playerB.batting.press_sr.toFixed(1), higherBetter: true },
                { label: 'Strike Rate Delta over Baseline', valA: (playerA.batting.sr_delta > 0 ? `+${playerA.batting.sr_delta.toFixed(1)}` : playerA.batting.sr_delta.toFixed(1)), valB: (playerB.batting.sr_delta > 0 ? `+${playerB.batting.sr_delta.toFixed(1)}` : playerB.batting.sr_delta.toFixed(1)), higherBetter: true },
                { label: 'High-Pressure Economy Rate', valA: playerA.bowling.press_econ.toFixed(2), valB: playerB.bowling.press_econ.toFixed(2), higherBetter: false },
                { label: 'Pressure Dot Ball %', valA: `${playerA.bowling.press_dot_pct.toFixed(1)}%`, valB: `${playerB.bowling.press_dot_pct.toFixed(1)}%`, higherBetter: true },
                { label: 'Total High-Pressure Deliveries', valA: (playerA.batting.press_balls + playerA.bowling.press_balls).toString(), valB: (playerB.batting.press_balls + playerB.bowling.press_balls).toString(), higherBetter: true }
              ].map((row, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                  <div className="w-1/3 text-left font-bold text-white">{row.valA}</div>
                  <div className="w-1/3 text-center text-xs text-white/50 uppercase">{row.label}</div>
                  <div className="w-1/3 text-right font-bold text-white">{row.valB}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
