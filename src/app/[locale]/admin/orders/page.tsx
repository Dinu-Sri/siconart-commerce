import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/data/products";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale);
  const activeLocale = (await getLocale()) as Locale;
  const orders = await db.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <AdminShell locale={activeLocale} title="Orders">
      <div className="overflow-hidden rounded-[0.5rem] border bg-surface">
        {orders.length === 0 && <p className="p-5 text-muted-foreground">No orders yet.</p>}
        {orders.map((order) => (
          <div key={order.id} className="grid gap-4 border-b p-5 last:border-0 lg:grid-cols-[1fr_1fr_1fr_1fr]">
            <div>
              <p className="font-semibold">{order.orderNumber}</p>
              <p className="text-sm text-muted-foreground">{order.email}</p>
            </div>
            <div className="text-sm">
              <p>{order.status}</p>
              <p className="text-muted-foreground">{order.paymentStatus}</p>
            </div>
            <p className="font-semibold">{formatPrice(order.totalCents, order.currency)}</p>
            <p className="text-sm text-muted-foreground">{order.items.length} items</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
