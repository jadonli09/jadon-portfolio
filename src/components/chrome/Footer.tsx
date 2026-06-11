import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { PROFILE, WORLDS, type WorldId } from "@/lib/data";
import { Magnetic } from "@/components/primitives/Magnetic";

/**
 * Designed page close. Shows a "next world" hand-off and the contact links —
 * never a blank white footer.
 */
export function Footer({ current }: { current?: WorldId }) {
  const order = WORLDS;
  const idx = order.findIndex((w) => w.id === current);
  const next = idx >= 0 ? order[(idx + 1) % order.length] : order[0];

  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--bg-2)] px-5 py-16 md:px-9 md:py-24">
      <div className="mx-auto max-w-6xl">
        {current && (
          <Link href={next.href} data-cursor-hover className="group block">
            <span className="eyebrow">Next chapter — {next.index}</span>
            <div className="mt-3 flex items-center gap-4">
              <span className="font-display text-[2.6rem] leading-none transition-transform duration-500 group-hover:translate-x-3 md:text-[5.5rem]">
                {next.title}
              </span>
              <ArrowRight className="size-8 shrink-0 transition-transform duration-500 group-hover:translate-x-3 md:size-14" />
            </div>
          </Link>
        )}

        <div className="flex flex-col justify-between gap-8 border-t border-[var(--line)] pt-8 md:flex-row md:items-end" style={{ marginTop: current ? "4rem" : 0, borderTopWidth: current ? undefined : 0 }}>
          <div>
            <p className="font-display text-2xl">{PROFILE.name}</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
              {PROFILE.school} · {PROFILE.city}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest">
            {[
              { label: "Instagram", href: PROFILE.links.instagram },
              { label: "LinkedIn", href: PROFILE.links.linkedin },
              { label: "GitHub", href: PROFILE.links.github },
              { label: "Email", href: `mailto:${PROFILE.email}` },
            ].map((l) => (
              <Magnetic key={l.label} strength={0.3}>
                <a href={l.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-[var(--muted)] transition-colors hover:text-[var(--fg)]">
                  {l.label}
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>
        <p className="mt-10 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
          © {new Date().getFullYear()} Jadon Li — one person, locked in
        </p>
      </div>
    </footer>
  );
}
