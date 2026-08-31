import { Reveal } from "@/components/primitives/Reveal";
import { PROJECTS, type Project } from "@/lib/data";

/**
 * The manifest. Eight rows in `PROJECTS` order — which IS display order, and
 * the single source of the M-numbers the fleet deck also uses. Do not sort
 * here; sorting independently would desync the numbering.
 * Server-safe — no client hooks.
 */
const ORDERED = PROJECTS;

/**
 * The right-hand column earns its place only when the stat tells the reader
 * something the row has not already told them. "Live · cuesheet.xyz" restates a
 * domain the row itself names, and "Design / Operation" states nothing; a
 * figure does. Rows without one drop the column rather than take a substitute —
 * promoting a second stat here would print the same number twice on the page.
 */
function headlineStat(p: Project) {
  const s = p.stats[0];
  return s && /\d/.test(s.value) ? s : null;
}

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
          {ORDERED.map((p, i) => {
            const stat = headlineStat(p);
            return (
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

                {stat ? (
                  <span className="hidden justify-self-end font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)] md:block">
                    <span className="text-[var(--fg)]">{stat.value}</span> {stat.label}
                  </span>
                ) : null}
              </a>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
