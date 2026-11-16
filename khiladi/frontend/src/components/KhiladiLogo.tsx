import React, { useState } from "react";
import { siteURL } from "../utils/urls";
import "./KhiladiLogo.css";
// Shared user-approved transparent batsman symbol; independent of the RR crest.
export const KhiladiLogo: React.FC<{
  className?: string;
  variant?: "header" | "footer" | "loader";
}> = ({ className = "", variant = "header" }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <span
      role="img"
      aria-label="KHILADI"
      className={`khiladi-logo khiladi-logo--${variant} ${loaded ? "khiladi-logo--ready" : ""} ${className}`}
    >
      <span className="khiladi-logo-fallback" aria-hidden="true"></span>
      <img
        src={siteURL("/assets/brand/khiladi-symbol.svg")}
        alt=""
        aria-hidden="true"
        width="496"
        height="748"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
    </span>
  );
};
