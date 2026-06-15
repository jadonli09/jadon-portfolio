"use client";

import { useEffect, useRef } from "react";

/**
 * Ember Constellation — a cursor-tracking field of dots that swell and glow
 * warm (amber → oxblood → hot) as the pointer passes, fading back to a dim
 * resting grid. Full-bleed canvas, pointer-events:none, meant to sit behind
 * page content (low z-index, below the site's custom z-70 cursor).
 *
 * Adapted from the 21st.dev "Interactive Dots" proximity-glow pattern, recoloured
 * to the contact world's ember palette and extended with an idle twinkle, an
 * auto-drifting focal point for touch devices, and a reduced-motion fallback.
 *
 * Behaviour by capability:
 *   - fine pointer + motion OK  → dots track the real cursor
 *   - coarse pointer + motion OK → dots track a slow auto-drifting focal point
 *   - prefers-reduced-motion     → one static dim grid, no rAF, no listeners
 *
 * No external dependencies (plain canvas 2D).
 */

type RGB = [number, number, number];

const COLD: RGB = [232, 177, 90]; // --accent  amber  (#e8b15a) — far / resting
const WARM: RGB = [217, 96, 63]; //  --accent-2 oxblood (#d9603f) — mid heat
const HOT: RGB = [255, 240, 214]; // warm white — right under the cursor

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export function EmberConstellation({
  className = "",
  /** Centre-to-centre dot spacing in CSS px (auto-bumped on small screens). */
  spacing = 30,
  /** Pixel radius of the cursor's influence. */
  influence = 170,
}: {
  className?: string;
  spacing?: number;
  influence?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let dots: { x: number; y: number; phase: number }[] = [];
    let gap = spacing;

    // Smoothed focal point (where the heat is). Starts off-screen so the grid
    // boots up calm and dim.
    let fx = -9999;
    let fy = -9999;
    let tx = -9999; // target (raw pointer / drift)
    let ty = -9999;

    function build() {
      const w = window.innerWidth;
      const h = canvas!.clientHeight || window.innerHeight;
      // Wider spacing on small screens keeps the dot count (and cost) sane.
      gap = w < 640 ? spacing + 10 : spacing;

      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      let i = 0;
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2; y < h; y += gap) {
          dots.push({ x, y, phase: (i++ % 9) * 0.7 });
        }
      }
    }

    function paint(time: number) {
      const w = canvas!.clientWidth || window.innerWidth;
      const h = canvas!.clientHeight || window.innerHeight;
      ctx!.clearRect(0, 0, w, h);

      const inf2 = influence * influence;

      for (const d of dots) {
        const dx = d.x - fx;
        const dy = d.y - fy;
        const dist2 = dx * dx + dy * dy;

        // Proximity 0 (far / edge) → 1 (right under the focal point).
        let near = 0;
        if (dist2 < inf2) {
          near = 1 - Math.sqrt(dist2) / influence;
          near = near * near; // ease-in so the glow stays tight
        }

        // Idle twinkle keeps the resting field alive without the cursor.
        const tw = reduced ? 0 : (Math.sin(time * 0.0014 + d.phase) + 1) * 0.5; // 0..1

        const baseR = 0.9 + tw * 0.5;
        const r = baseR + near * 3.2;

        const alpha = 0.1 + tw * 0.06 + near * 0.85;

        // Colour ramps amber → oxblood → hot as a dot gets closer.
        let col: RGB;
        if (near < 0.6) col = mix(COLD, WARM, near / 0.6);
        else col = mix(WARM, HOT, (near - 0.6) / 0.4);

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`;
        if (near > 0.25) {
          ctx!.shadowColor = `rgba(${col[0]},${col[1]},${col[2]},${near})`;
          ctx!.shadowBlur = 8 * near;
        } else {
          ctx!.shadowBlur = 0;
        }
        ctx!.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.shadowBlur = 0;
    }

    build();

    // Reduced motion: one static, calm frame and we're done.
    if (reduced) {
      paint(0);
      const onResize = () => {
        build();
        paint(0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = canvas!.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    if (fine) window.addEventListener("mousemove", onMove);

    const onResize = () => build();
    window.addEventListener("resize", onResize);

    const loop = (time: number) => {
      // Touch / no fine pointer → a slow Lissajous drift so the field still breathes.
      if (!fine) {
        const w = canvas!.clientWidth || window.innerWidth;
        const h = canvas!.clientHeight || window.innerHeight;
        tx = w * (0.5 + 0.32 * Math.sin(time * 0.00026));
        ty = h * (0.5 + 0.3 * Math.cos(time * 0.00021));
      }
      // Ease the focal point toward its target for buttery motion.
      fx += (tx - fx) * 0.12;
      fy += (ty - fy) * 0.12;

      paint(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (fine) window.removeEventListener("mousemove", onMove);
    };
  }, [spacing, influence]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
