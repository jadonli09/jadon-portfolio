"use client";

/* eslint-disable @next/next/no-img-element */
import { Play, ArrowDownRight } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { CivicPressPhoto } from "@/components/civic/CivicPressPhoto";
import { PosterHeading } from "@/components/ui/poster-heading";
import { asset } from "@/lib/base";
import { CIVIC } from "@/lib/data";

/** Map story title to its real press photo, if any. Only photos that genuinely
 *  match their story are mapped; others are intentionally left blank. */
const STORY_PHOTOS: Record<string, { src: string; caption: string }> = {
  "The Mayor's Videographer": {
    src: "/img/editing-for-mayor-timeline.jpg",
    caption: "Editing for Mayor Salwan · @li_locked.in",
  },
};

/** Extra detail for each story — all real, sourced from Jadon's achievement ledger. */
const STORY_DETAIL: Record<
  string,
  {
    dateline: string;
    pullQuote?: string;
    whoWhat?: { label: string; val: string }[];
    extraBody?: string;
  }
> = {
  "The Mayor's Videographer": {
    dateline: "Fremont, CA, since June 2025",
    pullQuote:
      "The Mayor saw his @li_locked.in channel and called. Now Jadon edits every event for the Mayor's Instagram.",
    extraBody:
      "The Mayor spotted Jadon's @li_locked.in channel and reached out directly. Jadon films civic events and onstage talks, edits the footage, and delivers final cuts for the Mayor's Instagram. Per-video reach is up roughly sixteen-fold since he started, and the account's following has quadrupled.",
  },
  "Reviving Sweet Tomatoes": {
    dateline: "Fremont, CA to Tucson, AZ, 2025",
    pullQuote:
      "He contacted the realty company, made the pitch, then emailed the Sweet Tomatoes location in Tucson about expansion.",
    whoWhat: [
      { label: "Contact", val: "Realty company · new owners" },
      { label: "Issue", val: "Chinese food court planned for wrong demo" },
      { label: "Pivot pitch", val: "Sweet-Tomatoes-style restaurant" },
      { label: "Status", val: "Moving slowly · owners receptive" },
      { label: "Partner", val: "Working with the Mayor" },
      { label: "Outreach", val: "Emailed Tucson ST location" },
    ],
    extraBody:
      "The video that made him viral. He tracked down the realty company that owned the old Sweet Tomatoes location, then learned a Chinese couple had already bought it to open a Chinese food court. Jadon argued the location and local demographic wouldn't support it — and pitched a Sweet-Tomatoes-style restaurant instead. The owners were receptive. Working with the Mayor, they emailed the surviving Sweet Tomatoes in Tucson about Bay Area expansion.",
  },
  "Stories of Fremont": {
    dateline: "Fremont, CA, since June 2025",
    pullQuote:
      "Met Akash Sethi — a law student — at a City Council meeting. That's how documentary crews form.",
    whoWhat: [
      { label: "Co-creator", val: "Akash Sethi · law student" },
      { label: "Co-creator", val: "Brittany Lu" },
      { label: "Mission", val: "Inspiring non-conventional paths" },
      { label: "First subject", val: "Darlene · Fremont #1 daycare" },
    ],
    extraBody:
      "Jadon met Akash Sethi at a City Council meeting. Together with Brittany Lu, they created a video series telling the stories of interesting Fremont people — to show that there are many inspiring career paths beyond the conventional. First interview: Darlene, director of Fremont's number-one daycare, who went from fashion-aspiring college student to successful childcare entrepreneur.",
  },
  "Small Business Accessibility": {
    dateline: "Bay Area, CA, since 2025",
    pullQuote:
      "A boba shop sued over a table a few centimeters too low. Jadon ran outreach, cold-emailed professors, got an advisor, and published an op-ed.",
    whoWhat: [
      { label: "Connector", val: "Tr. Sherry → Luke Wu" },
      { label: "Advisor", val: "Prof. Durazo · SF University" },
      { label: "Publication", val: "San Mateo Daily Journal" },
      { label: "Presented", val: "Fremont City Council" },
      { label: "Legislation", val: "SB 84" },
      { label: "Obstacle", val: "Ash Kalra · Assembly Judiciary" },
    ],
    extraBody:
      "Connected via Tr. Sherry to Luke Wu, whose family boba shop was hit by serial ADA litigation — sued over a table a few centimeters too low. Jadon ran outreach, cold-emailing professors until Prof. Durazo at SF University agreed to advise. They published an op-ed in the San Mateo Daily Journal, met with Chamber of Commerce policy managers across the Bay, and presented at City Council. Year 2 continued with Luke and Arissa around SB 84 — which hit a roadblock in Ash Kalra, adamant against letting it pass the assembly judiciary.",
  },
  "HG Nguyen for D7": {
    dateline: "San Jose, CA, since June 2025",
    pullQuote:
      "Led social media and video for a San Jose D7 City Council campaign — door-knocking, content, and website help.",
    whoWhat: [
      { label: "Initiative by", val: "Benjamin Jin" },
      { label: "Jadon's role", val: "Social media · video editing" },
      { label: "Also", val: "Door-knocking" },
      { label: "District", val: "San Jose D7" },
    ],
    extraBody:
      "An initiative led by Benjamin Jin. Jadon ran social media and publicity — video editing intro and donation clips, event coverage, and website design help — alongside door-knocking for the HG Nguyen City Council campaign in San Jose District 7.",
  },
  "Voices of Fremont": {
    dateline: "Fremont, CA, since fall 2025",
    pullQuote:
      "The Mayor called directly. He wanted an outlet to talk to the city. Jadon built it.",
    whoWhat: [
      { label: "Origin", val: "The Mayor's direct request" },
      { label: "Format", val: "~7 min + short-form" },
      { label: "Cadence", val: "Monthly · thousands of views" },
      { label: "Team", val: "8 people · 3 sections" },
    ],
    extraBody:
      "Started when Mayor Salwan reached out directly — he wanted an outlet to discuss city issues, solutions, and events with the public. Jadon is director and editor. Episodes run approximately 7 minutes, with short-form publicity cuts. Each month pulls thousands of views, featuring interviews with residents, small businesses, and community voices.",
  },
};

