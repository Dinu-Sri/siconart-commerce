import { NextResponse } from "next/server";
import { hasListAccess } from "@/lib/price-list-access";
import { getCertificateByCode } from "@/lib/agent-certificates";
import { certificatePdfFilename, generateAgentCertificatePdf } from "@/lib/agent-certificate-pdf";
import type { CertificatePeriodKind } from "@/lib/agent-certificate-dates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  if (!(await hasListAccess())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { code } = await params;
  const certificate = await getCertificateByCode(decodeURIComponent(code).trim().toUpperCase());
  if (!certificate) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  const pdf = await generateAgentCertificatePdf({
    companyName: certificate.agent.companyName,
    officialZh: certificate.agent.officialZh,
    periodKind: certificate.periodKind as CertificatePeriodKind,
    startsAt: certificate.startsAt,
    endsAt: certificate.endsAt,
    code: certificate.code
  });

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${certificatePdfFilename(certificate.agent.companyName, certificate.code)}"`,
      "Content-Type": "application/pdf"
    }
  });
}
