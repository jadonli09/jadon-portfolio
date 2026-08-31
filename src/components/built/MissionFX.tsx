"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useSpring } from "motion/react";
import { Counter } from "@/components/primitives/Counter";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";

/* ────────────────────────────────────────────────────────────────────
   MissionFX — the built world's atmosphere kit.
   DustField · MissionRail · CoordsHUD · DecodeText · StatValue · AcornBurst
   ──────────────────────────────────────────────────────────────────── */

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ── 1. DustField — sparse specks drifting through the hero ───────── */

type Speck = {
  x: number;
  y: number;
  r: number;
  a: number;
  vx: number;
  vy: number;
};

type Streak = { x: number; y: number; vx: number; vy: number; life: number } | null;

export function DustField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let specks: Speck[] = [];
    let streak: Streak = null;
    let nextStreakAt = performance.now() + 4000 + Math.random() * 4000;
    let last = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const count = Math.round((width * height) / 26000);
      specks = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.5 + Math.random() * 1.1,
        a: 0.08 + Math.random() * 0.3,
        vx: -3 - Math.random() * 7,
        vy: -1 - Math.random() * 3,
      }));
    }

    function frame(now: number) {
      if (!canvas || !ctx) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#f2f1ec";
      for (const s of specks) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (s.x < -4) s.x = w + 4;
        if (s.y < -4) s.y = h + 4;
        ctx.globalAlpha = s.a;
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }

      // Occasional streaking particle — a shooting speck with a tail.
      if (!streak && now > nextStreakAt) {
        streak = {
          x: w * (0.3 + Math.random() * 0.6),
          y: -10,
          vx: -160 - Math.random() * 120,
          vy: 90 + Math.random() * 60,
          life: 1,
        };
        nextStreakAt = now + 6000 + Math.random() * 8000;
      }
      if (streak) {
        streak.x += streak.vx * dt;
        streak.y += streak.vy * dt;
        streak.life -= dt * 0.7;
        if (streak.life <= 0 || streak.x < -60 || streak.y > h + 60) {
          streak = null;
        } else {
          ctx.globalAlpha = Math.max(streak.life, 0) * 0.7;
          ctx.strokeStyle = "#f2f1ec";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(streak.x, streak.y);
          ctx.lineTo(streak.x - streak.vx * 0.12, streak.y - streak.vy * 0.12);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    resize();
    // Only animate while the hero is on screen.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);
    window.addEventListener("resize", resize);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden
    />
  );
}

/* ── 2. MissionRail — fixed scroll-progress telemetry on the right ── */

/**
 * One stop per real section of `/built`, in page order. `anchor` is the id the
 * page actually renders, so the rail's positions are read off the live document
 * instead of hard-coded fractions — the previous version still announced a
 * GitHub section that had been deleted and an "end of transmission" the spec
 * cut. Each label names the section it marks; nothing decorative.
 */
const STOPS: { anchor: string | null; label: string }[] = [
  { anchor: null, label: "Things I've built" },
  { anchor: "acornprep", label: "M-01 · AcornPrep" },
  { anchor: "hermes", label: "M-02 · Hermes" },
  { anchor: "notebookli", label: "M-03 · NotebookLI" },
  { anchor: "fleet", label: "M-04–08 · The fleet" },
];

/** Each stop's position as a fraction of total scroll, measured from the DOM. */
function measureStops(): number[] {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return STOPS.map((s) => {
    if (!s.anchor || max <= 0) return 0;
    const el = document.getElementById(s.anchor);
    if (!el) return 0;
    return Math.min(1, (el.getBoundingClientRect().top + window.scrollY) / max);
  });
}

export function MissionRail() {
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [stage, setStage] = useState(0);
  // Even spacing is only the pre-measurement placeholder; the observer below
  // replaces it with the real section offsets before the first paint settles.
  const [stops, setStops] = useState<number[]>(() => STOPS.map((_, i) => i / STOPS.length));
  const stopsRef = useRef(stops);

  // Re-measure whenever the page's height changes — images finishing, the
  // viewport resizing, a section being added. ResizeObserver fires once on
  // observe, which is also the initial measurement.
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const next = measureStops();
      stopsRef.current = next;
      setStops(next);
    });
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  useEffect(
    () =>
      scrollYProgress.on("change", (v) => {
        const at = stopsRef.current;
        let s = 0;
        for (let i = 0; i < at.length; i++) if (v >= at[i]) s = i;
        setStage(s);
      }),
    [scrollYProgress],
  );

  return (
    <div
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
      aria-hidden
    >
      {/* Track */}
      <div className="relative h-[34vh] w-[1.5px] bg-[var(--line)]">
        <motion.div
          className="absolute inset-x-0 top-0 origin-top bg-[var(--accent)]"
          style={{ scaleY: fill, height: "100%" }}
        />
        {/* Stage ticks */}
        {STOPS.map((s, i) => (
          <div
            key={s.label}
            className="absolute -left-[3.25px] size-2 border-[1.5px] transition-colors duration-500"
            style={{
              top: `${(stops[i] ?? 0) * 100}%`,
              borderColor: i <= stage ? "var(--accent)" : "var(--line)",
              background: i <= stage ? "var(--accent)" : "var(--bg)",
            }}
          />
        ))}
      </div>

      {/* Current stage label */}
      <p
        data-rail-label
        className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[var(--muted)]"
        style={{ writingMode: "vertical-rl" }}
      >
        {STOPS[stage].label}
      </p>
    </div>
  );
}

