"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/cn";

/* ─────────────────────────── context ─────────────────────────── */

type BoardCtx = {
  /** SENTENCE_DOORS id currently hovered (word tag or pinboard item) */
  activeWorld: string | null;
  setActiveWorld: (w: string | null) => void;
  /** a word tag's position marker in the sentence (thread start) */
  registerSource: (world: string, el: HTMLElement | null) => void;
  /** a pinboard item's wrapper (thread end, at its pin) */
  registerAnchor: (world: string, el: HTMLElement | null) => void;
};

const Ctx = createContext<BoardCtx>({
  activeWorld: null,
  setActiveWorld: () => {},
  registerSource: () => {},
  registerAnchor: () => {},
});

export const useBoard = () => useContext(Ctx);

/* ─────────────────────────── tape label ───────────────────────── */

/** Masking-tape strip — the board's section eyebrow. */
export function BoardLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block -rotate-1 bg-[#e3d9bd]/95 px-4 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[#3d3526] shadow-[0_8px_20px_rgba(0,0,0,0.5)]",
        className,
      )}
      style={{
        clipPath: "polygon(0.8% 0%, 99.4% 4%, 100% 88%, 98.8% 100%, 1% 97%, 0% 14%)",
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0) 26%, rgba(0,0,0,0.04) 88%, rgba(0,0,0,0.08))",
      }}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────── the wall ─────────────────────────── */

const BOARD_BG = [
  "radial-gradient(900px 540px at 18% 6%, #14141f 0%, transparent 60%)",
  "radial-gradient(820px 560px at 84% 30%, #12121d 0%, transparent 55%)",
  "radial-gradient(760px 520px at 28% 62%, #11111b 0%, transparent 55%)",
  "radial-gradient(820px 540px at 76% 88%, #13121d 0%, transparent 55%)",
  "repeating-linear-gradient(0deg, transparent 0 39px, rgba(255,255,255,0.032) 39px 40px)",
  "repeating-linear-gradient(90deg, transparent 0 39px, rgba(255,255,255,0.032) 39px 40px)",
  "#08080c",
].join(", ");

type Thread = { world: string; d: string };

const STAGGER = 0.06;

/**
 * One continuous evidence board behind the sentence, the record and the
 * close. Owns the red threads: SVG paths from each pinned word down to that
 * world's anchor pin on the board, drawn in by scroll, brightened by hover.
 */
export function BoardSurface({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sources = useRef(new Map<string, HTMLElement>());
  const anchors = useRef(new Map<string, HTMLElement>());
  const pathEls = useRef(new Map<string, SVGPathElement>());
  const [activeWorld, setActiveWorld] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const reduce = useReducedMotion();

  const registerSource = useCallback((world: string, el: HTMLElement | null) => {
    if (el) sources.current.set(world, el);
    else sources.current.delete(world);
  }, []);
  const registerAnchor = useCallback((world: string, el: HTMLElement | null) => {
    if (el) anchors.current.set(world, el);
    else anchors.current.delete(world);
  }, []);

  /* measure word pins + anchor pins → sagging string paths, in wrapper px */
  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    if (wr.width === 0) return;
    const pts: { world: string; x1: number; y1: number; x2: number; y2: number }[] = [];
    sources.current.forEach((src, world) => {
      const anc = anchors.current.get(world);
      if (!anc) return;
      const sr = src.getBoundingClientRect();
      const ar = anc.getBoundingClientRect();
      if (sr.width === 0 || ar.width === 0) return;
      pts.push({
        world,
        x1: sr.left - wr.left + sr.width / 2,
        y1: sr.top - wr.top + Math.min(16, sr.height * 0.18),
        x2: ar.left - wr.left + ar.width / 2,
        y2: ar.top - wr.top + 3,
      });
    });
    pts.sort((a, b) => a.x1 - b.x1);
    setThreads(
      pts.map((p, i) => {
        // taut string with a slight bow — alternate the bow's direction
        const bow = (i % 2 === 0 ? 1 : -1) * (26 + (i % 3) * 14);
        const mx = (p.x1 + p.x2) / 2 + bow;
        const my = (p.y1 + p.y2) / 2 + 34;
        return { world: p.world, d: `M ${p.x1} ${p.y1} Q ${mx} ${my} ${p.x2} ${p.y2}` };
      }),
    );
    setSize({ w: wrap.offsetWidth, h: wrap.offsetHeight });
  }, []);

  useEffect(() => {
    measure();
    // re-measure after fonts + images settle (token reveal masks are static, so timing is forgiving)
    const timers = [400, 1200, 2800].map((t) => setTimeout(measure, t));
    document.fonts?.ready.then(() => measure()).catch(() => {});
    const ro = new ResizeObserver(() => measure());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => {
      timers.forEach(clearTimeout);
      ro.disconnect();
    };
  }, [measure]);

  /* scroll-drawn: progress 0 as the board enters, 1 once the record is centered */
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["0 0.85", "0.45 0.5"],
  });

  const apply = useCallback(
    (p: number) => {
      const n = threads.length;
      threads.forEach((t, i) => {
        const el = pathEls.current.get(t.world);
        if (!el) return;
        const len = parseFloat(el.dataset.len ?? "0");
        if (!len) return;
        const local = reduce ? 1 : Math.min(1, Math.max(0, p * (1 + STAGGER * (n - 1)) - STAGGER * i));
        el.style.strokeDashoffset = String(len * (1 - local));
      });
    },
    [threads, reduce],
  );

  /* set up dashes whenever geometry changes */
  useEffect(() => {
    threads.forEach((t) => {
      const el = pathEls.current.get(t.world);
      if (!el) return;
      const len = el.getTotalLength();
      el.dataset.len = String(len);
      el.style.strokeDasharray = String(len);
    });
    apply(scrollYProgress.get());
  }, [threads, apply, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <Ctx.Provider value={{ activeWorld, setActiveWorld, registerSource, registerAnchor }}>
      <div ref={wrapRef} className="relative" style={{ background: BOARD_BG }}>
        {size && threads.length > 0 && (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] hidden h-full w-full md:block"
            viewBox={`0 0 ${size.w} ${size.h}`}
            preserveAspectRatio="none"
          >
            {threads.map((t) => {
              const lit = activeWorld === t.world;
              const dimmed = activeWorld !== null && !lit;
              return (
                <path
                  key={t.world}
                  ref={(el) => {
                    if (el) pathEls.current.set(t.world, el);
                    else pathEls.current.delete(t.world);
                  }}
                  d={t.d}
                  fill="none"
                  stroke="#c43e2c"
                  strokeWidth={lit ? 2.4 : 1.5}
                  strokeLinecap="round"
                  opacity={lit ? 0.95 : dimmed ? 0.22 : 0.5}
                  className="transition-[stroke-width,opacity] duration-300"
                  style={lit ? { filter: "drop-shadow(0 0 6px rgba(196,62,44,0.6))" } : undefined}
                />
              );
            })}
          </svg>
        )}

        <div className="relative z-[2]">{children}</div>

        {/* the wall fades back into the page before the footer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-24"
          style={{ background: "linear-gradient(to bottom, transparent, #07070a)" }}
        />
      </div>
    </Ctx.Provider>
  );
}
