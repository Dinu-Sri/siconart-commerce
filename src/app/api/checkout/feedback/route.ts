import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailLayout, escapeHtml, paragraph, sendTransactionalEmail } from "@/lib/email";
import { tooManyRequests } from "@/lib/form-guard";

const REASONS: Record<string, string> = {
  "payment-method": "I need a different payment method",
  price: "Prices are expensive",
  gateway: "Payment gateway error",
  other: "Other"
};

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { orderNumber?: string; email?: string; reason?: string; detail?: string }
    | null;
  const reason = REASONS[body?.reason || ""] || "";
  if (!reason) return NextResponse.json({ ok: false, error: "Choose a reason" }, { status: 400 });
  const detail = (body?.detail || "").trim();
  if (body?.reason === "other" && detail.length < 3) {
    return NextResponse.json({ ok: false, error: "Tell us a little more" }, { status: 400 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooManyRequests(`checkout-feedback:${ip}`, 12)) {
    return NextResponse.json({ ok: false, error: "Please wait a moment and try again" }, { status: 429 });
  }

  await db.checkoutFeedback.create({
    data: {
      orderNumber: body?.orderNumber?.trim() || null,
      email: body?.email?.trim().toLowerCase() || null,
      reason,
      detail: detail || null
    }
  });

  await sendTransactionalEmail({
    subject: `Checkout cancelled: ${reason}`,
    html: emailLayout(
      "Checkout was cancelled",
      paragraph(`Reason: <strong>${escapeHtml(reason)}</strong>`) +
        paragraph(
          `Order: ${escapeHtml(body?.orderNumber || "Not recorded")}<br>Email: ${escapeHtml(body?.email || "Not recorded")}`
        ) +
        (detail ? paragraph(escapeHtml(detail)) : "")
    ),
    audience: "admins"
  });

  return NextResponse.json({ ok: true });
}
