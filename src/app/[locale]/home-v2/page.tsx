import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getBrushSets, getLatestProducts } from "@/data/products";
import { getStorefrontProducts } from "@/lib/commerce/live-prices";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { pickCardThumbnail, withProductImages } from "@/lib/product-images";
import { ProductCard } from "@/components/storefront/product-card";
import { HomeV2HeroSlider } from "@/components/storefront/home-v2-hero-slider";
import { InstagramHighlightSection } from "@/components/storefront/instagram-section";
import { getArtistWorksHighlights, getInternationalDemoHighlights } from "@/lib/instagram";
import { INSTAGRAM_HIGHLIGHT_URL, INSTAGRAM_PROFILE_URL } from "@/data/instagram";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Home preview",
  robots: { index: false, follow: false }
};

const shopCategories = [
  {
    id: "short",
    label: "Short brushes",
    body: "Close-to-paper control for sketching, travel, and fine work.",
    image: "/products/ruyue-short-brush/feature.jpg"
  },
  {
    id: "long",
    label: "Long brushes",
    body: "Studio reach for washes, figure work, and expressive strokes.",
    image: "/products/suhan-brush-s/feature.jpg"
  },
  {
    id: "rare-collectable",
    label: "Rare & collectables",
    body: "Limited handles and collector pieces for artists who want one of a kind.",
    image: "/products/embroidered-prosperity-deer-brush/feature.jpg"
  },
  {
    id: "accessories",
    label: "Brush accessories",
    body: "Rolls, holders, and studio tools that travel with the brushes.",
    image: "/products/bamboo-and-linen-brush-roll-10-brush-holder/feature.jpg"
  }
] as const;

export default async function HomeV2Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const catalog = await getStorefrontProducts();
  const latest = getLatestProducts(8, catalog).map(withProductImages);
  const brushSets = getBrushSets(8, catalog).map(withProductImages);
  const artistStories = getArtistWorksHighlights();
  const internationalDemos = getInternationalDemoHighlights();

  return (
    <>
      <HomeV2HeroSlider
        locale={activeLocale}
        slides={latest.slice(0, 6).map((product) => ({
          product,
          imageSrc: pickCardThumbnail(product.images)
        }))}
      />

      <section className="container-content section-pad">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Just in</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">Latest brushes</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              New arrivals from the Sicon Art workshop, with live market prices and the pieces artists are buying now.
            </p>
          </div>
          <Link href={localeHref(activeLocale, "/shop")} className="inline-flex items-center gap-2 font-semibold text-primary">
            Shop all brushes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((product) => (
            <ProductCard
              key={product.sku}
              product={product}
              locale={activeLocale}
              imageSrc={pickCardThumbnail(product.images)}
              showSocialProof
            />
          ))}
        </div>
      </section>

      <section className="border-y bg-surface-subtle">
        <div className="container-content section-pad">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Find your brush</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Shop by category</h2>
            <p className="mt-4 text-muted-foreground">
              Start with handle length, collector pieces, or studio accessories. Each path opens the matching shop filter.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shopCategories.map((category) => (
              <Link
                key={category.id}
                href={localeHref(activeLocale, `/shop?group=${category.id}`)}
                className="group overflow-hidden rounded-[1rem] border bg-white shadow-soft transition hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] bg-white">
                  <Image
                    src={category.image}
                    alt={category.label}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                    className="object-contain p-6 transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="border-t border-[#f0e3d3] px-5 py-5">
                  <h3 className="font-serif text-2xl font-semibold">{category.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.body}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Shop {category.label.toLowerCase()} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-content section-pad">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Size families</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">Brush sets</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Series and size families so you can build a kit instead of guessing one brush at a time.
            </p>
          </div>
          <Link href={localeHref(activeLocale, "/shop")} className="inline-flex items-center gap-2 font-semibold text-primary">
            View the shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {brushSets.map((product) => (
            <ProductCard
              key={product.sku}
              product={product}
              locale={activeLocale}
              imageSrc={pickCardThumbnail(product.images)}
              showSocialProof
            />
          ))}
        </div>
      </section>

      <InstagramHighlightSection
        stories={artistStories}
        eyebrow="Worldwide studios"
        title={
          <>
            International artists works with <span className="text-primary">Sicon Art</span> brushes
          </>
        }
        body="Paintings and studio moments from artists around the world, made with Sicon Art brushes."
        actionHref={INSTAGRAM_HIGHLIGHT_URL}
        actionLabel="Open Artists Works"
      />

      <InstagramHighlightSection
        stories={internationalDemos}
        eyebrow="On the road"
        title={
          <>
            International demos &amp; events of <span className="text-primary">Sicon Art</span>
          </>
        }
        body="Workshops, live demonstrations, and events from our Instagram, showing Sicon Art brushes in use around the world."
        actionHref={INSTAGRAM_PROFILE_URL}
        actionLabel="View on Instagram"
      />
    </>
  );
}
