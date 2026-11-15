import React from 'react';
import { KhiladiKineticText } from '../components/KhiladiKineticText';
import { playClickChime } from '../utils/sound';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  Flame, 
  Award,
  Layers,
  Code
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const handlePrint = () => {
    playClickChime();
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#080C1F] text-[#F7F4FA] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header & Print Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#29134F] pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E81274]/15 border border-[#E81274]/30 text-xs font-mono uppercase text-[#E81274]">
              <FileText className="w-3.5 h-3.5" />
              <span>Rajasthan Royals SupeRR Selector S2 • Technical Report</span>
            </div>
            <KhiladiKineticText
              text="METHODOLOGY & AUDIT EVIDENCE"
              className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white"
            />
            <p className="text-sm text-white/70 leading-relaxed">
              Formal mathematical specification, leverage index modeling, Empirical Bayes shrinkage derivation, and reproducible verification proofs.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[#E81274] hover:bg-[#ff1a84] text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-[#E81274]/30 transition-all self-start md:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Save / Print PDF Report</span>
          </button>
        </div>

        {/* Executive Summary */}
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
          <h2 className="text-xl font-bold font-display text-white">1. Executive Overview</h2>
          <p className="text-sm text-white/70 leading-relaxed">
            The Rajasthan Royals SupeRR Selector Season 2 competition challenges analysts to identify genuine clutch performers under extreme match pressure. Traditional aggregate metrics (batting average, economy rate) fail because they treat low-stakes runs and high-stakes match-deciding deliveries identically. KHILADI introduces a two-tier Bayesian framework that filters 200,999 deliveries down to 65,630 high-pressure balls ($LI \ge 1.8$) and applies Empirical Bayes shrinkage to prevent small-sample distortion.
          </p>
        </div>

        {/* Mathematical Formulation */}
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6">
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#E81274]" />
            2. Mathematical Foundations
          </h2>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">A. Leverage Index ($LI$) Definition</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Each delivery's pressure weight is determined by win probability swing potential, parameterized by match phase, required run rate, and wickets remaining:
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-emerald-400 space-y-1">
              <div>LI = W_phase × (1 + max(0, RRR - 8.0) / 4.0) × (1 + (10 - WicketsInHand) / 10.0)</div>
              <div className="text-white/40">// High pressure threshold: LI ≥ 1.80</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">B. Empirical Bayes Shrinkage Formulation</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              To resolve the small-sample bias where a batter with 8 runs off 3 balls exhibits an unsustainable 266.7 SR, player performance is shrunken toward the competition prior ($\mu_0$):
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-[#85A9FF] space-y-1">
              <div>Shrunk_SR = (N_balls × Observed_SR + m × μ_0) / (N_balls + m)</div>
              <div className="text-white/40">// Where prior weight m = 40 deliveries, prior μ_0 = 128.5 SR</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">C. Composite Pressure Impact Index ($PII$)</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              The overall Pressure Impact Index aggregates shrunken strike rate, boundary strike rate, dot ball resistance, and delta over baseline:
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-[#F5B400] space-y-1">
              <div>PII_Batter = 0.50 × Shrunk_SR + 0.30 × Boundary% + 0.20 × max(0, SR_Delta)</div>
              <div>PII_Bowler = 0.40 × (200 - Shrunk_Econ × 15) + 0.35 × Dot% + 0.25 × max(0, -Econ_Delta × 10)</div>
            </div>
          </div>
        </div>

        {/* Dataset Verification Audit */}
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            3. Canonical Dataset Audit & Whitelist Integrity
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/5 border-b border-white/10 text-white/60">
                <tr>
                  <th className="py-2.5 px-4">Audit Dimension</th>
                  <th className="py-2.5 px-4">Expected Value</th>
                  <th className="py-2.5 px-4">Observed Value</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                <tr>
                  <td className="py-2.5 px-4">Source Mapping File</td>
                  <td className="py-2.5 px-4">Data Pack/competition_team_player_mapping.csv</td>
                  <td className="py-2.5 px-4">Verified Match</td>
                  <td className="py-2.5 px-4 text-emerald-400 text-center">PASS</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Unique Player Universe</td>
                  <td className="py-2.5 px-4">Exactly 1,217 IDs</td>
                  <td className="py-2.5 px-4">1,217 IDs</td>
                  <td className="py-2.5 px-4 text-emerald-400 text-center">PASS</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">RR IPL Season Band</td>
                  <td className="py-2.5 px-4">IPL 2026 (Comp ID 3298)</td>
                  <td className="py-2.5 px-4">27 Verified Players</td>
                  <td className="py-2.5 px-4 text-emerald-400 text-center">PASS</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Top 10 Batters Whitelist</td>
                  <td className="py-2.5 px-4">100% in pack (0 unknown)</td>
                  <td className="py-2.5 px-4">10/10 Matched</td>
                  <td className="py-2.5 px-4 text-emerald-400 text-center">PASS</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Top 10 Bowlers Whitelist</td>
                  <td className="py-2.5 px-4">100% in pack (0 unknown)</td>
                  <td className="py-2.5 px-4">10/10 Matched</td>
                  <td className="py-2.5 px-4 text-emerald-400 text-center">PASS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Unstop Submission Checklist */}
        <div className="p-8 rounded-3xl bg-gradient-to-tr from-[#203A8C]/20 to-[#E81274]/20 border border-white/10 space-y-4">
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#F5B400]" />
            4. Unstop Competition Submission Checklist
          </h2>
          <ul className="space-y-2 text-xs text-white/80 font-mono">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Rankings exported to valid CSV format (<code>top_10_batters.csv</code>, <code>top_10_bowlers.csv</code>).</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>All 20 ranked players confirmed in competition player mapping.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero manual fabrication; code-driven reproducible pipeline.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full methodology documented with Bayesian equations and Leverage Index thresholds.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
