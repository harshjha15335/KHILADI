import { requestJSON } from "../utils/api";
import { apiURL, siteURL } from "../utils/urls";
import { playerImage } from "../utils/media";
import { NeutralPlayerAvatar } from "../components/NeutralPlayerAvatar";
import "./pressure-theatre.css";
import React, { useState, useEffect } from "react";
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
  Target,
} from "lucide-react";

function DeliveryPortrait({id,name}:{id:number;name:string}) {
  const [failed,setFailed]=useState(false);
  const image=playerImage({player_id:id,player_name:name});
  if(!image||failed) return <NeutralPlayerAvatar className="pressure-duel__neutral"
    label={`No verified IPL portrait for ${name}`} />;
  return <img className="pressure-duel__portrait" src={image} alt=""
    width="160" height="170" loading="lazy" decoding="async" referrerPolicy="no-referrer"
    onError={()=>setFailed(true)} />;
}

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

export const PressureLabPage: React.FC<PressureLabPageProps> = ({
  onSelectPlayerById,
}) => {
  const [replay, setReplay] = useState<ReplayData | null>(null);
  const [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(600); // ms per ball

  useEffect(() => {
    let active = true;
    setError("");
    setReplay(null);
    setIsPlaying(false);
    requestJSON<ReplayData>("/data/sample_match_replay.json")
      .catch(() => requestJSON<ReplayData>("/api/match-replay"))
      .then((data) => {
        if (!Array.isArray(data.deliveries) || !data.deliveries.length)
          throw new Error("No recorded deliveries are available.");
        if (active) {
          setReplay(data);
          const first = data.deliveries.findIndex((d) => d.is_high_pressure);
          setCurrentIndex(first < 0 ? 0 : first);
        }
      })
      .catch(() => {
        if (active)
          setError(
            "The legacy sample replay is unavailable. No D20 event trace has been substituted.",
          );
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || !replay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= replay.deliveries.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, replay, playbackSpeed]);

  if (!replay || replay.deliveries.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] text-[#22263C] pt-32 text-center font-mono">
        {error ? (
          <div role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => setAttempt((v) => v + 1)}>
              Retry replay
            </button>
          </div>
        ) : (
          <p role="status">Loading the match replay…</p>
        )}
      </div>
    );
  }

  const currentDelivery =
    replay.deliveries[currentIndex] || replay.deliveries[0];
  const li = currentDelivery.leverage_index;
  const isHighLI = currentDelivery.is_high_pressure;

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#22263C] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <p className="rounded-xl bg-[#e8f1ff] p-4 text-sm text-[#163a94]">
          Legacy sample replay, not accepted D20 telemetry. Its pressure index
          is an inherited match-state heuristic; original D20 event-level A/B/D
          features are unavailable.
        </p>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E6ED] pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEAF2] border border-[#F5B1CE] text-xs font-mono uppercase text-[#F22E83] font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>WATCH THE MATCH TURN</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#22263C]">
              THE PRESSURE LAB
            </h1>
            <p className="text-sm text-[#505A70] max-w-2xl leading-relaxed">
              Move through the match one ball at a time. See who is batting,
              what happened, and how the model describes the pressure of the
              situation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E6ED] text-xs font-mono space-y-1 shadow-sm">
            <div className="text-[#68738A] uppercase">
              Match {replay.match_id}
            </div>
            <div className="font-bold text-[#22263C] text-sm">
              {replay.home_team} vs {replay.away_team}
            </div>
            <div className="text-[#2549BD] font-bold">
              {replay.total_deliveries} Deliveries Recorded
            </div>
          </div>
        </div>

        {/* Central Cockpit / Live Ball Display (Light Theme) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Delivery Screen (2 cols) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E6ED] shadow-sm space-y-6 relative overflow-hidden">
            {/* Wicket flash */}
            {currentDelivery.is_wicket && (
              <div className="absolute inset-0 bg-[#FFEAF2] animate-pulse pointer-events-none opacity-50" />
            )}

            {/* Top Bar: Over.Ball & Innings */}
            <div className="flex items-center justify-between border-b border-[#E8E6ED] pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-[#FFEAF2] text-xs font-mono font-bold text-[#F22E83]">
                  Innings {currentDelivery.innings}
                </span>
                <span className="text-2xl font-black font-mono text-[#22263C]">
                  Over {currentDelivery.over}.{currentDelivery.ball}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#68738A]">Score:</span>
                <span className="text-xl font-bold font-mono text-[#2549BD]">
                  {currentDelivery.cum_score}
                </span>
              </div>
            </div>

            {/* Duel Presentation: Striker vs Bowler */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Batter */}
              <button type="button"
                onClick={() => onSelectPlayerById(currentDelivery.striker_id)}
                className="pressure-duel p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] hover:border-[#F22E83] transition-all cursor-pointer group shadow-sm text-left"
              >
                <DeliveryPortrait key={currentDelivery.striker_id} id={currentDelivery.striker_id} name={currentDelivery.striker} />
                <div className="pressure-duel__info">
                <div className="text-[10px] font-mono uppercase text-[#F22E83] font-bold mb-1">
                  Striker
                </div>
                <div className="text-lg font-bold font-display text-[#22263C] group-hover:text-[#F22E83] transition-colors truncate">
                  {currentDelivery.striker}
                </div>
                <div className="text-xs font-mono text-[#68738A] mt-1">
                  ID #{currentDelivery.striker_id} • Click for Bio
                </div>
                </div>
              </button>

              {/* Bowler */}
              <button type="button"
                onClick={() => onSelectPlayerById(currentDelivery.bowler_id)}
                className="pressure-duel p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] hover:border-[#2549BD] transition-all cursor-pointer group shadow-sm text-left"
              >
                <DeliveryPortrait key={currentDelivery.bowler_id} id={currentDelivery.bowler_id} name={currentDelivery.bowler} />
                <div className="pressure-duel__info">
                <div className="text-[10px] font-mono uppercase text-[#2549BD] font-bold mb-1">
                  Bowler
                </div>
                <div className="text-lg font-bold font-display text-[#22263C] group-hover:text-[#2549BD] transition-colors truncate">
                  {currentDelivery.bowler}
                </div>
                <div className="text-xs font-mono text-[#68738A] mt-1">
                  ID #{currentDelivery.bowler_id} • Click for Bio
                </div>
                </div>
              </button>
            </div>

            {/* Ball Outcome Stage */}
            <div className="p-6 rounded-2xl bg-[#FFF3F8] border border-[#F5B1CE]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase text-[#68738A]">
                  Delivery Outcome
                </div>
                <div className="text-3xl font-display font-black text-[#22263C] mt-1">
                  {currentDelivery.is_wicket ? (
                    <span className="text-[#F22E83] flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6" />
                      WICKET! {currentDelivery.dismissal || "Caught"}
                    </span>
                  ) : currentDelivery.runs >= 4 ? (
                    <span className="text-[#2549BD] flex items-center gap-2">
                      <Zap className="w-6 h-6" />
                      BOUNDARY! {currentDelivery.runs} Runs
                    </span>
                  ) : (
                    <span>
                      {currentDelivery.runs} Run
                      {currentDelivery.runs === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono uppercase text-[#68738A]">
                  Leverage index (heuristic)
                </div>
                <div
                  className={`text-3xl font-mono font-black ${isHighLI ? "text-[#F22E83]" : "text-[#2549BD]"}`}
                >
                  {li.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Scrubber Timeline Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#68738A]">
                <span>
                  Ball {currentIndex + 1} of {replay.deliveries.length}
                </span>
                <span>
                  {(
                    (currentIndex / (replay.deliveries.length - 1)) *
                    100
                  ).toFixed(0)}
                  % Match Timeline
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={replay.deliveries.length - 1}
                value={currentIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentIndex(parseInt(e.target.value));
                }}
                className="w-full accent-[#F22E83] cursor-pointer"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                    }}
                    className="px-4 py-2 rounded-full bg-[#F22E83] text-white text-xs font-mono font-bold flex items-center gap-2 hover:bg-[#BA1656] transition-colors shadow-sm cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    <span>{isPlaying ? "PAUSE" : "PLAY REPLAY"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentIndex(0);
                      setIsPlaying(false);
                    }}
                    className="p-2 rounded-full bg-white border border-[#E8E6ED] text-[#505A70] hover:bg-[#FFEAF2] transition-colors cursor-pointer"
                    title="Reset to Ball 1"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#68738A]">Speed:</span>
                  {[1000, 500, 200].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setPlaybackSpeed(sp)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] cursor-pointer ${
                        playbackSpeed === sp
                          ? "bg-[#2549BD] text-white border-[#2549BD] font-bold"
                          : "bg-white text-[#505A70] border-[#E8E6ED]"
                      }`}
                    >
                      {sp === 1000 ? "1x" : sp === 500 ? "2x" : "5x"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Scientific Leverage Decomposition */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E8E6ED] shadow-sm space-y-4">
              <div className="text-xs font-mono uppercase text-[#F22E83] font-bold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Pressure Model State</span>
              </div>
              <div className="text-sm font-bold font-display text-[#22263C]">
                Why is this delivery {isHighLI ? "CRITICAL" : "ROUTINE"}?
              </div>
              <p className="text-xs text-[#505A70] leading-relaxed">
                The stored match-state heuristic is {li.toFixed(2)} for this
                delivery. It is not a calibrated win probability or a measured
                multiplier of match impact.
              </p>
              <div className="space-y-2 pt-2 text-xs font-mono text-[#505A70]">
                <div className="flex justify-between py-1 border-b border-[#E8E6ED]">
                  <span>Win probability</span>
                  <strong className="text-[#F22E83]">Not estimated</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8E6ED]">
                  <span>Threshold</span>
                  <strong className="text-[#2549BD]">
                    ≥ 1.80 heuristic index
                  </strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8E6ED]">
                  <span>Ranking prior</span>
                  <strong className="text-[#22263C]">
                    40 balls (aggregate rankings)
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
