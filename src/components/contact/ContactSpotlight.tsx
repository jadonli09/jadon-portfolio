"use client";

import { useEffect, useRef, useReducer } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/**
 * Cursor-following radial gradient spotlight.
 * Tracks the pointer position within the parent section via a motion spring.
 * Falls back to a static centred glow on:
 *   - coarse pointer devices (touch)
 *   - prefers-reduced-motion: reduce
 */
export function ContactSpotlight() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // 0→1 normalised cursor position within the section
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.45);
  const springX = useSpring(rawX, { stiffness: 70, damping: 20, mass: 0.6 });
  const springY = useSpring(rawY, { stiffness: 70, damping: 20, mass: 0.6 });

  // Convert 0-1 to "X%" CSS strings for `left`/`top`
  const left = useTransform(springX, (v) => `${v * 100}%`);
  const top = useTransform(springY, (v) => `${v * 100}%`);

  const [active, activate] = useReducer(() => true, false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduced) activate();
  }, []);

  useEffect(() => {
    if (!active) return;
    const el = sectionRef.current?.closest("section");
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      rawX.set(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
      rawY.set(Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)));
    };

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [active, rawX, rawY]);

  return (
    <div ref={sectionRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Static ambient ember glow — always shown */}
      <div
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(80vw, 900px)",
          height: "min(80vw, 900px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(232,177,90,0.18) 0%, rgba(217,96,63,0.10) 38%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Dynamic cursor spotlight */}
      {active && (
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left,
            top,
            width: "min(65vw, 720px)",
            height: "min(65vw, 720px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(232,177,90,0.26) 0%, rgba(217,96,63,0.13) 42%, transparent 72%)",
            filter: "blur(48px)",
          }}
        />
      )}
    </div>
  );
}
