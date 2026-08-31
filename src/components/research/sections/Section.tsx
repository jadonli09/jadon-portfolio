import type { ReactNode } from "react";
import { Reveal } from "@/components/primitives/Reveal";
import { cn } from "@/lib/cn";
import type { SectionId } from "../sections";

/**
 * Every section shares one shell so rhythm and the rail's anchor targets stay
 * consistent. `id` must match an entry in ../sections.ts or the rail will not
 * highlight it.
 */
export function Section({
  id,
  kicker,
  heading,
  children,
  className,
}: {
  id: SectionId;
  kicker?: string;
  heading?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-t border-[var(--line)] px-6 py-[clamp(3.5rem,9vh,7rem)] lg:pl-64 lg:pr-10",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl">
        {kicker ? (
          <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--accent)]">
            {kicker}
          </p>
        ) : null}
        {heading ? (
          <Reveal>
            <h2 className="mb-6 max-w-[18ch] font-serif text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.06] text-balance">
              {heading}
            </h2>
          </Reveal>
        ) : null}
        {children}
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
    <p className={cn("mb-4 max-w-[64ch] text-[1.02rem] leading-[1.72] text-[var(--muted)]", className)}>
      {children}
    </p>
  );
}
