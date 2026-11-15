import React from "react";
export const KhiladiKineticText: React.FC<{
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
}> = ({ text, className = "", as: Tag = "h2" }) => (
  <Tag className={`kinetic-text ${className}`} aria-label={text}>
    {text.split(" ").map((word, w) => (
      <span className="kinetic-word" aria-hidden="true" key={w}>
        {[...word].map((char, i) => (
          <span
            key={i}
            className="kinetic-char"
            style={
              {
                "--char-index": i,
                "--char-offset": i - (word.length - 1) / 2,
                "--char-wave": i % 2 ? 1 : -1,
              } as React.CSSProperties
            }
          >
            {char}
          </span>
        ))}
      </span>
    ))}
  </Tag>
);
