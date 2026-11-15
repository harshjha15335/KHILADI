import { playerImage } from "../utils/media";
import React, { useState, useEffect } from "react";
import { TopBatter, TopBowler } from "../types";
import {
  Award,
  Download,
  Flame,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

interface RankingsPageProps {
  onSelectPlayerById: (playerId: number) => void;
}

export const RankingsPage: React.FC<RankingsPageProps> = ({
  onSelectPlayerById,
}) => {
  const [activeTab, setActiveTab] = useState<"batters" | "bowlers">("batters");
  const [batters, setBatters] = useState<TopBatter[]>([]);
  const [bowlers, setBowlers] = useState<TopBowler[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/top_10_batters.json")
        .then((r) => r.json())
        .catch(() => fetch("/api/rankings/batters").then((r) => r.json())),
      fetch("/data/top_10_bowlers.json")
        .then((r) => r.json())
        .catch(() => fetch("/api/rankings/bowlers").then((r) => r.json())),
    ])
      .then(([bData, boData]) => {
        setBatters(Array.isArray(bData) ? bData : bData.rankings);
        setBowlers(Array.isArray(boData) ? boData : boData.rankings);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load rankings:", err);
        setLoading(false);
      });
  }, []);

  const downloadCSV = (type: "batters" | "bowlers") => {
    const url =
      type === "batters"
        ? "/data/top_10_batters.csv"
        : "/data/top_10_bowlers.csv";
    const link = document.createElement("a");
    link.href = url;
    link.download = `rr_superr_selector_top_10_${type}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#22263C] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header (Clean Editorial Light Styling) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E6ED] pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEAF2] border border-[#F5B1CE] text-xs font-mono uppercase text-[#F22E83] font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>COMPETITION MODEL OUTPUTS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#22263C]">
              Who delivers under pressure?
            </h1>
            <p className="text-sm text-[#505A70] max-w-2xl leading-relaxed">
              Explore the ten highest-ranked batters and bowlers in the stored
              model outputs. A higher impact index means stronger estimated
              pressure performance in this sample. Open a player to inspect
              their record; these rankings are estimates, not guarantees.
            </p>
          </div>

          {/* Export Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => downloadCSV(activeTab)}
              className="delta-btn-mask px-5 py-2.5 bg-[#F22E83] text-white text-xs font-mono font-bold tracking-wider uppercase rounded-full shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2 inline-block" />
              <span>
                Export {activeTab === "batters" ? "Batters" : "Bowlers"} CSV
              </span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setActiveTab("batters");
            }}
            className={`px-6 py-3 rounded-full font-display text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "batters"
                ? "bg-[#F22E83] text-white shadow-md"
                : "bg-white text-[#505A70] border border-[#E8E6ED] hover:bg-[#FFEAF2]"
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Top 10 Batters Under Pressure</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("bowlers");
            }}
            className={`px-6 py-3 rounded-full font-display text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "bowlers"
                ? "bg-[#2549BD] text-white shadow-md"
                : "bg-white text-[#505A70] border border-[#E8E6ED] hover:bg-[#EAF5FF]"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Top 10 Bowlers Under Pressure</span>
          </button>
        </div>

        {/* BATTERS TABLE (Light Editorial Theme) */}
        {activeTab === "batters" && (
          <div className="overflow-x-auto rounded-3xl border border-[#E8E6ED] bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FFF3F8] border-b border-[#F5B1CE]/60 text-xs font-mono uppercase tracking-wider text-[#505A70]">
                <tr>
                  <th className="py-4 px-6 text-center w-16">Rank</th>
                  <th className="py-4 px-6">Player</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6 text-right">Pressure SR</th>
                  <th className="py-4 px-6 text-right">Normal SR</th>
                  <th className="py-4 px-6 text-right">SR Delta</th>
                  <th className="py-4 px-6 text-right">Pressure Score</th>
                  <th className="py-4 px-6 text-center">Unstop Eligible</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6ED]">
                {batters.map((b, idx) => (
                  <tr
                    key={b.player_id}
                    onClick={() => {
                      onSelectPlayerById(b.player_id);
                    }}
                    className="hover:bg-[#FFF1F7] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 text-center font-mono font-bold text-base text-[#22263C]">
                      {idx === 0 ? (
                        <span className="text-[#F22E83] font-black">#1</span>
                      ) : (
                        `#${idx + 1}`
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap items-center gap-3">
                        {playerImage({
                          player_id: b.player_id,
                          portrait_url: b.portrait_url,
                        }) ? (
                          <img
                            src={playerImage({
                              player_id: b.player_id,
                              portrait_url: b.portrait_url,
                            })}
                            alt={b.player_name}
                            className="w-10 h-10 object-contain rounded-full bg-[#FFEAF2] p-1 border border-[#F5B1CE]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#FFEAF2] flex items-center justify-center text-[#F22E83] font-bold">
                            {b.player_name.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <button
                            className="font-bold text-[#22263C] group-hover:text-[#F22E83] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPlayerById(b.player_id);
                            }}
                          >
                            {b.player_name}
                          </button>
                          <div className="text-[11px] font-mono text-[#68738A]">
                            ID #{b.player_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-[#505A70]">
                      {b.role || "Batter"}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-[#F22E83]">
                      {(b.pressure_strike_rate || b.pressure_sr || 0).toFixed(
                        1,
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-[#505A70]">
                      {(b.baseline_strike_rate || b.normal_sr || 0).toFixed(1)}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-emerald-600 flex items-center justify-end gap-1">
                      {(b.strike_rate_delta ?? b.sr_delta ?? 0) >= 0 ? "+" : ""}
                      {(b.strike_rate_delta ?? b.sr_delta ?? 0).toFixed(1)}
                      <TrendingUp className="w-3.5 h-3.5" />
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-black text-[#22263C] text-base">
                      {(
                        b.pressure_impact_index ||
                        b.pressure_score ||
                        0
                      ).toFixed(1)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BOWLERS TABLE (Light Editorial Theme) */}
        {activeTab === "bowlers" && (
          <div className="overflow-x-auto rounded-3xl border border-[#E8E6ED] bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#EAF5FF] border-b border-[#B3D4FF]/60 text-xs font-mono uppercase tracking-wider text-[#505A70]">
                <tr>
                  <th className="py-4 px-6 text-center w-16">Rank</th>
                  <th className="py-4 px-6">Player</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6 text-right">Pressure Econ</th>
                  <th className="py-4 px-6 text-right">Normal Econ</th>
                  <th className="py-4 px-6 text-right">Econ Delta</th>
                  <th className="py-4 px-6 text-right">Pressure Score</th>
                  <th className="py-4 px-6 text-center">Unstop Eligible</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6ED]">
                {bowlers.map((bo, idx) => (
                  <tr
                    key={bo.player_id}
                    onClick={() => {
                      onSelectPlayerById(bo.player_id);
                    }}
                    className="hover:bg-[#EAF5FF]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 text-center font-mono font-bold text-base text-[#22263C]">
                      {idx === 0 ? (
                        <span className="text-[#2549BD] font-black">#1</span>
                      ) : (
                        `#${idx + 1}`
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap items-center gap-3">
                        {playerImage({
                          player_id: bo.player_id,
                          portrait_url: bo.portrait_url,
                        }) ? (
                          <img
                            src={playerImage({
                              player_id: bo.player_id,
                              portrait_url: bo.portrait_url,
                            })}
                            alt={bo.player_name}
                            className="w-10 h-10 object-contain rounded-full bg-[#EAF5FF] p-1 border border-[#B3D4FF]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#EAF5FF] flex items-center justify-center text-[#2549BD] font-bold">
                            {bo.player_name.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <button
                            className="font-bold text-[#22263C] group-hover:text-[#2549BD] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPlayerById(bo.player_id);
                            }}
                          >
                            {bo.player_name}
                          </button>
                          <div className="text-[11px] font-mono text-[#68738A]">
                            ID #{bo.player_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-[#505A70]">
                      {bo.role || "Bowler"}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-[#2549BD]">
                      {(bo.pressure_economy || bo.pressure_econ || 0).toFixed(
                        2,
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-[#505A70]">
                      {(bo.baseline_economy || bo.normal_econ || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-emerald-600 flex items-center justify-end gap-1">
                      {(bo.economy_delta || bo.econ_delta || 0).toFixed(2)}
                      <TrendingDown className="w-3.5 h-3.5" />
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-black text-[#22263C] text-base">
                      {(
                        bo.pressure_impact_index ||
                        bo.pressure_score ||
                        0
                      ).toFixed(1)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
