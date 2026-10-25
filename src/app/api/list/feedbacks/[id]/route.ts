import { NextRequest, NextResponse } from "next/server";
import { hasListAccess, listUnauthorizedResponse } from "@/lib/price-list-access";
import { setOrderFeedbackStatus } from "@/lib/order-feedback";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasListAccess())) return listUnauthorizedResponse("feedback-status");
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  const status = body?.status === "APPROVED" || body?.status === "SUSPENDED" ? body.status : null;
  if (!status) {
    return NextResponse.json({ ok: false, error: "Choose approve or suspend." }, { status: 400 });
  }
  try {
    const feedback = await setOrderFeedbackStatus(id, status);
    return NextResponse.json({ ok: true, feedback });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not update this feedback." },
      { status: 400 }
    );
  }
}
