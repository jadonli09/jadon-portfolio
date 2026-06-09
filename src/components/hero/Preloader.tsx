"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, animate } from "motion/react";
import { EASE } from "@/lib/motion";

/** Cinematic intro: a counted load (00→100) that lifts away to reveal the hero. */
export function Preloader() {
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("jl_intro")) {
      setShow(false);
      return;
    }
    if (reduce) {
      setN(100);
      const t = setTimeout(() => finish(), 500);
      return () => clearTimeout(t);
    }
    const controls = animate(0, 100, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => setTimeout(finish, 350),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    try {
      sessionStorage.setItem("jl_intro", "1");
    } catch {}
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#07070a] text-[#f4f1ea]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="grain" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-col items-center gap-6"
          >
            <span className="eyebrow">Five worlds · one person</span>
            <span className="font-anton text-5xl tracking-tight md:text-7xl">JADON LI</span>
          </motion.div>
          <div className="absolute bottom-8 right-6 font-mono text-6xl tabular-nums text-[#e8b15a] md:bottom-12 md:right-12 md:text-8xl">
            {String(n).padStart(3, "0")}
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] bg-[#e8b15a]" style={{ width: `${n}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
