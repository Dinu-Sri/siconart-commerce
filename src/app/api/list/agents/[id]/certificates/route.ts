import { NextRequest, NextResponse } from "next/server";
import { hasListAccess, listUnauthorizedResponse } from "@/lib/price-list-access";
import { extendBrandAgent, listBrandAgents } from "@/lib/agent-certificates";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasListAccess())) {
    return listUnauthorizedResponse("agents");
  }
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    periodKind?: string;
    startsAt?: string;
    endsAt?: string;
  } | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  try {
    await extendBrandAgent(id, {
      periodKind: body.periodKind ?? "",
      startsAt: body.startsAt,
      endsAt: body.endsAt
    });
    const agents = await listBrandAgents();
    return NextResponse.json({ ok: true, agents });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to extend certificate" },
      { status: 400 }
    );
  }
}
