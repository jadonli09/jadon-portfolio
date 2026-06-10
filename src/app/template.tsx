"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

/**
 * App-level page transition. `template.tsx` remounts on every navigation, so a
 * fresh enter animation plays as each world loads in.
 *
 * IMPORTANT: animate opacity ONLY — `transform`/`filter` here would create a
 * containing block for `position: fixed`, trapping in-page fixed elements (the
 * chapter rail, the "back to the story" pill) inside the page instead of the
 * viewport.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
