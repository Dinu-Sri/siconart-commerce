import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { applyListAccessCookie, hasListAccess, listUnauthorizedResponse } from "@/lib/price-list-access";
import { applyPriceListUpdates, getPriceListOverrides, normalizePriceListUpdates } from "@/lib/price-list-overrides";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const syncId = request.headers.get("x-price-list-sync-id")?.trim() || `pls-${Date.now().toString(36)}`;
  if (!(await hasListAccess())) {
    return listUnauthorizedResponse(syncId);
  }

  try {
    const overrides = await getPriceListOverrides();
    return applyListAccessCookie(
      NextResponse.json(
        {
          ok: true,
          syncId,
          overrides,
          retail: Object.fromEntries(
            Object.entries(overrides)
              .filter((entry): entry is [string, { retail: number }] => typeof entry[1].retail === "number")
              .map(([sku, override]) => [sku, override.retail])
          )
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
        error: "Could not read saved list prices.",
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

  const parsed = await readUpdates(request);
  if (parsed.parseError) {
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

  const updates = normalizePriceListUpdates(parsed.items);
  try {
    const saved = await applyPriceListUpdates(updates);
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/products", "layout");
    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/list");
    console.info("[price-list] saved", {
      syncId,
      fields: saved.map((item) => `${item.sku}:${item.field}`)
    });
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database write failed.";
    console.error("[price-list] POST failed", { syncId, message, count: updates.length });
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
}

async function readUpdates(request: NextRequest): Promise<{ items: unknown[]; parseError: boolean }> {
  const raw = await request.text();
  if (!raw.trim()) return { items: [], parseError: false };

  try {
    const parsed = JSON.parse(raw) as { updates?: unknown[] };
    return { items: Array.isArray(parsed?.updates) ? parsed.updates : [], parseError: false };
  } catch {
    try {
      const params = new URLSearchParams(raw);
      const nested = params.get("updates");
      if (nested) {
        const parsed = JSON.parse(nested) as unknown[];
        return { items: Array.isArray(parsed) ? parsed : [], parseError: false };
      }
    } catch {
      return { items: [], parseError: true };
    }
    return { items: [], parseError: true };
  }
}
