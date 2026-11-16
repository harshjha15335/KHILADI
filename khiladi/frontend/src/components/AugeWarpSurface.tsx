import React, { useEffect, useRef } from "react";
interface Props {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  disabled?: boolean;
}
// The recordings establish local image translation and edge movement, not a noise shader.
export const AugeWarpSurface: React.FC<Props> = ({
  children,
  className = "",
  intensity = 1,
  disabled = false,
}) => {
  const root = useRef<HTMLDivElement>(null),
    frame = useRef(0);
  const reset = () => {
    cancelAnimationFrame(frame.current);
    root.current?.querySelectorAll("img").forEach((img) => {
      img.style.transform = "";
    });
  };
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", reset);
    return () => {
      cancelAnimationFrame(frame.current);
      preference.removeEventListener("change", reset);
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
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          root.current?.querySelectorAll("img").forEach((img) => {
            img.style.transform = `translate3d(${x * 18 * intensity}px,${y * 12 * intensity}px,0) skewY(${x * 1.8 * intensity}deg) scale(1.035)`;
          });
        });
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </div>
  );
};
