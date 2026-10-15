import { db } from "@/lib/db";

export { formatListDate, formatListMoney, formatListStatus } from "@/lib/list-order-format";

const orderInclude = {
  items: true,
  shippingAddress: true,
  billingAddress: true,
  customer: true
} as const;

export async function getListOrders() {
  try {
    return await db.order.findMany({
      include: orderInclude,
      orderBy: { createdAt: "desc" },
      take: 200
    });
  } catch {
    return [];
  }
}

export async function getListOrder(orderNumber: string) {
  try {
    return await db.order.findUnique({
      where: { orderNumber },
      include: orderInclude
    });
  } catch {
    return null;
  }
}
