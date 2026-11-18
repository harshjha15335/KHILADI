import React from "react";
import type { Identity } from "./RoyalIdentityPreview";
import type { AnalyticalRole } from "../../types/analytics";
import { useRoyalResearch } from "./RoyalResearch";
import { number, tierLabel, type CardData } from "./cardData";
export function RoyalComparisonEvidence({
  players,
  role,
}: {
  players: Array<Identity | undefined>;
  role: AnalyticalRole;
}) {
  const research = useRoyalResearch();
  const records = players.map((p) =>
    p ? research.lookup(p.player_id, role) : null,
  );
  const present = records.filter((r): r is CardData => !!r);
  const low = Math.min(
      -1,
      ...present.flatMap((d) => [
        d.record.rating,
        d.record.rating_interval.lower,
      ]),
    ),
    high = Math.max(
      5,
      ...present.flatMap((d) => [
        d.record.rating,
        d.record.rating_interval.upper,
      ]),
    );
  const x = (v: number) => 250 + ((v - low) / (high - low)) * 405;
  const metrics: Array<[string, (d: CardData) => string]> = [
    ["D20 rating", (d) => number(d.record.rating)],
    [
      "95% conditional interval",
      (d) =>
        `${number(d.record.rating_interval.lower)} to ${number(d.record.rating_interval.upper)}`,
    ],
    [
      "Historical P(top 10)",
      (d) => `${number(d.record.probability_top10 * 100, 1)}%`,
    ],
    ["Evidence tier", (d) => tierLabel(d.record.evidence_tier)],
    ["Pressure events", (d) => String(d.record.exposure.pressure_events)],
    ["Pressure matches", (d) => String(d.record.exposure.pressure_matches)],
    ["EB pressure quality", (d) => number(d.record.pressure_quality_eb)],
    ["EB pressure delta", (d) => number(d.record.pressure_delta_eb)],
    [
      "Positive pressure-match share",
      (d) => `${number(d.record.positive_match_share * 100, 1)}%`,
    ],
    [
      "IPL / T20I / Other T20 events",
      (d) =>
        `${d.record.format_exposure.ipl} / ${d.record.format_exposure.t20i} / ${d.record.format_exposure.other_t20}`,
    ],
  ];
  if (!research.available) return null;
  return (
    <section
      className="pc-comparison-evidence"
      aria-labelledby="accepted-comparison-title"
    >
      <h2 id="accepted-comparison-title">Accepted D20 evidence · {role}</h2>
      <p>
        Shared role and model; dimensionless historical ratings. Each interval
        is conditional. Overlap or a point-rating difference does not establish
        a statistically proven winner.
      </p>
      {present.length > 0 && (
        <svg
          viewBox="0 0 700 180"
          aria-hidden="true"
          className="pc-comparison-intervals"
        >
          <line
            x1={x(0)}
            x2={x(0)}
            y1="20"
            y2="120"
            stroke="#8b98b5"
            strokeDasharray="4 5"
          />
          {records.map((d, i) => (
            <g key={i}>
              <text x="10" y={49 + i * 55} fill="#182643" fontSize="14">
                {players[i]?.player_name.slice(0, 25) ?? "Select player"}
              </text>
              {d ? (
                <>
                  <line
                    x1={x(d.record.rating_interval.lower)}
                    x2={x(d.record.rating_interval.upper)}
                    y1={45 + i * 55}
                    y2={45 + i * 55}
                    stroke="#2450b8"
                    strokeWidth="3"
                  />
                  <circle
                    cx={x(d.record.rating)}
                    cy={45 + i * 55}
                    r="6"
                    fill="#ed267b"
                  />
                </>
              ) : (
                <text x="250" y={49 + i * 55} fontSize="13" fill="#536079">
                  Evidence unavailable
                </text>
              )}
            </g>
          ))}
          <line x1="250" x2="655" y1="135" y2="135" stroke="#b8c2d7" />
          {[low, 0, high].map((t) => (
            <text
              key={t}
              x={x(t)}
              y="157"
              textAnchor="middle"
              fontSize="12"
              fill="#536079"
            >
              {t.toFixed(1)}
            </text>
          ))}
          <text
            x="452"
            y="177"
            textAnchor="middle"
            fontSize="12"
            fill="#536079"
          >
            D20 rating / dimensionless within role
          </text>
        </svg>
      )}
      <div className="overflow-x-auto">
        <table className="pc-accepted-comparison-table">
          <caption>
            Accepted {role} comparison — protected evidence only
          </caption>
          <thead>
            <tr>
              <th scope="col">Measure</th>
              {players.map((p, i) => (
                <th scope="col" key={i}>
                  {p?.player_name ?? "Select player"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map(([label, format]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {records.map((d, i) => (
                  <td key={i}>{d ? format(d) : "Unavailable"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Format counts share the pressure-event denominator. A missing served
        record is not zero or ineligible.{" "}
        {present[0] && (
          <>
            Model: <code>{present[0].metadata.model_id}</code>.
          </>
        )}
      </p>
    </section>
  );
}
