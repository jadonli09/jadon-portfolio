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
const FAILSAFE_MS = 4500;

/** How long each world's exit animation needs before the overlay unmounts. */
const EXIT_MS: Record<string, number> = {
  civic: 750,
  court: 750,
  leadership: 750,
  research: 650,
  built: 800,
  lockedin: 650,
  about: 750,
};

/* ───────────────────────── per-world transitions ─────────────────────────
   Contract: by ~500ms into `enter` the screen must be fully covered —
   navigation fires at 650ms — and `exit` reveals the destination page. */

/** civic — the storyteller: a boom mic drops in and the room's voice slams up as an equalizer wall. */
function CivicMic({ phase }: { phase: Phase }) {
  const BARS = 24;
  const mid = (BARS - 1) / 2;
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* equalizer wall — bars rise from the centre line outward and become the cover */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: BARS }, (_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 [background:linear-gradient(180deg,#2a0c06,#c2402c_48%,#5c1810_100%)] shadow-[inset_1px_0_0_rgba(10,4,2,0.6)]"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: phase === "enter" ? 1 : 0 }}
            transition={{
              duration: 0.3,
              delay: (phase === "enter" ? Math.abs(i - mid) : mid - Math.abs(i - mid)) * 0.02,
              ease: phase === "enter" ? "easeOut" : "easeIn",
            }}
            style={{ transformOrigin: "center" }}
          />
        ))}
      </div>
      {/* live waveform pulsing across the wall */}
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center gap-[6px]">
        {Array.from({ length: 36 }, (_, i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-[#f4ecd9]/85"
            initial={{ height: 4, opacity: 0 }}
            animate={
              phase === "enter"
                ? { height: [4, 10 + 46 * Math.abs(Math.sin(i * 1.7)), 6 + 22 * Math.abs(Math.sin(i * 2.3)), 12 + 38 * Math.abs(Math.sin(i * 1.1))], opacity: 1 }
                : { height: 3, opacity: 0 }
            }
            transition={
              phase === "enter"
                ? { duration: 0.9, delay: 0.4 + (i % 6) * 0.03, times: [0, 0.4, 0.7, 1], ease: "easeInOut" }
                : { duration: 0.25 }
            }
          />
        ))}
      </div>
      {/* the boom mic, dropping in on its cable with a little swing */}
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        initial={{ y: "-45vh" }}
        animate={phase === "enter" ? { y: "0vh", rotate: [0, -3, 2, 0] } : { y: "-50vh" }}
        transition={phase === "enter" ? { duration: 0.55, delay: 0.18, ease: EASE } : { duration: 0.4, ease: "easeIn" }}
        style={{ transformOrigin: "top center" }}
      >
        <div className="mx-auto h-[16vh] w-[3px] bg-[#120604]" />
        <svg viewBox="0 0 60 100" className="mx-auto -mt-1 h-28 w-16 drop-shadow-[0_14px_30px_rgba(0,0,0,0.55)]">
          <rect x="14" y="4" width="32" height="56" rx="16" fill="#1c0d08" stroke="#f4ecd9" strokeWidth="2.5" />
          <path d="M20 14 H40 M20 24 H40 M20 34 H40 M20 44 H40" stroke="#f4ecd9" strokeWidth="2" opacity="0.7" />
          <path d="M8 46 a22 22 0 0 0 44 0" fill="none" stroke="#f4ecd9" strokeWidth="2.5" />
          <line x1="30" y1="68" x2="30" y2="84" stroke="#f4ecd9" strokeWidth="2.5" />
        </svg>
      </motion.div>
      {/* sound rings radiating once the mic is live */}
      {phase === "enter" &&
        [0, 1].map((n) => (
          <motion.div
            key={n}
            className="absolute left-1/2 top-[24vh] h-24 w-24 -translate-x-1/2 rounded-full border border-[#f4ecd9]/60"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 3 + n, opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.7, delay: 0.62 + n * 0.16, ease: "easeOut" }}
          />
        ))}
    </div>
  );
}

