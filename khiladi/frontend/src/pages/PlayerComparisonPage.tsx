import React, { useState, useEffect } from 'react';
import { Player } from '../types';
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
    <div className="min-h-screen bg-[#FFFDF8] text-[#22263C] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border-b border-[#E8E6ED] pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEAF2] border border-[#F5B1CE] text-xs font-mono uppercase text-[#F22E83] font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Head-to-Head Diagnostics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#22263C]">
            CLUTCH PLAYER COMPARISON
          </h1>
          <p className="text-sm text-[#505A70] max-w-2xl leading-relaxed">
            Compare two whitelisted players side-by-side across leverage index pressure samples, strike rate deltas, and defensive dot ball percentages.
          </p>
        </div>

        {/* Player Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E8E6ED] shadow-sm space-y-4">
            <label className="block text-xs font-mono uppercase text-[#68738A] font-bold">Select Player A</label>
            <select
              value={playerAId}
              onChange={(e) => setPlayerAId(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] text-sm font-bold text-[#22263C] focus:outline-none focus:border-[#F22E83] cursor-pointer"
            >
              {players.map(p => (
                <option key={p.player_id} value={p.player_id}>
                  {p.player_name} ({p.role}) - ID #{p.player_id}
                </option>
              ))}
            </select>

            {playerA && (
              <div className="space-y-4 pt-4 border-t border-[#E8E6ED]">
                <div className="flex items-center gap-4">
                  <img
                    src={playerA.cutout_url || playerA.portrait_url}
                    alt={playerA.player_name}
                    className="w-16 h-16 object-contain rounded-2xl bg-[#FFEAF2] p-1 border border-[#F5B1CE]"
                  />
                  <div>
                    <h3 className="text-xl font-bold font-display text-[#22263C]">{playerA.player_name}</h3>
                    <div className="text-xs font-mono text-[#F22E83]">Score: {playerA.pressure_score ? playerA.pressure_score.toFixed(1) : '78.5'}</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono text-[#505A70]">
                  <div className="flex justify-between py-1.5 border-b border-[#E8E6ED]">
                    <span>Pressure Strike Rate</span>
                    <strong className="text-[#22263C]">{(playerA.batting.pressure_sr || 0).toFixed(1)}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E8E6ED]">
                    <span>SR Delta</span>
                    <strong className="text-emerald-600">+{(playerA.batting.sr_delta || 0).toFixed(1)}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E8E6ED]">
                    <span>Death Economy</span>
                    <strong className="text-[#2549BD]">{(playerA.bowling.pressure_econ || 0).toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8E6ED] shadow-sm space-y-4">
            <label className="block text-xs font-mono uppercase text-[#68738A] font-bold">Select Player B</label>
            <select
              value={playerBId}
              onChange={(e) => setPlayerBId(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] text-sm font-bold text-[#22263C] focus:outline-none focus:border-[#2549BD] cursor-pointer"
            >
              {players.map(p => (
                <option key={p.player_id} value={p.player_id}>
                  {p.player_name} ({p.role}) - ID #{p.player_id}
                </option>
              ))}
            </select>

            {playerB && (
              <div className="space-y-4 pt-4 border-t border-[#E8E6ED]">
                <div className="flex items-center gap-4">
                  <img
                    src={playerB.cutout_url || playerB.portrait_url}
                    alt={playerB.player_name}
                    className="w-16 h-16 object-contain rounded-2xl bg-[#EAF5FF] p-1 border border-[#B3D4FF]"
                  />
                  <div>
                    <h3 className="text-xl font-bold font-display text-[#22263C]">{playerB.player_name}</h3>
                    <div className="text-xs font-mono text-[#2549BD]">Score: {playerB.pressure_score ? playerB.pressure_score.toFixed(1) : '78.5'}</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono text-[#505A70]">
                  <div className="flex justify-between py-1.5 border-b border-[#E8E6ED]">
                    <span>Pressure Strike Rate</span>
                    <strong className="text-[#22263C]">{(playerB.batting.pressure_sr || 0).toFixed(1)}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E8E6ED]">
                    <span>SR Delta</span>
                    <strong className="text-emerald-600">+{(playerB.batting.sr_delta || 0).toFixed(1)}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E8E6ED]">
                    <span>Death Economy</span>
                    <strong className="text-[#2549BD]">{(playerB.bowling.pressure_econ || 0).toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
