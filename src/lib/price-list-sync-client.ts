import type { PriceListFieldUpdate } from "@/lib/price-list-fields";

export type { PriceListFieldUpdate };

export type PriceSaveError = {
  code: string;
  title: string;
  message: string;
  httpStatus: number | null;
  detail: string;
  hint: string;
  syncId: string;
  tries: number;
  time: string;
  host: string;
  path: string;
  online: boolean;
  retryable: boolean;
  needsUnlock: boolean;
};

export type PriceSaveResult =
  | { ok: true; syncId: string; saved: PriceListFieldUpdate[] }
  | { ok: false; error: PriceSaveError };

type AttemptKind = "ok" | "unlock" | "challenge" | "retry" | "fatal";

type Attempt = {
  kind: AttemptKind;
  status: number | null;
  detail: string;
  hint: string;
  code: string;
  saved: PriceListFieldUpdate[];
  syncId: string;
};

const RETRY_DELAYS_MS = [0, 800, 2000];
const ATTEMPT_TIMEOUT_MS = 15000;
const PRICES_PATH = "/api/price-list/prices";
const UNLOCK_PATH = "/api/price-list/unlock";

export async function savePriceListUpdates(updates: PriceListFieldUpdate[]): Promise<PriceSaveResult> {
  const syncId = createSyncId();
  const startedAt = new Date();
  let last: Attempt | null = null;
  let tries = 0;
  let triedPlain = false;

  for (let round = 0; round < RETRY_DELAYS_MS.length; round += 1) {
    if (RETRY_DELAYS_MS[round]) await sleep(RETRY_DELAYS_MS[round]);
    tries = round + 1;

    const modes: Array<"json" | "plain"> = triedPlain ? ["plain", "json"] : ["json", "plain"];
    for (const mode of modes) {
      last = await postPrices(updates, syncId, mode);
      if (last.kind === "ok") {
        return { ok: true, syncId: last.syncId, saved: last.saved };
      }
      if (last.kind === "challenge") {
        triedPlain = true;
        continue;
      }
      break;
    }

    if (!last) break;
    if (last.kind === "unlock" && tries >= 2) break;
    if (last.kind === "fatal") break;
    if (last.kind !== "retry" && last.kind !== "unlock" && last.kind !== "challenge") break;
  }

  return {
    ok: false,
    error: toError(last, syncId, tries, startedAt)
  };
}

export async function unlockListAccess(
  password: string,
  guard: { website?: string; formStarted?: string } = {}
): Promise<PriceSaveResult> {
  const syncId = createSyncId();
  const startedAt = new Date();
  const body = JSON.stringify({
    password,
    syncId,
    website: guard.website || "",
    form_started: guard.formStarted || ""
  });

  try {
    const response = await fetchWithTimeout(UNLOCK_PATH, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      keepalive: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Price-List-Sync-Id": syncId
      },
      body
    });
    const raw = await response.text();
    const payload = parseJson(raw);
    if (response.ok && payload?.ok) {
      return { ok: true, syncId: String(payload.syncId || syncId), saved: [] };
    }
    return {
      ok: false,
      error: toError(
        {
          kind: response.status === 401 ? "unlock" : "fatal",
          status: response.status,
          detail: String(payload?.error || clip(raw)),
          hint: String(payload?.hint || ""),
          code: String(payload?.code || (response.status === 401 ? "BAD_PASSWORD" : `HTTP_${response.status}`)),
          saved: [],
          syncId
        },
        syncId,
        1,
        startedAt,
        UNLOCK_PATH
      )
    };
  } catch (error) {
    return {
      ok: false,
      error: toError(caughtAttempt(error, syncId), syncId, 1, startedAt, UNLOCK_PATH)
    };
  }
}

export async function pingListAccess() {
  try {
    const response = await fetch(PRICES_PATH, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json" }
    });
    return response.status !== 401;
  } catch {
    return true;
  }
}