/** court — the competitor: a ball with a ghost trail arcs across; the impact bursts court-orange over the screen. */
function CourtSwish({ phase }: { phase: Phase }) {
  const Ball = ({ delay, opacity }: { delay: number; opacity: number }) => (
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute top-0 h-20 w-20 drop-shadow-[0_12px_26px_rgba(0,0,0,0.55)]"
      style={{ opacity }}
      initial={{ x: "-18vw", y: "60vh", rotate: 0 }}
      animate={{ x: "112vw", y: ["60vh", "26vh", "54vh", "18vh"], rotate: 660 }}
      transition={{ duration: 0.62, delay, ease: "easeIn", times: [0, 0.38, 0.68, 1] }}
    >
      <circle cx="50" cy="50" r="48" fill="#e8762e" stroke="#2a1206" strokeWidth="2.5" />
      <path d="M2 50 H98 M50 2 V98 M14 14 C 38 38 38 62 14 86 M86 14 C 62 38 62 62 86 86" fill="none" stroke="#2a1206" strokeWidth="2.5" />
    </motion.svg>
  );
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* the burst — court orange radiating from the ball's path */}
      <motion.div
        className="absolute inset-0 [background:radial-gradient(circle_at_55%_42%,#f0a05a_0%,#e04e12_34%,#7a2a08_78%,#2a1206_100%)]"
        initial={{ clipPath: "circle(0% at 55% 42%)" }}
        animate={phase === "enter" ? { clipPath: "circle(145% at 55% 42%)" } : { clipPath: "circle(0% at 50% 50%)" }}
        transition={{ duration: phase === "enter" ? 0.5 : 0.6, delay: phase === "enter" ? 0.18 : 0, ease: EASE }}
      >
        {/* rim ring echo at the impact point */}
        <motion.div
          className="absolute left-[55%] top-[42%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70"
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: 3.4, opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
        />
        {/* seam lines sweeping across the cover */}
        <motion.div
          className="absolute inset-0 [background:repeating-linear-gradient(115deg,transparent_0_90px,rgba(42,18,6,0.25)_90px_92px)]"
          initial={{ x: "-12%" }}
          animate={{ x: "6%" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </motion.div>
      {phase === "enter" && (
        <>
          <Ball delay={0.1} opacity={0.18} />
          <Ball delay={0.05} opacity={0.4} />
          <Ball delay={0} opacity={1} />
        </>
      )}
    </div>
  );
}

/** leadership — the operator: stationery unfurls and four wax seals stamp in — one per year in the class colours (blue · yellow · black · red), no words needed. */
function LeadershipSeal({ phase }: { phase: Phase }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 [background:linear-gradient(180deg,#efe6cf_0%,#e9ddc2_55%,#d9c89e_100%)]"
        initial={{ y: "-100%" }}
        animate={phase === "enter" ? { y: "0%" } : { y: "100%" }}
        transition={{ duration: phase === "enter" ? 0.45 : 0.6, ease: EASE }}
      >
        {/* laid-paper texture */}
        <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(0deg,transparent_0_3px,rgba(140,110,50,0.05)_3px_4px)]" />
        {/* four terms, four seals — freshman to senior, in the class colours; each year a little bigger; no words */}
        {[
          { left: "20%", size: 84, delay: 0.3, rotate: -10, hi: "#4a7fd6", lo: "#1f3f8a", ring: "#1f3f8a" },
          { left: "40%", size: 98, delay: 0.42, rotate: 5, hi: "#f2cf4a", lo: "#b78a10", ring: "#b78a10" },
          { left: "60%", size: 112, delay: 0.54, rotate: -6, hi: "#3a3a40", lo: "#0c0c10", ring: "#0c0c10" },
          { left: "80%", size: 126, delay: 0.66, rotate: 4, hi: "#8e3030", lo: "#5c1717", ring: "#5c1717" },
        ].map((seal, i) => (
          <span key={i} className="absolute top-1/2" style={{ left: seal.left }}>
            <motion.div
              className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_14px_36px_rgba(30,20,10,0.5),inset_0_2px_8px_rgba(255,255,255,0.18)]"
              style={{ width: seal.size, height: seal.size, background: `radial-gradient(circle at 38% 32%, ${seal.hi}, ${seal.lo} 70%)` }}
              initial={{ scale: 2.3, opacity: 0, rotate: seal.rotate - 14 }}
              animate={phase === "enter" ? { scale: 1, opacity: 1, rotate: seal.rotate } : { opacity: 0, y: 30 }}
              transition={phase === "enter" ? { duration: 0.24, delay: seal.delay, ease: "easeIn" } : { duration: 0.35 }}
            >
              <div className="flex items-center justify-center rounded-full border-2 border-dashed border-[#d9a83f]/70" style={{ width: seal.size * 0.72, height: seal.size * 0.72 }}>
                <svg viewBox="0 0 24 24" style={{ width: seal.size * 0.4, height: seal.size * 0.4 }}>
                  <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17l-6.1 3.6 1.4-6.8L2.2 9.1l6.9-.8z" fill="#e9c87a" />
                </svg>
              </div>
            </motion.div>
            <motion.div
              className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
              style={{ width: seal.size, height: seal.size, borderColor: `${seal.ring}80` }}
              initial={{ scale: 1, opacity: 0 }}
              animate={phase === "enter" ? { scale: 1.7, opacity: [0, 0.7, 0] } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: seal.delay + 0.2, ease: "easeOut" }}
            />
          </span>
        ))}
        {/* gold foil shine sweeping the paper */}
        <motion.div
          className="absolute inset-y-0 w-1/3 [background:linear-gradient(100deg,transparent,rgba(217,168,63,0.35)_50%,transparent)]"
          initial={{ x: "-60vw", skewX: -12 }}
          animate={phase === "enter" ? { x: "130vw" } : {}}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

/** research — the scientist: the console boots, the pipeline streams, the CRT snaps off into the IDE. */
function ResearchScan({ phase }: { phase: Phase }) {
  const LOG = [
    "visitor@deg-console:~$ cd /research && run",
    "mounting /research ............. ok",
    "loading deg-console v3.1 ....... ok",
    "RNA-seq · GSE190138 · 9 pain mediators",
  ];
  return (
    <motion.div
      className="absolute inset-0 bg-[#08090b]"
      initial={{ opacity: 0 }}
      animate={phase === "enter" ? { opacity: 1 } : { scaleY: 0.004, opacity: [1, 1, 0] }}
      transition={phase === "enter" ? { duration: 0.16 } : { duration: 0.45, times: [0, 0.82, 1], ease: "easeIn" }}
      style={{ transformOrigin: "50% 50%" }}
    >
      {/* faint console grid */}
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(188,255,70,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(188,255,70,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
      {/* scanline */}
      <motion.div
        className="absolute inset-x-0 h-[3px] bg-[#bcff46] shadow-[0_0_26px_5px_rgba(188,255,70,0.45)]"
        initial={{ top: "0%" }}
        animate={{ top: "104%" }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      />
      {/* boot log */}
      <div className="absolute left-1/2 top-1/2 w-[min(34rem,86vw)] -translate-x-1/2 -translate-y-1/2 font-mono text-[0.78rem] leading-7 text-[#bcff46]">
        {LOG.map((line, i) => (
          <motion.p key={line} initial={{ opacity: 0, x: -8 }} animate={{ opacity: i === 0 ? 1 : 0.85, x: 0 }} transition={{ delay: 0.12 + i * 0.1, duration: 0.18 }}>
            {line}
          </motion.p>
        ))}
        <div className="mt-2 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-sm border border-[#bcff46]/40">
            <motion.div className="h-full bg-[#bcff46]/80" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ delay: 0.5, duration: 0.5, ease: "easeInOut" }} />
          </div>
          <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.7, repeat: Infinity }}>▮</motion.span>
        </div>
      </div>
    </motion.div>
  );
}

