import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RECOVERY_KIND } from "@/lib/unpaid-recovery-state";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("order")?.trim() || "";
  const code = request.nextUrl.searchParams.get("code")?.trim().toUpperCase() || "";
  if (!orderNumber || !code) {
    return NextResponse.json({ error: "Missing order or code" }, { status: 400 });
  }

  const discount = await db.discountCode.findUnique({ where: { code } });
  if (!discount || discount.kind !== RECOVERY_KIND || !discount.active) {
    return NextResponse.json({ error: "Code not found" }, { status: 404 });
  }

  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true }
  });
  if (!order || order.paymentStatus === "PAID") {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const emailMatch = discount.allowedEmail?.trim().toLowerCase() === order.email.trim().toLowerCase();
  const orderMatch = discount.sourceOrderId === order.id || order.recoveryCode === code;
  if (!emailMatch && !orderMatch) {
    return NextResponse.json({ error: "Code not found" }, { status: 404 });
  }

  return NextResponse.json({
    email: order.email,
    lines: order.items.map((item) => ({ sku: item.sku, quantity: item.quantity }))
  });
}
