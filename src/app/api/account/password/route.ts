import { NextRequest, NextResponse } from "next/server";
import { changePassword } from "@/lib/customer-account";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { currentPassword?: string; nextPassword?: string } | null;
  try {
    await changePassword(body?.currentPassword || "", body?.nextPassword || "");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to change password" },
      { status: 400 }
    );
  }
}
