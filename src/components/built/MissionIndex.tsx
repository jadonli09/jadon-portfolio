import { Reveal } from "@/components/primitives/Reveal";
import { PROJECTS } from "@/lib/data";

/**
 * The manifest. Eight rows in `PROJECTS` order — which IS display order, and
 * the single source of the M-numbers the fleet deck also uses. Do not sort
 * here; sorting independently would desync the numbering.
 * Server-safe — no client hooks.
 */
const ORDERED = PROJECTS;

export function MissionIndex() {
  return (
    <section className="border-b border-[var(--line)] bg-[var(--bg-2)]">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-9 md:py-20">
        <Reveal>
          <div className="mb-8 flex items-center gap-4">
            <span className="eyebrow text-[var(--fg)]">The manifest</span>
            <span className="h-px flex-1 bg-[var(--line)]" />
          </div>
        </Reveal>

        <div className="border-t border-[var(--line)]">
          {ORDERED.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <a
                href={`#${p.slug}`}
                data-cursor-hover
                className="group grid grid-cols-[3rem_1fr] items-center gap-x-4 border-b border-[var(--line)] py-4 transition-colors duration-300 hover:bg-[var(--bg)] md:grid-cols-[3.5rem_1.1fr_1.4fr_9rem] md:gap-x-8"
              >
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-[var(--muted)]">
                  M-{String(i + 1).padStart(2, "0")}
                </span>

                <span className="mission-display truncate text-lg text-[var(--fg)] transition-colors group-hover:text-[var(--accent)] md:text-xl">
                  {p.name}
                </span>

                <span className="hidden truncate text-sm text-[var(--muted)] md:block">
                  {p.tagline}
                </span>

                <span className="hidden justify-self-end font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)] md:block">
                  <span className="text-[var(--fg)]">{p.stats[0].value}</span>{" "}
                  {p.stats[0].label}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
