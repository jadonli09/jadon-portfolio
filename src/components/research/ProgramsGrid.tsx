"use client";

import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { TiltCard } from "@/components/primitives/TiltCard";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { RESEARCH } from "@/lib/data";
import { cn } from "@/lib/cn";

// Decorative icon per program (SVG paths, no external deps)
const PROGRAM_ICONS: Record<string, React.ReactNode> = {
  "Youth STEM Journal Club": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="5" width="18" height="22" rx="2" stroke="var(--accent)" strokeWidth="1.4" />
      <line x1="8" y1="11" x2="18" y2="11" stroke="var(--accent)" strokeWidth="1" opacity="0.6" />
      <line x1="8" y1="15" x2="18" y2="15" stroke="var(--accent)" strokeWidth="1" opacity="0.6" />
      <line x1="8" y1="19" x2="14" y2="19" stroke="var(--accent)" strokeWidth="1" opacity="0.6" />
      <circle cx="24" cy="24" r="6" fill="var(--bg-2)" stroke="var(--accent-2)" strokeWidth="1.4" />
      <text x="24" y="28" textAnchor="middle" fontSize="7" fill="var(--accent-2)" fontFamily="monospace">★</text>
    </svg>
  ),
  "PRISM": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <polygon points="16,4 28,24 4,24" stroke="var(--accent)" strokeWidth="1.4" fill="none" />
      <line x1="16" y1="4" x2="16" y2="24" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
      <line x1="10" y1="14" x2="22" y2="14" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
      <circle cx="16" cy="26" r="2" fill="var(--accent-2)" opacity="0.8" />
    </svg>
  ),
  "MSJ STEM-PAC": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="11" stroke="var(--accent)" strokeWidth="1.4" fill="none" />
      <circle cx="16" cy="16" r="6" stroke="var(--accent)" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="16" cy="16" r="2" fill="var(--accent-2)" />
      <line x1="16" y1="5" x2="16" y2="9" stroke="var(--accent)" strokeWidth="1.4" />
      <line x1="16" y1="23" x2="16" y2="27" stroke="var(--accent)" strokeWidth="1.4" />
      <line x1="5" y1="16" x2="9" y2="16" stroke="var(--accent)" strokeWidth="1.4" />
      <line x1="23" y1="16" x2="27" y2="16" stroke="var(--accent)" strokeWidth="1.4" />
    </svg>
  ),
  "UMass Research Intensive": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="5" y="8" width="22" height="16" rx="2" stroke="var(--accent)" strokeWidth="1.4" fill="none" />
      <line x1="12" y1="8" x2="12" y2="24" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
      <line x1="20" y1="8" x2="20" y2="24" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
      <circle cx="16" cy="5" r="2.5" stroke="var(--accent-2)" strokeWidth="1.2" fill="none" />
      <line x1="16" y1="7.5" x2="16" y2="8" stroke="var(--accent-2)" strokeWidth="1.2" />
    </svg>
  ),
};

export function ProgramsGrid() {
  return (
    <div className="space-y-12">
      <Reveal>
        <p className="eyebrow mb-2">Teaching · Programs · Outreach</p>
        <h2 className="font-display text-3xl leading-tight md:text-5xl">In the field</h2>
      </Reveal>

      <RevealGroup
        className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2"
        stagger={0.1}
        delayChildren={0.1}
      >
        {RESEARCH.programs.map((prog, i) => (
          <Reveal key={prog.title} delay={i * 0.07}>
            <TiltCard
              max={5}
              className={cn(
                "group relative h-full overflow-hidden bg-[var(--bg)] p-8 transition-colors duration-300 hover:bg-[var(--bg-2)]",
                "md:p-10"
              )}
            >
              {/* Number label */}
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
                0{i + 1}
              </span>

              {/* Icon */}
              <div className="mt-5 mb-6">
                {PROGRAM_ICONS[prog.title] ?? (
                  <div className="size-8 rounded border border-[var(--accent)] opacity-60" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-display text-xl leading-snug transition-colors group-hover:text-[var(--accent)] md:text-2xl">
                  {prog.title}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[var(--accent-2)]">
                  {prog.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  {prog.detail}
                </p>
              </div>

              {/* Site link */}
              {prog.site.startsWith("http") || prog.site.includes(".org") || prog.site.includes(".com") ? (
                <div className="mt-6 flex items-center gap-1.5">
                  <span className="font-mono text-xs text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                    {prog.site}
                  </span>
                  <ExternalLink className="size-3 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
                </div>
              ) : (
                <div className="mt-6">
                  <span className="font-mono text-xs text-[var(--muted)]">{prog.site}</span>
                </div>
              )}

              {/* Bottom accent line on hover */}
              <motion.div
                className="absolute bottom-0 left-0 h-px bg-[var(--accent)]"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                style={{ transformOrigin: "left" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </TiltCard>
          </Reveal>
        ))}
      </RevealGroup>
    </div>
  );
}
