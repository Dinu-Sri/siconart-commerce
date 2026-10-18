import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ambassadors, getAmbassador } from "@/data/community";
import { getEvent } from "@/data/events";
import { getProduct } from "@/data/products";
import { localeHref } from "@/lib/nav";
import { JsonLd } from "@/lib/seo/json-ld";
import { absoluteUrl } from "@/lib/site-origin";

export function generateStaticParams() {
  return ambassadors.map((ambassador) => ({ slug: ambassador.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ambassador = getAmbassador(slug);
  if (!ambassador) return {};
  return {
    title: `${ambassador.name}, Sicon Art ambassador`,
    description: ambassador.excerpt,
    alternates: { canonical: absoluteUrl(`/ambassadors/${ambassador.slug}`) }
  };
}

export default async function AmbassadorProfilePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const ambassador = getAmbassador(slug);
  if (!ambassador) notFound();
  const relatedEvents = ambassador.eventSlugs.map(getEvent).filter(Boolean);
  const relatedProducts = ambassador.productSlugs.map(getProduct).filter(Boolean);

  return (
    <article className="container-content section-pad">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: absoluteUrl(`/ambassadors/${ambassador.slug}`),
          mainEntity: {
            "@type": "Person",
            name: ambassador.name,
            jobTitle: ambassador.role,
            description: ambassador.excerpt
          }
        }}
      />
      <p className="eyebrow">Ambassador</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold">{ambassador.name}</h1>
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
        {ambassador.role} · {ambassador.location}
      </p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="relative aspect-square overflow-hidden rounded-[0.5rem] border bg-white">
          <Image
            src={ambassador.portrait.src}
            alt={ambassador.portrait.alt}
            fill
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-contain p-4"
          />
        </div>
        <div className="grid gap-5 text-lg leading-8 text-muted-foreground">
          {ambassador.biography.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="rounded-[0.5rem] border bg-surface p-5 text-sm leading-7 text-foreground">
            {ambassador.relationship}
          </p>
        </div>
      </div>
      {relatedEvents.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl font-semibold">Events</h2>
          <div className="mt-5 grid gap-3">
            {relatedEvents.map((event) =>
              event ? (
                <Link key={event.slug} href={localeHref(locale as Locale, `/events/${event.slug}`)} className="font-semibold text-primary">
                  {event.title}
                </Link>
              ) : null
            )}
          </div>
        </section>
      )}
      {relatedProducts.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-3xl font-semibold">Brushes shown in brand posts</h2>
          <div className="mt-5 grid gap-3">
            {relatedProducts.map((product) =>
              product ? (
                <Link
                  key={product.slug}
                  href={localeHref(locale as Locale, `/products/${product.slug}`)}
                  className="font-semibold text-primary"
                >
                  {product.name}
                </Link>
              ) : null
            )}
          </div>
        </section>
      )}
    </article>
  );
}
