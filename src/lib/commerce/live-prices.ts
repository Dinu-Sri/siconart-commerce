import { getProduct, products as catalogProducts, type Product } from "@/data/products";
import { getMarketPriceOverrides } from "@/lib/price-list-overrides";

export { getMarketPriceOverrides, getPriceListOverrides } from "@/lib/price-list-overrides";

export function withMarketPrices(product: Product, overrides: Record<string, number>): Product {
  const variants = product.variants?.map((variant) => ({
    ...variant,
    priceCents: overrides[variant.sku] ?? variant.priceCents
  }));

  return {
    ...product,
    priceCents: overrides[product.sku] ?? product.priceCents,
    variants
  };
}

export function withMarketPricesAll(products: Product[], overrides: Record<string, number>) {
  return products.map((product) => withMarketPrices(product, overrides));
}

export async function getStorefrontProducts() {
  const overrides = await getMarketPriceOverrides();
  return withMarketPricesAll(catalogProducts, overrides);
}

export async function getStorefrontProduct(slug: string) {
  const product = getProduct(slug);
  if (!product) return null;
  const overrides = await getMarketPriceOverrides();
  return withMarketPrices(product, overrides);
}
