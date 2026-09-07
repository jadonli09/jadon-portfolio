"use client";

import { Counter } from "@/components/primitives/Counter";

/**
 * Odometer for a telemetry string.
 *
 * "500+", "~$4,000", "#1", "08" and "13,000" all count up; anything it cannot
 * parse — "Live", "Summer 2026" — renders verbatim rather than guessing at a
 * number. The prefix and suffix ride along so the symbol never detaches from
 * its figure mid-count.
 */
export function StatFigure({ value, className }: { value: string; className?: string }) {
  const m = value.match(/^([~$#]{0,2})([\d,]+)([+%]?)$/);
  if (!m) return <span className={className}>{value}</span>;

  const [, prefix, rawNum, suffix] = m;
  const to = parseInt(rawNum.replace(/,/g, ""), 10);
  if (Number.isNaN(to)) return <span className={className}>{value}</span>;

  // Leading zeros ("08") ride in the prefix so they survive the count.
  const zeros = rawNum.match(/^0+(?=\d)/)?.[0] ?? "";

  return (
    <Counter to={to} prefix={prefix + zeros} suffix={suffix} duration={1} className={className} />
  );
}
