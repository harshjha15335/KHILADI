import React from "react";
export const AnalyticsIntro: React.FC<{
  children: React.ReactNode;
  details?: React.ReactNode;
}> = ({ children, details }) => (
  <div className="analytics-intro">
    {children}
    {details && (
      <details>
        <summary>How to read the evidence</summary>
        <p>{details}</p>
        <a className="text-link" href="#methodology">
          Explore the methodology ↗
        </a>
      </details>
    )}
  </div>
);
