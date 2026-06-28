import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("about");

  return (
    <section className="container-content section-pad">
      <div className="max-w-3xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">{t("title")}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {["craft", "watercolor", "support"].map((key) => (
          <div key={key} className="rounded-[0.5rem] border bg-surface p-6">
            <h2 className="font-serif text-2xl font-semibold">{t(`${key}.title`)}</h2>
            <p className="mt-4 leading-7 text-muted-foreground">{t(`${key}.body`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
