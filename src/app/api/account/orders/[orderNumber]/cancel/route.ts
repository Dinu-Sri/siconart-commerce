import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readCustomerSession } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const session = await readCustomerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Please log in again." }, { status: 401 });

  const { orderNumber } = await params;
  const order = await db.order.findUnique({ where: { orderNumber: decodeURIComponent(orderNumber) } });
  if (!order || order.customerId !== session.id) {
    return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
  }
  if (order.paymentStatus === "PAID") {
    return NextResponse.json({ ok: false, error: "Paid orders cannot be cancelled here." }, { status: 400 });
  }
  if (order.status === "CANCELLED") return NextResponse.json({ ok: true });

  await db.order.update({
    where: { id: order.id },
    data: {
      status: "CANCELLED",
      notes: order.notes?.trim() ? order.notes : "Cancelled by the customer from their account."
    }
  });
  return NextResponse.json({ ok: true });
}
