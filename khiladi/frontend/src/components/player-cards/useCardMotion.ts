import { useEffect, useRef, useState } from "react";
import type { SceneControl } from "./FoilScene";
export function useCardMotion(
  scene: React.MutableRefObject<SceneControl | null>,
) {
  const root = useRef<HTMLDivElement>(null),
    surface = useRef<HTMLDivElement>(null);
  const [back, setBack] = useState(false),
    [reduced, setReduced] = useState(
      matchMedia("(prefers-reduced-motion:reduce)").matches,
    ),
    [rotateMode, setRotateMode] = useState(false);
  const state = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    tx: 0,
    ty: 0,
    flip: 0,
    from: 0,
    to: 0,
    start: 0,
    duration: 0,
    raf: 0,
    last: 0,
    drag: false,
    pointer: -1,
    px: 0,
    py: 0,
    moved: false,
    paused: false,
    visible: true,
    frames: 0,
  });
  const startRef = useRef<() => void>(() => {});
  useEffect(() => {
    const s = state.current,
      node = root.current;
    if (!node) return;
    let stopped = false;
    const pref = matchMedia("(prefers-reduced-motion:reduce)");
    function render(now: number) {
      s.raf = 0;
      if (stopped || s.paused) return;
      const dt = Math.min((now - (s.last || now)) / 1000, 1 / 30) || 1 / 60;
      s.last = now;
      if (pref.matches) {
        s.x = s.y = s.vx = s.vy = 0;
        s.flip = s.to;
        s.duration = 0;
      } else {
        for (let i = 0; i < 2; i++) {
          const h = dt / 2;
          s.vx += (110 * (s.tx - s.x) - 21 * s.vx) * h;
          s.vy += (110 * (s.ty - s.y) - 21 * s.vy) * h;
          s.x += s.vx * h;
          s.y += s.vy * h;
        }
        s.x = Math.max(-16, Math.min(16, s.x));
        s.y = Math.max(-32, Math.min(32, s.y));
        if (s.duration) {
          const t = Math.min(1, (now - s.start) / s.duration),
            e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          s.flip = s.from + (s.to - s.from) * e;
          if (t === 1) s.duration = 0;
        }
      }
      node.style.transform = `rotateX(${s.x}deg) rotateY(${s.flip + s.y}deg)`;
      node.style.setProperty("--rc-px", String(s.y / 30));
      node.style.setProperty("--rc-py", String(s.x / 16));
      node.dataset.side = s.flip >= 90 ? "back" : "front";
      node.dataset.pitch = s.x.toFixed(2);
      node.dataset.yaw = s.y.toFixed(2);
      node.dataset.flip = s.flip.toFixed(2);
      node.dataset.motion = s.duration
        ? "flipping"
        : s.drag
          ? "dragging"
          : "settling";
      scene.current?.paint(s.x, s.y);
      s.frames++;
      node.dataset.frames = String(s.frames);
      const moving =
        !!s.duration ||
        Math.abs(s.x - s.tx) +
          Math.abs(s.y - s.ty) +
          Math.abs(s.vx) +
          Math.abs(s.vy) >
          0.025;
      if (moving && !pref.matches) s.raf = requestAnimationFrame(render);
      else {
        node.dataset.motion = "idle";
        s.last = 0;
      }
    }
    const start = () => {
      if (!s.raf && !s.paused && !stopped)
        s.raf = requestAnimationFrame(render);
    };
    startRef.current = start;
    const preference = () => {
      setReduced(pref.matches);
      s.tx = s.ty = s.vx = s.vy = 0;
      start();
    };
    pref.addEventListener("change", preference);
    const pause = () => {
      s.paused = document.hidden || !s.visible;
      node.dataset.paused = String(s.paused);
      scene.current?.pause(s.paused);
      if (s.paused) {
        cancelAnimationFrame(s.raf);
        s.raf = 0;
        s.last = 0;
      } else {
        s.vx = s.vy = 0;
        start();
      }
    };
    document.addEventListener("visibilitychange", pause);
    const observer = new IntersectionObserver(
      (es) => {
        s.visible = es[0].isIntersecting;
        pause();
      },
      { threshold: 0.01 },
    );
    observer.observe(surface.current!);
    start();
    return () => {
      stopped = true;
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      s.last = 0;
      s.drag = false;
      pref.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", pause);
      observer.disconnect();
    };
  }, [scene]);
  const stopCapture = () => {
    const s = state.current;
    try {
      if (surface.current?.hasPointerCapture(s.pointer))
        surface.current.releasePointerCapture(s.pointer);
    } catch {}
    s.drag = false;
    s.pointer = -1;
  };
  const flip = () => {
    stopCapture();
    const s = state.current,
      next = s.to === 0 ? 180 : 0;
    s.from = s.flip;
    s.to = next;
    s.start = performance.now();
    s.duration = reduced ? 0 : 650;
    s.tx = s.ty = 0;
    setBack(next === 180);
    startRef.current();
  };
  const reset = () => {
    stopCapture();
    const s = state.current;
    s.from = s.flip;
    s.to = 0;
    s.start = performance.now();
    s.duration = reduced ? 0 : 320;
    s.tx = s.ty = s.vx = s.vy = 0;
    setBack(false);
    setRotateMode(false);
    startRef.current();
  };
  return {
    root,
    surface,
    back,
    reduced,
    rotateMode,
    setRotateMode,
    flip,
    reset,
    rotate: (x: number, y: number) => {
      if (reduced) return;
      state.current.tx = Math.max(-12, Math.min(12, x));
      state.current.ty = Math.max(-28, Math.min(28, y));
      startRef.current();
    },
    handlers: {
      onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
        const s = state.current;
        if (
          reduced ||
          s.duration ||
          e.button !== 0 ||
          (e.pointerType !== "mouse" && !rotateMode)
        )
          return;
        s.drag = true;
        s.moved = false;
        s.px = e.clientX;
        s.py = e.clientY;
        s.pointer = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
      },
      onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
        if (reduced) return;
        const s = state.current;
        if (s.duration) return;
        if (s.drag) {
          const dx = e.clientX - s.px,
            dy = e.clientY - s.py;
          s.moved ||= Math.abs(dx) + Math.abs(dy) > 6;
          s.tx = Math.max(-15, Math.min(15, s.tx - dy * 0.24));
          s.ty = Math.max(-30, Math.min(30, s.ty + dx * 0.28));
          s.vx = Math.max(-35, Math.min(35, -dy * 2));
          s.vy = Math.max(-50, Math.min(50, dx * 2));
          s.px = e.clientX;
          s.py = e.clientY;
        } else if (e.pointerType === "mouse") {
          const r = e.currentTarget.getBoundingClientRect();
          s.tx = (-(e.clientY - r.top - r.height / 2) / r.height) * 16;
          s.ty = ((e.clientX - r.left - r.width / 2) / r.width) * 22;
        } else return;
        startRef.current();
      },
      onPointerUp: () => {
        stopCapture();
        state.current.tx = state.current.ty = 0;
        startRef.current();
      },
      onPointerCancel: () => {
        stopCapture();
        state.current.tx =
          state.current.ty =
          state.current.vx =
          state.current.vy =
            0;
        startRef.current();
      },
      onLostPointerCapture: () => {
        state.current.drag = false;
        state.current.tx = state.current.ty = 0;
        startRef.current();
      },
      onPointerLeave: () => {
        if (!state.current.drag) {
          state.current.tx = state.current.ty = 0;
          startRef.current();
        }
      },
      onClickCapture: (e: React.MouseEvent) => {
        if (state.current.moved) {
          e.preventDefault();
          e.stopPropagation();
          state.current.moved = false;
        }
      },
    },
  };
}
