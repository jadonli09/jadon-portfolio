"use client";

import { motion } from "motion/react";
import { lineWord, EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Word-by-word masked reveal for big headlines. Each word slides up from a
 * clipping mask with a stagger.
 */
export function KineticHeadline({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  once?: boolean;
}) {
  const words = text.split(" ");
  return (
    <Tag className={cn("inline-block", className)}>
      <motion.span
        className="inline"
        initial="hidden"
        whileInView="show"
        viewport={{ once, margin: "-10% 0px" }}
        transition={{ staggerChildren: 0.06, delayChildren: delay }}
        variants={{ hidden: {}, show: {} }}
      >
        {words.map((w, i) => (
          <span key={i} className="line-mask inline-block align-baseline pb-[0.12em] -mb-[0.12em]" style={{ marginRight: "0.26em" }}>
            <motion.span className="inline-block" variants={lineWord} transition={{ duration: 1, ease: EASE }}>
              {w}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
