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

const CLOSED_NOTE = "Closed without answering";

export async function getCheckoutNotes(orderNumbers: string[]) {
  const notes = new Map<string, string>();
  if (!orderNumbers.length) return notes;
  try {
    const rows = await db.checkoutFeedback.findMany({
      where: { orderNumber: { in: orderNumbers } },
      orderBy: { createdAt: "desc" }
    });
    const grouped = new Map<string, Array<{ reason: string; detail: string | null }>>();
    for (const row of rows) {
      if (!row.orderNumber) continue;
      const list = grouped.get(row.orderNumber) || [];
      list.push({ reason: row.reason, detail: row.detail });
      grouped.set(row.orderNumber, list);
    }
    for (const [orderNumber, list] of grouped) notes.set(orderNumber, describeCheckoutFeedback(list));
  } catch {
    return notes;
  }
  return notes;
}

function describeCheckoutFeedback(rows: Array<{ reason: string; detail: string | null }>) {
  const latest = rows[0];
  const answered = rows.find((row) => row.reason !== CLOSED_NOTE);
  if (!latest) return "No answer recorded";
  if (latest.reason === CLOSED_NOTE) {
    return answered ? `${formatFeedback(answered)}. Later closed without answering.` : CLOSED_NOTE;
  }
  return formatFeedback(latest);
}

function formatFeedback(row: { reason: string; detail: string | null }) {
  return row.detail ? `${row.reason}: ${row.detail}` : row.reason;
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
