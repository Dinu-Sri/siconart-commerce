import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/list", "/list/", "/en/list", "/en/list/", "/admin", "/admin/", "/api/"]
    }
  };
}