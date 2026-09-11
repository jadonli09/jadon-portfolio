import { FUS_IMAGES } from "../lab/content";
import { ConfocalWipe } from "../viz/ConfocalWipe";
import { Photo } from "@/components/primitives/Photo";
import { Caption, Section, aspectFrom } from "./Section";

/**
 * The result, in the form that proves it: the confocal panels you can wipe
 * yourself, with the gels that say the same thing in DNA beside them.
 */
export function Glow() {
  return (
    <Section
      id="glow"
      heading="Same hyphae, two channels."
      lede="Brightfield shows the fungus. The red channel shows only what carries the reporter. In strain 8996 they are the same object — and the negative control stays dark."
      width="figure"
    >
      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <ConfocalWipe />

        <div className="flex flex-col gap-8">
          {(["pcrGel", "gel"] as const).map((k) => {
            const f = FUS_IMAGES[k];
            return (
              <figure key={k} className="m-0 border border-[var(--line)]">
                <div className="relative w-full bg-black" style={aspectFrom(f.dims)}>
                  <Photo src={f.src} alt={f.alt} />
                </div>
                <Caption>{f.caption}</Caption>
              </figure>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
