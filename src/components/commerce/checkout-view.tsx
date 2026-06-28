"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { formatPrice, products } from "@/data/products";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { Button } from "@/components/ui/button";

const CART_KEY = "siconart-cart";

type CartLine = {
  sku: string;
  quantity: number;
};

type PayHereResponse = {
  orderNumber: string;
  payhere: {
    action: string;
    fields: Record<string, string>;
  };
};

export function CheckoutView({ locale }: { locale: Locale }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLines(readCart());
  }, []);

  const subtotalCents = useMemo(() => estimateSubtotal(lines), [lines]);

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines,
          discountCode: discountCode || undefined,
          email: String(formData.get("email") || ""),
          firstName: String(formData.get("firstName") || ""),
          lastName: String(formData.get("lastName") || ""),
          shipping: {
            name: `${formData.get("firstName") || ""} ${formData.get("lastName") || ""}`.trim(),
            line1: String(formData.get("line1") || ""),
            line2: String(formData.get("line2") || ""),
            city: String(formData.get("city") || ""),
            region: String(formData.get("region") || ""),
            postalCode: String(formData.get("postalCode") || ""),
            country: String(formData.get("country") || ""),
            phone: String(formData.get("phone") || "")
          }
        })
      });
      const payload = (await response.json()) as PayHereResponse & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to start checkout");
      submitToPayHere(payload.payhere.action, payload.payhere.fields);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout");
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">Your cart is empty</h1>
        <Button asChild className="mt-8">
          <Link href={localeHref(locale, "/shop")}>Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form onSubmit={submitCheckout} className="grid gap-6 rounded-[0.5rem] border bg-surface p-6">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">Secure checkout</h1>
          <p className="mt-4 text-muted-foreground">Pay securely with PayHere after confirming your shipping details.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="firstName" label="First name" required />
          <Input name="lastName" label="Last name" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="email" label="Email" type="email" required />
          <Input name="phone" label="Phone" />
        </div>
        <Input name="line1" label="Address line 1" required />
        <Input name="line2" label="Address line 2" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="city" label="City" required />
          <Input name="region" label="State / region" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="postalCode" label="Postal code" />
          <Input name="country" label="Country" defaultValue="Sri Lanka" required />
        </div>

        <label className="text-sm font-semibold">
          Discount code
          <input
            value={discountCode}
            onChange={(event) => setDiscountCode(event.target.value.toUpperCase())}
            className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2"
            placeholder="WELCOME10"
          />
        </label>

        {error && <p className="rounded-[0.5rem] border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

        <Button type="submit" disabled={loading || subtotalCents < 10000} className="w-fit">
          {loading ? "Redirecting..." : "Pay with PayHere"}
        </Button>
      </form>

      <aside className="h-fit rounded-[0.5rem] border bg-surface p-5 lg:sticky lg:top-32">
        <h2 className="font-serif text-2xl font-semibold">Order summary</h2>
        <div className="mt-5 grid gap-4">
          {lines.map((line) => {
            const row = productRows().find((item) => item.sku === line.sku);
            return (
              <div key={line.sku} className="flex justify-between gap-4 text-sm">
                <span>
                  {row?.name ?? line.sku} x {line.quantity}
                </span>
                <span className="font-semibold">{formatPrice((row?.priceCents ?? 0) * line.quantity)}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex justify-between border-t pt-4 font-semibold">
          <span>Subtotal</span>
          <span>{formatPrice(subtotalCents)}</span>
        </div>
        {subtotalCents < 10000 && (
          <p className="mt-4 text-sm font-semibold text-red-600">Minimum order amount is $100.</p>
        )}
      </aside>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="text-sm font-semibold">
      {label}
      <input {...inputProps} className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
    </label>
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

function estimateSubtotal(lines: CartLine[]) {
  const rows = productRows();
  return lines.reduce((sum, line) => {
    const row = rows.find((product) => product.sku === line.sku);
    return sum + (row?.priceCents ?? 0) * line.quantity;
  }, 0);
}

function productRows() {
  return products.flatMap((product) => [
    { sku: product.sku, name: product.name, priceCents: product.priceCents },
    ...(product.variants ?? []).map((variant) => ({
      sku: variant.sku,
      name: `${product.name} - ${variant.name}`,
      priceCents: variant.priceCents
    }))
  ]);
}

function submitToPayHere(action: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
