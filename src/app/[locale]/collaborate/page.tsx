import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { db } from "@/lib/db";
import { notifyContactSubmission } from "@/lib/email";
import { Button } from "@/components/ui/button";
import { HoneypotFields } from "@/components/forms/honeypot-fields";
import { isBotSubmission, readFormGuard, tooManyRequests } from "@/lib/form-guard";
import { clientKey } from "@/lib/form-guard-server";
import { SUPPORT_EMAIL } from "@/lib/support";
import { absoluteUrl } from "@/lib/site-origin";

export const metadata: Metadata = {
  title: "Collaborate with Sicon Art",
  description: "Enquire about brush demonstrations, workshops, and community event support.",
  alternates: { canonical: absoluteUrl("/collaborate") }
};

export default async function CollaboratePage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ sent?: string; error?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const query = searchParams ? await searchParams : {};

  async function sendCollaboration(formData: FormData) {
    "use server";

    const path = localeHref(locale as Locale, "/collaborate");
    if (isBotSubmission(readFormGuard(formData))) redirect(`${path}?sent=1`);
    if (tooManyRequests(await clientKey("collaborate"))) redirect(`${path}?error=1`);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const country = String(formData.get("country") || "").trim();
    const opportunity = String(formData.get("opportunity") || "").trim();
    const message = String(formData.get("message") || "").trim();
    if (name.length < 2 || !email.includes("@") || message.length < 10) {
      redirect(`${path}?error=1`);
    }

    const payload = {
      name,
      email,
      subject: `Collaboration enquiry: ${opportunity || "event support"}`,
      message: [`Country/city: ${country || "not specified"}`, `Opportunity: ${opportunity || "not specified"}`, "", message].join(
        "\n"
      )
    };
    await db.contactMessage.create({ data: payload });
    await notifyContactSubmission(payload);
    redirect(`${path}?sent=1`);
  }

  return (
    <section className="container-content section-pad">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr]">
        <div>
          <p className="eyebrow">Community</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">Collaborate with Sicon Art</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            We consider brush demonstrations at sketchwalks, artist-led workshops, product trials, and community-event
            support. An enquiry is a request, not an acceptance of sponsorship.
          </p>
          <div className="mt-8 grid gap-3 text-sm font-semibold text-muted-foreground">
            <span>Tell us the event, city, dates, and how brushes would be used.</span>
            <span>Include a public profile or organizer page if you have one.</span>
            <span>
              We reply at {SUPPORT_EMAIL}. We do not promise gifts, fees, or coverage.
            </span>
          </div>
        </div>
        <form action={sendCollaboration} className="grid gap-4 rounded-[0.5rem] border bg-surface p-6">
          <HoneypotFields />
          <label className="text-sm font-semibold">
            Name
            <input required name="name" className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
          </label>
          <label className="text-sm font-semibold">
            Email
            <input required type="email" name="email" className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
          </label>
          <label className="text-sm font-semibold">
            Country and city
            <input name="country" className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
          </label>
          <label className="text-sm font-semibold">
            Opportunity
            <select name="opportunity" className="mt-2 h-11 w-full rounded-[0.5rem] border bg-background px-3">
              <option value="demonstration">Brush demonstration</option>
              <option value="workshop">Workshop</option>
              <option value="trial">Product trial</option>
              <option value="community">Community event support</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            About the event
            <textarea required name="message" rows={6} className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
          </label>
          {query.sent === "1" && <p className="text-sm font-semibold text-primary">Enquiry sent. We will reply by email.</p>}
          {query.error === "1" && (
            <p className="text-sm font-semibold text-red-600">Please complete the required fields and try again shortly.</p>
          )}
          <Button type="submit" className="w-fit">
            Send collaboration enquiry
          </Button>
        </form>
      </div>
    </section>
  );
}
