"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

type Rect = { top: number; left: number; width: number; height: number };

type Stage =
  | { kind: "idle" }
  | { kind: "zoom"; preview: string; rect: Rect | null } // expanding toward fullscreen, pre-navigation
  | { kind: "reveal"; preview: string; rect: Rect | null } // destination arrived — hold, then fade away
  | { kind: "subtle" };

const FLAG = "develop";
/** Hard ceiling per active stage — the page must never stay trapped behind the overlay. */
const FAILSAFE_MS = 4200;

/**
 * Zoom page transition. `develop:start` (from ContactSheet) hands over the page
 * preview and its on-screen rect; the preview expands from the film frame until
 * it fills the viewport, navigation happens beneath it, and the overlay fades
 * to reveal the real page it was previewing. A sessionStorage flag covers hard
 * refreshes mid-transition; plain hard loads get a subtle backdrop develop.
 */
export function Develop() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const stageRef = useRef(stage);
  stageRef.current = stage;
  const lastPath = useRef(pathname);
  const revealTimer = useRef<number | null>(null);

  // Failsafe: any non-idle stage self-clears.
  useEffect(() => {
    if (stage.kind === "idle") return;
    const t = window.setTimeout(() => setStage({ kind: "idle" }), FAILSAFE_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  // The reveal-hold timer must not outlive the component.
  useEffect(
    () => () => {
      if (revealTimer.current !== null) window.clearTimeout(revealTimer.current);
    },
    [],
  );

  // Click side: start the zoom from the clicked frame's rect.
  useEffect(() => {
    const onStart = (e: Event) => {
      const d = (e as CustomEvent).detail as { preview?: string; rect?: Rect | null } | undefined;
      if (typeof d?.preview === "string") setStage({ kind: "zoom", preview: d.preview, rect: d.rect ?? null });
    };
    window.addEventListener("develop:start", onStart);
    return () => window.removeEventListener("develop:start", onStart);
  }, []);

  // Arrival: pathname changed while zooming -> hold fullscreen briefly, then fade.
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    try {
      sessionStorage.removeItem(FLAG);
    } catch {}
    const s = stageRef.current;
    if (s.kind === "zoom") {
      setStage({ kind: "reveal", preview: s.preview, rect: s.rect });
      revealTimer.current = window.setTimeout(() => setStage({ kind: "idle" }), 420);
    }
  }, [pathname]);

  // Hard load: consume a fresh flag (refresh mid-transition), else subtle pass.
  useEffect(() => {
    type FlagShape = { preview?: string; t?: number };
    let flag: FlagShape | null = null;
    try {
      const raw = sessionStorage.getItem(FLAG);
      if (raw) flag = JSON.parse(raw) as FlagShape;
      sessionStorage.removeItem(FLAG);
    } catch {}
    if (flag?.preview && typeof flag.t === "number" && Date.now() - flag.t < 5000) {
      setStage({ kind: "reveal", preview: flag.preview, rect: null });
      revealTimer.current = window.setTimeout(() => setStage({ kind: "idle" }), 600);
    } else if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage({ kind: "subtle" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = stage.kind === "zoom" || stage.kind === "reveal";
  // Reduced motion (or a missing rect) skips the frame-to-fullscreen flight and just fades in.
  const fromRect = active && !reduced ? stage.rect : null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="zoom"
          className="fixed z-[60] overflow-hidden bg-[#070709]"
          initial={
            fromRect
              ? { top: fromRect.top, left: fromRect.left, width: fromRect.width, height: fromRect.height, borderRadius: 3, opacity: 1 }
              : { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight, borderRadius: 0, opacity: 0 }
          }
          animate={{ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight, borderRadius: 0, opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE } }}
          transition={{ duration: reduced ? 0.25 : 0.6, ease: EASE }}
        >
          <img src={asset(stage.preview)} alt="" className="h-full w-full object-cover" />
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
