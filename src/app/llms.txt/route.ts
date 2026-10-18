import { NextResponse } from "next/server";
import { buildLlmsTxt } from "@/lib/seo/llms-txt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  return new NextResponse(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600"
    }
  });
}
