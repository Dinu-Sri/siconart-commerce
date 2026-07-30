import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { priceListProducts } from "@/data/price-list-products";
import {
  generatePriceCatalogPdf,
  getPriceCatalogFilename,
  type PriceCatalogKind,
  type PriceCatalogValues
} from "@/lib/price-list/catalog-pdf";

const ACCESS_COOKIE = "siconart_list_access";
const allowedKinds = new Set<PriceCatalogKind>(["artist", "mini", "bulk"]);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get(ACCESS_COOKIE)?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    kind?: string;
    values?: PriceCatalogValues;
  } | null;
  const kind = body?.kind;

  if (!kind || !allowedKinds.has(kind as PriceCatalogKind)) {
    return NextResponse.json({ error: "Invalid catalog type" }, { status: 400 });
  }

  const catalogKind = kind as PriceCatalogKind;
  const pdf = await generatePriceCatalogPdf({
    kind: catalogKind,
    products: priceListProducts,
    values: body?.values
  });

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${getPriceCatalogFilename(catalogKind)}"`,
      "Content-Type": "application/pdf"
    }
  });
}
