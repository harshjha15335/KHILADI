import React, { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import "./iridescent-button.css";

export type IridescentActionButtonProps = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode | false;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

/** An independently animated, pointer-lit glass capsule; no WebGL needed.
 *  The text and action remain semantic and stable while optical layers move.
 */
export function IridescentActionButton({
  children, onClick, href, variant = "primary", size = "md",
  icon, disabled = false, loading = false, type = "button",
  className = "", target, rel, "aria-label": ariaLabel,
}: IridescentActionButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const move = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled || loading || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--gl-x", `${((event.clientX - bounds.left) / bounds.width * 100).toFixed(1)}%`);
    event.currentTarget.style.setProperty("--gl-y", `${((event.clientY - bounds.top) / bounds.height * 100).toFixed(1)}%`);
  };
  const leave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--gl-x", "50%");
    event.currentTarget.style.setProperty("--gl-y", "50%");
  };
  const content = <>
    <span className="iridescent-glass__aurora" aria-hidden="true" />
    <span className="iridescent-glass__rim" aria-hidden="true" />
    <span className="iridescent-glass__gleam" aria-hidden="true" />
    <span className="iridescent-glass__label">
      {loading ? <span className="iridescent-glass__spinner" role="status" aria-label="Loading" /> :
        icon === false ? null : <span aria-hidden="true" className="iridescent-glass__icon">{icon ?? <ArrowUpRight size={18} strokeWidth={2} />}</span>}
      <span>{children}</span>
    </span>
  </>;
  const cls = `iridescent-glass iridescent-glass--${variant} iridescent-glass--${size} ${className}`;
  const shared = { className: cls, onPointerMove: move, onPointerLeave: leave, "aria-label": ariaLabel };
  if (href) return (
    <a {...shared}
      ref={node => { ref.current = node; }}
      href={disabled || loading ? undefined : href}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      target={target} rel={rel}
      onClick={event => { if (disabled || loading) { event.preventDefault(); return; } onClick?.(event); }}>
      {content}
    </a>
  );
  return <button {...shared}
    ref={node => { ref.current = node; }}
    type={type} disabled={disabled || loading} aria-busy={loading || undefined}
    onClick={event => onClick?.(event)}>{content}</button>;
}
