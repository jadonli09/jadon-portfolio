import type { ReactNode } from "react";
import { Reveal } from "@/components/primitives/Reveal";
import { cn } from "@/lib/cn";
import type { SectionId } from "../sections";

/**
 * Every section shares one shell so rhythm and the rail's anchor targets stay
 * consistent. `id` must match an entry in ../sections.ts or the rail will not
 * highlight it.
 *
 * No kicker slot on purpose. A tracked-out label above every heading is the
 * page's old habit and it made the whole thing read as small print; where a
 * section needs context it gets `lede` — an actual sentence, at a size a
 * person can read.
 */
export function Section({
  id,
  heading,
  lede,
  children,
  className,
  width = "text",
}: {
  id: SectionId;
  heading?: string;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
  /** "text" reads comfortably; "figure" is for sections carrying big images. */
  width?: "text" | "figure";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-t border-[var(--line)] px-6 py-[clamp(4rem,10vh,7.5rem)] lg:pl-64 lg:pr-10",
        className,
      )}
    >
      <div className={cn("mx-auto", width === "figure" ? "max-w-7xl" : "max-w-5xl")}>
        {heading ? (
          <Reveal>
            <h2 className="max-w-[20ch] font-serif text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.04] tracking-[-0.01em] text-balance">
              {heading}
            </h2>
          </Reveal>
        ) : null}
        {lede ? (
          <p className="mt-5 max-w-[58ch] text-[clamp(1.05rem,1.35vw,1.2rem)] leading-[1.65] text-[var(--muted)]">
            {lede}
          </p>
        ) : null}
        <div className={heading || lede ? "mt-10" : undefined}>{children}</div>
      </div>
    </section>
  );
}

/**
 * Aspect ratio for a figure container, read from the image's own `dims`
 * ("965×441"). Emitted as an INLINE STYLE, never a Tailwind arbitrary class:
 * Tailwind cannot generate classes from runtime strings, so `aspect-[${x}]`
 * silently produces nothing. (Ruling R7.)
 */
export function aspectFrom(dims: string): React.CSSProperties {
  const [w, h] = dims.split(/[×x]/).map((n) => Number(n.trim()));
  return Number.isFinite(w) && Number.isFinite(h) && h > 0
    ? { aspectRatio: `${w} / ${h}` }
    : { aspectRatio: "16 / 9" };
}

/** Body paragraph — one shared measure so copy never runs long. */
export function P({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("mb-5 max-w-[62ch] text-[1.08rem] leading-[1.7] text-[var(--muted)]", className)}>
      {children}
    </p>
  );
}

/** A caption under a figure. Small, but not small print. */
export function Caption({ children }: { children: ReactNode }) {
  return (
    <figcaption className="border-t border-[var(--line)] px-4 py-3 text-[0.9rem] leading-[1.55] text-[var(--muted)]">
      {children}
    </figcaption>
  );
}
