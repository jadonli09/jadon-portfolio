import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";
import { PROJECTS } from "@/lib/data";

/**
 * LaunchLedger — the flight log. Every product, its status, and its key stat
 * in one mono table. Receipts, not claims. Server-safe (no client hooks).
 */

function status(name: string) {
  return name === "Hermes" ? ("IN BUILD" as const) : ("LIVE" as const);
}

export function LaunchLedger() {
  return (
    <section className="border-b border-[var(--line)] bg-[var(--bg-2)]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-9 md:py-24">
        <Reveal>
          <div className="mb-8 flex items-center gap-4">
            <span className="eyebrow text-[var(--fg)]">Flight log</span>
            <span className="h-px flex-1 bg-[var(--line)]" />
            <span className="eyebrow">All missions</span>
          </div>
        </Reveal>

        <div className="border-t border-[var(--line)]">
          {PROJECTS.map((p, i) => {
            const st = status(p.name);
            const live = st === "LIVE";
            const stat = p.stats[0];
            return (
              <Reveal key={p.name} delay={i * 0.06}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor-hover
                className="group grid grid-cols-[3rem_1fr_auto] items-center gap-x-4 border-b border-[var(--line)] py-4 transition-colors duration-300 hover:bg-[var(--bg)] sm:grid-cols-[3.5rem_1.2fr_5.5rem_1fr_auto] md:gap-x-8"
              >
                {/* Mission number */}
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-[var(--muted)]">
                  M-{String(i + 1).padStart(2, "0")}
                </span>

                {/* Designation */}
                <span className="mission-display truncate text-lg text-[var(--fg)] md:text-xl">
                  {p.name}
                </span>

                {/* Status */}
                <span className="hidden items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] sm:flex">
                  <span
                    className="size-1.5"
                    style={{
                      background: live ? "var(--accent)" : "transparent",
                      border: live ? "none" : "1px solid var(--muted)",
                    }}
                  />
                  <span style={{ color: live ? "var(--accent)" : "var(--muted)" }}>{st}</span>
                </span>

                {/* Key stat */}
                <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)] sm:block">
                  <span className="text-[var(--fg)]">{stat.value}</span> {stat.label}
                </span>

                {/* Domain + arrow */}
                <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors group-hover:text-[var(--fg)]">
                  <span className="hidden md:inline">{p.domain}</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
