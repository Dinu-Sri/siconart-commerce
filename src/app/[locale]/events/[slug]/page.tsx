import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { events, getEvent } from "@/data/events";
import { getAmbassador } from "@/data/community";
import { getProduct } from "@/data/products";
import { localeHref } from "@/lib/nav";
import { JsonLd } from "@/lib/seo/json-ld";
import { absoluteUrl } from "@/lib/site-origin";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.summary,
    alternates: { canonical: absoluteUrl(`/events/${event.slug}`) }
  };
}

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const event = getEvent(slug);
  if (!event) notFound();
  const relatedAmbassadors = event.ambassadorSlugs.map(getAmbassador).filter(Boolean);
  const relatedProducts = event.productSlugs.map(getProduct).filter(Boolean);

  return (
    <article className="container-content section-pad">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: event.title,
          description: event.summary,
          url: absoluteUrl(`/events/${event.slug}`),
          image: event.images.map((image) => absoluteUrl(image.src))
        }}
      />
      <p className="eyebrow">Past event</p>
      <h1 className="mt-3 max-w-4xl font-serif text-5xl font-semibold">{event.title}</h1>
      <dl className="mt-8 grid gap-4 rounded-[0.5rem] border bg-surface p-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Dates</dt>
          <dd className="mt-2 leading-7">{event.dates}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Place</dt>
          <dd className="mt-2 leading-7">{event.place}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Sicon Art role</dt>
          <dd className="mt-2 leading-7">{event.relationship}</dd>
        </div>
      </dl>
      <div className="mt-10 grid gap-5 text-lg leading-8 text-muted-foreground">
        {event.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {event.images.map((image) => (
          <figure key={image.src} className="overflow-hidden rounded-[0.5rem] border bg-white">
            <div className="relative aspect-[4/5]">
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-contain p-3" />
            </div>
            <figcaption className="border-t bg-surface px-4 py-3 text-sm leading-6 text-muted-foreground">
              {image.alt}
            </figcaption>
          </figure>
        ))}
      </div>
      {(relatedAmbassadors.length > 0 || relatedProducts.length > 0) && (
        <section className="mt-12 grid gap-4">
          {relatedAmbassadors.map((ambassador) =>
            ambassador ? (
              <Link
                key={ambassador.slug}
                href={localeHref(locale as Locale, `/ambassadors/${ambassador.slug}`)}
                className="font-semibold text-primary"
              >
                Ambassador: {ambassador.name}
              </Link>
            ) : null
          )}
          {relatedProducts.map((product) =>
            product ? (
              <Link
                key={product.slug}
                href={localeHref(locale as Locale, `/products/${product.slug}`)}
                className="font-semibold text-primary"
              >
                Brush shown in related posts: {product.name}
              </Link>
            ) : null
          )}
        </section>
      )}
      <p className="mt-12">
        <Link href={localeHref(locale as Locale, "/collaborate")} className="font-semibold text-primary">
          Ask about a future collaboration
        </Link>
      </p>
    </article>
  );
}
