import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { World } from "@/components/chrome/World";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { EmberConstellation } from "@/components/ui/ember-constellation";
import { InteractiveProductCard } from "@/components/ui/card-7";
import { ChannelRow } from "@/components/contact/ChannelRow";
import { EmailCopy } from "@/components/contact/EmailCopy";
import { InstagramIcon, LinkedinIcon, GithubIcon } from "@/components/primitives/BrandIcons";
import { asset } from "@/lib/base";
import { PROFILE, WORLDS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Jadon Li — builder, civic storyteller, researcher, and student leader based in Fremont, CA.",
};

const CHANNELS = [
  {
    label: "Email",
    handle: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    icon: <Mail className="size-5" />,
    external: false,
  },
  {
    label: "Instagram",
    handle: PROFILE.links.instagramHandle,
    href: PROFILE.links.instagram,
    icon: <InstagramIcon className="size-5" />,
    external: true,
  },
  {
    label: "LinkedIn",
    handle: "jadon-li",
    href: PROFILE.links.linkedin,
    icon: <LinkedinIcon className="size-5" />,
    external: true,
  },
  {
    label: "GitHub",
    handle: `@${PROFILE.links.githubUser}`,
    href: PROFILE.links.github,
    icon: <GithubIcon className="size-5" />,
    external: true,
  },
];

export default function ContactPage() {
  const idx = WORLDS.findIndex((w) => w.id === "contact");
  const next = idx >= 0 ? WORLDS[(idx + 1) % WORLDS.length] : WORLDS[0];

  return (
    <World id="contact">
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        {/* ── BACKGROUND ───────────────────────────────────────────── */}
        {/* Static ambient ember glow — depth behind the live field */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "min(95vw, 1100px)",
            height: "min(95vw, 1100px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(232,177,90,0.16) 0%, rgba(217,96,63,0.09) 40%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        {/* Cursor-tracking constellation */}
        <EmberConstellation />

        {/* ── MAIN: cinematic split ────────────────────────────────── */}
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pt-[5rem] md:flex-row md:items-stretch md:gap-10 md:px-9 md:pt-[4.5rem]">
          {/* Left — interactive 3D-tilt photo card with cursor-tracking light.
              Card aspect (9/12) matches the 3:4 crop so object-cover keeps the
              full subject (shoulders never clipped) on every device. */}
          <div className="relative order-1 flex shrink-0 items-center justify-center py-2 md:order-none md:w-[42%] md:py-0">
            {/* warm ember glow behind the card */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "min(90vw, 540px)",
                height: "min(90vw, 540px)",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at center, rgba(232,177,90,0.22) 0%, rgba(217,96,63,0.11) 46%, transparent 72%)",
                filter: "blur(54px)",
              }}
            />
            <InteractiveProductCard
              imageUrl={asset("/img/contact-photo.webp")}
              cutoutUrl={asset("/img/contact-cutout.webp")}
              title="Jadon Li"
              description="Fremont, CA"
              className="relative md:max-w-[360px] lg:max-w-[380px]"
            />
          </div>

          {/* Right — the action */}
          <div className="order-2 flex flex-1 flex-col justify-center py-6 md:order-none md:py-10">
            <KineticHeadline
              as="h1"
              text="Let's talk."
              delay={0.05}
              balance={false}
              className="font-anton leading-[0.88] tracking-tighter text-[clamp(2.8rem,9vw,6rem)]"
            />

            <Reveal delay={0.25} className="mt-3 max-w-lg md:mt-4">
              <p className="font-serif-i text-base italic leading-snug text-[var(--muted)] md:text-lg">
                Civic storyteller, bio researcher, builder, and student leader — Class of 2027 at {PROFILE.school}.
              </p>
            </Reveal>

            {/* The four channels — the prominent buttons */}
            <Reveal delay={0.4} className="mt-6 md:mt-8">
              <div className="flex flex-col">
                {CHANNELS.map((ch) => (
                  <ChannelRow key={ch.label} {...ch} />
                ))}
              </div>
            </Reveal>

            {/* Secondary: copy the address directly */}
            <Reveal delay={0.55} className="mt-5 md:mt-6">
              <EmailCopy />
            </Reveal>
          </div>
        </div>

        {/* ── SIGN-OFF BAR ─────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-end gap-4 border-t border-[var(--line)] px-5 py-2 md:px-9">
          <Link
            href={next.href}
            data-cursor-hover
            className="group inline-flex shrink-0 items-center gap-2 py-3 text-base font-medium text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            Next: {next.title}
            <ArrowRight className="size-4 transition-[translate] duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </World>
  );
}
