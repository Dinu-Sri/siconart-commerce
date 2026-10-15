"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { CountryFlag } from "@/components/storefront/country-flag";
import { formatListDate, formatListMoney, formatListStatus, paymentBadgeClass } from "@/lib/list-order-format";

export type ListOrderRow = {
  id: string;
  orderNumber: string;
  email: string;
  status: string;
  paymentStatus: string;
  currency: string;
  totalCents: number;
  createdAt: string;
  itemCount: number;
  customerName: string;
  countryName: string;
  countryCode: string;
};

export function ListOrdersView({
  locale,
  orders
}: {
  locale: Locale;
  orders: ListOrderRow[];
}) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return orders;
    return orders.filter((order) =>
      [order.orderNumber, order.email, order.customerName, order.countryName, order.status, order.paymentStatus]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [orders, query]);

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
        <label className="block w-full sm:max-w-xs">
          <span className="sr-only">Search orders</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, or order number"
            className="w-full rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 py-3 text-base outline-none focus:border-[#a67146] sm:py-2 sm:text-sm"
          />
        </label>
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 rounded-[0.5rem] border border-[#ead9c3] bg-white px-5 py-10 text-center text-sm font-semibold text-[#8a6d56]">
          No orders yet. New checkout orders will show here.
        </p>
      ) : visible.length === 0 ? (
        <p className="mt-8 rounded-[0.5rem] border border-[#ead9c3] bg-white px-5 py-10 text-center text-sm font-semibold text-[#8a6d56]">
          No orders match that search.
        </p>
      ) : (
        <div className="mt-4 grid gap-3">
          {visible.map((order) => (
            <Link
              key={order.id}
              href={localeHref(locale, `/list/orders/${order.orderNumber}`)}
              className="rounded-[0.5rem] border border-[#ead9c3] bg-white p-4 shadow-sm transition hover:border-[#a67146]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-serif text-lg font-semibold">{order.orderNumber}</p>
                  <p className="mt-1 text-sm text-[#6d4b32]">{order.customerName}</p>
                  <p className="text-sm text-[#8a6d56]">{order.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-[#f7efe3] px-2.5 py-1 text-[#6d4b32]">{formatListDate(order.createdAt)}</span>
                    <span className="rounded-full bg-[#f7efe3] px-2.5 py-1 text-[#6d4b32]">
                      {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                    </span>
                    <span className="rounded-full bg-[#f7efe3] px-2.5 py-1 text-[#6d4b32]">{formatListStatus(order.status)}</span>
                  </div>
                </div>
                <div className="flex min-w-[9.5rem] flex-col items-end gap-2 text-right">
                  <p className="text-lg font-semibold">{formatListMoney(order.totalCents, order.currency)}</p>
                  <p className="text-sm font-semibold text-[#6d4b32]">
                    <CountryFlag code={order.countryCode} name={order.countryName} />
                  </p>
                  <span
                    className={`inline-flex min-w-[7.5rem] items-center justify-center rounded-[0.5rem] px-3.5 py-2.5 text-base font-bold uppercase tracking-[0.14em] ${paymentBadgeClass(order.paymentStatus)}`}
                  >
                    {formatListStatus(order.paymentStatus)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
