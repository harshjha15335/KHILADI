import React, { useCallback, useEffect, useRef } from "react";
import { KhiladiLogo } from "./KhiladiLogo";
import { KhiladiParticleWordmark } from "./KhiladiParticleWordmark";
import { gsap, useGSAP } from "../utils/motion";
import "./intro-sequence.css";

export const CrlPreloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const root = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const callback = useRef(onComplete);
  callback.current = onComplete;
  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    callback.current();
  }, []);
  useGSAP(() => {
    const previous = document.body.style.overflow;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    document.body.style.overflow = "hidden";
    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(".intro-glyph--left",
      { yPercent: 120, opacity: 0, filter: "blur(12px)" },
      { yPercent: 0, opacity: 1, filter: "blur(0px)", stagger: .065, duration: .58, ease: "power4.out" }, 1.0)
      .fromTo(".intro-symbol",
        { opacity: 0, scale: .5, rotation: -12 },
        { opacity: 1, scale: 1, rotation: 0, duration: .62, ease: "power4.out" }, 1.43)
      .fromTo(".intro-glyph--right",
        { yPercent: 120, opacity: 0, filter: "blur(12px)" },
        { yPercent: 0, opacity: 1, filter: "blur(0px)", stagger: .065, duration: .6, ease: "power4.out" }, 1.72)
      .fromTo(".intro-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: .6, ease: "power3.out" }, 1.9)
      .to(".intro-words", { scale: 1.12, opacity: 0, duration: .65, ease: "power3.in" }, 2.57)
      .to(".intro-symbol", { scale: 5, opacity: 0, duration: .7, ease: "power3.in" }, 2.65)
      // Restore the approved original startup handoff. The two triangle
      // effects belong to navbar navigation, not the first page load.
      .to(".intro-curtain", { yPercent: -101, duration: .76, ease: "power4.inOut" }, 2.93);
    return () => { tl.kill(); document.body.style.overflow = previous; };
  }, { scope: root });
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [finish]);
  return (
    <div ref={root} className="intro-root khiladi-intro" role="status" aria-label="Introducing Khiladi">
      <div className="intro-curtain">
        <div className="intro-meta">
          <span>MADE FOR THE MOMENT.</span>
          <span>KHILADI / CRICKET INTELLIGENCE</span>
        </div>
        <div className="intro-words" aria-hidden="true">
          <KhiladiParticleWordmark />
          <span className="intro-side intro-side--left">
            {[..."KHILA"].map((char,i)=><span className="intro-window" key={i}><span className="intro-glyph intro-glyph--left">{char}</span></span>)}
          </span>
          <span className="intro-symbol"><KhiladiLogo variant="loader" tone="original" /></span>
          <span className="intro-side intro-side--right">
            {[..."DI"].map((char,i)=><span className="intro-window" key={i}><span className="intro-glyph intro-glyph--right">{char}</span></span>)}
          </span>
        </div>
        <span className="intro-rule" aria-hidden="true" />
        <button type="button" className="intro-skip" onClick={finish}>Skip intro ↗</button>
        <span className="intro-foot">YOUR TEAM. YOUR MOMENT.</span>
      </div>
    </div>
  );
};
