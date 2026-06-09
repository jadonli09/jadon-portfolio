"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

/**
 * App-level page transition. `template.tsx` remounts on every navigation, so a
 * fresh enter animation plays as each differently-styled world loads in.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
