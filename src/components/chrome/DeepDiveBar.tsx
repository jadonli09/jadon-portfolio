"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import type { WorldId } from "@/lib/data";
import { useHideOnScroll } from "@/components/hooks/useHideOnScroll";

/**
 * Always-available "return home" affordance on a deep-dive page. Links back to
 * the sentence of doors on the root, so digging in and coming back is one
 * click — the core of the explore model.
 */
export function DeepDiveBar({ id }: { id: WorldId }) {
  const hidden = useHideOnScroll();
  return (
    <motion.div
      data-world-origin={id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className={`fixed bottom-5 left-5 z-40 transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:bottom-7 md:left-7 ${hidden ? "pointer-events-none translate-y-24 opacity-0" : ""}`}
    >
      <Link
        href="/"
        data-cursor-hover
        className="group inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-2)]/80 px-5 py-3 text-base font-medium text-[var(--muted)] backdrop-blur transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)]"
      >
        <ArrowLeft className="size-4 transition-[translate] duration-300 group-hover:-translate-x-1" />
        Home
      </Link>
    </motion.div>
  );
}
