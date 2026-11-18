import React, { useRef } from "react";
export const KhiladiKineticText: React.FC<{
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
  preview?: string;
}> = ({ text, className = "", as: Tag = "h2", preview }) => {
  const image = useRef<HTMLSpanElement>(null);
  return (
    <Tag
      className={`kinetic-text ${className}`}
      aria-label={text}
      onPointerMove={(event) => {
        if (
          !image.current ||
          event.pointerType !== "mouse" ||
          !matchMedia(
            "(pointer:fine) and (prefers-reduced-motion:no-preference)",
          ).matches
        )
          return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - bounds.left,
          y = event.clientY - bounds.top;
        image.current.style.transform = `translate3d(${x - 50}px,${y - 70}px,0) rotate(${(x / bounds.width - 0.5) * 14}deg)`;
      }}
    >
      {text.split(" ").map((word, w, words) => (
        <span
          className={`kinetic-word ${w === words.length - 1 ? "kinetic-word--serif" : ""}`}
          aria-hidden="true"
          key={w}
        >
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
      {preview && (
        <span ref={image} className="kinetic-preview" aria-hidden="true">
          <img src={preview} alt="" width="110" height="145" />
        </span>
      )}
    </Tag>
  );
};
