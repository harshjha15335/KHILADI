import { KhiladiLogo } from "../components/KhiladiLogo";
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
import {
  approvedHeroClips,
  archivalImages,
  crestURL,
  playerImage,
  reviewMedia,
  rrClips,
} from "../utils/media";
import { KhiladiAnimatedButton as CTA } from "../components/KhiladiAnimatedButton";
interface Props {
  onNavigate: (page: string) => void;
  onSelectPlayer: (player: Player) => void;
}
export const HomePage: React.FC<Props> = ({ onNavigate, onSelectPlayer }) => {
  const root = useRef<HTMLDivElement>(null),
    hero = useRef<HTMLElement>(null),
    belt = useRef<HTMLDivElement>(null),
    beltTween = useRef<gsap.core.Tween | null>(null),
    beltVisible = useRef(true);
  const [squad, setSquad] = useState<Player[]>([]),
    [error, setError] = useState("");
  const [activeClip, setActiveClip] = useState(0),
    [videoEnabled, setVideoEnabled] = useState(approvedHeroClips.length > 0),
    [heroVisible, setHeroVisible] = useState(true);
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
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    if (hero.current) observer.observe(hero.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!videoEnabled || !heroVisible || reduced) return;
    const id = window.setInterval(
      () =>
        setActiveClip((i) => (i + 1) % Math.max(1, approvedHeroClips.length)),
      16000,
    );
    return () => clearInterval(id);
  }, [videoEnabled, heroVisible, reduced]);
  const figures = squad.filter((player) => playerImage(player)).slice(0, 8);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".journey-image",
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 8,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".journey-chapter",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
        gsap.fromTo(
          ".home-portrait-strip",
          { xPercent: 4 },
          {
            xPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: ".portrait-chapter",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
        gsap.from(".bridge-copy > *", {
          y: 65,
          opacity: 0,
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: ".editorial-bridge",
            start: "top 85%",
            end: "top 30%",
            scrub: 0.45,
          },
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
        gsap.utils.toArray<HTMLElement>(".archive-photo").forEach((photo, i) =>
          gsap.fromTo(
            photo,
            {
              y: 120 + (i % 3) * 65,
              rotation: (i % 2 ? 1 : -1) * 10,
              opacity: 0.2,
            },
            {
              y: 0,
              rotation: (i % 2 ? 1 : -1) * 3,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".heritage-composition",
                start: "top 85%",
                end: "center 55%",
                scrub: 0.45,
                invalidateOnRefresh: true,
              },
            },
          ),
        );
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
    { scope: root, dependencies: [squad.length], revertOnUpdate: true },
  );
  useGSAP(
    () => {
      if (!belt.current || !squad.length || reduced) return;
      const track = belt.current;
      // Two identical groups; exactly one group's width is travelled before repetition.
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: squad.length * 9,
        repeat: -1,
        ease: "none",
      });
      beltTween.current = tween;
      const observer = new IntersectionObserver(([e]) => {
        beltVisible.current = e.isIntersecting;
        tween.paused(
          !e.isIntersecting || track.contains(document.activeElement),
        );
      });
      observer.observe(track);
      const focus = () => tween.pause(),
        blur = () => {
          if (beltVisible.current) tween.resume();
        };
      track.addEventListener("focusin", focus);
      track.addEventListener("focusout", blur);
      return () => {
        beltTween.current = null;
        observer.disconnect();
        track.removeEventListener("focusin", focus);
        track.removeEventListener("focusout", blur);
      };
    },
    {
      scope: root,
      dependencies: [squad.length, reduced],
      revertOnUpdate: true,
    },
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
  const choose = (id: number) =>
    loadPlayers()
      .then((players) => {
        const p = players.find((p) => p.player_id === id);
        if (p) onSelectPlayer(p);
      })
      .catch(() =>
        setError("Player details are unavailable. Please try again."),
      );
  return (
    <div ref={root} className="cinematic-home">
      <section
        ref={hero}
        className="hero-chapter"
        aria-labelledby="hero-heading"
      >
        <div className="hero-scene" aria-hidden="true">
          <span className="hero-field-line" />
          <span className="hero-field-line hero-field-line--two" />
        </div>
        {approvedHeroClips.length > 0 &&
          videoEnabled &&
          heroVisible &&
          !reduced && (
            <video
              key={activeClip}
              className="hero-film"
              src={approvedHeroClips[activeClip % approvedHeroClips.length].src}
              aria-label={
                approvedHeroClips[activeClip % approvedHeroClips.length].caption
              }
              autoPlay
              muted
              playsInline
              onEnded={() =>
                setActiveClip((i) => (i + 1) % approvedHeroClips.length)
              }
              onError={() => setVideoEnabled(false)}
            />
          )}

        <div className="hero-copy">
          <p className="eyebrow">A GAME OF MOMENTS</p>
          <h1
            id="hero-heading"
            key={activeClip}
            className="hero-chapter-heading"
          >
            {activeClip === 0 ? (
              <>
                Great players.
                <br />
                <em>Big moments.</em>
                <br />
                The right choice.
              </>
            ) : activeClip === 1 ? (
              <>
                One chance.
                <br />
                <em>Make it count.</em>
                <br />
                Back your player.
              </>
            ) : (
              <>
                Every ball.
                <br />
                <em>Every possibility.</em>
                <br />
                Find your moment.
              </>
            )}
          </h1>
          <p>Discover who delivers when the match is on the line.</p>
          <CTA onClick={scrollQuiz}>Find my player</CTA>
        </div>
        <div className="hero-side">
          <div className="hero-story-cards">
            {squad
              .filter((p) => playerImage(p))
              .slice(0, 2)
              .map((player, i) => (
                <button
                  className={`hero-story hero-story--${i}`}
                  key={player.player_id}
                  onClick={(event) => {
                    event.currentTarget.focus({ preventScroll: true });
                    onSelectPlayer(player);
                  }}
                >
                  <img
                    src={playerImage(player)}
                    alt=""
                    width="200"
                    height="270"
                  />
                  <span>
                    {i === 0 ? "THE NEXT MOMENT" : "A ROYAL STATE OF MIND"}
                  </span>
                  <strong>{player.player_name} ↗</strong>
                </button>
              ))}
          </div>
          <div className="hero-team-label">
            {crestURL && (
              <img
                src={crestURL}
                alt="Rajasthan Royals"
                width="40"
                height="48"
              />
            )}
            <span>HALLA BOL.</span>
          </div>
          {approvedHeroClips.length > 0 ? (
            <button
              onClick={() => setVideoEnabled((v) => !v)}
              aria-pressed={videoEnabled}
            >
              {videoEnabled ? "Pause films" : "Play films"} ↗
            </button>
          ) : (
            <a
              className="official-film-link"
              href={rrClips[activeClip % rrClips.length].source}
              target="_blank"
              rel="noreferrer"
            >
              Watch official Royals clips ↗
            </a>
          )}
          <a
            href={rrClips[activeClip % rrClips.length].source}
            target="_blank"
            rel="noreferrer"
          >
            {rrClips[activeClip % rrClips.length].caption} ↗
          </a>
          {approvedHeroClips.length === 0 && (
            <p className="hero-media-status">
              On-page match footage awaits reuse permission.
            </p>
          )}
        </div>
        <div className="hero-chapters" aria-label="Royals films">
          {rrClips.map((clip, i) => (
            <button
              key={clip.id}
              aria-pressed={activeClip === i}
              onClick={() => {
                setActiveClip(i);
                if (approvedHeroClips.length) setVideoEnabled(true);
              }}
            >
              {squad.find(
                (p) => p.player_name === clip.caption.split(" · ")[0],
              ) && (
                <img
                  className="chapter-thumbnail"
                  src={playerImage(
                    squad.find(
                      (p) => p.player_name === clip.caption.split(" · ")[0],
                    )!,
                  )}
                  alt=""
                  width="70"
                  height="54"
                />
              )}
              <span>0{i + 1}</span>
              <span>{clip.title}</span>
              <span className="film-progress" />
            </button>
          ))}
        </div>
      </section>
      <section
        className="squad-chapter"
        aria-label="Rajasthan Royals players from the supplied IPL 2026 data"
      >
        {error && <p role="alert">{error}</p>}
        <div
          className={`squad-viewport ${reduced ? "squad-viewport--static" : ""}`}
        >
          <div ref={belt} className="squad-track">
            {[0, 1].map((copy) => (
              <div
                className="squad-group"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {squad.map((player, i) => (
                  <button
                    className={`squad-player squad-colour-${i % 4}`}
                    key={player.player_id}
                    data-player-id={player.player_id}
                    onClick={(event) => {
                      event.currentTarget.focus({ preventScroll: true });
                      choose(player.player_id);
                    }}
                    tabIndex={copy === 1 ? -1 : 0}
                  >
                    {playerImage(player) ? (
                      <img
                        src={playerImage(player)}
                        alt=""
                        width="200"
                        height="220"
                        loading="lazy"
                      />
                    ) : (
                      <span className="player-initials" aria-hidden="true">
                        {player.player_name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    )}
                    <span>{player.player_name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="editorial-chapter" aria-labelledby="story-heading">
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
      <section className="heritage-chapter" aria-labelledby="heritage-heading">
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
        {archivalImages.length > 0 ? (
          <div className="heritage-composition">
            {archivalImages.slice(0, 7).map((image, i) => (
              <a
                className={`archive-photo archive-photo--${i}`}
                href={image.source}
                key={image.src}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={image.src}
                  alt={image.caption}
                  width="720"
                  height="540"
                  loading="lazy"
                />
                <span>{image.caption} ↗</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="media-gap">
            <p>The photographic archive awaits cleared imagery.</p>
            <a
              href="https://www.rajasthanroyals.com/photos/remembering-shane-warne-our-first-royal"
              target="_blank"
              rel="noreferrer"
            >
              Explore the official Royals archive ↗
            </a>
          </div>
        )}
        {reviewMedia && (
          <p className="media-review-note">
            Official-source photographs shown for private review. The requested
            2008 trophy photograph and public-use permissions are still pending.
          </p>
        )}
      </section>
      <section className="journey-chapter" aria-labelledby="journey-heading">
        {archivalImages[0] && (
          <img
            className="journey-image"
            src={archivalImages[0].src}
            alt="Shane Warne and Rajasthan Royals, from the official Royals archive"
            width="1600"
            height="1000"
            loading="lazy"
          />
        )}
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
      <section className="portrait-chapter" aria-labelledby="portrait-heading">
        <div className="portrait-caption">
          <p className="eyebrow">THE PEOPLE MAKE THE GAME</p>
          <h2 id="portrait-heading">
            Different players.
            <br />
            <em>One shared feeling.</em>
          </h2>
        </div>
        <div className="home-portrait-strip">
          {squad
            .filter((p) => playerImage(p))
            .slice(0, 7)
            .map((player, i) => (
              <button
                className={`home-portrait home-portrait--${i % 3}`}
                key={player.player_id}
                data-player-id={player.player_id}
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  onSelectPlayer(player);
                }}
              >
                <img
                  src={playerImage(player)}
                  alt=""
                  width="260"
                  height="340"
                  loading="lazy"
                />
                <span>{player.player_name} ↗</span>
              </button>
            ))}
        </div>
      </section>
      <section className="editorial-bridge" aria-labelledby="bridge-heading">
        <div className="bridge-mark" aria-hidden="true"><KhiladiLogo variant="footer" /></div>
        <div className="bridge-copy">
          <p className="eyebrow">A FEELING. A LITTLE EVIDENCE.</p>
          <h2 id="bridge-heading">
            Know the player.
            <br />
            <em>Back the moment.</em>
          </h2>
          <p>
            Some choices start with a feeling. Give yours a little more
            perspective. Discover the people, explore their records, and find
            the players you would trust when the game is on the line.
          </p>
          <CTA variant="secondary" onClick={() => onNavigate("database")}>
            Get to know your players
          </CTA>
        </div>
      </section>
      <section
        id="discovery"
        className="quiz-chapter"
        aria-labelledby="quiz-heading"
      >
        <div className="quiz-scene">
          {figures.map((player, i) => (
            <div
              className={`quiz-figure quiz-figure--${i}`}
              key={player.player_id}
              aria-hidden="true"
            >
              <img
                className="quiz-figure-drift"
                src={playerImage(player)}
                alt=""
                width="220"
                height="270"
                loading="lazy"
              />
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
      <section className="home-notes" aria-labelledby="home-notes-heading">
        <p className="eyebrow">A FEW WAYS INTO THE GAME</p>
        <h2 id="home-notes-heading">Follow your <em>curiosity.</em></h2>
        <div className="home-notes-stories">
          {[
            ["database", "THE PEOPLE", "Look beyond the headline.", "Get to know the players"],
            ["methodology", "THE MOMENT", "What changes under pressure?", "Understand the evidence"],
            ["war-room", "YOUR TEAM", "Make the next choice yours.", "Build your squad"],
          ].map(([destination, label, title, action], i) => <article key={destination} className={`home-note home-note--${i}`}>
            <button onClick={() => onNavigate(destination)}>
              {figures[i] && <img src={playerImage(figures[i])} alt="" width="300" height="290" loading="lazy" />}
              <span className="home-note-copy"><small>{label}</small><strong>{title}</strong><span>{action} ↗</span></span>
            </button>
          </article>)}
        </div>
      </section>
      <section className="closing-chapter">
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
