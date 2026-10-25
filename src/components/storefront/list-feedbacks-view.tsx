"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { formatListDate } from "@/lib/list-order-format";
import { FeedbackPhotos } from "@/components/storefront/feedback-photos";
import type { ListFeedbackRow } from "@/lib/order-feedback-types";

const filters = [
  { id: "PENDING", label: "Waiting" },
  { id: "APPROVED", label: "Approved" },
  { id: "SUSPENDED", label: "Suspended" },
  { id: "ALL", label: "All" }
] as const;

export function ListFeedbacksView({
  locale,
  feedbacks: initialFeedbacks,
  loadError
}: {
  locale: Locale;
  feedbacks: ListFeedbackRow[];
  loadError: string | null;
}) {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("PENDING");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState(loadError || "");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return feedbacks.filter((item) => {
      if (filter !== "ALL" && item.status !== filter) return false;
      if (!needle) return true;
      return [item.orderNumber, item.customerName, item.email, item.body, ...item.products.map((product) => product.name)]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [feedbacks, filter, query]);

  async function setStatus(id: string, status: "APPROVED" | "SUSPENDED") {
    setBusyId(id);
    setError("");
    try {
      const response = await fetch(`/api/list/feedbacks/${encodeURIComponent(id)}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        feedback?: { status: ListFeedbackRow["status"]; decidedAt: string | null };
      };
      if (!response.ok || !payload.feedback) throw new Error(payload.error || "Could not update this feedback.");
      setFeedbacks((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: payload.feedback!.status, decidedAt: payload.feedback!.decidedAt } : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this feedback.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-5 sm:py-6">
      <h1 className="font-serif text-3xl font-semibold">Feedbacks</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6d4b32]">
        New notes wait here. Approve a good one to show it on every brush in that order. Suspend hides it from the shop.
      </p>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search name, order, or brush"
        className="mt-4 w-full rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 py-3 text-base outline-none focus:border-[#a67146]"
      />
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {filters.map((item) => {
          const count = item.id === "ALL" ? feedbacks.length : feedbacks.filter((row) => row.status === item.id).length;
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold ${
                active ? "border-[#a67146] bg-[#a67146] text-white" : "border-[#ead9c3] bg-white text-[#6d4b32]"
              }`}
            >
              {item.label} {count}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="mt-4 rounded-[0.5rem] border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">{error}</p>
      ) : null}
      {visible.length === 0 && !error ? (
        <p className="mt-6 rounded-[0.75rem] border border-[#ead9c3] bg-white px-4 py-6 text-sm leading-6 text-[#6d4b32]">
          {feedbacks.length === 0
            ? "No feedback yet. On a paid order, tap Mark delivered, then send the link to the customer."
            : "Nothing in this list. Try All to see approved and suspended feedback."}
        </p>
      ) : null}
      {visible.length > 0 ? (
        <div className="mt-4 grid gap-3">
          {visible.map((item) => (
            <article key={item.id} className="rounded-[0.75rem] border border-[#ead9c3] bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold">{item.customerName}</p>
                  <p className="mt-1 break-all text-sm text-[#8a6d56]">{item.email}</p>
                </div>
                <StatusPill status={item.status} />
              </div>
              <p className="mt-2 text-sm text-[#8a6d56]">{formatListDate(item.createdAt)}</p>
              <p className="mt-2 text-sm font-semibold">
                <Link href={localeHref(locale, `/list/orders/${encodeURIComponent(item.orderNumber)}`)} className="text-[#a67146]">
                  {item.orderNumber}
                </Link>
              </p>
              {item.products.length ? (
                <p className="mt-2 text-sm leading-6 text-[#6d4b32]">
                  {item.products.map((product, index) => (
                    <span key={product.slug}>
                      {index > 0 ? ", " : ""}
                      <a href={`/products/${product.slug}`} target="_blank" rel="noreferrer" className="font-semibold text-[#8b5d3a]">
                        {product.name}
                      </a>
                    </span>
                  ))}
                </p>
              ) : (
                <p className="mt-2 text-sm text-[#8a6d56]">No matching shop product on this order.</p>
              )}
              <p className="mt-3 whitespace-pre-wrap text-base leading-7">{item.body}</p>
              <FeedbackPhotos ids={item.imageIds} />
              <p className="mt-3 text-xs font-semibold text-[#8a6d56]">
                {item.status === "APPROVED"
                  ? "Showing on the product pages."
                  : item.status === "SUSPENDED"
                    ? "Hidden from the shop."
                    : "Waiting for a decision."}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={busyId === item.id || item.status === "APPROVED"}
                  onClick={() => void setStatus(item.id, "APPROVED")}
                  className="rounded-[0.5rem] bg-[#a67146] px-3 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {busyId === item.id ? "Saving…" : "Approve"}
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id || item.status === "SUSPENDED"}
                  onClick={() => void setStatus(item.id, "SUSPENDED")}
                  className="rounded-[0.5rem] border border-[#ead9c3] px-3 py-3 text-sm font-semibold text-[#6d4b32] disabled:opacity-50"
                >
                  Suspend
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function StatusPill({ status }: { status: ListFeedbackRow["status"] }) {
  const className =
    status === "APPROVED"
      ? "bg-[#1f7a46] text-white"
      : status === "SUSPENDED"
        ? "bg-[#6b7280] text-white"
        : "bg-[#b45309] text-white";
  const label = status === "APPROVED" ? "Approved" : status === "SUSPENDED" ? "Suspended" : "Waiting";
  return <span className={`rounded-[0.5rem] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] ${className}`}>{label}</span>;
}
