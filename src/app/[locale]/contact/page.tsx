import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { db } from "@/lib/db";
import { notifyContactSubmission } from "@/lib/email";
import { SUPPORT_EMAIL, SUPPORT_WHATSAPP_DISPLAY, SUPPORT_WHATSAPP_LINK } from "@/lib/support";
import { Button } from "@/components/ui/button";

export default async function ContactPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ sent?: string; error?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const query = searchParams ? await searchParams : {};
  const t = await getTranslations("contact");

  async function sendContact(formData: FormData) {
    "use server";

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim()
    };
    if (payload.name.length < 2 || !payload.email.includes("@") || payload.subject.length < 2 || payload.message.length < 10) {
      redirect(`${localeHref(locale as Locale, "/contact")}?error=1`);
    }

    await db.contactMessage.create({ data: payload });
    await notifyContactSubmission(payload);
    redirect(`${localeHref(locale as Locale, "/contact")}?sent=1`);
  }

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
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary">
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p>
              <strong className="text-foreground">WhatsApp:</strong>{" "}
              <a href={SUPPORT_WHATSAPP_LINK} target="_blank" rel="noreferrer" className="text-primary">
                {SUPPORT_WHATSAPP_DISPLAY}
              </a>
            </p>
            <p>
              <strong className="text-foreground">{t("location")}:</strong> Dongguan, Guangdong, China
            </p>
          </div>
        </div>
        <form action={sendContact} className="rounded-[0.5rem] border bg-surface p-6">
          <div className="grid gap-5">
            {["name", "email", "subject"].map((field) => (
              <label key={field} className="grid gap-2 text-sm font-semibold">
                {t(`form.${field}`)}
                <input
                  required
                  name={field}
                  type={field === "email" ? "email" : "text"}
                  className="h-12 rounded-[0.5rem] border bg-background px-4 outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-semibold">
              {t("form.message")}
              <textarea
                required
                name="message"
                minLength={10}
                className="min-h-36 rounded-[0.5rem] border bg-background p-4 outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            {query.sent === "1" && <p className="text-sm font-semibold text-primary">Message sent. We will reply by email.</p>}
            {query.error === "1" && <p className="text-sm font-semibold text-red-600">Please complete all fields and try again.</p>}
            <Button type="submit">{t("form.send")}</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
