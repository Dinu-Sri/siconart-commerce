import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { priceCart } from "@/lib/commerce/cart";

const checkoutSchema = z.object({
  discountCode: z.string().trim().optional(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  lines: z.array(z.object({ sku: z.string().min(1), quantity: z.number().int().positive() })),
  shipping: z.object({
    name: z.string().min(2),
    line1: z.string().min(2),
    line2: z.string().optional(),
    city: z.string().min(2),
    region: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().min(2),
    phone: z.string().optional()
  })
});

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  try {
    const priced = priceCart(parsed.data.lines);
    const discount = await getDiscount(parsed.data.discountCode, priced.subtotalCents);
    const discountCents = discount?.discountCents ?? 0;
    const totalCents = Math.max(0, priced.subtotalCents - discountCents);

    if (totalCents < 10000) {
      return NextResponse.json({ error: "Minimum order amount is $100" }, { status: 400 });
    }

    const skus = priced.items.map((item) => item.sku);
    const productRows = await db.product.findMany({
      where: {
        OR: [{ sku: { in: skus } }, { variants: { some: { sku: { in: skus } } } }]
      },
      include: { variants: true }
    });

    const orderNumber = `SA-${Date.now()}`;
    const order = await db.order.create({
      data: {
        orderNumber,
        email: parsed.data.email,
        subtotalCents: priced.subtotalCents,
        discountCode: discount?.code,
        discountCents,
        totalCents,
        paymentProvider: "payhere",
        shippingAddress: {
          create: parsed.data.shipping
        },
        items: {
          create: priced.items.map((item) => {
            const product =
              productRows.find((row) => row.sku === item.sku) ??
              productRows.find((row) => row.variants.some((variant) => variant.sku === item.sku));
            const variant = product?.variants.find((row) => row.sku === item.sku);
            if (!product) throw new Error(`Unknown SKU: ${item.sku}`);

            return {
              productId: product.id,
              variantId: variant?.id,
              sku: item.sku,
              name: item.name,
              quantity: item.quantity,
              unitCents: item.priceCents,
              totalCents: item.lineTotalCents
            };
          })
        }
      }
    });

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      payhere: createPayHerePayload({
        orderNumber: order.orderNumber,
        amountCents: totalCents,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        shipping: parsed.data.shipping,
        items: `Sicon Art brushes - ${priced.items.length} item${priced.items.length === 1 ? "" : "s"}`
      })
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start checkout" },
      { status: 400 }
    );
  }
}

async function getDiscount(code: string | undefined, subtotalCents: number) {
  const normalizedCode = code?.trim().toUpperCase();
  if (!normalizedCode) return null;

  const discount = await db.discountCode.findUnique({ where: { code: normalizedCode } });
  const now = new Date();

  if (!discount || !discount.active) throw new Error("Discount code is not active");
  if (discount.startsAt && discount.startsAt > now) throw new Error("Discount code is not active yet");
  if (discount.endsAt && discount.endsAt < now) throw new Error("Discount code has expired");
  if (discount.usageLimit !== null && discount.usedCount >= discount.usageLimit) {
    throw new Error("Discount code usage limit reached");
  }
  if (subtotalCents < discount.minSubtotalCents) {
    throw new Error(`Discount requires a minimum order of $${(discount.minSubtotalCents / 100).toFixed(0)}`);
  }

  const discountCents =
    discount.type === "percent"
      ? Math.floor((subtotalCents * discount.value) / 100)
      : Math.min(subtotalCents, discount.value);

  return { code: discount.code, discountCents };
}

function createPayHerePayload({
  orderNumber,
  amountCents,
  firstName,
  lastName,
  email,
  shipping,
  items
}: {
  orderNumber: string;
  amountCents: number;
  firstName: string;
  lastName: string;
  email: string;
  shipping: z.infer<typeof checkoutSchema>["shipping"];
  items: string;
}) {
  const merchantId = requiredEnv("PAYHERE_MERCHANT_ID");
  const merchantSecret = requiredEnv("PAYHERE_MERCHANT_SECRET");
  const baseUrl = (process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://siconart.com").replace(/\/$/, "");
  const currency = process.env.PAYHERE_CURRENCY || "USD";
  const amount = (amountCents / 100).toFixed(2);
  const action =
    process.env.PAYHERE_SANDBOX === "true"
      ? "https://sandbox.payhere.lk/pay/checkout"
      : "https://www.payhere.lk/pay/checkout";

  return {
    action,
    fields: {
      merchant_id: merchantId,
      return_url: `${baseUrl}/checkout/thank-you?order=${encodeURIComponent(orderNumber)}`,
      cancel_url: `${baseUrl}/checkout?cancelled=1`,
      notify_url: `${baseUrl}/api/payhere/notify`,
      order_id: orderNumber,
      items,
      currency,
      amount,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: shipping.phone || "",
      address: [shipping.line1, shipping.line2].filter(Boolean).join(", "),
      city: shipping.city,
      country: shipping.country,
      hash: payHereCheckoutHash(merchantId, orderNumber, amount, currency, merchantSecret)
    }
  };
}

function payHereCheckoutHash(merchantId: string, orderId: string, amount: string, currency: string, merchantSecret: string) {
  return md5(`${merchantId}${orderId}${amount}${currency}${md5(merchantSecret).toUpperCase()}`).toUpperCase();
}

function md5(value: string) {
  return crypto.createHash("md5").update(value).digest("hex");
}

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}
