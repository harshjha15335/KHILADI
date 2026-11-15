import React, { useState, useEffect } from 'react';
import { KhiladiAnimatedButton } from '../components/KhiladiAnimatedButton';
import { Player } from '../types';
import { playClickChime, playHoverChime } from '../utils/sound';
import { 
  Flame, 
  Shield, 
  Award, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Trophy,
  Activity,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onSelectPlayer: (player: Player) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectPlayer }) => {
  const [rrSquad, setRrSquad] = useState<Player[]>([]);
  const [quizStep, setQuizStep] = useState(1);
  const [quizSituation, setQuizSituation] = useState('death_chase');
  const [quizRole, setQuizRole] = useState('finisher');
  const [quizBudget, setQuizBudget] = useState('any');
  const [quizResults, setQuizResults] = useState<Player[]>([]);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [loadingSquad, setLoadingSquad] = useState(true);

  // Fetch RR 2026 squad from public data or API
  useEffect(() => {
    fetch('/data/rr_squad_2026.json')
      .then(res => res.json())
      .then((data: Player[]) => {
        setRrSquad(data);
        setLoadingSquad(false);
      })
      .catch(() => {
        // Fallback fetch from api
        fetch('/api/rr-squad')
          .then(res => res.json())
          .then((data: Player[]) => {
            setRrSquad(data);
            setLoadingSquad(false);
          })
          .catch(err => {
            console.error('Failed to load RR squad:', err);
            setLoadingSquad(false);
          });
      });
  }, []);

  // Orbiting cutouts: list of authentic transparent RGBA PNG cutouts from official IPL
  const orbitingCutouts = [
    { name: 'Shimron Hetmyer', file: '/assets/cutouts/3297_shimron-hetmyer_cutout.png', radius: 'orbit-1', delay: '0s' },
    { name: 'Riyan Parag', file: '/assets/cutouts/6423_riyan-parag_cutout.png', radius: 'orbit-2', delay: '-6s' },
    { name: 'Jofra Archer', file: '/assets/cutouts/3298_jofra-archer_cutout.png', radius: 'orbit-3', delay: '-12s' },
    { name: 'Dhruv Jurel', file: '/assets/cutouts/7260_dhruv-jurel_cutout.png', radius: 'orbit-1', delay: '-18s' },
    { name: 'Ravindra Jadeja', file: '/assets/cutouts/152_ravindra-jadeja_cutout.png', radius: 'orbit-2', delay: '-24s' },
    { name: 'Sandeep Sharma', file: '/assets/cutouts/2411_sandeep-sharma_cutout.png', radius: 'orbit-3', delay: '-30s' },
    { name: 'Vaibhav Sooryavanshi', file: '/assets/cutouts/50284_vaibhav-sooryavanshi_cutout.png', radius: 'orbit-2', delay: '-15s' },
    { name: 'Shubham Dubey', file: '/assets/cutouts/25139_shubham-dubey_cutout.png', radius: 'orbit-1', delay: '-9s' }
  ];

  // Handle Quiz Submission
  const handleRunQuiz = () => {
    playClickChime();
    setIsQuizSubmitted(true);
    // Find matching players in RR squad or sample
    if (rrSquad.length > 0) {
      let matches = [...rrSquad];
      if (quizRole === 'finisher') {
        matches = matches.filter(p => p.role === 'Batter' || p.role === 'All-Rounder');
      } else if (quizRole === 'death_bowler') {
        matches = matches.filter(p => p.role === 'Bowler' || p.role === 'All-Rounder');
      }
      matches.sort((a, b) => b.pressure_impact_index - a.pressure_impact_index);
      setQuizResults(matches.slice(0, 3));
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080C1F] text-[#F7F4FA] overflow-x-hidden pt-20">
      {/* =========================================================================
          SECTION A: CINEMATIC HERO (Delta Cafés composition + RR video montage)
         ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background Video Player */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-35 filter brightness-75 contrast-125"
          >
            <source src="/assets/videos/hero_montage.mp4" type="video/mp4" />
          </video>
          {/* Gradients to blend video smoothly into deep navy / royal purple canvas */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080C1F] via-[#080C1F]/60 to-[#29134F]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,18,116,0.15)_0%,transparent_70%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 py-16">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#E81274] animate-pulse" />
            <span className="text-xs font-mono tracking-widest uppercase text-[#F7F4FA]/80">
              Rajasthan Royals • SupeRR Selector Season 2
            </span>
            <span className="text-xs text-[#F5B400] font-mono">IPL 2026</span>
          </div>

          {/* Main Cinematic Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight leading-[1.05] uppercase">
            When Pressure <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E81274] via-[#ff4d9e] to-[#F5B400]">Rises</span>,
            <br />
            Royalty <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#85A9FF] to-white">Responds.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/70 font-sans font-light leading-relaxed">
            The definitive cricket pressure intelligence platform. Evaluating <span className="text-white font-medium">1,217 canonical players</span> across <span className="text-white font-medium">65,630 high-pressure deliveries</span> ($LI \ge 1.8$) with Empirical Bayes shrinkage to engineer the ultimate Rajasthan Royals match-winning squad.
          </p>

          {/* Call to Actions (Delta-style animated button) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <KhiladiAnimatedButton
              onClick={() => onNavigate('rankings')}
              variant="primary"
              size="lg"
            >
              <div className="flex items-center gap-2">
                <span>View Top 10 Pressure Rankings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </KhiladiAnimatedButton>

            <KhiladiAnimatedButton
              onClick={() => onNavigate('war-room')}
              variant="outline"
              size="lg"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#F5B400]" />
                <span>Enter Auction War Room</span>
              </div>
            </KhiladiAnimatedButton>
          </div>

          {/* Trust Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="text-2xl font-bold font-mono text-white">1,217</div>
              <div className="text-xs font-mono text-white/50 uppercase">Canonical Players</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="text-2xl font-bold font-mono text-[#E81274]">65,630</div>
              <div className="text-xs font-mono text-white/50 uppercase">Pressure Balls (LI ≥ 1.8)</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="text-2xl font-bold font-mono text-[#85A9FF]">883</div>
              <div className="text-xs font-mono text-white/50 uppercase">Matches Analyzed</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="text-2xl font-bold font-mono text-[#F5B400]">₹120 Cr</div>
              <div className="text-xs font-mono text-white/50 uppercase">Simulated RR Purse</div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION B: SCROLLING RR SQUAD BAND (IPL 2026 Data Pack Roster)
         ========================================================================= */}
      <section className="relative py-16 bg-[#050714] border-y border-[#29134F]/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E81274]">
              <Shield className="w-3.5 h-3.5" />
              <span>Verified Data Pack Representation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mt-1">
              RR players represented in the data pack — IPL 2026
            </h2>
          </div>
          <div className="text-xs font-mono text-white/50 max-w-md">
            Click any Rajasthan Royals representative to reveal their complete pressure diagnostics and ball-by-ball split.
          </div>
        </div>

        {/* Marquee Track: Seamless horizontal marquee alternating RR palette cards with cutouts */}
        <div className="relative w-full overflow-hidden py-4">
          <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] w-max">
            {rrSquad.concat(rrSquad).map((player, idx) => {
              // Alternating RR brand card styles
              const colorSchemes = [
                'bg-gradient-to-br from-[#E81274]/20 to-[#29134F]/30 border-[#E81274]/40 hover:border-[#E81274]',
                'bg-gradient-to-br from-[#203A8C]/20 to-[#080C1F]/40 border-[#203A8C]/40 hover:border-[#85A9FF]',
                'bg-gradient-to-br from-[#29134F]/40 to-[#080C1F]/50 border-[#29134F]/60 hover:border-[#E81274]/60',
                'bg-gradient-to-br from-white/[0.04] to-[#203A8C]/15 border-white/10 hover:border-white/30'
              ];
              const cardScheme = colorSchemes[idx % colorSchemes.length];

              return (
                <div
                  key={`${player.player_id}-${idx}`}
                  onClick={() => {
                    playClickChime();
                    onSelectPlayer(player);
                  }}
                  onMouseEnter={playHoverChime}
                  className={`w-56 flex-shrink-0 p-4 rounded-2xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 shadow-lg ${cardScheme}`}
                >
                  {/* Player Cutout Container */}
                  <div className="relative w-full h-44 mb-3 flex items-center justify-center overflow-hidden">
                    {player.cutout_url || player.portrait_url ? (
                      <img
                        src={player.cutout_url || player.portrait_url}
                        alt={player.player_name}
                        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/30">
                        <Shield className="w-10 h-10 opacity-30 text-[#E81274]" />
                        <span className="text-[10px] font-mono mt-2">Silhouette</span>
                      </div>
                    )}
                    <span className="absolute top-1 right-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 text-white/80 border border-white/10">
                      ID {player.player_id}
                    </span>
                  </div>

                  {/* Player Information */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-white group-hover:text-[#E81274] transition-colors truncate">
                      {player.player_name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>{player.role}</span>
                      <span className="font-mono font-bold text-[#F5B400]">
                        PII {player.pressure_impact_index.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION C: EDITORIAL INTRO SECTION (Delta oversized typography)
         ========================================================================= */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-12">
          {/* Oversized typography headline */}
          <div className="max-w-4xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E81274]">
              The Core Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-tight uppercase mt-3">
              Find the player built for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E81274] via-[#85A9FF] to-white">
                your moment.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-white/70 mt-6 leading-relaxed max-w-3xl">
              Average statistics deceive. A boundary struck when requiring 12 an over carries fundamentally different win probability than runs accumulated in a low-stakes dead rubber. KHILADI decomposes cricket into high-leverage leverage index deliveries, penalising high-variance outliers and surfacing genuine match-winners.
            </p>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 hover:border-[#E81274]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#E81274]/20 border border-[#E81274]/40 flex items-center justify-center text-[#E81274]">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">High-Leverage Classification</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Every delivery is evaluated by required run rate, wickets in hand, match phase (death overs 16–20), and tournament knockout stage ($LI \ge 1.8$).
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 hover:border-[#85A9FF]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#203A8C]/30 border border-[#203A8C]/60 flex items-center justify-center text-[#85A9FF]">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Empirical Bayes Shrinkage</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Small-sample luck is rigorously compressed ($m=40$). High strike rates on 5 balls shrink toward the population prior, preventing statistical noise from warping rankings.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 hover:border-[#F5B400]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#F5B400]/20 border border-[#F5B400]/40 flex items-center justify-center text-[#F5B400]">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">1,217 Whitelist Integrity</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Strict adherence to the competition pack (<code>competition_team_player_mapping.csv</code>). Exactly 1,217 canonical players, audited portraits, and zero phantom auction bids.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION D: HISTORIC 2008 TROPHY SHOWCASE
         ========================================================================= */}
      <section className="relative py-20 bg-gradient-to-b from-[#080C1F] via-[#29134F]/20 to-[#080C1F] border-t border-[#29134F]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Story */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F5B400]">
                <Trophy className="w-4 h-4" />
                <span>Rajasthan Royals Inaugural Championship • 2008</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase tracking-tight text-white leading-tight">
                The Heritage of Underdogs Defying the Odds.
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                In 2008, Shane Warne led the Rajasthan Royals to the inaugural IPL championship — not with the most expensive marquee superstars, but through tactical clarity, high-pressure execution, and unearthing match-winners who thrived when games were on the line.
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                KHILADI codifies that exact ethos into mathematical algorithms. We don't chase inflated price tags; we uncover the players engineered for clutch delivery in the final over of an IPL final.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <KhiladiAnimatedButton
                  onClick={() => onNavigate('war-room')}
                  variant="gold"
                  size="md"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Build 2026 Royals Dynasty</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </KhiladiAnimatedButton>
              </div>
            </div>

            {/* Right: Trophy Collage Card */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-tr from-[#203A8C]/20 via-[#29134F]/30 to-[#E81274]/20 border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-[#F5B400]/20 border border-[#F5B400]/50 flex items-center justify-center text-[#F5B400] shadow-[0_0_30px_rgba(245,180,0,0.3)]">
                <Trophy className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">IPL 2008 Champions</h3>
              <p className="text-xs font-mono text-[#F5B400]">1 June 2008 • DY Patil Stadium • Last Ball Victory</p>
              <div className="text-xs text-white/60 max-w-md italic">
                "We were considered the underdogs. But we believed in our strategy, trusted every young player, and held our nerve in the final over."
              </div>
              <div className="pt-4 grid grid-cols-3 gap-4 w-full text-center border-t border-white/10">
                <div>
                  <div className="text-base font-bold font-mono text-white">143.4</div>
                  <div className="text-[10px] uppercase font-mono text-white/40">Championship SR</div>
                </div>
                <div>
                  <div className="text-base font-bold font-mono text-emerald-400">7.24</div>
                  <div className="text-[10px] uppercase font-mono text-white/40">Defensive Econ</div>
                </div>
                <div>
                  <div className="text-base font-bold font-mono text-[#E81274]">1 Run</div>
                  <div className="text-[10px] uppercase font-mono text-white/40">Final Ball Margin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION E: ORBITING PLAYER CUTOUTS DISCOVERY QUIZ
          (Delta Cafés coffee profile quiz reimagined with cricket players)
          STRICT RULE: Isolated foreground cutouts on TRANSPARENT backgrounds.
          NO rectangular photo backgrounds or stadium tiles.
         ========================================================================= */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#080C1F] overflow-hidden">
        {/* Subtle background ambient non-photographic gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#E81274]/15 via-[#203A8C]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E81274]/15 border border-[#E81274]/30 text-xs font-mono uppercase text-[#E81274]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Match-Winner Finder</span>
          </div>

          {/* Orbiting Cutouts Canvas & Central Heading */}
          <div className="relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center">
            {/* The Orbiting Rings */}
            <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full border border-dashed border-[#E81274]/20 pointer-events-none" />
            <div className="absolute w-[440px] h-[440px] sm:w-[560px] sm:h-[560px] rounded-full border border-dashed border-[#85A9FF]/15 pointer-events-none" />

            {/* Orbiting Cutouts — Pure Isolated Transparent RGBA PNGs (No Photo Backgrounds) */}
            <div className="absolute inset-0 pointer-events-none">
              {orbitingCutouts.map((cutout, idx) => (
                <div
                  key={idx}
                  className={`absolute top-1/2 left-1/2 w-20 h-20 sm:w-28 sm:h-28 -translate-x-1/2 -translate-y-1/2 ${
                    cutout.radius === 'orbit-1'
                      ? 'animate-orbit-1'
                      : cutout.radius === 'orbit-2'
                      ? 'animate-orbit-2'
                      : 'animate-orbit-3'
                  }`}
                  style={{ animationDelay: cutout.delay }}
                >
                  <img
                    src={cutout.file}
                    alt={cutout.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(232,18,116,0.35)] hover:scale-110 transition-transform pointer-events-auto cursor-pointer"
                    title={cutout.name}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Central Headline inside orbit */}
            <div className="relative z-20 max-w-xl mx-auto px-6 py-8 rounded-3xl bg-[#080C1F]/90 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
              <h2 className="text-2xl sm:text-4xl font-bold font-display uppercase tracking-tight text-white leading-tight">
                Who is your perfect <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E81274] to-[#F5B400]">
                  match-winner?
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-white/70">
                Configure your critical match situation. Our algorithm matches your pressure requirements against verified data pack performances.
              </p>
            </div>
          </div>

          {/* Interactive Step-by-Step Quiz Selector */}
          <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-8 text-left">
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs font-mono">
              <span className="text-white/60">Question {quizStep} of 3</span>
              <span className="text-[#F5B400] uppercase">
                {quizStep === 1 && 'Match Context'}
                {quizStep === 2 && 'Tactical Role'}
                {quizStep === 3 && 'Auction Strategy'}
              </span>
            </div>

            {/* Step 1: Match Context */}
            {quizStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">
                  1. What pressure scenario keeps you awake at night?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'death_chase', title: 'Death Overs Run Chase', desc: 'Need 45 runs off final 3 overs (RRR ≥ 15.0)' },
                    { id: 'powerplay_defense', title: 'Powerplay Tight Defense', desc: 'Defend 160 on a flat Jaipur pitch' },
                    { id: 'middle_collapse', title: 'Middle Overs Collapse', desc: '3 wickets down for 28 in 4 overs' },
                    { id: 'knockout_final', title: 'IPL Final Over Shootout', desc: 'Defend 10 runs with 2 wickets in hand' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { playClickChime(); setQuizSituation(opt.id); }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        quizSituation === opt.id
                          ? 'bg-[#E81274]/20 border-[#E81274] text-white shadow-[0_0_15px_rgba(232,18,116,0.2)]'
                          : 'bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-sm">{opt.title}</div>
                      <div className="text-xs text-white/50 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Tactical Role */}
            {quizStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">
                  2. What player skillset does your XI require?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'finisher', title: 'Clutch Finisher', desc: 'High-strike-rate batter (SR ≥ 160 under LI ≥ 1.8)' },
                    { id: 'death_bowler', title: 'Death Overs Yorker Pacer', desc: 'Dot-ball specialist under sub-10 economy' },
                    { id: 'anchor', title: 'Pressure Absorbing Anchor', desc: 'Low dismissal rate during collapse situations' },
                    { id: 'spin_strangler', title: 'Middle Overs Spin Choke', desc: 'Sub-6.5 economy against set batters' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { playClickChime(); setQuizRole(opt.id); }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        quizRole === opt.id
                          ? 'bg-[#203A8C]/30 border-[#85A9FF] text-white shadow-[0_0_15px_rgba(133,169,255,0.2)]'
                          : 'bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-sm">{opt.title}</div>
                      <div className="text-xs text-white/50 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Auction Strategy */}
            {quizStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">
                  3. What is your auction valuation bracket?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'marquee', title: 'Marquee Anchor', desc: 'Budget ₹10.0+ Cr' },
                    { id: 'high_value', title: 'Core Performer', desc: 'Budget ₹3.0 - ₹8.0 Cr' },
                    { id: 'gem', title: 'Undervalued Steal', desc: 'Budget < ₹1.5 Cr' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { playClickChime(); setQuizBudget(opt.id); }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        quizBudget === opt.id
                          ? 'bg-[#F5B400]/20 border-[#F5B400] text-white shadow-[0_0_15px_rgba(245,180,0,0.2)]'
                          : 'bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-sm">{opt.title}</div>
                      <div className="text-xs text-white/50 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {quizStep > 1 ? (
                <button
                  onClick={() => { playClickChime(); setQuizStep(quizStep - 1); }}
                  className="px-4 py-2 rounded-lg text-xs font-mono text-white/60 hover:text-white"
                >
                  ← Back
                </button>
              ) : <div />}

              {quizStep < 3 ? (
                <button
                  onClick={() => { playClickChime(); setQuizStep(quizStep + 1); }}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#E81274] hover:bg-[#ff1a84] text-white flex items-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleRunQuiz}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#E81274] to-[#F5B400] text-white shadow-lg shadow-[#E81274]/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Reveal Model Recommendation</span>
                </button>
              )}
            </div>

            {/* Quiz Results Section */}
            {isQuizSubmitted && quizResults.length > 0 && (
              <div className="pt-6 border-t border-white/10 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Model Match Found
                  </span>
                  <span className="text-[11px] font-mono text-white/50">Whitelisted Player Universe Only</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {quizResults.map((player) => (
                    <div
                      key={player.player_id}
                      onClick={() => {
                        playClickChime();
                        onSelectPlayer(player);
                      }}
                      className="p-4 rounded-xl bg-gradient-to-b from-white/[0.05] to-black/30 border border-white/10 hover:border-[#E81274] cursor-pointer transition-all space-y-3 group"
                    >
                      <div className="w-full h-32 flex items-center justify-center overflow-hidden">
                        {player.cutout_url || player.portrait_url ? (
                          <img
                            src={player.cutout_url || player.portrait_url}
                            alt={player.player_name}
                            className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <Shield className="w-10 h-10 text-white/30" />
                        )}
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-sm text-white group-hover:text-[#E81274] transition-colors truncate">
                          {player.player_name}
                        </div>
                        <div className="text-xs text-white/50">{player.role}</div>
                        <div className="mt-2 text-xs font-mono font-bold text-[#F5B400]">
                          PII {player.pressure_impact_index.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION F: EDITORIAL CTA BAR
         ========================================================================= */}
      <section className="relative py-20 bg-gradient-to-r from-[#29134F] via-[#203A8C] to-[#E81274] text-center px-4 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white">
            Ready to Build the 2026 Rajasthan Royals Dynasty?
          </h2>
          <p className="text-base text-white/80 max-w-2xl mx-auto">
            Explore the Top 10 Batters, Top 10 Bowlers, and test your own auction scenarios with ₹120 Crore under pressure analytics.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <KhiladiAnimatedButton
              onClick={() => onNavigate('rankings')}
              variant="primary"
              size="lg"
            >
              <div className="flex items-center gap-2">
                <span>Explore Official Top 10 Rankings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </KhiladiAnimatedButton>

            <KhiladiAnimatedButton
              onClick={() => onNavigate('methodology')}
              variant="outline"
              size="lg"
            >
              <div className="flex items-center gap-2">
                <span>Read Full Methodology Report</span>
              </div>
            </KhiladiAnimatedButton>
          </div>
        </div>
      </section>
    </div>
  );
};
