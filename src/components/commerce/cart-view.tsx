"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { products, formatPrice } from "@/data/products";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { OrderMinimumProgress } from "@/components/commerce/order-minimum-progress";

const CART_KEY = "siconart-cart";

type CartLine = {
  sku: string;
  quantity: number;
};

type PricedCart = {
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    priceCents: number;
    lineTotalCents: number;
  }>;
  subtotalCents: number;
  discountCode: string | null;
  discountCents: number;
  totalCents: number;
};

export function CartView({ locale }: { locale: Locale }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [pricedCart, setPricedCart] = useState<PricedCart | null>(null);
  const [error, setError] = useState("");

  const productRows = useMemo(
    () =>
      products.flatMap((product) => [
        { sku: product.sku, name: product.name },
        ...(product.variants ?? []).map((variant) => ({ sku: variant.sku, name: `${product.name} - ${variant.name}` }))
      ]),
    []
  );

  useEffect(() => {
    setLines(readCart());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
    window.dispatchEvent(new Event("siconart-cart-updated"));
  }, [lines]);

  useEffect(() => {
    if (lines.length === 0) {
      setPricedCart(null);
      setError("");
      return;
    }

    const controller = new AbortController();
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines, discountCode: discountCode || undefined }),
      signal: controller.signal
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unable to price cart");
        return payload as PricedCart;
      })
      .then((payload) => {
        setPricedCart(payload);
        setError("");
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      });

    return () => controller.abort();
  }, [lines, discountCode]);

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl">
        <p className="eyebrow">Cart</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">Your cart</h1>
        <p className="mt-5 text-lg text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-8">
          <Link href={localeHref(locale, "/shop")}>Continue shopping</Link>
        </Button>
      </div>
    );
  }

  const subtotalCents = pricedCart?.subtotalCents ?? estimateSubtotal(lines);
  const totalCents = pricedCart?.totalCents ?? subtotalCents;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <p className="eyebrow">Cart</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">Your cart</h1>
        <div className="mt-8 overflow-hidden rounded-[0.5rem] border bg-surface">
          {lines.map((line) => {
            const item = pricedCart?.items.find((priced) => priced.sku === line.sku);
            const name = item?.name ?? productRows.find((row) => row.sku === line.sku)?.name ?? line.sku;

            return (
              <div key={line.sku} className="grid gap-4 border-b p-5 last:border-0 sm:grid-cols-[1fr_auto]">
                <div>
                  <h2 className="font-semibold">{name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item ? formatPrice(item.priceCents) : "Pricing..."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
                    onClick={() => updateQuantity(line.sku, line.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
                    onClick={() => updateQuantity(line.sku, line.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove item"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground"
                    onClick={() => setLines((current) => current.filter((itemLine) => itemLine.sku !== line.sku))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <aside className="h-fit rounded-[0.5rem] border bg-surface p-5 lg:sticky lg:top-32">
        <OrderMinimumProgress amountCents={totalCents} />
        <label className="mt-5 block text-sm font-semibold">
          Discount code
          <input
            value={discountCode}
            onChange={(event) => setDiscountCode(event.target.value.toUpperCase())}
            placeholder="WELCOME10"
            className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2"
          />
        </label>
        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
        <div className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Discount</span>
            <span>-{formatPrice(pricedCart?.discountCents ?? 0)}</span>
          </div>
          <div className="flex justify-between border-t pt-3 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
        </div>
        {totalCents < 10000 ? (
          <Button type="button" className="mt-6 w-full" disabled>
            Checkout
          </Button>
        ) : (
          <Button asChild className="mt-6 w-full">
            <Link href={localeHref(locale, "/checkout")}>Checkout</Link>
          </Button>
        )}
      </aside>
    </div>
  );

  function updateQuantity(sku: string, quantity: number) {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.sku !== sku)
        : current.map((line) => (line.sku === sku ? { ...line, quantity: Math.min(99, quantity) } : line))
    );
  }
}

function readCart(): CartLine[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line) => typeof line.sku === "string" && Number.isFinite(line.quantity));
  } catch {
    return [];
  }
}

function estimateSubtotal(lines: CartLine[]) {
  const rows = products.flatMap((product) => [
    { sku: product.sku, priceCents: product.priceCents },
    ...(product.variants ?? []).map((variant) => ({ sku: variant.sku, priceCents: variant.priceCents }))
  ]);

  return lines.reduce((sum, line) => {
    const row = rows.find((product) => product.sku === line.sku);
    return sum + (row?.priceCents ?? 0) * line.quantity;
  }, 0);
}
