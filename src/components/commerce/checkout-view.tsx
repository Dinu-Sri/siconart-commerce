"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPrice, products as catalogProducts, type Product } from "@/data/products";
import { COUNTRIES, getCountry } from "@/data/countries";
import { estimateCartWeightGrams, getShippingQuote, needsShippingWeightReview } from "@/data/shipping";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import {
  SUPPORT_FACEBOOK_LINK,
  SUPPORT_INSTAGRAM_LINK,
  SUPPORT_WHATSAPP_DISPLAY,
  whatsappLargeOrderShippingHelpLink,
  whatsappShippingHelpLink
} from "@/lib/support";
import { Button } from "@/components/ui/button";
import { PaymentMarks } from "@/components/payment-marks";
import { HoneypotFields } from "@/components/forms/honeypot-fields";
import { FORM_STARTED_FIELD, HONEYPOT_FIELD, isBotSubmission } from "@/lib/form-guard";
import { pullAccountCart, pushAccountCart, readBrowserCart, writeBrowserCart, type CartLine } from "@/lib/browser-cart";

export type CheckoutPrefill = {
  email?: string;
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  phoneNational?: string;
  line1?: string;
  line2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
};

const FEEDBACK_REASONS = [
  { id: "payment-method", label: "I need a different payment method" },
  { id: "price", label: "Prices are expensive" },
  { id: "gateway", label: "Payment gateway error" },
  { id: "other", label: "Other" }
] as const;

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

