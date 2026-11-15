import React, { useCallback, useEffect, useRef } from "react";
import { gsap, useGSAP } from "../utils/motion";
export const CrlPreloader: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const root = useRef<HTMLDivElement>(null),
    finished = useRef(false),
    complete = useRef(onComplete);
  complete.current = onComplete;
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem("khiladi_intro_seen", "true");
    } catch {
      /* storage optional */
    }
    complete.current();
  }, []);
  useGSAP(
    () => {
      let seen = false;
      try {
        seen = sessionStorage.getItem("khiladi_intro_seen") === "true";
      } catch {
        /* storage optional */
      }
      if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }
      const old = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: finish,
      });
      tl.fromTo(
        ".intro-glyph",
        { yPercent: 105 },
        { yPercent: 0, duration: 0.75, stagger: 0.09 },
        0.12,
      )
        .to(
          ".intro-glyph",
          {
            x: (i: number) => (3 - i) * 8,
            rotation: (i: number) => (3 - i) * -3,
            duration: 0.65,
          },
          1.05,
        )
        .to(
          ".intro-type",
          { scale: 16, rotation: -12, duration: 1.15, ease: "expo.in" },
          1.55,
        )
        .to(
          ".intro-curtain",
          { yPercent: -100, duration: 0.8, ease: "power4.inOut" },
          2.2,
        );
      return () => {
        tl.kill();
        document.body.style.overflow = old;
      };
    },
    { scope: root },
  );
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [finish]);
  return (
    <div
      ref={root}
      className="intro-root"
      role="status"
      aria-label="Introducing KHILADI"
    >
      <div className="intro-curtain">
        <div className="intro-meta">
          <span>A GAME OF MOMENTS</span>
          <span>KHILADI / RAJASTHAN</span>
        </div>
        <div className="intro-type" aria-hidden="true">
          {"KHILADI".split("").map((letter, i) => (
            <span className="intro-window" key={i}>
              <span className="intro-glyph">{letter}</span>
            </span>
          ))}
        </div>
        <button className="intro-skip" onClick={finish}>
          Skip introduction ↗
        </button>
        <span className="intro-foot">GREAT PLAYERS. BIG MOMENTS.</span>
      </div>
    </div>
  );
};
