import React, { useEffect, useRef, useState } from "react";
import {
  loadD20Rankings,
  privateAnalyticsAvailable,
} from "../../utils/analytics";
import { RoyalPlayerCard } from "../../components/player-cards/RoyalPlayerCard";
import {
  toCardData,
  number,
  tierLabel,
  type CardData,
} from "../../components/player-cards/cardData";
const PROTOTYPE_ID = 6819;
const EXPECTED_MODEL = "superr-d20-76496fa3c703320c";
export function RoyalCardPrototype() {
  const [draft, setDraft] = useState(""),
    [token, setToken] = useState(""),
    [data, setData] = useState<CardData | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    [attempt, setAttempt] = useState(0),
    [mounted, setMounted] = useState(true);
  const generation = useRef(0),
    unlockRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const sequence = ++generation.current;
    setData(null);
    setError("");
    setLoading(false);
    if (!token) return;
    const abort = new AbortController();
    setLoading(true);
    loadD20Rankings("batting", token, abort.signal)
      .then((response) => {
        const next = toCardData(
          response,
          PROTOTYPE_ID,
          "batting",
          EXPECTED_MODEL,
        );
        if (!abort.signal.aborted && sequence === generation.current)
          setData(next);
      })
      .catch((e) => {
        if (!abort.signal.aborted && sequence === generation.current)
          setError(
            e instanceof Error
              ? e.message
              : "Accepted evidence is unavailable.",
          );
      })
      .finally(() => {
        if (!abort.signal.aborted && sequence === generation.current)
          setLoading(false);
      });
    return () => abort.abort();
  }, [token, attempt]);
  const lock = () => {
    generation.current++;
    setToken("");
    setDraft("");
    setData(null);
    setError("");
    setLoading(false);
    requestAnimationFrame(() => unlockRef.current?.focus());
  };
  return (
    <div className="rc-page">
      <header className="rc-header">
        <a href="/" aria-label="Return to KHILADI">
          <img src="/assets/brand/khiladi-symbol.svg" alt="" />
          <span>KHILADI</span>
        </a>
        <span>
          THE ROYAL COLLECTION <i>/</i> STUDY 001
        </span>
        <span className="rc-private">PRIVATE PROTOTYPE</span>
      </header>
      <main>
        <div className="rc-opening">
          <section className="rc-editorial">
            <p className="rc-kicker">CRICKET INTELLIGENCE / A MATERIAL STUDY</p>
            <h1>
              The game.
              <br />
              <em>In a different</em>
              <br />
              light.
            </h1>
            <p className="rc-deck">
              A record worth holding.
              <br />
              An edge worth investigating.
            </p>
            <div className="rc-editorial-rule" />
            <p className="rc-intro-copy">
              Meet the Royal Player Card. Sculpted in blue, lit with rose,
              grounded in the evidence.
            </p>
            <p className="rc-art-note">
              <b>Official portrait / private review</b>
              <br />
              Official IPL photography, linked to Yashasvi Jaiswal’s player
              page. The unmodified portrait is used only in this private
              development study. If it cannot load, a labelled non-player
              illustration appears instead.
            </p>
            {!token ? (
              <form
                className="rc-access"
                onSubmit={(e) => {
                  e.preventDefault();
                  const key = draft.trim();
                  if (key.length < 32) {
                    setError("Enter a valid private development access token.");
                    return;
                  }
                  setToken(key);
                  setDraft("");
                }}
              >
                <label htmlFor="rc-token">Private research access</label>
                <div>
                  <input
                    ref={unlockRef}
                    id="rc-token"
                    type="password"
                    autoComplete="off"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Development access token"
                    required
                    disabled={!privateAnalyticsAvailable}
                  />
                  <button type="submit" disabled={!privateAnalyticsAvailable}>
                    Unlock <span aria-hidden="true">↗</span>
                  </button>
                </div>
                <small>
                  Credentials remain in memory. No public analytical release.
                </small>
              </form>
            ) : (
              <div className="rc-access-active">
                <span>Private evidence session</span>
                <button onClick={lock}>Lock & clear</button>
              </div>
            )}
            {error && (
              <div role="alert" className="rc-error">
                <p>{error}</p>
                {token && (
                  <button onClick={() => setAttempt((a) => a + 1)}>
                    Retry data
                  </button>
                )}
              </div>
            )}
          </section>
          {data && mounted ? (
            <RoyalPlayerCard key={data.identity} data={data} />
          ) : (
            <section
              className="rc-locked-stage"
              aria-label="Protected card unavailable"
            >
              <div className="rc-locked-object">
                <span className="rc-locked-brand">
                  KHILADI / RESEARCH EDITION
                </span>
                <span className="rc-locked-symbol">✦</span>
                <h2>
                  {loading
                    ? "Loading accepted evidence…"
                    : !mounted
                      ? "Card paused."
                      : "The evidence comes first."}
                </h2>
                <p>
                  {loading
                    ? "Validating the canonical identity, analytical role and source model."
                    : !mounted
                      ? "The interactive renderer has been unmounted."
                      : "Unlock private access to reveal the interactive card and its verified D20 record."}
                </p>
                <span>NO PLACEHOLDER STATISTICS</span>
              </div>
            </section>
          )}
        </div>
        {data && (
          <section
            id="accepted-evidence"
            className="rc-evidence"
            tabIndex={-1}
            aria-labelledby="rc-evidence-title"
          >
            <div className="rc-evidence-intro">
              <p className="rc-kicker">01 / THE RECORD BEHIND THE OBJECT</p>
              <h2 id="rc-evidence-title">
                Beauty, with
                <br />
                <em>the receipts.</em>
              </h2>
              <p>
                Accepted historical analysis for {data.record.player_name}.
                Every value on the card comes from this authenticated D20
                response.
              </p>
              <button onClick={() => setMounted((v) => !v)}>
                {mounted ? "Pause card / release GPU" : "Resume card"}
              </button>
            </div>
            <div className="rc-evidence-content">
              <h3>
                {data.record.player_name} / batting / #{data.record.player_id}
              </h3>
              <dl className="rc-evidence-grid">
                {[
                  ["Primary batting rank", `#${data.record.rank}`],
                  ["D20 rating", number(data.record.rating)],
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
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p>
                The rating is dimensionless within role. P(top 10) measures
                historical bootstrap selection stability, not future
                performance. Conditional intervals use{" "}
                {data.metadata.bootstrap_draws} within-player match resamples
                with frozen scales.
              </p>
              <details>
                <summary>Model, source and limitations</summary>
                <p>
                  Model: <code>{data.metadata.model_id}</code>
                </p>
                <p>
                  Scope: pooled IPL, T20I and Other T20, opponent adjusted,
                  descriptive historical analysis.
                </p>
                <p>
                  Pipeline: {data.metadata.pipeline_version}. Full raw-to-final
                  replay: incomplete. Event-level features: source missing.
                  Normal quality and final reliability are unavailable in this
                  serving contract; no substitute is shown.
                </p>
                <p>
                  Source row: <code>{data.record.source_row}</code>
                </p>
                <p>
                  Data version: <code>{data.metadata.data_version}</code>
                </p>
                <p>
                  Code SHA-256: <code>{data.metadata.ranking_code_sha256}</code>
                </p>
                <ul>
                  {Object.entries(data.metadata.sources).map(([name, hash]) => (
                    <li key={name}>
                      <code>
                        {name}: {hash}
                      </code>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </section>
        )}
      </main>
      <footer className="rc-footer">
        <span>KHILADI / ROYAL PLAYER CARD</span>
        <span>One object. Real evidence. / Stage B private study.</span>
      </footer>
    </div>
  );
}
