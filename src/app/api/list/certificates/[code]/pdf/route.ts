import { NextResponse } from "next/server";
import { hasListAccess } from "@/lib/price-list-access";
import { getCertificateByCode } from "@/lib/agent-certificates";
import { certificatePdfFilename, generateAgentCertificatePdf } from "@/lib/agent-certificate-pdf";
import type { CertificatePeriodKind } from "@/lib/agent-certificate-dates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function buildCertificatePdf(rawCode: string) {
  if (!(await hasListAccess())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const certificate = await getCertificateByCode(decodeURIComponent(rawCode).trim().toUpperCase());
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

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return buildCertificatePdf(code);
}

export async function POST(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return buildCertificatePdf(code);
}
