import React, { useState } from 'react';

interface KhiladiKineticTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
}

export const KhiladiKineticText: React.FC<KhiladiKineticTextProps> = ({
  text,
  className = '',
  as: Component = 'h2'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const words = text.split(' ');

  return (
    <Component
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-flex flex-wrap gap-x-2 select-none cursor-pointer transition-all duration-300 ${className}`}
    >
      {words.map((word, wIdx) => (
        <span
          key={wIdx}
          className="inline-flex transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: isHovered ? `translateY(${wIdx % 2 === 0 ? '-2px' : '2px'})` : 'translateY(0)',
            letterSpacing: isHovered ? '0.04em' : 'normal',
            color: isHovered ? '#E81274' : undefined,
          }}
        >
          {word}
        </span>
      ))}
    </Component>
  );
};
