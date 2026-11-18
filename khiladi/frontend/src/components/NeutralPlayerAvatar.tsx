import React from "react";

/** Anonymous, neutral archive placeholder. Never implies a real player's face. */
export function NeutralPlayerAvatar({
  className = "",
  label = "Player portrait unavailable",
}: {className?:string;label?:string}) {
  return <svg className={className} viewBox="0 0 350 350" width="350" height="350"
    preserveAspectRatio="xMidYMid meet" role="img" aria-label={label}
    data-testid="neutral-player-avatar">
    <rect width="350" height="350" fill="#DADDE2"/>
    <circle cx="175" cy="140" r="55" fill="#777E86"/>
    <path d="M58 350v-12c0-72 49-126 117-126s117 54 117 126v12Z" fill="#777E86"/>
  </svg>;
}