function createSyncId() {
  return `pls-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function postPrices(updates: PriceListFieldUpdate[], syncId: string, mode: "json" | "plain"): Promise<Attempt> {
  const body = JSON.stringify({ updates, syncId });
  try {
    const response = await fetchWithTimeout(PRICES_PATH, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      keepalive: true,
      headers: {
        Accept: "application/json",
        "Content-Type": mode === "json" ? "application/json" : "text/plain",
        "X-Price-List-Sync-Id": syncId,
        "X-Requested-With": "SiconArtPriceList"
      },
      body
    });
    const raw = await response.text();
    const contentType = response.headers.get("content-type") || "";
    const looksHtml = contentType.includes("text/html") || /^\s*</.test(raw);

    if (looksHtml) {
      return {
        kind: "challenge",
        status: response.status,
        detail: clip(raw.replace(/<[^>]+>/g, " ")),
        hint: "The network shield returned a block page instead of saving.",
        code: "CF_CHALLENGE",
        saved: [],
        syncId
      };
    }

    const payload = parseJson(raw);
    if (response.ok && payload?.ok) {
      return {
        kind: "ok",
        status: response.status,
        detail: "",
        hint: "",
        code: "OK",
        saved: Array.isArray(payload.saved) ? payload.saved : [],
        syncId: String(payload.syncId || syncId)
      };
    }

    const code = String(payload?.code || `HTTP_${response.status}`);
    const detail = String(payload?.hint || payload?.error || clip(raw) || `HTTP ${response.status}`);
    const hint = String(payload?.error || payload?.hint || "");

    if (response.status === 401 || code === "NO_LIST_COOKIE") {
      return { kind: "unlock", status: 401, detail, hint, code: "NO_LIST_COOKIE", saved: [], syncId };
    }
    if (code === "DB_ERROR" || code === "BAD_JSON") {
      return { kind: "fatal", status: response.status, detail, hint, code, saved: [], syncId };
    }
    if (response.status === 403 || response.status === 429 || response.status >= 500) {
      return { kind: "retry", status: response.status, detail, hint, code, saved: [], syncId };
    }
    return { kind: "fatal", status: response.status, detail, hint, code, saved: [], syncId };
  } catch (error) {
    return caughtAttempt(error, syncId);
  }
}

function caughtAttempt(error: unknown, syncId: string): Attempt {
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message : String(error);
  const timedOut = name === "AbortError" || /aborted|timeout/i.test(message);
  return {
    kind: "retry",
    status: null,
    detail: timedOut ? `Request waited ${ATTEMPT_TIMEOUT_MS / 1000}s with no reply.` : message || "Network request failed.",
    hint: timedOut
      ? "The shop did not answer. This is common on a slow or filtered network."
      : "The browser could not reach the shop. Check WeChat/in-app browser and try Chrome.",
    code: timedOut ? "TIMEOUT" : "NETWORK",
    saved: [],
    syncId
  };
}

function toError(
  attempt: Attempt | null,
  syncId: string,
  tries: number,
  startedAt: Date,
  path = PRICES_PATH
): PriceSaveError {
  const code = attempt?.code || "UNKNOWN";
  const needsUnlock = attempt?.kind === "unlock" || code === "NO_LIST_COOKIE" || code === "BAD_PASSWORD";
  const retryable = attempt?.kind === "retry" || attempt?.kind === "challenge" || needsUnlock;
  const title =
    code === "NO_LIST_COOKIE"
      ? "List login is missing in this browser"
      : code === "BAD_PASSWORD"
        ? "Password is incorrect"
        : code === "TIMEOUT"
          ? "The shop did not answer in time"
          : code === "NETWORK"
            ? "Could not reach the shop"
            : code === "CF_CHALLENGE"
              ? "The network shield blocked the save"
              : code === "DB_ERROR"
                ? "The shop database rejected the save"
                : "Price was not saved";

  return {
    code,
    title,
    message:
      "This new value is still only on this phone or computer. It is not saved for the list or shop yet. Tap Retry save. If this browser lost the list login, enter the password below and tap Unlock and save.",
    httpStatus: attempt?.status ?? null,
    detail: attempt?.detail || "No response body.",
    hint: attempt?.hint || "",
    syncId: attempt?.syncId || syncId,
    tries,
    time: startedAt.toISOString(),
    host: typeof window === "undefined" ? "" : window.location.host,
    path: `POST ${path}`,
    online: typeof navigator === "undefined" ? true : navigator.onLine,
    retryable,
    needsUnlock
  };
}

function parseJson(raw: string) {
  try {
    return JSON.parse(raw) as {
      ok?: boolean;
      error?: string;
      code?: string;
      hint?: string;
      syncId?: string;
      saved?: PriceListFieldUpdate[];
    };
  } catch {
    return null;
  }
}

function clip(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 220);
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function fetchWithTimeout(input: string, init: RequestInit) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}
