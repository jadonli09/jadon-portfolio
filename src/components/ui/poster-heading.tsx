"use client";

import { motion } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Hero-04 section heading: small wide-tracked mono label with an arrow glyph,
 * then an oversized ultra-bold tracking-tight uppercase headline.
 * `align="right"` mirrors the hero's "RECENT WORK / A City, Documented" block.
 */
export function PosterHeading({
  label,
  title,
  meta,
  align = "left",
  className,
  titleClassName,
}: {
  label: string;
  title: string;
  meta?: string;
  align?: "left" | "right" | "center";
  className?: string;
  titleClassName?: string;
}) {
  const alignCls =
    align === "right" ? "items-end text-right" : align === "center" ? "items-center text-center" : "items-start";

  return (
    <div className={cn("flex flex-col gap-3", alignCls, className)}>
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <span className="text-base font-medium tracking-wider md:text-lg">{label.toUpperCase()}</span>
        <ArrowDownRight className="size-5 text-[var(--accent)]" />
        {meta && (
          <span className="ml-3 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)]">
            {meta}
          </span>
        )}
      </motion.div>

      <KineticHeadline
        as="h2"
        text={title}
        className={cn(
          "font-grotesk text-4xl font-bold uppercase tracking-[-2px] md:text-6xl md:tracking-[-4px]",
          titleClassName,
        )}
        delay={0.1}
      />
    </div>
  );
}
