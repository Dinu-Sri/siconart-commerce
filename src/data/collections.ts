import type { Product } from "@/data/products";

export type StoreCollection = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  match: (product: Product) => boolean;
};

export const storeCollections: StoreCollection[] = [
  {
    slug: "urban-sketching-brushes",
    title: "Urban sketching brushes",
    eyebrow: "For sketchwalks",
    description:
      "Compact handmade Chinese brushes suited to sketchbooks, street scenes, and painting away from the studio.",
    match: (product) => product.uses.includes("sketching") || product.uses.includes("travel")
  },
  {
    slug: "travel-watercolor-brushes",
    title: "Travel watercolor brushes",
    eyebrow: "Portable tools",
    description:
      "Travel-handle Sicon Art brushes for kits that need a protected tip and a short packed length.",
    match: (product) => product.handle === "travel"
  },
  {
    slug: "chinese-watercolor-brushes",
    title: "Chinese watercolor brushes",
    eyebrow: "Traditional forms",
    description:
      "Handmade Chinese watercolor brushes from our Dongguan workshop, shaped for washes, line-and-wash, and expressive studio painting.",
    match: (product) => product.category === "Chinese Brushes"
  }
];

export function getCollection(slug: string) {
  return storeCollections.find((collection) => collection.slug === slug) ?? null;
}

export function productsInCollection(products: Product[], slug: string) {
  const collection = getCollection(slug);
  if (!collection) return [];
  return products.filter(collection.match);
}
