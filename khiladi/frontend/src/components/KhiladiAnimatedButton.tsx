import React from "react";
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

/** Keep existing actions while sharing one recognizable optical button system. */
export const KhiladiAnimatedButton: React.FC<Props> = ({
  children, onClick, variant = "primary", size = "md", showArrow = true,
  className = "", type = "button", disabled,
}) => {
  const material = {
    primary: "garnet",
    secondary: "sapphire",
    outline: "opal",
    gold: "graphite",
  } as const;
  return (
    <IridescentActionButton
      onClick={onClick}
      disabled={disabled}
      type={type}
      variant={material[variant]}
      size={size}
      className={className}
      icon={showArrow ? undefined : false}
    >
      {children}
    </IridescentActionButton>
  );
};
