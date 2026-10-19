import { NextRequest, NextResponse } from "next/server";
import { hasListAccess, listUnauthorizedResponse } from "@/lib/price-list-access";
import { listBrandAgents, setCertificateArchived } from "@/lib/agent-certificates";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  if (!(await hasListAccess())) {
    return listUnauthorizedResponse("agents-archive");
  }
  const { code } = await params;
  const body = (await request.json().catch(() => null)) as { archived?: boolean } | null;
  try {
    await setCertificateArchived(decodeURIComponent(code).trim().toUpperCase(), body?.archived !== false);
    const agents = await listBrandAgents();
    return NextResponse.json({ ok: true, agents });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to archive certificate / 无法归档授权书" },
      { status: 400 }
    );
  }
}
