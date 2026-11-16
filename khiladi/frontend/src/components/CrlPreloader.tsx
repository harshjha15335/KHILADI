import { KhiladiLogo } from "./KhiladiLogo";
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
    complete.current();
  }, []);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
        { yPercent: 108, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.045 },
        0.12,
      )
        .fromTo(
          ".intro-type",
          { gap: "7vw" },
          { gap: "0.04em", duration: 0.7 },
          0.85,
        )
        .to(
          ".intro-type",
          { rotationX: -30, rotationZ: -8, duration: 0.5 },
          1.55,
        )
        .to(
          ".intro-type",
          {
            scale: 20,
            rotationX: 0,
            rotationZ: -15,
            duration: 1.05,
            ease: "expo.in",
          },
          2.05,
        )
        .to(".intro-symbol", { opacity: 0, duration: 0.2 }, 1.8)
        .to(
          ".intro-curtain",
          { yPercent: -100, duration: 0.8, ease: "power4.inOut" },
          2.65,
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
        <div className="intro-symbol" aria-hidden="true">
          <KhiladiLogo variant="loader" />
        </div>
        <div className="intro-type intro-type--letters" aria-hidden="true">
          {[..."KHILADI"].map((letter, i) => (
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
