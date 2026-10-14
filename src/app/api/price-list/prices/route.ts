import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { priceListProducts } from "@/data/price-list-products";
import { db } from "@/lib/db";
import { applyListAccessCookie, hasListAccess, listUnauthorizedResponse } from "@/lib/price-list-access";

export const dynamic = "force-dynamic";

type PriceUpdate = {
  retailCents?: number;
  sku?: string;
};

export async function GET(request: NextRequest) {
  const syncId = request.headers.get("x-price-list-sync-id")?.trim() || `pls-${Date.now().toString(36)}`;
  if (!(await hasListAccess())) {
    return listUnauthorizedResponse(syncId);
  }

  try {
    const rows = await db.priceOverride.findMany();
    return applyListAccessCookie(
      NextResponse.json(
        {
          ok: true,
          syncId,
          retail: Object.fromEntries(rows.map((row) => [row.sku, row.priceCents]))
        },
        { headers: { "Cache-Control": "no-store" } }
      )
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database read failed.";
    console.error("[price-list] GET failed", { syncId, message });
    return NextResponse.json(
      {
        ok: false,
        error: "Could not read saved shop prices.",
        code: "DB_ERROR",
        hint: message,
        syncId
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const syncId = request.headers.get("x-price-list-sync-id")?.trim() || `pls-${Date.now().toString(36)}`;
  if (!(await hasListAccess())) {
    return listUnauthorizedResponse(syncId);
  }

  const updates = await readUpdates(request);
  if (updates.parseError) {
    return NextResponse.json(
      {
        ok: false,
        error: "The save payload could not be read.",
        code: "BAD_JSON",
        hint: "Retry save. If it keeps failing, screenshot this and send it.",
        syncId
      },
      { status: 400 }
    );
  }

  const catalogBySku = new Map(priceListProducts.map((product) => [product.sku, product.retailCents]));
  const saved: { sku: string; priceCents: number }[] = [];

  try {
    for (const update of updates.items) {
      const sku = String(update.sku || "").trim();
      if (!sku || !Number.isFinite(update.retailCents)) continue;

      const retailCents = Math.max(0, Math.round(Number(update.retailCents)));
      const catalogCents = catalogBySku.get(sku);

      if (catalogCents !== undefined && retailCents === catalogCents) {
        await db.priceOverride.deleteMany({ where: { sku } });
        saved.push({ sku, priceCents: retailCents });
        continue;
      }

      await db.priceOverride.upsert({
        where: { sku },
        create: { sku, priceCents: retailCents },
        update: { priceCents: retailCents }
      });
      saved.push({ sku, priceCents: retailCents });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database write failed.";
    console.error("[price-list] POST failed", { syncId, message, count: updates.items.length });
    return NextResponse.json(
      {
        ok: false,
        error: "The shop database rejected the save.",
        code: "DB_ERROR",
        hint: message,
        syncId
      },
      { status: 500 }
    );
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/products", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/list");

  console.info("[price-list] saved", { syncId, skus: saved.map((item) => item.sku) });

  return applyListAccessCookie(
    NextResponse.json(
      {
        ok: true,
        syncId,
        saved
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  );
}

async function readUpdates(request: NextRequest): Promise<{ items: PriceUpdate[]; parseError: boolean }> {
  const raw = await request.text();
  if (!raw.trim()) return { items: [], parseError: false };

  try {
    const parsed = JSON.parse(raw) as { updates?: PriceUpdate[] };
    return { items: Array.isArray(parsed?.updates) ? parsed.updates : [], parseError: false };
  } catch {
    try {
      const params = new URLSearchParams(raw);
      const nested = params.get("updates");
      if (nested) {
        const parsed = JSON.parse(nested) as PriceUpdate[];
        return { items: Array.isArray(parsed) ? parsed : [], parseError: false };
      }
    } catch {
      return { items: [], parseError: true };
    }
    return { items: [], parseError: true };
  }
}
