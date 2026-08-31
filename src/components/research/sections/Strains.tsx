import { FUS_STRAINS } from "../lab/content";
import { Section, P } from "./Section";

export function Strains() {
  return (
    <Section id="strains" kicker="The strains" heading="Three isolates, two kingdoms.">
      <P>
        Two came out of people, one out of a banana plant. Putting the same reporter into all three
        is what makes them comparable.
      </P>
      <ul className="mt-8 grid list-none gap-px border border-[var(--line)] bg-[var(--line)] p-0 sm:grid-cols-3">
        {FUS_STRAINS.map((s) => {
          const transformed = s.note.includes("transformed");
          return (
            <li key={s.id} className="relative bg-[var(--bg-2)] p-6">
              <p
                className={
                  transformed
                    ? "font-mono text-[1.02rem] text-[var(--accent)]"
                    : "font-mono text-[1.02rem] text-[var(--fg)]"
                }
              >
                {s.id}
              </p>
              <p className="mt-2 text-[0.92rem] leading-[1.55] text-[var(--muted)]">{s.source}</p>
              <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                {s.note}
              </p>
              {transformed ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_var(--accent),inset_0_0_34px_rgba(255,61,94,0.16)]"
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
