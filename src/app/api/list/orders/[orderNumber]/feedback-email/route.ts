import { NextResponse } from "next/server";
import { hasListAccess, listUnauthorizedResponse } from "@/lib/price-list-access";
import { sendFeedbackRequestEmail } from "@/lib/order-feedback";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  if (!(await hasListAccess())) return listUnauthorizedResponse("order-feedback-email");
  const { orderNumber } = await params;
  try {
    const draft = await sendFeedbackRequestEmail(decodeURIComponent(orderNumber));
    return NextResponse.json({ ok: true, draft });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not send the feedback email." },
      { status: 400 }
    );
  }
}
