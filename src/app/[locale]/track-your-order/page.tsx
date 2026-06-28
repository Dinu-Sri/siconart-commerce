import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function TrackYourOrderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <section className="container-content section-pad">
      <article className="max-w-3xl">
        <p className="eyebrow">Order Help</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">Track Your Order</h1>
        <div className="mt-8 grid gap-5 leading-8 text-muted-foreground">
          <p>
            Tracking availability depends on the shipping method chosen. If your shipment includes tracking, tracking
            details will be shared once available.
          </p>
          <p>
            If you cannot find your tracking information, email support@siconart.com with your order number. We will
            check our tracking system and update you promptly.
          </p>
        </div>
      </article>
    </section>
  );
}
