import { NextRequest, NextResponse } from "next/server";
import { deleteAddress, saveAddress, type AccountAddress } from "@/lib/customer-account";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as (Partial<AccountAddress> & { id?: string }) | null;
  try {
    await saveAddress({
      id: body?.id || "",
      name: body?.name || "",
      line1: body?.line1 || "",
      line2: body?.line2 || "",
      city: body?.city || "",
      region: body?.region || "",
      postalCode: body?.postalCode || "",
      country: body?.country || "",
      countryCode: body?.countryCode || "",
      phone: body?.phone || "",
      isDefault: Boolean(body?.isDefault)
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to save address" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    await deleteAddress(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to delete address" },
      { status: 400 }
    );
  }
}
