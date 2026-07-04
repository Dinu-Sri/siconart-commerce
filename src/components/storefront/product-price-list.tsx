"use client";

import Image from "next/image";
import { ArrowUp, BadgeDollarSign } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatPrice, type Product } from "@/data/products";

type PriceListItem = Pick<Product, "sku" | "slug" | "name" | "category" | "priceCents" | "currency" | "images">;

export function ProductPriceList({ products }: { products: PriceListItem[] }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)),
    [products]
  );

  useEffect(() => {
    function onScroll() {
      setShowScrollTop(window.scrollY > 480);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <section className="container-content py-5 sm:py-8">
        <div className="sticky top-[72px] z-20 mb-3 rounded-[0.5rem] border bg-surface/95 p-3 shadow-sm backdrop-blur sm:mb-5 sm:flex sm:items-end sm:justify-between sm:p-4">
          <div>
            <p className="eyebrow">Private list</p>
            <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-4xl">Sicon Art Price List</h1>
          </div>
          <p className="mt-2 text-xs font-semibold text-muted-foreground sm:text-sm">
            {sortedProducts.length} products - retail, artist, and wholesale prices
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
          {sortedProducts.map((product) => {
            const artistCents = tierPrice(product.priceCents, 0.8);
            const wholesaleCents = tierPrice(product.priceCents, 0.65);

            return (
              <article
                key={product.sku}
                className="overflow-hidden rounded-[0.5rem] border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-white">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-contain p-2"
                  />
                  <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-full bg-surface/95 px-2 py-1 text-[10px] font-semibold leading-none text-primary shadow-sm">
                    {product.category}
                  </span>
                </div>

                <div className="grid gap-2 p-2.5 sm:p-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{product.sku}</p>
                    <h2 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 sm:text-base">
                      {product.name}
                    </h2>
                  </div>

                  <dl className="grid gap-1.5 text-xs">
                    <PriceRow label="Retail" value={formatPrice(product.priceCents, product.currency)} strong />
                    <PriceRow label="Artist" value={formatPrice(artistCents, product.currency)} />
                    <PriceRow label="Wholesale" value={formatPrice(wholesaleCents, product.currency)} />
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-5 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition sm:bottom-7 sm:right-7 ${
          showScrollTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}

function PriceRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-2 rounded bg-muted/55 px-2 py-1.5 ${strong ? "text-foreground" : ""}`}>
      <dt className="inline-flex items-center gap-1 text-muted-foreground">
        {strong && <BadgeDollarSign className="h-3.5 w-3.5 text-primary" />}
        {label}
      </dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function tierPrice(cents: number, multiplier: number) {
  return Math.round((cents * multiplier) / 100) * 100;
}
