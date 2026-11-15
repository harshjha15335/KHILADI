import React, { useState, useEffect } from 'react';
import { KhiladiKineticText } from '../components/KhiladiKineticText';
import { playClickChime, playHoverChime } from '../utils/sound';
import { 
  Flame, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  Zap,
  Target
} from 'lucide-react';

interface Delivery {
  innings: number;
  over: number;
  ball: number;
  striker: string;
  striker_id: number;
  bowler: string;
  bowler_id: number;
  runs: number;
  total_runs: number;
  is_wicket: boolean;
  dismissal: string | null;
  leverage_index: number;
  is_high_pressure: boolean;
  cum_score: string;
}

interface ReplayData {
  match_id: number;
  home_team: string;
  away_team: string;
  total_deliveries: number;
  deliveries: Delivery[];
}

interface PressureLabPageProps {
  onSelectPlayerById: (playerId: number) => void;
}

export const PressureLabPage: React.FC<PressureLabPageProps> = ({ onSelectPlayerById }) => {
  const [replay, setReplay] = useState<ReplayData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(600); // ms per ball

  useEffect(() => {
    fetch('/data/sample_match_replay.json')
      .then(res => res.json())
      .then((data: ReplayData) => {
        setReplay(data);
        // Find first high-pressure ball or start around over 15
        const firstHp = data.deliveries.findIndex(d => d.is_high_pressure);
        if (firstHp !== -1) setCurrentIndex(firstHp);
      })
      .catch(() => {
        fetch('/api/match-replay')
          .then(res => res.json())
          .then((data: ReplayData) => setReplay(data))
          .catch(err => console.error('Failed to load match replay:', err));
      });
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || !replay) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= replay.deliveries.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, replay, playbackSpeed]);

  if (!replay) {
    return (
      <div className="min-h-screen bg-[#080C1F] text-white flex items-center justify-center pt-20">
        <div className="flex items-center gap-3 font-mono text-sm text-[#E81274]">
          <Activity className="w-5 h-5 animate-spin" />
          <span>Loading Pressure Telemetry...</span>
        </div>
      </div>
    );
  }

  const currentDelivery = replay.deliveries[currentIndex] || replay.deliveries[0];
  const li = currentDelivery.leverage_index;
  const isHighLI = currentDelivery.is_high_pressure;

  return (
    <div className="min-h-screen bg-[#080C1F] text-[#F7F4FA] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#29134F] pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E81274]/15 border border-[#E81274]/30 text-xs font-mono uppercase text-[#E81274]">
              <Flame className="w-3.5 h-3.5" />
              <span>Ball-by-Ball Leverage Telemetry</span>
            </div>
            <KhiladiKineticText
              text="THE PRESSURE LAB"
              className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white"
            />
            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              Scrub through real historical match deliveries. Observe how leverage index ($LI$) spikes during death overs and high-stakes dismissals, penalising low-leverage stat-padding.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono space-y-1">
            <div className="text-white/50 uppercase">Match {replay.match_id}</div>
            <div className="font-bold text-white text-sm">{replay.home_team} vs {replay.away_team}</div>
            <div className="text-[#F5B400]">{replay.total_deliveries} Deliveries Recorded</div>
          </div>
        </div>

        {/* Central Cockpit / Live Ball Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Delivery Screen (2 cols) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#29134F]/30 via-[#080C1F] to-[#203A8C]/20 border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Cyera-inspired shockwave if wicket! */}
            {currentDelivery.is_wicket && (
              <div className="absolute inset-0 bg-[#E81274]/20 animate-ping pointer-events-none" />
            )}

            {/* Top Bar: Over.Ball & Innings */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-mono font-bold text-white">
                  Innings {currentDelivery.innings}
                </span>
                <span className="text-2xl font-black font-mono text-white">
                  Over {currentDelivery.over}.{currentDelivery.ball}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-white/50">Score:</span>
                <span className="text-xl font-bold font-mono text-[#F5B400]">
                  {currentDelivery.cum_score}
                </span>
              </div>
            </div>

            {/* Central Outcome Tile */}
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              {currentDelivery.is_wicket ? (
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-rose-600/30 border border-rose-500 text-rose-300 font-mono font-bold uppercase tracking-widest text-sm animate-pulse">
                  <AlertTriangle className="w-4 h-4" /> WICKET — {currentDelivery.dismissal || 'OUT'}
                </div>
              ) : currentDelivery.runs === 4 ? (
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#85A9FF]/30 border border-[#85A9FF] text-[#85A9FF] font-mono font-bold uppercase tracking-widest text-sm">
                  ★ FOUR RUNS
                </div>
              ) : currentDelivery.runs === 6 ? (
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#E81274]/30 border border-[#E81274] text-[#E81274] font-mono font-bold uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(232,18,116,0.4)]">
                  ⚡ MAXIMUM SIX!
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono text-sm">
                  {currentDelivery.runs === 0 ? 'DOT BALL' : `${currentDelivery.runs} RUN(S)`}
                </div>
              )}

              <div className="text-5xl sm:text-7xl font-black font-display tracking-tight text-white">
                +{currentDelivery.runs}
              </div>
            </div>

            {/* Duel Information: Striker vs Bowler */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              {/* Batter */}
              <div 
                onClick={() => onSelectPlayerById(currentDelivery.striker_id)}
                className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 cursor-pointer transition-colors group"
              >
                <div className="text-[10px] font-mono uppercase text-white/50">Facing Striker</div>
                <div className="text-base font-bold text-white group-hover:text-[#E81274] transition-colors mt-0.5 truncate">
                  {currentDelivery.striker}
                </div>
                <div className="text-xs font-mono text-[#85A9FF] mt-1">ID #{currentDelivery.striker_id} • Click for Profile →</div>
              </div>

              {/* Bowler */}
              <div 
                onClick={() => onSelectPlayerById(currentDelivery.bowler_id)}
                className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 cursor-pointer transition-colors group"
              >
                <div className="text-[10px] font-mono uppercase text-white/50">Bowling</div>
                <div className="text-base font-bold text-white group-hover:text-[#85A9FF] transition-colors mt-0.5 truncate">
                  {currentDelivery.bowler}
                </div>
                <div className="text-xs font-mono text-[#85A9FF] mt-1">ID #{currentDelivery.bowler_id} • Click for Profile →</div>
              </div>
            </div>
          </div>

          {/* Telemetry Gauge & Pressure Index (1 col) */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#E81274]" /> Leverage Telemetry
                </span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                  isHighLI ? 'bg-[#E81274]/20 text-[#E81274] border border-[#E81274]/40 font-bold' : 'bg-white/10 text-white/60'
                }`}>
                  {isHighLI ? 'HIGH PRESSURE' : 'NORMAL LEVERAGE'}
                </span>
              </div>

              {/* Big LI Gauge */}
              <div className="p-6 rounded-2xl bg-black/40 text-center space-y-2 border border-white/5">
                <div className="text-xs font-mono uppercase text-white/40">Leverage Index (LI)</div>
                <div className={`text-5xl font-black font-mono tracking-tight ${
                  li >= 2.0 ? 'text-[#E81274]' : li >= 1.8 ? 'text-[#F5B400]' : 'text-white'
                }`}>
                  {li.toFixed(2)}x
                </div>
                <div className="text-[11px] font-mono text-white/50">
                  {li >= 1.8 ? 'High Stakes: Weights ≥ 1.8x' : 'Baseline Stakes: LI < 1.8x'}
                </div>
              </div>

              {/* Progress Bar of LI */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-white/40">
                  <span>Low Stakes (0.5x)</span>
                  <span>Threshold (1.8x)</span>
                  <span>Extreme (3.0x+)</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      li >= 2.0 ? 'bg-gradient-to-r from-[#F5B400] to-[#E81274]' : li >= 1.8 ? 'bg-[#F5B400]' : 'bg-[#85A9FF]'
                    }`}
                    style={{ width: `${Math.min(100, (li / 3.0) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Formula Explanation */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/50 leading-relaxed font-mono">
                Leverage Index measures the swing in win probability on this ball compared to an average delivery. Balls with $LI \ge 1.8$ enter the competition pressure sample.
              </div>
            </div>

            {/* Speed selection */}
            <div className="flex items-center justify-between text-xs font-mono pt-4 border-t border-white/10">
              <span className="text-white/50">Playback:</span>
              <div className="flex gap-2">
                {[1000, 600, 300].map(s => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2.5 py-1 rounded ${
                      playbackSpeed === s ? 'bg-[#E81274] text-white' : 'bg-white/5 text-white/60'
                    }`}
                  >
                    {s === 1000 ? '1x' : s === 600 ? '1.5x' : '2x'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Scrubber Controls */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { playClickChime(); setIsPlaying(!isPlaying); }}
                className="w-12 h-12 rounded-full bg-[#E81274] hover:bg-[#ff1a84] text-white flex items-center justify-center transition-all shadow-lg shadow-[#E81274]/30"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={() => { playClickChime(); setCurrentIndex(0); setIsPlaying(false); }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                title="Restart Match"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  playClickChime();
                  // Jump to next high pressure ball
                  const nextHp = replay.deliveries.findIndex((d, idx) => idx > currentIndex && d.is_high_pressure);
                  if (nextHp !== -1) setCurrentIndex(nextHp);
                }}
                className="px-3 py-2 rounded-xl bg-[#203A8C]/30 hover:bg-[#203A8C]/50 border border-[#203A8C]/50 text-xs font-mono text-[#85A9FF] flex items-center gap-1.5"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Jump to Next LI ≥ 1.8 Ball</span>
              </button>
            </div>

            <div className="text-xs font-mono text-white/60">
              Delivery <span className="font-bold text-white">{currentIndex + 1}</span> of <span className="text-white">{replay.deliveries.length}</span>
            </div>
          </div>

          {/* Interactive Range Scrubber */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={replay.deliveries.length - 1}
              value={currentIndex}
              onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
              className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E81274]"
            />
            {/* Visual tick marks for wickets */}
            <div className="relative w-full h-3 flex items-center">
              {replay.deliveries.map((d, idx) => (
                d.is_wicket && (
                  <span
                    key={idx}
                    className="absolute top-0 w-1.5 h-3 bg-rose-500 rounded-sm pointer-events-none"
                    style={{ left: `${(idx / (replay.deliveries.length - 1)) * 100}%` }}
                    title={`Wicket at ball ${idx + 1}`}
                  />
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
