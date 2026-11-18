import { RoyalComparisonEvidence } from "../components/player-cards/RoyalComparisonEvidence";
import { RoyalIdentityPreview } from "../components/player-cards/RoyalIdentityPreview";
import { ResearchAccess } from "../components/player-cards/RoyalResearch";
import type { AnalyticalRole } from "../types/analytics";
import { siteURL } from "../utils/urls";
import { loadPlayers, metric } from "../utils/api";
import { playerImage } from "../utils/media";
import React, { useState, useEffect } from "react";
import { Player } from "../types";
import { SlidersHorizontal, Flame, Shield, ArrowRight } from "lucide-react";

const signedMetric = (value: number | undefined) =>
  typeof value === "number" && Number.isFinite(value)
    ? `${value > 0 ? "+" : ""}${value.toFixed(1)}`
    : "Unavailable";

interface PlayerComparisonPageProps {
  onSelectPlayer: (player: Player) => void;
  selectedIds?: number[];
  initialAnalyticalRole?: AnalyticalRole;
}

export const PlayerComparisonPage: React.FC<PlayerComparisonPageProps> = ({
  onSelectPlayer,
  selectedIds,
  initialAnalyticalRole = "batting",
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  const [analyticalRole, setAnalyticalRole] = useState<AnalyticalRole>(
    initialAnalyticalRole,
  );
  useEffect(() => {
    if (selectedIds?.[0]) setPlayerAId(selectedIds[0]);
    if (selectedIds?.[1]) setPlayerBId(selectedIds[1]);
    setAnalyticalRole(initialAnalyticalRole);
  }, [selectedIds, initialAnalyticalRole]);
  const [playerAId, setPlayerAId] = useState<number>(3297); // Shimron Hetmyer
  const [playerBId, setPlayerBId] = useState<number>(6423); // Riyan Parag

  useEffect(() => {
    let active = true;
    setError("");
    loadPlayers()
      .then((data) => {
        if (active) setPlayers(data);
      })
      .catch(() => {
        if (active) setError("Comparison player data could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const playerA = players.find((p) => p.player_id === playerAId) || players[0];
  const playerB = players.find((p) => p.player_id === playerBId) || players[1];

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#22263C] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border-b border-[#E8E6ED] pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEAF2] border border-[#F5B1CE] text-xs font-mono uppercase text-[#F22E83] font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Head-to-Head Diagnostics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#22263C]">
            Compare your players.
          </h1>
          <p className="text-sm text-[#505A70] max-w-2xl leading-relaxed">
            Pick two players. Compare their recorded batting and bowling in
            difficult moments. These are pressure-sample aggregates, not
            separate death-over estimates. Small samples may not support a
            reliable comparison.
          </p>
        </div>

        {error && (
          <div role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => setAttempt((v) => v + 1)}>
              Retry comparison data
            </button>
          </div>
        )}
        <ResearchAccess />
        <div
          className="pc-role-switch"
          role="group"
          aria-label="Comparison analytical role"
        >
          {(["batting", "bowling"] as const).map((role) => (
            <button
              type="button"
              key={role}
              aria-pressed={analyticalRole === role}
              onClick={() => setAnalyticalRole(role)}
            >
              {role === "batting" ? "Batting analysis" : "Bowling analysis"}
            </button>
          ))}
        </div>
        <div className="pc-comparison-previews">
          {[playerA, playerB].filter(Boolean).map((p, i) => (
            <button
              type="button"
              className="pc-preview-button"
              key={`${i}:${p.player_id}`}
              onClick={() => onSelectPlayer(p)}
              aria-label={`Inspect ${p.player_name}`}
            >
              <RoyalIdentityPreview player={p} role={analyticalRole} compact />
            </button>
          ))}
        </div>
        <RoyalComparisonEvidence
          players={[playerA, playerB]}
          role={analyticalRole}
        />
        <p className="pc-identity-scope">
          Card evidence uses the selected analytical role and accepted private
          model. The recorded strike-rate/economy comparison below remains a
          separate legacy model; marginal intervals do not establish a pairwise
          winner.
        </p>
        {/* Player Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E8E6ED] shadow-sm space-y-4">
            <label className="block text-xs font-mono uppercase text-[#68738A] font-bold">
              Select Player A
            </label>
            <select
              aria-label="Select player A"
              value={playerAId}
              onChange={(e) => setPlayerAId(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] text-sm font-bold text-[#22263C] focus:outline-none focus:border-[#F22E83] cursor-pointer"
            >
              {players.map((p) => (
                <option key={p.player_id} value={p.player_id}>
                  {p.player_name} ({p.role}) - ID #{p.player_id}
                </option>
              ))}
            </select>

            {playerA && (
              <div className="space-y-4 pt-4 border-t border-[#E8E6ED]">
                <div className="flex items-center gap-4">
                  {playerImage(playerA) ? (
                    <img
                      src={playerImage(playerA)}
                      alt={playerA.player_name}
                      className="w-16 h-16 object-contain rounded-2xl bg-[#FFEAF2] p-1 border border-[#F5B1CE]"
                    />
                  ) : (
                    <span
                      className="text-xl text-[#2450b8]"
                      aria-label="Portrait unavailable"
                    >
                      {playerA.player_name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  )}
                  <div>
                    <h3 className="text-xl font-bold font-display text-[#22263C]">
                      {playerA.player_name}
                    </h3>
                    <div className="text-xs font-mono text-[#F22E83]">
                      Legacy index: {metric(playerA.pressure_impact_index, 1)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono text-[#505A70]">
                  <div className="flex justify-between py-1.5 border-b border-[#E8E6ED]">
                    <span>Pressure Strike Rate</span>
                    <strong className="text-[#22263C]">
                      {metric(
                        playerA.batting.press_balls
                          ? playerA.batting.press_sr
                          : undefined,
                      )}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E8E6ED]">
                    <span>SR Delta</span>
                    <strong className="text-emerald-600">
                      {signedMetric(
                        playerA.batting.press_balls
                          ? playerA.batting.sr_delta
                          : undefined,
                      )}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E8E6ED]">
                    <span>Pressure Economy</span>
                    <strong className="text-[#2549BD]">
                      {metric(
                        playerA.bowling.press_balls
                          ? playerA.bowling.press_econ
                          : undefined,
                        2,
                      )}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8E6ED] shadow-sm space-y-4">
            <label className="block text-xs font-mono uppercase text-[#68738A] font-bold">
              Select Player B
            </label>
            <select
              aria-label="Select player B"
              value={playerBId}
              onChange={(e) => setPlayerBId(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] text-sm font-bold text-[#22263C] focus:outline-none focus:border-[#2549BD] cursor-pointer"
            >
              {players.map((p) => (
                <option key={p.player_id} value={p.player_id}>
                  {p.player_name} ({p.role}) - ID #{p.player_id}
                </option>
              ))}
            </select>

            {playerB && (
              <div className="space-y-4 pt-4 border-t border-[#E8E6ED]">
                <div className="flex items-center gap-4">
                  {playerImage(playerB) ? (
                    <img
                      src={playerImage(playerB)}
                      alt={playerB.player_name}
                      className="w-16 h-16 object-contain rounded-2xl bg-[#EAF5FF] p-1 border border-[#B3D4FF]"
                    />
                  ) : (
                    <span
                      className="text-xl text-[#2450b8]"
                      aria-label="Portrait unavailable"
                    >
                      {playerB.player_name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  )}
                  <div>
                    <h3 className="text-xl font-bold font-display text-[#22263C]">
                      {playerB.player_name}
                    </h3>
                    <div className="text-xs font-mono text-[#2549BD]">
                      Legacy index: {metric(playerB.pressure_impact_index, 1)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono text-[#505A70]">
                  <div className="flex justify-between py-1.5 border-b border-[#E8E6ED]">
                    <span>Pressure Strike Rate</span>
                    <strong className="text-[#22263C]">
                      {metric(
                        playerB.batting.press_balls
                          ? playerB.batting.press_sr
                          : undefined,
                      )}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E8E6ED]">
                    <span>SR Delta</span>
                    <strong className="text-emerald-600">
                      {signedMetric(
                        playerB.batting.press_balls
                          ? playerB.batting.sr_delta
                          : undefined,
                      )}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E8E6ED]">
                    <span>Pressure Economy</span>
                    <strong className="text-[#2549BD]">
                      {metric(
                        playerB.bowling.press_balls
                          ? playerB.bowling.press_econ
                          : undefined,
                        2,
                      )}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
