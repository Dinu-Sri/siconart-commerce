"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import {
  priceListGroupCategories,
  priceListPriceCategories,
  type PriceListBrowseId
} from "@/data/price-list-products";
import {
  matchesShopFilters,
  sortShopListings,
  type ShopListing
} from "@/lib/shop-filters";
import { ProductCard } from "@/components/storefront/product-card";

function toggleId(current: PriceListBrowseId[], id: PriceListBrowseId) {
  return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
}

export function ShopCatalog({
  products,
  locale,
  initialGroups = [],
  children
}: {
  products: ShopListing[];
  locale: Locale;
  initialGroups?: PriceListBrowseId[];
  children?: ReactNode;
}) {
  const t = useTranslations("shop");
  const [prices, setPrices] = useState<PriceListBrowseId[]>([]);
  const [groups, setGroups] = useState<PriceListBrowseId[]>(initialGroups);

  const visibleProducts = useMemo(() => {
    return sortShopListings(
      products.filter((listing) => matchesShopFilters(listing.product, prices, groups))
    );
  }, [groups, prices, products]);

  const hasFilters = prices.length > 0 || groups.length > 0;

  function clearFilters() {
    setPrices([]);
    setGroups([]);
  }

  return (
    <section className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {children}
      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="h-fit rounded-[0.5rem] border bg-surface p-5 lg:sticky lg:top-32">
          <h2 className="font-semibold">{t("filters")}</h2>
          <div className="mt-5 grid gap-6">
            <FilterGroup
              title={t("price")}
              options={priceListPriceCategories}
              selected={prices}
              onToggle={(id) => setPrices((current) => toggleId(current, id))}
            />
            <FilterGroup
              title={t("category")}
              options={priceListGroupCategories}
              selected={groups}
              onToggle={(id) => setGroups((current) => toggleId(current, id))}
            />
          </div>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 text-sm font-semibold text-primary"
            >
              {t("clearFilters")}
            </button>
          ) : null}
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-muted-foreground">{t("results", { count: visibleProducts.length })}</p>
          </div>
          {visibleProducts.length === 0 ? (
            <div className="rounded-[0.5rem] border bg-surface px-6 py-12 text-center">
              <p className="font-semibold">{t("empty")}</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-semibold text-primary"
              >
                {t("clearFilters")}
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {visibleProducts.map((listing) => (
                <ProductCard
                  key={listing.product.sku}
                  product={listing.product}
                  locale={locale}
                  imageSrc={listing.imageSrc}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle
}: {
  title: string;
  options: Array<{ id: PriceListBrowseId; label: string }>;
  selected: PriceListBrowseId[];
  onToggle: (id: PriceListBrowseId) => void;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      <div className="mt-3 grid gap-3">
        {options.map((option) => (
          <label key={option.id} className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => onToggle(option.id)}
              className="h-4 w-4 accent-primary"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
