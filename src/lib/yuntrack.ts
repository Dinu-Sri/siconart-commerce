import crypto from "node:crypto";
import { yuntrackUrl, type TrackEvent, type TrackResult } from "@/lib/yuntrack-shared";

const SIGN_KEY = "f3c42837e3b46431ddf5d7db7d67017d";

export { yuntrackUrl, type TrackEvent, type TrackResult };

export async function queryYuntrack(rawCode: string): Promise<TrackResult> {
  const code = rawCode.trim().toUpperCase();
  if (!/^[A-Z0-9-]{6,40}$/.test(code)) {
    throw new Error("Enter a tracking number, for example YT2628500708994071.");
  }

  const NumberList = [code];
  const Timestamp = Date.now();
  const message = `Timestamp=${Timestamp}&NumberList=${JSON.stringify(NumberList)}`;
  const Signature = crypto.createHmac("sha256", SIGN_KEY).update(message).digest("hex");
  const response = await fetch("https://services.yuntrack.com/Track/Query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: "https://www.yuntrack.com",
      Referer: "https://www.yuntrack.com/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    },
    body: JSON.stringify({
      NumberList,
      CaptchaVerification: "",
      Year: 0,
      Timestamp,
      Signature
    }),
    cache: "no-store"
  });

  const text = await response.text();
  if (!response.ok || text.trim().startsWith("<")) {
    throw new Error("YunExpress did not return tracking events. Open the carrier page to check this number.");
  }

  const payload = JSON.parse(text) as { ResultList?: Array<Record<string, unknown>> };
  const row = payload.ResultList?.[0];
  if (!row) throw new Error("No tracking result for that number yet.");
  const info = (row.TrackInfo || {}) as Record<string, unknown>;
  const events = collectEvents(info);
  const last = events[0];
  const notes = stripHtml(String(info.AdditionalNotes || ""));
  const carrier = notes.match(/Last Mile:\s*([^\n]+)/i)?.[1]?.trim() || "";

  return {
    code,
    status: last?.content || "Tracking received",
    destination: String(info.DestinationCountryCode || ""),
    lastMileNumber: String(info.TrackingNumber || ""),
    lastMileCarrier: carrier,
    events,
    url: yuntrackUrl(code)
  };
}

function collectEvents(info: Record<string, unknown>): TrackEvent[] {
  const lists = Object.values(info).filter(Array.isArray) as unknown[][];
  const fromLists = lists.flatMap((list) => list.map(readEvent).filter((event): event is TrackEvent => Boolean(event)));
  const last = readEvent(info.LastTrackEvent);
  const merged = last ? [last, ...fromLists] : fromLists;
  const seen = new Set<string>();
  return merged.filter((event) => {
    const key = `${event.at}|${event.content}|${event.location}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function readEvent(value: unknown): TrackEvent | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const content = String(row.ProcessContent || row.TrackingStatus || "").trim();
  if (!content) return null;
  const at = String(row.ProcessDate || row.Date || "").replace("T", " ").slice(0, 19);
  const location = String(row.ProcessLocation || row.Location || "").trim();
  return { at, content: stripHtml(content), location };
}

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}
