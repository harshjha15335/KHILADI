import { KhiladiLogo } from "./KhiladiLogo";
import React, { useEffect, useRef, useState } from "react";
const destinations = [
  ["home", "Home"],
  ["database", "Explore players"],
  ["rankings", "The top ten"],
  ["pressure-lab", "Pressure Lab"],
  ["comparison", "Compare players"],
  ["war-room", "Build your squad"],
  ["batting-intel", "Batting insights"],
  ["bowling-intel", "Bowling insights"],
  ["command-centre", "Overview"],
  ["methodology", "How it works"],
];
export const Navbar: React.FC<{
  currentPage: string;
  onNavigate: (page: string) => void;
  rrPurseCr?: number;
}> = ({ currentPage, onNavigate }) => {
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState<{
    tone: "original" | "white";
    placement: "hero" | "compact" | "hidden";
  }>({ tone: "white", placement: "hero" });
  useEffect(() => {
    if (currentPage !== "home") {
      setBrand({ tone: "original", placement: "compact" });
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = Array.from(
        document.querySelectorAll<HTMLElement>("[data-brand-tone]"),
      ).find((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.top <= 70 && bounds.bottom > 70;
      });
      const tone =
        section?.dataset.brandTone === "white" ? "white" : "original";
      const value = section?.dataset.headerBrand;
      const placement =
        value === "hero" ? "hero" : value === "compact" ? "compact" : "hidden";
      setBrand((old) =>
        old.tone === tone && old.placement === placement
          ? old
          : { tone, placement },
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [currentPage]);
  const close = () => {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus();
  };
  const navigate = (id: string) => {
    close();
    onNavigate(id);
  };
  return (
    <>
      <header
        className={`site-header ${currentPage === "home" ? "site-header--home" : ""}`}
        data-brand-placement={brand.placement}
      >
        <a
          href="#home"
          className="site-wordmark"
          aria-hidden={
            currentPage === "home" && brand.placement === "hidden"
              ? true
              : undefined
          }
          tabIndex={
            currentPage === "home" && brand.placement === "hidden" ? -1 : 0
          }
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          <KhiladiLogo tone={brand.tone} />
        </a>
        <div className="site-header-tools">
          <button
            ref={trigger}
            className="menu-trigger"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => {
              dialog.current?.showModal();
              setOpen(true);
            }}
          >
            Menu <span aria-hidden="true">{open ? "−" : "+"}</span>
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        className="navigation-dialog"
        aria-labelledby="menu-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        onClose={() => setOpen(false)}
      >
        <div className="navigation-inner">
          <div className="navigation-top">
            <div>
              <KhiladiLogo />
              <span id="menu-title" className="sr-only">
                THE GAME STARTS HERE
              </span>
            </div>
            <button onClick={close} aria-label="Close menu">
              Close ×
            </button>
          </div>
          <nav aria-label="Main navigation">
            {destinations.map(([id, label], i) => (
              <a
                href={`#${id}`}
                key={id}
                aria-current={currentPage === id ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(id);
                }}
              >
                <small>{String(i + 1).padStart(2, "0")}</small>
                <span>{label}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
          <p>Find the player. Feel the game.</p>
        </div>
      </dialog>
    </>
  );
};
