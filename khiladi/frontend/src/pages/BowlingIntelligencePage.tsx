import { loadPlayers, metric } from "../utils/api";
import { siteURL } from "../utils/urls";
import React, { useState, useEffect } from "react";
import { Player } from "../types";
import { EditorialSpotlight } from "../components/EditorialSpotlight";
import { playerImage } from "../utils/media";
import { ShieldCheck, TrendingDown, Search } from "lucide-react";

interface BowlingIntelligencePageProps {
  onSelectPlayer: (player: Player) => void;
}

export const BowlingIntelligencePage: React.FC<
  BowlingIntelligencePageProps
> = ({ onSelectPlayer }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    loadPlayers()
      .then((data: Player[]) => {
        const filtered = data
          .filter(
            (p) =>
              (p.bowling.press_balls || 0) >= 12 &&
              p.bowling.press_econ &&
              p.bowling.press_econ > 0,
          )
          .sort(
            (a, b) =>
              (a.bowling.press_econ || 99) - (b.bowling.press_econ || 99),
          );
        if (active) setPlayers(filtered);
      })
      .catch(() => {
        if (active) setError("Recorded player data could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const displayed = players
    .filter((p) =>
      p.player_name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .slice(0, 30);

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#22263C] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <p className="rounded-xl bg-[#e8f1ff] p-4 text-sm text-[#163a94]">
          Legacy recorded bowling aggregates. Accepted D20 ratings and
          conditional intervals are separate; open Rankings or an available
          private player record to inspect them.
        </p>
        <div className="border-b border-[#E8E6ED] pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FF] border border-[#B3D4FF] text-xs font-mono uppercase text-[#2549BD] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bowling under pressure Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#22263C]">
            BOWLING UNDER PRESSURE
          </h1>
          <p className="text-sm text-[#505A70] max-w-2xl leading-relaxed">
            Recorded pressure bowling aggregates, not a separate overs 16–20
            split. Includes players with at least 12 pressure deliveries.
          </p>
        </div>

        <EditorialSpotlight
          title="Meet the bowlers."
          subtitle="Featured players with source-matched portraits and recorded pressure bowling aggregates."
          entries={players.filter(p=>Boolean(playerImage(p))).slice(0,3).map(p=>({
            player_id:p.player_id,player_name:p.player_name,role:p.role,
            label:"Pressure economy",
            value:metric(p.bowling.press_econ,2),
          }))}
          onInspect={id=>{const player=players.find(p=>p.player_id===id);if(player)onSelectPlayer(player)}}
        />
        {/* Search */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search clutch bowlers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E8E6ED] text-sm text-[#22263C] placeholder-[#68738A] focus:outline-none focus:border-[#2549BD] shadow-sm"
          />
        </div>

        {loading && <p role="status">Loading recorded players…</p>}
        {error && (
          <div role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => setAttempt((v) => v + 1)}>
              Retry player data
            </button>
          </div>
        )}
        {!loading && !error && !displayed.length && (
          <p role="status">No recorded players match this search.</p>
        )}
        {/* Table */}
        <div className="overflow-x-auto rounded-3xl border border-[#E8E6ED] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#EAF5FF] border-b border-[#B3D4FF]/60 text-xs font-mono uppercase text-[#505A70]">
              <tr>
                <th className="py-4 px-6">Bowler</th>
                <th className="py-4 px-6 text-right">Pressure Balls</th>
                <th className="py-4 px-6 text-right">Pressure Econ</th>
                <th className="py-4 px-6 text-right">Overall Econ</th>
                <th className="py-4 px-6 text-right">Econ Delta</th>
                <th className="py-4 px-6 text-right">Legacy index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6ED]">
              {displayed.map((p) => (
                <tr
                  key={p.player_id}
                  onClick={() => {
                    onSelectPlayer(p);
                  }}
                  className="hover:bg-[#EAF5FF]/40 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6">
                    <button
                      className="font-bold text-[#22263C] group-hover:text-[#2549BD] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlayer(p);
                      }}
                    >
                      {p.player_name}
                    </button>
                    <div className="text-[10px] font-mono text-[#68738A]">
                      ID #{p.player_id}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-[#505A70]">
                    {p.bowling.press_balls || 0}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-[#2549BD]">
                    {metric(p.bowling.press_econ, 2)}
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-[#505A70]">
                    {metric(p.bowling.overall_econ, 2)}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-emerald-600">
                    {metric(p.bowling.econ_delta, 2)}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-black text-[#22263C]">
                    {metric(p.pressure_impact_index, 1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
