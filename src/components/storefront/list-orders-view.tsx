"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { CountryFlag } from "@/components/storefront/country-flag";
import { formatListDate, formatListMoney, formatListStatus, paymentBadgeClass } from "@/lib/list-order-format";
import { reminderButtonState, type ReminderDraft } from "@/lib/unpaid-recovery-state";

export type ListOrderRow = {
  id: string;
  orderNumber: string;
  email: string;
  status: string;
  paymentStatus: string;
  currency: string;
  totalCents: number;
  subtotalCents: number;
  createdAt: string;
  itemCount: number;
  customerName: string;
  countryName: string;
  countryCode: string;
  recoverySentAt: string | null;
  recoveryCode: string | null;
  guestCheckout: boolean;
  trackingNumber: string | null;
  trackingSentAt: string | null;
  checkoutNote: string | null;
};

type TrackingMail = {
  orderNumber: string;
  to: string;
  firstName: string;
  trackingNumber: string;
  subject: string;
  html: string;
};

export function ListOrdersView({
  locale,
  orders: initialOrders
}: {
  locale: Locale;
  orders: ListOrderRow[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<ReminderDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [testStatus, setTestStatus] = useState("");
  const [testOpen, setTestOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [hideUnpaid, setHideUnpaid] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [trackingMail, setTrackingMail] = useState<TrackingMail | null>(null);

  const visible = useMemo(() => {
    const source = hideUnpaid ? orders.filter((order) => order.paymentStatus !== "UNPAID") : orders;
    const needle = query.trim().toLowerCase();
    if (!needle) return source;
    return source.filter((order) =>
      [order.orderNumber, order.email, order.customerName, order.countryName, order.status, order.paymentStatus, order.trackingNumber || ""]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [hideUnpaid, orders, query]);

  async function openReminder(orderNumber: string) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/list/orders/${encodeURIComponent(orderNumber)}/reminder`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "preview" })
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; draft?: ReminderDraft };
      if (!response.ok || !payload.draft) throw new Error(payload.error || "Unable to prepare the email");
      setDraft(payload.draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to prepare the email");
    } finally {
      setBusy(false);
    }
  }

  async function sendReminder() {
    if (!draft) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/list/orders/${encodeURIComponent(draft.orderNumber)}/reminder`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", code: draft.code })
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; draft?: ReminderDraft };
      if (!response.ok) throw new Error(payload.error || "Unable to send the email");
      setOrders((current) =>
        current.map((order) =>
          order.orderNumber === draft.orderNumber
            ? { ...order, recoveryCode: draft.code, recoverySentAt: new Date().toISOString() }
            : order
        )
      );
      setDraft(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send the email");
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    const to = testEmail.trim();
    if (!to.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    setError("");
    setTestStatus("");
    try {
      const response = await fetch("/api/list/orders/reminder-test", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to })
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; subject?: string; to?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to send the test email");
      setTestOpen(false);
      setTestStatus(`Test reminder sent to ${payload.to || to}. Subject: ${payload.subject || "lucky 7% reminder"}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send the test email");
    } finally {
      setBusy(false);
    }
  }

  function trackingValue(order: ListOrderRow) {
    return trackingInputs[order.orderNumber] ?? order.trackingNumber ?? "";
  }

  async function openTracking(order: ListOrderRow) {
    const trackingNumber = trackingValue(order).trim();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/list/orders/${encodeURIComponent(order.orderNumber)}/tracking`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "preview", trackingNumber })
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; draft?: Omit<TrackingMail, "orderNumber"> };
      if (!response.ok || !payload.draft) throw new Error(payload.error || "Unable to prepare the tracking email");
      setTrackingMail({ ...payload.draft, orderNumber: order.orderNumber });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to prepare the tracking email");
    } finally {
      setBusy(false);
    }
  }

  async function sendTracking() {
    if (!trackingMail) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/list/orders/${encodeURIComponent(trackingMail.orderNumber)}/tracking`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", trackingNumber: trackingMail.trackingNumber })
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to send the tracking email");
      const sentAt = new Date().toISOString();
      setOrders((current) =>
        current.map((order) =>
          order.orderNumber === trackingMail.orderNumber
            ? { ...order, trackingNumber: trackingMail.trackingNumber, trackingSentAt: sentAt }
            : order
        )
      );
      setTrackingInputs((current) => ({ ...current, [trackingMail.orderNumber]: trackingMail.trackingNumber }));
      setTrackingMail(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send the tracking email");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-3 py-3 sm:px-5 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Orders received</h1>
          <p className="mt-1 text-sm font-semibold text-[#8a6d56]">
            {visible.length === orders.length
              ? `${orders.length} order${orders.length === 1 ? "" : "s"}`
              : `${visible.length} of ${orders.length}`}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:max-w-md sm:items-end">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setError("");
              setTestOpen(true);
            }}
            className="w-full rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 py-3 text-sm font-semibold text-[#6d4b32] sm:w-auto"
          >
            Test reminder email
          </button>
          <div className="flex w-full flex-col gap-2 sm:max-w-xs">
            <label className="block w-full">
              <span className="sr-only">Search orders</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, email, or order number"
                className="w-full rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 py-3 text-base outline-none focus:border-[#a67146] sm:py-2 sm:text-sm"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#6d4b32]">
              <input
                type="checkbox"
                checked={hideUnpaid}
                onChange={(event) => setHideUnpaid(event.target.checked)}
                className="h-4 w-4 accent-[#a67146]"
              />
              Hide unpaid orders
            </label>
          </div>
        </div>
      </div>
      {testStatus ? (
        <p className="mt-3 rounded-[0.5rem] border border-[#ead9c3] bg-white px-4 py-3 text-sm font-semibold text-[#523A27]">
          {testStatus}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 rounded-[0.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}

      {orders.length === 0 ? (
        <p className="mt-8 rounded-[0.5rem] border border-[#ead9c3] bg-white px-5 py-10 text-center text-sm font-semibold text-[#8a6d56]">
          No orders yet. New checkout orders will show here.
        </p>
      ) : visible.length === 0 ? (
        <p className="mt-8 rounded-[0.5rem] border border-[#ead9c3] bg-white px-5 py-10 text-center text-sm font-semibold text-[#8a6d56]">
          {hideUnpaid && !query.trim() ? "Paid orders will show here. Unpaid orders are hidden." : "No orders match that search."}
        </p>
      ) : (
        <div className="mt-4 grid gap-3">
          {visible.map((order) => {
            const reminder = reminderButtonState(order, orders);
            return (
              <article key={order.id} className="w-full rounded-[0.5rem] border border-[#ead9c3] bg-white p-4 shadow-sm">
                <div className="grid w-full gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <Link href={localeHref(locale, `/list/orders/${order.orderNumber}`)} className="min-w-0 hover:opacity-90">
                    <p className="break-all font-serif text-lg font-semibold">{order.orderNumber}</p>
                    <p className="mt-1 text-sm text-[#6d4b32]">{order.customerName}</p>
                    <p className="break-all text-sm text-[#8a6d56]">{order.email}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-[#f7efe3] px-2.5 py-1 text-[#6d4b32]">{formatListDate(order.createdAt)}</span>
                      <span className="rounded-full bg-[#f7efe3] px-2.5 py-1 text-[#6d4b32]">
                        {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                      </span>
                      <span className="rounded-full bg-[#f7efe3] px-2.5 py-1 text-[#6d4b32]">{formatListStatus(order.status)}</span>
                      {order.guestCheckout ? (
                        <span className="rounded-full bg-[#f7efe3] px-2.5 py-1 text-[#6d4b32]">Guest</span>
                      ) : null}
                    </div>
                  </Link>
                  <div className="flex w-full flex-col gap-2 border-t border-[#f0e3d3] pt-3 sm:w-auto sm:min-w-[10rem] sm:items-end sm:border-0 sm:pt-0 sm:text-right">
                    <div className="flex w-full items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <div className="min-w-0">
                        <p className="text-lg font-semibold">{formatListMoney(order.totalCents, order.currency)}</p>
                        <p className="mt-1 text-sm font-semibold text-[#6d4b32]">
                          <CountryFlag code={order.countryCode} name={order.countryName} />
                        </p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center justify-center rounded-[0.5rem] px-3.5 py-2.5 text-sm font-bold uppercase tracking-[0.14em] sm:min-w-[7.5rem] sm:text-base ${paymentBadgeClass(order.paymentStatus)}`}
                      >
                        {formatListStatus(order.paymentStatus)}
                      </span>
                    </div>
                    {order.paymentStatus !== "PAID" ? (
                      <div className="w-full sm:w-auto sm:min-w-[7.5rem]">
                        <button
                          type="button"
                          disabled={!reminder.canSend || busy}
                          title={reminder.reason || "Send a lucky 7% reminder"}
                          onClick={() => void openReminder(order.orderNumber)}
                          className="inline-flex w-full items-center justify-center rounded-[0.5rem] border border-[#ead9c3] px-3 py-2.5 text-sm font-semibold text-[#6d4b32] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {reminder.canSend ? "Send 7%" : reminder.label || "Send 7%"}
                        </button>
                        {order.recoveryCode ? (
                          <p className="mt-1 break-all text-center text-[11px] font-semibold text-[#8a6d56]">{order.recoveryCode}</p>
                        ) : null}
                        {order.paymentStatus === "UNPAID" ? (
                          <p className="mt-2 rounded-[0.5rem] bg-[#f7efe3] px-2.5 py-2 text-left text-xs font-semibold leading-5 text-[#6d4b32]">
                            {order.checkoutNote || "No answer recorded"}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="w-full sm:min-w-[14rem]">
                        <label className="block text-left text-xs font-semibold text-[#8a6d56]">
                          Tracking code
                          <input
                            value={trackingValue(order)}
                            onChange={(event) =>
                              setTrackingInputs((current) => ({
                                ...current,
                                [order.orderNumber]: event.target.value.toUpperCase()
                              }))
                            }
                            placeholder="YT..."
                            className="mt-1 w-full rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 py-2.5 text-base outline-none focus:border-[#a67146]"
                          />
                        </label>
                        <button
                          type="button"
                          disabled={busy || trackingValue(order).trim().length < 6}
                          onClick={() => void openTracking(order)}
                          className="mt-2 inline-flex w-full items-center justify-center rounded-[0.5rem] bg-[#a67146] px-3 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Send tracking
                        </button>
                        {order.trackingSentAt ? (
                          <p className="mt-1 text-center text-[11px] font-semibold text-[#8a6d56]">
                            Sent {formatListDate(order.trackingSentAt)}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {testOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) setTestOpen(false);
          }}
        >
          <form
            className="w-full max-w-md rounded-[1rem] bg-white p-4 shadow-2xl sm:p-5"
            onSubmit={(event) => {
              event.preventDefault();
              void sendTest();
            }}
          >
            <h2 className="font-serif text-xl font-semibold">Send a test reminder</h2>
            <p className="mt-1 text-sm text-[#8a6d56]">Enter the inbox that should receive the sample lucky 7% email.</p>
            <label className="mt-4 block text-sm font-semibold text-[#6d4b32]">
              Email
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                inputMode="email"
                value={testEmail}
                onChange={(event) => setTestEmail(event.target.value)}
                placeholder="you@email.com"
                className="mt-2 w-full rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 py-3 text-base outline-none focus:border-[#a67146]"
              />
            </label>
            {error ? (
              <p className="mt-3 rounded-[0.5rem] border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
                {error}
              </p>
            ) : null}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setTestOpen(false)}
                className="rounded-[0.5rem] border border-[#ead9c3] px-4 py-3 text-sm font-semibold text-[#6d4b32]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="rounded-[0.5rem] bg-[#a67146] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send test"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {draft ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) setDraft(null);
          }}
        >
          <div className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-[1rem] bg-white shadow-2xl">
            <div className="border-b border-[#ead9c3] px-4 py-3 sm:px-5">
              <h2 className="font-serif text-xl font-semibold">Lucky 7% reminder</h2>
              <p className="mt-1 text-sm text-[#8a6d56]">
                {draft.firstName} saves {draft.saveLabel} · code {draft.code} · 48 hours
              </p>
            </div>
            <div className="grid gap-3 overflow-y-auto px-4 py-4 sm:px-5">
              <p className="text-sm">
                <span className="font-semibold text-[#8a6d56]">To</span> {draft.to}
              </p>
              <p className="text-sm">
                <span className="font-semibold text-[#8a6d56]">Subject</span> {draft.subject}
              </p>
              <iframe title="Reminder preview" srcDoc={draft.html} className="min-h-[420px] w-full rounded-[0.5rem] border border-[#ead9c3] bg-[#fef9ef]" />
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-[#ead9c3] px-4 py-3 sm:px-5">
              <button
                type="button"
                disabled={busy}
                onClick={() => setDraft(null)}
                className="rounded-[0.5rem] border border-[#ead9c3] px-4 py-3 text-sm font-semibold text-[#6d4b32]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void sendReminder()}
                className="rounded-[0.5rem] bg-[#a67146] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send email"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {trackingMail ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) setTrackingMail(null);
          }}
        >
          <div className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-[1rem] bg-white shadow-2xl">
            <div className="border-b border-[#ead9c3] px-4 py-3 sm:px-5">
              <h2 className="font-serif text-xl font-semibold">Parcel tracking email</h2>
              <p className="mt-1 text-sm text-[#8a6d56]">
                {trackingMail.firstName} · {trackingMail.trackingNumber}
              </p>
            </div>
            <div className="grid gap-3 overflow-y-auto px-4 py-4 sm:px-5">
              <p className="text-sm">
                <span className="font-semibold text-[#8a6d56]">To</span> {trackingMail.to}
              </p>
              <p className="text-sm">
                <span className="font-semibold text-[#8a6d56]">Subject</span> {trackingMail.subject}
              </p>
              <iframe title="Tracking email preview" srcDoc={trackingMail.html} className="min-h-[420px] w-full rounded-[0.5rem] border border-[#ead9c3] bg-[#fef9ef]" />
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-[#ead9c3] px-4 py-3 sm:px-5">
              <button
                type="button"
                disabled={busy}
                onClick={() => setTrackingMail(null)}
                className="rounded-[0.5rem] border border-[#ead9c3] px-4 py-3 text-sm font-semibold text-[#6d4b32]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void sendTracking()}
                className="rounded-[0.5rem] bg-[#a67146] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send email"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
