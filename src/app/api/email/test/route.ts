import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { emailCatalog, sendTestEmails, type EmailKind } from "@/lib/email";

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { kind?: string } | null;
  const kind = body?.kind;
  if (kind && kind !== "all" && !(kind in emailCatalog)) {
    return NextResponse.json({ error: "Unknown email template" }, { status: 400 });
  }

  const result = await sendTestEmails(kind && kind !== "all" ? (kind as EmailKind) : undefined);
  return NextResponse.json(result);
}
