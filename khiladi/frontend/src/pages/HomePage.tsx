import "./home-editorial.css";
import { NeutralPlayerAvatar } from "../components/NeutralPlayerAvatar";
import { PublicDataPulse } from "../components/PublicDataPulse";
import { KhiladiBento } from "../components/KhiladiBento";
import { EditorialMatteRise } from "../components/EditorialMatteRise";
import { RoyalIdentityPreview } from "../components/player-cards/RoyalIdentityPreview";
import { staticPages } from "../utils/urls";
import React, { useEffect, useRef, useState } from "react";
import { Player } from "../types";
import { gsap, ScrollTrigger, useGSAP } from "../utils/motion";
import {
  describePlayer,
  loadPlayers,
  requestJSON,
  recommendPlayers,
} from "../utils/api";
import { playerImage } from "../utils/media";
import { KhiladiAnimatedButton as CTA } from "../components/KhiladiAnimatedButton";
import { CinematicMemoryRibbon } from "../components/CinematicMemoryRibbon";
interface Props {
  introComplete?: boolean;
  onNavigate: (page: string) => void;
  onSelectPlayer: (player: Player) => void;
}
function QuizPlayerPhoto({player}:{player:Player}) {
  const [failed,setFailed]=useState(false);
  const src=playerImage(player);
  return src&&!failed ? (
    <img src={src} alt="" width="220" height="270" loading="lazy"
      decoding="async" referrerPolicy="no-referrer" onError={()=>setFailed(true)} />
  ) : (
    <NeutralPlayerAvatar className="quiz-neutral-player"
      label={`No verified IPL portrait for ${player.player_name}`} />
  );
}
/** Gallery fallbacks render ONLY when the photographic asset genuinely fails.
 * This prevents duplicate hidden <img>s and preserves photo choreography.
 */
