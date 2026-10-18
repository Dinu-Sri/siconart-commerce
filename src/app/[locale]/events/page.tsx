import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { events } from "@/data/events";
import { localeHref } from "@/lib/nav";
import { absoluteUrl } from "@/lib/site-origin";

export const metadata: Metadata = {
  title: "Events",
  description: "Past Sicon Art sponsored events, gallery demonstrations, and community records.",
  alternates: { canonical: absoluteUrl("/events") }
};

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <section className="container-content section-pad">
      <p className="eyebrow">Community</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold">Events</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
        A public archive of events Sicon Art has supported. Past events stay here so artists can see where the brushes
        have been demonstrated.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <Link
            key={event.slug}
            href={localeHref(locale as Locale, `/events/${event.slug}`)}
            className="overflow-hidden rounded-[0.5rem] border bg-surface shadow-soft"
          >
            <div className="relative aspect-[4/5] bg-white">
              <Image
                src={event.images[0].src}
                alt={event.images[0].alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain p-3"
              />
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Past event</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold">{event.title}</h2>
              <p className="mt-3 text-sm font-semibold text-foreground">{event.dates}</p>
              <p className="mt-3 leading-7 text-muted-foreground">{event.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
