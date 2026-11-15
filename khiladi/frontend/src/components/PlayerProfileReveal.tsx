import React, { useEffect, useRef } from "react";
import { Player } from "../types";
import { gsap } from "../utils/motion";
import { describePlayer, metric } from "../utils/api";
import { playerImage } from "../utils/media";
import { KhiladiAnimatedButton as CTA } from "./KhiladiAnimatedButton";
import { AugeWarpSurface } from "./AugeWarpSurface";
import { playSound } from "../utils/sound";
interface Props {
  player: Player | null;
  onClose: () => void;
  onAddToWarRoom?: (p: Player) => void;
  isInWarRoom?: boolean;
}
export const PlayerProfileReveal: React.FC<Props> = ({
  player,
  onClose,
  onAddToWarRoom,
  isInWarRoom,
}) => {
  const dialog = useRef<HTMLDialogElement>(null),
    timeline = useRef<gsap.core.Timeline | null>(null),
    callback = useRef(onClose),
    priorFocus = useRef<HTMLElement | null>(null);
  callback.current = onClose;
  useEffect(() => {
    if (!player || !dialog.current) return;
    priorFocus.current = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current.showModal();
    playSound("modal_open");
    const context = gsap.context(() => {
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      timeline.current = gsap
        .timeline({
          defaults: { ease: "power3.out" },
          onReverseComplete: () => {
            dialog.current?.close();
            callback.current();
          },
        })
        .fromTo(
          ".profile-sheet",
          {
            y: reduced ? 0 : 90,
            rotationX: reduced ? 0 : 9,
            scale: reduced ? 1 : 0.88,
            opacity: 0,
          },
          {
            y: 0,
            rotationX: 0,
            scale: 1,
            opacity: 1,
            duration: reduced ? 0 : 0.55,
          },
        )
        .fromTo(
          ".profile-reveal-item",
          { y: reduced ? 0 : 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: reduced ? 0 : 0.065,
            duration: reduced ? 0 : 0.35,
          },
          reduced ? 0 : 0.15,
        );
    }, dialog);
    return () => {
      context.revert();
      timeline.current = null;
      document.body.style.overflow = old;
      priorFocus.current?.focus();
    };
  }, [player]);
  const close = () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.current?.close();
      callback.current();
    } else if (timeline.current) timeline.current.timeScale(1.6).reverse();
  };
  if (!player) return null;
  const bat = player.batting,
    bowl = player.bowling,
    image = playerImage(player);
  return (
    <dialog
      ref={dialog}
      className="profile-dialog"
      aria-labelledby="player-profile-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      <article className="profile-sheet">
        <header className="profile-toolbar">
          <span>GET TO KNOW YOUR PLAYER</span>
          <button onClick={close} aria-label="Close profile">
            ×
          </button>
        </header>
        <div className="profile-main">
          <AugeWarpSurface
            disabled={Boolean(document.querySelector(".cinematic-home"))}
            className="profile-visual"
          >
            <div className="profile-reveal-item">
              {image ? (
                <img
                  src={image}
                  alt={player.player_name}
                  width="420"
                  height="470"
                />
              ) : (
                <span
                  className="profile-plain-fallback"
                  aria-label="Portrait unavailable"
                >
                  {player.player_name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              )}
            </div>
          </AugeWarpSurface>
          <div className="profile-summary">
            <p className="eyebrow profile-reveal-item">
              {player.role}
              {player.is_rr ? " · RAJASTHAN ROYALS" : ""}
            </p>
            <h2 className="profile-reveal-item" id="player-profile-title">
              {player.player_name}
            </h2>
            <p className="profile-reveal-item">{describePlayer(player)}</p>
            <p className="profile-reveal-item">
              Explore their record. Decide where they fit in your team.
            </p>
            {onAddToWarRoom && (
              <CTA variant="secondary" onClick={() => onAddToWarRoom(player)}>
                {isInWarRoom ? "Added to your squad" : "Add to my squad"}
              </CTA>
            )}
          </div>
        </div>
        <details className="profile-evidence">
          <summary>See the performance evidence</summary>
          <div className="profile-metrics">
            <section>
              <h3>Batting</h3>
              <dl>
                {[
                  ["Recorded runs", bat?.total_runs],
                  ["Recorded balls", bat?.total_balls],
                  ["Overall strike rate", bat?.overall_sr],
                  [
                    "Pressure strike rate",
                    bat?.press_balls ? bat.press_sr : undefined,
                  ],
                  ["Pressure balls", bat?.press_balls],
                  [
                    "Strike-rate change",
                    bat?.press_balls ? bat.sr_delta : undefined,
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
                      {metric(
                        value as number,
                        typeof label === "string" && /runs|balls/.test(label)
                          ? 0
                          : 1,
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            <section>
              <h3>Bowling</h3>
              <dl>
                {[
                  ["Recorded wickets", bowl?.wickets],
                  ["Recorded balls", bowl?.total_balls],
                  [
                    "Overall economy",
                    bowl?.total_balls ? bowl.overall_econ : undefined,
                  ],
                  [
                    "Pressure economy",
                    bowl?.press_balls ? bowl.press_econ : undefined,
                  ],
                  ["Pressure balls", bowl?.press_balls],
                  [
                    "Economy improvement",
                    bowl?.press_balls ? bowl.econ_delta : undefined,
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
                      {metric(
                        value as number,
                        typeof label === "string" && /wickets|balls/.test(label)
                          ? 0
                          : 2,
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
          <p>
            Model pressure impact index:{" "}
            {metric(player.pressure_impact_index, 2)}. Pressure performance
            describes the stored pressure-delivery sample, not a separate
            death-over split. Statistical uncertainty and match-level confidence
            are not provided by this export. Canonical player ID:{" "}
            {player.player_id}.
          </p>
          {player.official_profile_url && (
            <a
              className="text-link"
              href={player.official_profile_url}
              target="_blank"
              rel="noreferrer"
            >
              Official IPL source ↗
            </a>
          )}
        </details>
      </article>
    </dialog>
  );
};
