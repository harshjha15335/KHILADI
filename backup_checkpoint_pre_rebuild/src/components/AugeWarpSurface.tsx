import React, { useRef, useState } from 'react';

interface AugeWarpSurfaceProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  disabled?: boolean;
}

export const AugeWarpSurface: React.FC<AugeWarpSurfaceProps> = ({
  children,
  className = '',
  intensity = 1.0,
  disabled = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)');
  const [filter, setFilter] = useState<string>('none');

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates -1 to +1
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;
    
    // Calculate 3D tilt & skew
    const rotX = -normY * 10 * intensity;
    const rotY = normX * 10 * intensity;
    const skew = normX * normY * 3 * intensity;

    setTransform(`perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) skew(${skew}deg) scale(1.02)`);
    // Subtle chromatic displacement simulated via drop-shadow
    setFilter(`drop-shadow(${normX * 4 * intensity}px ${normY * 4 * intensity}px 12px rgba(232, 18, 116, 0.35))`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) skew(0deg) scale(1)');
    setFilter('none');
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ease-out will-change-transform ${className}`}
      style={{
        transform,
        filter,
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  );
};
