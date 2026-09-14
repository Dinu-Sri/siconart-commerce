import { revalidatePath } from "next/cache";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminOrders } from "@/components/admin/admin-orders";

export default async function AdminOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale);
  const activeLocale = (await getLocale()) as Locale;
  const orders = await db.order.findMany({
    include: { items: true, shippingAddress: true, billingAddress: true, customer: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  async function deleteOrder(formData: FormData) {
    "use server";

    await requireAdmin(locale);
    const orderId = String(formData.get("orderId") || "");
    if (!orderId) return;
    await db.order.delete({ where: { id: orderId } });
    revalidatePath(`/${locale}/admin/orders`);
  }

  return (
    <AdminShell locale={activeLocale} title="Orders">
      <AdminOrders orders={orders} deleteOrder={deleteOrder} />
    </AdminShell>
  );
}
