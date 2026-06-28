"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";

const CART_KEY = "siconart-cart";

export function CartIconLink({ locale, label }: { locale: Locale; label: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function updateCount() {
      try {
        const lines = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
        if (!Array.isArray(lines)) return setCount(0);
        setCount(
          lines.reduce((sum, line) => sum + (Number.isFinite(line.quantity) ? Number(line.quantity) : 0), 0)
        );
      } catch {
        setCount(0);
      }
    }

    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("siconart-cart-updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("siconart-cart-updated", updateCount);
    };
  }, []);

  return (
    <Link
      href={localeHref(locale, "/cart")}
      aria-label={label}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-subtle"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
