import React from "react";
import { KhiladiKineticText } from "../components/KhiladiKineticText";
import { AnalyticsIntro } from "../components/AnalyticsIntro";
import { MethodologyConnectivityGraph } from "../components/MethodologyConnectivityGraph";
import "./methodology-story.css";
export const MethodologyPage: React.FC = () => (
  <div className="min-h-screen pt-32 pb-20 px-5">
    <div className="max-w-4xl mx-auto space-y-10">
      <KhiladiKineticText
        as="h1"
        text="Behind the big moments."
        className="text-4xl sm:text-6xl font-bold"
      />
      <AnalyticsIntro>
        The numbers help you ask better questions about a player. They describe
        recorded performance, and cannot promise what happens next.
      </AnalyticsIntro>
      <section className="methodology-story" aria-labelledby="methodology-story-title">
        <header>
          <p className="eyebrow">FROM MATCH TO MEANING</p>
          <h2 id="methodology-story-title">Every number has a journey.</h2>
          <p>Follow the public evidence through four readable stages. The private
          accepted D20 pipeline is documented separately below.</p>
        </header>
        <ol className="methodology-story__steps">
          {[
            ["01","Collect","Recorded balls, player identities and match states",
             "The competition pack is historical, not a live auction feed."],
            ["02","Context","Situations described by the inherited match-state heuristic",
             "The public 1.8 threshold is not D20's hybrid definition."],
            ["03","Measure","Pressure runs, balls, wickets, strike rate and economy",
             "Stored aggregates and exposure limits accompany every comparison."],
            ["04","Interpret","Explore rankings, profiles, comparisons and squad scenarios",
             "Legacy indices are descriptive, not win probabilities or future forecasts."],
          ].map(([number,title,summary,caveat])=>(
            <li className="methodology-story__step" key={number}>
              <span className="methodology-story__number">{number}</span>
              <strong>{title}</strong>
              <p>{summary}</p>
              <details><summary>What this means</summary><p>{caveat}</p></details>
            </li>
          ))}
        </ol>
      </section>
      <MethodologyConnectivityGraph />
      <section
        className="space-y-5 rounded-3xl border border-[#cbd5e9] bg-white p-6 sm:p-8"
        aria-labelledby="accepted-d20-method"
      >
        <p className="text-sm font-bold uppercase tracking-wider text-[#2450b8]">
          Accepted D20 / private analytical model
        </p>
        <h2 id="accepted-d20-method" className="text-2xl font-bold">
          The evidence on the Royal Player Card.
        </h2>
        <p>
          The accepted D20 pipeline combines pre-ball scoreboard difficulty A
          and win-probability leverage B into hybrid pressure D. D20 selects the
          top 20% under that definition. This is separate from the inherited
          1.8-threshold heuristic described below.
        </p>
        <p>
          Expected outcomes, era and opposition adjustment produce
          run-equivalent contributions. Component-specific empirical-Bayes
          shrinkage and exposure eligibility precede separate batting and
          bowling ratings. Primary eligibility requires at least 60 pressure
          events, 12 pressure matches, 15 total matches, two seasons and four
          opponents.
        </p>
        <p>
          The role-standardized historical rating combines 70% standardized EB
          pressure quality, 20% standardized match reliability and 10%
          standardized EB pressure delta. The accepted bowling delta is fully
          shrunk to zero; its weight is not redistributed. A numerical zero is
          distinct from unavailable evidence.
        </p>
        <p>
          Conditional 95% rating intervals and historical P(top 10) use 750
          within-player whole-match bootstrap resamples with frozen
          cohort/scales. P(top 10) describes historical selection stability, not
          a future selection or match-win probability. The intervals do not
          include all model-choice uncertainty.
        </p>
        <p>
          Robust means P(top 10) at least 65% and a positive lower interval
          bound. Probable means at least 45% when not Robust. Borderline covers
          the other selected top-ten records. These are evidence tiers, not
          collectible rarity or psychological diagnoses.
        </p>
        <p>
          The primary model pools IPL, T20I and Other T20 evidence. Format
          shares divide pressure-event counts by total pressure events; a
          visible IPL share does not turn the pooled rating into an IPL-only
          estimate.
        </p>
        <p>
          The private serving scope currently contains ten batting and ten
          bowling records, drawn from accepted cohorts of 157 and 154
          respectively. The 1,217-player identity catalogue is broader. A
          missing served record is unavailable, not a zero score or a finding of
          ineligibility.
        </p>
        <p className="text-sm text-[#536079]">
          Accepted downstream outputs have been verified from supplied artifacts
          and match composites. Full raw-to-final replay remains incomplete, and
          original event-level A/B/D features are missing. The website does not
          invent those event traces, future forecasts, auction prices or
          team-fit scores.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Legacy pressure rules — a separate model.
        </h2>
        <p>
          The inherited model uses rules based on innings, overs, runs needed,
          wickets already lost, and knockout status. A delivery is labelled high
          pressure when its calculated index reaches 1.8. This is a match-state
          heuristic; it is not a calibrated win-probability model.
        </p>
        <details>
          <summary>Inspect the match-state rules</summary>
          <div className="space-y-4 py-4">
            <p>
              For example, a first-innings delivery in overs 16–20 receives 2.2
              when at most five wickets have fallen, or 1.8 with six to eight
              wickets down. A knockout match multiplies the score by 1.25.
              Chases also use required run rate and balls remaining.
            </p>
            <p>
              The implementation is in{" "}
              <code>scripts/build_pressure_model.py</code>. Its ball-count and
              leakage assumptions require separate statistical validation; this
              frontend takeover did not rebuild the model.
            </p>
          </div>
        </details>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Compare like with like.</h2>
        <p>
          Batting strike rate means runs per 100 balls. Bowling economy means
          runs conceded per over. The baseline shown here is the player's
          overall recorded sample, including pressure deliveries. It is not a
          separately estimated normal-only or role-adjusted baseline.
        </p>
        <details>
          <summary>Understand the changes and model index</summary>
          <div className="space-y-4 py-4">
            <p>
              Batting change = pressure strike rate − overall strike rate. A
              positive value means faster scoring. Bowling economy improvement =
              overall economy − pressure economy. A positive value means fewer
              runs conceded under pressure.
            </p>
            <p>
              The batting index combines a strike rate shrunk toward 125 with a
              40-ball prior, boundary frequency, dot-ball avoidance, and
              pressure average. The bowling index uses an economy prior of 9
              with 40 balls, dot-ball percentage, and wicket-taking rate. The
              stored all-rounder index combines the batting and bowling indices
              using the inherited weights.
            </p>
            <p>
              These composite indices are estimates, not percentages,
              psychological diagnoses, or probabilities of success. Scores from
              different roles are not directly interchangeable.
            </p>
          </div>
        </details>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          A small sample tells a smaller story.
        </h2>
        <p>
          The two top-ten exports use the existing qualification rules: batters
          need at least 100 recorded balls and 35 pressure balls; bowlers need
          at least 120 recorded balls and 40 pressure balls. The broader player
          database includes players with less evidence.
        </p>
        <p>
          Confidence intervals, chronological backtesting, role-adjusted
          baselines and separate phase-level estimates are not present in the
          supplied outputs. They have not been invented for this interface.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Where do the players come from?</h2>
        <p>
          Selectable players are restricted to the original competition mapping.
          The Royals parade uses the latest Rajasthan Royals IPL season
          represented in that pack—IPL 2026. This does not claim a current live
          squad or auction eligibility.
        </p>
        <p>
          Official IPL source identity and media reuse permission are separate
          checks. The local preview includes review-only imagery; a production
          build requires cleared media. Existing model outputs, source files and
          ranking exports are preserved.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">How recommendations work</h2>
        <p>
          The existing recommendation service filters by playing role and
          recorded pressure sample, then orders by model index or pressure
          strike rate/economy for its final-overs option. It does not calculate
          a separate phase-specific forecast or risk preference. Recommendations
          are a starting point for research.
        </p>
      </section>
      <button className="text-link" onClick={() => window.print()}>
        Print these notes ↗
      </button>
    </div>
  </div>
);
