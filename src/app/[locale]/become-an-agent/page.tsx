import { revalidatePath } from "next/cache";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function BecomeAgentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  async function createLead(formData: FormData) {
    "use server";

    await db.agentLead.create({
      data: {
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        country: String(formData.get("country") || ""),
        company: String(formData.get("company") || ""),
        message: String(formData.get("message") || "")
      }
    });
    revalidatePath(`/${locale}/become-an-agent`);
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
          <Button type="submit" className="w-fit">
            Send agent request
          </Button>
        </form>
      </div>
    </section>
  );
}
