"use client";

import { useIsOnScreen } from "@/hooks/useIsOnScreen";
import { useEffect, useRef } from "react";

interface Props {
  readonly count?: number;
  readonly opacity?: number;
}

/**
 * Faint drifting signal particles for the hero background.
 * Represents the flow of economic signals through space —
 * barely perceptible, adding depth without distraction.
 *
 * Pauses animation when scrolled off-screen to save battery.
 */
export function SignalField({ count = 40, opacity = 0.35 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onScreen = useIsOnScreen(canvasRef, { threshold: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onScreen) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = rect?.width ?? window.innerWidth;
      h = rect?.height ?? window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = window.getComputedStyle(document.documentElement);
    const ink = styles.getPropertyValue("--ink-primary").trim() || "#1C1814";
    const inkSecondary = styles.getPropertyValue("--ink-secondary").trim() || "#5C5348";

    // Init particles
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      r: 0.6 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5,
      color: i % 3 === 0 ? ink : inkSecondary,
    }));

    let raf = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        // Wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const pulse = 0.5 + Math.sin(t * 0.8 + p.phase) * 0.3;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity * pulse;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Very faint connections between nearby particles
      ctx.globalAlpha = opacity * 0.15;
      ctx.strokeStyle = inkSecondary;
      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          if (!a || !b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      if (!reduced) raf = window.requestAnimationFrame(draw);
    };

    if (reduced) {
      draw(performance.now());
    } else {
      raf = window.requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [count, opacity, onScreen]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      tabIndex={-1}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
