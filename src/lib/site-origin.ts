const PRODUCTION_ORIGIN = "https://siconart.com";

export function siteOrigin() {
  const configured = (process.env.NEXT_PUBLIC_BASE_URL || process.env.APP_URL || process.env.STOREFRONT_URL || "")
    .trim()
    .replace(/\/$/, "");
  if (configured.startsWith("http://localhost") || configured.startsWith("https://localhost") || !configured) {
    return PRODUCTION_ORIGIN;
  }
  return configured;
}

export function absoluteUrl(path = "/") {
  const origin = siteOrigin();
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
