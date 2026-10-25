import { NextRequest, NextResponse } from "next/server";
import { sendAccountMessage } from "@/lib/customer-account";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { subject?: string; message?: string } | null;
  try {
    await sendAccountMessage({ subject: body?.subject || "", message: body?.message || "" });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to send message" },
      { status: 400 }
    );
  }
}
