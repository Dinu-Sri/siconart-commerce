import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { priceCart } from "@/lib/commerce/cart";
import { notifyOrder } from "@/lib/email";
import { getCountry } from "@/data/countries";
import { getShippingQuote } from "@/data/shipping";

const checkoutSchema = z.object({
  discountCode: z.string().trim().optional(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  countryCode: z.string().length(2),
  lines: z.array(z.object({ sku: z.string().min(1), quantity: z.number().int().positive() })),
  shipping: z.object({
    name: z.string().min(2),
    line1: z.string().min(2),
    line2: z.string().optional(),
    city: z.string().min(2),
    region: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().min(2),
    phone: z.string().regex(/^\+\d{8,15}$/)
  })
});

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  try {
    const country = getCountry(parsed.data.countryCode);
    const shippingQuote = getShippingQuote(parsed.data.countryCode);
    if (!country || !shippingQuote) {
      return NextResponse.json({ error: "Please select a valid country" }, { status: 400 });
    }
    if (!shippingQuote.available) {
      return NextResponse.json(
        {
          error: "Shipping for this country is not calculated automatically. Please contact us on WhatsApp.",
          code: "SHIPPING_UNAVAILABLE"
        },
        { status: 400 }
      );
    }

    const priced = priceCart(parsed.data.lines);
    const discount = await getDiscount(parsed.data.discountCode, priced.subtotalCents);
    const discountCents = discount?.discountCents ?? 0;
    const shippingCents = shippingQuote.cents;
    const totalCents = Math.max(0, priced.subtotalCents - discountCents + shippingCents);

    const skus = priced.items.map((item) => item.sku);
    const productRows = await db.product.findMany({
      where: {
        OR: [{ sku: { in: skus } }, { variants: { some: { sku: { in: skus } } } }]
      },
      include: { variants: true }
    });

    const shipping = { ...parsed.data.shipping, country: country.name };
    const orderNumber = `SA-${Date.now()}`;
    const order = await db.order.create({
      data: {
        orderNumber,
        email: parsed.data.email,
        subtotalCents: priced.subtotalCents,
        discountCode: discount?.code,
        discountCents,
        shippingCents,
        totalCents,
        paymentProvider: "payhere",
        shippingAddress: {
          create: shipping
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

    await notifyOrder({
      title: "New order placed",
      subject: `New Sicon Art order ${order.orderNumber} (pending payment)`,
      orderNumber: order.orderNumber,
      email: parsed.data.email,
      status: "Pending payment",
      totalCents,
      shippingCents,
      discountCode: discount?.code,
      items: priced.items.map((item) => ({
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        totalCents: item.lineTotalCents
      })),
      shipping,
    });

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      payhere: createPayHerePayload({
        request,
        orderNumber: order.orderNumber,
        amountCents: totalCents,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        shipping,
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
  request,
  orderNumber,
  amountCents,
  firstName,
  lastName,
  email,
  shipping,
  items
}: {
  request: Request;
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
  const publicUrl = customerFacingBaseUrl(request);
  const notifyUrl = (process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL || publicUrl).replace(/\/$/, "");
  const currency = process.env.PAYHERE_CURRENCY || "USD";
  const amount = (amountCents / 100).toFixed(2);
  const sandbox = process.env.PAYHERE_SANDBOX === "true";
  const action = sandbox ? "https://sandbox.payhere.lk/pay/checkout" : "https://www.payhere.lk/pay/checkout";

  return {
    sandbox,
    action,
    fields: {
      merchant_id: merchantId,
      return_url: `${publicUrl}/checkout/thank-you?order=${encodeURIComponent(orderNumber)}`,
      cancel_url: `${publicUrl}/checkout?cancelled=1`,
      notify_url: `${notifyUrl}/api/payhere/notify`,
      order_id: orderNumber,
      items,
      currency,
      amount,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: shipping.phone,
      address: [shipping.line1, shipping.line2].filter(Boolean).join(", "),
      city: shipping.city,
      country: shipping.country,
      delivery_address: [shipping.line1, shipping.line2].filter(Boolean).join(", "),
      delivery_city: shipping.city,
      delivery_country: shipping.country,
      hash: payHereCheckoutHash(merchantId, orderNumber, amount, currency, merchantSecret)
    }
  };
}

function customerFacingBaseUrl(request: Request) {
  const origin = request.headers.get("origin") || request.headers.get("referer") || "";
  try {
    const url = new URL(origin);
    if (url.hostname && !isIpHostname(url.hostname)) return url.origin;
  } catch {
    // fall through to configured storefront URL
  }
  const storefront = process.env.STOREFRONT_URL?.trim() || process.env.NEXT_PUBLIC_STOREFRONT_URL?.trim();
  if (storefront) return storefront.replace(/\/$/, "");
  return "https://siconart.com";
}

function isIpHostname(hostname: string) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
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
