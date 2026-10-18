"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { formatProductPrice, isPurchasable } from "@/data/products";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductPurchase({
  product,
  addLabel,
  initialVariant
}: {
  product: Product;
  addLabel: string;
  initialVariant?: string;
}) {
  const variants = product.variants ?? [];
  const defaultSku = variants[0]?.sku ?? product.sku;
  const matchedSku = variants.find((variant) => variant.sku === initialVariant)?.sku;
  const [selectedSku, setSelectedSku] = useState(matchedSku ?? defaultSku);
  const selected = useMemo(
    () => variants.find((variant) => variant.sku === selectedSku) ?? { sku: product.sku, name: product.name, priceCents: product.priceCents },
    [product, selectedSku, variants]
  );
  const purchasable = isPurchasable(product) && selected.priceCents > 0;

  useEffect(() => {
    if (variants.length === 0) return;
    const url = new URL(window.location.href);
    if (selectedSku === defaultSku) url.searchParams.delete("variant");
    else url.searchParams.set("variant", selectedSku);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, [defaultSku, selectedSku, variants.length]);

  return (
    <div>
      {variants.length > 0 && (
        <div className="mt-7">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">Size</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {variants.map((variant) => (
              <button
                key={variant.sku}
                type="button"
                onClick={() => setSelectedSku(variant.sku)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  variant.sku === selectedSku ? "border-primary bg-primary text-primary-foreground" : "bg-surface hover:border-primary/50"
                )}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-6 text-2xl font-semibold">{formatProductPrice(selected.priceCents, product.currency)}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {purchasable ? (
          <AddToCartButton sku={selected.sku} label={addLabel} />
        ) : (
          <Button type="button" size="lg" disabled>
            Coming soon
          </Button>
        )}
      </div>
    </div>
  );
}
