"use client";

import { FormEvent, useEffect, useState, type InputHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { readBrowserCart, writeBrowserCart, type CartLine } from "@/lib/browser-cart";
import { formatListDate, formatListMoney, formatListStatus } from "@/lib/list-order-format";
import { yuntrackUrl } from "@/lib/yuntrack-shared";

type Address = {
  id: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  countryCode: string;
  phone: string;
  isDefault: boolean;
};

type AccountOrder = {
  orderNumber: string;
  createdAt: string;
  paymentStatus: string;
  status: string;
  totalCents: number;
  currency: string;
  trackingNumber: string | null;
  guestCheckout: boolean;
  items: Array<{ name: string; quantity: number }>;
};

const emptyAddress: Address = {
  id: "",
  name: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "",
  countryCode: "",
  phone: "",
  isDefault: true
};

export function AccountAuth({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setNotice("");
    const lines = readBrowserCart();
    try {
      if (mode === "forgot") {
        const response = await postJson("/api/account/forgot", { email: String(form.get("email") || "") });
        if (!response.ok) throw new Error(response.error || "Unable to send reset email");
        setNotice("If that email has an account, a reset link is on its way.");
        return;
      }
      const path = mode === "signup" ? "/api/account/signup" : "/api/account/login";
      const response = await postJson(path, {
        email: String(form.get("email") || ""),
        password: String(form.get("password") || ""),
        name: String(form.get("name") || ""),
        lines
      });
      if (!response.ok) throw new Error(response.error || "Unable to continue");
      if (Array.isArray(response.lines)) writeBrowserCart(response.lines as CartLine[]);
      window.dispatchEvent(new Event("siconart-account-updated"));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="eyebrow">Account</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold">
        {mode === "signup" ? "Create account" : mode === "forgot" ? "Reset password" : "Log in"}
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setMode("login")} className={tabClass(mode === "login")}>
          Log in
        </button>
        <button type="button" onClick={() => setMode("signup")} className={tabClass(mode === "signup")}>
          Create account
        </button>
      </div>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-[0.5rem] border bg-surface p-5">
        {mode === "signup" ? <Field name="name" label="Name" autoComplete="name" /> : null}
        <Field name="email" label="Email" type="email" autoComplete="email" required />
        {mode !== "forgot" ? (
          <Field name="password" label="Password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
        ) : null}
        {error ? <p className="rounded-[0.5rem] border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        {notice ? <p className="rounded-[0.5rem] border border-[#ead9c3] bg-white p-3 text-sm font-semibold">{notice}</p> : null}
        <button type="submit" disabled={busy} className="h-12 rounded-[0.5rem] bg-primary text-sm font-semibold text-primary-foreground">
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Log in"}
        </button>
        {mode !== "forgot" ? (
          <button type="button" onClick={() => setMode("forgot")} className="text-sm font-semibold text-primary">
            Forgot password
          </button>
        ) : (
          <button type="button" onClick={() => setMode("login")} className="text-sm font-semibold text-primary">
            Back to log in
          </button>
        )}
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        You can also check out as a guest. We will create an account from your email and send the password separately.
      </p>
      <Link href={localeHref(locale, "/shop")} className="mt-3 inline-flex text-sm font-semibold text-primary">
        Continue shopping
      </Link>
    </div>
  );
}

export function AccountHome({
  locale,
  customer,
  orders,
  addresses
}: {
  locale: Locale;
  customer: { email: string; name: string; phone: string };
  orders: AccountOrder[];
  addresses: Address[];
}) {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Address | null>(null);
  const [tab, setTab] = useState<AccountTab>("orders");
  const [paying, setPaying] = useState("");
  const [cancelFor, setCancelFor] = useState("");
  const [helpFor, setHelpFor] = useState("");
  const [helpReason, setHelpReason] = useState("");
  const [helpDetail, setHelpDetail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") !== "cancelled") return;
    setTab("orders");
    setNotice("Payment was not completed. You can pay again when you are ready.");
    const order = params.get("order");
    if (order) setHelpFor(order);
    params.delete("payment");
    params.delete("order");
    const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
    window.history.replaceState({}, "", next);
  }, []);

  async function save(path: string, body: unknown, okText: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await postJson(path, body);
      if (!response.ok) throw new Error(response.error || "Unable to save");
      setNotice(okText);
      setDraft(null);
      window.dispatchEvent(new Event("siconart-account-updated"));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save");
    } finally {
      setBusy(false);
    }
  }

  async function payNow(orderNumber: string) {
    setPaying(orderNumber);
    setError("");
    setHelpFor("");
    try {
      const response = await fetch(`/api/account/orders/${encodeURIComponent(orderNumber)}/pay`, {
        method: "POST",
        credentials: "include"
      });
      const payload = (await response.json()) as {
        error?: string;
        payhere?: { sandbox: boolean; action: string; fields: Record<string, string> };
      };
      if (!response.ok || !payload.payhere) throw new Error(payload.error || "Unable to open payment");
      await openAccountPayHere(payload.payhere, {
        onCompleted: (orderId) => {
          window.location.assign(`/checkout/thank-you?order=${encodeURIComponent(orderId)}`);
        },
        onDismissed: () => {
          setPaying("");
          setHelpFor(orderNumber);
          setHelpReason("");
          setHelpDetail("");
          setNotice("Payment was not completed.");
        },
        onError: (message) => {
          setPaying("");
          setError(message || "Payment could not start");
        }
      });
    } catch (err) {
      setPaying("");
      setError(err instanceof Error ? err.message : "Unable to open payment");
    }
  }

  async function cancelOrder(orderNumber: string) {
    setBusy(true);
    setError("");
    try {
      const response = await postJson(`/api/account/orders/${encodeURIComponent(orderNumber)}/cancel`, {});
      if (!response.ok) throw new Error(response.error || "Unable to cancel this order");
      setCancelFor("");
      setNotice("Order cancelled.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cancel this order");
    } finally {
      setBusy(false);
    }
  }

  async function sendHelp(orderNumber: string) {
    if (!helpReason) {
      setError("Choose the option that fits.");
      return;
    }
    if (helpReason === "other" && helpDetail.trim().length < 3) {
      setError("Tell us a little more.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await postJson("/api/checkout/feedback", {
        orderNumber,
        email: customer.email,
        reason: helpReason,
        detail: helpDetail
      });
      if (!response.ok) throw new Error(response.error || "Could not save that");
      setHelpFor("");
      setNotice("Thank you. That helps us.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">{customer.name || "Your account"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{customer.email}</p>
        </div>
        <button
          type="button"
          className="h-11 rounded-[0.5rem] border px-4 text-sm font-semibold"
          onClick={() =>
            void save("/api/account/logout", {}, "Logged out").then(() => {
              router.refresh();
            })
          }
        >
          Log out
        </button>
      </div>
      {error ? <p className="rounded-[0.5rem] border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {notice ? <p className="rounded-[0.5rem] border bg-surface p-3 text-sm font-semibold">{notice}</p> : null}

      <div className="flex gap-1 overflow-x-auto rounded-[0.75rem] border bg-surface p-1">
        {accountTabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`shrink-0 rounded-[0.55rem] px-4 py-2.5 text-sm font-semibold ${
              tab === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-background"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className={`${tab === "orders" ? "" : "hidden "}rounded-[0.5rem] border bg-surface p-5`}>
        <h2 className="font-serif text-2xl font-semibold">Orders</h2>
        {orders.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No orders yet.</p> : null}
        <div className="mt-4 grid gap-3">
          {orders.map((order) => (
            <article key={order.orderNumber} className="rounded-[0.5rem] border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">{formatListDate(order.createdAt)}</p>
                </div>
                <p className="font-semibold">{formatListMoney(order.totalCents, order.currency)}</p>
              </div>
              <p className="mt-2 text-sm">
                {formatListStatus(order.paymentStatus)} · {formatListStatus(order.status)}
                {order.guestCheckout ? " · Guest checkout" : ""}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}</p>
              {order.trackingNumber ? (
                <a href={yuntrackUrl(order.trackingNumber)} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-semibold text-primary">
                  Track {order.trackingNumber}
                </a>
              ) : null}
              {(order.paymentStatus === "UNPAID" || order.paymentStatus === "FAILED") && order.status !== "CANCELLED" ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    disabled={paying === order.orderNumber || busy}
                    onClick={() => void payNow(order.orderNumber)}
                    className="h-11 rounded-[0.5rem] bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    {paying === order.orderNumber ? "Opening payment…" : "Pay now"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setCancelFor(order.orderNumber)}
                    className="h-11 rounded-[0.5rem] border text-sm font-semibold"
                  >
                    Cancel this order
                  </button>
                </div>
              ) : null}
              {order.status === "CANCELLED" ? <p className="mt-3 text-sm font-semibold text-muted-foreground">This order is cancelled.</p> : null}
              {cancelFor === order.orderNumber ? (
                <div className="mt-3 rounded-[0.5rem] border border-amber-200 bg-amber-50 p-3 text-sm">
                  <p className="font-semibold text-amber-900">Cancel {order.orderNumber}? This keeps the order on file and removes it from payment.</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void cancelOrder(order.orderNumber)} className="h-10 rounded-[0.5rem] bg-[#523A27] px-4 text-sm font-semibold text-white">
                      Yes, cancel
                    </button>
                    <button type="button" onClick={() => setCancelFor("")} className="h-10 rounded-[0.5rem] border px-4 text-sm font-semibold">
                      Keep order
                    </button>
                  </div>
                </div>
              ) : null}
              {helpFor === order.orderNumber ? (
                <div className="mt-3 grid gap-2">
                  <p className="text-sm font-semibold">Help us understand. Was there any trouble?</p>
                  {helpReasons.map((reason) => (
                    <button
                      key={reason.id}
                      type="button"
                      onClick={() => setHelpReason(reason.id)}
                      className={`rounded-[0.5rem] border px-3 py-2.5 text-left text-sm font-semibold ${
                        helpReason === reason.id ? "border-primary bg-background" : ""
                      }`}
                    >
                      {reason.label}
                    </button>
                  ))}
                  {helpReason === "other" ? (
                    <textarea
                      value={helpDetail}
                      onChange={(event) => setHelpDetail(event.target.value)}
                      rows={3}
                      placeholder="Tell us what happened"
                      className="w-full rounded-[0.5rem] border bg-background px-3 py-2 text-base"
                    />
                  ) : null}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setHelpFor("");
                        void postJson("/api/checkout/feedback", { orderNumber: order.orderNumber, email: customer.email, reason: "closed" });
                      }}
                      className="h-11 rounded-[0.5rem] border text-sm font-semibold"
                    >
                      Close
                    </button>
                    <button type="button" disabled={busy} onClick={() => void sendHelp(order.orderNumber)} className="h-11 rounded-[0.5rem] bg-primary text-sm font-semibold text-primary-foreground">
                      Send
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className={`${tab === "profile" ? "" : "hidden "}rounded-[0.5rem] border bg-surface p-5`}>
        <h2 className="font-serif text-2xl font-semibold">Profile</h2>
        <form
          className="mt-4 grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            void save("/api/account/profile", { name: form.get("name"), phone: form.get("phone") }, "Profile saved.");
          }}
        >
          <Field name="name" label="Name" defaultValue={customer.name} />
          <Field name="phone" label="Phone" defaultValue={customer.phone} />
          <button type="submit" disabled={busy} className="h-11 rounded-[0.5rem] bg-primary text-sm font-semibold text-primary-foreground sm:col-span-2">
            Save profile
          </button>
        </form>
      </section>

      <section className={`${tab === "password" ? "" : "hidden "}rounded-[0.5rem] border bg-surface p-5`}>
        <h2 className="font-serif text-2xl font-semibold">Password</h2>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            void save(
              "/api/account/password",
              { currentPassword: form.get("currentPassword"), nextPassword: form.get("nextPassword") },
              "Password updated."
            );
          }}
        >
          <Field name="currentPassword" label="Current password" type="password" autoComplete="current-password" required />
          <Field name="nextPassword" label="New password" type="password" autoComplete="new-password" required />
          <button type="submit" disabled={busy} className="h-11 rounded-[0.5rem] bg-primary text-sm font-semibold text-primary-foreground">
            Change password
          </button>
        </form>
      </section>

      <section className={`${tab === "profile" ? "" : "hidden "}rounded-[0.5rem] border bg-surface p-5`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-semibold">Shipping addresses</h2>
          <button type="button" className="text-sm font-semibold text-primary" onClick={() => setDraft(emptyAddress)}>
            Add address
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {addresses.map((address) => (
            <article key={address.id} className="rounded-[0.5rem] border p-4 text-sm">
              <p className="font-semibold">
                {address.name} {address.isDefault ? "· Default" : ""}
              </p>
              <p className="mt-1 text-muted-foreground">
                {[address.line1, address.line2, address.city, address.region, address.postalCode, address.country, address.phone]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <div className="mt-3 flex gap-3">
                <button type="button" className="font-semibold text-primary" onClick={() => setDraft(address)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="font-semibold text-red-700"
                  onClick={() =>
                    void fetch(`/api/account/addresses?id=${encodeURIComponent(address.id)}`, { method: "DELETE" }).then(() =>
                      router.refresh()
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
        {draft ? (
          <form
            className="mt-4 grid gap-3 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void save(
                "/api/account/addresses",
                {
                  id: draft.id,
                  name: form.get("name"),
                  line1: form.get("line1"),
                  line2: form.get("line2"),
                  city: form.get("city"),
                  region: form.get("region"),
                  postalCode: form.get("postalCode"),
                  country: form.get("country"),
                  countryCode: form.get("countryCode"),
                  phone: form.get("phone"),
                  isDefault: form.get("isDefault") === "on"
                },
                "Address saved."
              );
            }}
          >
            <Field name="name" label="Name" defaultValue={draft.name} required />
            <Field name="phone" label="Phone" defaultValue={draft.phone} />
            <Field name="line1" label="Address line 1" defaultValue={draft.line1} required />
            <Field name="line2" label="Address line 2" defaultValue={draft.line2} />
            <Field name="city" label="City" defaultValue={draft.city} required />
            <Field name="region" label="State / region" defaultValue={draft.region} />
            <Field name="postalCode" label="Postal code" defaultValue={draft.postalCode} />
            <Field name="country" label="Country" defaultValue={draft.country} required />
            <Field name="countryCode" label="Country code" defaultValue={draft.countryCode} />
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" name="isDefault" defaultChecked={draft.isDefault} />
              Default shipping address
            </label>
            <button type="submit" disabled={busy} className="h-11 rounded-[0.5rem] bg-primary text-sm font-semibold text-primary-foreground sm:col-span-2">
              Save address
            </button>
          </form>
        ) : null}
      </section>

      <section className={`${tab === "service" ? "" : "hidden "}rounded-[0.5rem] border bg-surface p-5`}>
        <h2 className="font-serif text-2xl font-semibold">Customer service</h2>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            void save("/api/account/message", { subject: form.get("subject"), message: form.get("message") }, "Message sent.");
            event.currentTarget.reset();
          }}
        >
          <Field name="subject" label="Subject" required />
          <label className="text-sm font-semibold">
            Message
            <textarea name="message" required className="mt-2 min-h-28 w-full rounded-[0.5rem] border bg-background px-3 py-3 text-base" />
          </label>
          <button type="submit" disabled={busy} className="h-11 rounded-[0.5rem] bg-primary text-sm font-semibold text-primary-foreground">
            Send message
          </button>
        </form>
        <p className="mt-3 text-sm text-muted-foreground">
          You can also visit the <Link href={localeHref(locale, "/contact")} className="font-semibold text-primary">contact page</Link>.
        </p>
      </section>
    </div>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="mx-auto grid max-w-md gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const password = String(new FormData(event.currentTarget).get("password") || "");
        setBusy(true);
        setError("");
        void postJson("/api/account/reset", { token, password })
          .then((response) => {
            if (!response.ok) throw new Error(response.error || "Unable to reset password");
            router.push("/account");
            router.refresh();
          })
          .catch((err) => setError(err instanceof Error ? err.message : "Unable to reset password"))
          .finally(() => setBusy(false));
      }}
    >
      <p className="eyebrow">Account</p>
      <h1 className="font-serif text-5xl font-semibold">Choose a new password</h1>
      <Field name="password" label="New password" type="password" autoComplete="new-password" required />
      {error ? <p className="rounded-[0.5rem] border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <button type="submit" disabled={busy} className="h-12 rounded-[0.5rem] bg-primary text-sm font-semibold text-primary-foreground">
        {busy ? "Saving…" : "Save password"}
      </button>
    </form>
  );
}

function Field(props: InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="text-sm font-semibold">
      {label}
      <input {...inputProps} className="mt-2 h-11 w-full rounded-[0.5rem] border bg-background px-3 text-base" />
    </label>
  );
}

const accountTabs = [
  { id: "orders", label: "Orders" },
  { id: "profile", label: "Profile" },
  { id: "password", label: "Password" },
  { id: "service", label: "Customer service" }
] as const;

type AccountTab = (typeof accountTabs)[number]["id"];

const helpReasons = [
  { id: "payment-method", label: "I need a different payment method" },
  { id: "price", label: "Prices are expensive" },
  { id: "gateway", label: "Payment gateway error" },
  { id: "other", label: "Other" }
];

function tabClass(active: boolean) {
  return `h-11 rounded-[0.5rem] border text-sm font-semibold ${active ? "bg-primary text-primary-foreground" : "bg-surface"}`;
}

type AccountPayHere = {
  sandbox: boolean;
  action: string;
  fields: Record<string, string>;
};

type AccountPayHereSdk = {
  startPayment: (payment: Record<string, string | boolean>) => void;
  onCompleted: ((orderId: string) => void) | null;
  onDismissed: (() => void) | null;
  onError: ((error: string) => void) | null;
};

async function openAccountPayHere(
  payload: AccountPayHere,
  handlers: {
    onCompleted: (orderId: string) => void;
    onDismissed: () => void;
    onError: (message: string) => void;
  }
) {
  try {
    const payhere = await loadAccountPayHere();
    payhere.onCompleted = handlers.onCompleted;
    payhere.onDismissed = handlers.onDismissed;
    payhere.onError = handlers.onError;
    payhere.startPayment({ sandbox: payload.sandbox, ...payload.fields });
  } catch {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = payload.action;
    Object.entries(payload.fields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  }
}

function loadAccountPayHere() {
  const sdk = () => (window as Window & { payhere?: AccountPayHereSdk }).payhere;
  if (sdk()) return Promise.resolve(sdk() as AccountPayHereSdk);
  return new Promise<AccountPayHereSdk>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-payhere-sdk]");
    const ready = () => (sdk() ? resolve(sdk() as AccountPayHereSdk) : reject(new Error("PayHere failed to load")));
    if (existing) {
      if (sdk()) {
        ready();
        return;
      }
      existing.addEventListener("load", ready);
      existing.addEventListener("error", () => reject(new Error("PayHere failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    script.dataset.payhereSdk = "true";
    script.onload = ready;
    script.onerror = () => reject(new Error("PayHere failed to load"));
    document.body.appendChild(script);
  });
}

async function postJson(path: string, body: unknown) {
  const response = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string; lines?: unknown } | null;
  return { ok: response.ok && payload?.ok !== false, error: payload?.error, lines: payload?.lines };
}
