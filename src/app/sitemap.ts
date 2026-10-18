import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { storeCollections } from "@/data/collections";
import { ambassadors } from "@/data/community";
import { events } from "@/data/events";
import { absoluteUrl } from "@/lib/site-origin";

const staticPaths = [
  "/",
  "/shop",
  "/about",
  "/contact",
  "/faq",
  "/become-an-agent",
  "/collaborate",
  "/events",
  "/ambassadors",
  "/shipping-policy",
  "/return-exchange-policy",
  "/privacy-policy",
  "/terms-conditions",
  "/track-your-order"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: (path === "/" || path === "/shop" ? "daily" : "weekly") as "daily" | "weekly",
      priority: path === "/" ? 1 : path === "/shop" ? 0.9 : 0.6
    })),
    ...storeCollections.map((collection) => ({
      url: absoluteUrl(`/collections/${collection.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...events.map((event) => ({
      url: absoluteUrl(`/events/${event.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.5
    })),
    ...ambassadors.map((ambassador) => ({
      url: absoluteUrl(`/ambassadors/${ambassador.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.5
    }))
  ];
}
