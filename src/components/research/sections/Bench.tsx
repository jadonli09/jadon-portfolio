import { BENCH, FUS_IMAGES, TECHNIQUE_GLOSS } from "../lab/content";
import { ProtocolRun } from "../viz/ProtocolRun";
import { SpotlightRail } from "../viz/SpotlightRail";
import { Photo } from "@/components/primitives/Photo";
import { Section } from "./Section";

/** The six weeks as they looked: at the bench, at the board, on poster day. */
const SHOTS = ["bench", "session", "photo"] as const;

const TECHNIQUES = BENCH.techniques.map((t) => ({
  key: t,
  label: t,
  note: TECHNIQUE_GLOSS[t] ?? "",
}));

export function Bench() {
  return (
    <Section
      id="bench"
      heading="Six weeks at the bench."
      lede="Nine to four every weekday, under a PhD mentor. Four steps, and each one exists for a reason — pick one."
      width="figure"
    >
      <ProtocolRun />

      <h3 className="mb-6 mt-16 font-serif text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[1.15]">
        What I ran myself.
      </h3>
      <SpotlightRail items={TECHNIQUES} label="Techniques" />

      <div className="mt-16 grid gap-5 sm:grid-cols-3">
        {SHOTS.map((k) => {
          const f = FUS_IMAGES[k];
          return (
            <figure key={k} className="group m-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--line)] transition-colors duration-300 group-hover:border-[var(--accent)]">
                <Photo
                  src={f.src}
                  alt={f.alt}
                  className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-3 text-[0.95rem] leading-[1.5] text-[var(--muted)]">
                {f.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Section>
  );
}
