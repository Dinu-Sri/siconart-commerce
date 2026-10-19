import { NextResponse } from "next/server";
import { z } from "zod";
import { priceCart } from "@/lib/commerce/cart";
import { quoteDiscountCode } from "@/lib/commerce/discount";

const cartSchema = z.object({
  discountCode: z.string().trim().optional(),
  email: z.string().trim().optional(),
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
    const priced = await priceCart(parsed.data.lines);
    const discount = await quoteDiscountCode(parsed.data.discountCode, priced.subtotalCents, parsed.data.email);
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
