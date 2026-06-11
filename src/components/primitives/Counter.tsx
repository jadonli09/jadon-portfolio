"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

/** Animated number counter that runs once when scrolled into view. */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1.8,
  decimals,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  /** Fixed decimal places (e.g. 2 → "1.39"); defaults to 0 for integers, 1 otherwise. */
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  const display =
    decimals !== undefined
      ? val.toFixed(decimals)
      : Number.isInteger(to)
        ? Math.round(val).toLocaleString()
        : val.toFixed(1);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
