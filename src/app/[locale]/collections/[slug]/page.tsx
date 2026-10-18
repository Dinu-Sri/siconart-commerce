import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCollection, productsInCollection, storeCollections } from "@/data/collections";
import { getStorefrontProducts } from "@/lib/commerce/live-prices";
import { pickCardThumbnail, withProductImages } from "@/lib/product-images";
import { ProductCard } from "@/components/storefront/product-card";
import { JsonLd } from "@/lib/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumb";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";
import { localeHref } from "@/lib/nav";
import { absoluteUrl } from "@/lib/site-origin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return storeCollections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: absoluteUrl(`/collections/${collection.slug}`) }
  };
}

export default async function CollectionPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const catalog = await getStorefrontProducts();
  const items = productsInCollection(catalog, slug).map(withProductImages);

  return (
    <section className="container-content section-pad">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: collection.title,
          url: absoluteUrl(`/collections/${collection.slug}`),
          description: collection.description
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: collection.title, path: `/collections/${collection.slug}` }
        ])}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: localeHref(activeLocale, "/") },
          { name: "Shop", href: localeHref(activeLocale, "/shop") },
          { name: collection.title, href: localeHref(activeLocale, `/collections/${collection.slug}`) }
        ]}
      />
      <p className="eyebrow mt-6">{collection.eyebrow}</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold">{collection.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{collection.description}</p>
      <p className="mt-4 text-sm font-semibold text-muted-foreground">
        {items.length} {items.length === 1 ? "brush" : "brushes"}
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard
            key={product.sku}
            product={product}
            locale={activeLocale}
            imageSrc={pickCardThumbnail(product.images)}
          />
        ))}
      </div>
    </section>
  );
}
