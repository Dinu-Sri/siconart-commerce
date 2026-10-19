export type CertificatePeriodKind = "1y" | "3y" | "custom";

export function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }
  return date;
}

export function dateOnlyIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function todayDateOnly() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0));
}

export function addCalendarYears(start: Date, years: number) {
  const end = new Date(start.getTime());
  end.setUTCFullYear(end.getUTCFullYear() + years);
  end.setUTCDate(end.getUTCDate() - 1);
  return end;
}

export function periodLabelZh(kind: CertificatePeriodKind) {
  if (kind === "1y") return "一年";
  if (kind === "3y") return "三年";
  return "自定义期限";
}

export function formatZhDate(date: Date) {
  return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
}

export function remainingDays(endsAt: Date | string, from = todayDateOnly()) {
  const end = typeof endsAt === "string" ? new Date(endsAt) : endsAt;
  const endDay = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  const fromDay = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  return Math.round((endDay - fromDay) / 86_400_000);
}

export function isCertificateActive(endsAt: Date | string) {
  return remainingDays(endsAt) >= 0;
}

export function nextPeriodStart(currentEndsAt: Date | string) {
  const today = todayDateOnly();
  const end = typeof currentEndsAt === "string" ? new Date(currentEndsAt) : currentEndsAt;
  if (remainingDays(end, today) < 0) return today;
  const next = new Date(end.getTime());
  next.setUTCDate(next.getUTCDate() + 1);
  next.setUTCHours(12, 0, 0, 0);
  return next;
}
