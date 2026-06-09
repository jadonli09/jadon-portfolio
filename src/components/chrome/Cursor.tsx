"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Context-aware custom cursor: a precise dot plus a lagging ring that grows and
 * inverts over interactive elements. Pointer-fine devices only; disabled under
 * reduced motion (native cursor restored).
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.6 });
  const dotX = useSpring(x, { stiffness: 900, damping: 40 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) {
      document.body.setAttribute("data-cursor", "off");
      return;
    }
    setEnabled(true);
    document.body.setAttribute("data-cursor", "on");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setHovering(!!t?.closest("a, button, [data-cursor-hover], input, textarea"));
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] mix-blend-difference" aria-hidden>
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute left-0 top-0"
        animate={{ scale: hovering ? 1.9 : down ? 0.7 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white" style={{ width: 38, height: 38 }} />
      </motion.div>
      <motion.div style={{ x: dotX, y: dotY }} className="absolute left-0 top-0">
        <div className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ width: 6, height: 6 }} />
      </motion.div>
    </div>
  );
}
