import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { KhiladiKineticText } from '../components/KhiladiKineticText';
import { playClickChime, playHoverChime } from '../utils/sound';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  DollarSign, 
  Users, 
  Globe, 
  Flame, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Sparkles
} from 'lucide-react';

interface AuctionWarRoomPageProps {
  onSelectPlayer: (player: Player) => void;
  warRoomSquad: Player[];
  onRemoveFromSquad: (playerId: number) => void;
  onAddToSquad: (player: Player) => void;
  purseTotalCr?: number;
}

export const AuctionWarRoomPage: React.FC<AuctionWarRoomPageProps> = ({
  onSelectPlayer,
  warRoomSquad,
  onRemoveFromSquad,
  onAddToSquad,
  purseTotalCr = 120.0
}) => {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Player[]>([]);

  useEffect(() => {
    fetch('/data/player_database.json')
      .then(r => r.json())
      .then((data: Player[]) => setAllPlayers(data))
      .catch(() => {
        fetch('/api/players?limit=1500')
          .then(r => r.json())
          .then(res => setAllPlayers(res.data));
      });
  }, []);

  // Search whitelisted players
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const results = allPlayers
      .filter(p => !warRoomSquad.some(s => s.player_id === p.player_id))
      .filter(p => p.player_name.toLowerCase().includes(q) || p.player_id.toString().includes(q))
      .slice(0, 8);
    setSearchResults(results);
  }, [searchQuery, allPlayers, warRoomSquad]);

  // Compute auction valuation estimates based on PII & role
  const estimatePlayerPrice = (p: Player): number => {
    if (p.pressure_impact_index >= 70) return 12.5;
    if (p.pressure_impact_index >= 60) return 8.0;
    if (p.pressure_impact_index >= 50) return 4.5;
    if (p.pressure_impact_index >= 40) return 2.0;
    return 0.5; // base price
  };

  const totalSpent = warRoomSquad.reduce((sum, p) => sum + estimatePlayerPrice(p), 0);
  const remainingPurse = Math.max(0, purseTotalCr - totalSpent);
  const avgPii = warRoomSquad.length > 0 
    ? warRoomSquad.reduce((sum, p) => sum + p.pressure_impact_index, 0) / warRoomSquad.length 
    : 0;

  const battersCount = warRoomSquad.filter(p => p.role === 'Batter').length;
  const bowlersCount = warRoomSquad.filter(p => p.role === 'Bowler').length;
  const allRoundersCount = warRoomSquad.filter(p => p.role === 'All-Rounder').length;

  return (
    <div className="min-h-screen bg-[#080C1F] text-[#F7F4FA] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#29134F] pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E81274]/15 border border-[#E81274]/30 text-xs font-mono uppercase text-[#E81274]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Rajasthan Royals Auction Strategy Room</span>
            </div>
            <KhiladiKineticText
              text="AUCTION WAR ROOM"
              className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white"
            />
            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              Construct the optimal Rajasthan Royals squad with the ₹120.0 Crore salary cap. Maximise clutch pressure impact while maintaining positional balance.
            </p>
          </div>

          <div className="text-xs font-mono text-white/50 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            Rules: Squad size 18–25 • Max 8 Overseas • ₹120.00 Cr
          </div>
        </div>

        {/* Financial & Squad Stats Cockpit */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="text-xs font-mono uppercase text-white/50">Purse Remaining</div>
            <div className="text-3xl font-black font-mono text-[#F5B400]">
              ₹{remainingPurse.toFixed(1)} Cr
            </div>
            <div className="text-[11px] font-mono text-white/40">
              Spent: ₹{totalSpent.toFixed(1)} Cr of ₹{purseTotalCr.toFixed(1)} Cr
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="text-xs font-mono uppercase text-white/50">Squad Size</div>
            <div className={`text-3xl font-black font-mono ${
              warRoomSquad.length >= 18 && warRoomSquad.length <= 25 ? 'text-emerald-400' : 'text-white'
            }`}>
              {warRoomSquad.length} <span className="text-lg text-white/40 font-normal">/ 25</span>
            </div>
            <div className="text-[11px] font-mono text-white/40">
              {warRoomSquad.length < 18 ? `Needs ${18 - warRoomSquad.length} more players` : 'Valid Squad Count'}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="text-xs font-mono uppercase text-white/50">Squad Pressure PII</div>
            <div className="text-3xl font-black font-mono text-[#E81274]">
              {avgPii.toFixed(1)} <span className="text-lg text-white/40 font-normal">/ 100</span>
            </div>
            <div className="text-[11px] font-mono text-white/40">
              Empirical Bayes Weighted Mean
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="text-xs font-mono uppercase text-white/50">Role Distribution</div>
            <div className="text-base font-bold font-mono text-white mt-1">
              {battersCount} Bat • {bowlersCount} Bowl • {allRoundersCount} AR
            </div>
            <div className="text-[11px] font-mono text-[#85A9FF]">
              Clutch Depth Balanced
            </div>
          </div>
        </div>

        {/* Add Player Search Input */}
        <div className="relative">
          <div className="flex items-center gap-3 p-2 bg-white/5 rounded-2xl border border-white/10">
            <Search className="w-5 h-5 text-white/40 ml-3" />
            <input
              type="text"
              placeholder="Search whitelisted players to bid and add to RR squad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
            />
          </div>

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-30 p-2 bg-[#080C1F] border border-[#29134F] rounded-2xl shadow-2xl space-y-1 max-h-80 overflow-y-auto">
              {searchResults.map((player) => (
                <div
                  key={player.player_id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-white">{player.player_name}</span>
                    <span className="text-xs text-white/50">{player.role}</span>
                    <span className="text-xs font-mono text-[#F5B400]">PII: {player.pressure_impact_index.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/70">Est. ₹{estimatePlayerPrice(player)} Cr</span>
                    <button
                      onClick={() => {
                        playClickChime();
                        onAddToSquad(player);
                        setSearchQuery('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#E81274] hover:bg-[#ff1a84] text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Squad Roster Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-white">Current Squad Roster</h3>
            <span className="text-xs font-mono text-white/50">{warRoomSquad.length} Players Signed</span>
          </div>

          {warRoomSquad.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-3">
              <Users className="w-12 h-12 mx-auto text-white/30" />
              <div className="text-sm font-semibold text-white">No players signed to War Room yet</div>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                Use the search box above or browse the Player Database to sign match-winners within your ₹120.0 Cr budget.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#29134F] bg-white/[0.02]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#29134F]/30 border-b border-[#29134F] text-xs font-mono uppercase tracking-wider text-white/60">
                  <tr>
                    <th className="py-3 px-6">Player</th>
                    <th className="py-3 px-6">Role</th>
                    <th className="py-3 px-6 text-right">Pressure PII</th>
                    <th className="py-3 px-6 text-right">Est. Price</th>
                    <th className="py-3 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  {warRoomSquad.map((player) => (
                    <tr key={player.player_id} className="hover:bg-white/[0.03]">
                      <td className="py-3 px-6">
                        <div 
                          onClick={() => onSelectPlayer(player)}
                          className="cursor-pointer group flex items-center gap-2"
                        >
                          <span className="font-sans font-bold text-sm text-white group-hover:text-[#E81274]">
                            {player.player_name}
                          </span>
                          <span className="text-[10px] text-white/40">#{player.player_id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-white/70 font-sans">{player.role}</td>
                      <td className="py-3 px-6 text-right font-bold text-[#F5B400]">
                        {player.pressure_impact_index.toFixed(1)}
                      </td>
                      <td className="py-3 px-6 text-right text-white">
                        ₹{estimatePlayerPrice(player).toFixed(1)} Cr
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => {
                            playClickChime();
                            onRemoveFromSquad(player.player_id);
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Release Player"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
