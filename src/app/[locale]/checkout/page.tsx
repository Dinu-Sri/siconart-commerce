import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("checkout");

  return (
    <section className="container-content section-pad">
      <div className="max-w-3xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">{t("title")}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{t("body")}</p>
      </div>
    </section>
  );
}
