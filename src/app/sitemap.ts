import type { MetadataRoute } from "next";
import { PROFILE } from "@/lib/data";

export const dynamic = "force-static";

const ROUTES = [
  "",
  "about",
  "built",
  "civic",
  "research",
  "leadership",
  "court",
  "locked-in",
  "milestones",
  "milestones/resume",
  "albums",
  "academy",
  "contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${PROFILE.site}/${r ? `${r}/` : ""}`,
    priority: r === "" ? 1 : 0.7,
  }));
}
