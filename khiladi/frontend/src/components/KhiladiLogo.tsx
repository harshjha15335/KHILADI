import React from "react";
// Central product-brand component. Replace the wordmark here when the user supplies an approved logo.
export const KhiladiLogo: React.FC<{ className?: string }> = ({
  className = "",
}) => <span className={`khiladi-wordmark ${className}`}>KHILADI</span>;
