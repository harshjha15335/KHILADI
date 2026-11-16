import React, { useEffect, useRef, useState } from "react";
import { ApprovedClip } from "../utils/media";
// Keep the current frame until the incoming clip is playing. No empty-source film UI.
export const CinematicVideo: React.FC<{
  clips: ApprovedClip[];
  activeIndex: number;
  onNext?: () => void;
  className?: string;
}> = ({ clips, activeIndex, onNext, className = "" }) => {
  const root = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [displayed, setDisplayed] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(!document.hidden);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState<number[]>([]);
  const [needsPlay, setNeedsPlay] = useState(false);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(preference.matches);
    const visibility = () => setDocumentVisible(!document.hidden);
    preference.addEventListener("change", change);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", visibility);
      videos.current.forEach((video) => video?.pause());
    };
  }, []);
  const shouldPlay =
    visible &&
    documentVisible &&
    !reduced &&
    !paused &&
    !failed.includes(activeIndex);
  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (!shouldPlay || (i !== activeIndex && i !== displayed)) video.pause();
      else if (i === activeIndex)
        void video
          .play()
          .then(() => setNeedsPlay(false))
          .catch(() => setNeedsPlay(true));
    });
  }, [activeIndex, displayed, shouldPlay]);
  if (!clips.length) return null;
  const active = clips[activeIndex % clips.length];
  return (
    <div ref={root} className={`cinematic-films ${className}`}>
      <img
        className="film-poster"
        src={active.poster}
        alt=""
        aria-hidden="true"
      />
      {clips.map((clip, i) => (
        <video
          ref={(element) => {
            videos.current[i] = element;
          }}
          key={clip.src}
          className={`cinematic-film ${displayed === i && !reduced ? "cinematic-film--visible" : ""}`}
          src={clip.src}
          poster={clip.poster}
          preload={i === activeIndex ? "auto" : "metadata"}
          muted
          playsInline
          autoPlay={i === activeIndex && shouldPlay}
          aria-label={clip.caption}
          onPlaying={() => {
            if (i === activeIndex) setDisplayed(i);
          }}
          onError={() => {
            if (i === activeIndex) {
              setDisplayed(null);
              setNeedsPlay(false);
              setFailed((old) => (old.includes(i) ? old : [...old, i]));
            }
          }}
          onEnded={() => {
            if (i === activeIndex) {
              if (onNext) onNext();
              else {
                const video = videos.current[i];
                if (video && shouldPlay) {
                  video.currentTime = 0;
                  void video.play().catch(() => setNeedsPlay(true));
                }
              }
            }
          }}
        />
      ))}
      {!reduced && !failed.includes(activeIndex) && (
        <button
          className="film-play-control"
          aria-label={needsPlay || paused ? "Play film" : "Pause film"}
          onClick={() => {
            if (needsPlay) {
              void videos.current[activeIndex]
                ?.play()
                .then(() => setNeedsPlay(false))
                .catch(() => setNeedsPlay(true));
            }
            setPaused(!needsPlay && !paused);
          }}
        >
          {needsPlay || paused ? "Play film" : "Pause film"}
        </button>
      )}
    </div>
  );
};
