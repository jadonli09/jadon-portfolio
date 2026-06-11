import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { Reveal } from "@/components/primitives/Reveal";
import { PersonHero } from "@/components/about/PersonHero";
import { PassionGrid } from "@/components/about/PassionGrid";
import { MissionPeakTradition } from "@/components/about/MissionPeakTradition";
import { SkySection } from "@/components/about/SkySection";
import { KitchenSection } from "@/components/about/KitchenSection";
import { TravelSection } from "@/components/about/TravelSection";
import { JournalSection } from "@/components/about/JournalSection";
import { PROFILE } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jadon Li, the person — sports, cooking, aerial photography, videography, journaling, traveling, and a Mission Peak birthday tradition.",
};

/**
 * The Person — a scrapbook-desk page about who Jadon is off the record:
 * the passions, the kitchen, the sky, the passport, the journal, and the
 * Mission Peak birthday ritual at the center of it all.
 */
export default function AboutPage() {
  return (
    <World id="about">
      <PersonHero />

      {/* the six passions */}
      <PassionGrid />

      {/* the centerpiece ritual — climbs charted year by year */}
      <MissionPeakTradition />

      {/* aerial photography + videography */}
      <SkySection />

      {/* cooking — the real feast videos */}
      <KitchenSection />

      {/* traveling */}
      <TravelSection />

      {/* journaling + the shelf + also-true chips */}
      <JournalSection />

      {/* dark ink close — the reference's footer band */}
      <section className="border-t-4 border-[var(--accent)] bg-[#171511] text-[#ebeae6]">
        <div className="mx-auto max-w-6xl px-5 py-20 text-center md:px-9 md:py-32">
          <Reveal>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-[#8a877f]">
              {PROFILE.links.instagramHandle} is the camera — this was the person
            </p>
            <p className="mt-6 font-anton text-[2.6rem] uppercase leading-[0.95] tracking-tight md:text-[5.5rem]">
              It all points one direction —
              <br />
              <span className="text-[var(--accent)]">the pursuit of happiness.</span>
            </p>
            <p className="font-hand mt-8 text-2xl text-[#8a877f]">
              see you on the mountain, January 2nd
            </p>
          </Reveal>
        </div>
      </section>

      <Footer current="about" />
    </World>
  );
}
