import React, { useEffect } from 'react';
import { Player } from '../types';
import { playClickChime } from '../utils/sound';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Flame, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target,
  Sparkles
} from 'lucide-react';

interface PlayerProfileRevealProps {
  player: Player | null;
  onClose: () => void;
  onAddToWarRoom?: (player: Player) => void;
  isInWarRoom?: boolean;
}

export const PlayerProfileReveal: React.FC<PlayerProfileRevealProps> = ({
  player,
  onClose,
  onAddToWarRoom,
  isInWarRoom = false
}) => {
  // ESC key dismissal and scroll locking
  useEffect(() => {
    if (!player) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player, onClose]);

  if (!player) return null;

  const srDelta = player.batting.sr_delta;
  const econDelta = player.bowling.econ_delta;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-xl transition-all duration-300 animate-in fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Cyera-Inspired Staged Floating Glass Card */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-gradient-to-b from-[#13245B]/90 via-[#080C1F]/95 to-[#29134F]/90 border border-white/15 rounded-3xl shadow-[0_25px_60px_-15px_rgba(232,18,116,0.3)] z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E81274]/20 text-[#E81274] border border-[#E81274]/40">
              ID #{player.player_id}
            </span>
            {player.is_rr && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#203A8C]/40 text-[#85A9FF] border border-[#203A8C]/60 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E81274]" />
                RR IPL 2026
              </span>
            )}
          </div>

          <button
            onClick={() => {
              playClickChime();
              onClose();
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body (Scrollable) */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          {/* Staged Hero: Large Cutout & Player Typography */}
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Cutout Container */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex-shrink-0 flex items-center justify-center rounded-3xl bg-gradient-to-tr from-[#203A8C]/40 to-[#E81274]/20 border border-white/10 overflow-hidden shadow-2xl">
              {player.cutout_url || player.portrait_url ? (
                <img
                  src={player.cutout_url || player.portrait_url}
                  alt={player.player_name}
                  className="w-full h-full object-contain p-2 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/30">
                  <Target className="w-12 h-12 text-[#E81274]/60 mb-2" />
                  <span className="text-xs font-mono uppercase tracking-widest">IPL Silhouette</span>
                </div>
              )}
            </div>

            {/* Identity & Staged Metrics */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
                {player.player_name}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <span className="px-3 py-1 rounded-lg font-medium bg-white/10 text-white">
                  {player.role}
                </span>
                <span className="text-white/60">
                  {player.teams.slice(0, 3).join(' • ')}
                </span>
              </div>

              {/* Large Pressure Impact Index Metric */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E81274]/20 to-[#203A8C]/30 border border-[#E81274]/40 flex items-center gap-2.5">
                  <Flame className="w-5 h-5 text-[#E81274]" />
                  <div>
                    <div className="text-[10px] font-mono text-white/50 uppercase">Pressure Impact Index</div>
                    <div className="text-lg font-black font-mono text-white">
                      {player.pressure_impact_index.toFixed(1)} <span className="text-xs text-white/40">/ 100</span>
                    </div>
                  </div>
                </div>

                {player.official_profile_url && (
                  <a
                    href={player.official_profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#85A9FF] hover:text-white transition-colors underline underline-offset-4"
                  >
                    <span>IPLT20 Official Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Deep Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batting Section */}
            {player.batting.total_balls > 0 && (
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#E81274]" /> High-Leverage Batting
                  </span>
                  <span className="text-xs font-mono text-white/50">{player.batting.press_balls} Pressure Balls</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-black/40">
                    <div className="text-[10px] text-white/40 uppercase font-mono">Pressure SR</div>
                    <div className="text-lg font-bold font-mono text-white mt-1">
                      {player.batting.press_sr.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40">
                    <div className="text-[10px] text-white/40 uppercase font-mono">Normal SR</div>
                    <div className="text-lg font-bold font-mono text-white/70 mt-1">
                      {player.batting.overall_sr.toFixed(1)}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-black/40 ${srDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <div className="text-[10px] text-white/40 uppercase font-mono">Delta</div>
                    <div className="text-lg font-bold font-mono flex items-center justify-center gap-0.5 mt-1">
                      {srDelta >= 0 ? '+' : ''}{srDelta.toFixed(1)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs font-mono text-white/60 pt-2 border-t border-white/5">
                  <span>Boundary %: <strong className="text-white">{player.batting.press_boundary_pct.toFixed(1)}%</strong></span>
                  <span>Dot %: <strong className="text-white">{player.batting.press_dot_pct.toFixed(1)}%</strong></span>
                </div>
              </div>
            )}

            {/* Bowling Section */}
            {player.bowling.total_balls > 0 && (
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#85A9FF]" /> Death Overs Bowling
                  </span>
                  <span className="text-xs font-mono text-white/50">{player.bowling.press_balls} Pressure Balls</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-black/40">
                    <div className="text-[10px] text-white/40 uppercase font-mono">Pressure Econ</div>
                    <div className="text-lg font-bold font-mono text-white mt-1">
                      {player.bowling.press_econ.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40">
                    <div className="text-[10px] text-white/40 uppercase font-mono">Normal Econ</div>
                    <div className="text-lg font-bold font-mono text-white/70 mt-1">
                      {player.bowling.overall_econ.toFixed(2)}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-black/40 ${econDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <div className="text-[10px] text-white/40 uppercase font-mono">Delta</div>
                    <div className="text-lg font-bold font-mono flex items-center justify-center gap-0.5 mt-1">
                      {econDelta <= 0 ? '' : '+'}{econDelta.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs font-mono text-white/60 pt-2 border-t border-white/5">
                  <span>Pressure Wickets: <strong className="text-white">{player.bowling.press_wickets}</strong></span>
                  <span>Dot %: <strong className="text-white">{player.bowling.press_dot_pct.toFixed(1)}%</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Whitelist Compliance Guarantee */}
          <div className="p-4 rounded-xl bg-[#203A8C]/15 border border-[#203A8C]/30 text-xs text-white/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E81274]" />
              <span>Verified in competition pack (<code>competition_team_player_mapping.csv</code>).</span>
            </div>
            <span className="font-mono text-[#F5B400] text-[11px]">Empirical Bayes m=40</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white"
          >
            Close
          </button>

          {onAddToWarRoom && (
            <button
              onClick={() => {
                playClickChime();
                onAddToWarRoom(player);
              }}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 transition-all shadow-lg ${
                isInWarRoom
                  ? 'bg-emerald-600 text-white border border-emerald-400'
                  : 'bg-[#E81274] hover:bg-[#ff1a84] text-white shadow-[#E81274]/30'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{isInWarRoom ? 'Signed in War Room' : 'Add to War Room Squad'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
