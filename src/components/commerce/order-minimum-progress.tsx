"use client";

import { formatPrice } from "@/data/products";

const MINIMUM_ORDER_CENTS = 10000;

export function OrderMinimumProgress({ amountCents }: { amountCents: number }) {
  const progress = Math.min(100, Math.round((amountCents / MINIMUM_ORDER_CENTS) * 100));
  const remainingCents = Math.max(0, MINIMUM_ORDER_CENTS - amountCents);

  return (
    <div className="rounded-[0.5rem] border bg-surface p-4">
      <div className="flex items-center justify-between gap-4 text-sm font-semibold">
        <span>Minimum order {formatPrice(MINIMUM_ORDER_CENTS)}</span>
        <span className="text-muted-foreground">
          {remainingCents === 0 ? "Ready to checkout" : `${formatPrice(remainingCents)} more`}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Worldwide shipping is available after the cart reaches the minimum order amount.
      </p>
    </div>
  );
}
