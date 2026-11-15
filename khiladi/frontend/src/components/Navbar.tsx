import { KhiladiLogo } from "./KhiladiLogo";
import React, { useRef, useState } from "react";
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
      >
        <a
          href="#home"
          className="site-wordmark"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          <KhiladiLogo />
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
