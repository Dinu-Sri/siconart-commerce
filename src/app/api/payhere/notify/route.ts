import crypto from "node:crypto";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const formData = await request.formData();
  const merchantId = String(formData.get("merchant_id") || "");
  const orderId = String(formData.get("order_id") || "");
  const paymentId = String(formData.get("payment_id") || "");
  const amount = String(formData.get("payhere_amount") || "");
  const currency = String(formData.get("payhere_currency") || "");
  const statusCode = String(formData.get("status_code") || "");
  const md5sig = String(formData.get("md5sig") || "");
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET?.trim() || "";

  const localSig = md5(
    `${merchantId}${orderId}${amount}${currency}${statusCode}${md5(merchantSecret).toUpperCase()}`
  ).toUpperCase();

  if (!merchantSecret || localSig !== md5sig.toUpperCase()) {
    return NextResponse.json({ error: "Invalid PayHere signature" }, { status: 400 });
  }

  await db.order.update({
    where: { orderNumber: orderId },
    data:
      statusCode === "2"
        ? { status: OrderStatus.PAID, paymentStatus: PaymentStatus.PAID, paymentRef: paymentId }
        : { paymentStatus: PaymentStatus.FAILED, paymentRef: paymentId }
  });

  return NextResponse.json({ ok: true });
}

function md5(value: string) {
  return crypto.createHash("md5").update(value).digest("hex");
}
