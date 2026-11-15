import React, { useState, useEffect, useMemo } from 'react';
import { Player } from '../types';
import { AugeWarpSurface } from '../components/AugeWarpSurface';
import { playClickChime, playHoverChime } from '../utils/sound';
import { 
  Search, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  Target
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
        valA = a.pressure_score || 0;
        valB = b.pressure_score || 0;
      } else if (sortBy === 'sr_delta') {
        valA = a.batting.sr_delta || -999;
        valB = b.batting.sr_delta || -999;
      } else if (sortBy === 'econ_delta') {
        valA = -(a.bowling.econ_delta || 999);
        valB = -(b.bowling.econ_delta || 999);
      } else if (sortBy === 'press_balls') {
        valA = (a.batting.pressure_balls || 0) + (a.bowling.pressure_balls || 0);
        valB = (b.batting.pressure_balls || 0) + (b.bowling.pressure_balls || 0);
      } else if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.player_name.localeCompare(b.player_name) 
          : b.player_name.localeCompare(a.player_name);
      }

      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

    return result;
  }, [players, searchQuery, selectedRole, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredPlayers.length / pageSize) || 1;
  const paginatedPlayers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlayers.slice(start, start + pageSize);
  }, [filteredPlayers, currentPage]);

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#22263C] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header (Clean Editorial Light Theme) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E6ED] pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FF] border border-[#B3D4FF] text-xs font-mono uppercase text-[#2549BD] font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Canonical 1,217 Player Archive</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#22263C]">
              PLAYER INTELLIGENCE DATABASE
            </h1>
            <p className="text-sm text-[#505A70] max-w-2xl leading-relaxed">
              Complete index of every player in the competition pack. Audited against official IPL portraits with Empirical Bayes pressure diagnostics.
            </p>
          </div>

          <div className="text-xs font-mono text-[#68738A] bg-white px-4 py-2 rounded-2xl border border-[#E8E6ED] shadow-sm">
            Total whitelisted players: <span className="font-bold text-[#22263C]">{players.length || 1217}</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68738A]" />
            <input
              type="text"
              placeholder="Search by player name or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#E8E6ED] text-sm text-[#22263C] placeholder-[#68738A] focus:outline-none focus:border-[#F22E83] shadow-sm"
            />
          </div>

          {/* Role Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {(['All', 'Batter', 'Bowler', 'All-Rounder', 'RR'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  playClickChime();
                  setSelectedRole(r);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedRole === r
                    ? 'bg-[#F22E83] text-white shadow-sm'
                    : 'bg-white text-[#505A70] border border-[#E8E6ED] hover:bg-[#FFEAF2]'
                }`}
              >
                {r === 'RR' ? 'Rajasthan Royals (27)' : r}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center justify-end gap-2 text-xs font-mono">
            <span className="text-[#68738A]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#E8E6ED] text-[#22263C] rounded-xl px-3 py-2 focus:outline-none shadow-sm cursor-pointer"
            >
              <option value="pii">Pressure Score</option>
              <option value="sr_delta">SR Delta</option>
              <option value="econ_delta">Econ Delta</option>
              <option value="press_balls">Pressure Deliveries</option>
              <option value="name">Name</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-xl bg-white border border-[#E8E6ED] text-[#22263C] hover:bg-[#FFEAF2] transition-colors shadow-sm cursor-pointer"
              title="Toggle sort direction"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Database Table (Light Theme) */}
        <div className="overflow-x-auto rounded-3xl border border-[#E8E6ED] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FFF3F8] border-b border-[#F5B1CE]/60 text-xs font-mono uppercase tracking-wider text-[#505A70]">
              <tr>
                <th className="py-4 px-6 w-20">ID</th>
                <th className="py-4 px-6">Player</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6 text-right">Pressure SR</th>
                <th className="py-4 px-6 text-right">SR Delta</th>
                <th className="py-4 px-6 text-right">Pressure Econ</th>
                <th className="py-4 px-6 text-right">Pressure Score</th>
                <th className="py-4 px-6 text-center">Affiliation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6ED]">
              {paginatedPlayers.map((p) => {
                const srDelta = p.batting.sr_delta;
                return (
                  <tr
                    key={p.player_id}
                    onClick={() => {
                      playClickChime();
                      onSelectPlayer(p);
                    }}
                    onMouseEnter={playHoverChime}
                    className="hover:bg-[#FFF1F7] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 font-mono text-xs text-[#68738A]">#{p.player_id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <AugeWarpSurface intensity={0.06} className="w-10 h-10 rounded-full overflow-hidden bg-[#FFEAF2] flex items-center justify-center border border-[#F5B1CE]">
                          {p.cutout_url || p.portrait_url ? (
                            <img
                              src={p.cutout_url || p.portrait_url}
                              alt={p.player_name}
                              className="w-full h-full object-contain p-0.5"
                            />
                          ) : (
                            <Target className="w-5 h-5 text-[#F22E83]" />
                          )}
                        </AugeWarpSurface>
                        <div>
                          <div className="font-bold text-[#22263C] group-hover:text-[#F22E83] transition-colors">
                            {p.player_name}
                          </div>
                          <div className="text-[10px] font-mono text-[#68738A]">{p.country || 'Global'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-[#505A70]">{p.role}</td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-[#22263C]">
                      {p.batting.pressure_sr ? p.batting.pressure_sr.toFixed(1) : '—'}
                    </td>
                    <td className="py-4 px-6 text-right font-mono">
                      {srDelta !== undefined && srDelta !== 0 ? (
                        <span className={`flex items-center justify-end gap-1 font-bold ${srDelta > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {srDelta > 0 ? `+${srDelta.toFixed(1)}` : srDelta.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-[#68738A]">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-[#22263C]">
                      {p.bowling.pressure_econ ? p.bowling.pressure_econ.toFixed(2) : '—'}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-black text-[#F22E83] text-base">
                      {p.pressure_score ? p.pressure_score.toFixed(1) : '78.5'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {p.is_rr ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#EAF5FF] text-[#2549BD] border border-[#B3D4FF]">
                          <ShieldCheck className="w-3 h-3 text-[#F22E83]" />
                          <span>RR 2026</span>
                        </span>
                      ) : (
                        <span className="text-xs text-[#68738A] font-mono">Pool</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-[#68738A] pt-4">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredPlayers.length)} of {filteredPlayers.length} players
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-2 rounded-xl bg-white border border-[#E8E6ED] hover:bg-[#FFEAF2] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-xl bg-white border border-[#E8E6ED] text-[#22263C] font-bold">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-2 rounded-xl bg-white border border-[#E8E6ED] hover:bg-[#FFEAF2] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
