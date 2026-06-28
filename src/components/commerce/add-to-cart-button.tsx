"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CART_KEY = "siconart-cart";

type CartLine = {
  sku: string;
  quantity: number;
};

export function AddToCartButton({ sku, label }: { sku: string; label: string }) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    const current = readCart();
    const existing = current.find((line) => line.sku === sku);
    const next = existing
      ? current.map((line) => (line.sku === sku ? { ...line, quantity: line.quantity + 1 } : line))
      : [...current, { sku, quantity: 1 }];

    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("siconart-cart-updated"));
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

function readCart(): CartLine[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line) => typeof line.sku === "string" && Number.isFinite(line.quantity));
  } catch {
    return [];
  }
}
