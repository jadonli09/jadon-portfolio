import { PROFILE } from "@/lib/data";

/**
 * schema.org Person markup on every page. `sameAs` is what lets Google tie
 * the site, Instagram, LinkedIn and GitHub to one person (knowledge panel).
 * Validate: search.google.com/test/rich-results and validator.schema.org.
 */
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${PROFILE.site}/#person`,
  name: PROFILE.name,
  url: `${PROFILE.site}/`,
  image: `${PROFILE.site}/img/headshot1.jpg`,
  jobTitle: "ASB President",
  description:
    "Student builder in Fremont, California. Built Salwan Central for Mayor Raj Salwan's office and Rung (2nd of 81 at a16z SpeedHacks). Chair of Fremont's Youth Advisory Commission.",
  affiliation: { "@type": "HighSchool", name: PROFILE.school },
  address: { "@type": "PostalAddress", addressLocality: "Fremont", addressRegion: "CA", addressCountry: "US" },
  sameAs: [PROFILE.links.instagram, PROFILE.links.linkedin, PROFILE.links.github],
};

export function PersonJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
    />
  );
}
