import { FUS_SETBACK } from "../lab/content";
import { Section } from "./Section";

export function WentWrong() {
  return (
    <Section id="went-wrong" kicker="Selection" heading={FUS_SETBACK.heading}>
      <div className="flex max-w-[64ch] flex-col gap-4">
        {FUS_SETBACK.paras.map((p) => (
          <p key={p.slice(0, 32)} className="text-[1.02rem] leading-[1.72] text-[var(--muted)]">
            {p}
          </p>
        ))}
      </div>
    </Section>
  );
}
