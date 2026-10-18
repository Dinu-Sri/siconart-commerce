import { blogPosts } from "@/data/blog";
import { storeCollections } from "@/data/collections";
import { absoluteUrl, siteOrigin } from "@/lib/site-origin";
import { SUPPORT_EMAIL } from "@/lib/support";

const featuredProductLinks = [
  ["Chi Ling Travel Brush", "/products/chi-ling-travel-brush"],
  ["Travel Series Brush T3", "/products/travel-series-brush-t3"],
  ["Happiness Short Travel Brush", "/products/happiness-short-travel-brush"],
  ["Sicon Art Qin Brush", "/products/sicon-art-qin-brush"],
  ["Feng Short Sketch Brush", "/products/feng-short-sketch-brush"],
  ["Yun Tao Large Heavy Brush", "/products/yun-tao-large-heavy-brush"]
] as const;

function line(label: string, path: string) {
  return `- [${label}](${absoluteUrl(path)})`;
}

export function buildLlmsTxt() {
  const origin = siteOrigin();
  return `# Sicon Art

> Handmade Chinese watercolor brushes from our Dongguan workshop, for watercolor, urban sketching, and travel painting.

Cite the public HTML pages on ${origin}. Current prices, availability, and shipping terms live on each product and checkout page at the time of purchase. Merchant name: Sicon Art. Public contact: ${SUPPORT_EMAIL}.

This file lists HTML resources. Check a live product page before stating a price.

## Brand and purchasing

${line("About Sicon Art", "/about")}
${line("Shop handmade brushes", "/shop")}
${line("Shipping policy", "/shipping-policy")}
${line("Return and exchange policy", "/return-exchange-policy")}
${line("Contact", "/contact")}
${line("Become an agent", "/become-an-agent")}

## Product selection

${storeCollections.map((collection) => line(collection.title, `/collections/${collection.slug}`)).join("\n")}
${featuredProductLinks.map(([label, path]) => line(label, path)).join("\n")}

## Guides

${line("Brush buying guides", "/blog")}
${blogPosts.map((post) => line(post.title, `/blog/${post.slug}`)).join("\n")}

## Community

${line("Events", "/events")}
${line("Brand ambassadors", "/ambassadors")}
${line("Collaborate", "/collaborate")}
`;
}