function GalleryPhotograph({filename,alt,eager=false}:{
  filename:string;alt:string;eager?:boolean;
}) {
  const [failed,setFailed]=useState(false);
  if(failed)return <NeutralPlayerAvatar className="gallery-neutral-avatar"
    label={`Photograph unavailable: ${alt}`} />;
  return <img src={`${import.meta.env.BASE_URL}assets/gallery/${filename}`}
    alt={alt} decoding="async" loading={eager?"eager":"lazy"}
    onError={()=>setFailed(true)} />;
}
export const HomePage: React.FC<Props> = ({ introComplete = true, onNavigate, onSelectPlayer }) => {
  const root = useRef<HTMLDivElement>(null);
  const [squad, setSquad] = useState<Player[]>([]),
    [error, setError] = useState("");
  const [journeyTopic, setJourneyTopic] = useState(0);
  const [quizStep, setQuizStep] = useState(0),
    [role, setRole] = useState("Batting"),
    [phase, setPhase] = useState("Death Overs");
  const [results, setResults] = useState<Player[]>([]),
    [busy, setBusy] = useState(false),
    [quizError, setQuizError] = useState("");
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const abort = new AbortController();
    requestJSON<Player[]>("/data/rr_squad_2026.json", abort.signal)
      .then(setSquad)
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(
            "The squad could not be loaded. Please reload to try again.",
          );
      });
    return () => abort.abort();
  }, []);
  const featured = [...squad].sort((a, b) => Number(Boolean(playerImage(b))) - Number(Boolean(playerImage(a)))).slice(0, 8);
  const figures = featured;
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      if (!introComplete) return () => media.revert();
      media.add("(prefers-reduced-motion: no-preference)", () => {

        // Entrance begins only AFTER the preloader clears. These animations
        // are observable on replay and never leave half-hidden static content.
        gsap.fromTo(
          ".hero-copy > .eyebrow, .hero-copy > h1, .hero-copy > p:not(.eyebrow), .hero-copy > button",
          { autoAlpha: 0, y: 38, filter: "blur(9px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: .9,
            ease: "power3.out", stagger: .12, clearProps: "transform,filter,opacity,visibility" }
        );
        // Memory ribbon owns its scroll and pointer motion. Do not add a second pin.
        // A horizontally scrollable rail remains usable without vertical
        // scroll hijacking. Its reveal is tied to ordinary vertical scrolling.
        // Vertical scrolling advances the player gallery without clipping or pinning cards.
        const playerRail = root.current?.querySelector<HTMLElement>(".home-player-grid");
        const playerSection = root.current?.querySelector<HTMLElement>(".home-player-showcase");
        if (playerRail && playerSection && window.innerWidth >= 900) {
          gsap.to(playerRail, {
            scrollLeft: () => Math.max(0,playerRail.scrollWidth - playerRail.clientWidth),
            ease:"none",
            scrollTrigger:{
              trigger:playerSection,start:"top 92%",end:"bottom 24%",
              scrub:1,invalidateOnRefresh:true,
            },
          });
        }
        // Explicit, measurable scroll-driven text reveals for the full editorial journey.
        gsap.utils.toArray<HTMLElement>(
          ".home-showcase-intro h2, .khiladi-bento__title h2, .heritage-chapter h2, .quiz-introduction h2"
        ).forEach(title=>{
          gsap.fromTo(title,{clipPath:"inset(0 0 95% 0)",opacity:.2},
            {clipPath:"inset(0 0 0% 0)",opacity:1,ease:"none",
              scrollTrigger:{trigger:title,start:"top 92%",end:"top 42%",scrub:.65}});
        });
        gsap.fromTo(".home-player-item",
          { y: 48, autoAlpha: .25 },
          { y: 0, autoAlpha: 1, ease: "none", stagger: .045,
            scrollTrigger: {
              trigger: ".home-player-showcase", start: "top 90%",
              end: "top 32%", scrub: .75, invalidateOnRefresh: true
            } });
        gsap.utils.toArray<HTMLElement>(".khiladi-bento .kb-card").forEach((card, i) => {
          gsap.fromTo(card, { y: 56, opacity: .45, scale: .98 },
            { y: 0, opacity: 1, scale: 1, ease: "none",
              scrollTrigger: { trigger: card, start: "top 92%",
                end: "top 68%", scrub: .5 } });
        });
        gsap.fromTo(".public-data-pulse__stat",
          { y: 38, autoAlpha: .4 },
          { y: 0, autoAlpha: 1, stagger: .07, ease: "none",
            scrollTrigger: { trigger: ".public-data-pulse",
              start: "top 85%", end: "top 44%", scrub: .6 } });

        gsap.utils.toArray<HTMLElement>(".heritage-shot").forEach((shot, i) => {
          gsap.fromTo(shot,
            { y: i % 2 ? 85 : -85, scale: .85, opacity: .25 },
            { y: 0, scale: 1, opacity: 1, ease: "none",
              scrollTrigger: {
                trigger: ".heritage-photo-composition",
                start: "top 93%", end: "center 50%", scrub: .6,
                invalidateOnRefresh: true,
              },
            });
          if (i === 2) {
            const img = shot.querySelector("img");
            if (img) gsap.fromTo(img,
              { scale: 1.16, filter: "grayscale(1)" },
              { scale: 1, filter: "grayscale(0)", ease: "none",
                scrollTrigger: {
                  trigger: ".heritage-photo-composition",
                  start: "top 90%", end: "bottom 40%", scrub: .65,
                },
              });
          }
        });

        gsap.from(".story-line", {
          yPercent: 80,
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: ".editorial-chapter",
            start: "top 85%",
            end: "top 20%",
            scrub: true,
          },
        });
        gsap.utils
          .toArray<HTMLElement>(".quiz-figure-drift")
          .forEach((figure, i) => {
            const drift = gsap.timeline({
              repeat: -1,
              yoyo: true,
              paused: true,
            });
            drift.to(figure, {
              x: (i % 2 ? -1 : 1) * (innerWidth < 600 ? 5 : 12),
              y: (i % 3 ? 1 : -1) * (innerWidth < 600 ? 8 : 16),
              rotation: i % 2 ? 1.5 : -1.5,
              scale: 1.015,
              duration: 3.8 + i * 0.37,
              ease: "sine.inOut",
            });
            drift.totalTime(i * 0.43);
            ScrollTrigger.create({
              trigger: ".quiz-chapter",
              start: "top bottom",
              end: "bottom top",
              onToggle: ({ isActive }) => drift.paused(!isActive),
            });
          });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".quiz-chapter",
            start: "top 85%",
            end: "top 2%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(
          ".quiz-figure",
          {
            x: (i: number) => (i % 2 ? 1 : -1) * innerWidth * 0.25,
            y: (i: number) => (i < 4 ? -220 : 220),
            scale: 0.4,
            opacity: 0,
            rotation: (i: number) => (i % 2 ? 1 : -1) * 24,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            rotation: 0,
            stagger: 0.04,
            ease: "power2.out",
            duration: 1,
          },
          0,
        );
        tl.fromTo(
          ".quiz-introduction",
          { y: 90, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.35,
        );
      });
      ScrollTrigger.refresh();
      return () => media.revert();
    },
    { scope: root, dependencies: [squad.length, introComplete], revertOnUpdate: true },
  );
  useEffect(() => {
    if (quizStep > 0) {
      const panel = root.current?.querySelector<HTMLElement>(".quiz-panel");
      panel?.scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
        block: "center",
      });
      panel?.focus({ preventScroll: true });
    }
  }, [quizStep, reduced]);
  const findPlayers = async () => {
    setBusy(true);
    setQuizError("");
    try {
      const data = await recommendPlayers({
        role_priority: role,
        match_phase: phase,
        risk_profile: "Consistent Reliability",
      });
      const canonical = await loadPlayers();
      const ids = new Set(canonical.map((p) => p.player_id));
      setResults(
        data.recommendations.filter((p: Player) => ids.has(p.player_id)),
      );
      setQuizStep(3);
    } catch {
      setQuizError(
        "Recommendations are unavailable right now. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  const scrollQuiz = () =>
    document
      .getElementById("discovery")
      ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  return (
    <div ref={root} className="cinematic-home">
      <section
        className="hero-chapter"
        data-brand-tone="white"
        data-header-brand="hero"
        aria-labelledby="hero-heading"
      >
        <div className="hero-scene" aria-hidden="true">
          <span className="hero-field-line" />
          <span className="hero-field-line hero-field-line--two" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">A GAME OF MOMENTS</p>
          <h1
            id="hero-heading"
            className="hero-chapter-heading"
          >
            Find the players.
            <br />
            <em>Feel the moment.</em>
            <br />
            Own the game.
          </h1>
          <p>Discover who delivers when the match is on the line.</p>
          <CTA onClick={scrollQuiz}>Find my player</CTA>
        </div>
        <CinematicMemoryRibbon />
        <div className="hero-bottom-line">
          <span>FOR THE LOVE OF THE GAME</span><span>SCROLL TO DISCOVER ↓</span>
        </div>
      </section>
      <section className="home-player-showcase" aria-labelledby="home-player-heading" data-brand-tone="white" data-header-brand="compact">
        <header className="home-showcase-intro">
          <p className="eyebrow">PLAYERS IN FOCUS</p>
          <h2 id="home-player-heading">More than a name. <em>A game changer.</em></h2>
          <p>Explore complete player photographs and recorded performances. Swipe or scroll sideways to see every card.</p>
        </header>
        <div className="home-player-grid">
          {featured.map((player) => (
            <button
              type="button"
              key={player.player_id}
              className="home-player-item"
              aria-label={`Open ${player.player_name}'s player card`}
              onClick={() => onSelectPlayer(player)}
            >
              <RoyalIdentityPreview player={player} compact />
            </button>
          ))}
        </div>
        <div className="home-showcase-bottom">
          <span>SWIPE OR DRAG SIDEWAYS TO EXPLORE THE CARDS →</span>
          <CTA variant="outline" onClick={() => onNavigate("database")}>Explore every player</CTA>
        </div>
      </section>
      <KhiladiBento featured={featured} onNavigate={onNavigate} />
      <section
        className="editorial-chapter"
        aria-labelledby="story-heading"
        data-brand-tone="white"
        data-header-brand="compact"
      >
        <p className="eyebrow">IT’S MORE THAN A GAME.</p>
        <h2 id="story-heading">
          <span className="story-line">Some play</span>
          <span className="story-line">the game.</span>
          <span className="story-line">
            Some <em>change it.</em>
          </span>
        </h2>
        <p className="story-caption">
          The final over. The impossible chase. The player who changes
          everything.
          <br />
          Find the people you’d trust with the moment.
        </p>
        <CTA variant="outline" onClick={() => onNavigate("database")}>
          Meet your match-winner
        </CTA>
      </section>
      <section
        className="heritage-chapter"
        aria-labelledby="heritage-heading"
        data-brand-tone="original"
        data-header-brand="hidden"
      >
        <div className="heritage-title">
          <p className="eyebrow">RAJASTHAN. ALWAYS.</p>
          <h2 id="heritage-heading">
            A first time.
            <br />
            <em>A forever feeling.</em>
          </h2>
          <p>
            In 2008, a team of believers made history.
            <br />
            That spirit still belongs to every Royal.
          </p>
        </div>
        <div className="heritage-photo-composition" aria-label="Cricket photographic collection">
          {["moment-1.webp", "moment-2.webp", "trophy-celebration.webp", "moment-3.webp", "moment-4.webp"].map((filename, i) => (
            <div className={`heritage-shot heritage-shot--${i}`} key={filename}>
              <GalleryPhotograph filename={filename} alt={i===2?"Trophy celebration":"Cricket moments"}/>
            </div>
          ))}
        </div>
      </section>
      <EditorialMatteRise />
      <section
        className="journey-chapter"
        aria-labelledby="journey-heading"
        data-brand-tone="white"
        data-header-brand="hidden"
      >
        <div className="journey-shade" />
        <div className="journey-copy">
          <p className="eyebrow">FROM A FIRST TITLE TO YOUR NEXT CHOICE</p>
          <h2 id="journey-heading">
            A Royal story.
            <br />
            <em>Still being written.</em>
          </h2>
          <p>
            {
              [
                "A first title in 2008. A lasting belief in players who rise to the occasion.",
                "Every player brings a different game. Look past the headline and get to know the person behind the performance.",
                "Your next decision starts with the evidence. Explore the recorded performances and find a player who fits.",
              ][journeyTopic]
            }
          </p>
          <CTA
            onClick={() =>
              onNavigate(journeyTopic === 0 ? "methodology" : "database")
            }
          >
            Explore the story
          </CTA>
        </div>
        <div className="journey-hotspots" aria-label="Explore the Royals story">
          {["The beginning", "The people", "Your next choice"].map(
            (topic, i) => (
              <button
                key={topic}
                aria-pressed={journeyTopic === i}
                onClick={() => setJourneyTopic(i)}
              >
                <span aria-hidden="true">+</span>
                <span>{topic}</span>
              </button>
            ),
          )}
        </div>
      </section>
      <PublicDataPulse onNavigate={onNavigate} />
      <section
        id="discovery"
        className="quiz-chapter"
        data-brand-tone="original"
        data-header-brand="hidden"
        aria-labelledby="quiz-heading"
      >
        {error && <p role="alert">{error}</p>}
        <div className="quiz-scene">
          {figures.map((player, i) => (
            <div
              className={`quiz-figure quiz-figure--${i}`}
              key={player.player_id}
              aria-hidden="true"
            >
              <div className="quiz-figure-drift">
                <QuizPlayerPhoto player={player} />

              </div>
              <span className="quiz-figure-name">{player.player_name}</span>
            </div>
          ))}
          <div className="quiz-introduction">
            <p className="eyebrow">YOUR TEAM. YOUR MOMENT.</p>
            <h2 id="quiz-heading">
              Who’s your
              <br />
              <em>match-winner?</em>
            </h2>
            <p>
              Tell us what your team needs.
              <br />
              Find the players who fit.
            </p>
            <CTA onClick={() => setQuizStep(1)}>Find my player</CTA>
          </div>
        </div>
        {quizStep > 0 && (
          <div
            className="quiz-panel"
            tabIndex={-1}
            aria-live="polite"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setQuizStep(0);
                root.current
                  ?.querySelector<HTMLButtonElement>(
                    ".quiz-introduction button",
                  )
                  ?.focus();
              }
            }}
          >
            <button
              className="quiz-close"
              aria-label="Close quiz"
              onClick={() => setQuizStep(0)}
            >
              ×
            </button>
            {quizStep === 1 && (
              <>
                <p className="eyebrow">FIRST, YOUR TEAM NEEDS…</p>
                <h3>
                  A bat, a ball,
                  <br />
                  or a little of both?
                </h3>
                <fieldset>
                  <legend className="sr-only">Choose a playing role</legend>
                  {[
                    ["Batting", "Runs on the board"],
                    ["Bowling", "Wickets when it matters"],
                    ["All-Rounder", "A bit of everything"],
                  ].map(([value, text]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="quiz-role"
                        value={value}
                        checked={role === value}
                        onChange={() => setRole(value)}
                      />
                      <span>{text}</span>
                    </label>
                  ))}
                </fieldset>
                <CTA onClick={() => setQuizStep(2)}>Next question</CTA>
              </>
            )}
            {quizStep === 2 && (
              <>
                <p className="eyebrow">AND THE MOMENT?</p>
                <h3>
                  When do you
                  <br />
                  need them most?
                </h3>
                <fieldset>
                  <legend className="sr-only">Choose a match situation</legend>
                  {[
                    ["Powerplay", "Making a strong start"],
                    ["Death Overs", "The final few overs"],
                    ["Chase Master", "Chasing the target"],
                  ].map(([value, text]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="quiz-phase"
                        value={value}
                        checked={phase === value}
                        onChange={() => setPhase(value)}
                      />
                      <span>{text}</span>
                    </label>
                  ))}
                </fieldset>
                <p className="quiz-caveat">
                  Suggestions use recorded pressure performance. The current
                  model has no separate phase-specific estimates.
                </p>
                <CTA disabled={busy} onClick={findPlayers}>
                  {busy ? "Finding players…" : "Show my players"}
                </CTA>
                <button className="text-link" onClick={() => setQuizStep(1)}>
                  Back
                </button>
              </>
            )}
            {quizStep === 3 && (
              <>
                <p className="eyebrow">A FEW PLAYERS TO EXPLORE</p>
                <h3>
                  Your next
                  <br />
                  match-winner?
                </h3>
                {results.length ? (
                  results.map((player) => (
                    <button
                      key={player.player_id}
                      className="quiz-result"
                      onClick={() => onSelectPlayer(player)}
                    >
                      <strong>{player.player_name} ↗</strong>
                      <span>{describePlayer(player)}</span>
                    </button>
                  ))
                ) : (
                  <p>
                    No players have enough recorded evidence for this choice.
                  </p>
                )}
                <p className="quiz-caveat">
                  Model suggestions, not predictions or guarantees.
                  {staticPages &&
                    " This static site uses saved outputs of the existing model."}
                </p>
                <button className="text-link" onClick={() => setQuizStep(1)}>
                  Try another combination ↗
                </button>
              </>
            )}
            {quizError && <p role="alert">{quizError}</p>}
          </div>
        )}
      </section>
      <section
        className="closing-chapter"
        data-brand-tone="white"
        data-header-brand="hidden"
      >
        <p className="eyebrow">BACK YOUR INSTINCT. KNOW YOUR PLAYER.</p>
        <h2>
          Ready to find
          <br />
          your <em>match-winner?</em>
        </h2>
        <div>
          <CTA onClick={scrollQuiz}>Find my player</CTA>
          <CTA variant="outline" onClick={() => onNavigate("database")}>
            Explore players
          </CTA>
        </div>
        <p>For the fans who feel every ball.</p>
      </section>
    </div>
  );
};
