import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";

export default async function ReturnPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <PolicyShell title="Return & Exchange Policy" subtitle="Last updated: 21 February 2026">
      <h2>Returns (Change of Mind)</h2>
      <p>
        We accept returns for most items within 30 days of delivery, as long as the item is brand new, unused,
        unwashed, in original packaging, and not tested with water, ink, paint, or cleaning agents.
      </p>
      <p>
        Please email support@siconart.com first. Do not send items back without authorization. Return shipping cost to us
        needs to be borne by the customer.
      </p>
      <h2>Non-Returnable Items</h2>
      <p>
        We do not accept returns for used brushes, final sale or clearance items, gift cards or digital products,
        returns requested after 30 days, or items sent without prior approval.
      </p>
      <h2>Wrong, Damaged, or Defective Items</h2>
      <p>
        Contact us within 7 days of delivery with your order number, clear photos or a short video, and a brief
        description. We will arrange a free replacement, resend, refund, or another appropriate solution.
      </p>
      <h2>Refunds</h2>
      <p>
        Approved refunds are processed after inspection or approval and credited back to the original payment method.
        Bank or card processing times may vary.
      </p>
    </PolicyShell>
  );
}

function PolicyShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="container-content section-pad">
      <article className="prose prose-neutral max-w-3xl">
        <p className="eyebrow">Policies</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">{title}</h1>
        <p className="mt-4 text-muted-foreground">{subtitle}</p>
        <div className="mt-8 grid gap-5 leading-8 text-muted-foreground">{children}</div>
      </article>
    </section>
  );
}
