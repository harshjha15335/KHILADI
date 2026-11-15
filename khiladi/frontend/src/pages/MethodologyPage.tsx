import React from "react";
import { KhiladiKineticText } from "../components/KhiladiKineticText";
import { AnalyticsIntro } from "../components/AnalyticsIntro";
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
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What counts as pressure?</h2>
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
