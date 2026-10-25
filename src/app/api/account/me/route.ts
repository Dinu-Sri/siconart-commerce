import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readCustomerSession } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await readCustomerSession();
  if (!session) return NextResponse.json({ firstName: null });
  const customer = await db.customer.findUnique({ where: { id: session.id }, select: { name: true } });
  const firstName = customer?.name?.trim().split(/\s+/)[0] || null;
  return NextResponse.json({ firstName });
}
