import { NextRequest, NextResponse } from "next/server";
import { hasListAccess, listUnauthorizedResponse } from "@/lib/price-list-access";
import { previewUnpaidReminder, sendUnpaidReminder } from "@/lib/unpaid-recovery";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  if (!(await hasListAccess())) {
    return listUnauthorizedResponse("unpaid-reminder");
  }
  const { orderNumber } = await params;
  const body = (await request.json().catch(() => null)) as { action?: string; code?: string } | null;
  const action = body?.action === "send" ? "send" : "preview";
  try {
    const draft =
      action === "send"
        ? await sendUnpaidReminder(decodeURIComponent(orderNumber), body?.code)
        : await previewUnpaidReminder(decodeURIComponent(orderNumber));
    return NextResponse.json({ ok: true, draft, sent: action === "send" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to prepare reminder" },
      { status: 400 }
    );
  }
}
