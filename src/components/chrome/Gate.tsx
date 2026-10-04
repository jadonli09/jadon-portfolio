"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Preloader } from "@/components/hero/Preloader";
import { GATE_KEY } from "@/lib/gate";
import { EASE } from "@/lib/motion";

/**
 * The lock on the front door. After the "LOCKED IN" intro, the site stays
 * behind one more cover until five stickers are tapped in order. The sentence
 * writes itself a clause at a time; each right answer strings a thread to the
 * cover and adds its piece to the scene (the peak, the drone, the sun that
 * turns out to be a tomato, the macaron on a string, the journal entry).
 * A wrong sticker shakes the cover and starts the sentence over.
 *
 * Static export, so this is a doorbell, not a vault: the unlock is remembered
 * in localStorage, and `?lock` on any URL locks it again.
 */

const INK = "#1a1410";
const PAPER = "#f4efe6";
const line = { stroke: INK, strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

type ArtId =
  | "peak" | "drone" | "tomato" | "macaron" | "journal"
  | "wave" | "donut" | "headphones" | "coffee" | "plane" | "controller" | "pizza";

/** Sticker art, drawn on a 64 × 64 box so the same shapes serve the tiles and the cover scene. */
const ART: Record<ArtId, ReactNode> = {
  peak: (
    <>
      <circle cx="15" cy="16" r="5.5" fill="#e8b15a" {...line} />
      <path d="M5 53 24 24l9 11 9-18 17 36Z" fill="#c98a5d" {...line} />
      <path d="m42 17 8 17-8-4-5 6Z" fill="#e6b78e" {...line} />
      <path d="M42 17V7" {...line} />
    </>
  ),
  drone: (
    <>
      <path d="M25 30 12 22M39 30l13-8M26 38l-4 8M38 38l4 8" fill="none" {...line} />
      <ellipse className="gate-prop" cx="12" cy="20" rx="9.5" ry="2.8" fill="#cfd4f7" {...line} />
      <ellipse className="gate-prop" cx="52" cy="20" rx="9.5" ry="2.8" fill="#cfd4f7" {...line} />
      <rect x="21" y="27" width="22" height="12" rx="6" fill="#7c89e8" {...line} />
      <circle cx="32" cy="40" r="3.6" fill={INK} />
    </>
  ),
  tomato: (
    <>
      <ellipse cx="32" cy="37" rx="21" ry="19" fill="#e2432a" {...line} />
      <path d="M20 32q3-7 9-8" fill="none" stroke="#ffc9b8" strokeWidth="2.5" strokeLinecap="round" />
      <path d="m32 22-7-8 4 9-10 0 9 4 4-5 4 5 9-4-10 0 4-9Z" fill="#4c9a4a" {...line} />
    </>
  ),
  macaron: (
    <>
      <path d="M11 30q0-15 21-15t21 15Z" fill="#ee9db6" {...line} />
      <rect x="12" y="30" width="40" height="7" rx="3.5" fill="#fbe6d4" {...line} />
      <path d="M11 37h42q0 12-21 12T11 37Z" fill="#ee9db6" {...line} />
    </>
  ),
  journal: (
    <>
      <path d="M33 52v9l3.5-3.5L40 61v-9" fill="#e0644e" {...line} />
      <rect x="13" y="8" width="38" height="46" rx="4" fill="#d9a83f" {...line} />
      <path d="M21 8v46M45 8v46" fill="none" {...line} />
      <rect x="26" y="17" width="14" height="9" rx="1.5" fill={PAPER} {...line} />
    </>
  ),
  wave: (
    <>
      <path d="M5 47q7-27 26-27 13 0 15 11-8-5-12 1-5 8 5 12 9 3 20 2v9H5Z" fill="#4f8fe8" {...line} />
      <path d="M5 55q9-5 18 0t18 0 18 0" fill="none" stroke={PAPER} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  donut: (
    <>
      <path
        d="M32 10a22 22 0 1 0 0 44 22 22 0 1 0 0-44Zm0 15a7 7 0 1 1 0 14 7 7 0 1 1 0-14Z"
        fillRule="evenodd"
        fill="#7a4a2b"
        {...line}
      />
      <path d="m19 26 3-3M41 19l3 3M46 34l1 4M22 42l-3 2M35 46l4 1M27 17l1-1" fill="none" stroke="#ffd98a" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  headphones: (
    <>
      <path d="M13 40v-8a19 19 0 0 1 38 0v8" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <rect x="7" y="35" width="13" height="19" rx="5.5" fill="#f0703a" {...line} />
      <rect x="44" y="35" width="13" height="19" rx="5.5" fill="#f0703a" {...line} />
    </>
  ),
  coffee: (
    <>
      <path d="M24 17q-3-4 0-8M34 17q-3-4 0-8" fill="none" {...line} />
      <path d="M45 29h3a6.5 6.5 0 0 1 0 13h-4" fill="none" {...line} />
      <path d="M13 24h32v15a13 13 0 0 1-13 13h-6a13 13 0 0 1-13-13Z" fill="#2fc4ad" {...line} />
      <path d="M11 56h36" {...line} />
    </>
  ),
  plane: (
    <>
      <path d="M5 30 59 9 40 55 29 37Z" fill="#dfe3fb" {...line} />
      <path d="M59 9 29 37l-2 14 8-8" fill="#aab3ee" {...line} />
    </>
  ),
  controller: (
    <>
      <path d="M18 20h28a13 13 0 0 1 13 13v6a8 8 0 0 1-15 4l-3-5H23l-3 5a8 8 0 0 1-15-4v-6a13 13 0 0 1 13-13Z" fill="#a78bea" {...line} />
      <path d="M16 31h9M20.5 26.5v9" fill="none" {...line} />
      <circle cx="41" cy="28" r="2.6" fill="#ffd98a" {...line} />
      <circle cx="48" cy="34" r="2.6" fill="#e0644e" {...line} />
    </>
  ),
  pizza: (
    <>
      <path d="M32 59 10 17q22-11 44 0Z" fill="#f2c14e" {...line} />
      <path d="M10 17q22-11 44 0" fill="none" stroke="#c98a5d" strokeWidth="6.5" strokeLinecap="round" />
      <path d="M10 17q22-11 44 0" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" transform="translate(0 -3.8)" />
      <circle cx="27" cy="29" r="4" fill="#e0644e" {...line} />
      <circle cx="38" cy="35" r="4" fill="#e0644e" {...line} />
      <circle cx="31" cy="44" r="3.5" fill="#e0644e" {...line} />
    </>
  ),
};

/** The combination, in order. `at` is where the thread lands on the cover (fractions of its box). */
const STEPS: { id: ArtId; lead: ReactNode; word: string; color: string; at: [number, number] }[] = [
  {
    id: "peak",
    lead: (
      <>
        Every birthday, <span className="mx-[0.06em] font-anton text-[1.22em] not-italic leading-none text-[#f4efe6]">Jadon Li</span> runs up{" "}
      </>
    ),
    word: "Mission Peak",
    color: "#c98a5d",
    at: [0.63, 0.55],
  },
  { id: "drone", lead: ", flies ", word: "a drone", color: "#7c89e8", at: [0.75, 0.35] },
  { id: "tomato", lead: ", would bring back ", word: "Sweet Tomatoes", color: "#e0644e", at: [0.32, 0.49] },
  { id: "macaron", lead: ", bakes ", word: "macarons", color: "#e8689c", at: [0.75, 0.52] },
  { id: "journal", lead: ", and writes it all down in ", word: "a journal", color: "#d9a83f", at: [0.2, 0.9] },
];

const TILES: { id: ArtId; label: string; rot: number }[] = [
  { id: "wave", label: "Wave", rot: -3 },
  { id: "drone", label: "Drone", rot: 2 },
  { id: "donut", label: "Donut", rot: -1.5 },
  { id: "journal", label: "Journal", rot: 3 },
  { id: "headphones", label: "Headphones", rot: 2.5 },
  { id: "peak", label: "Mountain", rot: -2 },
  { id: "coffee", label: "Coffee", rot: 1.5 },
  { id: "macaron", label: "Macaron", rot: -3 },
  { id: "plane", label: "Paper plane", rot: -2.5 },
  { id: "tomato", label: "Tomato", rot: 3 },
  { id: "controller", label: "Game controller", rot: -1 },
  { id: "pizza", label: "Pizza", rot: 2 },
];

type Pick = { tile: number; x1: number; y1: number; x2: number; y2: number };
type Phase = "play" | "solved" | "leaving";

const SPRING = { type: "spring", stiffness: 170, damping: 16 } as const;
const STARS = [
  [34, 132], [70, 108], [120, 150], [156, 118], [208, 196], [262, 112], [282, 170], [22, 210], [248, 232],
];

/** The cover's picture. `n` right answers in, `solved` once all five are. */
function Scene({ n, solved }: { n: number; solved: boolean }) {
  const has = (k: number) => n > k;
  const color = n === 0 ? "#8a8178" : STEPS[n - 1].color;
  const masthead = {
    x: 150,
    y: 86,
    textAnchor: "middle" as const,
    fontSize: 70,
    textLength: 250,
    lengthAdjust: "spacingAndGlyphs" as const,
    style: { fontFamily: "var(--font-anton), Impact, sans-serif" },
  };
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className="gate-scene absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="gate-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15111f" />
          <stop offset="1" stopColor="#38212c" />
        </linearGradient>
        <linearGradient id="gate-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3157" />
          <stop offset="0.5" stopColor="#c8684f" />
          <stop offset="0.78" stopColor="#f0ac5c" />
        </linearGradient>
        <clipPath id="gate-ink">
          <motion.rect
            x="0"
            y="318"
            height="70"
            initial={false}
            animate={{ width: has(4) ? 300 : 0 }}
            transition={{ duration: has(4) ? 0.8 : 0.2, ease: "easeOut" }}
          />
        </clipPath>
      </defs>

      <rect width="300" height="400" fill="url(#gate-night)" />
      <motion.rect
        width="300"
        height="400"
        fill="url(#gate-dawn)"
        initial={false}
        animate={{ opacity: has(0) ? 1 : 0 }}
        transition={{ duration: 0.9 }}
      />
      <motion.g initial={false} animate={{ opacity: has(0) ? 0 : 0.7 }} transition={{ duration: 0.6 }}>
        {STARS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 ? 1.2 : 1.9} fill={PAPER} />
        ))}
      </motion.g>

      {/* the masthead: grey while locked, then the colour of the last right answer */}
      <motion.text {...masthead} initial={false} animate={{ fill: color, opacity: solved ? 0 : 1 }} transition={{ duration: 0.4, delay: solved ? 0.45 : 0 }}>
        LOCKED IN
      </motion.text>
      <motion.text {...masthead} fill={PAPER} initial={false} animate={{ opacity: solved ? 1 : 0, y: solved ? 0 : 10 }} transition={{ duration: 0.45, delay: solved ? 0.5 : 0 }}>
        UNLOCKED
      </motion.text>

      {/* the padlock holds the cover until the mountain comes up */}
      <motion.g initial={false} animate={{ opacity: has(0) ? 0 : 1, y: has(0) ? 36 : 0 }} transition={{ duration: 0.45, ease: EASE }}>
        <path d="M124 236v-26a26 26 0 0 1 52 0v26" fill="none" stroke={PAPER} strokeWidth="9" strokeLinecap="round" />
        <rect x="106" y="234" width="88" height="70" rx="12" fill={PAPER} />
        <circle cx="150" cy="262" r="9" fill="#2a1c22" />
        <path d="M150 264v20" stroke="#2a1c22" strokeWidth="7" strokeLinecap="round" />
      </motion.g>

      {/* the sun rises behind the ridge, then turns out to be a tomato */}
      <motion.g initial={false} animate={{ y: has(0) ? 0 : 260 }} transition={{ duration: 1, ease: EASE }}>
        <motion.circle cx="96" cy="196" r="52" fill="#ffd98a" initial={false} animate={{ opacity: has(2) ? 0 : 0.26 }} />
        <motion.circle
          cx="96"
          cy="196"
          r="31"
          {...line}
          initial={false}
          animate={{ fill: has(2) ? "#e2432a" : "#ffd98a", strokeOpacity: has(2) ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />
        <motion.path
          d="M77 188q4-11 14-13"
          fill="none"
          stroke="#ffc9b8"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: has(2) ? 1 : 0 }}
        />
        <motion.g initial={false} animate={{ scale: has(2) ? 1 : 0, rotate: has(2) ? 0 : -70 }} transition={SPRING}>
          <path d="m96 172-11-13 6 14-16 0 14 7 7-8 7 8 14-7-16 0 6-14Z" fill="#4c9a4a" {...line} />
        </motion.g>
      </motion.g>

      {/* Mission Peak, pole and all */}
      <motion.g initial={false} animate={{ y: has(0) ? 0 : 200 }} transition={{ duration: 0.8, ease: EASE }}>
        <path d="M0 400V292l44-20 40 14 52-30 40 22 60-34 64 30v156Z" fill="#6b3a35" />
        <path d="M190 222v-20M184 208h12" fill="none" stroke={PAPER} strokeWidth="3" strokeLinecap="round" />
        <path d="M0 400v-82l40-18 38 6 42-38 30 8 40-54 24 28 32 12 54 38v100Z" fill="#241812" />
        <path d="m120 268 30 8 40-54 24 28 32 12" fill="none" stroke="#f3b562" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>

      {/* the drone, and the macaron it ends up carrying */}
      <motion.g
        initial={false}
        animate={{ x: has(1) ? 0 : -300, y: has(1) ? 0 : 170, rotate: has(1) ? 0 : -20 }}
        transition={has(1) ? { type: "spring", stiffness: 110, damping: 14 } : { duration: 0.3 }}
      >
        <g className="gate-bob">
          <g className="gate-swing">
            <motion.path
              d="M226 152v42"
              fill="none"
              {...line}
              initial={false}
              animate={{ pathLength: has(3) ? 1 : 0, opacity: has(3) ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.g initial={false} animate={{ scale: has(3) ? 1 : 0 }} transition={{ ...SPRING, delay: has(3) ? 0.2 : 0 }}>
              <g transform="translate(205 181) scale(0.66)">{ART.macaron}</g>
            </motion.g>
          </g>
          <g transform="translate(186 100) scale(1.25)">{ART.drone}</g>
        </g>
      </motion.g>

      {/* the journal: a ribbon drops in and the day gets written down */}
      <motion.path
        d="M279 -6v58l7-7 7 7V-6Z"
        fill="#e0644e"
        {...line}
        initial={false}
        animate={{ y: has(4) ? 0 : -90 }}
        transition={SPRING}
      />
      <g clipPath="url(#gate-ink)">
        <text x="20" y="356" fontSize="29" fill={PAPER} style={{ fontFamily: "var(--font-caveat), cursive" }}>
          Jan 2. Up before the sun.
        </text>
        <path d="M20 368q60-7 118-1t112-4" fill="none" stroke="#d9a83f" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function Gate() {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [phase, setPhase] = useState<Phase>("play");
  /** the last wrong sticker; `n` re-keys the shake so it replays */
  const [wrong, setWrong] = useState<{ tile: number; n: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timers = useRef<number[]>([]);

  const n = picks.length;

  // Already let in → step aside. Otherwise hold the content until the intro has played.
  useEffect(() => {
    let open = false;
    let intro = false;
    try {
      open = !!localStorage.getItem(GATE_KEY);
      intro = !!sessionStorage.getItem("jl_intro");
    } catch {}
    if (open) {
      queueMicrotask(() => setUnlocked(true));
      return;
    }
    const t = window.setTimeout(() => setReady(true), intro ? 0 : 2300);
    return () => clearTimeout(t);
  }, []);

  // While locked, the page behind can't scroll or take focus.
  useEffect(() => {
    if (unlocked) return;
    const root = rootRef.current;
    const others = root ? Array.from(document.body.children).filter((el) => el !== root && el.tagName !== "SCRIPT") : [];
    others.forEach((el) => el.setAttribute("inert", ""));
    document.documentElement.style.overflow = "hidden";
    return () => {
      others.forEach((el) => el.removeAttribute("inert"));
      document.documentElement.style.overflow = "";
    };
  }, [unlocked]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  /** Thread geometry: from the edge of a tile to that step's spot on the cover. */
  const measure = useCallback((tile: number, step: number) => {
    const wrap = wrapRef.current?.getBoundingClientRect();
    const t = tileRefs.current[tile]?.getBoundingClientRect();
    const c = coverRef.current?.getBoundingClientRect();
    if (!wrap || !t || !c) return { x1: 0, y1: 0, x2: 0, y2: 0 };
    const [fx, fy] = STEPS[step].at;
    const x2 = c.left + c.width * fx - wrap.left;
    const y2 = c.top + c.height * fy - wrap.top;
    const cx = t.left + t.width / 2 - wrap.left;
    const cy = t.top + t.height / 2 - wrap.top;
    const d = Math.hypot(x2 - cx, y2 - cy) || 1;
    return { x1: cx + ((x2 - cx) / d) * t.width * 0.42, y1: cy + ((y2 - cy) / d) * t.height * 0.42, x2, y2 };
  }, []);

  useEffect(() => {
    const onResize = () => setPicks((p) => p.map((pk, i) => ({ tile: pk.tile, ...measure(pk.tile, i) })));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  const press = (tile: number) => {
    if (phase !== "play") return;
    if (TILES[tile].id !== STEPS[n].id) {
      setWrong((w) => ({ tile, n: (w?.n ?? 0) + 1 }));
      setPicks([]);
      return;
    }
    setPicks([...picks, { tile, ...measure(tile, n) }]);
    if (n + 1 < STEPS.length) return;
    setPhase("solved");
    timers.current.push(
      window.setTimeout(() => setPhase("leaving"), 1250),
      window.setTimeout(() => {
        try {
          localStorage.setItem(GATE_KEY, "1");
        } catch {}
        setUnlocked(true);
      }, 2200),
    );
  };

  if (unlocked) return null;

  const leaving = phase === "leaving";
  const tint = n === 0 ? "#8a8178" : STEPS[n - 1].color;

  return (
    <div
      ref={rootRef}
      data-gate
      data-lenis-prevent
      className="fixed inset-0 z-[65] overflow-y-auto overscroll-contain bg-[#120e0c] text-[#f4efe6]"
      style={{
        opacity: leaving ? 0 : 1,
        pointerEvents: leaving ? "none" : undefined,
        transition: "opacity 0.6s ease 0.3s",
      }}
    >
      <Preloader gate />

      <div
        ref={wrapRef}
        className="relative flex min-h-full flex-col justify-center gap-7 overflow-hidden px-6 py-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-0 lg:px-0 lg:py-0"
      >
        {/* the same warm tint as the hero, in the colour of the last right answer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-[background-color] duration-700"
          style={{
            backgroundColor: `${tint}40`,
            maskImage: "radial-gradient(70% 85% at 76% 48%, #000, transparent 70%)",
            WebkitMaskImage: "radial-gradient(70% 85% at 76% 48%, #000, transparent 70%)",
          }}
        />

        {/* THE COVER */}
        <motion.div
          initial={false}
          animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : 40 }}
          transition={{ delay: 0.2, duration: 1.1, ease: EASE }}
          className="relative z-[1] mx-auto w-[min(48vw,30svh)] translate-x-[6%] lg:order-2 lg:w-[min(31vw,60svh)] lg:translate-x-[10%]"
          style={{ aspectRatio: "3 / 4", containerType: "inline-size" }}
        >
          <div
            key={wrong?.n ?? 0}
            className={`absolute inset-0 ${wrong ? "gate-shake" : ""}`}
            style={{
              transformOrigin: "50% 100%",
              transform: leaving ? "translateX(72%) rotate(14deg)" : "none",
              opacity: leaving ? 0 : 1,
              transition: "transform 0.75s cubic-bezier(0.22,1,0.36,1), opacity 0.75s",
            }}
          >
            {/* two blank covers fanned behind, like the hero's stack */}
            <div aria-hidden className="absolute inset-0 rounded-[0.4cqw] bg-[#2b211c]" style={{ transformOrigin: "50% 100%", transform: "translateX(-25%) rotate(-9deg) scale(0.9)", filter: "brightness(0.6)" }} />
            <div aria-hidden className="absolute inset-0 rounded-[0.4cqw] bg-[#3a2c25]" style={{ transformOrigin: "50% 100%", transform: "translateX(-14%) rotate(-5deg) scale(0.95)", filter: "brightness(0.75)" }} />
            <div ref={coverRef} className="absolute inset-0 overflow-hidden rounded-[0.4cqw] bg-black shadow-[0_2.4cqw_6cqw_rgba(0,0,0,0.55)]">
              <Scene n={n} solved={phase !== "play"} />
            </div>
          </div>
        </motion.div>

        {/* THE SENTENCE + THE STICKERS */}
        <motion.div
          initial={false}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 24 }}
          transition={{ delay: 0.1, duration: 1, ease: EASE }}
          className="relative z-[2] lg:order-1 lg:pl-[5.5vw] lg:pr-[2vw]"
        >
          <h1
            aria-live="polite"
            className="min-h-[6.1em] font-serif text-[clamp(1.5rem,6.2vw,2.1rem)] leading-[1.22] tracking-[-0.005em] text-[#8a8178] md:text-[2.4rem] lg:text-[min(3.1vw,5.6svh)]"
          >
            {STEPS.map((s, i) => {
              if (i > n) return null;
              return (
                <span key={`${s.id}-${wrong?.n ?? 0}`}>
                  {s.lead}
                  {i < n ? (
                    <motion.span
                      initial={{ opacity: 0, y: "0.25em" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="relative inline-block whitespace-nowrap italic"
                      style={{ color: s.color }}
                    >
                      {s.word}
                      <span
                        aria-hidden
                        className="absolute bottom-[0.02em] left-0 h-[0.055em] w-full origin-left rounded-full"
                        style={{ background: s.color, animation: "cover-fill 450ms cubic-bezier(0.22,1,0.36,1) both" }}
                      />
                    </motion.span>
                  ) : (
                    <span
                      aria-label="blank"
                      className="gate-blank inline-block h-[0.07em] w-[3.4em] translate-y-[0.1em] rounded-full bg-[#f4efe6]"
                    />
                  )}
                </span>
              );
            })}
            {n === STEPS.length && "."}
          </h1>

          <div className="mx-auto mt-7 grid max-w-[26rem] grid-cols-4 gap-3 lg:mx-0 lg:mt-[5svh] lg:max-w-[min(34vw,30rem)] lg:gap-[1.1vw]">
            {TILES.map((t, i) => {
              const step = picks.findIndex((p) => p.tile === i);
              const shaking = wrong?.tile === i && n === 0;
              return (
                <motion.div
                  key={t.id}
                  initial={false}
                  animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.6 }}
                  transition={{ ...SPRING, delay: ready ? 0.35 + i * 0.035 : 0 }}
                >
                  <button
                    ref={(el) => {
                      tileRefs.current[i] = el;
                    }}
                    type="button"
                    aria-label={t.label}
                    aria-pressed={step >= 0}
                    onClick={() => press(i)}
                    className="gate-tile"
                    style={{ ["--r" as string]: `${t.rot}deg`, ["--c" as string]: step >= 0 ? STEPS[step].color : "transparent" }}
                  >
                    <span key={shaking ? wrong.n : 0} className={`block ${shaking ? "gate-shake" : ""}`}>
                      <svg viewBox="0 0 64 64" className="block h-full w-full" aria-hidden>
                        {ART[t.id]}
                      </svg>
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* THE THREADS: one per right answer, tile to cover */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 z-[3] h-full w-full overflow-visible">
          <AnimatePresence>
            {!leaving &&
              picks.map((p, i) => {
                const mx = (p.x1 + p.x2) / 2 - (p.y2 - p.y1) * 0.16;
                const my = (p.y1 + p.y2) / 2 + (p.x2 - p.x1) * 0.16;
                return (
                  <motion.g key={`${i}-${p.tile}`} initial={{ opacity: 1 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <motion.path
                      d={`M${p.x1} ${p.y1}Q${mx} ${my} ${p.x2} ${p.y2}`}
                      fill="none"
                      stroke={STEPS[i].color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                    <circle cx={p.x1} cy={p.y1} r="5" fill={STEPS[i].color} />
                    <motion.circle
                      cx={p.x2}
                      cy={p.y2}
                      r="6"
                      fill={STEPS[i].color}
                      stroke={PAPER}
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ ...SPRING, delay: 0.4 }}
                    />
                  </motion.g>
                );
              })}
          </AnimatePresence>
        </svg>
      </div>
    </div>
  );
}
