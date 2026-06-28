import { NextResponse } from "next/server";
import { z } from "zod";
import { priceCart } from "@/lib/commerce/cart";
import { db } from "@/lib/db";

const cartSchema = z.object({
  discountCode: z.string().trim().optional(),
  lines: z.array(
    z.object({
      sku: z.string().min(1),
      quantity: z.number().int().positive()
    })
  )
});

export async function POST(request: Request) {
  const parsed = cartSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart payload" }, { status: 400 });
  }

  try {
    const priced = priceCart(parsed.data.lines);
    const discount = await getDiscount(parsed.data.discountCode, priced.subtotalCents);
    return NextResponse.json({
      ...priced,
      discountCode: discount?.code ?? null,
      discountCents: discount?.discountCents ?? 0,
      totalCents: Math.max(0, priced.subtotalCents - (discount?.discountCents ?? 0))
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to price cart" },
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
