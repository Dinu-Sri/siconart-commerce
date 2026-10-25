import { NextRequest, NextResponse } from "next/server";
import { queryYuntrack, yuntrackUrl } from "@/lib/yuntrack";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code") || "";
  try {
    const result = await queryYuntrack(code);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        url: code.trim() ? yuntrackUrl(code) : "",
        error: error instanceof Error ? error.message : "Unable to track this parcel"
      },
      { status: 400 }
    );
  }
}
