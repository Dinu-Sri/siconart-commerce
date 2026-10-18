import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { blogPosts } from "@/data/blog";
import { localeHref } from "@/lib/nav";
import { pageMeta } from "@/lib/seo/page-meta";
import { JsonLd } from "@/lib/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumb";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";

const blogIndexMeta = pageMeta({
  title: "Guides to handmade Chinese watercolor brushes",
  description:
    "Sicon Art buying guides for Chinese watercolor brush prices, urban sketching brushes, and travel versus short handles.",
  path: "/blog"
});

export const metadata: Metadata = {
  ...blogIndexMeta,
  openGraph: {
    ...blogIndexMeta.openGraph,
    images: [{ url: "/brand/classic-brushes.webp", alt: "Handmade Sicon Art Chinese watercolor brushes" }]
  }
};

function formatGuideDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const [featured, ...rest] = blogPosts;

  return (
    <section className="container-content section-pad">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/blog" }])} />
      <Breadcrumbs
        items={[
          { name: "Home", href: localeHref(locale as Locale, "/") },
          { name: "Guides", href: localeHref(locale as Locale, "/blog") }
        ]}
      />
      <div className="mx-auto mt-8 max-w-3xl text-center">
        <p className="eyebrow">Guides</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold sm:text-6xl">Brush buying guides</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Three practical guides from founder Tina Wang: what our brushes cost, which brush to take urban sketching, and
          whether you need a travel handle or a short handle.
        </p>
      </div>

      {featured ? (
        <Link
          href={localeHref(locale as Locale, `/blog/${featured.slug}`)}
          className="group mt-14 grid overflow-hidden rounded-[1.5rem] border bg-surface shadow-soft lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="relative min-h-72 bg-white lg:min-h-[28rem]">
            <Image
              src={featured.hero.src}
              alt={featured.hero.alt}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {featured.author} · {formatGuideDate(featured.publishedAt)}
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl group-hover:text-primary">
              {featured.title}
            </h2>
            <p className="mt-4 text-muted-foreground leading-7">{featured.dek}</p>
            <span className="mt-6 font-semibold text-primary">Read the guide</span>
          </div>
        </Link>
      ) : null}

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={localeHref(locale as Locale, `/blog/${post.slug}`)}
            className="group overflow-hidden rounded-[1.5rem] border bg-surface shadow-soft"
          >
            <div className="relative aspect-[16/11] bg-white">
              <Image
                src={post.hero.src}
                alt={post.hero.alt}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {post.author} · {formatGuideDate(post.publishedAt)}
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight group-hover:text-primary sm:text-3xl">
                {post.title}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">{post.dek}</p>
              <span className="mt-5 inline-block font-semibold text-primary">Read the guide</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
