import React from "react";
export const Footer: React.FC<{ onNavigate: (page: string) => void; onReplayIntro?: () => void }> = ({
  onNavigate, onReplayIntro,
}) => (
  <footer
    className="brand-footer khiladi-glass-footer"
    data-brand-tone="white"
    data-header-brand="hidden"
  >
    <div className="footer-top">
      <p>
        For the love
        <br />
        of the game.
      </p>
      <nav aria-label="Footer navigation">
        {[
          ["database", "Explore players"],
          ["rankings", "The top ten"],
          ["war-room", "Build your squad"],
          ["methodology", "How it works"],
        ].map(([id, text]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(id);
            }}
          >
            {text} ↗
          </a>
        ))}
      </nav>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} KHILADI</span>
      <span>
        Independent cricket research project. Not an official team website.
      </span>
      {onReplayIntro && <button className="footer-replay" type="button" onClick={onReplayIntro}>Replay introduction ↻</button>}
    </div>
  </footer>
);
