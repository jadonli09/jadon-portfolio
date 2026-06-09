"use client";

import { Mail } from "lucide-react";
import { InstagramIcon, LinkedinIcon, GithubIcon } from "@/components/primitives/BrandIcons";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { ChannelRow } from "./ChannelRow";
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
    icon: <Mail className="size-5" />,
    external: false,
  },
  {
    index: "02",
    label: "Instagram",
    handle: PROFILE.links.instagramHandle,
    href: PROFILE.links.instagram,
    icon: <InstagramIcon className="size-5" />,
    external: true,
  },
  {
    index: "03",
    label: "LinkedIn",
    handle: "jadon-li",
    href: PROFILE.links.linkedin,
    icon: <LinkedinIcon className="size-5" />,
    external: true,
  },
  {
    index: "04",
    label: "GitHub",
    handle: `@${PROFILE.links.githubUser}`,
    href: PROFILE.links.github,
    icon: <GithubIcon className="size-5" />,
    external: true,
  },
];

export function Channels() {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-20 pt-12 md:px-9 md:pb-28 md:pt-16">
      <Reveal className="mb-2">
        <p className="eyebrow">Reach out</p>
      </Reveal>

      <RevealGroup className="mt-6 border-t border-[var(--line)]" delayChildren={0.05}>
        {CHANNELS.map((ch) => (
          <Reveal key={ch.index} as="div">
            <ChannelRow
              index={ch.index}
              label={ch.label}
              handle={ch.handle}
              href={ch.href}
              icon={ch.icon}
              external={ch.external}
            />
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
