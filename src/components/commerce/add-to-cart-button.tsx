"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { pushAccountCart, readBrowserCart, writeBrowserCart } from "@/lib/browser-cart";

export function AddToCartButton({ sku, label }: { sku: string; label: string }) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    const current = readBrowserCart();
    const existing = current.find((line) => line.sku === sku);
    const next = existing
      ? current.map((line) => (line.sku === sku ? { ...line, quantity: line.quantity + 1 } : line))
      : [...current, { sku, quantity: 1 }];

    writeBrowserCart(next);
    void pushAccountCart(next);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <Button type="button" size="lg" onClick={addToCart}>
      <ShoppingBag className="h-5 w-5" />
      {added ? "Added" : label}
    </Button>
  );
}
