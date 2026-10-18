import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ambassadors } from "@/data/community";
import { localeHref } from "@/lib/nav";
import { absoluteUrl } from "@/lib/site-origin";

export const metadata: Metadata = {
  title: "Brand ambassadors",
  description: "Artists who work with Sicon Art in a disclosed ambassador relationship.",
  alternates: { canonical: absoluteUrl("/ambassadors") }
};

export default async function AmbassadorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <section className="container-content section-pad">
      <p className="eyebrow">Community</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold">Brand ambassadors</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
        Ambassador profiles describe a current brand relationship. They are not independent reviews or star ratings.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {ambassadors.map((ambassador) => (
          <Link
            key={ambassador.slug}
            href={localeHref(locale as Locale, `/ambassadors/${ambassador.slug}`)}
            className="overflow-hidden rounded-[0.5rem] border bg-surface shadow-soft"
          >
            <div className="relative aspect-square bg-white">
              <Image
                src={ambassador.portrait.src}
                alt={ambassador.portrait.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain p-4"
              />
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{ambassador.role}</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold">{ambassador.name}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{ambassador.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
