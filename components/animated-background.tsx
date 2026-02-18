'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  driftX: number;
  driftY: number;
  pulse: number;
};

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles: Particle[] = [];
    let animationFrame = 0;

    const resize = () => {
      const { innerWidth, innerHeight, devicePixelRatio } = window;
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      particles.length = 0;
      const count = Math.min(60, Math.floor(innerWidth / 18));
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * innerWidth,
          y: Math.random() * innerHeight,
          radius: 1 + Math.random() * 2.2,
          alpha: 0.2 + Math.random() * 0.6,
          driftX: (Math.random() - 0.5) * 0.3,
          driftY: (Math.random() - 0.5) * 0.3,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      particles.forEach((particle) => {
        particle.x += particle.driftX;
        particle.y += particle.driftY;
        particle.pulse += 0.02;

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;

        const pulse = 0.5 + Math.sin(particle.pulse) * 0.5;
        ctx.globalAlpha = particle.alpha * pulse;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);

    if (!prefersReducedMotion) {
      animationFrame = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-noise" />
    </div>
  );
}
