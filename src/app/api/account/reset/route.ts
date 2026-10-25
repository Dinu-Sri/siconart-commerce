import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/lib/customer-account";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { token?: string; password?: string } | null;
  try {
    await resetPassword(body?.token || "", body?.password || "");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to reset password" },
      { status: 400 }
    );
  }
}
