import type { Product } from "@/data/products";
import { isPurchasable } from "@/data/products";
import { absoluteUrl } from "@/lib/site-origin";
import { organizationId } from "@/lib/seo/organization";

function toAbsolute(src: string) {
  return src.startsWith("http") ? src : absoluteUrl(src);
}

function offerFor(url: string, priceCents: number, purchasable: boolean) {
  const offerBase = {
    "@type": "Offer",
    url,
    priceCurrency: "USD",
    seller: { "@id": organizationId() }
  };
  if (!purchasable || priceCents <= 0) {
    return { ...offerBase, availability: "https://schema.org/PreOrder" };
  }
  return {
    ...offerBase,
    price: (priceCents / 100).toFixed(2),
    availability: "https://schema.org/InStock"
  };
}

export function productJsonLd(product: Product, selectedVariantSku?: string): Record<string, unknown> {
  const url = absoluteUrl(`/products/${product.slug}`);
  const variants = product.variants ?? [];
  const selected = variants.find((variant) => variant.sku === selectedVariantSku);
  const images = [
    ...(selected?.image ? [selected.image] : []),
    ...product.images.filter((src) => src !== selected?.image)
  ].map(toAbsolute);
  const sku = selected?.sku ?? product.sku;
  const name = selected ? `${product.name} ${selected.name}` : product.name;
  const priceCents = selected?.priceCents ?? product.priceCents;
  const purchasable = isPurchasable(product) && priceCents > 0;
  const selectedUrl = selected ? `${url}?variant=${encodeURIComponent(selected.sku)}` : url;

  const productNode: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: product.description,
    image: images,
    sku,
    brand: { "@type": "Brand", name: "Sicon Art" },
    url: selectedUrl,
    offers: offerFor(selectedUrl, priceCents, purchasable)
  };

  if (variants.length === 0 || selected) return productNode;

  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: "Sicon Art" },
    url,
    productGroupID: product.sku,
    variesBy: ["https://schema.org/size"],
    hasVariant: variants.map((variant) => {
      const variantUrl = `${url}?variant=${encodeURIComponent(variant.sku)}`;
      const variantImages = [variant.image, ...product.images].filter(Boolean).map((src) => toAbsolute(src as string));
      return {
        "@type": "Product",
        name: `${product.name} ${variant.name}`,
        sku: variant.sku,
        image: variantImages,
        url: variantUrl,
        offers: offerFor(variantUrl, variant.priceCents, isPurchasable(product) && variant.priceCents > 0)
      };
    })
  };
}

export function productSeoTitle(product: Product) {
  const bestFor = product.specs["Best for"];
  if (!bestFor) return product.name;
  const first = bestFor.split(",")[0]?.trim();
  if (!first) return product.name;
  const title = `${product.name} for ${first.toLowerCase()}`;
  return title.length <= 60 ? title : product.name;
}
