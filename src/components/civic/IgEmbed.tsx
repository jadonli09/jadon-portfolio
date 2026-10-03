"use client";

import { useEffect } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/cn";

/** Loads Instagram's official embed.js once, then (re)processes blockquotes. */
function useIgEmbed() {
  useEffect(() => {
    const w = window as unknown as { instgrm?: { Embeds: { process: () => void } } };
    if (w.instgrm) {
      w.instgrm.Embeds.process();
      return;
    }
    const onLoad = () =>
      (window as unknown as { instgrm?: { Embeds: { process: () => void } } }).instgrm?.Embeds.process();
    let s = document.getElementById("ig-embed-js") as HTMLScriptElement | null;
    if (!s) {
      s = document.createElement("script");
      s.id = "ig-embed-js";
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      document.body.appendChild(s);
    }
    s.addEventListener("load", onLoad);
    return () => s?.removeEventListener("load", onLoad);
  }, []);
}

/** A single Instagram reel, embedded via the official embed.js (auto-sizes). */
export function IgEmbed({ reel, className }: { reel: string; className?: string }) {
  useIgEmbed();
  return (
    <blockquote
      className={cn("instagram-media", className)}
      data-instgrm-permalink={`https://www.instagram.com/reel/${reel}/`}
      data-instgrm-version="14"
      style={{
        background: "#fff",
        border: 0,
        borderRadius: 0,
        margin: 0,
        minWidth: 0,
        width: "100%",
        maxWidth: "100%",
      }}
    />
  );
}

/**
 * Themed wrapper around an IG reel — an editorial "clip" frame with a captioned
 * header (play glyph + title, optional one-line note) so the embed matches the
 * page rather than sitting as a bare Instagram card.
 */
export function ReelCard({ reel, title, tag }: { reel: string; title: string; tag?: string }) {
  return (
    <figure className="group overflow-hidden border border-[var(--line)] bg-[var(--bg-2)] shadow-[0_8px_30px_rgba(20,17,13,0.08)] transition-transform duration-300 hover:-translate-y-1">
      <figcaption className="flex items-start gap-2 border-b border-[var(--line)] px-3 py-2.5">
        <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]">
          <Play className="size-2.5 translate-x-px fill-white text-white" strokeWidth={0} />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-base font-semibold leading-tight">{title}</span>
          {tag ? <span className="mt-0.5 block text-sm leading-snug text-[var(--muted)]">{tag}</span> : null}
        </span>
      </figcaption>
      <div className="bg-[var(--bg)] p-2.5">
        <IgEmbed reel={reel} />
      </div>
    </figure>
  );
}
