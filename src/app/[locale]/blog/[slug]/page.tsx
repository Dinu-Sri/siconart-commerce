import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { blogPosts, getBlogPost } from "@/data/blog";
import { formatCardPrice, type Product } from "@/data/products";
import { getStorefrontProducts } from "@/lib/commerce/live-prices";
import { localeHref } from "@/lib/nav";
import { JsonLd } from "@/lib/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumb";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";
import { absoluteUrl } from "@/lib/site-origin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const canonical = absoluteUrl(`/blog/${post.slug}`);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      type: "article"
    }
  };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const post = getBlogPost(slug);
  if (!post) notFound();
  const catalog = await getStorefrontProducts();
  const mentioned = post.productSlugs
    .map((productSlug) => catalog.find((product) => product.slug === productSlug))
    .filter((product): product is Product => Boolean(product));

  return (
    <article className="container-content section-pad">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Organization", name: "Sicon Art", url: absoluteUrl("/") },
          url: absoluteUrl(`/blog/${post.slug}`)
        }}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: localeHref(locale as Locale, "/") },
          { name: "Guides", href: localeHref(locale as Locale, "/blog") },
          { name: post.title, href: localeHref(locale as Locale, `/blog/${post.slug}`) }
        ]}
      />
      <p className="eyebrow mt-6">Guide</p>
      <h1 className="mt-3 max-w-4xl font-serif text-5xl font-semibold">{post.title}</h1>
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
        {post.author} · {post.publishedAt}
      </p>
      <div className="mt-10 grid max-w-3xl gap-8 text-lg leading-8 text-muted-foreground">
        {post.sections.map((section) => (
          <section key={section.heading ?? section.paragraphs[0]}>
            {section.heading ? <h2 className="font-serif text-3xl font-semibold text-foreground">{section.heading}</h2> : null}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className={section.heading ? "mt-4" : undefined}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      {mentioned.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-3xl font-semibold">Current retail prices</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            These prices match the shop today, in US dollars, before shipping.
          </p>
          <div className="mt-6 overflow-x-auto rounded-[0.5rem] border bg-surface">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="border-b bg-surface-subtle">
                <tr>
                  <th className="px-4 py-3 font-semibold">Brush</th>
                  <th className="px-4 py-3 font-semibold">Handle</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {mentioned.map((product) => (
                  <tr key={product.sku} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <Link href={localeHref(locale as Locale, `/products/${product.slug}`)} className="font-semibold text-primary">
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">{product.handle}</td>
                    <td className="px-4 py-3">{formatCardPrice(product)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </article>
  );
}
