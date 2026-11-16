import React, { useRef, useState } from "react";
import { approvedMoments } from "../utils/media";
import { gsap, useGSAP } from "../utils/motion";
import { CinematicVideo } from "./CinematicVideo";
export const RoyalsMoments: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useGSAP(
    () => {
      if (!root.current || !approvedMoments.length) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion:no-preference)", () => {
        gsap.to(root.current, {
          "--moment-progress": 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) =>
              setActive(
                Math.min(
                  approvedMoments.length - 1,
                  Math.floor(self.progress * approvedMoments.length),
                ),
              ),
          },
        });
      });
      return () => media.revert();
    },
    { scope: root },
  );
  // A missing media package does not become another decorative or empty section.
  if (!approvedMoments.length) return null;
  return (
    <section
      ref={root}
      className="royals-moments"
      data-brand-tone="white"
      data-header-brand="compact"
      aria-labelledby="moments-heading"
    >
      <div className="royals-moments-stage">
        <CinematicVideo
          clips={approvedMoments}
          activeIndex={active}
          className="moments-films"
        />
        <div className="moments-caption">
          <p className="eyebrow">RAJASTHAN ROYALS MOMENTS</p>
          <h2 id="moments-heading">
            The game.
            <br />
            <em>The feeling.</em>
          </h2>
          <p>{approvedMoments[active].caption}</p>
        </div>
        <div className="moment-selectors" aria-label="Choose a match moment">
          {approvedMoments.map((clip, i) => (
            <button
              key={clip.src}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              {String(i + 1).padStart(2, "0")}
              <span className="sr-only"> {clip.caption}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
