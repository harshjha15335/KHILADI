import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { playClickChime, playHoverChime } from '../utils/sound';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Users, 
  Globe, 
  Flame, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  Search
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

  // Financial calculations
  const totalSpent = warRoomSquad.reduce((acc, p) => acc + (p.auction_price_cr || 2.0), 0);
  const remainingPurse = purseTotalCr - totalSpent;
  const overseasCount = warRoomSquad.filter(p => p.country && p.country.toLowerCase() !== 'india').length;

  const avgPii = warRoomSquad.length > 0 
    ? warRoomSquad.reduce((acc, p) => acc + (p.pressure_score || 70), 0) / warRoomSquad.length
    : 0;

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#22263C] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E6ED] pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEAF2] border border-[#F5B1CE] text-xs font-mono uppercase text-[#F22E83] font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Rajasthan Royals Auction Strategy Room</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#22263C]">
              AUCTION WAR ROOM
            </h1>
            <p className="text-sm text-[#505A70] max-w-2xl leading-relaxed">
              Construct the optimal Rajasthan Royals squad with the ₹120.0 Crore salary cap. Maximise clutch pressure impact while maintaining positional balance.
            </p>
          </div>

          <div className="text-xs font-mono text-[#68738A] bg-white px-4 py-2 rounded-2xl border border-[#E8E6ED] shadow-sm">
            Rules: Squad size 18–25 • Max 8 Overseas • ₹120.00 Cr
          </div>
        </div>

        {/* Financial & Squad Stats Cockpit (Light Theme) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-[#E8E6ED] space-y-1 shadow-sm">
            <div className="text-xs font-mono uppercase text-[#68738A]">Purse Remaining</div>
            <div className="text-3xl font-black font-mono text-[#2549BD]">
              ₹{remainingPurse.toFixed(1)} Cr
            </div>
            <div className="text-[11px] font-mono text-[#505A70]">
              Spent: ₹{totalSpent.toFixed(1)} Cr of ₹{purseTotalCr.toFixed(1)} Cr
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8E6ED] space-y-1 shadow-sm">
            <div className="text-xs font-mono uppercase text-[#68738A]">Squad Size</div>
            <div className={`text-3xl font-black font-mono ${
              warRoomSquad.length >= 18 && warRoomSquad.length <= 25 ? 'text-emerald-600' : 'text-[#22263C]'
            }`}>
              {warRoomSquad.length} <span className="text-lg text-[#68738A] font-normal">/ 25</span>
            </div>
            <div className="text-[11px] font-mono text-[#505A70]">
              {warRoomSquad.length < 18 ? `Needs ${18 - warRoomSquad.length} more players` : 'Valid Squad Count'}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8E6ED] space-y-1 shadow-sm">
            <div className="text-xs font-mono uppercase text-[#68738A]">Squad Pressure PII</div>
            <div className="text-3xl font-black font-mono text-[#F22E83]">
              {avgPii.toFixed(1)} <span className="text-lg text-[#68738A] font-normal">/ 100</span>
            </div>
            <div className="text-[11px] font-mono text-[#505A70]">
              Empirical Bayes Weighted Mean
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8E6ED] space-y-1 shadow-sm">
            <div className="text-xs font-mono uppercase text-[#68738A]">Overseas Slots</div>
            <div className={`text-3xl font-black font-mono ${overseasCount > 8 ? 'text-rose-600' : 'text-[#22263C]'}`}>
              {overseasCount} <span className="text-lg text-[#68738A] font-normal">/ 8</span>
            </div>
            <div className="text-[11px] font-mono text-[#505A70]">
              {overseasCount > 8 ? 'Cap Exceeded!' : `${8 - overseasCount} slots open`}
            </div>
          </div>
        </div>

        {/* Player Search and Add Box */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E6ED] shadow-sm space-y-4">
          <div className="text-sm font-bold font-display text-[#22263C]">
            Add Players to War Room Roster
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68738A]" />
            <input
              type="text"
              placeholder="Search 1,217 whitelisted players to draft..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] text-sm text-[#22263C] placeholder-[#68738A] focus:outline-none focus:border-[#F22E83]"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {searchResults.map(p => (
                <div
                  key={p.player_id}
                  className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] hover:border-[#F22E83] flex items-center justify-between transition-all shadow-sm"
                >
                  <div className="truncate pr-2">
                    <div className="text-sm font-bold text-[#22263C] truncate">{p.player_name}</div>
                    <div className="text-[10px] font-mono text-[#68738A]">{p.role} • ₹{p.auction_price_cr || 2.0} Cr</div>
                  </div>
                  <button
                    onClick={() => {
                      playClickChime();
                      onAddToSquad(p);
                      setSearchQuery('');
                    }}
                    className="p-2 rounded-xl bg-[#FFEAF2] hover:bg-[#F22E83] text-[#F22E83] hover:text-white transition-colors cursor-pointer"
                    title="Add to War Room"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Squad Roster Table */}
        <div className="overflow-x-auto rounded-3xl border border-[#E8E6ED] bg-white shadow-sm">
          <div className="p-6 border-b border-[#E8E6ED] flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-[#22263C]">Current Drafted Roster ({warRoomSquad.length})</h3>
            <span className="text-xs font-mono text-[#68738A]">Click a player to inspect diagnostics</span>
          </div>

          {warRoomSquad.length === 0 ? (
            <div className="p-12 text-center space-y-2 text-[#68738A]">
              <Users className="w-8 h-8 mx-auto text-[#F22E83] mb-2" />
              <div className="text-sm font-bold text-[#22263C]">No players in War Room yet</div>
              <p className="text-xs">Search above or browse the Player Archive to recruit your squad.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FFF3F8] border-b border-[#F5B1CE]/60 text-xs font-mono uppercase tracking-wider text-[#505A70]">
                <tr>
                  <th className="py-4 px-6 w-20">ID</th>
                  <th className="py-4 px-6">Player</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6 text-right">Price (₹ Cr)</th>
                  <th className="py-4 px-6 text-right">Pressure Score</th>
                  <th className="py-4 px-6 text-right">SR Delta</th>
                  <th className="py-4 px-6 text-center w-20">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6ED]">
                {warRoomSquad.map(p => (
                  <tr
                    key={p.player_id}
                    className="hover:bg-[#FFF1F7] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 font-mono text-xs text-[#68738A]">#{p.player_id}</td>
                    <td className="py-4 px-6" onClick={() => onSelectPlayer(p)}>
                      <div className="font-bold text-[#22263C] group-hover:text-[#F22E83] transition-colors">
                        {p.player_name}
                      </div>
                      <div className="text-[10px] font-mono text-[#68738A]">{p.country || 'Global'}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-[#505A70]">{p.role}</td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-[#2549BD]">
                      ₹{(p.auction_price_cr || 2.0).toFixed(1)}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-[#F22E83]">
                      {p.pressure_score ? p.pressure_score.toFixed(1) : '78.5'}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-emerald-600">
                      +{p.batting.sr_delta ? p.batting.sr_delta.toFixed(1) : '12.4'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickChime();
                          onRemoveFromSquad(p.player_id);
                        }}
                        className="p-2 rounded-xl hover:bg-rose-50 text-[#68738A] hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove player"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
