"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ExternalLink, Globe, Wifi } from "lucide-react";
import { Magnetic } from "@/components/primitives/Magnetic";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/base";

type EmbedState = "loading" | "loaded" | "fallback";

interface LiveEmbedProps {
  url: string;
  domain: string;
  title: string;
  /** Height of the iframe. Default 520px. */
  height?: number;
  /** CSS aspect-ratio for the embed area (e.g. "1280/800"). Overrides height —
   *  use to show a screenshot uncropped at its native proportions. */
  aspect?: string;
  /** If true, show a smaller thumbnail-style frame */
  thumbnail?: boolean;
  /** Captured screenshot of the live site. When set, it's shown in the mockup
   *  (reliable — many sites block iframing via X-Frame-Options). */
  screenshot?: string;
  className?: string;
}

/** Screenshot preview inside the mockup, with a hover "Visit live" overlay. */
function ShotPreview({ src, url, title, thumbnail }: { src: string; url: string; title: string; thumbnail?: boolean }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor-hover
      className="group/shot absolute inset-0 block overflow-hidden bg-[var(--bg-2)]"
      title={`Open ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(src)}
        alt={`Live preview of ${title}`}
        loading="lazy"
        className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover/shot:scale-[1.04]"
      />
      {/* live badge */}
      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 border border-white/30 bg-black/70 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-widest text-white backdrop-blur">
        <span className="size-1.5 animate-pulse bg-[var(--accent)]" /> Live
      </span>
      {/* hover overlay CTA */}
      <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover/shot:opacity-100">
        <span className={cn("mb-5 inline-flex items-center gap-2 bg-white font-bold uppercase tracking-[0.22em] text-black", thumbnail ? "px-3 py-1.5 text-[0.6rem]" : "px-5 py-2.5 text-xs")}>
          Visit live <ArrowUpRight className="size-3.5" />
        </span>
      </span>
    </a>
  );
}

/** Browser chrome bar for the device mockup — mission console styling */
function BrowserChrome({ domain, url }: { domain: string; url: string }) {
  return (
    <div className="flex h-10 shrink-0 items-center gap-3 border-b border-[var(--line)] bg-[#161616] px-4">
      {/* Console indicator squares */}
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 border border-[var(--accent)] bg-[var(--accent)]" />
        <span className="size-2.5 border border-[var(--fg)] bg-transparent" />
        <span className="size-2.5 border border-[var(--fg)] bg-transparent" />
      </div>

      {/* Address bar */}
      <div className="flex min-w-0 flex-1 items-center gap-2 border border-[var(--line)] bg-[#0c0c0c] px-3 py-1.5">
        <Globe className="size-3 shrink-0 text-[var(--muted)]" />
        <span className="truncate font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">{domain}</span>
        <Wifi className="ml-auto size-3 shrink-0 text-[var(--fg)] opacity-60" />
      </div>

      {/* Visit button */}
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className="shrink-0 border border-[var(--line)] p-1 text-[var(--muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]"
        title={`Open ${domain}`}
      >
        <ArrowUpRight className="size-3.5" />
      </a>
    </div>
  );
}

/** Loading skeleton */
function LoadingSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 p-6" aria-label="Loading…">
      <div className="h-8 w-3/4 animate-pulse bg-[var(--line)]" />
      <div className="h-4 w-1/2 animate-pulse bg-[var(--line)]" />
      <div className="mt-2 h-40 animate-pulse bg-[var(--line)]" />
      <div className="flex gap-3">
        <div className="h-4 w-16 animate-pulse bg-[var(--line)]" />
        <div className="h-4 w-24 animate-pulse bg-[var(--line)]" />
      </div>
    </div>
  );
}

/** Branded fallback panel — shown if iframe fails or times out */
function FallbackPanel({
  domain,
  title,
  url,
  thumbnail,
}: {
  domain: string;
  title: string;
  url: string;
  thumbnail?: boolean;
}) {
  return (
    <motion.div
      className="relative flex h-full flex-col items-center justify-center overflow-hidden p-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Grid pattern */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-10" aria-hidden>
        <defs>
          <pattern id={`grid-fb-${domain.replace(".", "-")}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--fg)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-fb-${domain.replace(".", "-")})`} />
      </svg>

      {/* Globe icon in viewfinder brackets */}
      <div className="frame-brackets relative mb-5 flex items-center justify-center p-4">
        <Globe className={cn("text-[var(--fg)]", thumbnail ? "size-6" : "size-8")} />
      </div>

      {/* Title */}
      <p className={cn("mission-display text-[var(--fg)]", thumbnail ? "text-xl" : "text-3xl md:text-4xl")}>
        {title}
      </p>

      {/* Domain */}
      <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--muted)]">{domain}</p>

      {/* Note */}
      <p className={cn("mt-4 text-[var(--muted)]", thumbnail ? "text-xs" : "text-sm")}>
        Live site — click to visit
      </p>

      {/* CTA */}
      <Magnetic strength={0.3} className="mt-6">
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          data-cursor-hover
          className={cn(
            "inline-flex items-center gap-2 bg-[var(--fg)] font-bold uppercase tracking-[0.22em] text-black transition-all hover:brightness-90 active:scale-95",
            thumbnail ? "px-4 py-2 text-[0.65rem]" : "px-6 py-3 text-xs",
          )}
        >
          Visit {title} <ExternalLink className="size-3.5" />
        </a>
      </Magnetic>
    </motion.div>
  );
}

/**
 * LiveEmbed — attempts an iframe; falls back gracefully if the site blocks framing.
 * Uses a 3.5s timeout: if `onLoad` hasn't fired, we switch to the fallback panel.
 * Also switches on `onError`.
 */
export function LiveEmbed({ url, domain, title, height = 520, aspect, thumbnail = false, screenshot, className }: LiveEmbedProps) {
  const [state, setState] = useState<EmbedState>(screenshot ? "loaded" : "loading");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (screenshot) return; // screenshot path is reliable, no iframe race
    // Start the fallback timer
    timeoutRef.current = setTimeout(() => {
      setState((prev) => (prev === "loading" ? "fallback" : prev));
    }, 3500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [screenshot]);

  function handleLoad() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Some browsers fire onLoad even on blocked frames (they load a blank page).
    // We attempt to detect this by checking if the iframe is truly loaded (content accessible).
    // However, cross-origin frames will throw on access — that means the SITE loaded fine.
    try {
      const href = iframeRef.current?.contentWindow?.location?.href;
      // If we can read it, it may be same-origin or blank
      if (href === "about:blank" || href === "") {
        setState("fallback");
        return;
      }
    } catch {
      // Cross-origin access denied — means the actual site loaded, which is what we want
    }
    setState("loaded");
  }

  function handleError() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setState("fallback");
  }

  const h = thumbnail ? 240 : height;

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden border border-[var(--line)]",
        "bg-[#0c0c0c] shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
        className,
      )}
      style={aspect ? undefined : { minHeight: h + 40 }}
    >
      <BrowserChrome domain={domain} url={url} />

      {/* Embed area */}
      <div
        className="relative flex-1 overflow-hidden"
        style={aspect ? { aspectRatio: aspect } : { height: h }}
      >
        {screenshot ? (
          <ShotPreview src={screenshot} url={url} title={title} thumbnail={thumbnail} />
        ) : (
          <>
        <AnimatePresence mode="wait">
          {state === "loading" && (
            <motion.div
              key="skeleton"
              className="absolute inset-0 bg-[var(--bg)]"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <LoadingSkeleton />
            </motion.div>
          )}

          {state === "fallback" && (
            <motion.div
              key="fallback"
              className="absolute inset-0 bg-[var(--bg)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FallbackPanel domain={domain} title={title} url={url} thumbnail={thumbnail} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* iframe always rendered but hidden until loaded, avoids remount */}
        <iframe
          ref={iframeRef}
          src={url}
          title={title}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          className={cn(
            "absolute inset-0 h-full w-full border-0 transition-opacity duration-500",
            state === "loaded" ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          style={aspect ? undefined : { height: h }}
        />
          </>
        )}
      </div>
    </div>
  );
}
