"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/data/products";
import { formatCardPrice, isPurchasable } from "@/data/products";
import { localeHref } from "@/lib/nav";
import { Button } from "@/components/ui/button";

export type HomeV2Slide = {
  product: Product;
  imageSrc: string;
};

export function HomeV2HeroSlider({
  locale,
  slides
}: {
  locale: Locale;
  slides: HomeV2Slide[];
}) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  const slide = slides[index];
  const purchasable = isPurchasable(slide.product);

  return (
    <section className="relative overflow-hidden border-b bg-[linear-gradient(180deg,#fef9ef_0%,#f7efe3_100%)]">
      <div className="container-content grid items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-12">
        <div className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[1.25rem] border border-[#ead9c3] bg-white shadow-soft">
          <Image
            src={slide.imageSrc}
            alt={slide.product.name}
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 90vw"
            className="object-contain p-6 sm:p-10"
          />
        </div>

        <div>
          <p className="eyebrow">Latest arrivals</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {slide.product.name}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {slide.product.summary}
          </p>
          <p className={`mt-5 font-serif text-4xl font-semibold ${purchasable ? "" : "text-primary"}`}>
            {formatCardPrice(slide.product)}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={localeHref(locale, `/products/${slide.product.slug}`)}>
                {purchasable ? "Shop this brush" : "Preview this brush"}
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href={localeHref(locale, "/shop")}>Browse the shop</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm font-semibold text-[#8a6d56]">Handmade in Dongguan · Ships worldwide</p>
        </div>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous brush"
            onClick={() => setIndex((current) => (current - 1 + count) % count)}
            className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#523A27] shadow-soft sm:inline-flex lg:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next brush"
            onClick={() => setIndex((current) => (current + 1) % count)}
            className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#523A27] shadow-soft sm:inline-flex lg:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="flex justify-center gap-2 pb-6">
            {slides.map((item, slideIndex) => (
              <button
                key={item.product.sku}
                type="button"
                aria-label={`Show ${item.product.name}`}
                onClick={() => setIndex(slideIndex)}
                className={`h-2.5 rounded-full transition ${
                  slideIndex === index ? "w-8 bg-[#a67146]" : "w-2.5 bg-[#ead9c3]"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
