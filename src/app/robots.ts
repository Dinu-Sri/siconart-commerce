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
          "/api/",
          "/cart",
          "/checkout",
          "/home-v2"
        ]
      }
    ],
    sitemap: `${origin}/sitemap.xml`
  };
}
