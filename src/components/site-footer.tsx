import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Logo } from "@/components/logo";
import { localeHref } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

export async function SiteFooter() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");

  const shopLinks = [
    { label: t("shop"), href: "/shop" },
    { label: t("agent"), href: "/become-an-agent" },
    { label: "Track order", href: "/track-your-order" },
    { label: t("contact"), href: "/contact" }
  ];
  const helpLinks = [
    { label: "About Us", href: "/about" },
    { label: t("faq"), href: "/faq" },
    { label: t("shipping"), href: "/shipping-policy" },
    { label: "Return & Exchange", href: "/return-exchange-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" }
  ];

  return (
    <footer className="border-t bg-accent text-accent-foreground">
      <div className="container-content grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.9fr_1fr]">
        <div>
          <Logo variant="footer" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-accent-foreground/75">{t("tagline")}</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-accent-foreground/75">
            Orders ship from Dongguan, China. Processing usually takes 2-5 business days. International customs duties
            and import taxes are the customer's responsibility unless checkout states otherwise.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">Shop</h2>
          <div className="mt-4 grid gap-3 text-sm text-accent-foreground/75">
            {shopLinks.map((link) => (
              <Link key={link.href} href={localeHref(locale, link.href)} className="hover:text-accent-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">{t("help")}</h2>
          <div className="mt-4 grid gap-3 text-sm text-accent-foreground/75">
            {helpLinks.map((link) => (
              <Link key={link.href} href={localeHref(locale, link.href)} className="hover:text-accent-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">{t("contact")}</h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-accent-foreground/75">
            <a href="mailto:support@siconart.com" className="hover:text-accent-foreground">
              support@siconart.com
            </a>
            <span>Dongguan, Guangdong, China</span>
            <span>Returns: unused items within 30 days. Damaged, wrong, or defective items must be reported within 7 days.</span>
          </div>
        </div>
      </div>
      <div className="border-t border-accent-foreground/10">
        <div className="container-content flex flex-col gap-3 py-5 text-sm text-accent-foreground/65 sm:flex-row sm:items-center sm:justify-between">
          <span>Copyright 2026 Sicon Art. {t("rights")}</span>
          <span>{t("made")}</span>
        </div>
      </div>
    </footer>
  );
}
