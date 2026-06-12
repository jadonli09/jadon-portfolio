"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";

type Phase = "enter" | "exit";

type Stage =
  | { kind: "idle" }
  | { kind: "run"; world: string; phase: Phase } // enter covers the screen pre-navigation; exit reveals the new page
  | { kind: "subtle" };

/** Hard ceiling per active stage — the page must never stay trapped behind the overlay. */
const FAILSAFE_MS = 4200;

/** How long each world's exit animation needs before the overlay unmounts. */
const EXIT_MS: Record<string, number> = {
  civic: 600,
  court: 650,
  leadership: 650,
  research: 500,
  built: 700,
  lockedin: 550,
  about: 650,
};

/* ───────────────────────── per-world transitions ─────────────────────────
   Contract: at the end of `enter` (~450ms) the screen must be fully covered —
   navigation happens beneath it — and `exit` reveals the destination page. */

/** civic — the storyteller: a camera double-flash. */
function CivicFlash({ phase }: { phase: Phase }) {
  return (
    <motion.div className="absolute inset-0 bg-white" initial={{ opacity: 0 }} animate={phase === "enter" ? { opacity: [0, 1, 0.55, 1] } : { opacity: 0 }} transition={phase === "enter" ? { duration: 0.4, times: [0, 0.3, 0.55, 1], ease: "easeOut" } : { duration: 0.55, ease: "easeOut" }}>
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.35)_100%)]" />
    </motion.div>
  );
}

/** court — the competitor: a basketball streaks past, dragging a court-orange wipe. */
function CourtSwish({ phase }: { phase: Phase }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-y-0 -left-[10%] w-[140%] [background:linear-gradient(105deg,#1a0d06,#e04e12_45%,#8a2f0a)]"
        style={{ transform: "skewX(-8deg)" }}
        initial={{ x: "-115%" }}
        animate={phase === "enter" ? { x: "0%" } : { x: "115%" }}
        transition={{ duration: phase === "enter" ? 0.42 : 0.55, ease: EASE }}
      />
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute top-[34vh] h-24 w-24 drop-shadow-[0_10px_24px_rgba(0,0,0,0.6)]"
        initial={{ x: "-20vw", y: "14vh", rotate: 0 }}
        animate={phase === "enter" ? { x: "105vw", y: ["14vh", "-6vh", "10vh"], rotate: 540 } : { x: "120vw", opacity: 0 }}
        transition={phase === "enter" ? { duration: 0.6, ease: "easeIn", times: [0, 0.5, 1] } : { duration: 0.2 }}
      >
        <circle cx="50" cy="50" r="48" fill="#e8762e" stroke="#2a1206" strokeWidth="2.5" />
        <path d="M2 50 H98 M50 2 V98 M14 14 C 38 38 38 62 14 86 M86 14 C 62 38 62 62 86 86" fill="none" stroke="#2a1206" strokeWidth="2.5" />
      </motion.svg>
    </div>
  );
}

/** leadership — the operator: a gold banner drops and the presidential seal stamps it. */
function LeadershipSeal({ phase }: { phase: Phase }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 [background:linear-gradient(180deg,#2a2008,#b07c1e_30%,#d9a83f_55%,#1c1506)]"
        initial={{ y: "-100%" }}
        animate={phase === "enter" ? { y: "0%" } : { y: "100%" }}
        transition={{ duration: phase === "enter" ? 0.42 : 0.55, ease: EASE }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-[#5c3d0c] bg-[#d9a83f] font-anton text-3xl text-[#3b2a08] shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
        initial={{ scale: 2.6, opacity: 0, rotate: -16 }}
        animate={phase === "enter" ? { scale: 1, opacity: 1, rotate: -8 } : { opacity: 0, scale: 1.05 }}
        transition={phase === "enter" ? { duration: 0.3, delay: 0.28, ease: "easeIn" } : { duration: 0.3 }}
      >
        <span className="rounded-full border-2 border-dashed border-[#5c3d0c] px-3 py-4">3×</span>
      </motion.div>
    </div>
  );
}

/** research — the scientist: terminal blackout, a lime scanline, a command running. */
function ResearchScan({ phase }: { phase: Phase }) {
  return (
    <motion.div
      className="absolute inset-0 bg-[#08090b]"
      initial={{ opacity: 0 }}
      animate={phase === "enter" ? { opacity: 1 } : { scaleY: 0.004, opacity: [1, 1, 0] }}
      transition={phase === "enter" ? { duration: 0.16 } : { duration: 0.42, times: [0, 0.8, 1], ease: "easeIn" }}
      style={{ transformOrigin: "50% 50%" }}
    >
      <motion.div
        className="absolute inset-x-0 h-[3px] bg-[#bcff46] shadow-[0_0_24px_4px_rgba(188,255,70,0.5)]"
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-[#bcff46]">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          visitor@deg-console:~$ cd /research && run
        </motion.span>
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }}>▮</motion.span>
      </p>
    </motion.div>
  );
}

/** built — the builder: the screen assembles tile by tile, then dismantles. */
function BuiltTiles({ phase }: { phase: Phase }) {
  const COLS = 8;
  const ROWS = 5;
  const tiles = Array.from({ length: COLS * ROWS }, (_, i) => i);
  return (
    <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
      {tiles.map((i) => (
        <motion.div
          key={i}
          className="[background:linear-gradient(150deg,#1b2046,#4f5fd6_120%)] outline outline-1 outline-[#0c0e22]"
          initial={{ scale: 0, opacity: 0 }}
          animate={phase === "enter" ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.22, delay: ((i * 11) % (COLS * ROWS)) * 0.008, ease: "easeOut" }}
          style={{ transformOrigin: "50% 50%" }}
        />
      ))}
    </div>
  );
}

/** lockedin — the pursuit: a camcorder viewfinder blinks REC. */
function LockedRec({ phase }: { phase: Phase }) {
  const corner = "absolute h-10 w-10 border-[#f4f1ea]/80";
  return (
    <motion.div className="absolute inset-0 bg-[#08070b]" initial={{ opacity: 0 }} animate={phase === "enter" ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: phase === "enter" ? 0.22 : 0.45, ease: "easeOut" }}>
      <motion.div className="absolute inset-8" initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.08 }}>
        <div className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
        <div className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
        <div className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
        <div className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
        <div className="absolute left-2 top-2 flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-[#f4f1ea]">
          <motion.span className="inline-block h-2.5 w-2.5 rounded-full bg-[#e8385c]" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
          REC
        </div>
        <div className="absolute right-2 top-2 font-mono text-xs tracking-[0.2em] text-[#b48cff]">DAY 372</div>
      </motion.div>
    </motion.div>
  );
}

