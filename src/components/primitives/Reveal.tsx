"use client";

import { motion, type Variants } from "motion/react";
import { revealUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Set true on a parent to stagger Reveal children. */
  as?: "div" | "section" | "li" | "span";
  variants?: Variants;
};

/** Single element that reveals up + blur-in on scroll into view. */
export function Reveal({ children, className, delay = 0, as = "div", variants = revealUp }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/** Container that staggers any motion children with the `revealUp` variant. */
export function RevealGroup({
  children,
  className,
  stagger: s = 0.09,
  delayChildren = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={stagger(s, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
}
