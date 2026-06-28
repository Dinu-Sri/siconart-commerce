import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations("common");

  return (
    <section className="container-content section-pad">
      <div className="max-w-xl">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold">{t("notFound")}</h1>
        <Button asChild className="mt-8">
          <Link href={localeHref(locale as Locale, "")}>{t("backHome")}</Link>
        </Button>
      </div>
    </section>
  );
}
