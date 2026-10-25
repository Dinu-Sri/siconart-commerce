import { NextRequest, NextResponse } from "next/server";
import { readAccountCart, replaceAccountCart } from "@/lib/customer-account";

export const dynamic = "force-dynamic";

export async function GET() {
  const lines = await readAccountCart();
  if (!lines) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, lines });
}

export async function PUT(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { lines?: unknown } | null;
  const lines = await replaceAccountCart(body?.lines);
  if (!lines) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, lines });
}
