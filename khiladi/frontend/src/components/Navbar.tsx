import React, { useEffect, useRef } from "react";
import { KhiladiLogo } from "./KhiladiLogo";
import { gsap } from "../utils/motion";
import "./bottom-dock.css";

const leftLinks = [["database","Players"],["rankings","Rankings"],["pressure-lab","Pressure"],["comparison","Compare"],["war-room","Squad"]] as const;
const rightLinks = [["data-explorer","Data"],["batting-intel","Batting"],["bowling-intel","Bowling"],["command-centre","Overview"],["methodology","Method"]] as const;

export const Navbar: React.FC<{
  currentPage: string;
  onNavigate: (page: string) => void;
  rrPurseCr?: number;
  introComplete?: boolean;
}> = ({ currentPage, onNavigate, introComplete = true }) => {
  const root = useRef<HTMLElement>(null);
  const hasPlayed = useRef(false);
  useEffect(() => {
    if (!introComplete || !root.current || hasPlayed.current) return;
    hasPlayed.current = true;
    const scope = root.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const left = scope.querySelectorAll<HTMLElement>(".dock-link--left");
    const right = scope.querySelectorAll<HTMLElement>(".dock-link--right");
    const centre = scope.querySelector(".dock-home");
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline
      .fromTo(scope, { autoAlpha: 0, y: -20, scale: .985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: .55 }, 0)
      .fromTo(left, { autoAlpha: 0, y: -24, x: -16, filter: "blur(8px)" },
        { autoAlpha: 1, y: 0, x: 0, filter: "blur(0px)", duration: .55, stagger: .09 }, .15)
      .fromTo(centre, { autoAlpha: 0, y: -18, scale: .75 },
        { autoAlpha: 1, y: 0, scale: 1, duration: .6, ease: "power4.out" }, .55)
      .fromTo(right, { autoAlpha: 0, y: -24, x: 16, filter: "blur(8px)" },
        { autoAlpha: 1, y: 0, x: 0, filter: "blur(0px)", duration: .55, stagger: .09 }, .85);
    return () => { timeline.kill(); gsap.set([scope, ...Array.from(left), ...Array.from(right), centre].filter(Boolean), { clearProps: "all" }); };
  }, [introComplete]);
  function renderLink(entry: readonly [string, string], side: "left" | "right") {
    const [page, label] = entry;
    return <a key={page} href={`#${page}`}
      className={`dock-link dock-link--${side}`}
      title={label} aria-label={label}
      aria-current={currentPage === page ? "page" : undefined}
      data-active={currentPage === page}
      onClick={e => { e.preventDefault(); onNavigate(page); }}>
      <span>{label}</span>
    </a>;
  }
  return <nav ref={root} className="khiladi-top-nav" aria-label="Primary navigation">
    <div className="dock-ambient" aria-hidden="true" />
    <div className="dock-group dock-group--left">{leftLinks.map(item => renderLink(item, "left"))}</div>
    <a href="#home" className="dock-home" aria-label="KHILADI — Home"
      aria-current={currentPage === "home" ? "page" : undefined}
      onClick={e => { e.preventDefault(); onNavigate("home"); }}>
      <KhiladiLogo />
      <span className="dock-brand-name">KHILADI</span>
    </a>
    <div className="dock-group dock-group--right">{rightLinks.map(item => renderLink(item, "right"))}</div>
  </nav>;
};
