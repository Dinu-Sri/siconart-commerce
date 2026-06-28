import Link from "next/link";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { Button } from "@/components/ui/button";

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const t = await getTranslations("cart");

  return (
    <section className="container-content section-pad">
      <div className="max-w-2xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">{t("title")}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{t("empty")}</p>
        <Button asChild className="mt-8">
          <Link href={localeHref(activeLocale, "/shop")}>{t("continue")}</Link>
        </Button>
      </div>
    </section>
  );
}
