import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "@/data/blog";
import { getBlogPost } from "@/data/blog";
import type { Product } from "@/data/products";
import { localeHref } from "@/lib/nav";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";
import { ProductCard } from "@/components/storefront/product-card";
import { pickCardThumbnail } from "@/lib/product-images";

function formatGuideDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export function GuideArticle({
  post,
  products,
  locale
}: {
  post: BlogPost;
  products: Product[];
  locale: Locale;
}) {
  const related = post.relatedSlugs.map(getBlogPost).filter(Boolean);

  return (
    <article>
      <header className="relative overflow-hidden border-b bg-[linear-gradient(90deg,hsl(var(--background)),hsl(var(--surface-subtle)))]">
        <div className="container-content grid items-end gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div>
            <Breadcrumbs
              items={[
                { name: "Home", href: localeHref(locale, "/") },
                { name: "Guides", href: localeHref(locale, "/blog") },
                { name: post.title, href: localeHref(locale, `/blog/${post.slug}`) }
              ]}
            />
            <p className="eyebrow mt-8">Guide</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{post.dek}</p>
            <div className="mt-8 flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border bg-white">
                <Image src="/brand/tina-wang-about.webp" alt="Tina Wang" fill sizes="56px" className="object-cover" />
              </div>
              <div>
                <p className="font-semibold">{post.author}</p>
                <p className="text-sm text-muted-foreground">Founder · {formatGuideDate(post.publishedAt)}</p>
              </div>
            </div>
          </div>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border bg-white shadow-soft sm:aspect-[4/3] lg:aspect-[4/5]">
            <Image
              src={post.hero.src}
              alt={post.hero.alt}
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
            {post.hero.caption ? (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-5 pb-4 pt-16 text-sm text-white">
                {post.hero.caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      </header>

      <div className="container-content grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_17rem] lg:py-20">
        <div>
          <div className="rounded-[1.25rem] border bg-surface p-6 shadow-soft sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">In short</p>
            <p className="mt-3 font-serif text-2xl leading-9 text-foreground">{post.answer}</p>
          </div>

          <div className="mt-12 grid gap-14">
            {post.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-36">
                <h2 className="font-serif text-3xl font-semibold sm:text-4xl">{section.heading}</h2>
                <div className="mt-5 grid max-w-3xl gap-5 text-lg leading-8 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.figure ? (
                  <figure className="mt-8 overflow-hidden rounded-[1.25rem] border bg-white shadow-soft">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={section.figure.src}
                        alt={section.figure.alt}
                        fill
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    {section.figure.caption ? (
                      <figcaption className="border-t bg-surface px-5 py-4 text-sm text-muted-foreground">
                        {section.figure.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ) : null}
              </section>
            ))}
          </div>

          {products.length > 0 ? (
            <section className="mt-16">
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Brushes in this guide</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">Open a brush to see the live shop price and full details.</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.sku}
                    product={product}
                    locale={locale}
                    imageSrc={pickCardThumbnail(product.images)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {related.length > 0 ? (
            <section className="mt-16 border-t pt-12">
              <h2 className="font-serif text-3xl font-semibold">Continue reading</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {related.map((item) =>
                  item ? (
                    <Link
                      key={item.slug}
                      href={localeHref(locale, `/blog/${item.slug}`)}
                      className="group overflow-hidden rounded-[1.25rem] border bg-surface shadow-soft"
                    >
                      <div className="relative aspect-[16/10] bg-white">
                        <Image
                          src={item.hero.src}
                          alt={item.hero.alt}
                          fill
                          sizes="(min-width: 768px) 40vw, 100vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Guide</p>
                        <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight group-hover:text-primary">
                          {item.title}
                        </h3>
                      </div>
                    </Link>
                  ) : null
                )}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="h-fit lg:sticky lg:top-32">
          <div className="rounded-[1.25rem] border bg-surface p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">On this page</p>
            <nav className="mt-4 grid gap-3 text-sm">
              {post.sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="leading-6 text-muted-foreground hover:text-primary">
                  {section.heading}
                </a>
              ))}
            </nav>
            <Link
              href={localeHref(locale, post.collectionHref)}
              className="mt-6 inline-flex font-semibold text-primary"
            >
              {post.collectionLabel}
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
