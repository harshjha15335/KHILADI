import { KhiladiLogo } from "./KhiladiLogo";
import React from "react";
import { siteURL } from "../utils/urls";
export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({
  onNavigate,
}) => (
  <footer
    className="brand-footer khiladi-glass-footer"
    data-brand-tone="white"
    data-header-brand="hidden"
    style={{ backgroundImage: `linear-gradient(110deg, rgba(19,34,57,.83), rgba(19,34,57,.60)), url("${siteURL("/assets/gallery/trophy-celebration.webp")}")` }}
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
    <div className="footer-wordmark">
      <KhiladiLogo variant="footer" tone="white" />
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} KHILADI</span>
      <span>
        Independent cricket research project. Not an official team website.
      </span>
      <span>Design study: Delta-inspired editorial layout · Photos: supplied cricket images and official IPL source links.</span>
    </div>
  </footer>
);