type Story = (typeof CIVIC.stories)[number];

/** Lead front-page feature (Sweet Tomatoes viral origin). */
function LeadFeature({ story }: { story: Story }) {
  const detail = STORY_DETAIL[story.title];

  return (
    <Reveal>
      <article className="group relative bg-secondary p-7 md:p-12">
        {/* Red rule accent */}
        <div className="mb-5 h-[2px] w-16 bg-[var(--accent)]" />

        {/* Headline — oversized poster grotesk */}
        <KineticHeadline
          as="h2"
          text={story.title}
          className="font-grotesk text-[2.4rem] font-bold uppercase leading-[0.95] tracking-[-2px] text-[var(--fg)] md:text-[4.6rem] md:tracking-[-5px]"
          delay={0.05}
        />

        {/* Dateline */}
        {detail && (
          <p className="mt-4 border-b border-[var(--line)] pb-4 text-sm text-[var(--muted)]">{detail.dateline}</p>
        )}

        {/* Body with drop-cap styling + extra detail */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p
              className="text-base leading-relaxed text-[var(--fg)] md:text-lg [&::first-letter]:float-left [&::first-letter]:mr-2 [&::first-letter]:font-anton [&::first-letter]:text-[4rem] [&::first-letter]:leading-[0.82] [&::first-letter]:text-[var(--accent)]"
            >
              {detail?.extraBody ?? story.body}
            </p>

            {/* Pull-quote */}
            {detail?.pullQuote && (
              <blockquote className="mt-6 border-l-4 border-[var(--accent)] py-1 pl-5">
                <p className="font-serif-i text-base italic leading-snug text-[var(--fg)] md:text-lg">
                  &ldquo;{detail.pullQuote}&rdquo;
                </p>
              </blockquote>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {/* Who/what credential row */}
            {detail?.whoWhat && (
              <div className="border border-[var(--line)]">
                {detail.whoWhat.map((w, i) => (
                  <div
                    key={`${w.label}-${w.val}`}
                    className={`flex justify-between gap-4 px-4 py-2.5 ${i !== (detail.whoWhat?.length ?? 0) - 1 ? "border-b border-[var(--line)]" : ""}`}
                  >
                    <span className="text-sm text-[var(--muted)]">{w.label}</span>
                    <span className="text-right text-sm text-[var(--fg)]">{w.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* The saga, in four parts — real reels in order, each links to the live post */}
        <div className="mt-10">
          <div className="mb-5 flex items-center gap-2">
            <span className="text-base font-medium tracking-wider md:text-lg">
              THE SAGA, IN FOUR PARTS
            </span>
            <ArrowDownRight className="size-5 text-[var(--accent)]" />
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {CIVIC.sweetTomatoesReels.map((reel) => (
              <a
                key={reel.url}
                href={reel.url}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group relative block overflow-hidden rounded-md border shadow-lg transition-transform duration-500 ease-[var(--ease-cine)] hover:-translate-y-1.5"
                style={{ aspectRatio: "9 / 16" }}
              >
                <img
                  src={asset(reel.poster)}
                  alt={`@li_locked.in reel — "${reel.caption}"`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-[1.05]"
                />
                {/* Play glyph */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--fg)]/70 backdrop-blur-sm transition-transform duration-500 ease-[var(--ease-cine)] group-hover:scale-110">
                    <Play className="ml-0.5 h-5 w-5 fill-[var(--bg)] text-[var(--bg)]" />
                  </span>
                </span>
                {/* Caption strip with real stats */}
                <div className="absolute inset-x-0 bottom-0 bg-[var(--fg)]/85 px-2.5 py-2">
                  <p className="truncate text-sm font-medium leading-snug text-[var(--bg)]">
                    &ldquo;{reel.caption}&rdquo;
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-[var(--bg)]/75">
                    {reel.likes} likes, {reel.comments} comments
                    <br />
                    {reel.date}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/** Mayor's Videographer — second hero story, with the rate + first invoice beside it. */
function SecondFeature({ story }: { story: Story }) {
  const photo = STORY_PHOTOS[story.title];
  const detail = STORY_DETAIL[story.title];

  return (
    <Reveal delay={0.05}>
      <article className="relative flex flex-col border border-[var(--line)] bg-[var(--bg)] p-7 md:flex-row md:items-stretch md:p-0">
        {/* Side accent band */}
        <div className="hidden w-2 shrink-0 bg-[var(--accent)] md:block" />

        <div className="flex-1 p-7 md:p-10">
          <h2 className="font-grotesk text-3xl font-bold uppercase leading-tight tracking-[-1px] md:text-5xl md:tracking-[-3px]">
            {story.title}
          </h2>

          {detail && (
            <p className="mt-2 text-sm text-[var(--muted)]">{detail.dateline}</p>
          )}

          {/* Pull-quote */}
          {detail?.pullQuote && (
            <blockquote className="mt-5 border-l-4 border-[var(--accent)] py-1 pl-5">
              <p className="font-serif-i text-base italic leading-snug text-[var(--fg)]">
                &ldquo;{detail.pullQuote}&rdquo;
              </p>
            </blockquote>
          )}

          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
            <p className="max-w-xl text-base leading-relaxed text-[var(--fg)] md:text-lg">
              {detail?.extraBody ?? story.body}
            </p>

            {/* Press photo — editing session */}
            {photo && (
              <CivicPressPhoto
                src={photo.src}
                alt={photo.caption}
                caption={photo.caption}
                variant="frame"
                aspect="4 / 3"
                className="w-full md:w-56 shrink-0"
              />
            )}
          </div>
        </div>

        {/* Stat sidebar — the paid gig, in two numbers */}
        <div className="shrink-0 border-t border-[var(--line)] p-7 md:w-52 md:border-l md:border-t-0 md:p-8">
          <p className="text-sm text-[var(--muted)]">Rate</p>
          <p className="mt-1 font-display text-xl font-semibold">$50<span className="text-sm font-normal text-[var(--muted)]">/video</span></p>

          <div className="mt-4 border-t border-[var(--line)] pt-4">
            <p className="text-sm text-[var(--muted)]">First invoice</p>
            <p className="mt-1 font-display text-2xl font-semibold text-[var(--accent)]">$600</p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function CivicStories() {
  // Stories by position: Sweet Tomatoes (#2 idx) = viral lead, Mayor's Videographer (#0) = second feature
  const viralStory = CIVIC.stories[2]; // "Reviving Sweet Tomatoes"
  const mayorStory = CIVIC.stories[0]; // "The Mayor's Videographer"

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-9 md:py-24">
      {/* Poster section masthead */}
      <PosterHeading
        title="From the Field"
        className="mb-10 md:mb-16"
      />

      {/* Lead feature — Sweet Tomatoes viral origin */}
      <LeadFeature story={viralStory} />

      {/* Mayor story — horizontal layout */}
      <div className="mt-6 md:mt-8">
        <SecondFeature story={mayorStory} />
      </div>
    </section>
  );
}
