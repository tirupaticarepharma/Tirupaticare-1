import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The inquiry list is per-visitor and the admin panel is private.
      disallow: ["/cart", "/admin"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
