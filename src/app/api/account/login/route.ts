import { NextRequest, NextResponse } from "next/server";
import { loginAccount } from "@/lib/customer-account";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string; lines?: unknown } | null;
  try {
    const result = await loginAccount({
      email: body?.email || "",
      password: body?.password || "",
      lines: body?.lines
    });
    return NextResponse.json({ ok: true, lines: result.lines });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to log in" }, { status: 400 });
  }
}
