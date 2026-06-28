import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { localeHref } from "@/lib/nav";

export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  return (
    <Link
      href={localeHref(locale, `/shop/${product.slug}`)}
      className="group flex h-full flex-col overflow-hidden rounded-[0.5rem] border bg-surface shadow-soft transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-white">
        <Image
          src={product.images[0]}
          alt={`${product.name} by Sicon Art`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-8 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground">
          {product.category}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl font-semibold leading-tight">{product.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{product.summary}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="font-semibold">{formatPrice(product.priceCents, product.currency)}</span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            View <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
