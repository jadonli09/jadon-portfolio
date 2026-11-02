"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Intro: light rays stream in toward the centre, "LOCKED IN" assembles from
 * pixels riding those rays, then the whole screen breaks into tiles that
 * shrink away to reveal the hero underneath. One canvas, once per session.
 */

const BG = "#07070a";
const INK = "#f4f1ea";
const AMBER = "#e8b15a";

/** Timeline, ms. */
const T_ASSEMBLE = 250;
const T_SETTLED = 1750;
const T_EXIT = 2250;
const T_DONE = 3150;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

type Pixel = { tx: number; ty: number; sx: number; sy: number; delay: number; dur: number; amber: boolean };
type Tile = { x: number; y: number; start: number };

export function Preloader() {
  const [show, setShow] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("jl_intro");
    } catch {}
    if (seen) {
      queueMicrotask(() => setShow(false));
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      queueMicrotask(() => setShow(false));
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const cx = W / 2;
    const cy = H / 2;
    const reach = Math.hypot(W, H) / 2;

    let raf = 0;
    let stopped = false;

    const finish = () => {
      try {
        sessionStorage.setItem("jl_intro", "1");
      } catch {}
      setShow(false);
    };

    const start = async () => {
      const family = getComputedStyle(document.body).getPropertyValue("--font-anton").trim() || "Impact";
      const size = Math.min(W * 0.17, H * 0.3);
      const font = `400 ${size}px ${family}, Impact, sans-serif`;
      try {
        await Promise.race([document.fonts.load(font), new Promise((r) => setTimeout(r, 600))]);
      } catch {}
      if (stopped) return;

      // Crisp text, drawn once offscreen.
      const text = document.createElement("canvas");
      text.width = W * dpr;
      text.height = H * dpr;
      const tctx = text.getContext("2d")!;
      tctx.scale(dpr, dpr);
      tctx.font = font;
      tctx.textAlign = "center";
      tctx.textBaseline = "middle";
      tctx.fillStyle = INK;
      tctx.fillText("LOCKED IN", cx, cy);

      // Sample the text into a pixel grid. Each pixel starts far out along the
      // ray that runs through its target, so the letters arrive on the light.
      const cell = Math.max(4, Math.round(size / 26));
      const data = tctx.getImageData(0, 0, text.width, text.height).data;
      const pixels: Pixel[] = [];
      for (let y = cell / 2; y < H; y += cell) {
        for (let x = cell / 2; x < W; x += cell) {
          const i = (Math.floor(y * dpr) * text.width + Math.floor(x * dpr)) * 4;
          if (data[i + 3] < 128) continue;
          const a = Math.atan2(y - cy, x - cx) + (Math.random() - 0.5) * 0.08;
          const r = reach * (1.05 + Math.random() * 0.5);
          pixels.push({
            tx: x - cell / 2,
            ty: y - cell / 2,
            sx: cx + Math.cos(a) * r,
            sy: cy + Math.sin(a) * r,
            delay: Math.random() * 650 + ((x - (cx - W / 2)) / W) * 250,
            dur: 650 + Math.random() * 350,
            amber: Math.random() < 0.12,
          });
        }
      }

      // Exit tiles: closest to the centre go first.
      const tileSize = Math.max(36, Math.round(Math.min(W, H) / 14));
      const tiles: Tile[] = [];
      for (let y = 0; y < H; y += tileSize) {
        for (let x = 0; x < W; x += tileSize) {
          const d = Math.hypot(x + tileSize / 2 - cx, y + tileSize / 2 - cy) / reach;
          tiles.push({ x, y, start: T_EXIT + d * 520 + Math.random() * 160 });
        }
      }
      const snapshot = document.createElement("canvas");
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      let snapped = false;

      const RAYS = 72;
      const rayAngles = Array.from({ length: RAYS }, (_, k) => (k / RAYS) * Math.PI * 2 + Math.random() * 0.05);
      const rayWidths = rayAngles.map(() => 0.006 + Math.random() * 0.018);
      const rayPhase = rayAngles.map(() => Math.random());

      const drawScene = (t: number) => {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, W, H);

        // Rays: bright bands travel inward from the edges, then settle to a glow.
        const rayIn = clamp01(t / 500);
        const rayOut = 1 - 0.75 * clamp01((t - T_SETTLED) / 500);
        const level = rayIn * rayOut;
        if (level > 0) {
          ctx.globalCompositeOperation = "lighter";
          const spin = t * 0.00004;
          for (let k = 0; k < RAYS; k++) {
            const a = rayAngles[k] + spin;
            const w = rayWidths[k];
            const head = 1 - ((t / 1400 + rayPhase[k]) % 1);
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, reach);
            const lo = Math.max(0, head - 0.25);
            const hi = Math.min(1, head + 0.04);
            g.addColorStop(0, `rgba(232,177,90,${0.1 * level})`);
            g.addColorStop(lo, "rgba(232,177,90,0)");
            g.addColorStop(clamp01(head), `rgba(255,226,170,${0.22 * level})`);
            g.addColorStop(hi, "rgba(232,177,90,0)");
            g.addColorStop(1, "rgba(232,177,90,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, reach, a - w, a + w);
            ctx.closePath();
            ctx.fill();
          }
          const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.45);
          glow.addColorStop(0, `rgba(232,177,90,${0.16 * level})`);
          glow.addColorStop(1, "rgba(232,177,90,0)");
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, W, H);
          ctx.globalCompositeOperation = "source-over";
        }

        // Pixels travel in, then the crisp text fades over them.
        const crisp = clamp01((t - (T_SETTLED - 250)) / 350);
        if (crisp < 1) {
          const gap = Math.max(1, cell * 0.18);
          for (const p of pixels) {
            const k = easeOut(clamp01((t - T_ASSEMBLE - p.delay) / p.dur));
            if (k <= 0) continue;
            const x = p.sx + (p.tx - p.sx) * k;
            const y = p.sy + (p.ty - p.sy) * k;
            ctx.globalAlpha = Math.min(1, k * 1.6) * (1 - crisp);
            ctx.fillStyle = p.amber && k < 0.98 ? AMBER : INK;
            ctx.fillRect(x, y, cell - gap, cell - gap);
          }
          ctx.globalAlpha = 1;
        }
        if (crisp > 0) {
          ctx.globalAlpha = crisp;
          ctx.drawImage(text, 0, 0, W, H);
          ctx.globalAlpha = 1;
        }
      };

      const t0 = performance.now();

      if (reduce) {
        drawScene(T_SETTLED + 400);
        const id = window.setTimeout(finish, 900);
        cleanupTimer = () => clearTimeout(id);
        return;
      }

      const frame = (now: number) => {
        if (stopped) return;
        const t = now - t0;
        if (t < T_EXIT) {
          drawScene(t);
        } else {
          if (!snapped) {
            drawScene(T_EXIT);
            if (wrapRef.current) wrapRef.current.style.background = "transparent";
            snapshot.getContext("2d")!.drawImage(canvas, 0, 0);
            snapped = true;
          }
          // Each tile shrinks toward its own centre, uncovering the page.
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          for (const tile of tiles) {
            const k = easeInOut(clamp01((t - tile.start) / 300));
            if (k >= 1) continue;
            const s = tileSize * (1 - k);
            const off = (tileSize - s) / 2;
            ctx.globalAlpha = 1 - k * 0.4;
            ctx.drawImage(
              snapshot,
              tile.x * dpr,
              tile.y * dpr,
              tileSize * dpr,
              tileSize * dpr,
              tile.x + off,
              tile.y + off,
              s,
              s,
            );
          }
          ctx.globalAlpha = 1;
        }
        if (t >= T_DONE) {
          finish();
          return;
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    let cleanupTimer = () => {};
    start();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      cleanupTimer();
    };
  }, []);

  if (!show) return null;
  return (
    // The wrapper holds the screen dark until the tiles start lifting away.
    <div ref={wrapRef} className="fixed inset-0 z-[80]" style={{ background: BG }} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
