"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

type Stage =
  | { kind: "idle" }
  | { kind: "cover"; photo: string; accent: string }
  | { kind: "bath"; photo: string; accent: string }
  | { kind: "subtle" };

const FLAG = "develop";
/** Hard ceiling per active stage — the page must never stay trapped behind the overlay. */
const FAILSAFE_MS = 4200;

/**
 * Darkroom page transition. `develop:start` (from ContactSheet) covers the
 * screen in a red-washed print before navigation; the pathname change flips it
 * to the developer bath (B&W ghost -> sharp -> colour), then the print lifts.
 * A sessionStorage flag covers hard refreshes mid-transition; plain hard loads
 * get a subtle backdrop develop instead.
 */
export function Develop() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const stageRef = useRef(stage);
  stageRef.current = stage;
  const lastPath = useRef(pathname);
  const bathTimer = useRef<number | null>(null);

  // Failsafe: any non-idle stage self-clears.
  useEffect(() => {
    if (stage.kind === "idle") return;
    const t = window.setTimeout(() => setStage({ kind: "idle" }), FAILSAFE_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  // The bath-hold timer must not outlive the component.
  useEffect(
    () => () => {
      if (bathTimer.current !== null) window.clearTimeout(bathTimer.current);
    },
    [],
  );

  // Click side: cover the screen before navigation starts.
  useEffect(() => {
    const onStart = (e: Event) => {
      const d = (e as CustomEvent).detail as { photo?: string; accent?: string } | undefined;
      if (typeof d?.photo === "string") setStage({ kind: "cover", photo: d.photo, accent: d.accent ?? "#c43e2c" });
    };
    window.addEventListener("develop:start", onStart);
    return () => window.removeEventListener("develop:start", onStart);
  }, []);

  // Arrival: pathname changed while covered -> run the bath.
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    try {
      sessionStorage.removeItem(FLAG);
    } catch {}
    const s = stageRef.current;
    if (s.kind === "cover") setStage({ kind: "bath", photo: s.photo, accent: s.accent });
  }, [pathname]);

  // Hard load: consume a fresh flag (refresh mid-transition), else subtle pass.
  useEffect(() => {
    type FlagShape = { photo?: string; accent?: string; t?: number };
    let flag: FlagShape | null = null;
    try {
      const raw = sessionStorage.getItem(FLAG);
      if (raw) flag = JSON.parse(raw) as FlagShape;
      sessionStorage.removeItem(FLAG);
    } catch {}
    if (flag?.photo && typeof flag.t === "number" && Date.now() - flag.t < 5000) {
      setStage({ kind: "bath", photo: flag.photo, accent: flag.accent ?? "#c43e2c" });
    } else if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage({ kind: "subtle" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = stage.kind === "cover" || stage.kind === "bath";

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="print"
          className="fixed inset-0 z-[60] bg-[#070709]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ y: "-103%", transition: { duration: 0.65, ease: EASE } }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={asset((stage as Extract<Stage, { kind: "cover" | "bath" }>).photo)}
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: 1.08 }}
            animate={
              stage.kind === "bath" && !reduced
                ? {
                    scale: 1,
                    filter: [
                      "grayscale(1) brightness(1.9) contrast(0.45) blur(2.5px)",
                      "grayscale(1) brightness(1.2) contrast(0.92) blur(0.5px)",
                      "grayscale(0.35) brightness(1.04) contrast(1) blur(0px)",
                      "grayscale(0) brightness(1) contrast(1) blur(0px)",
                    ],
                  }
                : { scale: stage.kind === "bath" ? 1 : 1.04 }
            }
            transition={
              stage.kind === "bath"
                ? { duration: reduced ? 0.4 : 1.4, ease: "easeInOut", times: reduced ? undefined : [0, 0.45, 0.75, 1] }
                : { duration: 0.5, ease: EASE }
            }
            onAnimationComplete={() => {
              if (stageRef.current.kind === "bath") {
                bathTimer.current = window.setTimeout(() => setStage({ kind: "idle" }), 220);
              }
            }}
          />
          {/* safelight wash — present on cover, lifts during the bath */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,60,40,0.5), rgba(120,14,9,0.72) 75%)", mixBlendMode: "hard-light" }}
            animate={{ opacity: stage.kind === "bath" ? 0 : 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          />
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
