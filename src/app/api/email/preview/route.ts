import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { emailCatalog, type EmailKind } from "@/lib/email";
import { siteOrigin } from "@/lib/site-origin";

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kind = new URL(request.url).searchParams.get("kind") as EmailKind | null;
  const template = kind ? emailCatalog[kind] : undefined;
  if (!template) {
    return NextResponse.json({ error: "Unknown email template" }, { status: 400 });
  }

  const origin = siteOrigin();
  return new NextResponse(template.html(origin), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
