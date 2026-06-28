import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { categories, products } from "@/data/products";
import type { Locale } from "@/i18n/routing";
import { ProductCard } from "@/components/storefront/product-card";

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const t = await getTranslations("shop");
  const priceRanges = [
    { label: "Under $15", value: "under-15" },
    { label: "$15 - $20", value: "15-20" },
    { label: "$20 - $30", value: "20-30" },
    { label: "$30+", value: "30-plus" }
  ];

  return (
    <section className="container-content py-8 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-[0.5rem] border bg-surface p-5 lg:sticky lg:top-32">
          <h2 className="font-semibold">{t("filters")}</h2>
          <div className="mt-5 grid gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{t("price")}</p>
              <div className="mt-3 grid gap-3">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
                    <input type="checkbox" name="price" value={range.value} className="h-4 w-4 accent-primary" />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{t("category")}</p>
              <div className="mt-3 grid gap-3">
                {categories.map((category) => (
                  <label key={category} className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
                    <input type="checkbox" name="category" value={category} className="h-4 w-4 accent-primary" />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-muted-foreground">{t("results", { count: products.length })}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.sku} product={product} locale={activeLocale} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
