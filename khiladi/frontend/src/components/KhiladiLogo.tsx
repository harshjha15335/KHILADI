import React, { useState } from "react";
import { siteURL } from "../utils/urls";
import "./KhiladiLogo.css";
// Shared user-approved transparent product logo; independent of the RR crest.
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
      <span className="khiladi-logo-fallback" aria-hidden="true">
        KHILADI
      </span>
      <img
        src={siteURL("/assets/brand/khiladi-logo.png")}
        alt=""
        aria-hidden="true"
        width="2172"
        height="724"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
    </span>
  );
};
