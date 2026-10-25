import { NextRequest, NextResponse } from "next/server";
import { hasListAccess, listUnauthorizedResponse } from "@/lib/price-list-access";
import { previewTrackingEmail, sendTrackingEmail } from "@/lib/order-tracking-mail";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  if (!(await hasListAccess())) return listUnauthorizedResponse("order-tracking");
  const { orderNumber } = await params;
  const body = (await request.json().catch(() => null)) as { action?: string; trackingNumber?: string } | null;
  const action = body?.action === "send" ? "send" : "preview";
  try {
    const draft =
      action === "send"
        ? await sendTrackingEmail(decodeURIComponent(orderNumber), body?.trackingNumber || "")
        : await previewTrackingEmail(decodeURIComponent(orderNumber), body?.trackingNumber || "");
    return NextResponse.json({ ok: true, draft, sent: action === "send" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to prepare tracking email" },
      { status: 400 }
    );
  }
}