export function CheckoutView({
  locale,
  catalog = catalogProducts,
  prefill
}: {
  locale: Locale;
  catalog?: Product[];
  prefill?: CheckoutPrefill;
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [email, setEmail] = useState(prefill?.email || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pricedCart, setPricedCart] = useState<PricedCart | null>(null);
  const [countryCode, setCountryCode] = useState(prefill?.countryCode || "");
  const [phoneNational, setPhoneNational] = useState(prefill?.phoneNational || "");
  const [shippingHelpOpen, setShippingHelpOpen] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [pendingOrderNumber, setPendingOrderNumber] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState("");
  const [feedbackDetail, setFeedbackDetail] = useState("");
  const [feedbackNote, setFeedbackNote] = useState("");
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const feedbackSent = useRef(false);
  const feedbackContext = useRef({ orderNumber: "", email: "", open: false });
  feedbackContext.current = { orderNumber: pendingOrderNumber, email, open: feedbackOpen };

  const country = getCountry(countryCode);
  const shippingQuote = countryCode ? getShippingQuote(countryCode) : null;
  const shippingAvailable = shippingQuote?.available === true;
  const estimatedWeightGrams = estimateCartWeightGrams(lines);
  const requiresWeightReview = needsShippingWeightReview(lines);
  const automaticShippingAvailable = shippingAvailable && !requiresWeightReview;
  const shippingCents = automaticShippingAvailable ? shippingQuote.cents : 0;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get("code")?.trim();
    const orderFromUrl = params.get("order")?.trim();
    if (codeFromUrl) setDiscountCode(codeFromUrl.toUpperCase());
    if (params.get("cancelled") === "1") {
      setCancelled(true);
      setFeedbackNote("");
      feedbackSent.current = false;
      setFeedbackOpen(true);
      if (orderFromUrl) setPendingOrderNumber(orderFromUrl);
      params.delete("cancelled");
      const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
      window.history.replaceState({}, "", next);
    }
    let cancel = false;
    const controller = new AbortController();
    void (async () => {
      const browser = readBrowserCart();
      const accountLines = await pullAccountCart();
      let next = accountLines && accountLines.length > 0 ? accountLines : browser;
      if (next.length === 0 && codeFromUrl && orderFromUrl) {
        try {
          const response = await fetch(
            `/api/checkout/resume?order=${encodeURIComponent(orderFromUrl)}&code=${encodeURIComponent(codeFromUrl.toUpperCase())}`,
            { signal: controller.signal }
          );
          if (response.ok) {
            const payload = (await response.json()) as { email?: string; lines?: CartLine[] };
            if (payload.email) setEmail((current) => current || payload.email || "");
            if (payload.lines?.length) next = payload.lines;
          }
        } catch (requestError) {
          if (requestError instanceof Error && requestError.name === "AbortError") return;
        }
      }
      if (cancel) return;
      setLines(next);
      writeBrowserCart(next);
      if (accountLines) void pushAccountCart(next);
    })();
    return () => {
      cancel = true;
      controller.abort();
    };
  }, []);

  const subtotalCents = useMemo(() => estimateSubtotal(lines, catalog), [catalog, lines]);
  const merchandiseTotal = pricedCart?.totalCents ?? subtotalCents;
  const payableCents = merchandiseTotal + shippingCents;

  useEffect(() => {
    if (lines.length === 0) return;
    const controller = new AbortController();
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lines,
        discountCode: discountCode || undefined,
        email: email.includes("@") ? email : undefined
      }),
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
  }, [lines, discountCode, email]);

  function selectCountry(nextCode: string) {
    setCountryCode(nextCode);
    const quote = nextCode ? getShippingQuote(nextCode) : null;
    setShippingHelpOpen(Boolean(quote && !quote.available));
  }

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (isBotSubmission({ honeypot: formData.get(HONEYPOT_FIELD), startedAt: formData.get(FORM_STARTED_FIELD) })) {
      setError("Unable to start checkout.");
      return;
    }
    const checkoutEmail = email.trim() || String(formData.get("email") || "").trim();
    const phone = fullPhone(country?.dial, phoneNational);

    if (!checkoutEmail.includes("@")) {
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
    if (!shippingAvailable || requiresWeightReview) {
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
          email: checkoutEmail,
          firstName: String(formData.get("firstName") || ""),
          lastName: String(formData.get("lastName") || ""),
          countryCode: country.code,
          website: String(formData.get(HONEYPOT_FIELD) || ""),
          form_started: String(formData.get(FORM_STARTED_FIELD) || ""),
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
        if (payload.code === "SHIPPING_UNAVAILABLE" || payload.code === "SHIPPING_WEIGHT_REVIEW") setShippingHelpOpen(true);
        throw new Error(payload.error || "Unable to start checkout");
      }
      setPendingOrderNumber(payload.orderNumber);
      await openPayHerePopup(payload, {
        onCompleted: (orderId) => {
          writeBrowserCart([]);
          void pushAccountCart([]);
          window.location.assign(localeHref(locale, `/checkout/thank-you?order=${encodeURIComponent(orderId)}`));
        },
        onDismissed: () => {
          setCancelled(true);
          setFeedbackNote("");
          feedbackSent.current = false;
          setFeedbackOpen(true);
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

  useEffect(() => {
    function onHide() {
      const current = feedbackContext.current;
      if (!current.open || feedbackSent.current) return;
      feedbackSent.current = true;
      void fetch("/api/checkout/feedback", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: current.orderNumber, email: current.email, reason: "closed" })
      });
    }
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, []);

  function closeCheckoutFeedback() {
    if (feedbackBusy) return;
    setFeedbackOpen(false);
    if (feedbackSent.current) return;
    feedbackSent.current = true;
    void fetch("/api/checkout/feedback", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber: pendingOrderNumber, email, reason: "closed" })
    });
  }

  async function submitFeedback() {
    if (!feedbackReason) {
      setFeedbackNote("Choose the option that fits.");
      return;
    }
    if (feedbackReason === "other" && feedbackDetail.trim().length < 3) {
      setFeedbackNote("Tell us a little more.");
      return;
    }
    setFeedbackBusy(true);
    setFeedbackNote("");
    feedbackSent.current = true;
    try {
      const response = await fetch("/api/checkout/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: pendingOrderNumber,
          email,
          reason: feedbackReason,
          detail: feedbackDetail
        })
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not save that");
      setFeedbackOpen(false);
      setFeedbackNote("Thank you. That helps us.");
    } catch (feedbackError) {
      feedbackSent.current = false;
      setFeedbackNote(feedbackError instanceof Error ? feedbackError.message : "Could not save that");
    } finally {
      setFeedbackBusy(false);
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
        {feedbackOpen ? (
          <CheckoutFeedbackDialog
            reason={feedbackReason}
            detail={feedbackDetail}
            busy={feedbackBusy}
            note={feedbackNote}
            onReason={setFeedbackReason}
            onDetail={setFeedbackDetail}
            onClose={closeCheckoutFeedback}
            onSubmit={() => void submitFeedback()}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form id="checkout-form" onSubmit={submitCheckout} className="relative grid gap-6 rounded-[0.5rem] border bg-surface p-6">
        <HoneypotFields />
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
        {feedbackNote && (
          <p className="rounded-[0.5rem] border border-[#ead9c3] bg-[#fef9ef] p-3 text-sm font-semibold text-[#523A27]">{feedbackNote}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="firstName" label="First name" required autoComplete="given-name" defaultValue={prefill?.firstName || ""} />
          <Input name="lastName" label="Last name" required autoComplete="family-name" defaultValue={prefill?.lastName || ""} />
        </div>
        <Input
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
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
        <Input name="line1" label="Address line 1" required autoComplete="address-line1" defaultValue={prefill?.line1 || ""} />
        <Input name="line2" label="Address line 2" autoComplete="address-line2" defaultValue={prefill?.line2 || ""} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="city" label="City" required autoComplete="address-level2" defaultValue={prefill?.city || ""} />
          <Input name="region" label="State / region" autoComplete="address-level1" defaultValue={prefill?.region || ""} />
        </div>
        <Input name="postalCode" label="Postal code" autoComplete="postal-code" defaultValue={prefill?.postalCode || ""} />

        {error && <p className="rounded-[0.5rem] border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      </form>

      <aside className="h-fit rounded-[0.5rem] border bg-surface p-5 lg:sticky lg:top-32">
        <h2 className="font-serif text-2xl font-semibold">Order summary</h2>
        <div className="mt-5 grid gap-4">
          {lines.map((line) => {
            const row = productRows(catalog).find((item) => item.sku === line.sku);
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
          {automaticShippingAvailable && (
            <p className="text-xs leading-5 text-muted-foreground">
              {countryCode === "AE" ? "United Arab Emirates: $16.24 (¥110)" : "Listed rate"} for orders up to 1 kg.
            </p>
          )}
          {requiresWeightReview && (
            <div className="rounded-[0.5rem] border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
              This cart is estimated at {estimatedWeightGrams} g. The checkout rate covers up to 1 kg, so please ask us
              for the best larger-order shipping rate.
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>
              {!countryCode
                ? "Select a country"
                : automaticShippingAvailable
                  ? formatPrice(shippingCents)
                  : "Contact us"}
            </span>
          </div>
          <div className="flex justify-between border-t pt-3 text-lg font-semibold">
            <span>Total</span>
            <span>{automaticShippingAvailable || !countryCode ? formatPrice(payableCents) : formatPrice(merchandiseTotal)}</span>
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
        {shippingQuote && (!shippingQuote.available || requiresWeightReview) ? (
          <Button type="button" className="mt-6 w-full" onClick={() => setShippingHelpOpen(true)}>
            Get a shipping quote
          </Button>
        ) : (
          <Button form="checkout-form" type="submit" disabled={loading || !countryCode} className="mt-6 w-full">
            {loading ? "Opening payment..." : `Place order - ${formatPrice(payableCents)}`}
          </Button>
        )}
        <Link href={localeHref(locale, "/cart")} className="mt-4 inline-flex text-sm font-semibold text-primary">
          Back to cart
        </Link>
        <div className="mt-5 border-t pt-4">
          <p className="text-center text-xs font-semibold text-muted-foreground">Securely pay with Clossyan Technologies (Pvt) Ltd</p>
          <PaymentMarks className="mt-2 justify-center" />
        </div>
      </aside>

      {shippingHelpOpen && shippingQuote && (
        <ShippingHelpDialog
          countryName={shippingQuote.countryName}
          estimatedWeightGrams={estimatedWeightGrams}
          isLargeOrder={requiresWeightReview}
          onClose={() => setShippingHelpOpen(false)}
        />
      )}
      {feedbackOpen && (
        <CheckoutFeedbackDialog
          reason={feedbackReason}
          detail={feedbackDetail}
          busy={feedbackBusy}
          note={feedbackNote}
          onReason={setFeedbackReason}
          onDetail={setFeedbackDetail}
          onClose={() => {
            if (!feedbackBusy) setFeedbackOpen(false);
          }}
          onSubmit={() => void submitFeedback()}
        />
      )}
    </div>
  );
}

function ShippingHelpDialog({
  countryName,
  estimatedWeightGrams,
  isLargeOrder,
  onClose
}: {
  countryName: string;
  estimatedWeightGrams: number;
  isLargeOrder: boolean;
  onClose: () => void;
}) {
  const whatsappLink = isLargeOrder
    ? whatsappLargeOrderShippingHelpLink(countryName, estimatedWeightGrams)
    : whatsappShippingHelpLink(countryName);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="max-w-md rounded-[0.75rem] border bg-background p-6 shadow-soft">
        <h2 className="font-serif text-2xl font-semibold">
          {isLargeOrder ? "Large-order shipping" : `Shipping for ${countryName}`}
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {isLargeOrder
            ? `Your cart is estimated at ${estimatedWeightGrams} g. Listed rates cover up to 1 kg. Contact us for the best shipping rate before placing your order.`
            : countryName.toLowerCase().includes("hong kong")
              ? "We deliver to Hong Kong. Checkout does not calculate that rate automatically, so send us a message and we will quote shipping and help you place the order."
              : "Your country shipping price is not calculated automatically. Contact us and we will calculate shipping and send you the details on how to place the order."}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button asChild className="flex-1">
            <a href={whatsappLink} target="_blank" rel="noreferrer">
              WhatsApp {SUPPORT_WHATSAPP_DISPLAY}
            </a>
          </Button>
          <Button asChild variant="secondary" className="flex-1">
            <a href={SUPPORT_INSTAGRAM_LINK} target="_blank" rel="noreferrer">
              Message on Instagram
            </a>
          </Button>
          {SUPPORT_FACEBOOK_LINK && (
            <Button asChild variant="secondary" className="flex-1">
              <a href={SUPPORT_FACEBOOK_LINK} target="_blank" rel="noreferrer">
                Message on Facebook
              </a>
            </Button>
          )}
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function CheckoutFeedbackDialog({
  reason,
  detail,
  busy,
  note,
  onReason,
  onDetail,
  onClose,
  onSubmit
}: {
  reason: string;
  detail: string;
  busy: boolean;
  note: string;
  onReason: (value: string) => void;
  onDetail: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 p-3 sm:items-center"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="w-full max-w-md rounded-[1rem] bg-white p-4 text-[#523A27] shadow-2xl sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <h2 className="font-serif text-xl font-semibold">Help us understand</h2>
        <p className="mt-1 text-sm text-[#8a6d56]">Was there any trouble with payment?</p>
        <div className="mt-4 grid gap-2">
          {FEEDBACK_REASONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onReason(item.id)}
              className={`rounded-[0.5rem] border px-3 py-3 text-left text-sm font-semibold ${
                reason === item.id ? "border-[#a67146] bg-[#f7efe3]" : "border-[#ead9c3] bg-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {reason === "other" ? (
          <label className="mt-3 block text-sm font-semibold">
            Tell us what happened
            <textarea
              required
              value={detail}
              onChange={(event) => onDetail(event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-[0.5rem] border border-[#ead9c3] px-3 py-2 text-base"
            />
          </label>
        ) : null}
        {note ? <p className="mt-3 text-sm font-semibold text-[#6d4b32]">{note}</p> : null}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" disabled={busy} onClick={onClose} className="rounded-[0.5rem] border border-[#ead9c3] px-4 py-3 text-sm font-semibold">
            Close
          </button>
          <button type="submit" disabled={busy} className="rounded-[0.5rem] bg-[#a67146] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {busy ? "Saving…" : "Send"}
          </button>
        </div>
      </form>
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

function estimateSubtotal(lines: CartLine[], catalog: Product[]) {
  const rows = productRows(catalog);
  return lines.reduce((sum, line) => {
    const row = rows.find((product) => product.sku === line.sku);
    return sum + (row?.priceCents ?? 0) * line.quantity;
  }, 0);
}

function productRows(catalog: Product[]) {
  return catalog.flatMap((product) => [
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
