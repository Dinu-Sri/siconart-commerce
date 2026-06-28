import Link from "next/link";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { products } from "@/data/products";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { ProductCard } from "@/components/storefront/product-card";

export default async function BrushFinderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const t = await getTranslations("finder");
  const picks = products.filter((product) => product.featured).slice(0, 3);

  return (
    <section className="container-content section-pad">
      <div className="max-w-3xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">{t("title")}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {["style", "handle", "feel"].map((key, index) => (
          <div key={key} className="rounded-[0.5rem] border bg-surface p-6">
            <span className="text-sm font-semibold text-primary">0{index + 1}</span>
            <h2 className="mt-3 font-serif text-2xl font-semibold">{t(`${key}.title`)}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{t(`${key}.body`)}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 flex items-end justify-between gap-4">
        <h2 className="font-serif text-3xl font-semibold">{t("starterPicks")}</h2>
        <Link href={localeHref(activeLocale, "/shop")} className="font-semibold text-primary">
          {t("shopAll")}
        </Link>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((product) => (
          <ProductCard key={product.sku} product={product} locale={activeLocale} />
        ))}
      </div>
    </section>
  );
}
