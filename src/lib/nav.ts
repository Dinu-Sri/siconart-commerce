import { defaultLocale, type Locale } from "@/i18n/routing";

export const navItems = [
  { key: "shop", href: "/shop" },
  { key: "agent", href: "/become-an-agent" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" }
] as const;

export function localeHref(locale: Locale, href: string) {
  const path = href.startsWith("/") ? href : `/${href}`;
  if (locale === defaultLocale) return path === "/" ? "/" : path;
  return `/${locale}${path === "/" ? "" : path}`;
}
