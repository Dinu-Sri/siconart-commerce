import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle, ShoppingBag } from "lucide-react";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { formatPrice, getProduct, products } from "@/data/products";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const t = await getTranslations("product");
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products
    .filter((item) => item.slug !== product.slug && item.uses.some((use) => product.uses.includes(use)))
    .slice(0, 3);

  return (
    <article className="container-content section-pad">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1fr]">
        <div className="grid gap-4">
          <div className="relative aspect-square overflow-hidden rounded-[0.5rem] border bg-surface-subtle">
            <Image
              src={product.images[0]}
              alt={`${product.name} by Sicon Art`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain p-10"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1).map((image) => (
                <div key={image} className="relative aspect-square rounded-[0.5rem] border bg-surface-subtle">
                  <Image src={image} alt={product.name} fill sizes="25vw" className="object-contain p-3" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold">{formatPrice(product.priceCents, product.currency)}</p>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{product.description}</p>

          {product.variants && (
            <div className="mt-7">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">{t("options")}</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <span key={variant.sku} className="rounded-full border bg-surface px-4 py-2 text-sm font-semibold">
                    {variant.name} - {formatPrice(variant.priceCents)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg">
              <ShoppingBag className="h-5 w-5" />
              {t("addToCart")}
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href={localeHref(activeLocale, "/contact")}>
                <MessageCircle className="h-5 w-5" />
                {t("ask")}
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["handmade", "secure", "returns"].map((key) => (
              <div key={key} className="rounded-[0.5rem] border bg-surface p-4 text-sm">
                <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />
                <span className="font-semibold">{t(`trust.${key}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-16 grid gap-8 lg:grid-cols-[0.7fr_1fr]">
        <div>
          <p className="eyebrow">{t("specs")}</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">{t("madeFor")}</h2>
        </div>
        <div className="overflow-hidden rounded-[0.5rem] border bg-surface">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="grid gap-2 border-b p-5 last:border-0 sm:grid-cols-[180px_1fr]">
              <dt className="font-semibold">{key}</dt>
              <dd className="text-muted-foreground">{value}</dd>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl font-semibold">{t("related")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.sku} product={item} locale={activeLocale} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
