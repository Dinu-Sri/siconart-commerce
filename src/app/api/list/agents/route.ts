import { NextRequest, NextResponse } from "next/server";
import { hasListAccess, listUnauthorizedResponse } from "@/lib/price-list-access";
import { createBrandAgent, listBrandAgents } from "@/lib/agent-certificates";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await hasListAccess())) {
    return listUnauthorizedResponse("agents");
  }
  try {
    const agents = await listBrandAgents();
    return NextResponse.json({ ok: true, agents });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to load agents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await hasListAccess())) {
    return listUnauthorizedResponse("agents");
  }
  const body = (await request.json().catch(() => null)) as {
    companyName?: string;
    countryCode?: string;
    periodKind?: string;
    startsAt?: string;
    endsAt?: string;
  } | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  try {
    await createBrandAgent({
      companyName: body.companyName ?? "",
      countryCode: body.countryCode ?? "",
      periodKind: body.periodKind ?? "",
      startsAt: body.startsAt ?? "",
      endsAt: body.endsAt
    });
    const agents = await listBrandAgents();
    return NextResponse.json({ ok: true, agents });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to create agent" },
      { status: 400 }
    );
  }
}
