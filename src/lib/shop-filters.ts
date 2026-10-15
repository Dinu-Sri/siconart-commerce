import type { Product } from "@/data/products";
import { matchesPriceListBrowse, type PriceListBrowseId } from "@/data/price-list-products";

export type ShopListing = {
  product: Product;
  imageSrc: string;
};

export function sortShopListings(listings: ShopListing[]) {
  return [...listings].sort((left, right) => {
    const rank = (cents: number) => (cents > 0 ? cents : Number.POSITIVE_INFINITY);
    const diff = rank(left.product.priceCents) - rank(right.product.priceCents);
    if (diff !== 0) return diff;
    return left.product.name.localeCompare(right.product.name);
  });
}

export function matchesShopFilters(
  product: Product,
  prices: PriceListBrowseId[],
  groups: PriceListBrowseId[]
) {
  const priceOk =
    prices.length === 0 ||
    prices.some((id) => matchesPriceListBrowse(product.sku, product.priceCents, id));
  const groupOk =
    groups.length === 0 ||
    groups.some((id) => matchesPriceListBrowse(product.sku, product.priceCents, id));
  return priceOk && groupOk;
}
