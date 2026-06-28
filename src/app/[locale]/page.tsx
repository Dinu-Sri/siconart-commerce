import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { products } from "@/data/products";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { HeroProduct } from "@/components/storefront/hero-product";
import { ProductCard } from "@/components/storefront/product-card";
import { FilterSummary } from "@/components/storefront/filter-summary";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const t = await getTranslations("home");
  const featured = products.filter((product) => product.featured).slice(0, 4);

  return (
    <>
      <section className="overflow-hidden border-b bg-[radial-gradient(circle_at_top_right,rgba(166,113,70,0.18),transparent_34%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--surface-subtle)))]">
        <div className="container-content grid min-h-[calc(100dvh-5rem)] items-center gap-12 py-12 lg:grid-cols-[1fr_0.85fr] lg:py-16">
          <div>
            <p className="eyebrow">{t("heroEyebrow")}</p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={localeHref(activeLocale, "/shop")}>{t("heroPrimary")}</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href={localeHref(activeLocale, "/brush-finder")}>{t("heroSecondary")}</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              {["ships", "handmade", "watercolor"].map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {t(`trust.${key}`)}
                </div>
              ))}
            </div>
          </div>
          <HeroProduct />
        </div>
      </section>

      <section className="container-content section-pad">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">{t("featuredEyebrow")}</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">{t("featuredTitle")}</h2>
          </div>
          <Link href={localeHref(activeLocale, "/shop")} className="inline-flex items-center gap-2 font-semibold text-primary">
            {t("viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.sku} product={product} locale={activeLocale} />
          ))}
        </div>
      </section>

      <section className="border-y bg-surface-subtle">
        <div className="container-content section-pad">
          <div className="max-w-2xl">
            <p className="eyebrow">{t("finderEyebrow")}</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">{t("finderTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("finderBody")}</p>
          </div>
          <div className="mt-10">
            <FilterSummary />
          </div>
        </div>
      </section>

      <section className="container-content section-pad grid gap-10 lg:grid-cols-[0.8fr_1fr]">
        <div>
          <p className="eyebrow">{t("craftEyebrow")}</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold">{t("craftTitle")}</h2>
        </div>
        <div className="grid gap-6 text-lg leading-8 text-muted-foreground">
          <p>{t("craftBodyOne")}</p>
          <p>{t("craftBodyTwo")}</p>
          <Button asChild variant="secondary" className="w-fit">
            <Link href={localeHref(activeLocale, "/about")}>{t("craftCta")}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
