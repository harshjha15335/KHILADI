import React, { useEffect } from 'react';

export const DiamondCursor: React.FC = () => {
  useEffect(() => {
    // Only enable on fine pointer devices (desktops) without reduced-motion preference
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    // Create a single global cursor DOM element attached directly to body
    let cursorEl = document.getElementById('khiladi-diamond-cursor') as HTMLDivElement | null;
    if (!cursorEl) {
      cursorEl = document.createElement('div');
      cursorEl.id = 'khiladi-diamond-cursor';
      cursorEl.className = 'fixed pointer-events-none z-[9999] w-4 h-4 rounded-[1.5px] bg-[#F2E67C] border border-[#D6AF60] shadow-[0_0_12px_rgba(242,230,124,0.7)] transition-transform duration-75 will-change-transform';
      cursorEl.style.top = '0';
      cursorEl.style.left = '0';
      cursorEl.style.opacity = '0';
      cursorEl.style.transform = 'translate3d(-100px, -100px, 0) rotate(45deg)';
      document.body.appendChild(cursorEl);
    }

    // Smooth physics variables
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let targetScale = 1.0;
    let currentScale = 1.0;
    let isVisible = false;
    let rafId: number;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursorX = mouseX;
        cursorY = mouseY;
        if (cursorEl) cursorEl.style.opacity = '1';
      }
    };

    const onPointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = !!target.closest('a, button, [role="button"], input, select, .interactive-card, tr.cursor-pointer, .quiz-option');
      targetScale = isInteractive ? 1.9 : 1.0;
      if (cursorEl) {
        if (isInteractive) {
          cursorEl.style.borderColor = '#FFFFFF';
          cursorEl.style.backgroundColor = '#FFE7F0';
          cursorEl.style.boxShadow = '0 0 16px rgba(232, 18, 116, 0.8)';
        } else {
          cursorEl.style.borderColor = '#D6AF60';
          cursorEl.style.backgroundColor = '#F2E67C';
          cursorEl.style.boxShadow = '0 0 12px rgba(242, 230, 124, 0.7)';
        }
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (cursorEl) cursorEl.style.opacity = '0';
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mouseover', onPointerOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // Single RAF loop with smooth lerp
    const tick = () => {
      if (isVisible && cursorEl) {
        const lerp = 0.35;
        cursorX += (mouseX - cursorX) * lerp;
        cursorY += (mouseY - cursorY) * lerp;
        currentScale += (targetScale - currentScale) * 0.25;

        cursorEl.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) rotate(45deg) scale(${currentScale.toFixed(3)})`;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mouseover', onPointerOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
      if (cursorEl && cursorEl.parentNode) {
        cursorEl.parentNode.removeChild(cursorEl);
      }
    };
  }, []);

  return null; // Pure non-rendering controller: zero React tree re-renders!
};
