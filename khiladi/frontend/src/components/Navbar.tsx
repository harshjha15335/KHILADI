import React, { useEffect, useRef } from "react";
import { KhiladiLogo } from "./KhiladiLogo";
import { gsap } from "../utils/motion";
import "./bottom-dock.css";
import { createTopDockController } from "../vendor/threeui/topDockController";

const leftLinks = [["database","Players"],["rankings","Rankings"],["pressure-lab","Pressure"],["comparison","Compare"],["war-room","Squad"]] as const;
const rightLinks = [["data-explorer","Data"],["batting-intel","Batting"],["bowling-intel","Bowling"],["command-centre","Overview"],["methodology","Method"]] as const;

export const Navbar: React.FC<{
  currentPage: string;
  onNavigate: (page: string, side?: "left" | "right") => void;
  rrPurseCr?: number;
  introComplete?: boolean;
}> = ({ currentPage, onNavigate, introComplete = true }) => {
  const root = useRef<HTMLElement>(null);
  const hasPlayed = useRef(false);
  useEffect(() => {
    if (!introComplete) { hasPlayed.current=false; return; }
    if (!root.current || hasPlayed.current) return;
    hasPlayed.current = true;
    const scope = root.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const left = scope.querySelectorAll<HTMLElement>(".dock-link--left");
    const right = scope.querySelectorAll<HTMLElement>(".dock-link--right");
    const centre = scope.querySelector(".dock-home");
    scope.dataset.introMotion = "entering";
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete:()=>{scope.dataset.introMotion="ready";} });
    timeline
      .fromTo(scope, { autoAlpha: 0, y: -20, scale: .985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: .55 }, 0)
      .fromTo(left, { autoAlpha: 0, y: -18, x: -45 },
        { autoAlpha: 1, y: 0, x: 0, duration: .72, stagger: .085 }, .14)
      .fromTo(centre, { autoAlpha: 0, y: -26, scale: .72 },
        { autoAlpha: 1, y: 0, scale: 1, duration: .65, ease: "back.out(1.55)" }, .52)
      .fromTo(right, { autoAlpha: 0, y: 16, x: 36, scale: .9 },
        { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: .66, stagger: .08, ease:"back.out(1.25)" }, .78);
    return () => { timeline.kill(); if(scope.dataset.introMotion!=="ready")scope.dataset.introMotion="idle"; gsap.set([scope, ...Array.from(left), ...Array.from(right), centre].filter(Boolean), { clearProps: "all" }); };
  }, [introComplete]);
  useEffect(() => {
    if (!introComplete) return;
    // Do not initialise the pointer/magnetic spring controller in the same
    // frame as the closing startup curtain and navbar entrance. The normal
    // CSS hover/focus states remain available throughout this short delay.
    let dispose: (() => void) | undefined;
    const id = window.setTimeout(() => {
      if (!root.current) return;
      dispose = createTopDockController(root.current, () => ({
        proximity: 122, spring: .19, damping: .70, widthGrowth: 0,
        heightGrowth: 0, drop: -5.2, distribute: false,
      }));
    }, 950);
    return () => { window.clearTimeout(id); dispose?.(); };
  }, [introComplete]);
  function renderLink(entry: readonly [string, string], side: "left" | "right") {
    const [page, label] = entry;
    return <a key={page} data-dock-item href={`#${page}`}
      className={`dock-link dock-link--${side}`} data-nav-motion={side === "left" ? "sweep" : "ripple"}
      title={label} aria-label={label}
      aria-current={currentPage === page ? "page" : undefined}
      data-active={currentPage === page}
      onClick={e => { e.preventDefault(); onNavigate(page, side); }}>
      <span className="dock-link__label">{label}</span>
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
