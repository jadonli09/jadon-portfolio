import React from "react";
import { cn } from "@/lib/cn";

/**
 * Hero-04 signature backdrop: a dashed grid that follows the active world's
 * --line colour. `fade` controls where the grid dissolves to nothing.
 * Render inside a `relative` parent; content above needs `relative z-10+`.
 */
export function DashedGrid({
  fade = "top",
  className,
}: {
  fade?: "top" | "bottom" | "center";
  className?: string;
}) {
  const radial =
    fade === "top"
      ? "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)"
      : fade === "bottom"
        ? "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)"
        : "radial-gradient(ellipse 80% 80% at 50% 50%, #000 55%, transparent 100%)";

  const mask = `
    repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
    repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
    ${radial}
  `;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      style={{
        backgroundImage: `
          linear-gradient(to right, var(--line) 1px, transparent 1px),
          linear-gradient(to bottom, var(--line) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 0",
        maskImage: mask,
        WebkitMaskImage: mask,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />
  );
}
