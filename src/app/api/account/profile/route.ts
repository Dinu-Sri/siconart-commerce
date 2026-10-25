import { NextRequest, NextResponse } from "next/server";
import { updateProfile } from "@/lib/customer-account";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { name?: string; phone?: string } | null;
  try {
    await updateProfile({ name: body?.name || "", phone: body?.phone || "" });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to save profile" },
      { status: 400 }
    );
  }
}
