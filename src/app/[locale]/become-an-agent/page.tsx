import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { db } from "@/lib/db";
import { notifyAgentLead } from "@/lib/email";
import { Button } from "@/components/ui/button";
import { HoneypotFields } from "@/components/forms/honeypot-fields";
import { isBotSubmission, readFormGuard, tooManyRequests } from "@/lib/form-guard";
import { clientKey } from "@/lib/form-guard-server";
import { pageMeta } from "@/lib/seo/page-meta";

export const metadata: Metadata = pageMeta({
  title: "Become an Agent",
  description: "Enquire about becoming a Sicon Art agent or wholesale partner for handmade Chinese watercolor brushes.",
  path: "/become-an-agent"
});

export default async function BecomeAgentPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ sent?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const query = searchParams ? await searchParams : {};

  async function createLead(formData: FormData) {
    "use server";

    const agentPath = localeHref(locale as Locale, "/become-an-agent");
    if (isBotSubmission(readFormGuard(formData))) redirect(`${agentPath}?sent=1`);
    if (tooManyRequests(await clientKey("agent"))) redirect(`${agentPath}?sent=1`);

    const lead = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      country: String(formData.get("country") || ""),
      company: String(formData.get("company") || ""),
      message: String(formData.get("message") || "")
    };
    await db.agentLead.create({ data: lead });
    await notifyAgentLead(lead);
    redirect(`${agentPath}?sent=1`);
  }

  return (
    <section className="container-content section-pad">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr]">
        <div>
          <p className="eyebrow">Wholesale</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">Become a Sicon Art agent.</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Partner with Sicon Art to supply handcrafted Chinese watercolor brushes to artists, schools, shops, and
            creative communities in your region.
          </p>
          <div className="mt-8 grid gap-3 text-sm font-semibold text-muted-foreground">
            <span>Wholesale brush pricing and regional support</span>
            <span>Worldwide shipping from Dongguan, China</span>
            <span>Small, focused catalog built for easy selling</span>
          </div>
        </div>

        <form action={createLead} className="grid gap-4 rounded-[0.5rem] border bg-surface p-6">
          <HoneypotFields />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Name
              <input required name="name" className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
            </label>
            <label className="text-sm font-semibold">
              Email
              <input
                required
                type="email"
                name="email"
                className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Country
              <input name="country" className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
            </label>
            <label className="text-sm font-semibold">
              Company
              <input name="company" className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
            </label>
          </div>
          <label className="text-sm font-semibold">
            Tell us about your market
            <textarea
              required
              name="message"
              rows={6}
              className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2"
            />
          </label>
          {query.sent === "1" && <p className="text-sm font-semibold text-primary">Request sent. We will email you shortly.</p>}
          <Button type="submit" className="w-fit">
            Send agent request
          </Button>
        </form>
      </div>
    </section>
  );
}
