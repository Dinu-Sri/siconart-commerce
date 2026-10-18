import type { Metadata } from "next";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { priceListGroupCategories, type PriceListBrowseId } from "@/data/price-list-products";
import { ShopCatalog } from "@/components/storefront/shop-catalog";
import { getStorefrontProducts } from "@/lib/commerce/live-prices";
import { toShopListings } from "@/lib/shop-listings";
import { pageMeta } from "@/lib/seo/page-meta";

export const metadata: Metadata = pageMeta({
  title: "Shop handmade watercolor brushes",
  description:
    "Browse handcrafted Chinese brushes for watercolor, urban sketching, travel painting, washes, and detail work.",
  path: "/shop"
});

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

  return (
    <ShopCatalog products={products} locale={activeLocale} initialGroups={parseGroup(query.group)}>
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Shop handmade watercolor brushes</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
        Browse handcrafted Chinese brushes for watercolor, urban sketching, travel painting, washes, and detail work.
      </p>
    </ShopCatalog>
  );
}
