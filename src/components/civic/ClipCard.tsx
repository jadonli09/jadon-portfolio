/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, Play } from "lucide-react";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";

/**
 * A reel or video, in the page's own frame: its poster, a play button, and a
 * caption underneath. Opens the post on Instagram (or YouTube) in a new tab,
 * so no third-party embed chrome lands on the page.
 */
export function ClipCard({
  href,
  poster,
  title,
  meta,
  aspect = "9 / 16",
  className,
}: {
  href: string;
  poster: string;
  title: string;
  meta?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor-hover
      className={cn("group block", className)}
    >
      <div
        className="relative overflow-hidden rounded-md border border-[var(--line)] bg-black shadow-[0_8px_30px_rgba(20,17,13,0.12)]"
        style={{ aspectRatio: aspect }}
      >
        <img
          src={asset(poster)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-[scale] duration-700 ease-[var(--ease-cine)] group-hover:scale-[1.05]"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/35 via-transparent to-transparent">
          <span className="flex size-14 items-center justify-center rounded-full bg-[var(--accent)] shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-[scale] duration-300 group-hover:scale-110">
            <Play className="size-6 translate-x-0.5 fill-white text-white" strokeWidth={0} />
          </span>
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold leading-snug text-[var(--fg)]">{title}</p>
          {meta && <p className="mt-0.5 text-sm leading-snug text-[var(--muted)]">{meta}</p>}
        </div>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-[var(--muted)] transition-[translate,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
      </div>
    </a>
  );
}
