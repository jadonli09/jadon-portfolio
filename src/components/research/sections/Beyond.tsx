import Link from "next/link";
import { RESEARCH } from "@/lib/data";
import { Section } from "./Section";

/** The Ma Lab program is the whole page above; listing it again would repeat. */
const OMIT_PROGRAM = "UMass Amherst — Ma Lab";

export function Beyond() {
  const programs = RESEARCH.programs.filter((p) => p.title !== OMIT_PROGRAM);

  return (
    <div data-chapter="beyond" className="bg-[var(--bg)]">
      <Section id="olympiads" kicker="Olympiads" heading="Externally checked.">
        <ul className="flex list-none flex-col gap-px bg-[var(--line)] p-0">
          {RESEARCH.awards.map((a) => (
            <li
              key={a.name}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-[var(--bg-2)] px-5 py-4"
            >
              <span className="font-mono text-[0.7rem] tabular-nums text-[var(--muted)]">{a.year}</span>
              <span className="text-[1rem] text-[var(--fg)]">{a.name}</span>
              <span className="text-[0.95rem] text-[var(--accent)]">{a.result}</span>
              <span className="text-[0.88rem] text-[var(--muted)]">{a.note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5">
          <Link
            href="/achievements"
            className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)] underline-offset-4 hover:text-[var(--fg)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            The full record →
          </Link>
        </p>
      </Section>

      <Section id="programs" kicker="Programs" heading="Teaching it forward.">
        <ul className="grid list-none gap-px bg-[var(--line)] p-0 sm:grid-cols-3">
          {programs.map((p) => (
            <li key={p.title} className="bg-[var(--bg-2)] p-6">
              <article>
                <h3 className="mb-1 text-[1.02rem] font-semibold text-[var(--fg)]">{p.title}</h3>
                <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--accent)]">
                  {p.role}
                </p>
                <p className="text-[0.9rem] leading-[1.6] text-[var(--muted)]">{p.detail}</p>
              </article>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
