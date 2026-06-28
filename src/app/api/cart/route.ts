import { NextResponse } from "next/server";
import { z } from "zod";
import { priceCart } from "@/lib/commerce/cart";

const cartSchema = z.object({
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
    return NextResponse.json(priceCart(parsed.data.lines));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to price cart" },
      { status: 400 }
    );
  }
}
