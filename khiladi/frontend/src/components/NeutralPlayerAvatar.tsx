import React from "react";

/** User-supplied anonymous grey player graphic, shared across all missing portraits.
 * No initials, photographs of other people, or illustrative replacements.
 */
export function NeutralPlayerAvatar({
  className = "",
  label = "Player portrait unavailable",
}: {className?:string;label?:string}) {
  return <img className={className}
    src={import.meta.env.BASE_URL + "assets/players/neutral-avatar.webp"}
    alt={label} width="350" height="350" decoding="async"
    data-testid="neutral-player-avatar" />;
}
