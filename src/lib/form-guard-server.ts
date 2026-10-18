import { headers } from "next/headers";

export async function clientKey(scope: string) {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || headerList.get("x-real-ip")?.trim() || "unknown";
  return `${scope}:${ip}`;
}
