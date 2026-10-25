import { NextRequest, NextResponse } from "next/server";
import { submitOrderFeedback } from "@/lib/order-feedback";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ ok: false, error: "Could not read the form. Please try again." }, { status: 400 });
  }

  const files = form.getAll("photos").filter((item): item is File => item instanceof File && item.size > 0);
  if (files.length > 4) {
    return NextResponse.json({ ok: false, error: "You can add up to 4 photos." }, { status: 400 });
  }
  if (files.some((file) => file.size > 1_500_000)) {
    return NextResponse.json({ ok: false, error: "Each photo must be under 1.5 MB." }, { status: 400 });
  }

  try {
    const photos = await Promise.all(
      files.map(async (file) => ({
        bytes: new Uint8Array(await file.arrayBuffer()),
        contentType: file.type
      }))
    );
    await submitOrderFeedback(decodeURIComponent(token), String(form.get("body") || ""), photos, String(form.get("company") || ""));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "We could not save your feedback. Please try again." },
      { status: 400 }
    );
  }
}
