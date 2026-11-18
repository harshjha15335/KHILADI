import React, { useEffect, useRef } from "react";
import { KhiladiLogo } from "./KhiladiLogo";
import { gsap } from "../utils/motion";
import "./bottom-dock.css";

const leftLinks = [["database","Players"],["rankings","Rankings"],["pressure-lab","Pressure"],["comparison","Compare"],["war-room","Auction"]] as const;
const rightLinks = [["data-explorer","Data"],["batting-intel","Batting"],["bowling-intel","Bowling"],["command-centre","Overview"],["methodology","Method"]] as const;

/** One always-available dock for all KHILADI screens. No hidden menu or off-site links. */
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scope = root.current;
    const left = Array.from(scope.querySelectorAll<HTMLElement>(".dock-link--left"));
    const right = Array.from(scope.querySelectorAll<HTMLElement>(".dock-link--right"));
    const logo = scope.querySelector<HTMLElement>(".dock-home");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    // Choreography requested: left of the logo is first, right is second.
    tl.fromTo(scope, { y: 54, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.78 }, 0)
      .fromTo(left, { x: -30, opacity: 0, filter: "blur(9px)" },
        { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.66, stagger: 0.075 }, 0.18)
      .fromTo(logo, { y: 16, scale: 0.65, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.68, ease: "back.out(1.4)" }, 0.55)
      .fromTo(right, { x: 30, opacity: 0, filter: "blur(9px)" },
        { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.66, stagger: 0.075 }, 0.80);
    return () => {
      tl.kill();
      gsap.set([scope, ...left, ...right, logo].filter(Boolean), { clearProps: "all" });
    };
  }, [introComplete]);

  const renderLink = (entry: readonly [string, string], side: "left" | "right") => {
    const [page, title] = entry;
    return (
      <a
        key={page}
        href={`#${page}`}
        className={`dock-link dock-link--${side}`}
        aria-current={currentPage === page ? "page" : undefined}
        data-active={currentPage === page}
        title={title}
        onClick={(event) => {
          event.preventDefault();
          onNavigate(page);
        }}
      >
        <span>{title}</span>
      </a>
    );
  };
  return (
    <nav ref={root} className="khiladi-bottom-dock" aria-label="Primary navigation">
      <div className="dock-ambient" aria-hidden="true" />
      <div className="dock-group dock-group--left" aria-label="Player tools">
        {leftLinks.map((entry) => renderLink(entry, "left"))}
      </div>
      <a
        className="dock-home"
        href="#home"
        aria-label="KHILADI — Home"
        aria-current={currentPage === "home" ? "page" : undefined}
        onClick={(event) => {
          event.preventDefault();
          onNavigate("home");
        }}
      >
        <KhiladiLogo />
        <span className="dock-brand-name">KHILADI</span>
      </a>
      <div className="dock-group dock-group--right" aria-label="Analysis tools">
        {rightLinks.map((entry) => renderLink(entry, "right"))}
      </div>
    </nav>
  );
};
