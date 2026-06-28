import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("faq");
  const items = ["different", "hair", "media", "care", "shipping", "returns"];

  return (
    <section className="container-content section-pad">
      <div className="max-w-3xl">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">{t("title")}</h1>
      </div>
      <div className="mt-10 grid gap-4">
        {items.map((item) => (
          <details key={item} className="rounded-[0.5rem] border bg-surface p-5">
            <summary className="cursor-pointer font-semibold">{t(`${item}.q`)}</summary>
            <p className="mt-4 leading-7 text-muted-foreground">{t(`${item}.a`)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
