import { NextRequest, NextResponse } from "next/server";
import { hasListAccess, listUnauthorizedResponse } from "@/lib/price-list-access";
import { sendUnpaidReminderTest } from "@/lib/unpaid-recovery";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!(await hasListAccess())) {
    return listUnauthorizedResponse("unpaid-reminder-test");
  }
  const body = (await request.json().catch(() => null)) as { to?: string } | null;
  try {
    const result = await sendUnpaidReminderTest(body?.to || "");
    return NextResponse.json({ ok: true, subject: result.subject, to: result.to });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to send test email" },
      { status: 400 }
    );
  }
}
