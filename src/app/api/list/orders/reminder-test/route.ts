import { NextResponse } from "next/server";
import { hasListAccess, listUnauthorizedResponse } from "@/lib/price-list-access";
import { sendUnpaidReminderTest } from "@/lib/unpaid-recovery";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await hasListAccess())) {
    return listUnauthorizedResponse("unpaid-reminder-test");
  }
  try {
    const result = await sendUnpaidReminderTest();
    return NextResponse.json({ ok: true, subject: result.subject });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to send test email" },
      { status: 400 }
    );
  }
}
