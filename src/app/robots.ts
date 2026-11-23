import type { MetadataRoute } from "next";
import { PROFILE } from "@/lib/data";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${PROFILE.site}/sitemap.xml`,
  };
}
