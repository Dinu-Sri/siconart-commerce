import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ShopCatalog } from "@/components/storefront/shop-catalog";
import { getStorefrontProducts } from "@/lib/commerce/live-prices";
import { toShopListings } from "@/lib/shop-listings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const products = toShopListings(await getStorefrontProducts());

  return <ShopCatalog products={products} locale={activeLocale} />;
}
