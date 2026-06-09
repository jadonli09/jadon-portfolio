import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { BuiltHero } from "@/components/built/BuiltHero";
import { AcornFlagship } from "@/components/built/AcornFlagship";
import { ProductsGrid } from "@/components/built/ProductsGrid";
import { GitHubShowcase } from "@/components/built/GitHubShowcase";
import { PROFILE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Things I've Built — Jadon Li",
  description:
    "AcornPrep, CueSheet, Hermes — real products with real users. 500+ users, #1 Google result, shipped by a high-school builder.",
};

/**
 * Things I've Built — World 03.
 * Server component shell. All interactive sections carry their own "use client" directives.
 * Art direction: sleek product launch / dev-tool landing — dark slate, electric periwinkle, product lime.
 */
export default function BuiltPage() {
  return (
    <World id="built">
      {/* ── 1. HERO ──────────────────────────────────────────── */}
      <BuiltHero />

      {/* ── 2. ACORNPREP FLAGSHIP ────────────────────────────── */}
      <AcornFlagship />

      {/* ── 3. OTHER PRODUCTS GRID ───────────────────────────── */}
      <ProductsGrid />

      {/* ── 4. GITHUB SHOWCASE ───────────────────────────────── */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-32">
          {/* Section header */}
          <div className="mb-14">
            <Reveal>
              <p className="eyebrow mb-4">Open source</p>
            </Reveal>
            <KineticHeadline
              as="h2"
              text="The code, in public."
              delay={0.05}
              className="font-display text-[2rem] leading-[1.05] tracking-tight md:text-[3.2rem]"
            />
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
                What&apos;s been committed, pushed, and shipped — documented on GitHub.
              </p>
            </Reveal>
          </div>

          <GitHubShowcase user={PROFILE.links.githubUser} />
        </div>
      </section>

      {/* ── 5. CLOSING MANIFESTO ─────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-28 text-center md:px-9 md:py-40">
        <Reveal>
          <p className="eyebrow mb-8">The builder&apos;s creed</p>
        </Reveal>
        <KineticHeadline
          as="h2"
          text="Build something people use."
          delay={0.1}
          className="font-display text-[2.2rem] leading-[1.05] tracking-tight md:text-[3.8rem]"
        />
        <Reveal delay={0.3} className="mt-8">
          <p className="mx-auto max-w-xl font-mono text-sm leading-relaxed text-[var(--muted)]">
            Every product here started as a question — what if there was a better way to study
            for AP exams? What if music supervision had better tooling? What if school clubs
            were easier to discover? The answer is always the same: build it.
          </p>
        </Reveal>

        {/* Accent glyph */}
        <Reveal delay={0.45} className="mt-12 flex justify-center gap-3">
          <div
            className="h-px w-16"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }}
          />
          <div
            className="h-px w-16"
            style={{ background: "linear-gradient(90deg, var(--accent-2), transparent)" }}
          />
        </Reveal>
      </section>

      {/* ── 6. FOOTER ─────────────────────────────────────────── */}
      <Footer current="built" />
    </World>
  );
}
