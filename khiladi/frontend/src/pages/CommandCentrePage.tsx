import React from "react";
import { PublicDataPulse } from "../components/PublicDataPulse";
import { EditorialSpotlight } from "../components/EditorialSpotlight";
import type { Player } from "../types";
import { playerImage } from "../utils/media";

interface CommandCentrePageProps {
  onNavigate: (page: string) => void;
  rrPurseCr?: number;
  players?: Player[];
  onSelectPlayer?: (player:Player)=>void;
}

export const CommandCentrePage: React.FC<CommandCentrePageProps> = ({
  onNavigate,
  rrPurseCr = 120.0,
}) => {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#22263C] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="border-b border-[#E8E6ED] pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEAF2] border border-[#F5B1CE] text-xs font-mono uppercase text-[#F22E83] font-bold">
            <span>EXPLORE THE GAME</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#22263C]">
            Your cricket workspace.
          </h1>
          <p className="text-sm text-[#505A70] max-w-2xl leading-relaxed">
            Explore the stored player records, compare match performances, or
            plan a squad of your own.
          </p>
        </div>

        <PublicDataPulse onNavigate={onNavigate} compact />
        <EditorialSpotlight
          title="People before predictions."
          subtitle="A source-matched photographic entry into the historical records."
          entries={players.filter(p=>p.is_rr && Boolean(playerImage(p))).slice(0,3).map(p=>({
            player_id:p.player_id,player_name:p.player_name,role:p.role,
            label:"Recorded pressure deliveries",
            value:String(p.batting.press_balls+p.bowling.press_balls),
          }))}
          onInspect={id=>{const player=players.find(p=>p.player_id===id);if(player)onSelectPlayer?.(player)}}
        />
        {/* Existing source-specific quick-launch cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => {
              onNavigate("rankings");
            }}
            className="text-left p-6 rounded-3xl bg-white border border-[#E8E6ED] hover:border-[#F22E83] transition-all cursor-pointer group space-y-2 shadow-sm hover:shadow"
          >
            <div className="flex items-center justify-between text-[#68738A] text-xs font-mono uppercase">
              <span>Top 10 Rankings</span>
              
            </div>
            <div className="text-3xl font-black font-mono text-[#22263C] group-hover:text-[#F22E83] transition-colors">
              20 Players
            </div>
            <div className="text-xs text-[#505A70]">
              10 Batters + 10 Bowlers
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate("database");
            }}
            className="text-left p-6 rounded-3xl bg-white border border-[#E8E6ED] hover:border-[#2549BD] transition-all cursor-pointer group space-y-2 shadow-sm hover:shadow"
          >
            <div className="flex items-center justify-between text-[#68738A] text-xs font-mono uppercase">
              <span>Whitelisted Pool</span>
              
            </div>
            <div className="text-3xl font-black font-mono text-[#22263C] group-hover:text-[#2549BD] transition-colors">
              1,217
            </div>
            <div className="text-xs text-[#505A70]">
              100% Canonical Data Pack
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate("pressure-lab");
            }}
            className="text-left p-6 rounded-3xl bg-white border border-[#E8E6ED] hover:border-[#7545B8] transition-all cursor-pointer group space-y-2 shadow-sm hover:shadow"
          >
            <div className="flex items-center justify-between text-[#68738A] text-xs font-mono uppercase">
              <span>Legacy Sample Replay</span>
              
            </div>
            <div className="text-3xl font-black font-mono text-[#22263C] group-hover:text-[#7545B8] transition-colors">
              Index &ge; 1.80
            </div>
            <div className="text-xs text-[#505A70]">
              Inherited heuristic, not D20 telemetry
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate("war-room");
            }}
            className="text-left p-6 rounded-3xl bg-white border border-[#E8E6ED] hover:border-[#2549BD] transition-all cursor-pointer group space-y-2 shadow-sm hover:shadow"
          >
            <div className="flex items-center justify-between text-[#68738A] text-xs font-mono uppercase">
              <span>Example Planning Budget</span>
              
            </div>
            <div className="text-3xl font-black font-mono text-[#22263C] group-hover:text-[#2549BD] transition-colors">
              ₹{rrPurseCr.toFixed(1)} Cr
            </div>
            <div className="text-xs text-[#505A70]">
              Editable planning scenario
            </div>
          </button>
        </div>

        {/* Quick Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div
            onClick={() => {
              onNavigate("home");
            }}
            className="p-8 rounded-3xl bg-[#FFEAF2] border border-[#F5B1CE] hover:shadow-md transition-all cursor-pointer space-y-4"
          >
            <h3 className="text-2xl font-bold font-display text-[#22263C]">
              Feel the game
            </h3>
            <p className="text-xs text-[#505A70] leading-relaxed">
              Meet the Royals and find the players who fit your moment.
            </p>
            <div className="text-xs font-mono font-bold text-[#F22E83] flex items-center gap-1.5">
              <span>Enter Homepage Experience ↗</span>
              
            </div>
          </div>

          <div
            onClick={() => {
              onNavigate("methodology");
            }}
            className="p-8 rounded-3xl bg-[#EAF5FF] border border-[#B3D4FF] hover:shadow-md transition-all cursor-pointer space-y-4"
          >
            <h3 className="text-2xl font-bold font-display text-[#22263C]">
              Technical Methodology & Audit
            </h3>
            <p className="text-xs text-[#505A70] leading-relaxed">
              Review our Empirical Bayes mathematical formulas, code proofs, and
              export ready PDF documentation.
            </p>
            <div className="text-xs font-mono font-bold text-[#2549BD] flex items-center gap-1.5">
              <span>Inspect Technical Proofs ↗</span>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
