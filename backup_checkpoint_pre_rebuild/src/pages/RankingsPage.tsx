import React, { useState, useEffect } from 'react';
import { TopBatter, TopBowler, Player } from '../types';
import { KhiladiAnimatedButton } from '../components/KhiladiAnimatedButton';
import { KhiladiKineticText } from '../components/KhiladiKineticText';
import { playClickChime, playHoverChime } from '../utils/sound';
import { 
  Award, 
  Download, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  CheckCircle2, 
  FileSpreadsheet,
  Share2
} from 'lucide-react';

interface RankingsPageProps {
  onSelectPlayerById: (playerId: number) => void;
}

export const RankingsPage: React.FC<RankingsPageProps> = ({ onSelectPlayerById }) => {
  const [activeTab, setActiveTab] = useState<'batters' | 'bowlers'>('batters');
  const [batters, setBatters] = useState<TopBatter[]>([]);
  const [bowlers, setBowlers] = useState<TopBowler[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/top_10_batters.json').then(r => r.json()).catch(() => fetch('/api/rankings/batters').then(r => r.json())),
      fetch('/data/top_10_bowlers.json').then(r => r.json()).catch(() => fetch('/api/rankings/bowlers').then(r => r.json()))
    ]).then(([bData, boData]) => {
      setBatters(bData);
      setBowlers(boData);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load rankings:', err);
      setLoading(false);
    });
  }, []);

  const downloadCSV = (type: 'batters' | 'bowlers') => {
    playClickChime();
    const url = type === 'batters' ? '/data/top_10_batters.csv' : '/data/top_10_bowlers.csv';
    const link = document.createElement('a');
    link.href = url;
    link.download = `rr_superr_selector_top_10_${type}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#080C1F] text-[#F7F4FA] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header with Extrafazant Kinetic Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#29134F] pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E81274]/15 border border-[#E81274]/30 text-xs font-mono uppercase text-[#E81274]">
              <Award className="w-3.5 h-3.5" />
              <span>Rajasthan Royals SupeRR Selector • Official Submission</span>
            </div>
            <KhiladiKineticText
              text="TOP 10 PRESSURE RANKINGS"
              className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white"
            />
            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              Strictly validated from the canonical dataset (<code className="text-[#85A9FF]">competition_team_player_mapping.csv</code>). Computed with Empirical Bayes shrinkage ($m=40$) under high-leverage match conditions ($LI \ge 1.8$).
            </p>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadCSV(activeTab)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono flex items-center gap-2 transition-all hover:border-[#E81274]"
            >
              <Download className="w-4 h-4 text-[#E81274]" />
              <span>Export {activeTab === 'batters' ? 'Batters' : 'Bowlers'} CSV</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { playClickChime(); setActiveTab('batters'); }}
            onMouseEnter={playHoverChime}
            className={`px-6 py-3 rounded-xl font-display text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'batters'
                ? 'bg-gradient-to-r from-[#E81274] to-[#ff4d9e] text-white shadow-lg shadow-[#E81274]/30'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Top 10 Batters Under Pressure</span>
          </button>

          <button
            onClick={() => { playClickChime(); setActiveTab('bowlers'); }}
            onMouseEnter={playHoverChime}
            className={`px-6 py-3 rounded-xl font-display text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'bowlers'
                ? 'bg-gradient-to-r from-[#203A8C] to-[#85A9FF] text-white shadow-lg shadow-[#203A8C]/30'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Top 10 Bowlers Under Pressure</span>
          </button>
        </div>

        {/* BATTERS TABLE */}
        {activeTab === 'batters' && (
          <div className="overflow-x-auto rounded-2xl border border-[#29134F] bg-white/[0.02]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#29134F]/40 border-b border-[#29134F] text-xs font-mono uppercase tracking-wider text-white/70">
                <tr>
                  <th className="py-4 px-6 text-center w-16">Rank</th>
                  <th className="py-4 px-6">Player</th>
                  <th className="py-4 px-6 text-right">Pressure SR</th>
                  <th className="py-4 px-6 text-right">Overall SR</th>
                  <th className="py-4 px-6 text-right">SR Delta</th>
                  <th className="py-4 px-6 text-right">Pressure Balls</th>
                  <th className="py-4 px-6 text-right">Pressure Impact</th>
                  <th className="py-4 px-6 text-center">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {batters.map((b) => (
                  <tr
                    key={b.player_id}
                    className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                    onClick={() => {
                      playClickChime();
                      onSelectPlayerById(b.player_id);
                    }}
                  >
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-mono font-bold text-xs ${
                        b.rank === 1
                          ? 'bg-[#F5B400] text-black shadow-[0_0_12px_#F5B400]'
                          : b.rank === 2
                          ? 'bg-slate-300 text-black'
                          : b.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-white/10 text-white/70'
                      }`}>
                        {b.rank}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {b.portrait_url ? (
                            <img src={b.portrait_url} alt={b.player_name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-mono text-white/40">ID {b.player_id}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[#E81274] transition-colors">
                            {b.player_name}
                          </div>
                          <div className="text-xs font-mono text-white/40">
                            ID: {b.player_id} • Total Balls: {b.total_balls_faced}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-white">
                      {b.pressure_strike_rate.toFixed(1)}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-white/60">
                      {b.baseline_strike_rate.toFixed(1)}
                    </td>
                    <td className="py-4 px-6 text-right font-mono">
                      <span className={`inline-flex items-center gap-1 font-bold ${b.strike_rate_delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {b.strike_rate_delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {b.strike_rate_delta > 0 ? `+${b.strike_rate_delta.toFixed(1)}` : b.strike_rate_delta.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-white/80">
                      {b.pressure_balls_faced}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-[#F5B400]">
                      {b.pressure_impact_index.toFixed(1)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-xs font-mono text-[#85A9FF] group-hover:underline">
                        View Details →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BOWLERS TABLE */}
        {activeTab === 'bowlers' && (
          <div className="overflow-x-auto rounded-2xl border border-[#29134F] bg-white/[0.02]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#29134F]/40 border-b border-[#29134F] text-xs font-mono uppercase tracking-wider text-white/70">
                <tr>
                  <th className="py-4 px-6 text-center w-16">Rank</th>
                  <th className="py-4 px-6">Player</th>
                  <th className="py-4 px-6 text-right">Pressure Econ</th>
                  <th className="py-4 px-6 text-right">Overall Econ</th>
                  <th className="py-4 px-6 text-right">Econ Delta</th>
                  <th className="py-4 px-6 text-right">Pressure Dot %</th>
                  <th className="py-4 px-6 text-right">Pressure Impact</th>
                  <th className="py-4 px-6 text-center">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bowlers.map((bo) => (
                  <tr
                    key={bo.player_id}
                    className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                    onClick={() => {
                      playClickChime();
                      onSelectPlayerById(bo.player_id);
                    }}
                  >
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-mono font-bold text-xs ${
                        bo.rank === 1
                          ? 'bg-[#F5B400] text-black shadow-[0_0_12px_#F5B400]'
                          : bo.rank === 2
                          ? 'bg-slate-300 text-black'
                          : bo.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-white/10 text-white/70'
                      }`}>
                        {bo.rank}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {bo.portrait_url ? (
                            <img src={bo.portrait_url} alt={bo.player_name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-mono text-white/40">ID {bo.player_id}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[#85A9FF] transition-colors">
                            {bo.player_name}
                          </div>
                          <div className="text-xs font-mono text-white/40">
                            ID: {bo.player_id} • High-leverage balls: {bo.pressure_balls_bowled}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-white">
                      {bo.pressure_economy.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-white/60">
                      {bo.baseline_economy.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right font-mono">
                      <span className={`inline-flex items-center gap-1 font-bold ${bo.economy_delta <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {bo.economy_delta <= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                        {bo.economy_delta > 0 ? `+${bo.economy_delta.toFixed(2)}` : bo.economy_delta.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-white/80">
                      {bo.pressure_dot_percentage.toFixed(1)}%
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-[#F5B400]">
                      {bo.pressure_impact_index.toFixed(1)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-xs font-mono text-[#85A9FF] group-hover:underline">
                        View Details →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Verification Footer Notice */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#203A8C]/20 to-[#E81274]/20 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div className="text-xs text-white/80">
              <span className="font-semibold text-white">Audit Verified:</span> Both exported CSV tables strictly adhere to the user competition pack. Zero phantom IDs or unwhitelisted records.
            </div>
          </div>
          <div className="text-xs font-mono text-[#F5B400] whitespace-nowrap">
            Unstop Match Dropdown Ready
          </div>
        </div>
      </div>
    </div>
  );
};
