import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { priceCart } from "@/lib/commerce/cart";
import { quoteDiscountCode } from "@/lib/commerce/discount";
import { notifyOrder } from "@/lib/email";
import { getCountry } from "@/data/countries";
import { getShippingQuote, needsShippingWeightReview } from "@/data/shipping";
import { FORM_STARTED_FIELD, HONEYPOT_FIELD, isBotSubmission } from "@/lib/form-guard";
import { siteOrigin } from "@/lib/site-origin";

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
  }),
  [HONEYPOT_FIELD]: z.string().optional(),
  [FORM_STARTED_FIELD]: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  if (isBotSubmission({ honeypot: parsed.data.website, startedAt: parsed.data.form_started })) {
    return NextResponse.json({ error: "Unable to start checkout" }, { status: 400 });
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
    if (needsShippingWeightReview(parsed.data.lines)) {
      return NextResponse.json(
        {
          error: "This order is estimated to be over 1 kg. Please contact us for the best shipping rate.",
          code: "SHIPPING_WEIGHT_REVIEW"
        },
        { status: 400 }
      );
    }

    const priced = await priceCart(parsed.data.lines);
    const discount = await quoteDiscountCode(parsed.data.discountCode, priced.subtotalCents, parsed.data.email);
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
    const itemKey = priced.items
      .map((item) => `${item.sku}:${item.quantity}`)
      .sort()
      .join("|");
    const recentUnpaid = await db.order.findFirst({
      where: {
        email: { equals: parsed.data.email, mode: "insensitive" },
        paymentStatus: "UNPAID",
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      },
      include: { items: true, shippingAddress: true },
      orderBy: { createdAt: "desc" }
    });
    const sameCart = Boolean(
      recentUnpaid &&
        recentUnpaid.items
          .map((item) => `${item.sku}:${item.quantity}`)
          .sort()
          .join("|") === itemKey
    );

    const orderNumber = sameCart && recentUnpaid ? recentUnpaid.orderNumber : `SA-${Date.now()}`;
    const order = sameCart && recentUnpaid
      ? await db.order.update({
          where: { id: recentUnpaid.id },
          data: {
            email: parsed.data.email,
            subtotalCents: priced.subtotalCents,
            discountCode: discount?.code,
            discountCents,
            shippingCents,
            totalCents,
            paymentProvider: "payhere",
            shippingAddress: recentUnpaid.shippingAddress
              ? {
                  update: shipping
                }
              : { create: shipping }
          }
        })
      : await db.order.create({
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

    if (!sameCart) {
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
        shipping
      });
    }

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      payhere: createPayHerePayload({
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
  const publicUrl = siteOrigin();
  const notifyUrl = publicUrl;
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