/** about — the person: a Mission Peak dawn sweeps up and through. */
function AboutDawn({ phase }: { phase: Phase }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 [background:linear-gradient(180deg,#b48cff_0%,#e8689c_38%,#ffb43d_72%,#7a4a14_100%)]"
        initial={{ y: "100%" }}
        animate={phase === "enter" ? { y: "0%" } : { y: "-100%" }}
        transition={{ duration: phase === "enter" ? 0.45 : 0.55, ease: EASE }}
      >
        <motion.div
          className="absolute left-1/2 top-[58%] h-40 w-40 -translate-x-1/2 rounded-full bg-[#ffd97a] blur-2xl"
          initial={{ y: 80, opacity: 0.4 }}
          animate={{ y: 0, opacity: 0.9 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  );
}

/** Reduced-motion fallback for every world: a plain dark cover fade. */
function PlainFade({ phase }: { phase: Phase }) {
  return (
    <motion.div className="absolute inset-0 bg-[#070709]" initial={{ opacity: 0 }} animate={{ opacity: phase === "enter" ? 1 : 0 }} transition={{ duration: 0.3 }} />
  );
}

const TRANSITIONS: Record<string, React.ComponentType<{ phase: Phase }>> = {
  civic: CivicFlash,
  court: CourtSwish,
  leadership: LeadershipSeal,
  research: ResearchScan,
  built: BuiltTiles,
  lockedin: LockedRec,
  about: AboutDawn,
};

/* ───────────────────────────── the shell ───────────────────────────── */

/**
 * Per-world page transitions. `develop:start` (from ContactSheet) names the
 * destination world; that world's transition covers the screen, navigation
 * happens beneath it, and the pathname change flips it to its exit phase,
 * revealing the new page. Plain hard loads get a subtle backdrop develop.
 */
export function Develop() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const stageRef = useRef(stage);
  stageRef.current = stage;
  const lastPath = useRef(pathname);
  const exitTimer = useRef<number | null>(null);

  // Failsafe: any non-idle stage self-clears.
  useEffect(() => {
    if (stage.kind === "idle") return;
    const t = window.setTimeout(() => setStage({ kind: "idle" }), FAILSAFE_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  // The exit timer must not outlive the component.
  useEffect(
    () => () => {
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    },
    [],
  );

  // Click side: start the destination world's transition.
  useEffect(() => {
    const onStart = (e: Event) => {
      const d = (e as CustomEvent).detail as { world?: string } | undefined;
      if (typeof d?.world === "string") setStage({ kind: "run", world: d.world, phase: "enter" });
    };
    window.addEventListener("develop:start", onStart);
    return () => window.removeEventListener("develop:start", onStart);
  }, []);

  // Arrival: pathname changed while covered -> play the exit, then unmount.
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    const s = stageRef.current;
    if (s.kind === "run") {
      setStage({ kind: "run", world: s.world, phase: "exit" });
      exitTimer.current = window.setTimeout(() => setStage({ kind: "idle" }), EXIT_MS[s.world] ?? 650);
    }
  }, [pathname]);

  // Hard load: a subtle backdrop develop (skipped for reduced motion).
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage({ kind: "subtle" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Transition = stage.kind === "run" ? (reduced ? PlainFade : TRANSITIONS[stage.world] ?? PlainFade) : null;

  return (
    <AnimatePresence>
      {stage.kind === "run" && Transition && (
        <motion.div key={`run-${stage.world}`} className="fixed inset-0 z-[60]" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
          <Transition phase={stage.phase} />
        </motion.div>
      )}
      {stage.kind === "subtle" && (
        <motion.div
          key="subtle"
          className="pointer-events-none fixed inset-0 z-[60]"
          initial={{ backdropFilter: "grayscale(1) brightness(0.94)", opacity: 1 }}
          animate={{ backdropFilter: "grayscale(0) brightness(1)", opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          onAnimationComplete={() => setStage({ kind: "idle" })}
        />
      )}
    </AnimatePresence>
  );
}
