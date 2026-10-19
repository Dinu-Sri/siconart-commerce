import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { CountryFlag } from "@/components/storefront/country-flag";
import { getCountryByName } from "@/data/countries";
import { formatListDate, formatListMoney, formatListStatus, paymentBadgeClass } from "@/lib/list-order-format";
import { getListOrder } from "@/lib/list-orders";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ListOrderDetailPage({
  params
}: {
  params: Promise<{ locale: string; orderNumber: string }>;
}) {
  const { locale, orderNumber } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const order = await getListOrder(decodeURIComponent(orderNumber));

  if (!order) notFound();

  const customerName = order.customer?.name || order.shippingAddress?.name || "Not recorded";
  const phone = order.customer?.phone || order.shippingAddress?.phone || "Not recorded";
  const countryName = order.shippingAddress?.country || "";
  const countryCode = getCountryByName(countryName)?.code || "";

  return (
    <section className="mx-auto w-full max-w-6xl px-3 py-3 sm:px-5 sm:py-5">
      <div className="sticky top-[3.25rem] z-20 -mx-3 border-b border-[#ead9c3] bg-[#fef9ef] px-3 py-2 sm:-mx-5 sm:px-5 xl:top-0">
        <Link
          href={localeHref(activeLocale, "/list/orders")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[0.5rem] bg-[#a67146] px-4 py-3 text-base font-semibold text-white hover:bg-[#8b5d3a] sm:w-auto"
        >
          <ArrowLeft className="h-5 w-5" />
          All orders
        </Link>
      </div>
      <div className="mt-4 grid w-full gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0">
          <h1 className="break-all font-serif text-2xl font-semibold sm:text-3xl">{order.orderNumber}</h1>
          <p className="mt-1 text-sm font-semibold text-[#8a6d56]">Placed {formatListDate(order.createdAt)}</p>
          <p className="mt-2 text-sm font-semibold text-[#6d4b32]">
            <CountryFlag code={countryCode} name={countryName} />
          </p>
        </div>
        <div className="flex w-full items-center justify-between gap-3 border-t border-[#ead9c3] pt-3 sm:w-auto sm:flex-col sm:items-end sm:border-0 sm:pt-0">
          <p className="font-serif text-2xl font-semibold">{formatListMoney(order.totalCents, order.currency)}</p>
          <span
            className={`inline-flex shrink-0 items-center justify-center rounded-[0.5rem] px-3.5 py-2.5 text-sm font-bold uppercase tracking-[0.14em] sm:min-w-[7.5rem] sm:text-base ${paymentBadgeClass(order.paymentStatus)}`}
          >
            {formatListStatus(order.paymentStatus)}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <DetailCard title="Status">
          <Row label="Fulfilment" value={formatListStatus(order.status)} />
          <Row label="Payment" value={formatListStatus(order.paymentStatus)} />
          <Row label="Provider" value={order.paymentProvider || "Not recorded"} />
          <Row label="Reference" value={order.paymentRef || "Not recorded"} />
        </DetailCard>
        <DetailCard title="Customer">
          <Row label="Name" value={customerName} />
          <Row label="Email" value={order.email} />
          <Row label="Phone" value={phone} />
        </DetailCard>
        <DetailCard title="Shipping address">
          {order.shippingAddress ? <AddressBlock address={order.shippingAddress} /> : <p className="text-sm text-[#8a6d56]">Not recorded</p>}
        </DetailCard>
        <DetailCard title="Totals">
          <Row label="Subtotal" value={formatListMoney(order.subtotalCents, order.currency)} />
          <Row
            label="Discount"
            value={`${order.discountCents ? "-" : ""}${formatListMoney(order.discountCents, order.currency)}${order.discountCode ? ` (${order.discountCode})` : ""}`}
          />
          <Row label="Shipping" value={formatListMoney(order.shippingCents, order.currency)} />
          <Row label="Tax" value={formatListMoney(order.taxCents, order.currency)} />
          <Row label="Total" value={formatListMoney(order.totalCents, order.currency)} strong />
        </DetailCard>
      </div>

      <section className="mt-4 rounded-[0.5rem] border border-[#ead9c3] bg-white p-4">
        <h2 className="font-serif text-xl font-semibold">Items</h2>
        <div className="mt-3 grid gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="grid gap-1 border-t border-[#f0e3d3] pt-3 first:border-0 first:pt-0 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-[#8a6d56]">{item.sku}</p>
              </div>
              <p className="text-sm">
                {item.quantity} × {formatListMoney(item.unitCents, order.currency)}
              </p>
              <p className="font-semibold">{formatListMoney(item.totalCents, order.currency)}</p>
            </div>
          ))}
        </div>
      </section>

      {order.notes ? (
        <section className="mt-4 rounded-[0.5rem] border border-[#ead9c3] bg-white p-4">
          <h2 className="font-serif text-xl font-semibold">Notes</h2>
          <p className="mt-2 text-sm leading-6 text-[#6d4b32]">{order.notes}</p>
        </section>
      ) : null}
    </section>
  );
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[0.5rem] border border-[#ead9c3] bg-white p-4">
      <h2 className="font-serif text-xl font-semibold">{title}</h2>
      <div className="mt-3 grid gap-2">{children}</div>
    </section>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[#8a6d56]">{label}</span>
      <span className={strong ? "text-right font-semibold" : "text-right"}>{value}</span>
    </div>
  );
}

function AddressBlock({
  address
}: {
  address: {
    name: string;
    line1: string;
    line2: string | null;
    city: string;
    region: string | null;
    postalCode: string | null;
    country: string;
    phone: string | null;
  };
}) {
  const lines = [
    address.name,
    address.line1,
    address.line2,
    [address.city, address.region, address.postalCode].filter(Boolean).join(", "),
    address.country,
    address.phone
  ].filter(Boolean);

  return (
    <p className="text-sm leading-6 text-[#6d4b32]">
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}
