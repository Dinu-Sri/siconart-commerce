import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("contact");

  return (
    <section className="container-content section-pad">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr]">
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">{t("title")}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{t("subtitle")}</p>
          <div className="mt-8 rounded-[0.5rem] border bg-surface p-6 text-sm leading-7 text-muted-foreground">
            <p>
              <strong className="text-foreground">{t("email")}:</strong>{" "}
              <a href="mailto:support@siconart.com" className="text-primary">
                support@siconart.com
              </a>
            </p>
            <p>
              <strong className="text-foreground">{t("location")}:</strong> Dongguan, Guangdong, China
            </p>
          </div>
        </div>
        <form className="rounded-[0.5rem] border bg-surface p-6">
          <div className="grid gap-5">
            {["name", "email", "subject"].map((field) => (
              <label key={field} className="grid gap-2 text-sm font-semibold">
                {t(`form.${field}`)}
                <input className="h-12 rounded-[0.5rem] border bg-background px-4 outline-none focus:ring-2 focus:ring-primary" />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-semibold">
              {t("form.message")}
              <textarea className="min-h-36 rounded-[0.5rem] border bg-background p-4 outline-none focus:ring-2 focus:ring-primary" />
            </label>
            <button className="h-12 rounded-full bg-primary px-6 font-semibold text-primary-foreground" type="button">
              {t("form.send")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
