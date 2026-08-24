"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { formatPrice, products } from "@/data/products";
import { COUNTRIES, getCountry } from "@/data/countries";
import { getShippingQuote } from "@/data/shipping";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { SUPPORT_WHATSAPP_DISPLAY, whatsappShippingHelpLink } from "@/lib/support";
import { Button } from "@/components/ui/button";

const CART_KEY = "siconart-cart";

type CartLine = {
  sku: string;
  quantity: number;
};

type PayHereResponse = {
  orderNumber: string;
  payhere: {
    sandbox: boolean;
    action: string;
    fields: Record<string, string>;
  };
};

type PricedCart = {
  items: Array<{ sku: string; name: string; quantity: number; priceCents: number; lineTotalCents: number }>;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
};

type PayHereSdk = {
  startPayment: (payment: Record<string, string | boolean>) => void;
  onCompleted: ((orderId: string) => void) | null;
  onDismissed: (() => void) | null;
  onError: ((error: string) => void) | null;
};

declare global {
  interface Window {
    payhere?: PayHereSdk;
  }
}

export function CheckoutView({ locale }: { locale: Locale }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pricedCart, setPricedCart] = useState<PricedCart | null>(null);
  const [countryCode, setCountryCode] = useState("");
  const [phoneNational, setPhoneNational] = useState("");
  const [shippingHelpOpen, setShippingHelpOpen] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const country = getCountry(countryCode);
  const shippingQuote = countryCode ? getShippingQuote(countryCode) : null;
  const shippingAvailable = shippingQuote?.available === true;
  const shippingCents = shippingAvailable ? shippingQuote.cents : 0;

  useEffect(() => {
    setLines(readCart());
    const params = new URLSearchParams(window.location.search);
    if (params.get("cancelled") === "1") {
      setCancelled(true);
      params.delete("cancelled");
      const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
      window.history.replaceState({}, "", next);
    }
  }, []);

  const subtotalCents = useMemo(() => estimateSubtotal(lines), [lines]);
  const merchandiseTotal = pricedCart?.totalCents ?? subtotalCents;
  const payableCents = merchandiseTotal + shippingCents;

  useEffect(() => {
    if (lines.length === 0) return;
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

  function selectCountry(nextCode: string) {
    setCountryCode(nextCode);
    const quote = nextCode ? getShippingQuote(nextCode) : null;
    setShippingHelpOpen(Boolean(quote && !quote.available));
  }

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const phone = fullPhone(country?.dial, phoneNational);

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!country) {
      setError("Please select your country.");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("Please enter a valid mobile number.");
      return;
    }
    if (!shippingAvailable) {
      setShippingHelpOpen(true);
      return;
    }

    setLoading(true);
    setError("");
    setCancelled(false);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines,
          discountCode: discountCode || undefined,
          email,
          firstName: String(formData.get("firstName") || ""),
          lastName: String(formData.get("lastName") || ""),
          countryCode: country.code,
          shipping: {
            name: `${formData.get("firstName") || ""} ${formData.get("lastName") || ""}`.trim(),
            line1: String(formData.get("line1") || ""),
            line2: String(formData.get("line2") || ""),
            city: String(formData.get("city") || ""),
            region: String(formData.get("region") || ""),
            postalCode: String(formData.get("postalCode") || ""),
            country: country.name,
            phone
          }
        })
      });
      const payload = (await response.json()) as PayHereResponse & { error?: string; code?: string };
      if (!response.ok) {
        if (payload.code === "SHIPPING_UNAVAILABLE") setShippingHelpOpen(true);
        throw new Error(payload.error || "Unable to start checkout");
      }
      await openPayHerePopup(payload, {
        onCompleted: (orderId) => {
          window.location.assign(localeHref(locale, `/checkout/thank-you?order=${encodeURIComponent(orderId)}`));
        },
        onDismissed: () => {
          setCancelled(true);
          setLoading(false);
        },
        onError: (message) => {
          setError(message || "Payment could not start");
          setLoading(false);
        }
      });
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
      <form id="checkout-form" onSubmit={submitCheckout} className="grid gap-6 rounded-[0.5rem] border bg-surface p-6">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">Secure checkout</h1>
          <p className="mt-4 text-muted-foreground">Pay securely with PayHere after confirming your shipping details.</p>
        </div>

        {cancelled && (
          <p className="rounded-[0.5rem] border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            Payment was cancelled. Your cart is still here if you would like to try again.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="firstName" label="First name" required autoComplete="given-name" />
          <Input name="lastName" label="Last name" required autoComplete="family-name" />
        </div>
        <Input name="email" label="Email" type="email" required autoComplete="email" inputMode="email" />
        <label className="text-sm font-semibold">
          Country
          <select
            name="country"
            required
            value={countryCode}
            onChange={(event) => selectCountry(event.target.value)}
            className="mt-2 h-11 w-full rounded-[0.5rem] border bg-background px-3"
          >
            <option value="">Select country</option>
            {COUNTRIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Mobile number
          <div className="mt-2 flex gap-2">
            <span className="inline-flex h-11 min-w-[4.75rem] items-center justify-center rounded-[0.5rem] border bg-background px-3 text-sm font-semibold">
              {country?.dial || "+"}
            </span>
            <input
              required
              name="phoneNational"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={phoneNational}
              onChange={(event) => setPhoneNational(event.target.value.replace(/[^\d\s-]/g, ""))}
              placeholder="Mobile number"
              className="h-11 min-w-0 flex-1 rounded-[0.5rem] border bg-background px-3"
            />
          </div>
        </label>
        <Input name="line1" label="Address line 1" required autoComplete="address-line1" />
        <Input name="line2" label="Address line 2" autoComplete="address-line2" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="city" label="City" required autoComplete="address-level2" />
          <Input name="region" label="State / region" autoComplete="address-level1" />
        </div>
        <Input name="postalCode" label="Postal code" autoComplete="postal-code" />

        {error && <p className="rounded-[0.5rem] border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
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
        <div className="mt-5 grid gap-3 border-t pt-4 text-sm">
          <div className="flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>{formatPrice(pricedCart?.subtotalCents ?? subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Discount</span>
            <span>-{formatPrice(pricedCart?.discountCents ?? 0)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>
              {!countryCode
                ? "Select a country"
                : shippingAvailable
                  ? formatPrice(shippingCents)
                  : "Contact us"}
            </span>
          </div>
          <div className="flex justify-between border-t pt-3 text-lg font-semibold">
            <span>Total</span>
            <span>{shippingAvailable || !countryCode ? formatPrice(payableCents) : formatPrice(merchandiseTotal)}</span>
          </div>
        </div>
        <label className="mt-5 block text-sm font-semibold">
          Discount code
          <div className="mt-2 flex gap-2">
            <input
              value={discountCode}
              onChange={(event) => setDiscountCode(event.target.value.toUpperCase())}
              className="min-w-0 flex-1 rounded-[0.5rem] border bg-background px-3 py-2"
              placeholder="WELCOME10"
            />
            <Button type="button" variant="secondary">
              Apply
            </Button>
          </div>
        </label>
        {shippingQuote && !shippingQuote.available ? (
          <Button type="button" className="mt-6 w-full" onClick={() => setShippingHelpOpen(true)}>
            Message us on WhatsApp
          </Button>
        ) : (
          <Button form="checkout-form" type="submit" disabled={loading || !countryCode} className="mt-6 w-full">
            {loading ? "Opening payment..." : `Place order - ${formatPrice(payableCents)}`}
          </Button>
        )}
        <Link href={localeHref(locale, "/cart")} className="mt-4 inline-flex text-sm font-semibold text-primary">
          Back to cart
        </Link>
      </aside>

      {shippingHelpOpen && shippingQuote && !shippingQuote.available && (
        <ShippingHelpDialog countryName={shippingQuote.countryName} onClose={() => setShippingHelpOpen(false)} />
      )}
    </div>
  );
}

function ShippingHelpDialog({ countryName, onClose }: { countryName: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="max-w-md rounded-[0.75rem] border bg-background p-6 shadow-soft">
        <h2 className="font-serif text-2xl font-semibold">Shipping for {countryName}</h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Your country shipping price is not calculated automatically. Please talk with us through WhatsApp. We will do
          the calculation and send you the details on how to place the order.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="flex-1">
            <a href={whatsappShippingHelpLink(countryName)} target="_blank" rel="noreferrer">
              WhatsApp {SUPPORT_WHATSAPP_DISPLAY}
            </a>
          </Button>
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="text-sm font-semibold">
      {label}
      <input {...inputProps} className="mt-2 h-11 w-full rounded-[0.5rem] border bg-background px-3" />
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

function fullPhone(dial: string | undefined, national: string) {
  const digits = national.replace(/\D/g, "");
  if (!dial) return digits;
  return `${dial}${digits}`;
}

function isValidPhone(phone: string) {
  return /^\+\d{8,15}$/.test(phone.replace(/[\s-]/g, ""));
}

async function openPayHerePopup(
  payload: PayHereResponse,
  handlers: {
    onCompleted: (orderId: string) => void;
    onDismissed: () => void;
    onError: (message: string) => void;
  }
) {
  try {
    const payhere = await loadPayHere();
    payhere.onCompleted = handlers.onCompleted;
    payhere.onDismissed = handlers.onDismissed;
    payhere.onError = handlers.onError;
    payhere.startPayment({
      sandbox: payload.payhere.sandbox,
      ...payload.payhere.fields
    });
  } catch {
    submitToPayHere(payload.payhere.action, payload.payhere.fields);
  }
}

function loadPayHere() {
  if (window.payhere) return Promise.resolve(window.payhere);
  return new Promise<PayHereSdk>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-payhere-sdk]");
    if (existing) {
      existing.addEventListener("load", () => (window.payhere ? resolve(window.payhere) : reject(new Error("PayHere failed to load"))));
      existing.addEventListener("error", () => reject(new Error("PayHere failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    script.dataset.payhereSdk = "true";
    script.onload = () => (window.payhere ? resolve(window.payhere) : reject(new Error("PayHere failed to load")));
    script.onerror = () => reject(new Error("PayHere failed to load"));
    document.body.appendChild(script);
  });
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
