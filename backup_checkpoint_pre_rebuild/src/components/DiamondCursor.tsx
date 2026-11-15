import React, { useEffect, useRef, useState } from 'react';

export const DiamondCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Only enable on fine pointer devices (desktops) without reduced-motion preference
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isTouch || prefersReducedMotion) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);
    document.body.classList.add('custom-cursor-active');

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let lastX = 0;
    let lastY = 0;
    let velocity = 0;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      velocity = Math.min(2.5, Math.sqrt(dx * dx + dy * dy) * 0.05);
      lastX = mouseX;
      lastY = mouseY;
    };

    const checkHoverTarget = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = target.closest('a, button, [role="button"], input, select, .interactive-card, tr.cursor-pointer');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', checkHoverTarget, { passive: true });

    const render = () => {
      // Smooth lerp interpolation
      const lerp = 0.22;
      cursorX += (mouseX - cursorX) * lerp;
      cursorY += (mouseY - cursorY) * lerp;

      if (cursorRef.current) {
        const scale = isHovered ? 1.8 : (1.0 + velocity * 0.25);
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) rotate(45deg) scale(${scale})`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', checkHoverTarget);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isHovered]);

  if (!isEnabled) return null;

  return (
    <div
      ref={cursorRef}
      className={`diamond-cursor-dot ${isHovered ? 'hovered' : ''}`}
      style={{ left: 0, top: 0 }}
    />
  );
};
