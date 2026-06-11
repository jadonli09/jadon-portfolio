"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Mail, ArrowUpRight } from "lucide-react";
import { InstagramIcon, LinkedinIcon, GithubIcon } from "@/components/primitives/BrandIcons";
import { PROFILE } from "@/lib/data";

type Channel = {
  index: string;
  label: string;
  handle: string;
  href: string;
  icon: React.ReactNode;
  external: boolean;
};

const CHANNELS: Channel[] = [
  {
    index: "01",
    label: "Email",
    handle: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    icon: <Mail className="size-4" />,
    external: false,
  },
  {
    index: "02",
    label: "Instagram",
    handle: PROFILE.links.instagramHandle,
    href: PROFILE.links.instagram,
    icon: <InstagramIcon className="size-4" />,
    external: true,
  },
  {
    index: "03",
    label: "LinkedIn",
    handle: "jadon-li",
    href: PROFILE.links.linkedin,
    icon: <LinkedinIcon className="size-4" />,
    external: true,
  },
  {
    index: "04",
    label: "GitHub",
    handle: `@${PROFILE.links.githubUser}`,
    href: PROFILE.links.github,
    icon: <GithubIcon className="size-4" />,
    external: true,
  },
];

/** One compact channel cell with the signature fill-sweep hover. */
function ChannelCard({ index, label, handle, href, icon, external }: Channel) {
  const fillW = useMotionValue(0);
  const springFill = useSpring(fillW, { stiffness: 130, damping: 20 });
  const fillPercent = useTransform(springFill, (v) => `${v}%`);
  const textColor = useTransform(springFill, [0, 55], ["var(--fg)", "#07070a"]);
  const mutedColor = useTransform(springFill, [0, 55], ["var(--muted)", "rgba(7,7,10,0.55)"]);

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      data-cursor-hover
      onMouseEnter={() => fillW.set(100)}
      onMouseLeave={() => fillW.set(0)}
      className="group relative flex items-center gap-3 overflow-hidden border-t border-[var(--line)] px-4 py-2.5 even:border-l focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)] md:border-t-0 md:border-l md:px-5 md:py-4 md:first:border-l-0"
    >
      {/* Fill sweep overlay */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: fillPercent,
          background: "linear-gradient(105deg, var(--accent) 0%, var(--accent-2) 100%)",
        }}
      />

      <span className="relative z-10 flex w-full items-center gap-3">
        <motion.span
          className="w-5 shrink-0 font-mono text-[0.58rem] uppercase tracking-widest"
          style={{ color: mutedColor }}
        >
          {index}
        </motion.span>

        <motion.span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--line)]"
          style={{ color: textColor }}
        >
          {icon}
        </motion.span>

        <span className="flex min-w-0 flex-col">
          <motion.span
            className="font-display text-lg leading-tight md:text-xl"
            style={{ color: textColor }}
          >
            {label}
          </motion.span>
          <motion.span
            className="truncate font-mono text-[0.6rem] tracking-wide"
            style={{ color: mutedColor }}
          >
            {handle}
          </motion.span>
        </span>

        <motion.span
          className="ml-auto shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          style={{ color: textColor }}
        >
          <ArrowUpRight className="size-4" />
        </motion.span>
      </span>
    </a>
  );
}

/** Compact one-row channel strip (2×2 on mobile) for the single-frame layout. */
export function Channels() {
  return (
    <div className="grid grid-cols-2 border-t border-[var(--line)] md:grid-cols-4">
      {CHANNELS.map((ch) => (
        <ChannelCard key={ch.index} {...ch} />
      ))}
    </div>
  );
}
