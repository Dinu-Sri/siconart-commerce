const PRODUCTION_ORIGIN = "https://siconart.com";

function parseUrl(value: string) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function isIpHostname(hostname: string) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) || hostname.includes(":");
}

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

/** Public pages, sitemap, schema, and emails never use a VPS IP or debug port. */
export function isCanonicalPublicOrigin(value: string) {
  const url = parseUrl(value);
  if (!url) return false;
  if (url.protocol !== "https:") return false;
  if (isLocalHostname(url.hostname) || isIpHostname(url.hostname)) return false;
  if (url.port && url.port !== "443") return false;
  return true;
}

function firstCanonical(values: Array<string | undefined>) {
  for (const raw of values) {
    const configured = raw?.trim().replace(/\/$/, "") ?? "";
    if (configured && isCanonicalPublicOrigin(configured)) return configured;
  }
  return null;
}

export function siteOrigin() {
  const publicOrigin = firstCanonical([
    process.env.STOREFRONT_URL,
    process.env.NEXT_PUBLIC_STOREFRONT_URL,
    process.env.CANONICAL_ORIGIN
  ]);
  if (publicOrigin) return publicOrigin;

  if (process.env.NODE_ENV !== "production") {
    const local = (process.env.NEXT_PUBLIC_BASE_URL || "").trim().replace(/\/$/, "");
    const url = parseUrl(local);
    if (url && isLocalHostname(url.hostname)) return local;
  }

  return PRODUCTION_ORIGIN;
}

export function absoluteUrl(path = "/") {
  const origin = siteOrigin();
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
