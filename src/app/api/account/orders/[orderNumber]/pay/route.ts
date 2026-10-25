import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readCustomerSession } from "@/lib/customer-auth";
import { createPayHerePayload } from "@/lib/payhere-checkout";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const session = await readCustomerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Please log in again." }, { status: 401 });

  const { orderNumber } = await params;
  const order = await db.order.findUnique({
    where: { orderNumber: decodeURIComponent(orderNumber) },
    include: { shippingAddress: true, items: true, customer: true }
  });
  if (!order || order.customerId !== session.id) {
    return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
  }
  if (order.status === "CANCELLED") {
    return NextResponse.json({ ok: false, error: "This order is cancelled." }, { status: 400 });
  }
  if (order.paymentStatus === "PAID") {
    return NextResponse.json({ ok: false, error: "This order is already paid." }, { status: 400 });
  }
  const shipping = order.shippingAddress;
  if (!shipping?.line1 || !shipping.city || !shipping.country) {
    return NextResponse.json({ ok: false, error: "This order has no shipping address to pay against." }, { status: 400 });
  }

  const name = (shipping.name || order.customer?.name || "Customer").trim();
  const parts = name.split(/\s+/).filter(Boolean);
  const firstName = parts[0] || "Customer";
  const lastName = parts.slice(1).join(" ") || firstName;

  try {
    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      payhere: createPayHerePayload({
        orderNumber: order.orderNumber,
        amountCents: order.totalCents,
        firstName,
        lastName,
        email: order.email,
        shipping: {
          name: shipping.name,
          line1: shipping.line1,
          line2: shipping.line2 || undefined,
          city: shipping.city,
          region: shipping.region || undefined,
          postalCode: shipping.postalCode || undefined,
          country: shipping.country,
          phone: shipping.phone || order.customer?.phone || ""
        },
        items: `Sicon Art brushes - ${order.items.length} item${order.items.length === 1 ? "" : "s"}`,
        cancelPath: `/account?payment=cancelled&order=${encodeURIComponent(order.orderNumber)}`
      })
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to open payment" },
      { status: 400 }
    );
  }
}
