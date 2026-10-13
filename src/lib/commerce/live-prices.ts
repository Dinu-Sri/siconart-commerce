import { getProduct, products as catalogProducts, type Product } from "@/data/products";
import { db } from "@/lib/db";

export async function getMarketPriceOverrides(): Promise<Record<string, number>> {
  try {
    const rows = await db.priceOverride.findMany();
    return Object.fromEntries(rows.map((row) => [row.sku, row.priceCents]));
  } catch {
    return {};
  }
}

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