/** built — the builder: blueprint grid fades up, the wall assembles in a diagonal wave, then flips away. */
function BuiltTiles({ phase }: { phase: Phase }) {
  const COLS = 10;
  const ROWS = 6;
  const tiles = Array.from({ length: COLS * ROWS }, (_, i) => i);
  const wave = (i: number) => (i % COLS) + Math.floor(i / COLS);
  const maxWave = COLS - 1 + ROWS - 1;
  return (
    <div className="absolute inset-0">
      {/* blueprint underlay — acorn brown with warm drafting lines */}
      <motion.div
        className="absolute inset-0 bg-[#1c0e02] [background-image:linear-gradient(rgba(240,120,24,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(240,120,24,0.13)_1px,transparent_1px)] [background-size:48px_48px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "enter" ? 1 : 0 }}
        transition={{ duration: phase === "enter" ? 0.12 : 0.5, delay: phase === "enter" ? 0 : 0.3 }}
      />
      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)`, perspective: "1200px" }}>
        {tiles.map((i) => (
          <motion.div
            key={i}
            className="[background:linear-gradient(150deg,#601800,#f07818_150%)] shadow-[inset_0_0_0_1px_rgba(28,14,2,0.9)]"
            initial={{ rotateY: -92, opacity: 0 }}
            animate={phase === "enter" ? { rotateY: 0, opacity: 1 } : { rotateY: 92, opacity: 0 }}
            transition={{
              duration: 0.26,
              delay: (phase === "enter" ? wave(i) : maxWave - wave(i)) * 0.022,
              ease: phase === "enter" ? "easeOut" : "easeIn",
            }}
            style={{ transformOrigin: phase === "enter" ? "left center" : "right center", backfaceVisibility: "hidden" }}
          />
        ))}
      </div>
      <motion.p
        className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#f0a05a]"
        initial={{ opacity: 0 }}
        animate={phase === "enter" ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: phase === "enter" ? 0.42 : 0, duration: 0.25 }}
      >
        building · ship it, then ship the next one
      </motion.p>
    </div>
  );
}

/** lockedin — the pursuit: the camcorder wakes, timecode runs, autofocus locks, the shutter blinks through. */
function LockedRec({ phase }: { phase: Phase }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 42);
    return () => window.clearInterval(id);
  }, []);
  const frames = String(tick % 24).padStart(2, "0");
  const secs = String(Math.floor(tick / 24) % 60).padStart(2, "0");
  const corner = "absolute h-10 w-10 border-[#f4f1ea]/85";
  return (
    <motion.div className="absolute inset-0 bg-[#08070b]" initial={{ opacity: 0 }} animate={phase === "enter" ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: phase === "enter" ? 0.2 : 0.4, ease: "easeOut", delay: phase === "exit" ? 0.12 : 0 }}>
      {/* sensor grain */}
      <div className="grain" />
      <motion.div className="absolute inset-8" initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.32, delay: 0.06 }}>
        <div className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
        <div className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
        <div className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
        <div className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
        <div className="absolute left-2 top-2 flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-[#f4f1ea]">
          <motion.span className="inline-block h-2.5 w-2.5 rounded-full bg-[#e8385c]" animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
          REC <span className="text-[#8a8a99]">00:00:{secs}:{frames}</span>
        </div>
        <div className="absolute right-2 top-2 font-mono text-xs tracking-[0.2em] text-[#b48cff]">DAY 372 · 4K</div>
        {/* autofocus square — hunts, then locks */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 border"
          initial={{ scale: 1.5, opacity: 0, borderColor: "#f4f1ea88" }}
          animate={{ scale: [1.5, 0.92, 1], opacity: 1, borderColor: ["#f4f1ea88", "#f4f1ea88", "#7cfc9b"] }}
          transition={{ duration: 0.5, delay: 0.16, times: [0, 0.7, 1], ease: "easeOut" }}
        >
          <motion.span
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] tracking-[0.25em] text-[#7cfc9b]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            AF·LOCK
          </motion.span>
        </motion.div>
        <p className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[#8a8a99]">
          one year, documented
        </p>
      </motion.div>
      {/* shutter blink on exit */}
      {phase === "exit" && (
        <motion.div className="absolute inset-0 bg-white" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0] }} transition={{ duration: 0.3, times: [0, 0.4, 1] }} />
      )}
    </motion.div>
  );
}

/** about — the person: stars fade, Mission Peak rises in silhouette, the sun breaks over the summit pole. */
function AboutDawn({ phase }: { phase: Phase }) {
  const stars = [
    { left: "14%", top: "12%" }, { left: "32%", top: "22%" }, { left: "55%", top: "9%" },
    { left: "71%", top: "18%" }, { left: "86%", top: "11%" }, { left: "44%", top: "16%" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 [background:linear-gradient(180deg,#2a1f4d_0%,#b48cff_28%,#e8689c_52%,#ffb43d_78%,#7a4a14_100%)]"
        initial={{ y: "100%" }}
        animate={phase === "enter" ? { y: "0%" } : { y: "-102%" }}
        transition={{ duration: phase === "enter" ? 0.5 : 0.62, ease: EASE }}
      >
        {/* fading stars in the violet band */}
        {stars.map((s, i) => (
          <motion.span
            key={i}
            className="absolute h-[3px] w-[3px] rounded-full bg-white"
            style={s}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.05 }}
          />
        ))}
        {/* the sun, blooming behind the ridge */}
        <motion.div
          className="absolute left-1/2 top-[52%] h-44 w-44 -translate-x-1/2 rounded-full bg-[#ffd97a] blur-2xl"
          initial={{ y: 110, opacity: 0.35, scale: 0.8 }}
          animate={{ y: 0, opacity: 0.95, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
        />
        {/* lens flare streak */}
        <motion.div
          className="absolute left-0 right-0 top-[56%] h-px bg-white/70"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: [0, 0.8, 0.3] }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        />
        {/* Mission Peak ridge + summit pole */}
        <motion.svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-[38%] w-full"
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
        >
          <path d="M0 320 L0 240 L260 190 L520 120 L760 60 L820 78 L1010 150 L1240 210 L1440 250 L1440 320 Z" fill="#1c1208" />
          {/* the summit pole */}
          <line x1="760" y1="60" x2="760" y2="18" stroke="#1c1208" strokeWidth="6" />
          <line x1="760" y1="24" x2="788" y2="32" stroke="#1c1208" strokeWidth="5" />
        </motion.svg>
        <motion.p
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[0.62rem] uppercase tracking-[0.35em] text-[#3b2a08]"
          initial={{ opacity: 0 }}
          animate={phase === "enter" ? { opacity: 0.85 } : { opacity: 0 }}
          transition={{ delay: phase === "enter" ? 0.45 : 0, duration: 0.3 }}
        >
          every birthday, same mountain
        </motion.p>
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
  civic: CivicMic,
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
      exitTimer.current = window.setTimeout(() => setStage({ kind: "idle" }), EXIT_MS[s.world] ?? 700);
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
