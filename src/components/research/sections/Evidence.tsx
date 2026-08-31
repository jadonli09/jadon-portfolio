import { FUS_IMAGES, FUS_RESULTS } from "../lab/content";
import { ConfocalWipe } from "../viz/ConfocalWipe";
import { Photo } from "@/components/primitives/Photo";
import { Section, P, aspectFrom } from "./Section";

export function Evidence() {
  return (
    <Section id="evidence" kicker="Figure 2a · confocal" heading="Drag to bring the glow up.">
      <P>
        Same field of hyphae, two channels. Brightfield shows the fungus; the RFP channel shows only
        what carries the reporter. In the transformed strain they are the same object — and the
        negative control stays dark, which is the point of a control.
      </P>
      <div className="mt-8">
        <ConfocalWipe />
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {(["pcrGel", "gel"] as const).map((k) => {
          const f = FUS_IMAGES[k];
          return (
            <figure key={k} className="m-0 border border-[var(--line)]">
              <div className="relative w-full bg-black" style={aspectFrom(f.dims)}>
                <Photo src={f.src} alt={f.alt} />
              </div>
              <figcaption className="border-t border-[var(--line)] px-3 py-2.5 font-mono text-[0.66rem] leading-[1.55] text-[var(--muted)]">
                {f.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col gap-7">
        {FUS_RESULTS.filter((r) => r.heading !== "Future applications").map((r) => (
          <div key={r.heading} className="max-w-[64ch]">
            <h3 className="mb-2 text-[1.02rem] font-semibold text-[var(--fg)]">{r.heading}</h3>
            <p className="text-[0.98rem] leading-[1.7] text-[var(--muted)]">{r.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
