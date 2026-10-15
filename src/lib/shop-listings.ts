import type { Product } from "@/data/products";
import { priceListProducts } from "@/data/price-list-products";
import { pickCardThumbnail, withProductImages } from "@/lib/product-images";
import type { ShopListing } from "@/lib/shop-filters";

export type { ShopListing } from "@/lib/shop-filters";

const listNameBySku = new Map(priceListProducts.map((product) => [product.sku, product.name]));

function listingImage(product: Product) {
  if (product.imageFolders && product.imageFolders.length === 0) {
    return product.images[0] ?? "";
  }
  return pickCardThumbnail(withProductImages(product).images);
}

export function toShopListings(products: Product[]): ShopListing[] {
  return products.flatMap((product) => {
    const rows = product.variants?.length
      ? product.variants.map((variant) => ({
          ...product,
          sku: variant.sku,
          name: listNameBySku.get(variant.sku) ?? `${product.name} ${variant.name}`.replace(/\s+/g, " ").trim(),
          priceCents: variant.priceCents,
          images: variant.image ? [variant.image] : product.images,
          variants: undefined,
          imageFolders: []
        }))
      : [product];
    return rows.map((row) => ({ product: row, imageSrc: listingImage(row) }));
  });
}
