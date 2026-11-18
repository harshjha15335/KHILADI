import React from "react";
import { createRoot } from "react-dom/client";
import { RoyalCardPrototype } from "./RoyalCardPrototype";
import "../../components/player-cards/royal-card.css";
// This independent development entry is never imported by the product entry.
const root = createRoot(document.getElementById("royal-prototype")!);
if (import.meta.env.DEV && import.meta.env.VITE_GITHUB_PAGES !== "true")
  root.render(
    <React.StrictMode>
      <RoyalCardPrototype />
    </React.StrictMode>,
  );
else
  root.render(<p>This private prototype is available only in development.</p>);
