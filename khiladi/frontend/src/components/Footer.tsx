import React from "react";
import licensedPortraits from "./player-cards/licensed-portraits.json";
export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({
  onNavigate,
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
      <details className="khiladi-photo-credits">
        <summary>Photo credits</summary>
        <ul>
          {Object.values(licensedPortraits).map(photo => (
            <li key={photo.source}>
              {photo.name} — <a href={photo.source} target="_blank" rel="noreferrer">{photo.author}</a>
              {" · "}<a href={photo.license_url} target="_blank" rel="noreferrer">{photo.license}</a>
              {photo.modified ? " · modified" : " · unmodified"}
            </li>
          ))}
        </ul>
      </details>
      <span>© {new Date().getFullYear()} KHILADI</span>
      <span>
        Independent cricket research project. Not an official team website.
      </span>

    </div>
  </footer>
);
