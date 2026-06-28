import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Logo } from "@/components/logo";
import { localeHref } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

export async function SiteFooter() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");

  const links = [
    { label: t("shop"), href: "/shop" },
    { label: t("agent"), href: "/become-an-agent" },
    { label: t("faq"), href: "/faq" },
    { label: t("shipping"), href: "/shipping-policy" },
    { label: t("returns"), href: "/return-policy" }
  ];

  return (
    <footer className="border-t bg-accent text-accent-foreground">
      <div className="container-content grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-7 text-accent-foreground/75">{t("tagline")}</p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">{t("help")}</h2>
          <div className="mt-4 grid gap-3 text-sm text-accent-foreground/75">
            {links.map((link) => (
              <Link key={link.href} href={localeHref(locale, link.href)} className="hover:text-accent-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">{t("contact")}</h2>
          <div className="mt-4 grid gap-3 text-sm text-accent-foreground/75">
            <a href="mailto:support@siconart.com" className="hover:text-accent-foreground">
              support@siconart.com
            </a>
            <span>Dongguan, Guangdong, China</span>
          </div>
        </div>
      </div>
      <div className="border-t border-accent-foreground/10">
        <div className="container-content flex flex-col gap-3 py-5 text-sm text-accent-foreground/65 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Sicon Art. {t("rights")}</span>
          <span>{t("made")}</span>
        </div>
      </div>
    </footer>
  );
}
