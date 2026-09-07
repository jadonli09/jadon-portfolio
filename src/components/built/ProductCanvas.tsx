"use client";

import { ArrowUpRight } from "lucide-react";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";

/* ────────────────────────────────────────────────────────────────────
   ProductCanvas — a screenshot presented as an object, not as an image.

   Replaces the old iframe-with-timeout embed entirely. Every one of these
   sites blocks framing or takes seconds to paint; the screenshot was already
   the real path, and the iframe branch was a race the page always lost. What
   is left is a housing with a lit top edge, a real shadow, and a chrome bar
   that says which domain this is and that it is live.

   No filter animation. The previous version entered every screenshot
   desaturated and resolved it to colour over 900ms — the one piece of evidence
   of what each product looks like, withheld for almost a second.
   ──────────────────────────────────────────────────────────────────── */

export function ProductCanvas({
  domain,
  url,
  title,
  screenshot,
  live = true,
  aspect,
  className,
}: {
  domain: string;
  url: string;
  title: string;
  screenshot?: string;
  /** Whether to show the live indicator in the chrome bar. */
  live?: boolean;
  aspect?: string;
  className?: string;
}) {
  const ratio = aspect ?? "1280/800";
  return (
    <div className={cn("canvas flex flex-col", className)}>
      {/* ── Chrome bar ── */}
      <div className="canvas-bar">
        {live ? <span className="live-dot shrink-0" aria-hidden /> : null}
        <span className="t-small vibrant truncate text-[0.8rem]">{domain}</span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          data-cursor-hover
          aria-label={`Open ${domain} in a new tab`}
          className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full text-[var(--muted)] transition-[color,background-color,scale] duration-150 ease-[var(--ease-out)] hover:bg-black/5 hover:text-[var(--fg)] active:scale-90"
        >
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>

      {/* ── The shot ── */}
      <div className="relative flex-1" style={{ aspectRatio: ratio }}>
        {screenshot ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor-hover
            title={`Open ${title}`}
            // Native HTML5 dragging would fight the deck's own pointer drag —
            // the browser would start ghosting the image out of the page.
            draggable={false}
            className="plate-host absolute inset-0 block overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(screenshot)}
              alt={`${title} — a screenshot of the live site`}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover object-top"
            />

            <span
              aria-hidden
              className="plate-scrim absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent"
            />
            <span aria-hidden className="absolute inset-x-0 bottom-0 flex justify-center">
              <span className="plate surface-chrome vibrant mb-6 inline-flex items-center gap-1.5 px-4 py-2 text-[0.8rem]">
                Visit live <ArrowUpRight className="size-3.5" />
              </span>
            </span>
          </a>
        ) : (
          /* jadonli.com has no screenshot — it is the page you are reading. */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--bg-2)] px-6 text-center">
            <p className="t-head">{title}</p>
            <p className="t-small max-w-xs">You are looking at it.</p>
          </div>
        )}
      </div>
    </div>
  );
}
