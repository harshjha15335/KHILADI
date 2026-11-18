import React, { useState } from "react";
import { NeutralPlayerAvatar } from "../NeutralPlayerAvatar";
import type { AnalyticalRole } from "../../types/analytics";
import { playerImage } from "../../utils/media";
import { number, tierLabel } from "./cardData";
import { useRoyalResearch } from "./RoyalResearch";
export interface Identity {
  player_id: number;
  player_name: string;
  role?: string;
  pressure_impact_index?: number;
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
  const source = playerImage(player);
  const publicIndex = Number.isFinite(player.pressure_impact_index) ? player.pressure_impact_index : undefined;
  const [failed, setFailed] = useState(false);
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
            src={source}
            alt=""
            width="300"
            height="300"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            style={{ position: "absolute", inset: 0 }}
            onError={() => setFailed(true)}
          />
        ) : (
          <NeutralPlayerAvatar className="pc-neutral-avatar"
            label={`No verified IPL portrait for ${player.player_name}`} />
        )}
        <span className="pc-preview-role">
          {selectedRole === "batting" ? "BATTING" : "BOWLING"} ANALYSIS
        </span>
      </div>
      <div className="pc-preview-info">
        <strong className="pc-preview-name">{player.player_name}</strong>
        <div className="pc-preview-rating">
          <span>{data ? "D20 rating" : publicIndex===undefined ? "Recorded profile" : "Legacy pressure index"}</span>
          <b>{data ? number(data.record.rating) : publicIndex===undefined ? "↗" : number(publicIndex,2)}</b>
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
              : publicIndex!==undefined ? "Observed legacy sample; not an accepted D20 score." : "Open this player’s public record."}
          </p>
        )}
        <span className="pc-preview-inspect">Inspect player ↗</span>
      </div>
    </div>
  );
}
