import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { ORIGINS } from "@/lib/data";

/* ── SVG origin marker ─────────────────────────────────────── */

function OriginDot() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="5" stroke="var(--accent)" strokeWidth="1" />
      <circle cx="6" cy="6" r="2" fill="var(--accent)" />
    </svg>
  );
}

/* ── Main export ─────────────────────────────────────────── */

export function OriginsStrip() {
  return (
    <section className="border-b border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-9 md:py-24">
        {/* Header */}
        <RevealGroup className="mb-10">
          <Reveal>
            <p className="eyebrow">Where it started</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-3 font-display text-[1.8rem] leading-[0.98] tracking-tight md:text-[2.6rem]">
              Before the trophies.
            </h2>
          </Reveal>
        </RevealGroup>

        {/* Origins timeline rail */}
        <div className="relative">
          {/* Vertical rail */}
          <div
            className="absolute left-[5px] top-0 h-full w-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--accent), var(--accent-2) 60%, transparent)",
              opacity: 0.35,
            }}
            aria-hidden
          />

          <ul className="flex flex-col gap-8 pl-8">
            {ORIGINS.map((origin, i) => (
              <Reveal key={i} delay={i * 0.12} as="li" className="relative">
                {/* Dot on rail */}
                <div className="absolute -left-8 top-1 flex items-center justify-center">
                  <OriginDot />
                </div>

                <div>
                  {/* Year label */}
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em]" style={{ color: "var(--accent)" }}>
                    {origin.year}
                  </span>
                  {/* Note */}
                  <p className="mt-1 font-grotesk text-sm leading-relaxed text-[var(--muted)] md:text-base">
                    {origin.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Closing note */}
        <Reveal delay={0.4} className="mt-12">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[var(--muted)] md:max-w-md">
            Journaling since 8th grade — every result has a process behind it.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
