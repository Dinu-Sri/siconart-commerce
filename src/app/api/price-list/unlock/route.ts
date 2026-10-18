import { NextRequest, NextResponse } from "next/server";
import { applyListAccessCookie, isListPassword } from "@/lib/price-list-access";
import { FORM_STARTED_FIELD, HONEYPOT_FIELD, isBotSubmission } from "@/lib/form-guard";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const syncId = request.headers.get("x-price-list-sync-id")?.trim() || `pls-${Date.now().toString(36)}`;
  const raw = await request.text();
  let password = "";
  let honeypot = "";
  let startedAt = "";
  try {
    const parsed = JSON.parse(raw) as { password?: string; website?: string; form_started?: string };
    password = String(parsed?.password || "");
    honeypot = String(parsed?.website || "");
    startedAt = String(parsed?.form_started || "");
  } catch {
    const params = new URLSearchParams(raw);
    password = params.get("password") || raw;
    honeypot = params.get(HONEYPOT_FIELD) || "";
    startedAt = params.get(FORM_STARTED_FIELD) || "";
  }

  if (isBotSubmission({ honeypot, startedAt }) || !isListPassword(password)) {
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
