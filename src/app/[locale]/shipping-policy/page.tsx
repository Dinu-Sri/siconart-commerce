import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function ShippingPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <section className="container-content section-pad">
      <article className="max-w-3xl">
        <p className="eyebrow">Policies</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">Shipping Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: 21 February 2026</p>
        <div className="mt-8 grid gap-5 leading-8 text-muted-foreground">
          <p>All orders are shipped from Dongguan, China, where our brushes are made and tested before dispatch.</p>
          <p>
            Shipping costs vary by destination country. Your exact shipping price is calculated and shown at checkout
            based on your delivery address whenever available.
          </p>
          <p>
            Orders are typically processed within 2-5 business days, Monday-Friday excluding public holidays. Delivery
            time depends on your country, local courier handling, and customs clearance.
          </p>
          <p>
            If tracking is available, tracking details will be shared once available. For help, email
            support@siconart.com with your order number.
          </p>
          <p>
            Customs duties and import taxes are the customer's responsibility unless checkout explicitly states
            otherwise. Address changes are only possible before the order ships.
          </p>
          <p>
            If your order arrives damaged, email support@siconart.com within 7 days of delivery with your order number
            and clear photos of the packaging and item.
          </p>
        </div>
      </article>
    </section>
  );
}
