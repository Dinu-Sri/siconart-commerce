import type { Locale } from "@/i18n/routing";

export const navItems = [
  { key: "shop", href: "/shop" },
  { key: "finder", href: "/brush-finder" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" }
] as const;

export function localeHref(locale: Locale, href: string) {
  const path = href.startsWith("/") ? href : `/${href}`;
  return `/${locale}${path === "/" ? "" : path}`;
}
