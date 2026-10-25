import { defaultLocale, type Locale } from "@/i18n/routing";

export const navItems = [
  { key: "shop", href: "/shop" },
  { key: "guides", href: "/blog" },
  { key: "events", href: "/events" },
  { key: "agent", href: "/become-an-agent" },
  { key: "about", href: "/about" },
  { key: "tracking", href: "/track-your-order" }
] as const;

export function localeHref(locale: Locale, href: string) {
  const path = href.startsWith("/") ? href : `/${href}`;
  if (locale === defaultLocale) return path === "/" ? "/" : path;
  return `/${locale}${path === "/" ? "" : path}`;
}
