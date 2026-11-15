import React from "react";
import {
  Layers,
  Flame,
  ShieldCheck,
  Award,
  Users,
  ArrowRight,
} from "lucide-react";

interface CommandCentrePageProps {
  onNavigate: (page: string) => void;
  rrPurseCr?: number;
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
            <Layers className="w-3.5 h-3.5" />
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

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => {
              onNavigate("rankings");
            }}
            className="p-6 rounded-3xl bg-white border border-[#E8E6ED] hover:border-[#F22E83] transition-all cursor-pointer group space-y-2 shadow-sm hover:shadow"
          >
            <div className="flex items-center justify-between text-[#68738A] text-xs font-mono uppercase">
              <span>Top 10 Rankings</span>
              <Award className="w-4 h-4 text-[#F22E83]" />
            </div>
            <div className="text-3xl font-black font-mono text-[#22263C] group-hover:text-[#F22E83] transition-colors">
              20 Players
            </div>
            <div className="text-xs text-[#505A70]">
              10 Batters + 10 Bowlers
            </div>
          </div>

          <div
            onClick={() => {
              onNavigate("database");
            }}
            className="p-6 rounded-3xl bg-white border border-[#E8E6ED] hover:border-[#2549BD] transition-all cursor-pointer group space-y-2 shadow-sm hover:shadow"
          >
            <div className="flex items-center justify-between text-[#68738A] text-xs font-mono uppercase">
              <span>Whitelisted Pool</span>
              <Users className="w-4 h-4 text-[#2549BD]" />
            </div>
            <div className="text-3xl font-black font-mono text-[#22263C] group-hover:text-[#2549BD] transition-colors">
              1,217
            </div>
            <div className="text-xs text-[#505A70]">
              100% Canonical Data Pack
            </div>
          </div>

          <div
            onClick={() => {
              onNavigate("pressure-lab");
            }}
            className="p-6 rounded-3xl bg-white border border-[#E8E6ED] hover:border-[#7545B8] transition-all cursor-pointer group space-y-2 shadow-sm hover:shadow"
          >
            <div className="flex items-center justify-between text-[#68738A] text-xs font-mono uppercase">
              <span>Pressure Telemetry</span>
              <Flame className="w-4 h-4 text-[#7545B8]" />
            </div>
            <div className="text-3xl font-black font-mono text-[#22263C] group-hover:text-[#7545B8] transition-colors">
              LI &ge; 1.80
            </div>
            <div className="text-xs text-[#505A70]">
              High-Leverage Deliveries
            </div>
          </div>

          <div
            onClick={() => {
              onNavigate("war-room");
            }}
            className="p-6 rounded-3xl bg-white border border-[#E8E6ED] hover:border-[#2549BD] transition-all cursor-pointer group space-y-2 shadow-sm hover:shadow"
          >
            <div className="flex items-center justify-between text-[#68738A] text-xs font-mono uppercase">
              <span>Example Planning Budget</span>
              <ShieldCheck className="w-4 h-4 text-[#2549BD]" />
            </div>
            <div className="text-3xl font-black font-mono text-[#22263C] group-hover:text-[#2549BD] transition-colors">
              ₹{rrPurseCr.toFixed(1)} Cr
            </div>
            <div className="text-xs text-[#505A70]">
              Editable planning scenario
            </div>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div
            onClick={() => {
              onNavigate("home");
            }}
            className="p-8 rounded-3xl bg-[#FFEAF2] border border-[#F5B1CE] hover:shadow-md transition-all cursor-pointer space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white text-[#F22E83] flex items-center justify-center shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display text-[#22263C]">
              Feel the game
            </h3>
            <p className="text-xs text-[#505A70] leading-relaxed">
              Meet the Royals and find the players who fit your moment.
            </p>
            <div className="text-xs font-mono font-bold text-[#F22E83] flex items-center gap-1.5">
              <span>Enter Homepage Experience</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => {
              onNavigate("methodology");
            }}
            className="p-8 rounded-3xl bg-[#EAF5FF] border border-[#B3D4FF] hover:shadow-md transition-all cursor-pointer space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white text-[#2549BD] flex items-center justify-center shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display text-[#22263C]">
              Technical Methodology & Audit
            </h3>
            <p className="text-xs text-[#505A70] leading-relaxed">
              Review our Empirical Bayes mathematical formulas, code proofs, and
              export ready PDF documentation.
            </p>
            <div className="text-xs font-mono font-bold text-[#2549BD] flex items-center gap-1.5">
              <span>Inspect Technical Proofs</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
