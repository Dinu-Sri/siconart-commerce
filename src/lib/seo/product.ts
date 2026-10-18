import type { Product } from "@/data/products";
import { isPurchasable } from "@/data/products";
import { absoluteUrl } from "@/lib/site-origin";
import { organizationId } from "@/lib/seo/organization";

function toAbsolute(src: string) {
  return src.startsWith("http") ? src : absoluteUrl(src);
}

export function productJsonLd(product: Product): Record<string, unknown> {
  const url = absoluteUrl(`/products/${product.slug}`);
  const priced = [
    ...(product.priceCents > 0 ? [product.priceCents] : []),
    ...(product.variants ?? []).map((variant) => variant.priceCents).filter((cents) => cents > 0)
  ];
  const offerBase = {
    url,
    priceCurrency: "USD",
    seller: { "@id": organizationId() }
  };
  const offers =
    !isPurchasable(product) || priced.length === 0
      ? {
          "@type": "Offer",
          ...offerBase,
          availability: "https://schema.org/PreOrder"
        }
      : priced.length > 1
        ? {
            "@type": "AggregateOffer",
            ...offerBase,
            lowPrice: (Math.min(...priced) / 100).toFixed(2),
            highPrice: (Math.max(...priced) / 100).toFixed(2),
            offerCount: priced.length,
            availability: "https://schema.org/InStock"
          }
        : {
            "@type": "Offer",
            ...offerBase,
            price: (priced[0] / 100).toFixed(2),
            availability: "https://schema.org/InStock"
          };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map(toAbsolute),
    sku: product.sku,
    brand: { "@type": "Brand", name: "Sicon Art" },
    url,
    offers
  };
}
