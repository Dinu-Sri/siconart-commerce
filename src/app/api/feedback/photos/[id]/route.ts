import { NextResponse } from "next/server";
import { hasListAccess } from "@/lib/price-list-access";
import { readFeedbackImage } from "@/lib/order-feedback";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-z0-9]{10,40}$/i.test(id)) return new NextResponse(null, { status: 404 });

  try {
    const image = await readFeedbackImage(id);
    if (!image) return new NextResponse(null, { status: 404 });
    if (image.feedback.status !== "APPROVED" && !(await hasListAccess())) {
      return new NextResponse(null, { status: 404 });
    }
    return new NextResponse(Buffer.from(image.bytes), {
      headers: {
        "Content-Type": image.contentType,
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "Cache-Control": image.feedback.status === "APPROVED" ? "public, max-age=300" : "private, no-store"
      }
    });
  } catch (error) {
    console.error("Feedback photo failed:", error);
    return new NextResponse(null, { status: 404 });
  }
}
