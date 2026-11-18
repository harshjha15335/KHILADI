import React, { useEffect, useId, useRef } from "react";
interface Props {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  disabled?: boolean;
}
// Localized pointer displacement is an original SVG implementation, not AUGE's proprietary shader.
const mask = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><defs><radialGradient id="m"><stop stop-color="white" stop-opacity="1"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs><rect width="256" height="256" fill="url(#m)"/></svg>')}`;
export const AugeWarpSurface: React.FC<Props> = ({
  children,
  className = "",
  intensity = 1,
  disabled = false,
}) => {
  const root = useRef<HTMLDivElement>(null),
    displacement = useRef<SVGFEDisplacementMapElement>(null),
    focus = useRef<SVGFEImageElement>(null);
  const frame = useRef(0),
    current = useRef({ x: 0, y: 0, strength: 0 }),
    target = useRef({ x: 0, y: 0, strength: 0 });
  const last = useRef({ x: 0, y: 0, time: 0 });
  const id = "khiladi-warp-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const images = () => root.current?.querySelectorAll("img");
  const tick = () => {
    const value = current.current,
      goal = target.current;
    value.x += (goal.x - value.x) * 0.2;
    value.y += (goal.y - value.y) * 0.2;
    value.strength += (goal.strength - value.strength) * 0.2;
    displacement.current?.setAttribute("scale", String(value.strength));
    focus.current?.setAttribute("x", String(value.x));
    focus.current?.setAttribute("y", String(value.y));
    const moving =
      Math.abs(goal.x - value.x) +
        Math.abs(goal.y - value.y) +
        Math.abs(goal.strength - value.strength) >
      0.05;
    if (moving) frame.current = requestAnimationFrame(tick);
    else {
      frame.current = 0;
      if (goal.strength === 0)
        images()?.forEach((image) => {
          image.style.filter = "";
        });
    }
  };
  const reset = () => {
    target.current.strength = 0;
    images()?.forEach((image) => {
      image.style.transform = "";
    });
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  };
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion:reduce)");
    const stop = () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      current.current.strength = target.current.strength = 0;
      displacement.current?.setAttribute("scale", "0");
      images()?.forEach((image) => {
        image.style.filter = "";
        image.style.transform = "";
      });
    };
    preference.addEventListener("change", stop);
    return () => {
      cancelAnimationFrame(frame.current);
      preference.removeEventListener("change", stop);
    };
  }, []);
  return (
    <div
      ref={root}
      className={`warp-surface ${className}`}
      data-cursor-label={disabled ? undefined : "Explore player"}
      onPointerMove={(event) => {
        if (
          disabled ||
          event.pointerType !== "mouse" ||
          !matchMedia(
            "(pointer:fine) and (prefers-reduced-motion:no-preference)",
          ).matches
        )
          return;
        const bounds = event.currentTarget.getBoundingClientRect(),
          x = event.clientX - bounds.left,
          y = event.clientY - bounds.top;
        const now = performance.now(),
          previous = last.current;
        const velocity = previous.time
          ? Math.hypot(event.clientX - previous.x, event.clientY - previous.y) /
            Math.max(8, now - previous.time)
          : 0;
        last.current = { x: event.clientX, y: event.clientY, time: now };
        target.current = {
          x: x - bounds.width / 2,
          y: y - bounds.height / 2,
          strength: Math.min(22, 12 + velocity * 4) * intensity,
        };
        images()?.forEach((image) => {
          image.style.filter = `url(#${id})`;
          image.style.transform = `translate3d(${(x / bounds.width - 0.5) * 10}px,${(y / bounds.height - 0.5) * 8}px,0) scale(1.035)`;
        });
        if (!frame.current) frame.current = requestAnimationFrame(tick);
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {!disabled && (
        <svg className="warp-filter-defs" aria-hidden="true">
          <defs>
            <filter
              id={id}
              x="-12%"
              y="-12%"
              width="124%"
              height="124%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency=".009 .014"
                numOctaves="1"
                seed="8"
                result="field"
              />
              <feImage
                ref={focus}
                href={mask}
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                result="focus"
              />
              <feComposite
                in="field"
                in2="focus"
                operator="in"
                result="localized"
              />
              <feFlood floodColor="rgb(128,128,128)" result="neutral" />
              <feComposite
                in="localized"
                in2="neutral"
                operator="over"
                result="map"
              />
              <feDisplacementMap
                ref={displacement}
                in="SourceGraphic"
                in2="map"
                scale="0"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}
      {children}
    </div>
  );
};
