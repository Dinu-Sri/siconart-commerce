import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { blogPosts, getBlogPost } from "@/data/blog";
import type { Product } from "@/data/products";
import { getStorefrontProducts } from "@/lib/commerce/live-prices";
import { withProductImages } from "@/lib/product-images";
import { JsonLd } from "@/lib/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumb";
import { absoluteUrl } from "@/lib/site-origin";
import { GuideArticle } from "@/components/storefront/guide-article";

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
  const image = post.hero.src.startsWith("http") ? post.hero.src : absoluteUrl(post.hero.src);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      type: "article",
      images: [{ url: image, alt: post.hero.alt }]
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
    .filter((product): product is Product => Boolean(product))
    .map(withProductImages);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          image: absoluteUrl(post.hero.src),
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Organization", name: "Sicon Art", url: absoluteUrl("/") },
          url: absoluteUrl(`/blog/${post.slug}`)
        }}
      />
      <GuideArticle post={post} products={mentioned} locale={locale as Locale} />
    </>
  );
}
