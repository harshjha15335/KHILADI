import React from "react";
import { ArrowUpRight } from "lucide-react";
import { IridescentActionButton } from "./IridescentActionButton";
interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "gold" | "outline";
  size?: "sm" | "md" | "lg";
  showArrow?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}
export const KhiladiAnimatedButton: React.FC<Props> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  showArrow = true,
  className = "",
  type = "button",
  disabled,
}) => variant === "primary" ? (
  <IridescentActionButton onClick={onClick} disabled={disabled} type={type}
    size={size} className={`chapter-button chapter-button--primary ${className}`} icon={showArrow ? undefined : false}>
    {children}
  </IridescentActionButton>
) : (
  <button
    type={type}
    disabled={disabled}
    className={`chapter-button chapter-button--${variant} chapter-button--${size} ${className}`}
    onClick={() => {
      onClick?.();
    }}
  >
    <span className="chapter-button-label">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
    {showArrow && (
      <span className="chapter-button-arrow">
        <ArrowUpRight size={20} />
        <ArrowUpRight size={20} aria-hidden="true" />
      </span>
    )}
  </button>
);
