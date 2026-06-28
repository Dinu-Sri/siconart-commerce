import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { priceCart } from "@/lib/commerce/cart";

const checkoutSchema = z.object({
  email: z.string().email(),
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

  const priced = priceCart(parsed.data.lines);
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
      totalCents: priced.subtotalCents,
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

  return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
}
