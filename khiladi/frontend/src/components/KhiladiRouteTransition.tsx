import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "../utils/motion";
import { KhiladiLogo } from "./KhiladiLogo";
import "./route-transition.css";

export type NavigationSide = "left" | "right";

interface Props {
  side: NavigationSide;
  destination: string;
  onSwitch: () => void;
  onFinish: () => void;
}

/**
 * Two distinct, navigation-only transitions. Every clip-path keyframe uses
 * exactly FOUR polygon vertices, in a stable order. The previous version
 * morphed inset() -> polygon() and 3-point -> 4-point polygons; browsers
 * cannot interpolate those shapes, causing the jump captured by the user.
 *
 * Route content changes only when the overlay fully covers the viewport.
 * The original first-visit typography loader is not touched.
 */
const LEFT_START = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";
const RIGHT_START = "polygon(50% 8%, 50% 8%, 50% 8%, 50% 8%)";
const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const FULL_TRIANGLE =
  "polygon(50% -175%, -250% 210%, 350% 210%, 350% 210%)";
const LEFT_EXIT_TRIANGLE =
  "polygon(50% -135%, 220% 180%, 220% 180%, -120% 180%)";
const END = "polygon(50% 110%, 50% 110%, 50% 110%, 50% 110%)";

export function KhiladiRouteTransition({
  side, destination, onSwitch, onFinish,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onSwitch, onFinish });
  callbacks.current = { onSwitch, onFinish };

  // Layout effect + inline first-frame clip eliminate the otherwise visible
  // full-screen paint before GSAP's first requestAnimationFrame.
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.dataset.phase = "entering";
    let switched = false;
    let paintFrame = 0;
    let settledFrame = 0;
    const switchWhenCovered = () => {
      if (switched) return;
      switched = true;
      element.dataset.phase = "covered";
      // Keep the overlay completely opaque while React mounts the next route
      // and the canvas paints. Resuming after two paint opportunities avoids
      // the one-frame hitch when the old overlay used to withdraw mid-render.
      timeline.pause();
      callbacks.current.onSwitch();
      paintFrame = requestAnimationFrame(() => {
        settledFrame = requestAnimationFrame(() => {
          if (element.isConnected) timeline.resume();
        });
      });
    };
    const complete = () => {
      element.dataset.phase = "finished";
      document.body.style.overflow = priorOverflow;
      callbacks.current.onFinish();
    };

    const centre = element.querySelector<HTMLElement>(
      ".kh-route-transition__centre",
    );
    const rightMark = element.querySelector<HTMLElement>(
      ".kh-route-transition__right-mark",
    );
    const timeline = gsap.timeline({ onComplete: complete });

    if (side === "left") {
      // Recording 1: directional entrance -> dark interstitial + insignia
      // -> hold at complete coverage -> smooth triangular withdrawal.
      timeline
        .fromTo(element, { clipPath: LEFT_START }, {
          clipPath: FULL, duration: 0.42, ease: "power3.inOut",
        }, 0)
        .fromTo(centre, {
          autoAlpha: 0, y: 14, scale: 0.86,
        }, {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 0.34, ease: "power3.out",
        }, 0.28)
        .call(switchWhenCovered, [], 0.67)
        .to(centre, {
          autoAlpha: 0, scale: 0.96, duration: 0.22,
          ease: "power2.in",
        }, 0.75)
        .to(element, {
          clipPath: LEFT_EXIT_TRIANGLE, duration: 0.21,
          ease: "power1.inOut",
        }, 0.97)
        .to(element, {
          clipPath: END, duration: 0.52,
          ease: "power3.inOut",
        }, 1.18);
    } else {
      // Recording 2: pointed pink triangle expands until FULL SCREEN;
      // route switches behind its cover, then the SAME four vertices
      // withdraw. Never insert a different polygon mid-animation.
      timeline
        .fromTo(element, { clipPath: RIGHT_START }, {
          clipPath: FULL_TRIANGLE, duration: 0.52,
          ease: "power3.inOut",
        }, 0)
        .fromTo(rightMark, {
          autoAlpha: 0, y: 18, scale: 0.9,
        }, {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 0.32, ease: "power2.out",
        }, 0.19)
        .call(switchWhenCovered, [], 0.61)
        .to(rightMark, {
          autoAlpha: 0, y: -16, duration: 0.2,
          ease: "power2.in",
        }, 0.69)
        .to(element, {
          clipPath: END, duration: 0.66,
          ease: "power3.inOut",
        }, 0.90);
    }

    return () => {
      cancelAnimationFrame(paintFrame);
      cancelAnimationFrame(settledFrame);
      timeline.kill();
      document.body.style.overflow = priorOverflow;
    };
  }, [side]);

  return <div
    ref={root}
    style={{ clipPath: side === "left" ? LEFT_START : RIGHT_START }}
    className={`kh-route-transition kh-route-transition--${side}`}
    data-testid="khiladi-route-transition"
    data-transition-mode={side}
    data-phase="initial"
    role="status"
    aria-live="polite"
    aria-label={`Opening ${destination}`}
  >
    {side === "left" ?
      <div className="kh-route-transition__centre">
        <KhiladiLogo />
        <span className="kh-route-transition__strapline">THE NEXT CHAPTER</span>
        <strong>{destination}</strong>
      </div> :
      <div className="kh-route-transition__right-mark" aria-hidden="true">
        <span>KHILADI</span>
        <strong>{destination}</strong>
      </div>}
  </div>;
}
