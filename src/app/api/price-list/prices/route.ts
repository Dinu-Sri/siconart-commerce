import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { priceListProducts } from "@/data/price-list-products";
import { db } from "@/lib/db";

const ACCESS_COOKIE = "siconart_list_access";

export const dynamic = "force-dynamic";

type PriceUpdate = {
  retailCents?: number;
  sku?: string;
};

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get(ACCESS_COOKIE)?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db.priceOverride.findMany();
  return NextResponse.json({
    retail: Object.fromEntries(rows.map((row) => [row.sku, row.priceCents]))
  });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get(ACCESS_COOKIE)?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { updates?: PriceUpdate[] } | null;
  const updates = Array.isArray(body?.updates) ? body.updates : [];
  const catalogBySku = new Map(priceListProducts.map((product) => [product.sku, product.retailCents]));

  for (const update of updates) {
    const sku = String(update.sku || "").trim();
    if (!sku || !Number.isFinite(update.retailCents)) continue;

    const retailCents = Math.max(0, Math.round(Number(update.retailCents)));
    const catalogCents = catalogBySku.get(sku);

    if (catalogCents !== undefined && retailCents === catalogCents) {
      await db.priceOverride.deleteMany({ where: { sku } });
      continue;
    }

    await db.priceOverride.upsert({
      where: { sku },
      create: { sku, priceCents: retailCents },
      update: { priceCents: retailCents }
    });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/products", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");

  return NextResponse.json({ ok: true });
}
