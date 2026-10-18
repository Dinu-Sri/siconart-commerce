import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { getProduct, products } from "@/data/products";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { getStorefrontProduct, getStorefrontProducts } from "@/lib/commerce/live-prices";
import { pickCardThumbnail, withProductImages } from "@/lib/product-images";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductPurchase } from "@/components/commerce/product-purchase";
import { JsonLd } from "@/lib/seo/json-ld";
import { productJsonLd, productSeoTitle } from "@/lib/seo/product";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumb";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";
import { absoluteUrl } from "@/lib/site-origin";
import { SUPPORT_WHATSAPP_LINK } from "@/lib/support";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return products.flatMap((product) => [
    { slug: product.slug },
    ...(product.legacySlugs ?? []).map((legacySlug) => ({ slug: legacySlug }))
  ]);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const catalogProduct = getProduct(slug);
  if (!catalogProduct) return {};
  const product = catalogProduct;
  const canonical = absoluteUrl(`/products/${product.slug}`);
  const image = product.images[0];
  const title = productSeoTitle(product);
  return {
    title,
    description: product.summary,
    alternates: { canonical },
    openGraph: {
      title,
      description: product.summary,
      url: canonical,
      type: "website",
      images: image ? [{ url: image.startsWith("http") ? image : absoluteUrl(image) }] : undefined
    }
  };
}

export default async function ProductPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ variant?: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const t = await getTranslations("product");
  const catalogProduct = getProduct(slug);
  if (!catalogProduct) notFound();
  if (catalogProduct.slug !== slug) {
    permanentRedirect(localeHref(activeLocale, `/products/${catalogProduct.slug}`));
  }
  const query = searchParams ? await searchParams : {};
  const liveProduct = await getStorefrontProduct(slug);
  const product = withProductImages(liveProduct ?? catalogProduct);
  const liveCatalog = await getStorefrontProducts();

  const related = liveCatalog
    .filter((item) => item.slug !== product.slug && item.uses.some((use) => product.uses.includes(use)))
    .slice(0, 3)
    .map(withProductImages);
  const selectedVariant = typeof query.variant === "string" ? query.variant : undefined;

  return (
    <article className="container-content section-pad">
      <JsonLd data={productJsonLd(product, selectedVariant)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: product.name, path: `/products/${product.slug}` }
        ])}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: localeHref(activeLocale, "/") },
          { name: "Shop", href: localeHref(activeLocale, "/shop") },
          { name: product.name, href: localeHref(activeLocale, `/products/${product.slug}`) }
        ]}
      />
      <div className="mt-6 grid gap-10 lg:grid-cols-[0.95fr_1fr]">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">{product.name}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{product.description}</p>
          {product.specs["Custom engraving"] ? (
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Custom handle engraving is available by enquiry.{" "}
              <Link href={localeHref(activeLocale, "/contact")} className="font-semibold text-primary">
                Write to us
              </Link>{" "}
              or message us on{" "}
              <a href={SUPPORT_WHATSAPP_LINK} target="_blank" rel="noreferrer" className="font-semibold text-primary">
                WhatsApp
              </a>
              .
            </p>
          ) : null}

          <ProductPurchase
            product={product}
            addLabel={t("addToCart")}
            initialVariant={selectedVariant}
          />

          <div className="mt-3">
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
        <dl className="overflow-hidden rounded-[0.5rem] border bg-surface">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="grid gap-2 border-b p-5 last:border-0 sm:grid-cols-[180px_1fr]">
              <dt className="font-semibold">{key}</dt>
              <dd className="text-muted-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl font-semibold">{t("related")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard
                key={item.sku}
                product={item}
                locale={activeLocale}
                imageSrc={pickCardThumbnail(item.images)}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
