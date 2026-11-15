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
  Target 
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
  // ESC key dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!player) return null;

  const srDelta = player.batting.sr_delta;
  const econDelta = player.bowling.econ_delta;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-md transition-opacity duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-xl h-full bg-[#080C1F] border-l border-[#29134F] shadow-2xl flex flex-col z-10 overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header / Close bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#080C1F]/90 backdrop-blur-lg border-b border-[#29134F]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wider uppercase bg-[#E81274]/20 text-[#E81274] border border-[#E81274]/40">
              ID: {player.player_id}
            </span>
            {player.is_rr && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wider uppercase bg-[#203A8C]/30 text-[#85A9FF] border border-[#203A8C]/50 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#E81274]" /> RR 2026
              </span>
            )}
          </div>
          <button
            onClick={() => {
              playClickChime();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Section: Cutout & Identity */}
        <div className="relative p-6 bg-gradient-to-b from-[#29134F]/40 via-[#080C1F] to-[#080C1F] border-b border-[#29134F]/40 flex flex-col sm:flex-row items-center gap-6">
          {/* Player Visual (Cutout or Portrait or Fallback) */}
          <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#203A8C]/30 to-[#E81274]/20 border border-white/10 overflow-hidden">
            {player.cutout_url || player.portrait_url ? (
              <img
                src={player.cutout_url || player.portrait_url}
                alt={player.player_name}
                className="w-full h-full object-contain p-1 filter drop-shadow-[0_8px_16px_rgba(232,18,116,0.3)]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
                <Target className="w-12 h-12 mb-1 opacity-50 text-[#E81274]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-center px-2">Official Silhouette</span>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block shadow-[0_0_8px_#34d399]" title="Verified in Canonical Competition Pack" />
            </div>
          </div>

          {/* Identity & Metadata */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <h2 className="text-2xl font-bold font-display tracking-tight text-white">
              {player.player_name}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/10 text-white/90">
                {player.role}
              </span>
              <span className="text-xs text-white/50">
                {player.teams.slice(0, 2).join(' • ')}
              </span>
            </div>

            {/* Pressure Impact Index Badge */}
            <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E81274]/15 border border-[#E81274]/30">
                <Flame className="w-4 h-4 text-[#E81274]" />
                <span className="text-xs font-mono font-bold text-white">
                  PII: {player.pressure_impact_index.toFixed(1)} / 100
                </span>
              </div>
              {player.official_profile_url && (
                <a
                  href={player.official_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-mono text-[#85A9FF] hover:text-white underline underline-offset-2 transition-colors"
                >
                  <span>IPL Official</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content Body: Deep Analytics */}
        <div className="p-6 space-y-6 flex-1">
          {/* Pressure Performance Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#E81274]" />
                Pressure Diagnostics (Leverage Index ≥ 1.8)
              </h3>
              <span className="text-[11px] font-mono text-[#F5B400]">
                Empirical Bayes Shrinkage m=40
              </span>
            </div>

            {/* Batting Card */}
            {player.batting.total_balls > 0 && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-sm font-semibold text-white">Batting Under Pressure</span>
                  <span className="text-xs font-mono text-white/50">{player.batting.press_balls} High-Pressure Balls</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 rounded-lg bg-black/30">
                    <div className="text-[10px] text-white/50 uppercase font-mono">Pressure SR</div>
                    <div className="text-base font-bold font-mono text-white mt-0.5">
                      {player.batting.press_sr.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30">
                    <div className="text-[10px] text-white/50 uppercase font-mono">Overall SR</div>
                    <div className="text-base font-bold font-mono text-white/80 mt-0.5">
                      {player.batting.overall_sr.toFixed(1)}
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg bg-black/30 ${srDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <div className="text-[10px] text-white/50 uppercase font-mono">SR Delta</div>
                    <div className="text-base font-bold font-mono flex items-center justify-center gap-0.5 mt-0.5">
                      {srDelta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {srDelta > 0 ? `+${srDelta.toFixed(1)}` : srDelta.toFixed(1)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="flex justify-between p-2 rounded bg-white/[0.02]">
                    <span className="text-white/60">Boundary %:</span>
                    <span className="font-mono font-bold text-white">{player.batting.press_boundary_pct.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/[0.02]">
                    <span className="text-white/60">Dot Ball %:</span>
                    <span className="font-mono font-bold text-white">{player.batting.press_dot_pct.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bowling Card */}
            {player.bowling.total_balls > 0 && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-sm font-semibold text-white">Bowling Under Pressure</span>
                  <span className="text-xs font-mono text-white/50">{player.bowling.press_balls} High-Pressure Balls</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 rounded-lg bg-black/30">
                    <div className="text-[10px] text-white/50 uppercase font-mono">Pressure Econ</div>
                    <div className="text-base font-bold font-mono text-white mt-0.5">
                      {player.bowling.press_econ.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30">
                    <div className="text-[10px] text-white/50 uppercase font-mono">Overall Econ</div>
                    <div className="text-base font-bold font-mono text-white/80 mt-0.5">
                      {player.bowling.overall_econ.toFixed(2)}
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg bg-black/30 ${econDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <div className="text-[10px] text-white/50 uppercase font-mono">Econ Delta</div>
                    <div className="text-base font-bold font-mono flex items-center justify-center gap-0.5 mt-0.5">
                      {econDelta <= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                      {econDelta > 0 ? `+${econDelta.toFixed(2)}` : econDelta.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="flex justify-between p-2 rounded bg-white/[0.02]">
                    <span className="text-white/60">Pressure Wickets:</span>
                    <span className="font-mono font-bold text-white">{player.bowling.press_wickets}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/[0.02]">
                    <span className="text-white/60">Pressure Dot %:</span>
                    <span className="font-mono font-bold text-white">{player.bowling.press_dot_pct.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legal / Provenance Disclosure */}
          <div className="p-3 rounded-lg bg-[#203A8C]/10 border border-[#203A8C]/20 text-[11px] text-white/60 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#85A9FF]">
              <ShieldCheck className="w-3.5 h-3.5" /> Canonical Data Integrity Guarantee
            </div>
            <p>
              Player ID <span className="font-mono text-white">{player.player_id}</span> is strictly verified against the Rajasthan Royals SupeRR Selector dataset (<code>competition_team_player_mapping.csv</code>). No unapproved web player roster data is introduced.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 p-4 bg-[#080C1F]/95 backdrop-blur-lg border-t border-[#29134F] flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white transition-colors"
          >
            Close
          </button>
          {onAddToWarRoom && (
            <button
              onClick={() => {
                playClickChime();
                onAddToWarRoom(player);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 transition-all shadow-lg ${
                isInWarRoom
                  ? 'bg-emerald-600/80 text-white border border-emerald-400'
                  : 'bg-[#E81274] hover:bg-[#ff1a84] text-white shadow-[#E81274]/30'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{isInWarRoom ? 'In War Room' : 'Add to War Room'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
