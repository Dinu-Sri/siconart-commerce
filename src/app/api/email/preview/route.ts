import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { emailCatalog, type EmailKind } from "@/lib/email";

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kind = new URL(request.url).searchParams.get("kind") as EmailKind | null;
  const template = kind ? emailCatalog[kind] : undefined;
  if (!template) {
    return NextResponse.json({ error: "Unknown email template" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  return new NextResponse(template.html(origin), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
