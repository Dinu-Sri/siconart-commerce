import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { notifyContactSubmission } from "@/lib/email";
import { FORM_STARTED_FIELD, HONEYPOT_FIELD, isBotSubmission, tooManyRequests } from "@/lib/form-guard";
import { clientKey } from "@/lib/form-guard-server";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  subject: z.string().min(2).max(160),
  message: z.string().min(10).max(4000),
  [HONEYPOT_FIELD]: z.string().optional(),
  [FORM_STARTED_FIELD]: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid contact payload" }, { status: 400 });
  }
  if (isBotSubmission({ honeypot: parsed.data.website, startedAt: parsed.data.form_started })) {
    return NextResponse.json({ ok: true });
  }
  if (tooManyRequests(await clientKey("contact-api"))) {
    return NextResponse.json({ error: "Please try again shortly" }, { status: 429 });
  }

  const payload = {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message
  };
  const message = await db.contactMessage.create({ data: payload });
  await notifyContactSubmission(payload);
  return NextResponse.json({ ok: true, id: message.id });
}
