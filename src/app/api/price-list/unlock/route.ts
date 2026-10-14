import { NextRequest, NextResponse } from "next/server";
import { applyListAccessCookie, isListPassword } from "@/lib/price-list-access";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const syncId = request.headers.get("x-price-list-sync-id")?.trim() || `pls-${Date.now().toString(36)}`;
  const raw = await request.text();
  let password = "";
  try {
    const parsed = JSON.parse(raw) as { password?: string };
    password = String(parsed?.password || "");
  } catch {
    password = new URLSearchParams(raw).get("password") || raw;
  }

  if (!isListPassword(password)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Password is incorrect.",
        code: "BAD_PASSWORD",
        hint: "Use the same price-list password as the /list screen.",
        syncId
      },
      { status: 401 }
    );
  }

  return applyListAccessCookie(
    NextResponse.json(
      {
        ok: true,
        syncId
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  );
}
