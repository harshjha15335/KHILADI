import React, { lazy, Suspense, useRef, useState, useCallback } from "react";
import { StudyAthlete } from "./StudyAthlete";
import { useCardMotion } from "./useCardMotion";
import type { SceneControl } from "./FoilScene";
import { number, tierLabel, type CardData } from "./cardData";
import type { D20Ranking, AnalyticalRole } from "../../types/analytics";
import { officialPortrait, royalSymbol } from "./portraitSource";
const FoilScene = lazy(() => import("./FoilScene"));
export function RoyalPlayerCard({
  data,
  identity,
  analysisTarget = "#accepted-evidence",
  onAnalysis,
}: {
  data?: CardData | null;
  identity?: {
    player_id: number;
    player_name: string;
    analytical_role: AnalyticalRole;
  };
  analysisTarget?: string;
  onAnalysis?: () => void;
}) {
  const scene = useRef<SceneControl | null>(null),
    [fallback, setFallback] = useState(false),
    [retry, setRetry] = useState(0),
    [portraitLoaded, setPortraitLoaded] = useState(false),
    [portraitFailed, setPortraitFailed] = useState(false);
  const fail = useCallback(() => setFallback(true), []);
  const motion = useCardMotion(scene);
  const r: Partial<D20Ranking> & {
    player_id: number;
    player_name: string;
    analytical_role: AnalyticalRole;
  } = data?.record ?? identity!;
  const m = data?.metadata;
  const portrait = officialPortrait(r.player_id);
  const fullName = r.player_name.split(" "),
    last = fullName.pop(),
    first = fullName.join(" ");
  const frontInert = motion.back ? { inert: true } : {};
  const backInert = !motion.back ? { inert: true } : {};
  return (
    <section
      className="rc-experience"
      aria-label="Interactive royal trading card"
    >
      <p className="rc-stage-label">
        <span className="rc-live-dot" />
        PLAYER COLLECTION <span>{data ? "PRIVATE D20" : "IDENTITY"}</span>
      </p>
      <div
        ref={motion.surface}
        className={`rc-perspective ${motion.rotateMode ? "rc-rotate-mode" : ""}`}
        {...motion.handlers}
        data-testid="card-surface"
      >
        <div
          className="rc-card"
          ref={motion.root}
          data-testid="royal-card"
          data-motion="idle"
        >
          <div className="rc-spine rc-spine-left" aria-hidden="true" />
          <div className="rc-spine rc-spine-right" aria-hidden="true" />
          <div className="rc-spine rc-spine-top" aria-hidden="true" />
          <article
            className="rc-face rc-front"
            aria-label={`${r.player_name} trading card front`}
            aria-hidden={motion.back}
            {...frontInert}
          >
            {!fallback ? (
              <Suspense fallback={<div className="rc-foil-fallback" />}>
                <FoilScene key={retry} control={scene} onFallback={fail} />
              </Suspense>
            ) : (
              <div className="rc-foil-fallback" />
            )}
            <div className="rc-frame-inner" aria-hidden="true" />
            <div className="rc-engraving" aria-hidden="true">
              ✦
            </div>
            <div className="rc-topline">
              <img src={royalSymbol()} alt="KHILADI" />
              <span>PLAYER INTELLIGENCE</span>
              <span className="rc-role">
                {r.analytical_role === "batting" ? "BATTER" : "BOWLER"}
              </span>
            </div>
            <div className="rc-rank">
              <small>PRIMARY RANK</small>
              <strong>
                {r.rank ? `#${String(r.rank).padStart(2, "0")}` : "—"}
              </strong>
            </div>
            <div className="rc-study-caption">
              {portraitLoaded ? (
                <>
                  OFFICIAL IPL PORTRAIT
                  <br />
                  PRIVATE DEVELOPMENT REVIEW
                </>
              ) : (
                <>
                  PORTRAIT{" "}
                  {portraitFailed || !portrait ? "UNAVAILABLE" : "LOADING"}
                  <br />
                  NON-PLAYER ARTWORK FALLBACK
                </>
              )}
            </div>
            <div className="rc-portrait-halo" aria-hidden="true" />
            <div
              className={`rc-portrait ${portraitLoaded ? "rc-portrait-photo" : ""}`}
            >
              {!portraitLoaded && <StudyAthlete />}
              {portrait && !portraitFailed && (
                <img
                  className="rc-official-portrait"
                  src={portrait.url}
                  alt={`${r.player_name} — official IPL player portrait`}
                  width="1024"
                  height="1024"
                  decoding="async"
                  fetchPriority="high"
                  referrerPolicy="no-referrer"
                  style={{ opacity: portraitLoaded ? 1 : 0 }}
                  onLoad={() => setPortraitLoaded(true)}
                  onError={() => {
                    setPortraitFailed(true);
                    setPortraitLoaded(false);
                  }}
                  data-testid="official-player-portrait"
                />
              )}
            </div>
            <div className="rc-player-name">
              <span
                style={{
                  fontSize: Math.min(
                    24,
                    (330 / Math.max(1, first.length)) * 1.3,
                  ),
                }}
              >
                {first}
              </span>
              <strong
                style={{
                  fontSize: Math.min(
                    54,
                    (330 / Math.max(1, last.length)) * 1.25,
                  ),
                }}
              >
                {last}
              </strong>
            </div>
            <div className="rc-stat-face">
              <div className="rc-main-rating">
                <div>
                  <span>D20 RATING</span>
                  <strong data-testid="front-rating">
                    {data ? number(r.rating) : "—"}
                  </strong>
                </div>
                <div className="rc-tier">
                  <span>EVIDENCE TIER</span>
                  <b>{data ? tierLabel(r.evidence_tier) : "Unavailable"}</b>
                  <small>Historical evidence</small>
                </div>
              </div>
              <dl className="rc-front-stats">
                <div>
                  <dd data-testid="front-events">
                    {r.exposure?.pressure_events ?? "—"}
                  </dd>
                  <dt>Pressure events</dt>
                </div>
                <div>
                  <dd data-testid="front-matches">
                    {r.exposure?.pressure_matches ?? "—"}
                  </dd>
                  <dt>Pressure matches</dt>
                </div>
                <div>
                  <dd data-testid="front-stability">
                    {data ? number(r.probability_top10 * 100, 1) : "—"}
                    {data && <i>%</i>}
                  </dd>
                  <dt>Historical P(top 10)</dt>
                </div>
              </dl>
              <div className="rc-card-bottom">
                <span>
                  {data ? "POOLED T20" : `ID ${r.player_id}`} /{" "}
                  {r.analytical_role.toUpperCase()}
                </span>
                <span>
                  {data ? "DIMENSIONLESS RATING" : "D20 EVIDENCE UNAVAILABLE"}
                </span>
              </div>
            </div>
          </article>
          <article
            className="rc-face rc-back"
            aria-label={`${r.player_name} trading card evidence`}
            aria-hidden={!motion.back}
            {...backInert}
          >
            <div className="rc-back-header">
              <span>
                {data
                  ? "KHILADI / ACCEPTED EVIDENCE"
                  : "KHILADI / PLAYER IDENTITY"}
              </span>
              <strong>{r.player_name}</strong>
              <small>
                #{r.player_id} / {r.analytical_role} analysis / primary rank{" "}
                {r.rank ? `#${r.rank}` : "unavailable"}
              </small>
            </div>
            {data ? (
              <>
                <div className="rc-back-rating">
                  <strong>{number(r.rating)}</strong>
                  <span>
                    D20 rating
                    <br />
                    dimensionless within role
                  </span>
                </div>
                <div className="rc-interval">
                  <span>95% CONDITIONAL RATING INTERVAL</span>
                  <strong>
                    {number(r.rating_interval.lower)} <i>to</i>{" "}
                    {number(r.rating_interval.upper)}
                  </strong>
                </div>
                <dl className="rc-back-ledger">
                  <div>
                    <dt>Pressure events / matches</dt>
                    <dd>
                      {r.exposure?.pressure_events ?? "—"} /{" "}
                      {r.exposure?.pressure_matches ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt>Total matches / seasons / opponents</dt>
                    <dd>
                      {r.exposure.total_matches} / {r.exposure.seasons} /{" "}
                      {r.exposure.opponents}
                    </dd>
                  </div>
                  <div>
                    <dt>Historical P(top 10)</dt>
                    <dd>
                      {number(r.probability_top10 * 100, 1)}% ·{" "}
                      {tierLabel(r.evidence_tier)}
                    </dd>
                  </div>
                  <div>
                    <dt>EB pressure quality</dt>
                    <dd>{number(r.pressure_quality_eb)}</dd>
                  </div>
                  <div>
                    <dt>EB pressure delta</dt>
                    <dd>{number(r.pressure_delta_eb)}</dd>
                  </div>
                  <div>
                    <dt>Positive pressure-match share</dt>
                    <dd>{number(r.positive_match_share * 100, 1)}%</dd>
                  </div>
                </dl>
                <div className="rc-formats">
                  <span>PRESSURE-EVENT FORMAT MIX</span>
                  {[
                    ["IPL", r.format_exposure.ipl],
                    ["T20I", r.format_exposure.t20i],
                    ["Other T20", r.format_exposure.other_t20],
                  ].map(([label, n]) => (
                    <div key={label}>
                      <b>{label}</b>
                      <span>
                        {n}{" "}
                        <small>
                          /{" "}
                          {number(
                            (Number(n) / r.exposure.pressure_events) * 100,
                            1,
                          )}
                          %
                        </small>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="rc-back-note">
                  P(top 10) is historical bootstrap stability, not a future
                  forecast. Conditional intervals use {m.bootstrap_draws} match
                  resamples. Quality and delta: run equivalents per eligible
                  event.
                </p>
              </>
            ) : (
              <div className="pc-card-unavailable">
                <h3>D20 evidence unavailable</h3>
                <p>
                  This canonical identity is discoverable. No accepted record
                  for this analytical role is available in the current private
                  serving scope.
                </p>
                <p>
                  Missing evidence is not a zero rating or a finding of
                  ineligibility. Legacy metrics have not been substituted.
                </p>
              </div>
            )}
          </article>
        </div>
      </div>
      <div className="rc-controls" aria-label="Card controls">
        <button
          type="button"
          onClick={motion.flip}
          aria-label={motion.back ? "Flip to front" : "Flip to evidence"}
        >
          <span aria-hidden="true">↔</span> {motion.back ? "Front" : "Flip"}
        </button>
        <button type="button" onClick={motion.reset}>
          Reset
        </button>
        <a
          href={analysisTarget}
          onClick={(e) => {
            if (onAnalysis) {
              e.preventDefault();
              onAnalysis();
            }
          }}
        >
          Full analysis <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="rc-secondary-controls">
        <button
          type="button"
          aria-pressed={motion.rotateMode}
          disabled={motion.reduced}
          onClick={() => {
            motion.setRotateMode(!motion.rotateMode);
            if (motion.rotateMode) motion.rotate(0, 0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              motion.setRotateMode(false);
              motion.rotate(0, 0);
            }
            if (
              motion.rotateMode &&
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                e.key,
              )
            ) {
              e.preventDefault();
              motion.rotate(
                e.key === "ArrowUp" ? -10 : e.key === "ArrowDown" ? 10 : 0,
                e.key === "ArrowLeft" ? -25 : e.key === "ArrowRight" ? 25 : 0,
              );
            }
          }}
        >
          {motion.rotateMode ? "Exit rotate mode" : "Rotate mode"}
        </button>
        <button type="button" onClick={() => setFallback((v) => !v)}>
          {fallback ? "Enable holographic surface" : "Use static surface"}
        </button>
        {fallback && (
          <button
            type="button"
            onClick={() => {
              setRetry((v) => v + 1);
              setFallback(false);
            }}
          >
            Retry WebGL
          </button>
        )}
      </div>
      <p className="rc-motion-note" role="status">
        {motion.reduced
          ? "Reduced motion: direct front/evidence views; rotation disabled."
          : motion.rotateMode
            ? "Rotate mode: drag the card, or focus Rotate mode and use arrow keys. Escape exits."
            : "Move to catch the light. Drag to turn. Flip to investigate."}
      </p>
      <span className="rc-sr" aria-live="polite">
        {motion.back ? "Evidence face selected." : "Front face selected."}
      </span>
    </section>
  );
}
