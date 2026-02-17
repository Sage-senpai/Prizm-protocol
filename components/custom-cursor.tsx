'use client';

import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointerMedia = window.matchMedia('(pointer: fine)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(pointerMedia.matches && !motionMedia.matches);
    update();
    pointerMedia.addEventListener('change', update);
    motionMedia.addEventListener('change', update);

    return () => {
      pointerMedia.removeEventListener('change', update);
      motionMedia.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('cursor-none', enabled);
    return () => {
      document.body.classList.remove('cursor-none');
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }

      if (followerRef.current) {
        setTimeout(() => {
          if (followerRef.current) {
            followerRef.current.style.left = e.clientX + 'px';
            followerRef.current.style.top = e.clientY + 'px';
          }
        }, 20);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed w-3 h-3 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 z-50 shadow-lg shadow-white/50 mix-blend-screen"
      />

      {/* Cursor follower with glow */}
      <div
        ref={followerRef}
        className="pointer-events-none fixed w-8 h-8 rounded-full border-2 border-white/40 -translate-x-1/2 -translate-y-1/2 z-50 shadow-lg shadow-white/20 mix-blend-screen"
      />
    </>
  );
}
