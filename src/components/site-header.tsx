"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/routing";
import { localeHref, navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { LangToggle } from "@/components/lang-toggle";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartIconLink } from "@/components/commerce/cart-icon-link";

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(localeHref(locale, href));

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/88 backdrop-blur-xl">
      <div className="overflow-hidden border-b bg-accent py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index}>Minimum order quantity $100. Worldwide shipping.</span>
          ))}
        </div>
      </div>
      <div className="container-content flex min-h-20 items-center justify-between gap-4 py-3">
        <Link href={localeHref(locale, "")} onClick={() => setMobileOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={localeHref(locale, item.href)}
              className={cn(
                "link-underline text-sm font-bold uppercase tracking-[0.16em]",
                isActive(item.href) ? "text-primary" : "text-foreground hover:text-primary"
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LangToggle className="hidden sm:block" />
          <ThemeToggle />
          <CartIconLink locale={locale} label={t("cart")} />
          <button
            type="button"
            aria-label={mobileOpen ? t("close") : t("menu")}
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-subtle lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t bg-background lg:hidden">
          <nav className="container-content flex flex-col py-3">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={localeHref(locale, item.href)}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "border-b py-4 text-base font-semibold last:border-0",
                  isActive(item.href) ? "text-primary" : "text-foreground"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="py-4">
              <LangToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
