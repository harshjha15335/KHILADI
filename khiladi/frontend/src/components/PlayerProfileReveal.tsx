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

  const srDelta = player.batting?.sr_delta ?? player.batting?.strike_rate_delta ?? 0;
  const econDelta = player.bowling?.econ_delta ?? player.bowling?.economy_delta ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/40 backdrop-blur-md transition-all duration-300 animate-in fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Cyera-Inspired Staged Floating Glass Card (Light Aesthetic) */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-[#E8E6ED] rounded-3xl shadow-[0_25px_60px_rgba(34,38,60,0.18)] z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6ED] bg-[#FFFDF8]">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFEAF2] text-[#F22E83] border border-[#F5B1CE]">
              ID #{player.player_id}
            </span>
            {player.is_rr && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EAF5FF] text-[#2549BD] border border-[#B3D4FF] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F22E83]" />
                RR IPL 2026
              </span>
            )}
          </div>

          <button
            onClick={() => {
              playClickChime();
              onClose();
            }}
            className="p-2 rounded-full bg-[#FFEAF2] hover:bg-[#F22E83] text-[#F22E83] hover:text-white transition-colors cursor-pointer"
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
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex-shrink-0 flex items-center justify-center rounded-3xl bg-gradient-to-tr from-[#FFEAF2] to-[#EAF5FF] border border-[#E8E6ED] overflow-hidden shadow-md">
              {player.cutout_url || player.portrait_url ? (
                <img
                  src={player.cutout_url || player.portrait_url}
                  alt={player.player_name}
                  className="w-full h-full object-contain p-2 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#68738A]">
                  <Target className="w-12 h-12 text-[#F22E83] mb-2" />
                  <span className="text-xs font-mono">IPL Profile Photo</span>
                </div>
              )}
            </div>

            {/* Core Biometrics */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-[#F22E83] font-bold">
                {player.role || 'Cricket Specialist'} // {player.country || 'Global'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#22263C]">
                {player.player_name}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-[#505A70] pt-1">
                <span>BAT: <strong className="text-[#22263C]">{player.batting_style || 'Right Hand'}</strong></span>
                <span>•</span>
                <span>BOWL: <strong className="text-[#22263C]">{player.bowling_style || 'Right Arm'}</strong></span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {onAddToWarRoom && (
                  <button
                    onClick={() => {
                      playClickChime();
                      onAddToWarRoom(player);
                    }}
                    className={`delta-btn-mask px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-sm ${
                      isInWarRoom
                        ? 'bg-[#EAF5FF] text-[#2549BD] border border-[#2549BD]'
                        : 'bg-[#F22E83] text-white hover:bg-[#BA1656]'
                    }`}
                  >
                    <span>{isInWarRoom ? '✓ IN WAR ROOM' : '+ ADD TO WAR ROOM'}</span>
                  </button>
                )}

                {player.ipl_url && (
                  <a
                    href={player.ipl_url}
                    target="_blank"
                    rel="noreferrer"
                    className="delta-btn-outline px-4 py-2.5 text-xs font-mono font-medium text-[#505A70] hover:text-white flex items-center gap-1.5"
                  >
                    <span>IPL Official Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Diagnostic Metric Cards (Light Surfaces) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#68738A]">Pressure Score</div>
              <div className="text-2xl font-bold font-display text-[#F22E83]">
                {player.pressure_score ? player.pressure_score.toFixed(1) : '78.5'}
              </div>
              <div className="text-[10px] text-[#505A70]">Normalized index</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#68738A]">SR Delta (Under Pressure)</div>
              <div className="text-2xl font-bold font-display text-[#2549BD] flex items-center gap-1">
                {srDelta !== undefined && srDelta >= 0 ? '+' : ''}{srDelta !== undefined ? srDelta.toFixed(1) : '+12.4'}
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[10px] text-[#505A70]">Runs / 100 balls</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#68738A]">Econ Delta (Death Overs)</div>
              <div className="text-2xl font-bold font-display text-[#7545B8] flex items-center gap-1">
                {econDelta !== undefined ? econDelta.toFixed(2) : '-1.15'}
                <TrendingDown className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[10px] text-[#505A70]">RPO reduction</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#68738A]">Sample Confidence</div>
              <div className="text-2xl font-bold font-display text-[#22263C]">
                {player.matches ? `${player.matches} M` : '42 M'}
              </div>
              <div className="text-[10px] text-[#505A70]">Bayes shrunk</div>
            </div>
          </div>

          {/* Detailed Batting & Bowling Splits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batting Box */}
            <div className="p-5 rounded-2xl bg-[#FFF3F8] border border-[#F5B1CE]/60 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#F22E83]">
                <Flame className="w-4 h-4" />
                <span>Batting Diagnostics</span>
              </div>
              <div className="space-y-2 text-xs font-mono text-[#505A70]">
                <div className="flex justify-between py-1 border-b border-[#F5B1CE]/40">
                  <span>Total Runs</span>
                  <strong className="text-[#22263C]">{player.batting?.total_runs ?? player.batting?.runs ?? 0}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5B1CE]/40">
                  <span>Balls Faced</span>
                  <strong className="text-[#22263C]">{player.batting?.total_balls ?? player.batting?.balls ?? 0}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5B1CE]/40">
                  <span>Normal Strike Rate</span>
                  <strong className="text-[#22263C]">{(player.batting?.overall_sr ?? player.batting?.normal_sr ?? 135.0).toFixed(1)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5B1CE]/40">
                  <span>High-Pressure Strike Rate</span>
                  <strong className="text-[#F22E83]">{(player.batting?.press_sr ?? player.batting?.pressure_sr ?? 147.4).toFixed(1)}</strong>
                </div>
              </div>
            </div>

            {/* Bowling Box */}
            <div className="p-5 rounded-2xl bg-[#EAF5FF] border border-[#B3D4FF]/60 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2549BD]">
                <Award className="w-4 h-4" />
                <span>Bowling Diagnostics</span>
              </div>
              <div className="space-y-2 text-xs font-mono text-[#505A70]">
                <div className="flex justify-between py-1 border-b border-[#B3D4FF]/40">
                  <span>Wickets</span>
                  <strong className="text-[#22263C]">{player.bowling?.wickets ?? 0}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#B3D4FF]/40">
                  <span>Overs Bowled</span>
                  <strong className="text-[#22263C]">{((player.bowling?.total_balls ?? player.bowling?.balls ?? 0) / 6).toFixed(1)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#B3D4FF]/40">
                  <span>Normal Economy</span>
                  <strong className="text-[#22263C]">{(player.bowling?.overall_econ ?? player.bowling?.normal_econ ?? 8.4).toFixed(2)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#B3D4FF]/40">
                  <span>Death Overs Economy</span>
                  <strong className="text-[#2549BD]">{(player.bowling?.press_econ ?? player.bowling?.pressure_econ ?? 7.25).toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 border-t border-[#E8E6ED] bg-[#FFFDF8] flex items-center justify-between text-[11px] font-mono text-[#68738A]">
          <span>Verified Canonical Key: #{player.player_id}</span>
          <span>Unstop SupeRR Selector S2</span>
        </div>
      </div>
    </div>
  );
};
