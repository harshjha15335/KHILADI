import React, { useState } from "react";
import type { AnalyticalRole } from "../../types/analytics";
import { officialPortrait } from "./portraitSource";
import { number, tierLabel } from "./cardData";
import { useRoyalResearch } from "./RoyalResearch";
export interface Identity {
  player_id: number;
  player_name: string;
  role?: string;
}
export function RoyalIdentityPreview({
  player,
  role,
  compact = false,
}: {
  player: Identity;
  role?: AnalyticalRole;
  compact?: boolean;
}) {
  const selectedRole =
      role ?? (player.role === "Bowler" ? "bowling" : "batting"),
    research = useRoyalResearch(),
    data = research.lookup(player.player_id, selectedRole);
  const source = officialPortrait(player.player_id);
  const [failed, setFailed] = useState(false),
    [loaded, setLoaded] = useState(false);
  return (
    <div
      className={`pc-preview ${compact ? "pc-preview-compact" : ""}`}
      data-player-id={player.player_id}
      data-analytical-role={selectedRole}
    >
      <div className="pc-preview-visual">
        <span className="pc-preview-rank">
          {data
            ? `#${String(data.record.rank).padStart(2, "0")}`
            : `ID ${player.player_id}`}
        </span>
        {source && !failed ? (
          <img
            src={source.previewUrl ?? source.url}
            alt=""
            width="300"
            height="300"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)}
            style={{ opacity: loaded ? 1 : 0, position: "absolute", inset: 0 }}
            onError={() => setFailed(true)}
          />
        ) : (
          <span
            className="pc-initials"
            aria-label="Official portrait unavailable"
          >
            {player.player_name
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </span>
        )}
        {source && !failed && !loaded && (
          <span className="pc-initials" aria-label="Portrait loading">
            {player.player_name
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </span>
        )}
        <span className="pc-preview-role">
          {selectedRole === "batting" ? "BATTING" : "BOWLING"} ANALYSIS
        </span>
      </div>
      <div className="pc-preview-info">
        <strong className="pc-preview-name">{player.player_name}</strong>
        <div className="pc-preview-rating">
          <span>D20 rating</span>
          <b>{data ? number(data.record.rating) : "Unavailable"}</b>
        </div>
        {data ? (
          <p>
            {tierLabel(data.record.evidence_tier)} ·{" "}
            {data.record.exposure.pressure_events} pressure events
          </p>
        ) : (
          <p>
            {research.loading
              ? "Loading accepted evidence…"
              : "Accepted D20 evidence unavailable in this serving scope."}
          </p>
        )}
        <span className="pc-preview-inspect">Inspect player ↗</span>
      </div>
    </div>
  );
}
