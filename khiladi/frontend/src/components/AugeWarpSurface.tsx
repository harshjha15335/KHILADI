import React, { useEffect, useId, useRef } from "react";
interface Props {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  disabled?: boolean;
}
export const AugeWarpSurface: React.FC<Props> = ({
  children,
  className = "",
  intensity = 1,
  disabled = false,
}) => {
  const root = useRef<HTMLDivElement>(null),
    displacement = useRef<SVGFEDisplacementMapElement>(null),
    frame = useRef(0),
    id = "warp-" + useId().replace(/:/g, "");
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const reset = () => {
    cancelAnimationFrame(frame.current);
    if (displacement.current) displacement.current.setAttribute("scale", "0");
    root.current
      ?.querySelectorAll("img")
      .forEach((img) => (img.style.filter = ""));
  };
  return (
    <div
      ref={root}
      className={`warp-surface ${className}`}
      onPointerMove={(event) => {
        if (
          disabled ||
          event.pointerType === "touch" ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const rect = event.currentTarget.getBoundingClientRect(),
          x = (event.clientX - rect.left) / rect.width;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          displacement.current?.setAttribute(
            "scale",
            String((Math.sin(x * Math.PI) * 14 + 2) * intensity),
          );
          root.current
            ?.querySelectorAll("img")
            .forEach((img) => (img.style.filter = `url(#${id})`));
        });
      }}
      onPointerLeave={reset}
    >
      {!disabled && (
        <svg className="warp-filter-defs" aria-hidden="true">
          <defs>
            <filter
              id={id}
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency=".013 .035"
                numOctaves="1"
                seed="8"
                result="noise"
              />
              <feDisplacementMap
                ref={displacement}
                in="SourceGraphic"
                in2="noise"
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
