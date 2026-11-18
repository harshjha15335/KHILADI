import React, { useState } from "react";
import "./official-royals-video.css";

/**
 * Embeds an official Rajasthan Royals-owned YouTube upload rather than copying
 * protected IPL match footage into KHILADI or pretending it is a match highlight.
 * Iframe only loads after deliberate user interaction.
 */
const OFFICIAL_VIDEO = {
  title: "Class of '25: Signing Out — Rajasthan Royals",
  youtubeId: "kYym8oJ0Dvg",
  source: "https://www.youtube.com/watch?v=kYym8oJ0Dvg",
} as const;

export function OfficialRoyalsVideo() {
  const [playing, setPlaying] = useState(false);
  return (
    <section
      className="official-royals-video"
      aria-labelledby="official-royals-video-heading"
      data-brand-tone="white"
      data-header-brand="compact"
    >
      <div className="official-royals-video__copy">
        <p className="eyebrow">THE ROYALS / ON FILM</p>
        <h2 id="official-royals-video-heading">
          Every Royal
          <br />
          <em>has a story.</em>
        </h2>
        <p>
          Watch a video published by Rajasthan Royals. When authorized
          self-hosted match footage becomes available, the cinematic highlights
          player in this section takes precedence.
        </p>
        <a href={OFFICIAL_VIDEO.source} target="_blank" rel="noopener noreferrer">
          Watch on the official source ↗
        </a>
      </div>
      <div className="official-royals-video__stage">
        {playing ? (
          <iframe
            title={OFFICIAL_VIDEO.title}
            src={`https://www.youtube-nocookie.com/embed/${OFFICIAL_VIDEO.youtubeId}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="official-royals-video__play"
            onClick={() => setPlaying(true)}
            aria-label="Play Rajasthan Royals official team video"
          >
            <span aria-hidden="true">▶</span>
            <strong>Watch the Royals</strong>
            <small>Play official team video</small>
          </button>
        )}
        <p className="official-royals-video__credit">
          Official Rajasthan Royals video · Embedded from YouTube · Not an IPL match-highlights montage
        </p>
      </div>
    </section>
  );
}
