import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-origin";

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/list",
          "/list/",
          "/en/list",
          "/en/list/",
          "/admin",
          "/admin/",
          "/account",
          "/account/",
          "/api/",
          "/cart",
          "/checkout",
          "/home-v2",
          "/feeds/",
          "/feedback",
          "/feedback/",
          "/en/feedback",
          "/en/feedback/"
        ]
      }
    ],
    sitemap: `${origin}/sitemap.xml`
  };
}
