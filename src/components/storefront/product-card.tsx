import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/data/products";
import { formatCardPrice, isPurchasable } from "@/data/products";
import { productSocialProof } from "@/data/product-social-proof";
import { localeHref } from "@/lib/nav";
import { StarRating } from "@/components/storefront/star-rating";

export function ProductCard({
  product,
  locale,
  imageSrc,
  showSocialProof = false
}: {
  product: Product;
  locale: Locale;
  imageSrc?: string;
  showSocialProof?: boolean;
}) {
  const purchasable = isPurchasable(product);
  const thumbnail = imageSrc ?? product.images[0];
  const proof = showSocialProof ? productSocialProof(product.sku) : null;

  return (
    <Link
      href={localeHref(locale, `/products/${product.slug}`)}
      className="group flex h-full flex-col overflow-hidden rounded-[0.5rem] border bg-surface shadow-soft transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-white">
        <Image
          src={thumbnail}
          alt={`${product.name} by Sicon Art`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105 sm:p-2"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-semibold leading-tight">{product.name}</h3>
        {proof ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <StarRating rating={proof.rating} />
            <span className="font-semibold text-[#8a6d56]">{proof.sold}+ sold</span>
          </div>
        ) : null}
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className={`font-semibold ${proof ? "text-lg" : ""} ${purchasable ? "" : "text-primary"}`}>
            {formatCardPrice(product)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            View <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
