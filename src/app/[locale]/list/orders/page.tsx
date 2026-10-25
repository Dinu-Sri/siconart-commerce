import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCountryByName } from "@/data/countries";
import { getListOrders } from "@/lib/list-orders";
import { ListOrdersView } from "@/components/storefront/list-orders-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ListOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const orders = await getListOrders();

  return (
    <ListOrdersView
      locale={activeLocale}
      orders={orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        email: order.email,
        status: order.status,
        paymentStatus: order.paymentStatus,
        currency: order.currency,
        totalCents: order.totalCents,
        subtotalCents: order.subtotalCents,
        createdAt: order.createdAt.toISOString(),
        itemCount: order.items.length,
        customerName: order.customer?.name || order.shippingAddress?.name || "Customer",
        countryName: order.shippingAddress?.country || "",
        countryCode: getCountryByName(order.shippingAddress?.country || "")?.code || "",
        recoverySentAt: order.recoverySentAt?.toISOString() ?? null,
        recoveryCode: order.recoveryCode,
        guestCheckout: order.guestCheckout,
        trackingNumber: order.trackingNumber,
        trackingSentAt: order.trackingSentAt?.toISOString() ?? null
      }))}
    />
  );
}
