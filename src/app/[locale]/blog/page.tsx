import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { blogPosts } from "@/data/blog";
import { localeHref } from "@/lib/nav";
import { pageMeta } from "@/lib/seo/page-meta";
import { JsonLd } from "@/lib/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumb";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";

export const metadata: Metadata = pageMeta({
  title: "Guides to handmade Chinese watercolor brushes",
  description:
    "Sicon Art buying guides for Chinese watercolor brush prices, urban sketching brushes, and travel versus short handles.",
  path: "/blog"
});

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <section className="container-content section-pad">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/blog" }])} />
      <Breadcrumbs
        items={[
          { name: "Home", href: localeHref(locale as Locale, "/") },
          { name: "Guides", href: localeHref(locale as Locale, "/blog") }
        ]}
      />
      <p className="eyebrow mt-6">Guides</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold">Brush buying guides</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
        Practical guides from Sicon Art for choosing handmade Chinese watercolor brushes, written by founder Tina Wang.
      </p>
      <div className="mt-10 grid gap-6">
        {blogPosts.map((post) => (
          <article key={post.slug} className="rounded-[0.5rem] border bg-surface p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{post.author}</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">
              <Link href={localeHref(locale as Locale, `/blog/${post.slug}`)} className="hover:text-primary">
                {post.title}
              </Link>
            </h2>
            <p className="mt-3 text-muted-foreground">{post.description}</p>
            <Link
              href={localeHref(locale as Locale, `/blog/${post.slug}`)}
              className="mt-4 inline-block font-semibold text-primary"
            >
              Read the guide
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
