import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { priceListGroupCategories, type PriceListBrowseId } from "@/data/price-list-products";
import { ShopCatalog } from "@/components/storefront/shop-catalog";
import { getStorefrontProducts } from "@/lib/commerce/live-prices";
import { toShopListings } from "@/lib/shop-listings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const groupIds = new Set(priceListGroupCategories.map((category) => category.id));

function parseGroup(value: string | string[] | undefined): PriceListBrowseId[] {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !groupIds.has(raw as PriceListBrowseId)) return [];
  return [raw as PriceListBrowseId];
}

export default async function ShopPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ group?: string | string[] }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const products = toShopListings(await getStorefrontProducts());

  return <ShopCatalog products={products} locale={activeLocale} initialGroups={parseGroup(query.group)} />;
}
