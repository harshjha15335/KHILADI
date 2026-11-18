import React, { useEffect, useRef } from "react";
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

/** Navigation-only transitions reconstructed from the supplied Delta Cafés videos.
 * Left: dark interstitial / centred insignia / collapsing triangular reveal.
 * Right: quick pointed triangular wipe from the centre of the navigation.
 * The startup preloader is a separate, unchanged experience.
 */
export function KhiladiRouteTransition({
  side, destination, onSwitch, onFinish,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onSwitch, onFinish });
  callbacks.current = { onSwitch, onFinish };

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let swapped = false;
    const switchOnce = () => {
      if (swapped) return;
      swapped = true;
      callbacks.current.onSwitch();
    };
    const tl = gsap.timeline({
      onComplete: () => callbacks.current.onFinish(),
    });
    if (side === "left") {
      // Recording 200021: a full dark card interrupts the current scene,
      // a restrained logo settles, then a very large triangular aperture
      // opens to the next scene.
      tl.fromTo(element, {
        clipPath: "inset(0 100% 0 0)",
      }, {
        clipPath: "inset(0 0% 0 0)",
        duration: .38, ease: "power3.inOut",
      }, 0)
        .fromTo(".kh-route-transition__centre", {
          autoAlpha: 0, scale: .8, y: 12,
        }, {
          autoAlpha: 1, scale: 1, y: 0, duration: .31, ease: "power3.out",
        }, .25)
        .call(switchOnce, [], .74)
        .to(".kh-route-transition__centre", {
          autoAlpha: 0, scale: .91, duration: .2, ease: "power2.in",
        }, .79)
        .to(element, {
          clipPath: "polygon(50% -25%, 170% 130%, 50% 130%, -70% 130%)",
          duration: .37, ease: "power2.inOut",
        }, .89)
        .to(element, {
          clipPath: "polygon(50% 105%, 50% 105%, 50% 105%, 50% 105%)",
          duration: .48, ease: "power3.inOut",
        }, 1.24);
    } else {
      // Recording 200050: the next page is introduced immediately through
      // a growing triangle from the centred nav, with no dark logo pause.
      tl.fromTo(element, {
        clipPath: "polygon(50% 8%, 50% 8%, 50% 8%)",
      }, {
        clipPath: "polygon(-100% 180%, 50% -130%, 200% 180%)",
        duration: .5, ease: "power3.inOut",
      }, 0)
        .fromTo(".kh-route-transition__right-mark", {
          autoAlpha: 0, y: 20, scale: .78,
        }, {
          autoAlpha: 1, y: 0, scale: 1,
          duration: .26, ease: "power2.out",
        }, .19)
        .call(switchOnce, [], .51)
        .to(element, {
          clipPath: "polygon(-100% -100%, 200% -100%, 200% 200%, -100% 200%)",
          duration: .13,
        }, .51)
        .to(".kh-route-transition__right-mark", {
          autoAlpha: 0, y: -24, duration: .17,
        }, .58)
        .to(element, {
          clipPath: "polygon(50% 110%, 50% 110%, 50% 110%)",
          duration: .58, ease: "power3.inOut",
        }, .75);
    }
    return () => {
      tl.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, [side]);

  return <div ref={root} className={`kh-route-transition kh-route-transition--${side}`}
    data-testid="khiladi-route-transition" data-transition-mode={side}
    role="status" aria-live="polite" aria-label={`Opening ${destination}`}>
    {side === "left" ?
      <div className="kh-route-transition__centre">
        <KhiladiLogo />
        <span className="kh-route-transition__strapline">THE NEXT CHAPTER</span>
        <strong>{destination}</strong>
      </div>
      : <div className="kh-route-transition__right-mark" aria-hidden="true">
          <span>KHILADI</span>
          <strong>{destination}</strong>
        </div>}
  </div>;
}
