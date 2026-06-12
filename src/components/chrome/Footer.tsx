import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/lib/data";
import { Magnetic } from "@/components/primitives/Magnetic";

/** Designed page close: name block + contact links — never a blank white footer. */
export function Footer() {
  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--bg-2)] px-5 py-16 md:px-9 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
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
