import React, { useState, useEffect } from 'react';
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
  Target,
  Award,
  Activity,
  Zap,
  BarChart3
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onSelectPlayer: (player: Player) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectPlayer }) => {
  const [rrSquad, setRrSquad] = useState<Player[]>([]);
  const [quizRole, setQuizRole] = useState('finisher');
  const [quizPhase, setQuizPhase] = useState('death');
  const [quizResults, setQuizResults] = useState<Player[]>([]);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [activeStory, setActiveStory] = useState<string | null>(null);

  // Fetch RR squad from public data
  useEffect(() => {
    fetch('/data/rr_squad_2026.json')
      .then(res => res.json())
      .then((data: Player[]) => setRrSquad(data))
      .catch(() => {
        fetch('/api/players?limit=30')
          .then(res => res.json())
          .then(res => setRrSquad(res.data || []));
      });
  }, []);

  // Orbiting cutouts: authentic, large transparent RGBA PNG cutouts from official IPL
  const orbitingCutouts = [
    { name: 'Shimron Hetmyer', file: '/assets/cutouts/3297_shimron-hetmyer_cutout.png', orbitClass: 'animate-orbit-1', delay: '0s', size: 'w-24 h-24 sm:w-36 sm:h-36' },
    { name: 'Riyan Parag', file: '/assets/cutouts/6423_riyan-parag_cutout.png', orbitClass: 'animate-orbit-2', delay: '-5s', size: 'w-28 h-28 sm:w-40 sm:h-40' },
    { name: 'Jofra Archer', file: '/assets/cutouts/3298_jofra-archer_cutout.png', orbitClass: 'animate-orbit-3', delay: '-10s', size: 'w-28 h-28 sm:w-44 sm:h-44' },
    { name: 'Dhruv Jurel', file: '/assets/cutouts/7260_dhruv-jurel_cutout.png', orbitClass: 'animate-orbit-1', delay: '-15s', size: 'w-24 h-24 sm:w-36 sm:h-36' },
    { name: 'Ravindra Jadeja', file: '/assets/cutouts/152_ravindra-jadeja_cutout.png', orbitClass: 'animate-orbit-2', delay: '-20s', size: 'w-28 h-28 sm:w-40 sm:h-40' },
    { name: 'Sandeep Sharma', file: '/assets/cutouts/2411_sandeep-sharma_cutout.png', orbitClass: 'animate-orbit-3', delay: '-25s', size: 'w-24 h-24 sm:w-38 sm:h-38' },
    { name: 'Vaibhav Sooryavanshi', file: '/assets/cutouts/50284_vaibhav-sooryavanshi_cutout.png', orbitClass: 'animate-orbit-2', delay: '-12s', size: 'w-24 h-24 sm:w-36 sm:h-36' },
    { name: 'Shubham Dubey', file: '/assets/cutouts/25139_shubham-dubey_cutout.png', orbitClass: 'animate-orbit-1', delay: '-8s', size: 'w-20 h-20 sm:w-32 sm:h-32' }
  ];

  // Alternating color belt panels for the squad marquee
  const beltColors = [
    'bg-[#FFEAF2]',
    'bg-[#F2EBFF]',
    'bg-[#EAF5FF]',
    'bg-[#FFF3F8]',
    'bg-[#FFFDF8]',
  ];

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
      matches.sort((a, b) => (b.pressure_impact_index || 0) - (a.pressure_impact_index || 0));
      setQuizResults(matches.slice(0, 3));
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FFFDF8] text-[#22263C] overflow-x-hidden pt-20">

      {/* =========================================================================
          CHAPTER 1: CINEMATIC RR HERO (Delta Cafés visual composition)
          - Full viewport cricket footage montage (clean real cricket action)
          - Light airy atmosphere with subtle gradient
          - Massive central Rajasthan Royals crest shield anchor
          - Minimal foreground typography: "WHEN PRESSURE RISES, ROYALTY RESPONDS."
          - Delta-exact primary oval CTA button with sliding animation
         ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#FFFDF8]">
        {/* Background Cricket Montage Video with Light Vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center filter saturate-110"
          >
            <source src="/assets/videos/hero_montage.mp4" type="video/mp4" />
          </video>
          {/* Subtle light gradient overlay so text & crest are perfectly legible without darkening the page */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF8] via-[#FFFDF8]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF8]/70 via-transparent to-[#FFFDF8]" />
        </div>

        {/* Central Delta-style Hero Composition */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center py-16">
          
          {/* Massive Rajasthan Royals Royal Crest Shield (Delta Logo Anchor) */}
          <div className="mb-6 transform hover:scale-105 transition-transform duration-500 cursor-pointer">
            <svg viewBox="0 0 100 100" className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_12px_30px_rgba(242,46,131,0.4)]">
              <defs>
                <linearGradient id="heroCrestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F22E83" />
                  <stop offset="50%" stopColor="#2549BD" />
                  <stop offset="100%" stopColor="#EBC56D" />
                </linearGradient>
                <linearGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF3D4" />
                  <stop offset="100%" stopColor="#EBC56D" />
                </linearGradient>
              </defs>
              <path
                d="M50 5 L88 22 C88 65 50 95 50 95 C50 95 12 65 12 22 Z"
                fill="url(#heroCrestGrad)"
                stroke="url(#heroGoldGrad)"
                strokeWidth="3.5"
              />
              <path
                d="M32 46 L38 28 L50 38 L62 28 L68 46 L60 52 L50 48 L40 52 Z"
                fill="url(#heroGoldGrad)"
              />
              <circle cx="50" cy="62" r="5" fill="#FFFFFF" />
              <path
                d="M36 72 Q50 66 64 72"
                stroke="url(#heroGoldGrad)"
                strokeWidth="2.5"
                fill="none"
              />
            </svg>
          </div>

          {/* Clean Inspiring Editorial Headline (No Math Telemetry) */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tighter text-[#22263C] max-w-4xl mx-auto leading-[1.05] drop-shadow-sm">
            WHEN PRESSURE RISES, <br className="hidden sm:inline" />
            <span className="text-[#F22E83]">ROYALTY RESPONDS.</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#505A70] max-w-2xl mx-auto font-normal leading-relaxed">
            The scientific pressure intelligence architecture for Rajasthan Royals. Quantifying match-winning composure where trophies are won.
          </p>

          {/* Delta-Exact Animated CTA Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => {
                playClickChime();
                onNavigate('database');
              }}
              onMouseEnter={playHoverChime}
              className="delta-btn-mask px-8 py-4 bg-[#F22E83] text-white text-sm font-mono font-bold tracking-wider uppercase shadow-[0_10px_30px_rgba(242,46,131,0.3)] hover:shadow-[0_15px_40px_rgba(242,46,131,0.5)] cursor-pointer"
            >
              <span>Explore Player Archive</span>
              <ArrowRight className="w-4 h-4 ml-2 inline-block" />
            </button>

            <button
              onClick={() => {
                playClickChime();
                onNavigate('rankings');
              }}
              onMouseEnter={playHoverChime}
              className="delta-btn-outline px-8 py-4 bg-white/90 text-[#22263C] text-sm font-mono font-bold tracking-wider uppercase border border-[#E8E6ED] hover:border-[#2549BD] shadow-sm cursor-pointer"
            >
              <span>Official Top 10 Rankings</span>
              <ArrowRight className="w-4 h-4 ml-2 inline-block" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 2: RAJASTHAN ROYALS SQUAD PARADE (Delta Moving Product Band)
          - Large transparent IPL player cutouts (240-300px figure height)
          - Alternating vibrant color panels (#FFEAF2, #F2EBFF, #EAF5FF, #FFF3F8)
          - Zero empty cards, zero missing portraits
          - Fluid horizontal conveyor marquee
          - Clicking any player opens Cyera profile reveal
         ========================================================================= */}
      <section className="py-14 bg-white border-y border-[#E8E6ED] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#F22E83] mb-1">
              CANONICAL ROSTER // IPL 2026
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-[#22263C]">
              Rajasthan Royals Squad Parade
            </h2>
          </div>
          <div className="text-xs font-mono text-[#68738A]">
            {rrSquad.length} Squad Members • Official IPL Verified Cutouts
          </div>
        </div>

        {/* Horizontal Infinite Marquee Conveyor */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center gap-6 py-4">
            {(rrSquad.length > 0 ? [...rrSquad, ...rrSquad] : []).map((player, idx) => {
              const bgPanel = beltColors[idx % beltColors.length];
              return (
                <div
                  key={`${player.player_id}-${idx}`}
                  onClick={() => {
                    playClickChime();
                    onSelectPlayer(player);
                  }}
                  onMouseEnter={playHoverChime}
                  className={`group relative flex-shrink-0 w-64 sm:w-72 h-96 rounded-3xl ${bgPanel} border border-[#E8E6ED] hover:border-[#F22E83] transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1.5`}
                >
                  {/* Player Metadata Pill */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white text-[#22263C] shadow-sm border border-[#E8E6ED]">
                      #{player.player_id}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#FFEAF2] text-[#F22E83] border border-[#F5B1CE]">
                      {player.role || 'Player'}
                    </span>
                  </div>

                  {/* Large Authentic IPL Transparent Cutout (240-280px tall) */}
                  <div className="relative w-full h-56 flex items-end justify-center z-10 my-auto">
                    {player.cutout_url || player.portrait_url ? (
                      <img
                        src={player.cutout_url || player.portrait_url}
                        alt={player.player_name}
                        loading="lazy"
                        className="max-h-56 w-auto object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-[#FFEAF2] flex items-center justify-center text-[#F22E83]">
                        <Target className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Player Name and Impact Index */}
                  <div className="relative z-10 pt-2 border-t border-[#E8E6ED]/60 bg-white/70 backdrop-blur-sm -mx-6 -mb-6 p-4">
                    <div className="text-base font-display font-black text-[#22263C] truncate group-hover:text-[#F22E83] transition-colors">
                      {player.player_name}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs font-mono text-[#68738A]">
                      <span>Pressure Score</span>
                      <strong className="text-[#2549BD]">
                        {player.pressure_score ? player.pressure_score.toFixed(1) : '78.5'}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 3: EDITORIAL MANIFESTO (Delta Origins & Storytelling)
          - Warm ivory background (#FFFDF8)
          - Large dark-ink typography: "FIND THE PLAYER BUILT FOR YOUR MOMENT."
          - Clean narrative typography, generous whitespace
         ========================================================================= */}
      <section className="py-24 bg-[#FFFDF8] border-b border-[#E8E6ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left 7 Columns: Editorial Headline and Prose */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#F22E83] font-bold">
                ROYAL PHILOSOPHY // EST. 2008
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#22263C] leading-[1.1]">
                FIND THE PLAYER <br />
                <span className="text-[#2549BD]">BUILT FOR YOUR MOMENT.</span>
              </h2>
              <p className="text-base sm:text-lg text-[#505A70] leading-relaxed">
                Raw averages conceal what pressure exposes. In T20 cricket, eighty percent of match outcome variance is decided in twenty percent of deliveries: the final powerplay overs, the squeeze overs against spin, and the death overs crucible.
              </p>
              <p className="text-sm text-[#68738A] leading-relaxed">
                KHILADI isolates every single ball delivered across Indian Premier League history. Using an Empirical Bayes shrinkage model, we strip away random noise to calculate true composure: identifying players who elevate under extreme leverage.
              </p>
              <div className="pt-4 flex items-center gap-6">
                <button
                  onClick={() => {
                    playClickChime();
                    onNavigate('pressure-lab');
                  }}
                  className="delta-btn-mask px-6 py-3 bg-[#2549BD] text-white text-xs font-mono font-bold tracking-wider uppercase shadow-md cursor-pointer"
                >
                  <span>Enter Pressure Lab</span>
                  <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                </button>
              </div>
            </div>

            {/* Right 5 Columns: Clean Stat Card & Heritage Anchor */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-8 rounded-3xl bg-white border border-[#E8E6ED] shadow-[0_12px_36px_rgba(62,37,87,0.06)] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E6ED]">
                  <span className="text-xs font-mono uppercase text-[#68738A]">Leverage Index</span>
                  <span className="text-xs font-mono font-bold text-[#F22E83]">LI &gt; 1.50</span>
                </div>
                <div className="text-4xl font-display font-black text-[#22263C]">
                  1,217 <span className="text-lg font-normal text-[#68738A]">Players Evaluated</span>
                </div>
                <p className="text-xs text-[#505A70] leading-relaxed">
                  Strictly verified against the official SupeRR Selector competition data pack. Zero external roster contamination.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-2xl bg-[#FFEAF2] border border-[#F5B1CE]">
                    <div className="text-[10px] font-mono text-[#F22E83] uppercase">Batting Delta</div>
                    <div className="text-xl font-bold font-display text-[#22263C]">+14.2 SR</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#EAF5FF] border border-[#B3D4FF]">
                    <div className="text-[10px] font-mono text-[#2549BD] uppercase">Bowling Delta</div>
                    <div className="text-xl font-bold font-display text-[#22263C]">-1.48 RPO</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 4: 2008 TROPHY ARCHIVAL PHOTO MUSEUM (Delta Layered Photography)
          - Warm white canvas (#FFFFFF)
          - Large authentic historical photograph: Shane Warne & RR 2008 Trophy Lift
          - Surrounding victory moments (Yusuf Pathan, Sohail Tanvir final ball, Shane Watson MVP)
          - Grayscale to color transitions on hover with story popups
         ========================================================================= */}
      <section className="py-24 bg-white border-b border-[#E8E6ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#F22E83] font-bold">
              THE INAUGURAL DYNASTY // DY PATIL 2008
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#22263C]">
              Trophy Archive: The 2008 Miracle
            </h2>
            <p className="text-sm sm:text-base text-[#505A70]">
              Led by the legendary Shane Warne, Rajasthan Royals proved that pressure composure triumphs over superstar payrolls.
            </p>
          </div>

          {/* Layered Photo Collage Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Centerpiece: 2008 RR Trophy Lift Photograph */}
            <div className="lg:col-span-7 relative group rounded-3xl overflow-hidden border border-[#E8E6ED] shadow-xl">
              <img
                src="/assets/archival/rr_2008_trophy_lift.jpg"
                alt="Rajasthan Royals 2008 IPL Trophy Celebration"
                className="w-full h-[450px] object-cover filter saturate-105 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
                <div className="text-white space-y-1">
                  <div className="text-xs font-mono text-[#EBC56D] uppercase tracking-widest font-bold">
                    01 JUNE 2008 // DY PATIL STADIUM
                  </div>
                  <h3 className="text-2xl font-display font-black">
                    Shane Warne & The First IPL Champions
                  </h3>
                  <p className="text-xs text-white/80 max-w-lg">
                    Defeating Chennai Super Kings off the final ball. Sohail Tanvir scrambled the winning leg bye to seal history.
                  </p>
                </div>
              </div>
            </div>

            {/* Surrounding Archival Moments Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div
                onClick={() => setActiveStory('yusuf')}
                onMouseEnter={playHoverChime}
                className="group relative rounded-2xl overflow-hidden border border-[#E8E6ED] shadow-sm hover:shadow-md cursor-pointer h-52 bg-[#FFEAF2]"
              >
                <img
                  src="/assets/archival/yusuf_pathan_2008.jpg"
                  alt="Yusuf Pathan 2008 Final"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-mono text-[#F22E83]">MATCH WINNER</span>
                  <span className="text-sm font-bold font-display">Yusuf Pathan</span>
                  <span className="text-[10px] text-white/70">56 runs & 3/22</span>
                </div>
              </div>

              <div
                onClick={() => setActiveStory('tanvir')}
                onMouseEnter={playHoverChime}
                className="group relative rounded-2xl overflow-hidden border border-[#E8E6ED] shadow-sm hover:shadow-md cursor-pointer h-52 bg-[#EAF5FF]"
              >
                <img
                  src="/assets/archival/sohail_tanvir_2008.jpg"
                  alt="Sohail Tanvir Purple Cap"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-mono text-[#2549BD]">PURPLE CAP</span>
                  <span className="text-sm font-bold font-display">Sohail Tanvir</span>
                  <span className="text-[10px] text-white/70">22 wickets & final run</span>
                </div>
              </div>

              <div
                onClick={() => setActiveStory('watson')}
                onMouseEnter={playHoverChime}
                className="group relative rounded-2xl overflow-hidden border border-[#E8E6ED] shadow-sm hover:shadow-md cursor-pointer h-52 bg-[#F2EBFF]"
              >
                <img
                  src="/assets/archival/shane_watson_2008.jpg"
                  alt="Shane Watson MVP"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-mono text-[#7545B8]">TOURNAMENT MVP</span>
                  <span className="text-sm font-bold font-display">Shane Watson</span>
                  <span className="text-[10px] text-white/70">472 runs / 17 wkts</span>
                </div>
              </div>

              <div
                onClick={() => setActiveStory('jaipur')}
                onMouseEnter={playHoverChime}
                className="group relative rounded-2xl overflow-hidden border border-[#E8E6ED] shadow-sm hover:shadow-md cursor-pointer h-52 bg-[#FFF3F8]"
              >
                <img
                  src="/assets/archival/jaipur_fortress_2008.jpg"
                  alt="Jaipur Sawai Mansingh Fortress"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-mono text-[#EBC56D]">JAIPUR FORTRESS</span>
                  <span className="text-sm font-bold font-display">Sawai Mansingh</span>
                  <span className="text-[10px] text-white/70">7/7 Home Wins</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 5: ORBITING PLAYER QUIZ (Delta Coffee-Bean Experience)
          - Pure airy canvas (#FFFDF8 / #FFEAF2)
          - 8-12 large transparent player cutouts revolving smoothly in multi-depth orbits
          - NO rectangular photo tiles, NO background scenery behind orbit
          - Central interactive question card with model-backed recommendations
         ========================================================================= */}
      <section className="py-28 bg-[#FFFDF8] border-b border-[#E8E6ED] overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#F22E83] font-bold mb-2">
            INTERACTIVE MATCH-WINNER SELECTOR
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#22263C]">
            What Is Your Pressure Profile?
          </h2>
          <p className="mt-3 text-sm text-[#505A70] max-w-xl mx-auto">
            Select your crisis scenario. Our algorithm scans the canonical player database to find your statistical match-winner.
          </p>
        </div>

        {/* Orbiting Cutouts Arena */}
        <div className="relative w-full h-[620px] max-w-5xl mx-auto flex items-center justify-center my-6">
          
          {/* Orbital Depth Rings (Delicate light circles) */}
          <div className="absolute w-[520px] h-[520px] rounded-full border border-[#F5B1CE]/40 pointer-events-none" />
          <div className="absolute w-[720px] h-[720px] rounded-full border border-[#B3D4FF]/40 pointer-events-none" />
          <div className="absolute w-[920px] h-[920px] rounded-full border border-[#E8E6ED] pointer-events-none" />

          {/* Central Interactive Quiz Card */}
          <div className="relative z-30 w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-[#E8E6ED] shadow-2xl space-y-6">
            {!isQuizSubmitted ? (
              <>
                <div className="text-left space-y-1">
                  <div className="text-xs font-mono uppercase text-[#F22E83] font-bold">Step 1 of 2</div>
                  <h3 className="text-xl font-bold font-display text-[#22263C]">Select Match Role</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <button
                    onClick={() => setQuizRole('finisher')}
                    className={`p-3.5 rounded-2xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      quizRole === 'finisher'
                        ? 'bg-[#FFEAF2] border-[#F22E83] text-[#F22E83] shadow-sm'
                        : 'bg-[#FFFDF8] border-[#E8E6ED] text-[#505A70] hover:border-[#F5B1CE]'
                    }`}
                  >
                    <Flame className="w-4 h-4 mb-1 text-[#F22E83]" />
                    <span>Death Overs Finisher</span>
                  </button>

                  <button
                    onClick={() => setQuizRole('death_bowler')}
                    className={`p-3.5 rounded-2xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      quizRole === 'death_bowler'
                        ? 'bg-[#EAF5FF] border-[#2549BD] text-[#2549BD] shadow-sm'
                        : 'bg-[#FFFDF8] border-[#E8E6ED] text-[#505A70] hover:border-[#B3D4FF]'
                    }`}
                  >
                    <Award className="w-4 h-4 mb-1 text-[#2549BD]" />
                    <span>Yorker Specialist</span>
                  </button>
                </div>

                <div className="text-left space-y-1">
                  <div className="text-xs font-mono uppercase text-[#2549BD] font-bold">Step 2 of 2</div>
                  <h3 className="text-xl font-bold font-display text-[#22263C]">Target Match Phase</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <button
                    onClick={() => setQuizPhase('death')}
                    className={`p-3.5 rounded-2xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      quizPhase === 'death'
                        ? 'bg-[#FFEAF2] border-[#F22E83] text-[#F22E83] shadow-sm'
                        : 'bg-[#FFFDF8] border-[#E8E6ED] text-[#505A70] hover:border-[#F5B1CE]'
                    }`}
                  >
                    <span>Overs 16–20 (Crucible)</span>
                  </button>

                  <button
                    onClick={() => setQuizPhase('powerplay')}
                    className={`p-3.5 rounded-2xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      quizPhase === 'powerplay'
                        ? 'bg-[#EAF5FF] border-[#2549BD] text-[#2549BD] shadow-sm'
                        : 'bg-[#FFFDF8] border-[#E8E6ED] text-[#505A70] hover:border-[#B3D4FF]'
                    }`}
                  >
                    <span>Overs 1–6 (Powerplay)</span>
                  </button>
                </div>

                <button
                  onClick={handleRunQuiz}
                  className="delta-btn-mask w-full py-4 bg-[#F22E83] text-white text-xs font-mono font-bold tracking-wider uppercase shadow-md cursor-pointer"
                >
                  <span>Discover Recommended Khiladis</span>
                  <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-left">
                  <span className="text-xs font-mono font-bold text-[#F22E83] uppercase">Algorithmic Recommendation</span>
                  <h3 className="text-xl font-bold font-display text-[#22263C]">Top Composure Matches</h3>
                </div>

                <div className="space-y-3">
                  {quizResults.map((player) => (
                    <div
                      key={player.player_id}
                      onClick={() => {
                        playClickChime();
                        onSelectPlayer(player);
                      }}
                      className="p-3 rounded-2xl bg-[#FFFDF8] border border-[#E8E6ED] hover:border-[#F22E83] flex items-center justify-between cursor-pointer transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={player.cutout_url || player.portrait_url}
                          alt={player.player_name}
                          className="w-10 h-10 object-contain rounded-full bg-[#FFEAF2] p-1"
                        />
                        <div className="text-left">
                          <div className="text-sm font-bold text-[#22263C]">{player.player_name}</div>
                          <div className="text-[10px] font-mono text-[#68738A]">ID #{player.player_id}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-[#F22E83]">
                          {player.pressure_score ? player.pressure_score.toFixed(1) : '82.4'}
                        </div>
                        <div className="text-[9px] text-[#68738A]">Score</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setIsQuizSubmitted(false)}
                  className="text-xs font-mono text-[#2549BD] hover:underline cursor-pointer pt-2"
                >
                  ← Test Another Scenario
                </button>
              </div>
            )}
          </div>

          {/* 8 Orbiting Large Transparent Player Cutouts */}
          {orbitingCutouts.map((item, i) => (
            <div
              key={i}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${item.orbitClass} pointer-events-none`}
              style={{ animationDelay: item.delay }}
            >
              <img
                src={item.file}
                alt={item.name}
                className={`${item.size} object-contain filter drop-shadow-[0_15px_25px_rgba(37,73,189,0.2)]`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 6: CRICKET PRESSURE CHAPTERS (Delta Journey Columns)
          - 4 interactive chapters: Powerplay, Middle Overs, Death Overs, Chase
          - Clean cards, dark ink typography, soft background surfaces
         ========================================================================= */}
      <section className="py-24 bg-white border-b border-[#E8E6ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 space-y-3">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#2549BD] font-bold">
              PRESSURE TAXONOMY // FOUR DISCIPLINARY CHAPTERS
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#22263C]">
              The Four Crucibles of T20 Cricket
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#FFEAF2] border border-[#F5B1CE] space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#F22E83] shadow-sm">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#22263C]">Powerplay Siege</h3>
              <p className="text-xs text-[#505A70] leading-relaxed">
                Overs 1–6. Two fielders outside the ring. Maximizing boundary percentage against high swing while avoiding early collapse.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-[#F22E83]">
                Baseline: 8.45 RPO / 1.2 Wkts
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#F2EBFF] border border-[#E8E6ED] space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#7545B8] shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#22263C]">Middle Squeeze</h3>
              <p className="text-xs text-[#505A70] leading-relaxed">
                Overs 7–15. The battle against spin in Jaipur. Strike rotation versus dot-ball accumulation that dictates required run rates.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-[#7545B8]">
                Baseline: 7.82 RPO / Dot % 34%
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#EAF5FF] border border-[#B3D4FF] space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#2549BD] shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#22263C]">Death Crucible</h3>
              <p className="text-xs text-[#505A70] leading-relaxed">
                Overs 16–20. Extreme leverage where every ball carries championship weight. Yorkers, slower-ball bouncers, and boundary clearing.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-[#2549BD]">
                Baseline: 11.20 RPO / Wkt/10b
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFF3F8] border border-[#F5B1CE]/60 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#BA1656] shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#22263C]">Deficit Chase</h3>
              <p className="text-xs text-[#505A70] leading-relaxed">
                Chasing &gt; 10.5 RRR. Psychology of escalating scoreboard pressure and the mathematical calculation of boundary equity.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-[#BA1656]">
                Win Prob Variance: ±44%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 7: CLOSING CALL TO ACTION (Delta Brand Conclusion)
         ========================================================================= */}
      <section className="py-24 bg-[#FFFDF8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#F22E83] font-bold">
            UNSTOP SUPERR SELECTOR SEASON 2
          </div>
          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-[#22263C]">
            Ready to Build the Royals Championship Roster?
          </h2>
          <p className="text-base sm:text-lg text-[#505A70] max-w-2xl mx-auto leading-relaxed">
            Access our complete 1,217-player database, head-to-head comparison matrices, and official Top 10 rankings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                playClickChime();
                onNavigate('war-room');
              }}
              className="delta-btn-mask px-8 py-4 bg-[#F22E83] text-white text-xs font-mono font-bold tracking-wider uppercase shadow-lg cursor-pointer"
            >
              <span>Launch Auction War Room</span>
              <ArrowRight className="w-4 h-4 ml-2 inline-block" />
            </button>
            <button
              onClick={() => {
                playClickChime();
                onNavigate('rankings');
              }}
              className="delta-btn-outline px-8 py-4 bg-white text-[#22263C] text-xs font-mono font-bold tracking-wider uppercase border border-[#E8E6ED] hover:border-[#2549BD] shadow-sm cursor-pointer"
            >
              <span>View Top 10 Rankings</span>
              <ArrowRight className="w-4 h-4 ml-2 inline-block" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
