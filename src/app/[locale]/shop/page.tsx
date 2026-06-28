import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { categories, products } from "@/data/products";
import type { Locale } from "@/i18n/routing";
import { ProductCard } from "@/components/storefront/product-card";

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const t = await getTranslations("shop");

  return (
    <section className="container-content section-pad">
      <div className="max-w-3xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">{t("title")}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-[0.5rem] border bg-surface p-5">
          <h2 className="font-semibold">{t("filters")}</h2>
          <div className="mt-5 grid gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{t("category")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span key={category} className="rounded-full bg-surface-subtle px-3 py-1 text-xs font-semibold">
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[0.5rem] bg-surface-subtle p-4 text-sm leading-6 text-muted-foreground">
              {t("filterNote")}
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
