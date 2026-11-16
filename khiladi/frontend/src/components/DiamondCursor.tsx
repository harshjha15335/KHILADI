import React, { useEffect } from "react";
export const DiamondCursor: React.FC = () => {
  useEffect(() => {
    const preference = matchMedia(
      "(pointer:fine) and (prefers-reduced-motion:no-preference)",
    );
    let cleanup = () => {};
    const initialize = () => {
      cleanup();
      if (!preference.matches) return;
      const cursor = document.createElement("div");
      cursor.id = "khiladi-diamond-cursor";
      cursor.setAttribute("aria-hidden", "true");
      Object.assign(cursor.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "14px",
        height: "14px",
        background: "#f2e67c",
        border: "1px solid #182643",
        pointerEvents: "none",
        zIndex: "2147483647",
        opacity: "0",
        transition: "opacity .15s",
        boxShadow: "none",
      });
      const label = document.createElement("span");
      label.id = "khiladi-cursor-label";
      label.setAttribute("aria-hidden", "true");
      Object.assign(label.style, {
        position: "fixed",
        left: "0",
        top: "0",
        pointerEvents: "none",
        background: "#f2e67c",
        color: "#182643",
        padding: "5px 8px",
        font: "11px Arial, sans-serif",
        whiteSpace: "nowrap",
        borderRadius: "2px",
        zIndex: "2147483647",
        opacity: "0",
        transition: "opacity .15s",
      });
      document.body.append(cursor, label);
      let x = 0,
        y = 0,
        tx = 0,
        ty = 0,
        scale = 1,
        targetScale = 1,
        frame = 0,
        last = 0,
        visible = false;
      const tick = (now: number) => {
        const alpha = 1 - Math.exp(-Math.min(32, now - last || 16) / 32);
        last = now;
        x += (tx - x) * alpha;
        y += (ty - y) * alpha;
        scale += (targetScale - scale) * alpha;
        cursor.style.transform = `translate3d(${x - 7}px,${y - 7}px,0) rotate(45deg) scale(${scale})`;
        label.style.transform = `translate3d(${Math.min(innerWidth - 130, Math.max(8, x + 18))}px,${Math.min(innerHeight - 35, y + 16)}px,0)`;
        if (
          Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(targetScale - scale) >
          0.05
        )
          frame = requestAnimationFrame(tick);
        else frame = 0;
      };
      const wake = () => {
        if (!frame) {
          last = performance.now();
          frame = requestAnimationFrame(tick);
        }
      };
      const move = (e: PointerEvent) => {
        tx = e.clientX;
        ty = e.clientY;
        if (!visible) {
          x = tx;
          y = ty;
          visible = true;
          cursor.style.opacity = "1";
        }
        targetScale = (e.target as HTMLElement).closest(
          "a,button,input,select,summary",
        )
          ? 1.5
          : 1;
        const media = (e.target as HTMLElement).closest<HTMLElement>(
          "[data-cursor-label]",
        );
        label.textContent = media?.dataset.cursorLabel || "";
        label.style.opacity = media ? "1" : "0";
        wake();
      };
      const leave = () => {
        visible = false;
        cursor.style.opacity = "0";
        label.style.opacity = "0";
        cancelAnimationFrame(frame);
        frame = 0;
      };
      // Native dialogs occupy the top layer. Move the same cursor inside the active one.
      const observer = new MutationObserver(() => {
        const dialogs = Array.from(
          document.querySelectorAll<HTMLDialogElement>("dialog[open]"),
        );
        const active = dialogs[dialogs.length - 1];
        const parent = active || document.body;
        if (cursor.parentElement !== parent) parent.append(cursor, label);
      });
      observer.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ["open"],
      });
      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("mouseleave", leave);
      window.addEventListener("blur", leave);
      window.addEventListener("hashchange", leave);
      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("pointermove", move);
        document.removeEventListener("mouseleave", leave);
        window.removeEventListener("blur", leave);
        window.removeEventListener("hashchange", leave);
        cursor.remove();
        label.remove();
      };
    };
    initialize();
    preference.addEventListener("change", initialize);
    return () => {
      cleanup();
      preference.removeEventListener("change", initialize);
    };
  }, []);
  return null;
};
