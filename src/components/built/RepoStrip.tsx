import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";

const REPOS = [
  { name: "jadon-portfolio", lang: "TypeScript" },
  { name: "hermes", lang: "JavaScript" },
  { name: "LockedIn", lang: "Swift" },
  { name: "cuesheet", lang: "TypeScript" },
];

/** The code, in public. One line per repo — no ornaments. */
export function RepoStrip({ user }: { user: string }) {
  return (
    <Reveal className="mx-auto mt-16 max-w-2xl">
      <div className="border-t border-[var(--line)] pt-8">
        {REPOS.map((r) => (
          <a
            key={r.name}
            href={`https://github.com/${user}/${r.name}`}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor-hover
            className="group flex items-center justify-between border-b border-[var(--line)] py-3 transition-colors hover:text-[var(--accent)]"
          >
            <span className="font-mono text-sm text-[var(--fg)] group-hover:text-[var(--accent)]">
              {r.name}
            </span>
            <span className="flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              {r.lang}
              <ArrowUpRight className="size-3" />
            </span>
          </a>
        ))}
      </div>
    </Reveal>
  );
}
