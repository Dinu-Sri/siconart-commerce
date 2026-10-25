import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Logo } from "@/components/logo";
import { localeHref } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";
import { SUPPORT_EMAIL, SUPPORT_WHATSAPP_DISPLAY, SUPPORT_WHATSAPP_LINK } from "@/lib/support";
import { SICONART_LEGAL_ADDRESS_ZH, SICONART_LEGAL_LOCALITY_EN, SICONART_LEGAL_NAME_ZH } from "@/lib/siconart-company";
import { PaymentMarks } from "@/components/payment-marks";

export async function SiteFooter() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");

  const shopLinks = [
    { label: t("shop"), href: "/shop" },
    { label: "Urban sketching brushes", href: "/collections/urban-sketching-brushes" },
    { label: "Travel brushes", href: "/collections/travel-watercolor-brushes" },
    { label: "Chinese watercolor brushes", href: "/collections/chinese-watercolor-brushes" },
    { label: t("agent"), href: "/become-an-agent" }
  ];
  const guideLinks = [
    { label: "Buying guides", href: "/blog" },
    { label: "Chinese watercolor brush prices", href: "/blog/chinese-watercolor-brush-prices" },
    { label: "Urban sketching brushes", href: "/blog/choose-brush-urban-sketching" },
    { label: "Travel or short handle", href: "/blog/travel-vs-short-handle-watercolor-brush" }
  ];
  const communityLinks = [
    { label: "Events", href: "/events" },
    { label: "Brand ambassadors", href: "/ambassadors" },
    { label: "Collaborate", href: "/collaborate" }
  ];
  const helpLinks = [
    { label: "Log in", href: "/account" },
    { label: "About Us", href: "/about" },
    { label: t("faq"), href: "/faq" },
    { label: t("shipping"), href: "/shipping-policy" },
    { label: "Return & Exchange", href: "/return-exchange-policy" },
    { label: "Track order", href: "/track-your-order" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: t("contact"), href: "/contact" },
    { label: "AI & product information", href: "/llms.txt" }
  ];

  return (
    <footer className="border-t bg-accent text-accent-foreground">
      <div className="container-content grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_1fr_1fr]">
        <div>
          <Logo variant="footer" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-accent-foreground/75">
            Sicon Art creates handmade traditional Chinese brushes for urban sketchers and watercolor artists. Explore
            compact travel brushes, new brush designs and larger brushes for expressive plein-air painting.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-accent-foreground/75">
            Worldwide shipping enquiries welcome—from Thailand, Indonesia, Vietnam, India, Malaysia, Singapore, Hong
            Kong, Switzerland and the United States to destinations across Europe. Check destination availability and
            rates at checkout, or contact us for a shipping quote.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-accent-foreground/75">
            {SICONART_LEGAL_NAME_ZH}
            <span className="mt-1 block">{SICONART_LEGAL_ADDRESS_ZH}</span>
            <span className="mt-1 block">{SICONART_LEGAL_LOCALITY_EN}</span>
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
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">Guides</h2>
          <div className="mt-4 grid gap-3 text-sm text-accent-foreground/75">
            {guideLinks.map((link) => (
              <Link key={link.href} href={localeHref(locale, link.href)} className="hover:text-accent-foreground">
                {link.label}
              </Link>
            ))}
          </div>
          <h2 className="mt-8 text-sm font-bold uppercase tracking-[0.18em]">Community</h2>
          <div className="mt-4 grid gap-3 text-sm text-accent-foreground/75">
            {communityLinks.map((link) => (
              <Link key={link.href} href={localeHref(locale, link.href)} className="hover:text-accent-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">{t("help")}</h2>
          <div className="mt-4 grid gap-3 text-sm text-accent-foreground/75">
            {helpLinks.map((link) =>
              link.href.endsWith(".txt") ? (
                <a key={link.href} href={link.href} className="hover:text-accent-foreground">
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={localeHref(locale, link.href)} className="hover:text-accent-foreground">
                  {link.label}
                </Link>
              )
            )}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-accent-foreground">
              {SUPPORT_EMAIL}
            </a>
            <a href={SUPPORT_WHATSAPP_LINK} target="_blank" rel="noreferrer" className="hover:text-accent-foreground">
              WhatsApp {SUPPORT_WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-accent-foreground/10">
        <div className="container-content flex flex-col items-center gap-4 py-5 text-sm text-accent-foreground/65 lg:flex-row lg:justify-between">
          <span className="shrink-0 text-center lg:text-left">Copyright 2026 Sicon Art. {t("rights")}</span>
          <div className="flex max-w-xl flex-col items-center gap-2 text-center">
            <PaymentMarks className="justify-center" />
            <p className="text-xs leading-5 text-accent-foreground/80">
              Powered by Clossyan Technologies (Pvt) Ltd
              <span className="mx-1.5">·</span>
              Securely pay with Clossyan Technologies (Pvt) Ltd
            </p>
          </div>
          <span className="shrink-0 text-center lg:text-right">{t("made")}</span>
        </div>
      </div>
    </footer>
  );
}
