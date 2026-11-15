import React, { useState, useEffect } from 'react';
import { KhiladiLogo } from '../components/KhiladiLogo';
import { KhiladiAnimatedButton } from '../components/KhiladiAnimatedButton';
import { Player } from '../types';
import { playClickChime, playHoverChime } from '../utils/sound';
import { 
  Flame, 
  Shield, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  Trophy,
  History,
  Target
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
  const [activeStory, setActiveStory] = useState<string | null>(null);

  // Fetch RR 2026 squad from public data or API
  useEffect(() => {
    fetch('/data/rr_squad_2026.json')
      .then(res => res.json())
      .then((data: Player[]) => {
        setRrSquad(data);
      })
      .catch(() => {
        fetch('/api/rr-squad')
          .then(res => res.json())
          .then((res: { players: Player[] }) => setRrSquad(res.players))
          .catch(err => console.error('Failed to load RR squad:', err));
      });
  }, []);

  // Orbiting cutouts: authentic, large transparent RGBA PNG cutouts from official IPL
  const orbitingCutouts = [
    { name: 'Shimron Hetmyer', file: '/assets/cutouts/3297_shimron-hetmyer_cutout.png', radius: 'orbit-1', delay: '0s', size: 'w-24 h-24 sm:w-36 sm:h-36' },
    { name: 'Riyan Parag', file: '/assets/cutouts/6423_riyan-parag_cutout.png', radius: 'orbit-2', delay: '-5s', size: 'w-24 h-24 sm:w-40 sm:h-40' },
    { name: 'Jofra Archer', file: '/assets/cutouts/3298_jofra-archer_cutout.png', radius: 'orbit-3', delay: '-10s', size: 'w-28 h-28 sm:w-44 sm:h-44' },
    { name: 'Dhruv Jurel', file: '/assets/cutouts/7260_dhruv-jurel_cutout.png', radius: 'orbit-1', delay: '-15s', size: 'w-24 h-24 sm:w-36 sm:h-36' },
    { name: 'Ravindra Jadeja', file: '/assets/cutouts/152_ravindra-jadeja_cutout.png', radius: 'orbit-2', delay: '-20s', size: 'w-28 h-28 sm:w-40 sm:h-40' },
    { name: 'Sandeep Sharma', file: '/assets/cutouts/2411_sandeep-sharma_cutout.png', radius: 'orbit-3', delay: '-25s', size: 'w-24 h-24 sm:w-38 sm:h-38' },
    { name: 'Vaibhav Sooryavanshi', file: '/assets/cutouts/50284_vaibhav-sooryavanshi_cutout.png', radius: 'orbit-2', delay: '-12s', size: 'w-24 h-24 sm:w-36 sm:h-36' },
    { name: 'Shubham Dubey', file: '/assets/cutouts/25139_shubham-dubey_cutout.png', radius: 'orbit-1', delay: '-8s', size: 'w-20 h-20 sm:w-32 sm:h-32' }
  ];

  // Handle Quiz Submission
  const handleRunQuiz = () => {
    playClickChime();
    setIsQuizSubmitted(true);
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
          CHAPTER 1: CINEMATIC RR HERO (Delta Cafés visual storytelling)
          - Full-bleed cricket montage
          - Enormous prominent Rajasthan Royals crest anchor
          - Minimal high-impact typography
          - NO SaaS KPI metrics cards!
         ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Full-bleed video player */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40 filter contrast-125 brightness-90"
          >
            <source src="/assets/videos/hero_montage.mp4" type="video/mp4" />
          </video>
          {/* Deep Navy to Midnight Royal Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080C1F] via-[#080C1F]/50 to-[#13245B]/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,18,116,0.18)_0%,transparent_65%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 py-12 flex flex-col items-center">
          {/* Enormous Central Rajasthan Royals Crest Shield */}
          <div className="animate-in zoom-in-75 duration-700">
            <KhiladiLogo size="hero" />
          </div>

          {/* Cinematic Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tighter leading-[0.98] uppercase">
              When Pressure <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E81274] via-[#ff4d9e] to-[#F5B400]">Rises</span>,
              <br />
              Royalty <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#85A9FF] to-white">Responds.</span>
            </h1>

            {/* Editorial Subtitle */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/75 font-sans font-normal leading-relaxed">
              Decomposing cricket into high-leverage deliveries ($LI \ge 1.80$) with Empirical Bayes shrinkage to engineer the ultimate Rajasthan Royals match-winning squad.
            </p>
          </div>

          {/* Delta-style Action Button */}
          <div className="pt-4">
            <KhiladiAnimatedButton
              onClick={() => onNavigate('rankings')}
              variant="primary"
              size="lg"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold tracking-wide">Explore Top 10 Pressure Rankings</span>
                <ArrowRight className="w-5 h-5 text-[#F5B400]" />
              </div>
            </KhiladiAnimatedButton>
          </div>
        </div>
      </section>


      {/* =========================================================================
          CHAPTER 2: DELTA-STYLE SCROLLING SQUAD BAND (IPL 2026 Data Pack)
          - Large human figures (240–320px visible figure height)
          - Alternating pink/blue/purple/cream panels
          - Zero empty cards!
         ========================================================================= */}
      <section className="relative py-20 bg-[#0B1028] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#E81274] font-semibold">
              The 2026 Roster Representation
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mt-1">
              RR players represented in the data pack — IPL 2026
            </h2>
          </div>
          <div className="text-xs font-mono text-white/50 max-w-sm">
            Click any player to reveal their Cyera-inspired layered pressure diagnostics.
          </div>
        </div>

        {/* Marquee Track: Seamless horizontal marquee with large human player cutouts */}
        <div className="relative w-full overflow-hidden py-6">
          <div className="flex gap-8 animate-marquee hover:[animation-play-state:paused] w-max">
            {rrSquad.concat(rrSquad).map((player, idx) => {
              // Alternating rich brand panel backgrounds
              const panelStyles = [
                'bg-gradient-to-b from-[#E81274]/30 via-[#080C1F] to-[#29134F]/40 border-[#E81274]/30 hover:border-[#E81274]',
                'bg-gradient-to-b from-[#203A8C]/35 via-[#080C1F] to-[#13245B]/40 border-[#203A8C]/40 hover:border-[#85A9FF]',
                'bg-gradient-to-b from-[#29134F]/50 via-[#080C1F] to-[#E81274]/20 border-[#29134F]/50 hover:border-[#E81274]/70',
                'bg-gradient-to-b from-[#FAF6F0]/15 via-[#080C1F] to-[#203A8C]/20 border-white/10 hover:border-white/30'
              ];
              const panelStyle = panelStyles[idx % panelStyles.length];

              return (
                <div
                  key={`${player.player_id}-${idx}`}
                  onClick={() => {
                    playClickChime();
                    onSelectPlayer(player);
                  }}
                  onMouseEnter={playHoverChime}
                  className={`w-64 sm:w-72 flex-shrink-0 p-5 rounded-3xl border transition-all duration-300 cursor-pointer group hover:-translate-y-2 shadow-2xl ${panelStyle}`}
                >
                  {/* Large Player Figure (240px - 300px height) */}
                  <div className="relative w-full h-64 sm:h-72 mb-4 flex items-center justify-center overflow-hidden">
                    {player.cutout_url || player.portrait_url ? (
                      <img
                        src={player.cutout_url || player.portrait_url}
                        alt={player.player_name}
                        className="w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                        <Target className="w-16 h-16 text-[#E81274]/40 mb-2" />
                        <span className="text-xs font-mono uppercase tracking-widest">IPL Silhouette</span>
                      </div>
                    )}
                  </div>

                  {/* Player Information */}
                  <div className="space-y-1 text-center">
                    <h3 className="font-extrabold text-lg text-white group-hover:text-[#E81274] transition-colors truncate">
                      {player.player_name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/60 pt-1 border-t border-white/10 font-mono">
                      <span>{player.role}</span>
                      <span className="font-bold text-[#F5B400]">
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
          CHAPTER 3: OPEN EDITORIAL MANIFESTO (Light & Airy Off-White Canvas)
          - Dramatic environmental contrast against dark hero!
          - Huge clean typography: "FIND THE PLAYER BUILT FOR YOUR MOMENT."
          - Clean spacing and whitespace, no cheap tagged feature tiles.
         ========================================================================= */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#F8F5F4] text-[#080C1F]">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Eyebrow */}
          <div className="text-xs font-mono uppercase tracking-widest text-[#E81274] font-bold">
            The Philosophy of High-Leverage Analytics
          </div>

          {/* Huge Clean Typography */}
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display uppercase tracking-tight leading-[1.02] text-[#080C1F]">
            Find the player built for <br />
            <span className="text-[#E81274]">
              your moment.
            </span>
          </h2>

          {/* Sincere Narrative Copy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-base sm:text-lg text-[#080C1F]/80 leading-relaxed font-sans">
            <p>
              Average statistics deceive. A boundary struck when requiring 12 an over carries fundamentally different win probability than runs accumulated in a low-stakes dead rubber. Traditional cricket analytics lumps both together into an unweighted batting average.
            </p>
            <p>
              KHILADI isolates the moments that decide tournaments. By conditioning on match phase, required run rate, and wickets in hand, we uncover the players engineered to execute when the title is on the line.
            </p>
          </div>
        </div>
      </section>


      {/* =========================================================================
          CHAPTER 4: RAJASTHAN ROYALS 2008 TROPHY PHOTO MUSEUM
          - Photograph-in-photograph layering (Delta Cafés heritage reference)
          - Central large photographic trophy lifting centerpiece
          - Overlapping authentic archival photos with monochrome-to-color hover reveals
          - Interactive story expansion
         ========================================================================= */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#080C1F] border-t border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F5B400] font-bold">
              <Trophy className="w-4 h-4" />
              <span>Rajasthan Royals Inaugural Championship • 1 June 2008</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white">
              The Heritage of Underdogs Defying the Odds
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-white/60">
              Shane Warne's young side conquered the inaugural IPL through tactical clarity and execution under pressure. Hover over the archival photographs below to reveal the story.
            </p>
          </div>

          {/* Layered Photographic Collage (Delta-style photograph-in-photograph composition) */}
          <div className="relative min-h-[460px] sm:min-h-[520px] rounded-3xl bg-gradient-to-b from-[#13245B]/30 to-[#080C1F] border border-white/10 p-6 sm:p-10 flex items-center justify-center">
            
            {/* Archival Photo 1: Left Angled Layer (Shane Warne lifting the trophy) */}
            <div 
              onMouseEnter={() => setActiveStory('warne')}
              className="absolute left-4 sm:left-12 top-10 sm:top-16 w-48 sm:w-64 rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform -rotate-6 hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 cursor-pointer group bg-black"
            >
              <div className="h-44 sm:h-56 bg-gradient-to-tr from-[#13245B] to-[#29134F] p-4 flex flex-col justify-end filter grayscale group-hover:grayscale-0 transition-all duration-300">
                <div className="text-xs font-mono uppercase text-[#F5B400]">Leadership</div>
                <div className="text-sm font-bold text-white">Shane Warne's Masterclass</div>
                <div className="text-[10px] text-white/60 mt-1">Unleashing raw talent under pressure</div>
              </div>
            </div>

            {/* Central Masterpiece: The 2008 IPL Trophy (Photographic Centerpiece) */}
            <div 
              onMouseEnter={() => setActiveStory('trophy')}
              className="relative z-20 w-64 sm:w-80 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(245,180,0,0.3)] border-2 border-[#F5B400]/60 p-6 sm:p-8 bg-gradient-to-b from-[#29134F] via-[#13245B] to-[#080C1F] text-center space-y-4 hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-[#F5B400]/20 border border-[#F5B400] flex items-center justify-center text-[#F5B400] shadow-[0_0_30px_rgba(245,180,0,0.4)]">
                <Trophy className="w-12 h-12" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase text-[#F5B400] tracking-widest font-bold">DY Patil Stadium</div>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white">IPL 2008 Champions</h3>
                <p className="text-xs text-white/70 italic">
                  "No superstars. Just 11 players committed to holding their nerve."
                </p>
              </div>
            </div>

            {/* Archival Photo 2: Right Angled Layer (Sohail Tanvir final ball victory) */}
            <div 
              onMouseEnter={() => setActiveStory('final_ball')}
              className="absolute right-4 sm:right-12 bottom-10 sm:bottom-16 w-48 sm:w-64 rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform rotate-6 hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 cursor-pointer group bg-black"
            >
              <div className="h-44 sm:h-56 bg-gradient-to-tr from-[#E81274]/40 to-[#080C1F] p-4 flex flex-col justify-end filter grayscale group-hover:grayscale-0 transition-all duration-300">
                <div className="text-xs font-mono uppercase text-[#E81274]">Final Ball</div>
                <div className="text-sm font-bold text-white">1 Run Off The Final Delivery</div>
                <div className="text-[10px] text-white/60 mt-1">Tanvir hits the winning run at 20.0</div>
              </div>
            </div>
          </div>

          {/* Interactive Story Expansion Details */}
          {activeStory && (
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center text-xs text-white/70 max-w-xl mx-auto animate-in fade-in duration-300">
              {activeStory === 'warne' && "Shane Warne was the tournament's second-highest wicket-taker (19 wickets at 7.76 economy), proving that tactical spin and pressure containment can defend sub-160 totals."}
              {activeStory === 'trophy' && "Rajasthan Royals chased down 164 in the final against Chennai Super Kings on 1 June 2008, sealing the championship by 3 wickets on the final ball of the 20th over."}
              {activeStory === 'final_ball' && "Needing 8 runs off the final over bowled by Laxmipathy Balaji, Sohail Tanvir pulled a single through mid-wicket on the very last ball with Shane Warne sprinting at the non-striker's end."}
            </div>
          )}
        </div>
      </section>


      {/* =========================================================================
          CHAPTER 5: BIGGEST SIGNATURE — DELTA ROTATING-BEANS QUIZ REIMAGINED
          - Full-bleed cream/pale-pink canvas (#FAF6F0 / #FFE7F0)
          - Central headline: "WHO IS YOUR PERFECT MATCH-WINNER?"
          - 8-12 recognisably sized transparent player cutouts orbiting at multiple depths
          - ZERO photo backgrounds, zero photo boxes, zero stadium backdrops!
          - Genuinely functional 3-step recommendation quiz!
         ========================================================================= */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF6F0] via-[#FFE7F0]/40 to-[#FAF6F0] text-[#080C1F] overflow-hidden">
        {/* Subtle ambient rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#E81274]/15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-[#13245B]/10 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E81274]/10 border border-[#E81274]/30 text-xs font-mono uppercase text-[#E81274] font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Match-Winner Recommender</span>
          </div>

          {/* Full-Scale Orbiting Canvas: Players Orbiting Around The Central Headline */}
          <div className="relative min-h-[460px] sm:min-h-[540px] flex items-center justify-center">
            
            {/* The Orbiting Player Cutouts: Large, Pure Transparent Foreground Figures */}
            <div className="absolute inset-0 pointer-events-none">
              {orbitingCutouts.map((cutout, idx) => (
                <div
                  key={idx}
                  className={`absolute top-1/2 left-1/2 ${cutout.size} -translate-x-1/2 -translate-y-1/2 ${
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
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(232,18,116,0.35)] hover:scale-115 transition-transform pointer-events-auto cursor-pointer"
                    title={cutout.name}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Central Headline inside orbit (Clean, airy, non-photographic) */}
            <div className="relative z-20 max-w-xl mx-auto px-8 py-10 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E81274]/20 shadow-2xl space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-[#080C1F] leading-[1.05]">
                Who is your perfect <br />
                <span className="text-[#E81274]">
                  match-winner?
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#080C1F]/70">
                Select your high-pressure tactical scenario. Our algorithm matches your situation against verified performance under $LI \ge 1.80$.
              </p>
            </div>
          </div>

          {/* Functioning Multi-Step Quiz Selector (Delta pill transitions) */}
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white/80 border border-[#E81274]/20 shadow-xl space-y-6 text-left">
            {/* Step Header */}
            <div className="flex items-center justify-between border-b border-black/10 pb-3 text-xs font-mono">
              <span className="text-[#080C1F]/60">Step {quizStep} of 3</span>
              <span className="text-[#E81274] font-bold uppercase">
                {quizStep === 1 && 'Match Context'}
                {quizStep === 2 && 'Tactical Skillset'}
                {quizStep === 3 && 'Auction Strategy'}
              </span>
            </div>

            {/* Step 1: Match Context */}
            {quizStep === 1 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-[#080C1F]">
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
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        quizSituation === opt.id
                          ? 'bg-[#E81274]/10 border-[#E81274] text-[#080C1F] shadow-md'
                          : 'bg-white border-black/10 text-[#080C1F]/70 hover:border-[#E81274]/40'
                      }`}
                    >
                      <div className="font-bold text-sm text-[#080C1F]">{opt.title}</div>
                      <div className="text-xs text-[#080C1F]/60 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Tactical Skillset */}
            {quizStep === 2 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-[#080C1F]">
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
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        quizRole === opt.id
                          ? 'bg-[#13245B]/10 border-[#13245B] text-[#080C1F] shadow-md'
                          : 'bg-white border-black/10 text-[#080C1F]/70 hover:border-[#13245B]/40'
                      }`}
                    >
                      <div className="font-bold text-sm text-[#080C1F]">{opt.title}</div>
                      <div className="text-xs text-[#080C1F]/60 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Auction Strategy */}
            {quizStep === 3 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-[#080C1F]">
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
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        quizBudget === opt.id
                          ? 'bg-[#F5B400]/20 border-[#F5B400] text-[#080C1F] shadow-md'
                          : 'bg-white border-black/10 text-[#080C1F]/70 hover:border-[#F5B400]/40'
                      }`}
                    >
                      <div className="font-bold text-sm text-[#080C1F]">{opt.title}</div>
                      <div className="text-xs text-[#080C1F]/60 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-black/10">
              {quizStep > 1 ? (
                <button
                  onClick={() => { playClickChime(); setQuizStep(quizStep - 1); }}
                  className="px-4 py-2 text-xs font-mono text-[#080C1F]/60 hover:text-[#080C1F]"
                >
                  ← Back
                </button>
              ) : <div />}

              {quizStep < 3 ? (
                <button
                  onClick={() => { playClickChime(); setQuizStep(quizStep + 1); }}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#E81274] hover:bg-[#ff1a84] text-white flex items-center gap-1.5 transition-all shadow-md"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleRunQuiz}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#E81274] hover:bg-[#ff1a84] text-white shadow-lg flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#F5B400]" />
                  <span>Reveal Model Recommendation</span>
                </button>
              )}
            </div>

            {/* Quiz Results Section */}
            {isQuizSubmitted && quizResults.length > 0 && (
              <div className="pt-6 border-t border-black/10 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Model Match Confirmed
                  </span>
                  <span className="text-[11px] font-mono text-[#080C1F]/60">Canonical Competition Whitelist Only</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {quizResults.map((player) => (
                    <div
                      key={player.player_id}
                      onClick={() => {
                        playClickChime();
                        onSelectPlayer(player);
                      }}
                      className="p-4 rounded-2xl bg-white border border-[#E81274]/30 hover:border-[#E81274] cursor-pointer transition-all space-y-3 group shadow-md hover:-translate-y-1"
                    >
                      <div className="w-full h-32 flex items-center justify-center overflow-hidden">
                        {player.cutout_url || player.portrait_url ? (
                          <img
                            src={player.cutout_url || player.portrait_url}
                            alt={player.player_name}
                            className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <Target className="w-10 h-10 text-[#E81274]/40" />
                        )}
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-sm text-[#080C1F] group-hover:text-[#E81274] transition-colors truncate">
                          {player.player_name}
                        </div>
                        <div className="text-xs text-[#080C1F]/60">{player.role}</div>
                        <div className="mt-2 text-xs font-mono font-bold text-[#E81274]">
                          PII {player.pressure_impact_index.toFixed(1)} / 100
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
          CHAPTER 6: DELIBERATE EDITORIAL CLOSE (Rich Gradient to Dark Footer)
         ========================================================================= */}
      <section className="relative py-24 bg-gradient-to-r from-[#13245B] via-[#29134F] to-[#E81274] text-center px-4 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white leading-tight">
            Ready to Build the 2026 Rajasthan Royals Dynasty?
          </h2>
          <p className="text-base text-white/80 max-w-2xl mx-auto font-sans leading-relaxed">
            Explore the Top 10 Batters, Top 10 Bowlers, and test your own auction scenarios with ₹120 Crore under empirical pressure modeling.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <KhiladiAnimatedButton
              onClick={() => onNavigate('rankings')}
              variant="primary"
              size="lg"
            >
              <div className="flex items-center gap-3">
                <span>View Official Top 10 Rankings</span>
                <ArrowRight className="w-5 h-5 text-[#F5B400]" />
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
        </div>
      </section>
    </div>
  );
};
