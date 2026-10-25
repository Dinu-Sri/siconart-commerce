import { NextRequest, NextResponse } from "next/server";
import { hasListAccess, listUnauthorizedResponse } from "@/lib/price-list-access";
import { markOrderDelivered } from "@/lib/order-feedback";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  if (!(await hasListAccess())) return listUnauthorizedResponse("order-deliver");
  const { orderNumber } = await params;
  const body = (await request.json().catch(() => null)) as { confirm?: boolean } | null;
  try {
    const draft = await markOrderDelivered(decodeURIComponent(orderNumber), body?.confirm === true);
    return NextResponse.json({ ok: true, draft });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not mark this order delivered." },
      { status: 400 }
    );
  }
}
