import { NextResponse } from "next/server";
import { logoutAccount } from "@/lib/customer-account";

export const dynamic = "force-dynamic";

export async function POST() {
  await logoutAccount();
  return NextResponse.json({ ok: true });
}
