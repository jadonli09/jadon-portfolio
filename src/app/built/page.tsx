import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { Reveal } from "@/components/primitives/Reveal";
import { BuiltHero } from "@/components/built/BuiltHero";
import { MissionIndex } from "@/components/built/MissionIndex";
import { Chapter } from "@/components/built/Chapter";
import { FleetDeck } from "@/components/built/FleetDeck";
import { AcornDemo } from "@/components/built/demos/AcornDemo";
import { HermesPipeline } from "@/components/built/demos/HermesPipeline";
import { NotebookReader } from "@/components/built/demos/NotebookReader";
import { ProductsGrid } from "@/components/built/ProductsGrid";
import { GitHubShowcase } from "@/components/built/GitHubShowcase";
import { LaunchLedger } from "@/components/built/LaunchLedger";
import { DecodeText, MissionRail } from "@/components/built/MissionFX";
import { PROFILE, PROJECTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Things I've Built",
  description:
    "AcornPrep, CueSheet, Hermes — real products with real users. 500+ users, #1 Google result, shipped by a high-school builder.",
};

const bySlug = (s: string) => PROJECTS.find((p) => p.slug === s)!;

/**
 * Things I've Built — World 03.
 * Server component shell. All interactive sections carry their own "use client" directives.
 * Art direction: retro space-program mission archive — halftone black, paper white,
 * condensed stencil display type, viewfinder brackets, grayscale archival prints.
 */
export default function BuiltPage() {
  return (
    <World id="built">
      {/* Scroll-progress telemetry rail (desktop) */}
      <MissionRail />

      {/* ── 1. HERO ──────────────────────────────────────────── */}
      <BuiltHero />

      {/* ── 2. MISSION INDEX ─────────────────────────────────── */}
      <MissionIndex />

      {/* ── 3. M-01 ACORNPREP ────────────────────────────────── */}
      <Chapter project={bySlug("acornprep")} no="01">
        <AcornDemo />
      </Chapter>

      {/* ── 4. M-02 HERMES ───────────────────────────────────── */}
      <Chapter project={bySlug("hermes")} no="02">
        <HermesPipeline />
      </Chapter>

      {/* ── 5. M-03 NOTEBOOKLI ───────────────────────────────── */}
      <Chapter project={bySlug("notebookli")} no="03">
        <NotebookReader />
      </Chapter>

      {/* ── 6. THE REST OF THE FLEET ─────────────────────────── */}
      <FleetDeck />

      {/* ── 7. OTHER PRODUCTS GRID ───────────────────────────── */}
      <ProductsGrid />

      {/* ── 8. GITHUB SHOWCASE ───────────────────────────────── */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-28">
          {/* Section header */}
          <div className="mb-14">
            <Reveal>
              <p className="eyebrow mb-4">Open source — transmission log</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mission-display text-[2.2rem] md:text-[3.6rem]">
                <DecodeText text="The code," />{" "}
                <span className="stencil">
                  <DecodeText text="in public." duration={1.2} />
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
                What&apos;s been committed, pushed, and shipped — documented on GitHub.
              </p>
            </Reveal>
          </div>

          <GitHubShowcase user={PROFILE.links.githubUser} />
        </div>
      </section>

      {/* ── 9. FLIGHT LOG ────────────────────────────────────── */}
      <LaunchLedger />

      {/* ── 10. CLOSING MANIFESTO ────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20 text-center md:px-9 md:py-28">
        <Reveal>
          <p className="eyebrow mb-8">The builder&apos;s creed</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mission-display text-[2.6rem] md:text-[4.4rem]">
            <DecodeText text="Build something" />{" "}
            <span className="stencil">
              <DecodeText text="people use." duration={1.2} />
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.3} className="mt-8">
          <p className="mx-auto max-w-xl font-mono text-sm leading-relaxed text-[var(--muted)]">
            Every product here started as a question — what if there was a better way to study
            for AP exams? What if music supervision had better tooling? What if school clubs
            were easier to discover? The answer is always the same: build it.
          </p>
        </Reveal>

        {/* Mission seal — tick rule */}
        <Reveal delay={0.45} className="mt-12 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-[var(--accent)] opacity-70" />
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-[var(--muted)]">
            End of transmission
          </span>
          <span className="h-px w-16 bg-[var(--accent)] opacity-70" />
        </Reveal>
      </section>

      {/* ── 11. FOOTER ────────────────────────────────────────── */}
      <Footer />
    </World>
  );
}
