import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StudyAthlete } from "./player-cards/StudyAthlete";
import "./cinematic-memory-ribbon.css";

const PHOTOS = [
  { file: "trophy-celebration.webp", alt: "Rajasthan Royals trophy celebration", caption: "THE FIRST TITLE — 2008" },
  { file: "moment-1.webp", alt: "A cricket moment", caption: "A MOMENT OF BRILLIANCE" },
  { file: "moment-2.webp", alt: "Cricket fans and players", caption: "FOR THE LOVE OF THE GAME" },
  { file: "moment-3.webp", alt: "A memorable cricket moment", caption: "THE ROYALS LEGACY" },
  { file: "moment-4.webp", alt: "Cricket players in action", caption: "PRESSURE. PERFORMANCE. PRIDE." },
] as const;

const assetURL = (file: string) => `${import.meta.env.BASE_URL}assets/gallery/${file}`;
const wrap = (index: number, length: number) => ((index % length) + length) % length;

export function CinematicMemoryRibbon() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [webglReady, setWebglReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 899px)").matches);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const sync = () => setCompact(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const select = (next: number) => {
    const index = wrap(next, PHOTOS.length);
    activeRef.current = index;
    setActive(index);
    setHovered(null);
  };

  useEffect(() => {
    const element = host.current;
    const surface = canvas.current;
    if (!element || !surface || reducedMotion || compact) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: surface, alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      setWebglReady(false);
      return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
    camera.position.z = 10.8;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-5, -5);
    const meshes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
    const textures: THREE.Texture[] = [];
    const velocities = { x: 0, y: 0, scroll: 0 };
    let isVisible = true;
    let destroyed = false;
    let frame = 0;
    let pointerDownX = 0;
    let pointerDownY = 0;
    let dragging = false;
    let lastHit = -1;

    // A photographic plane retains its source aspect ratio: faces, trophy,
    // and lettering are never stretched or cropped by a generic texture UV.
    const jobs = PHOTOS.map((photo, index) => new Promise<void>((resolve) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide,
        depthWrite: true, toneMapped: false,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
      mesh.userData.index = index;
      mesh.scale.set(3, 2.3, 1);
      scene.add(mesh);
      meshes.push(mesh);

      new THREE.TextureLoader().load(assetURL(photo.file), texture => {
        if (destroyed) { texture.dispose(); resolve(); return; }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
        textures.push(texture);
        material.map = texture;
        material.needsUpdate = true;
        const image = texture.image as HTMLImageElement;
        const ratio = image.naturalWidth / image.naturalHeight || image.width / image.height || 1;
        mesh.userData.ratio = ratio;
        resolve();
      }, undefined, () => resolve());
    }));

    const updateSize = () => {
      const width = Math.max(element.clientWidth, 1);
      const height = Math.max(element.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resize = new ResizeObserver(updateSize);
    resize.observe(element);
    updateSize();

    const onMove = (event: PointerEvent) => {
      const rect = surface.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1,
        -((event.clientY - rect.top) / rect.height * 2 - 1));
      velocities.x = THREE.MathUtils.clamp(pointer.x, -1, 1);
      velocities.y = THREE.MathUtils.clamp(pointer.y, -1, 1);
      if (event.pointerType === "touch") return;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(meshes.filter(mesh => mesh.visible), false)[0]?.object.userData.index ?? -1;
      if (hit !== lastHit) {
        lastHit = hit;
        setHovered(hit < 0 ? null : hit);
        surface.style.cursor = hit < 0 ? "grab" : "pointer";
      }
    };
    const onLeave = () => {
      velocities.x = 0;
      velocities.y = 0;
      lastHit = -1;
      setHovered(null);
      surface.style.cursor = "grab";
    };
    const onDown = (event: PointerEvent) => {
      pointerDownX = event.clientX;
      pointerDownY = event.clientY;
      dragging = true;
    };
    const onUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const dx = event.clientX - pointerDownX;
      const dy = event.clientY - pointerDownY;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        select(activeRef.current + (dx < 0 ? 1 : -1));
      } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(meshes.filter(mesh => mesh.visible), false)[0]?.object.userData.index;
        if (typeof hit === "number") select(hit);
      }
    };
    const onCancel = () => { dragging = false; };
    const onScroll = () => {
      const rect = element.getBoundingClientRect();
      const viewport = Math.max(window.innerHeight, 1);
      velocities.scroll = THREE.MathUtils.clamp((viewport - rect.top) / (viewport + rect.height), 0, 1);
      element.dataset.scrollProgress = velocities.scroll.toFixed(3);
    };

    const onVisibility = () => {
      if (!document.hidden && isVisible && !frame) frame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(entries => {
      isVisible = entries[0]?.isIntersecting ?? true;
      if (isVisible && !frame) frame = requestAnimationFrame(animate);
    }, { rootMargin: "150px" });
    observer.observe(element);

    const animate = () => {
      frame = 0;
      if (destroyed || !isVisible || document.hidden) return;
      const cx = THREE.MathUtils.clamp(velocities.x * 0.055, -0.055, 0.055);
      const cy = THREE.MathUtils.clamp(velocities.y * 0.042, -0.042, 0.042);
      camera.rotation.y = THREE.MathUtils.damp(camera.rotation.y, -cx, 5, 1 / 60);
      camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, cy, 5, 1 / 60);
      const sceneShift = (velocities.scroll - 0.4) * 0.17;
      for (const mesh of meshes) {
        const index = mesh.userData.index as number;
        const total = PHOTOS.length;
        const relative = ((index - activeRef.current + total + 2) % total) - 2;
        const distance = Math.abs(relative);
        const focus = index === lastHit;
        const maxWidth = distance === 0 ? 4.5 : distance === 1 ? 2.5 : 1.4;
        const maxHeight = distance === 0 ? 3.15 : distance === 1 ? 3.5 : 1.95;
        const aspect = (mesh.userData.ratio as number | undefined) ?? 1.4;
        const width = Math.min(maxWidth, maxHeight * aspect);
        const height = width / aspect;
        const depth = distance === 0 ? 1.05 : distance === 1 ? -0.52 : -1.15;
        const targetZ = depth + (focus ? 0.46 : 0);
        // Only three clear photographs are shown, never semi-transparent ghost images.
        const targetOpacity = mesh.material.map ? (distance === 2 ? 0 : 1) : 0;
        const damping = 6;
        mesh.position.x = THREE.MathUtils.damp(mesh.position.x, relative * 2.98 + velocities.x * 0.07, damping, 1 / 60);
        mesh.position.y = THREE.MathUtils.damp(mesh.position.y, (distance ? -0.02 : 0.02) - sceneShift + velocities.y * 0.055, damping, 1 / 60);
        mesh.position.z = THREE.MathUtils.damp(mesh.position.z, targetZ, damping, 1 / 60);
        mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, -relative * 0.17, damping, 1 / 60);
        mesh.rotation.z = THREE.MathUtils.damp(mesh.rotation.z, relative * -0.022, damping, 1 / 60);
        mesh.scale.x = THREE.MathUtils.damp(mesh.scale.x, width * (focus ? 1.035 : 1), damping, 1 / 60);
        mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, height * (focus ? 1.035 : 1), damping, 1 / 60);
        mesh.material.opacity = THREE.MathUtils.damp(mesh.material.opacity, targetOpacity, damping, 1 / 60);
        mesh.renderOrder = 10 - distance + (focus ? 10 : 0);
        // Hidden panels must not intercept click/hover raycasts.
        mesh.visible = mesh.material.opacity > 0.03;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    Promise.all(jobs).then(() => {
      if (destroyed) return;
      if (meshes.some(mesh => !mesh.material.map)) {
        setWebglReady(false);
      } else {
        setWebglReady(true);
        if (!frame && isVisible) frame = requestAnimationFrame(animate);
      }
    });
    surface.addEventListener("pointermove", onMove);
    surface.addEventListener("pointerleave", onLeave);
    surface.addEventListener("pointerdown", onDown);
    surface.addEventListener("pointerup", onUp);
    surface.addEventListener("pointercancel", onCancel);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    onScroll();
    frame = requestAnimationFrame(animate);

    return () => {
      destroyed = true;
      if (frame) cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      surface.removeEventListener("pointermove", onMove);
      surface.removeEventListener("pointerleave", onLeave);
      surface.removeEventListener("pointerdown", onDown);
      surface.removeEventListener("pointerup", onUp);
      surface.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      meshes.forEach(mesh => { scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); });
      textures.forEach(texture => texture.dispose());
      renderer.dispose();
      setWebglReady(false);
    };
  }, [reducedMotion, compact]);

  return (
    <div className="memory-ribbon" ref={host} data-testid="cinematic-memory-ribbon"
      aria-label="Interactive gallery of Rajasthan Royals cricket moments">
      <div className="memory-ribbon__backdrop" aria-hidden="true" />
      <canvas ref={canvas} className={`memory-ribbon__canvas ${webglReady && !reducedMotion ? "is-ready" : ""}`}
        aria-hidden="true" />
      <div className={`memory-ribbon__fallback ${webglReady && !reducedMotion ? "is-hidden" : ""}`}
        aria-hidden="true"
        onTouchStart={event => {
          const t = event.touches[0];
          if (t) touchStart.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={event => {
          const origin = touchStart.current;
          const t = event.changedTouches[0];
          touchStart.current = null;
          if (!origin || !t) return;
          const dx = t.clientX - origin.x, dy = t.clientY - origin.y;
          if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.4)
            select(activeRef.current + (dx < 0 ? 1 : -1));
        }}>
        {[-1, 0, 1].map((offset) => {
          const i = wrap(active + offset, PHOTOS.length);
          return <div className={`memory-ribbon__still memory-ribbon__still--${offset + 1}`} key={`${i}:${offset}`}>
            <img src={assetURL(PHOTOS[i].file)} alt="" />
            <span className="memory-ribbon__backup"><StudyAthlete /></span>
          </div>;
        })}
      </div>
      <div className="memory-ribbon__meta" aria-live="polite">
        <span className="memory-ribbon__count">{String(active + 1).padStart(2, "0")} / 05</span>
        <span className="memory-ribbon__caption">{PHOTOS[hovered ?? active].caption}</span>
      </div>
      <div className="memory-ribbon__controls" aria-label="Browse cricket photographs">
        <button type="button" aria-label="Previous cricket photograph" onClick={() => select(active - 1)}>
          <ArrowLeft aria-hidden="true" size={18} />
        </button>
        <button type="button" aria-label="Next cricket photograph" onClick={() => select(active + 1)}>
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </div>
    </div>
  );
}
