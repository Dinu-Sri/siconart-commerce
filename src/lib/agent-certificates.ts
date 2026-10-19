import { db } from "@/lib/db";
import { getCertificateCountry } from "@/data/certificate-countries";
import { generateCertificateCode } from "@/lib/agent-certificate-code";
import {
  addCalendarYears,
  isCertificateActive,
  nextPeriodStart,
  parseDateOnly,
  remainingDays,
  type CertificatePeriodKind
} from "@/lib/agent-certificate-dates";

function isPeriodKind(value: string): value is CertificatePeriodKind {
  return value === "1y" || value === "3y" || value === "custom";
}

function resolveRange(periodKind: CertificatePeriodKind, startsAt: Date, endsAtRaw?: string | null) {
  if (periodKind === "custom") {
    const endsAt = endsAtRaw ? parseDateOnly(endsAtRaw) : null;
    if (!endsAt) throw new Error("Choose an end date for a custom period. / 自定义期限请选择结束日期。");
    if (endsAt.getTime() < startsAt.getTime()) throw new Error("The end date must be on or after the start date. / 结束日期不能早于开始日期。");
    return { startsAt, endsAt };
  }
  return {
    startsAt,
    endsAt: addCalendarYears(startsAt, periodKind === "3y" ? 3 : 1)
  };
}

async function uniqueCode() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = generateCertificateCode();
    const exists = await db.brandAgentCertificate.findUnique({ where: { code }, select: { id: true } });
    if (!exists) return code;
  }
  throw new Error("Could not allocate a certificate code.");
}

export function serializeCertificate(cert: {
  id: string;
  code: string;
  periodKind: string;
  startsAt: Date;
  endsAt: Date;
  archivedAt: Date | null;
  createdAt: Date;
}) {
  const remaining = remainingDays(cert.endsAt);
  return {
    id: cert.id,
    code: cert.code,
    periodKind: cert.periodKind as CertificatePeriodKind,
    startsAt: cert.startsAt.toISOString(),
    endsAt: cert.endsAt.toISOString(),
    archivedAt: cert.archivedAt?.toISOString() ?? null,
    createdAt: cert.createdAt.toISOString(),
    remainingDays: remaining,
    active: remaining >= 0,
    archived: Boolean(cert.archivedAt)
  };
}

export async function listBrandAgents() {
  const agents = await db.brandAgent.findMany({
    orderBy: { companyName: "asc" },
    include: {
      certificates: { orderBy: { createdAt: "desc" } }
    }
  });
  return agents.map((agent) => {
    const visible = agent.certificates.filter((cert) => !cert.archivedAt);
    const archived = agent.certificates.filter((cert) => cert.archivedAt);
    const latest = visible[0] ?? null;
    return {
      id: agent.id,
      companyName: agent.companyName,
      countryCode: agent.countryCode,
      countryName: agent.countryName,
      officialEn: agent.officialEn,
      officialZh: agent.officialZh,
      createdAt: agent.createdAt.toISOString(),
      latest: latest ? serializeCertificate(latest) : null,
      certificates: visible.map(serializeCertificate),
      archivedCertificates: archived.map(serializeCertificate),
      active: latest ? isCertificateActive(latest.endsAt) : false
    };
  });
}

export type BrandAgentListItem = Awaited<ReturnType<typeof listBrandAgents>>[number];

export async function createBrandAgent(input: {
  companyName: string;
  countryCode: string;
  periodKind: string;
  startsAt: string;
  endsAt?: string;
}) {
  const companyName = input.companyName.trim();
  if (companyName.length < 2) throw new Error("Enter the company name. / 请填写公司名称。");
  const country = getCertificateCountry(input.countryCode);
  if (!country) throw new Error("Choose a country. / 请选择国家/地区。");
  if (!isPeriodKind(input.periodKind)) throw new Error("Choose 1 year, 3 years, or a custom period. / 请选择一年、三年或自定义期限。");
  const startsAt = parseDateOnly(input.startsAt);
  if (!startsAt) throw new Error("Choose a start date. / 请选择开始日期。");
  const range = resolveRange(input.periodKind, startsAt, input.endsAt);
  const code = await uniqueCode();

  return db.brandAgent.create({
    data: {
      companyName,
      countryCode: country.code,
      countryName: country.name,
      officialEn: country.officialEn,
      officialZh: country.officialZh,
      certificates: {
        create: {
          code,
          periodKind: input.periodKind,
          startsAt: range.startsAt,
          endsAt: range.endsAt
        }
      }
    },
    include: { certificates: { orderBy: { createdAt: "desc" } } }
  });
}

export async function extendBrandAgent(
  agentId: string,
  input: { periodKind: string; startsAt?: string; endsAt?: string }
) {
  const agent = await db.brandAgent.findUnique({
    where: { id: agentId },
    include: {
      certificates: { where: { archivedAt: null }, orderBy: { createdAt: "desc" }, take: 1 }
    }
  });
  if (!agent) throw new Error("Agent not found. / 未找到该代理。");
  if (!isPeriodKind(input.periodKind)) throw new Error("Choose 1 year, 3 years, or a custom period. / 请选择一年、三年或自定义期限。");
  const latest = agent.certificates[0];
  const startsAt = input.startsAt
    ? parseDateOnly(input.startsAt)
    : latest
      ? nextPeriodStart(latest.endsAt)
      : parseDateOnly(new Date().toISOString().slice(0, 10));
  if (!startsAt) throw new Error("Choose a start date. / 请选择开始日期。");
  const range = resolveRange(input.periodKind, startsAt, input.endsAt);
  const code = await uniqueCode();
  return db.brandAgentCertificate.create({
    data: {
      agentId: agent.id,
      code,
      periodKind: input.periodKind,
      startsAt: range.startsAt,
      endsAt: range.endsAt
    }
  });
}

export async function getCertificateByCode(code: string) {
  return db.brandAgentCertificate.findUnique({
    where: { code },
    include: { agent: true }
  });
}

export async function setCertificateArchived(code: string, archived: boolean) {
  const certificate = await db.brandAgentCertificate.findUnique({ where: { code } });
  if (!certificate) throw new Error("Certificate not found. / 未找到该授权书。");
  return db.brandAgentCertificate.update({
    where: { code: certificate.code },
    data: { archivedAt: archived ? new Date() : null }
  });
}
