import React, { useState, useEffect, useMemo } from 'react';
import { Player } from '../types';
import { AugeWarpSurface } from '../components/AugeWarpSurface';
import { KhiladiKineticText } from '../components/KhiladiKineticText';
import { playClickChime, playHoverChime } from '../utils/sound';
import { 
  Search, 
  Filter, 
  Users, 
  ShieldCheck, 
  ArrowUpDown, 
  Flame, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  Shield
} from 'lucide-react';

interface PlayerDatabasePageProps {
  onSelectPlayer: (player: Player) => void;
}

export const PlayerDatabasePage: React.FC<PlayerDatabasePageProps> = ({ onSelectPlayer }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | 'Batter' | 'Bowler' | 'All-Rounder' | 'RR'>('All');
  const [sortBy, setSortBy] = useState<'pii' | 'name' | 'sr_delta' | 'econ_delta' | 'press_balls'>('pii');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;
  const [hoveredPlayer, setHoveredPlayer] = useState<Player | null>(null);

  useEffect(() => {
    fetch('/data/player_database.json')
      .then(res => res.json())
      .then((data: Player[]) => {
        setPlayers(data);
      })
      .catch(() => {
        fetch('/api/players?limit=1500')
          .then(res => res.json())
          .then((res: { data: Player[] }) => setPlayers(res.data))
          .catch(err => console.error('Failed to load database:', err));
      });
  }, []);

  const filteredPlayers = useMemo(() => {
    let result = [...players];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.player_name.toLowerCase().includes(q) || 
        p.player_id.toString().includes(q)
      );
    }

    // Role filter
    if (selectedRole === 'RR') {
      result = result.filter(p => p.is_rr);
    } else if (selectedRole !== 'All') {
      result = result.filter(p => p.role === selectedRole);
    }

    // Sorting
    result.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === 'pii') {
        valA = a.pressure_impact_index;
        valB = b.pressure_impact_index;
      } else if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.player_name.localeCompare(b.player_name) 
          : b.player_name.localeCompare(a.player_name);
      } else if (sortBy === 'sr_delta') {
        valA = a.batting.sr_delta;
        valB = b.batting.sr_delta;
      } else if (sortBy === 'econ_delta') {
        valA = a.bowling.econ_delta;
        valB = b.bowling.econ_delta;
      } else if (sortBy === 'press_balls') {
        valA = a.batting.press_balls + a.bowling.press_balls;
        valB = b.batting.press_balls + b.bowling.press_balls;
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [players, searchQuery, selectedRole, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredPlayers.length / pageSize) || 1;
  const paginatedPlayers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlayers.slice(start, start + pageSize);
  }, [filteredPlayers, currentPage]);

  return (
    <div className="min-h-screen bg-[#080C1F] text-[#F7F4FA] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#29134F] pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#203A8C]/20 border border-[#203A8C]/40 text-xs font-mono uppercase text-[#85A9FF]">
              <Users className="w-3.5 h-3.5" />
              <span>Canonical 1,217 Player Archive</span>
            </div>
            <KhiladiKineticText
              text="PLAYER INTELLIGENCE DATABASE"
              className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white"
            />
            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              CRL-style archival index of every player in the competition pack. Audited against official IPL portraits with Empirical Bayes pressure diagnostics.
            </p>
          </div>

          <div className="text-xs font-mono text-white/50 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            Total whitelisted players: <span className="font-bold text-white">{players.length || 1217}</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search by player name or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#E81274]"
            />
          </div>

          {/* Role Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(['All', 'Batter', 'Bowler', 'All-Rounder', 'RR'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  playClickChime();
                  setSelectedRole(r);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                  selectedRole === r
                    ? r === 'RR'
                      ? 'bg-[#E81274] text-white shadow-md shadow-[#E81274]/30'
                      : 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {r === 'RR' ? 'RR 2026' : r}
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#85A9FF]"
            >
              <option value="pii" className="bg-[#080C1F]">Sort by Pressure Impact (PII)</option>
              <option value="name" className="bg-[#080C1F]">Sort by Name</option>
              <option value="sr_delta" className="bg-[#080C1F]">Sort by Strike Rate Delta</option>
              <option value="econ_delta" className="bg-[#080C1F]">Sort by Economy Delta</option>
              <option value="press_balls" className="bg-[#080C1F]">Sort by Pressure Sample</option>
            </select>
            <button
              onClick={() => {
                playClickChime();
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dense Archival Table + Live AUGE Warp Preview on non-homepage */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Table (3 cols) */}
          <div className="lg:col-span-3 overflow-x-auto rounded-2xl border border-[#29134F] bg-white/[0.02]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#29134F]/30 border-b border-[#29134F] text-xs font-mono uppercase tracking-wider text-white/60">
                <tr>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">PII</th>
                  <th className="py-3 px-4 text-right">Press Balls</th>
                  <th className="py-3 px-4 text-right">Batting SR</th>
                  <th className="py-3 px-4 text-right">Bowling Econ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {paginatedPlayers.map((player) => (
                  <tr
                    key={player.player_id}
                    onClick={() => {
                      playClickChime();
                      onSelectPlayer(player);
                    }}
                    onMouseEnter={() => {
                      playHoverChime();
                      setHoveredPlayer(player);
                    }}
                    className="hover:bg-white/[0.05] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {player.is_rr && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E81274]" title="RR 2026 Representative" />
                        )}
                        <span className="font-sans font-bold text-sm text-white group-hover:text-[#E81274] transition-colors truncate">
                          {player.player_name}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">
                          #{player.player_id}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/70 font-sans">
                      {player.role}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#F5B400]">
                      {player.pressure_impact_index.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-right text-white/70">
                      {player.batting.press_balls + player.bowling.press_balls}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {player.batting.total_balls > 0 ? (
                        <span className={player.batting.sr_delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {player.batting.press_sr.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {player.bowling.total_balls > 0 ? (
                        <span className={player.bowling.econ_delta <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {player.bowling.press_econ.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Side Preview Card (1 col) - AUGE Warp Surface (Permitted on non-homepage) */}
          <div className="hidden lg:block sticky top-28 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/60">
              Live Archival Inspector
            </h3>
            {hoveredPlayer ? (
              <AugeWarpSurface intensity={14} className="rounded-2xl">
                <div 
                  onClick={() => onSelectPlayer(hoveredPlayer)}
                  className="p-5 rounded-2xl bg-gradient-to-b from-[#29134F]/40 to-[#080C1F] border border-white/10 space-y-4 cursor-pointer"
                >
                  <div className="w-full h-44 rounded-xl bg-black/40 flex items-center justify-center overflow-hidden">
                    {hoveredPlayer.cutout_url || hoveredPlayer.portrait_url ? (
                      <img
                        src={hoveredPlayer.cutout_url || hoveredPlayer.portrait_url}
                        alt={hoveredPlayer.player_name}
                        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(232,18,116,0.3)]"
                      />
                    ) : (
                      <Shield className="w-12 h-12 text-[#E81274]/50" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">{hoveredPlayer.player_name}</h4>
                    <p className="text-xs text-white/50">{hoveredPlayer.role} • ID {hoveredPlayer.player_id}</p>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between text-xs font-mono">
                    <span className="text-white/60">Pressure Index:</span>
                    <span className="text-[#F5B400] font-bold">{hoveredPlayer.pressure_impact_index.toFixed(1)} / 100</span>
                  </div>
                  <button className="w-full py-2 rounded-lg bg-[#E81274] hover:bg-[#ff1a84] text-white text-xs font-semibold">
                    Open Full Drawer Profile
                  </button>
                </div>
              </AugeWarpSurface>
            ) : (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-white/40">
                Hover over any row in the archive to preview player diagnostics.
              </div>
            )}
          </div>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono">
          <span className="text-white/50">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredPlayers.length)} of {filteredPlayers.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded bg-white/10 text-white font-bold">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
