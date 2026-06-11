"use client";

import { useState } from "react";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";

/**
 * Photo slot with a designed fallback: renders the image if it exists in
 * /public/img, otherwise a framed "photo en route" placeholder. Drop the
 * real file in later — no code change needed.
 */
export function SlotPhoto({
  src,
  alt,
  monogram = "JL",
  note = "Photo en route",
  tone = "dark",
  className,
}: {
  src: string;
  alt: string;
  /** Big ghost initials shown on the placeholder. */
  monogram?: string;
  /** Small caption under the monogram. */
  note?: string;
  /** "dark" for asphalt sections, "paper" for the ivory invitation. */
  tone?: "dark" | "paper";
  className?: string;
}) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    const paper = tone === "paper";
    return (
      <div
        className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
        style={{
          background: paper
            ? "repeating-linear-gradient(45deg, rgba(26,20,13,0.05) 0 1px, transparent 1px 9px), #ece1c8"
            : "repeating-linear-gradient(45deg, rgba(212,175,106,0.08) 0 1px, transparent 1px 9px), #15110c",
        }}
        role="img"
        aria-label={`${alt} — photo coming soon`}
      >
        <span
          aria-hidden
          className="font-anton text-[3rem] leading-none tracking-tight"
          style={{ color: paper ? "rgba(26,20,13,0.22)" : "rgba(212,175,106,0.28)" }}
        >
          {monogram}
        </span>
        <span
          className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.25em]"
          style={{ color: paper ? "rgba(26,20,13,0.45)" : "rgba(154,140,114,0.8)" }}
        >
          {note}
        </span>
        <span
          aria-hidden
          className="absolute inset-2 border border-dashed"
          style={{ borderColor: paper ? "rgba(26,20,13,0.18)" : "rgba(212,175,106,0.22)" }}
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setMissing(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
