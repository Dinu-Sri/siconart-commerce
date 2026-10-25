import { NextRequest, NextResponse } from "next/server";
import { signupAccount } from "@/lib/customer-account";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string; name?: string; lines?: unknown }
    | null;
  try {
    const result = await signupAccount({
      email: body?.email || "",
      password: body?.password || "",
      name: body?.name || "",
      lines: body?.lines
    });
    return NextResponse.json({ ok: true, lines: result.lines });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to create account" }, { status: 400 });
  }
}
