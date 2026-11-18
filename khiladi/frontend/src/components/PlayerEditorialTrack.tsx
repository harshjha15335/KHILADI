import React, { useRef, useState } from "react";
import { Player } from "../types";
import { playerImage } from "../utils/media";
import { gsap, useGSAP } from "../utils/motion";
import { AugeWarpSurface } from "./AugeWarpSurface";
/** A failed source must never leave a broken-image icon or imply another player's identity. */
function EditorialPlayerPortrait({ player }: { player: Player }) {
  const [failed, setFailed] = useState(false);
  const image = playerImage(player);
  if (!image || failed) {
    return (
      <div
        role="img"
        aria-label={`Official IPL portrait unavailable for ${player.player_name}`}
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F0E8FF] via-[#E8F1FF] to-[#FFE5F0] text-[#2450B8]"
      >
        <span className="text-6xl font-bold tracking-[-.08em] opacity-80" aria-hidden="true">
          {player.player_name.split(/\\s+/).slice(0, 2).map((part) => part[0]).join("")}
        </span>
      </div>
    );
  }
  return (
    <img
      src={image}
      alt=""
      width="260"
      height="310"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
export const PlayerEditorialTrack: React.FC<{
  players: Player[];
  onSelectPlayer: (p: Player) => void;
}> = ({ players, onSelectPlayer }) => {
  const root = useRef<HTMLElement>(null),
    track = useRef<HTMLDivElement>(null);
  const portraits = players.filter((p) => playerImage(p)).slice(0, 6);
  useGSAP(
    () => {
      if (!track.current || portraits.length < 2) return;
      const media = gsap.matchMedia();
      media.add(
        "(pointer:fine) and (prefers-reduced-motion:no-preference)",
        () => {
          const tween = gsap.to(track.current, {
            xPercent: -50,
            duration: portraits.length * 9,
            repeat: -1,
            ease: "none",
          });
          const element = root.current!;
          let visible = true;
          const pause = () => tween.pause();
          const resume = () => {
            if (visible && !element.contains(document.activeElement))
              tween.resume();
          };
          const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            visible ? resume() : pause();
          });
          observer.observe(element);
          element.addEventListener("focusin", pause);
          element.addEventListener("focusout", resume);
          return () => {
            observer.disconnect();
            element.removeEventListener("focusin", pause);
            element.removeEventListener("focusout", resume);
          };
        },
      );
      return () => media.revert();
    },
    { scope: root, dependencies: [portraits.length], revertOnUpdate: true },
  );
  if (portraits.length < 2) return null;
  return (
    <section
      ref={root}
      className="editorial-player-track"
      aria-label="Players in focus"
    >
      <div className="editorial-track-heading">
        <p className="eyebrow">PLAYERS IN FOCUS</p>
        <p>Different games. Shared ambition.</p>
      </div>
      <div className="editorial-track-viewport">
        <div ref={track} className="editorial-track-moving">
          {[0, 1].map((copy) => (
            <div
              className="editorial-track-group"
              key={copy}
              aria-hidden={copy ? true : undefined}
            >
              {portraits.map((player, i) => (
                <button
                  key={player.player_id}
                  className={`editorial-player editorial-player--${i % 3}`}
                  tabIndex={copy ? -1 : 0}
                  data-player-id={player.player_id}
                  data-cursor-label="View player"
                  onClick={() => onSelectPlayer(player)}
                >
                  <AugeWarpSurface>
                    <EditorialPlayerPortrait player={player} />
                  </AugeWarpSurface>
                  <span>{player.player_name} ↗</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
