export const HONEYPOT_FIELD = "website";
export const FORM_STARTED_FIELD = "form_started";

const MIN_ELAPSED_MS = 1200;
const hits = new Map<string, number[]>();

export type FormGuardInput = {
  honeypot?: unknown;
  startedAt?: unknown;
};

export function isBotSubmission({ honeypot, startedAt }: FormGuardInput) {
  if (String(honeypot || "").trim()) return true;
  const started = Number(startedAt);
  if (Number.isFinite(started) && started > 0 && Date.now() - started < MIN_ELAPSED_MS) return true;
  return false;
}

export function readFormGuard(formData: FormData): FormGuardInput {
  return {
    honeypot: String(formData.get(HONEYPOT_FIELD) || ""),
    startedAt: String(formData.get(FORM_STARTED_FIELD) || "")
  };
}

export function tooManyRequests(key: string, limit = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}

export function guardedOk() {
  return { bot: true as const };
}
