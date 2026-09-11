"use client";

import type { ReactNode } from "react";
import { jumpTo } from "../lab/bus";
import { cn } from "@/lib/cn";

/**
 * The page's one button. It is 56px tall with a 17px label because the row of
 * 10px monospace links it replaces was neither readable nor clickable.
 *
 * `solid` fluoresces on hover — a bloom in the reporter's own red. That is the
 * only decorative motion on the page, and it is on the thing the page is about.
 */
type Common = {
  children: ReactNode;
  tone?: "solid" | "quiet";
  className?: string;
};

const BASE =
  "inline-flex min-h-[3.5rem] items-center justify-center px-7 text-[1.06rem] font-medium tracking-[-0.005em] " +
  "transition-[background-color,color,border-color,box-shadow] duration-300 " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-[var(--bg)]";

const TONES = {
  solid:
    "border border-[var(--accent)] bg-[var(--accent)] text-[#12040a] hover:shadow-[0_0_0_1px_var(--accent),0_0_36px_-4px_var(--accent)]",
  quiet:
    "border border-[var(--line)] bg-transparent text-[var(--fg)] hover:border-[var(--fg)] hover:bg-[var(--bg-2)]",
} as const;

/** Scrolls to a section on this page. */
export function JumpAction({
  to,
  children,
  tone = "quiet",
  className,
}: Common & { to: string }) {
  return (
    <a
      href={`#${to}`}
      onClick={(e) => {
        e.preventDefault();
        jumpTo(to);
      }}
      className={cn(BASE, TONES[tone], className)}
    >
      {children}
    </a>
  );
}

/** Leaves the page — a full-size poster, a lab site. */
export function LinkAction({
  href,
  children,
  tone = "quiet",
  external = true,
  className,
}: Common & { href: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(BASE, TONES[tone], className)}
    >
      {children}
    </a>
  );
}
