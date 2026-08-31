"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Wraps a product screenshot so it enters desaturated and resolves to full
 * colour once on scroll-in. Photographs should NOT use this — they keep the
 * `.archival` halftone treatment.
 */
export function Develop({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className={cn(inView ? "developed" : "developing", className)}>
      {children}
    </div>
  );
}
