import React, { useEffect, useRef, useState } from "react";
import type { Player } from "../../types";
import type { AnalyticalRole } from "../../types/analytics";
import { RoyalPlayerCard } from "./RoyalPlayerCard";
import { ResearchAccess, useRoyalResearch } from "./RoyalResearch";
import { number, tierLabel } from "./cardData";
import { playerImage } from "../../utils/media";
import "./royal-card.css";
import "./player-cards.css";
export default function RoyalPlayerDialog({
  player,
  initialRole,
  onClose,
  onCompare,
  onAddToWarRoom,
  isInWarRoom,
  returnFocus,
}: {
  player: Player;
  initialRole: AnalyticalRole;
  onClose: () => void;
  onCompare: (id: number, role: AnalyticalRole) => void;
  onAddToWarRoom: (p: Player) => void;
  isInWarRoom: boolean;
  returnFocus?: HTMLElement | null;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    closeRef = useRef(onClose),
    [role, setRole] = useState(initialRole);
  closeRef.current = onClose;
  const research = useRoyalResearch(),
    data = research.lookup(player.player_id, role),
    portrait = playerImage(player);
  useEffect(() => {
    const focus = returnFocus ?? (document.activeElement as HTMLElement),
      old = document.body.style.overflow;
    const element = dialog.current;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = old;
      requestAnimationFrame(() => {
        if (focus?.isConnected) focus.focus({ preventScroll: true });
      });
    };
  }, [player.player_id]);
  const id = `royal-evidence-${player.player_id}`;
  return (
    <dialog
      ref={dialog}
      className="royal-dialog"
      aria-labelledby="royal-profile-title"
      onCancel={(e) => {
        e.preventDefault();
        closeRef.current();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) closeRef.current();
      }}
    >
      <header className="pc-dialog-header">
        <div>
          <span>PLAYER INTELLIGENCE / CANONICAL ID {player.player_id}</span>
          <h2 id="royal-profile-title">{player.player_name}</h2>
        </div>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Close profile"
        >
          Close ×
        </button>
      </header>
      <div className="pc-dialog-body">
        <div id="royal-prototype">
          <RoyalPlayerCard
            key={`${player.player_id}:${role}:${data?.identity ?? "unavailable"}`}
            data={data}
            identity={{
              player_id: player.player_id,
              player_name: player.player_name,
              analytical_role: role,
            }}
            analysisTarget={`#${id}`}
            onAnalysis={() => {
              const node = document.getElementById(id);
              node?.scrollIntoView({ block: "start" });
              node?.focus({ preventScroll: true });
            }}
          />
        </div>
        <section
          id={id}
          className="pc-profile-evidence"
          tabIndex={-1}
          aria-labelledby="royal-evidence-heading"
        >
          <h3 id="royal-evidence-heading">The evidence behind the card.</h3>
          <div
            className="pc-role-switch"
            role="group"
            aria-label="Profile analytical role"
          >
            {(["batting", "bowling"] as const).map((r) => (
              <button
                type="button"
                key={r}
                aria-pressed={r === role}
                onClick={() => setRole(r)}
              >
                {r === "batting" ? "Batting analysis" : "Bowling analysis"}
              </button>
            ))}
          </div>
          <ResearchAccess />
          {data ? (
            <>
              <dl className="pc-evidence-ledger">
                {[
                  ["D20 rating", number(data.record.rating)],
                  ["Primary rank", `#${data.record.rank}`],
                  [
                    "95% conditional interval",
                    `${number(data.record.rating_interval.lower)} to ${number(data.record.rating_interval.upper)}`,
                  ],
                  [
                    "Historical P(top 10)",
                    `${number(data.record.probability_top10 * 100, 1)}%`,
                  ],
                  ["Evidence tier", tierLabel(data.record.evidence_tier)],
                  ["Pressure events", data.record.exposure.pressure_events],
                  ["Pressure matches", data.record.exposure.pressure_matches],
                  [
                    "EB pressure quality",
                    number(data.record.pressure_quality_eb),
                  ],
                  ["EB pressure delta", number(data.record.pressure_delta_eb)],
                  [
                    "Positive pressure-match share",
                    `${number(data.record.positive_match_share * 100, 1)}%`,
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <p>
                Dimensionless within-role historical rating. P(top 10) is
                conditional bootstrap stability, not a future forecast. The
                model pools IPL, T20I and Other T20 evidence.
              </p>
              <details>
                <summary>Source and uncertainty</summary>
                <p>
                  <code>{data.metadata.model_id}</code> /{" "}
                  {data.metadata.pipeline_version}
                </p>
                <p>
                  750 within-player whole-match bootstrap resamples. Full
                  raw-to-final replay remains incomplete; event features are
                  source missing. Normal quality and final reliability are not
                  in this serving contract.
                </p>
                <p>
                  <code>{data.record.source_row}</code>
                </p>
              </details>
            </>
          ) : (
            <p role="status">
              {research.loading
                ? "Loading accepted D20 evidence…"
                : "Accepted D20 evidence is unavailable for this analytical role in the current serving scope. Missing is not zero or a finding of ineligibility. No legacy score has been substituted."}
            </p>
          )}
          <p className="pc-portrait-credit">
            {portrait ? "Player photo sourced for this identity; photo credits are in the site footer." : "Original cricket illustration is shown when a reusable player photo is unavailable."}
          </p>
          <div className="pc-profile-actions">
            <button
              type="button"
              onClick={() => onCompare(player.player_id, role)}
            >
              Compare player
            </button>
            <button
              type="button"
              disabled={isInWarRoom}
              onClick={() => onAddToWarRoom(player)}
            >
              {isInWarRoom ? "Added to your squad" : "Add to my squad"}
            </button>
          </div>
          <details>
            <summary>Legacy recorded statistics — separate model</summary>
            <dl className="pc-evidence-ledger">
              {[
                ["Recorded batting runs", player.batting?.total_runs],
                ["Recorded bowling wickets", player.bowling?.wickets],
                ["Legacy model index", player.pressure_impact_index],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {typeof value === "number"
                      ? number(value, label === "Legacy model index" ? 2 : 0)
                      : "Unavailable"}
                  </dd>
                </div>
              ))}
            </dl>
            <p>
              These inherited aggregates are not the accepted D20 model and do
              not fill missing D20 fields.
            </p>
          </details>
        </section>
      </div>
    </dialog>
  );
}
