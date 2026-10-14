import { priceListProducts, type PriceListProduct } from "@/data/price-list-products";
import { db } from "@/lib/db";
import {
  isPriceListValueField,
  type PriceListFieldUpdate,
  type PriceListOverride,
  type PriceListValueField
} from "@/lib/price-list-fields";

type OverrideRow = {
  sku: string;
  priceCents: number;
  artistCents: number | null;
  miniWholesaleCents: number | null;
  miniWholesaleMoq: number | null;
  bulkWholesaleCents: number | null;
  bulkWholesaleMoq: number | null;
};

const catalogBySku = new Map(priceListProducts.map((product) => [product.sku, product]));

export async function getPriceListOverrides(): Promise<Record<string, PriceListOverride>> {
  try {
    const rows = await db.priceOverride.findMany();
    return Object.fromEntries(rows.map((row) => [row.sku, rowToOverride(row)]));
  } catch {
    return {};
  }
}

export async function getMarketPriceOverrides(): Promise<Record<string, number>> {
  const overrides = await getPriceListOverrides();
  return Object.fromEntries(
    Object.entries(overrides)
      .filter((entry): entry is [string, PriceListOverride & { retail: number }] => typeof entry[1].retail === "number")
      .map(([sku, override]) => [sku, override.retail])
  );
}

export function normalizePriceListUpdates(items: unknown[]): PriceListFieldUpdate[] {
  const updates: PriceListFieldUpdate[] = [];
  for (const item of items) {
    const normalized = normalizePriceListUpdate(item);
    if (normalized) updates.push(normalized);
  }
  return updates;
}

export async function applyPriceListUpdates(updates: PriceListFieldUpdate[]) {
  const saved: PriceListFieldUpdate[] = [];

  await db.$transaction(async (tx) => {
    for (const update of updates) {
      const catalog = catalogBySku.get(update.sku);
      const existing = await tx.priceOverride.findUnique({ where: { sku: update.sku } });
      const next = mergeRow(catalog, existing, update);

      if (isCatalogRow(catalog, next)) {
        await tx.priceOverride.deleteMany({ where: { sku: update.sku } });
        saved.push(update);
        continue;
      }

      await tx.priceOverride.upsert({
        where: { sku: update.sku },
        create: next,
        update: {
          priceCents: next.priceCents,
          artistCents: next.artistCents,
          miniWholesaleCents: next.miniWholesaleCents,
          miniWholesaleMoq: next.miniWholesaleMoq,
          bulkWholesaleCents: next.bulkWholesaleCents,
          bulkWholesaleMoq: next.bulkWholesaleMoq
        }
      });
      saved.push(update);
    }
  });

  return saved;
}

function normalizePriceListUpdate(item: unknown): PriceListFieldUpdate | null {
  if (!item || typeof item !== "object") return null;
  const record = item as {
    field?: string;
    retailCents?: number;
    sku?: string;
    value?: number;
  };
  const sku = String(record.sku || "").trim();
  if (!sku) return null;

  if (record.field && isPriceListValueField(record.field) && Number.isFinite(Number(record.value))) {
    return { sku, field: record.field, value: clampValue(Number(record.value)) };
  }
  if (Number.isFinite(Number(record.retailCents))) {
    return { sku, field: "retail", value: clampValue(Number(record.retailCents)) };
  }
  return null;
}

function rowToOverride(row: OverrideRow): PriceListOverride {
  const override: PriceListOverride = { retail: row.priceCents };
  if (row.artistCents != null) override.artist = row.artistCents;
  if (row.miniWholesaleCents != null) override.miniWholesale = row.miniWholesaleCents;
  if (row.miniWholesaleMoq != null) override.miniWholesaleMoq = row.miniWholesaleMoq;
  if (row.bulkWholesaleCents != null) override.bulkWholesale = row.bulkWholesaleCents;
  if (row.bulkWholesaleMoq != null) override.bulkWholesaleMoq = row.bulkWholesaleMoq;
  return override;
}

function mergeRow(catalog: PriceListProduct | undefined, existing: OverrideRow | null, update: PriceListFieldUpdate) {
  const next: OverrideRow = {
    sku: update.sku,
    priceCents: existing?.priceCents ?? catalog?.retailCents ?? 0,
    artistCents: existing?.artistCents ?? null,
    miniWholesaleCents: existing?.miniWholesaleCents ?? null,
    miniWholesaleMoq: existing?.miniWholesaleMoq ?? null,
    bulkWholesaleCents: existing?.bulkWholesaleCents ?? null,
    bulkWholesaleMoq: existing?.bulkWholesaleMoq ?? null
  };

  const catalogValue = catalogValueFor(catalog, update.field);
  const stored = update.field !== "retail" && catalogValue != null && update.value === catalogValue ? null : update.value;

  switch (update.field) {
    case "retail":
      next.priceCents = update.value;
      break;
    case "artist":
      next.artistCents = stored;
      break;
    case "miniWholesale":
      next.miniWholesaleCents = stored;
      break;
    case "miniWholesaleMoq":
      next.miniWholesaleMoq = stored;
      break;
    case "bulkWholesale":
      next.bulkWholesaleCents = stored;
      break;
    case "bulkWholesaleMoq":
      next.bulkWholesaleMoq = stored;
      break;
  }

  return next;
}

function isCatalogRow(catalog: PriceListProduct | undefined, row: OverrideRow) {
  if (!catalog) return false;
  return (
    row.priceCents === catalog.retailCents &&
    matchesCatalog(row.artistCents, catalog.artistCents) &&
    matchesCatalog(row.miniWholesaleCents, catalog.miniWholesaleCents) &&
    matchesCatalog(row.miniWholesaleMoq, catalog.miniWholesaleMoq) &&
    matchesCatalog(row.bulkWholesaleCents, catalog.bulkWholesaleCents) &&
    matchesCatalog(row.bulkWholesaleMoq, catalog.bulkWholesaleMoq)
  );
}

function matchesCatalog(stored: number | null, catalogValue: number) {
  return stored == null || stored === catalogValue;
}

function catalogValueFor(catalog: PriceListProduct | undefined, field: PriceListValueField) {
  if (!catalog) return null;
  const values: Record<PriceListValueField, number> = {
    retail: catalog.retailCents,
    artist: catalog.artistCents,
    miniWholesale: catalog.miniWholesaleCents,
    miniWholesaleMoq: catalog.miniWholesaleMoq,
    bulkWholesale: catalog.bulkWholesaleCents,
    bulkWholesaleMoq: catalog.bulkWholesaleMoq
  };
  return values[field];
}

function clampValue(value: number) {
  return Math.max(0, Math.round(value));
}
