import { NextRequest, NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/customer-account";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  try {
    await requestPasswordReset(body?.email || "");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to send reset email" },
      { status: 400 }
    );
  }
}