/* ── 3. CoordsHUD — targeting-console readout trailing the cursor ── */

export function CoordsHUD({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;

    function move(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    function leave() {
      setPos(null);
    }
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [containerRef]);

  if (!pos) return null;
  const fmt = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

  return (
    <div
      className="pointer-events-none absolute z-30 hidden select-none md:block"
      style={{ left: pos.x + 20, top: pos.y + 22 }}
      aria-hidden
    >
      <p className="font-mono text-[0.55rem] tracking-[0.2em] text-[var(--muted)]">
        X:{fmt(pos.x)} · Y:{fmt(pos.y)}
      </p>
    </div>
  );
}

/* ── 4. DecodeText — headline acquires signal, char by char ───────── */

const GLYPHS = "#/<>*+=0123456789XZ$%&";

export function DecodeText({
  text,
  className,
  duration = 0.9,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    // With reduced motion, never start the overlay — the plain text shows.
    if (!inView || prefersReducedMotion()) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const resolved = Math.floor(p * text.length);
      let out = text.slice(0, resolved);
      for (let i = resolved; i < text.length; i++) {
        const c = text[i];
        out += c === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, duration]);

  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      {/* Real text reserves layout; overlay shows the decode. */}
      <span className={display === null || display === text ? undefined : "invisible"}>
        {text}
      </span>
      {display !== null && display !== text && (
        <span className="absolute inset-0" aria-hidden>
          {display}
        </span>
      )}
    </span>
  );
}

/* ── 5. StatValue — odometer for telemetry strings ────────────────── */

/** Parses "500+", "13,000", "#1", "~$700", "05" → animated Counter.
 *  Anything it can't safely animate (e.g. "Live", "Aug '26") renders as-is. */
export function StatValue({ value, className }: { value: string; className?: string }) {
  const m = value.match(/^([~$#]{0,2})(\d[\d,]*)([+%]?)$/);
  if (!m) return <span className={className}>{value}</span>;

  const [, rawPrefix, rawNum, rawSuffix] = m;
  const to = parseInt(rawNum.replace(/,/g, ""), 10);
  if (Number.isNaN(to)) return <span className={className}>{value}</span>;

  // Preserve leading zeros ("05") by folding them into the prefix.
  const zeros = rawNum.match(/^0+(?=\d)/)?.[0] ?? "";

  return (
    <Counter
      to={to}
      prefix={rawPrefix + zeros}
      suffix={rawSuffix}
      duration={1.4}
      className={className}
    />
  );
}

/* ── 6. AcornBurst — the flagship mascot, clickable ───────────────── */

type Mini = { id: number; dx: number; dy: number; rot: number; size: number };

export function AcornBurst({ className }: { className?: string }) {
  const [minis, setMinis] = useState<Mini[]>([]);
  const [shipped, setShipped] = useState(0);
  const nextId = useRef(0);

  const burst = useCallback(() => {
    setShipped((n) => n + 1);
    if (prefersReducedMotion()) return;
    const batch: Mini[] = Array.from({ length: 12 }, () => ({
      id: nextId.current++,
      dx: (Math.random() - 0.5) * 360,
      dy: -60 - Math.random() * 240,
      rot: (Math.random() - 0.5) * 540,
      size: 16 + Math.random() * 22,
    }));
    setMinis((prev) => [...prev, ...batch]);
    const ids = new Set(batch.map((b) => b.id));
    setTimeout(() => setMinis((prev) => prev.filter((p) => !ids.has(p.id))), 1500);
  }, []);

  return (
    <motion.div
      className={cn("pointer-events-auto relative cursor-pointer select-none", className)}
      data-cursor-hover
      onClick={burst}
      whileHover={{ rotate: -6, scale: 1.04 }}
      whileTap={{ scale: 0.92, rotate: -16 }}
      transition={{ type: "spring", stiffness: 260, damping: 14 }}
      role="button"
      aria-label="AcornPrep acorn — click it"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          burst();
        }
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/img/acornprep-acorn.png")}
        alt=""
        loading="lazy"
        className="h-full w-full object-contain drop-shadow-[0_28px_70px_rgba(232,148,28,0.28)]"
        draggable={false}
      />

      {/* Mini acorn confetti */}
      <AnimatePresence>
        {minis.map((mn) => (
          <motion.img
            key={mn.id}
            src={asset("/img/acornprep-acorn.png")}
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/3"
            style={{ width: mn.size, height: mn.size }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
            animate={{
              x: mn.dx,
              y: mn.dy + 320,
              opacity: 0,
              rotate: mn.rot,
              scale: 1,
            }}
            transition={{ duration: 1.4, ease: [0.2, 0.6, 0.4, 1] }}
          />
        ))}
      </AnimatePresence>

      {/* Shipped counter stamp */}
      <AnimatePresence>
        {shipped > 0 && (
          <motion.div
            key={shipped}
            className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap border border-[var(--accent)] bg-[var(--bg)] px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[var(--accent)]"
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Shipped ×{shipped}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
